import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullcalendarComponent } from './fullcalendar.component';

const routes: Routes = [
  {
    path: '',
     component: FullcalendarComponent,
    data: {
      title: 'Calendar'
    },
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FullcalendarRoutingModule { }
