import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidgetsRoutingModule } from './widgets-routing.module';
import { StaticWidgetsComponent } from './static-widgets/static-widgets.component';
import { DataWidgetsComponent } from './data-widgets/data-widgets.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [StaticWidgetsComponent, DataWidgetsComponent],
  imports: [
    CommonModule,
    WidgetsRoutingModule,
    NgbModule,
    ChartsModule

  ]
})
export class WidgetsModule { }
