import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly emailLink = 'mailto:lunarlionofficial@gmail.com';
  readonly instagramLink = 'https://www.instagram.com/lunarliondance?igsh=MW9iMnU3eTJzMXc%3D&utm_source=qr';
  readonly youtubeLink = 'https://www.youtube.com/@lunarliondance';
}
