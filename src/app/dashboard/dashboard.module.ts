import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { EcommerceV1Component } from './ecommerce-v1/ecommerce-v1.component';
import { EcommerceV2Component } from './ecommerce-v2/ecommerce-v2.component';
import { HumanResourcesComponent } from './human-resources/human-resources.component';
import { DigitalMarketingComponent } from './digital-marketing/digital-marketing.component';
import { PropertyListingComponent } from './property-listing/property-listing.component';
import { LogisticsComponent } from './logistics/logistics.component';
import { ServiceSupportComponent } from './service-support/service-support.component';
import { HealthcareComponent } from './healthcare/healthcare.component';




@NgModule({
    imports: [
        CommonModule,
        DashboardRoutingModule,
        NgbModule,
        ChartsModule
    ],
    exports: [],
    declarations: [
        HumanResourcesComponent,
        DigitalMarketingComponent,
        PropertyListingComponent,
        LogisticsComponent,
        ServiceSupportComponent,
        EcommerceV1Component,
        EcommerceV2Component,
        HealthcareComponent
    ],
    providers: [],
})
export class DashboardModule { }
