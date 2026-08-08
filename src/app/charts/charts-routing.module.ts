import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartjsComponent } from './chartjs/chartjs.component';
import { ApexChartsComponent } from './apex-charts/apex-charts.component';
import { SparklineChartsComponent } from './sparkline-charts/sparkline-charts.component';
import { OtherChartsComponent } from './other-charts/other-charts.component';
import { PeityChartsComponent } from './peity-charts/peity-charts.component';

const routes: Routes = [
  {
    path: '',
    children: [  
      {
        path: 'chartjs',
        component: ChartjsComponent,
        data: {
          title: 'Chart JS'
        }
      }, 
      {
        path: 'apex-charts',
        component: ApexChartsComponent,
        data: {
          title: 'Apex Charts'
        }
      },     
      
      {
        path: 'sparkline-charts',
        component: SparklineChartsComponent,
        data: {
          title: 'Sparkline Charts'
        }
      },   
      {
        path: 'peity-charts',
        component: PeityChartsComponent,
        data: {
          title: 'Peity Charts'
        }
      },   
      
      {
        path: 'other-charts',
        component: OtherChartsComponent,
        data: {
          title: 'Other Charts'
        }
      },     
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartsRoutingModule { }
