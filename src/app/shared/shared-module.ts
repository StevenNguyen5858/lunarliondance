import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './components/template.component/template.component';
import { HeaderComponent } from './components/header/header.component';
import { TitleContainerComponent } from './components/title-container/title-container.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    ],
  imports: [
    CommonModule,
    TemplateComponent,
    HeaderComponent,
    FooterComponent,
    TitleContainerComponent,
  ],
  exports: [
    TemplateComponent,
    HeaderComponent,
    FooterComponent,
    TitleContainerComponent,
    ]
})
export class SharedModule { }
