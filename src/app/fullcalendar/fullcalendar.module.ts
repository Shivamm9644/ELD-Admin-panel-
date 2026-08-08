import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullcalendarComponent } from './fullcalendar.component';
import { FullcalendarRoutingModule } from './fullcalendar-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FullcalendarRoutingModule,
    NgbModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  declarations: [FullcalendarComponent],
  exports: [FullcalendarComponent]
})
export class FullcalendarModule {}
