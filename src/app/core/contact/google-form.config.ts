export const CONTACT_GOOGLE_FIELD_KEYS = [
  'name',
  'email',
  'phone',
  'reason',
  'message',
  'eventType',
  'performanceType',
  'currentAge'
] as const;

export type ContactGoogleFieldKey = (typeof CONTACT_GOOGLE_FIELD_KEYS)[number];

export interface GoogleContactFormConfig {
  formResponseUrl: string;
  fieldEntries: Record<ContactGoogleFieldKey, string>;
}

export const GOOGLE_CONTACT_FORM_CONFIG: GoogleContactFormConfig = {
  // Replace with your Google Form endpoint:
  // https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
  formResponseUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdoFg8ZNILWdvDNXmYPUlc7-Mfjyv6kf3f8nUWURZD3ijS3kQ/formResponse',
  fieldEntries: {
    name: 'entry.1530096906',
    email: 'entry.268029106',
    phone: 'entry.705708038',
    reason: 'entry.1624330226',
    message: 'entry.1268301356',
    eventType: 'entry.1595496186',
    performanceType: 'entry.1889051963',
    currentAge: 'entry.788123000'
  }
};
