import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesRoutingModule } from './tables-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BasicComponent } from './basic/basic.component';
import { ResponsiveComponent } from './responsive/responsive.component';

@NgModule({
  declarations: [
    BasicComponent,
    ResponsiveComponent
  ],
  imports: [
    CommonModule,
    TablesRoutingModule,
    NgbModule
  ]
})
export class TablesModule { }
