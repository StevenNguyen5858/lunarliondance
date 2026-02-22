import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CONTACT_GOOGLE_FIELD_KEYS,
  GOOGLE_CONTACT_FORM_CONFIG,
  type ContactGoogleFieldKey
} from './google-form.config';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent implements OnInit {
  private readonly notAvailableValue = 'N/A';
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly googleFormConfig = GOOGLE_CONTACT_FORM_CONFIG;
  private readonly requiredGoogleFields = CONTACT_GOOGLE_FIELD_KEYS;

  readonly reasons = [
    { value: 'event-booking', label: 'Event Booking' },
    { value: 'joining-team', label: 'Joining the Team' },
    { value: 'other', label: 'Other' }
  ];

  readonly eventTypes = [
    { value: 'store-blessing', label: 'Store Blessing' },
    { value: 'festival', label: 'Festival' },
    { value: 'wedding', label: 'Wedding' },
    { value: 'school-event', label: 'School Event' },
    { value: 'company-event', label: 'Company Event' },
    { value: 'other', label: 'Other' }
  ];

  readonly performanceTypes = [
    { value: 'festival-drum-showcase', label: 'Festival Drum Showcase' },
    { value: 'lion-dance', label: 'Lion Dance' },
    { value: 'other', label: 'Other' }
  ];

  submitAttempted = false;
  isSubmitting = false;
  submitSuccessMessage = '';
  submitErrorMessage = '';

  readonly contactForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    reason: ['', [Validators.required]],
    message: [''],
    eventType: [''],
    performanceType: [''],
    currentAge: ['']
  });

  ngOnInit(): void {
    this.contactForm.get('reason')?.valueChanges.subscribe(() => this.syncDynamicValidators());
    this.contactForm.get('eventType')?.valueChanges.subscribe(() => this.syncDynamicValidators());
    this.contactForm.get('performanceType')?.valueChanges.subscribe(() => this.syncDynamicValidators());

    this.route.queryParamMap.subscribe(params => {
      const reason = params.get('reason');
      const eventType = params.get('eventType');
      const performanceType = params.get('performanceType');

      const patch: Record<string, string> = {};

      if (reason && this.reasons.some(option => option.value === reason)) {
        patch['reason'] = reason;
      }

      if (eventType && this.eventTypes.some(option => option.value === eventType)) {
        patch['eventType'] = eventType;
      }

      if (performanceType && this.performanceTypes.some(option => option.value === performanceType)) {
        patch['performanceType'] = performanceType;
      }

      if (Object.keys(patch).length > 0) {
        this.contactForm.patchValue(patch, { emitEvent: false });
      }

      this.syncDynamicValidators();
    });

    this.syncDynamicValidators();
  }

  isEventBooking(): boolean {
    return this.contactForm.get('reason')?.value === 'event-booking';
  }

  isJoiningTeam(): boolean {
    return this.contactForm.get('reason')?.value === 'joining-team';
  }

  hasError(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!control && control.invalid && (this.submitAttempted || control.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting) {
      return;
    }

    this.submitAttempted = true;
    this.syncDynamicValidators();

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitSuccessMessage = '';
    this.submitErrorMessage = '';
    this.isSubmitting = true;

    if (!this.isBrowser) {
      this.isSubmitting = false;
      return;
    }

    try {
      await this.submitToGoogleForm();
      this.contactForm.reset();
      this.submitAttempted = false;
      this.syncDynamicValidators();
      this.submitSuccessMessage = 'Thanks. Your form was submitted successfully.';
    } catch (error) {
      if (error instanceof Error && error.message === 'GOOGLE_FORM_NOT_CONFIGURED') {
        this.submitErrorMessage = 'Google Form is not configured yet. Please finish entry ID mapping first.';
      } else {
        this.submitErrorMessage = 'Submission failed. Please try again in a moment.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  private syncDynamicValidators(): void {
    this.clearDynamicValidators();

    if (this.isEventBooking()) {
      this.require('eventType');
      this.require('performanceType');
    }

    if (this.isJoiningTeam()) {
      this.require('currentAge');
    }

    this.refreshDynamicControls();
  }

  private clearDynamicValidators(): void {
    const dynamicControls = [
      'eventType',
      'performanceType',
      'currentAge'
    ];

    dynamicControls.forEach(controlName => {
      const control = this.contactForm.get(controlName);
      control?.clearValidators();
    });
  }

  private require(controlName: string): void {
    this.contactForm.get(controlName)?.setValidators([Validators.required]);
  }

  private refreshDynamicControls(): void {
    const controls = [
      'eventType',
      'performanceType',
      'currentAge'
    ];

    controls.forEach(controlName => {
      this.contactForm.get(controlName)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private async submitToGoogleForm(): Promise<void> {
    if (!this.isGoogleFormConfigured()) {
      throw new Error('GOOGLE_FORM_NOT_CONFIGURED');
    }

    const payload = this.buildGoogleFormPayload();

    await fetch(this.googleFormConfig.formResponseUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: payload.toString()
    });
  }

  private isGoogleFormConfigured(): boolean {
    const hasValidFormUrl = /^https:\/\/docs\.google\.com\/forms\/d\/e\/[^/]+\/formResponse$/.test(
      this.googleFormConfig.formResponseUrl
    );

    const hasValidRequiredEntryIds = this.requiredGoogleFields.every(key =>
      /^entry\.\d+$/.test(this.googleFormConfig.fieldEntries[key] ?? '')
    );

    return hasValidFormUrl && hasValidRequiredEntryIds;
  }

  private buildGoogleFormPayload(): URLSearchParams {
    const fieldValues = this.buildGoogleFieldValues();
    const payload = new URLSearchParams();

    CONTACT_GOOGLE_FIELD_KEYS.forEach(key => {
      const entryId = this.googleFormConfig.fieldEntries[key];
      if (!entryId || !/^entry\.\d+$/.test(entryId)) {
        return;
      }

      payload.append(entryId, fieldValues[key]);
    });

    return payload;
  }

  private buildGoogleFieldValues(): Record<ContactGoogleFieldKey, string> {
    const form = this.contactForm.getRawValue();
    const reasonLabel = this.getLabel(this.reasons, form.reason ?? '');
    const eventTypeLabel = this.getLabel(this.eventTypes, form.eventType ?? '');
    const performanceTypeLabel = this.getLabel(this.performanceTypes, form.performanceType ?? '');

    return {
      name: this.normalizeValue(form.name),
      email: this.normalizeValue(form.email),
      phone: this.normalizeValue(form.phone),
      reason: this.normalizeValue(reasonLabel),
      message: this.normalizeValue(form.message),
      // Keep choice fields blank when not applicable to avoid Google enum validation failures.
      eventType: this.normalizeValue(eventTypeLabel, ''),
      performanceType: this.normalizeValue(performanceTypeLabel, ''),
      currentAge: this.normalizeValue(form.currentAge)
    };
  }

  private normalizeValue(value: unknown, emptyFallback = this.notAvailableValue): string {
    if (value === null || value === undefined) {
      return emptyFallback;
    }

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : emptyFallback;
  }

  private getLabel(options: { value: string; label: string }[], value: string): string {
    return options.find(option => option.value === value)?.label ?? value;
  }
}
