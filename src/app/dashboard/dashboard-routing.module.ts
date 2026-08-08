import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EcommerceV1Component } from './ecommerce-v1/ecommerce-v1.component';
import { EcommerceV2Component } from './ecommerce-v2/ecommerce-v2.component';
import { HumanResourcesComponent } from './human-resources/human-resources.component';
import { DigitalMarketingComponent } from './digital-marketing/digital-marketing.component';
import { PropertyListingComponent } from './property-listing/property-listing.component';
import { ServiceSupportComponent } from './service-support/service-support.component';
import { HealthcareComponent } from './healthcare/healthcare.component';
import { LogisticsComponent } from './logistics/logistics.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ecommerce-v1',
        component: EcommerceV1Component,
        data: {
          title: 'E-Commerce V1'
        }
      },
      {
        path: 'ecommerce-v2',
        component: EcommerceV2Component,
        data: {
          title: 'E-Commerce V2'
        }
      },
      {
        path: 'human-resources',
        component: HumanResourcesComponent,
        data: {
          title: 'Human Resources'
        }
      },
      {
        path: 'digital-marketing',
        component: DigitalMarketingComponent,
        data: {
          title: 'Digital Marketing'
        }
      },
      {
        path: 'property-listings',
        component: PropertyListingComponent,
        data: {
          title: 'Property Listing'
        }
      },
      {
        path: 'services-support',
        component: ServiceSupportComponent,
        data: {
          title: 'Service Support'
        }
      },
      {
        path: 'healthcare',
        component: HealthcareComponent,
        data: {
          title: 'Healthcare'
        }
      },
      {
        path: 'logistics',
        component: LogisticsComponent,
        data: {
          title: 'Logistics'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
