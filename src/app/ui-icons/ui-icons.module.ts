import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiIconsRoutingModule } from './ui-icons-routing.module';

import { FontAwesomeComponent } from './font-awesome/font-awesome.component';
import { MaterialDesignComponent } from './material-design/material-design.component';
import { ThemifyComponent } from './themify/themify.component';
import { LineIconsComponent } from './line-icons/line-icons.component';

@NgModule({
  declarations: [
    FontAwesomeComponent,
    MaterialDesignComponent,
    ThemifyComponent,
    LineIconsComponent
  ],
  imports: [
    CommonModule,
    UiIconsRoutingModule,
    NgbModule
  ]
})
export class UiIconsModule { }
