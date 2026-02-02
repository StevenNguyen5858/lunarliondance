import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './components/template.component/template.component';
import { HeaderComponent } from './components/header/header.component';
import { TitleContainerComponent } from './components/title-container/title-container.component';

@NgModule({
  declarations: [
    ],
  imports: [
    CommonModule,
    TemplateComponent,
    HeaderComponent,
    TitleContainerComponent,
  ],
  exports: [
    TemplateComponent,
    HeaderComponent,
    TitleContainerComponent,
    ]
})
export class SharedModule { }
