import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContentPagesRoutingModule } from './content-pages-routing.module';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { Error4Component } from './error4/error4.component';
import { Error3Component } from './error3/error3.component';
import { Error500Component } from './error500/error500.component';
import { ClientLoginComponent } from './client-login/client-login.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [ComingSoonComponent, Error4Component, Error3Component, Error500Component,ClientLoginComponent],
  imports: [
    CommonModule,
    ContentPagesRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ContentPagesModule { }
