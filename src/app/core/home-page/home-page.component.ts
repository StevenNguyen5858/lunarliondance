import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  imports: [SharedModule],
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
