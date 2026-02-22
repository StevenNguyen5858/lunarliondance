import { Routes } from '@angular/router';
import { HomePageComponent } from '../core/home-page/home-page.component';
import { BookComponent } from '../core/book/book';
import { ContactComponent } from '../core/contact/contact';

export const routes: Routes = [
    {path: 'home', redirectTo: '', pathMatch: 'full'},
    {path: 'book', component: BookComponent},
    {path: 'contact', component: ContactComponent},
    { path: '', component: HomePageComponent },
    {path: '**', redirectTo: ''},
];
