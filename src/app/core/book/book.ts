import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './book.html',
  styleUrl: './book.scss'
})
export class BookComponent {

}
