import { Component, HostListener, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly router = inject(Router);

  isScrolled = false;
  isHomeRoute = false;

  readonly emailLink = 'mailto:lunarlionofficial@gmail.com';
  readonly instagramLink = 'https://www.instagram.com/lunarliondance?igsh=MW9iMnU3eTJzMXc%3D&utm_source=qr';
  readonly youtubeLink = 'https://www.youtube.com/@lunarliondance';

  constructor() {
    this.updateRouteState(this.router.url);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateRouteState(event.urlAfterRedirects);
      }
    });

    this.onWindowScroll();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = this.isBrowser && window.scrollY > 24;
  }

  private updateRouteState(url: string): void {
    const path = url.split('?')[0].split('#')[0];
    this.isHomeRoute = path === '' || path === '/' || path === '/home';
  }
}
