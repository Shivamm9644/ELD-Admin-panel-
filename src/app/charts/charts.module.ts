import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts'

import { ChartsRoutingModule } from './charts-routing.module';

import { ChartjsComponent } from './chartjs/chartjs.component';
import { ApexChartsComponent } from './apex-charts/apex-charts.component';
import { SparklineChartsComponent } from './sparkline-charts/sparkline-charts.component';
import { OtherChartsComponent } from './other-charts/other-charts.component';
import { PeityChartsComponent } from './peity-charts/peity-charts.component'

@NgModule({
  declarations: [
    ChartjsComponent,
    ApexChartsComponent,
    SparklineChartsComponent,
    OtherChartsComponent,
    PeityChartsComponent
  ],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    NgbModule,
    ChartsModule,
  ]
})
export class ChartsNg2Module { }
