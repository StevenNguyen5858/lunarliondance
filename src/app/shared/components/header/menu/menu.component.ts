import { Component, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() width: string = '100px';  // Default width of the toggle
  @Input() height: string = '100px'; // Default height of the toggle

  isSidebarOpen = false;
  menuItems: { label: string; route: string }[] = [];
  activeRoute: string = '';

  // Inside your MenuComponent
  iconMap: { [route: string]: string } = {
    '/home': 'home',
    '/instagram': 'home',
    // Add more routes and their corresponding icons
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.loadRoutes();

    // Subscribe to router events to track active route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects;
      }
    });
  }

  loadRoutes() {
    const routes = this.router.config;
    this.menuItems = routes
      .filter(route => route.path && route.path !== '**') // Skip the wildcard route
      .map(route => ({
        label: this.formatLabel(route.path || ''),
        route: '/' + (route.path || ''),
      }));
  }

  formatLabel(path: string): string {
    return path
      .split('-')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  toggleSidebar(event: MouseEvent) {
    event.stopPropagation();
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.isSidebarOpen = false; // Close sidebar after navigation
  }

  // Check if the route is active
  isActive(route: string): boolean {
    return this.activeRoute === route;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const clickedInside = (event.target as HTMLElement).closest('.sidebar') !== null;
    if (!clickedInside && this.isSidebarOpen) {
      this.isSidebarOpen = false;
    }
  }

  getIconForRoute(route: string): string {
    return this.iconMap[route] || 'help'; // Default icon is 'help'
  }

  goToUrl(url: string){
    window.open(url, '_blank');
  }
}
