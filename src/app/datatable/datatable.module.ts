import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DatatableRoutingModule } from './datatable-routing.module';

import { DTBasicComponent } from './basic/dt-basic.component';
import { DTFullScreenComponent } from './fullscreen/dt-fullscreen.component';
import { DTEditingComponent } from './editing/dt-editing.component';
import { DTFilterComponent } from './filter/dt-filter.component';
import { DTPagingComponent } from './paging/dt-paging.component';
import { DTPinningComponent } from './pinning/dt-pinning.component';
import { DTSelectionComponent } from './selection/dt-selection.component';
import { DTSortingComponent } from './sorting/dt-sorting.component';

@NgModule({
  declarations: [
    DTBasicComponent,
    DTFullScreenComponent,
    DTEditingComponent,
    DTFilterComponent,
    DTPagingComponent,
    DTPinningComponent,
    DTSelectionComponent,
    DTSortingComponent
  ],
  imports: [
    CommonModule,
    DatatableRoutingModule,
    NgbModule,
    NgxDatatableModule
  ]
})
export class DatatableModule { }
