import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullPagesRoutingModule } from './full-pages-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InvoiceComponent } from './invoice/invoice.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { BlankComponent } from './blank/blank.component';

@NgModule({
  declarations: [
    InvoiceComponent,
    UserProfileComponent,
    BlankComponent
 ],
  imports: [
    CommonModule,
    FullPagesRoutingModule,
    NgbModule
  ]
})
export class FullPagesModule { }
