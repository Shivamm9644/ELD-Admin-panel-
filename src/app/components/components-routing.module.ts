import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarouselComponent } from './carousel/carousel.component';
import { GridLayoutsComponent } from './grid-layouts/grid-layouts.component';
import { SwitchComponent } from './switch/switch.component';
import { PricingTableComponent } from './pricing-table/pricing-table.component';
import { VerticalTimelineComponent } from './vertical-timeline/vertical-timeline.component';
import { HorizontalTimelineComponent } from './horizontal-timeline/horizontal-timeline.component';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { CollapseComponent } from './collapse/collapse.component';
import { DropdownComponent } from './dropdown/dropdown.component';



const routes: Routes = [
  {
    path: '',
    children: [     
      {
        path: 'carousel',
        component: CarouselComponent,
        data: {
          title: 'Carousel'
        }
      },
      {
        path: 'grid-layouts',
        component: GridLayoutsComponent,
        data: {
          title: 'Grid Layouts'
        }
      },
      {
        path: 'switch',
        component: SwitchComponent,
        data: {
          title: 'switch'
        }
      },
      {
        path: 'pricing-table',
        component: PricingTableComponent,
        data: {
          title: 'Pricing Table'
        }
      },
      {
        path: 'vertical-timeline',
        component: VerticalTimelineComponent,
        data: {
          title: 'Vertical Timeline'
        }
      },
      {
        path: 'horizontal-timeline',
        component: HorizontalTimelineComponent,
        data: {
          title: 'Horizontal Timeline'
        }
      },
      {
        path: 'color-palette',
        component: ColorPaletteComponent,
        data: {
          title: 'Color Palette'
        }
      },
      {
        path: 'collapse',
        component: CollapseComponent,
        data: {
          title: 'Collapse'
        }
      },
      {
        path: 'dropdown',
        component: DropdownComponent,
        data: {
          title: 'dropdown'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
