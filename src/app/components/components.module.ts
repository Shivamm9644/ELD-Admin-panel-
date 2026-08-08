import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UiSwitchModule } from 'ngx-ui-switch';
import { TagInputModule } from 'ngx-chips';


import { ComponentsRoutingModule } from './components-routing.module';

import { CarouselComponent } from './carousel/carousel.component';
import { GridLayoutsComponent } from './grid-layouts/grid-layouts.component';
import { SwitchComponent } from './switch/switch.component';
import { PricingTableComponent } from './pricing-table/pricing-table.component';
import { VerticalTimelineComponent } from './vertical-timeline/vertical-timeline.component';
import { HorizontalTimelineComponent } from './horizontal-timeline/horizontal-timeline.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { CollapseComponent } from './collapse/collapse.component';
import { DropdownComponent } from './dropdown/dropdown.component';


@NgModule({
  declarations: [
    CarouselComponent,
    GridLayoutsComponent,
    SwitchComponent,
    PricingTableComponent,
    VerticalTimelineComponent,
    HorizontalTimelineComponent,
    ColorPaletteComponent,
    CollapseComponent,
    DropdownComponent,
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModule, 
    UiSwitchModule,
    HttpClientModule,
    TagInputModule
  ]

})
export class ComponentsModule { }
