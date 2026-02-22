import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

interface MediaPoolManifest {
  images: string[];
}

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit, OnDestroy {
  private readonly mediaManifestPath = 'assets/mediapool/manifest.json';
  private readonly refreshIntervalMs = 5000;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private refreshTimerId: number | null = null;

  mediaImages: string[] = [];
  expandedImage: string | null = null;

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    void this.loadMediaPoolImages();
    this.refreshTimerId = window.setInterval(() => {
      void this.loadMediaPoolImages();
    }, this.refreshIntervalMs);
  }

  ngOnDestroy(): void {
    if (this.refreshTimerId !== null) {
      window.clearInterval(this.refreshTimerId);
      this.refreshTimerId = null;
    }
  }

  openExpandedImage(imagePath: string): void {
    this.expandedImage = imagePath;
  }

  closeExpandedImage(): void {
    this.expandedImage = null;
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeExpandedImage();
    }
  }

  private async loadMediaPoolImages(): Promise<void> {
    try {
      const response = await fetch(`${this.mediaManifestPath}?t=${Date.now()}`, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        this.mediaImages = [];
        return;
      }

      const manifest = (await response.json()) as MediaPoolManifest;
      this.mediaImages = Array.isArray(manifest.images) ? manifest.images : [];
      if (this.expandedImage && !this.mediaImages.includes(this.expandedImage)) {
        this.expandedImage = null;
      }
    } catch {
      this.mediaImages = [];
      this.expandedImage = null;
    }
  }
}
