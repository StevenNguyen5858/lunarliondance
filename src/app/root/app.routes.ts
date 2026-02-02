import { Routes } from '@angular/router';
import { HomePageComponent } from '../core/home-page/home-page.component';

export const routes: Routes = [
    {path: 'home', component: HomePageComponent},
    { path: '', component: HomePageComponent },
    {path: '**', redirectTo: ''},
];
