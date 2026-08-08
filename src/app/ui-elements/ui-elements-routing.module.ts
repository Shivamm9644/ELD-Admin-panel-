import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsComponent } from './cards/cards.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { TabsetComponent } from './tabset/tabset.component';
import { AccordionComponent } from './accordion/accordion.component';
import { ModalsComponent } from './modals/modals.component';
import { ListGroupsComponent } from './list-groups/list-groups.component';
import { BsElementsComponent } from './bs-elements/bs-elements.component';
import { TagInputComponent } from './tag-input/tag-input.component';
import { PaginationComponent } from './pagination/pagination.component';
import { AlertsComponent } from './alerts/alerts.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ToastrComponent } from './toastr/toastr.component';
import { SweetAlertsComponent } from './sweet-alerts/sweet-alerts.component';
import { NavTabsComponent } from './nav-tabs/nav-tabs.component';
import { TypographyComponent } from './typography/typography.component';


const routes: Routes = [
  {
    path: '',
    children: [    
      {
        path: 'cards',
        component: CardsComponent,
        data: {
          title: 'Cards'
        }
      },
      {
        path: 'buttons',
        component: ButtonsComponent,
        data: {
          title: 'Buttons'
        }
      },
      {
        path: 'nav-tabs',
        component: NavTabsComponent,
        data: {
          title: 'Nav Tabs'
        }
      },
      {
        path: 'tabset',
        component: TabsetComponent,
        data: {
          title: 'Tabset'
        }
      },
      {
        path: 'accordion',
        component: AccordionComponent,
        data: {
          title: 'Accordion'
        },
      },
      {
        path: 'modals',
        component: ModalsComponent,
        data: {
          title: 'Modals'
        },
      },  
      {
        path: 'list-groups',
        component: ListGroupsComponent,
        data: {
          title: 'List Groups'
        },
      },  
      {
        path: 'bs-elements',
        component: BsElementsComponent,
        data: {
          title: 'BS Elements'
        },
      },   
      {
        path: 'tag-input',
        component: TagInputComponent,
        data: {
          title: 'Tag Input'
        },
      },      
      {
        path: 'pagination',
        component: PaginationComponent,
        data: {
          title: 'pagination'
        },
      },       
      {
        path: 'alerts',
        component: AlertsComponent,
        data: {
          title: 'Alerts'
        },
      },         
      {
        path: 'progress-bar',
        component: ProgressBarComponent,
        data: {
          title: 'Progress Bar'
        },
      },          
      {
        path: 'toastr',
        component: ToastrComponent,
        data: {
          title: 'Toastr'
        },
      },           
      {
        path: 'sweet-alerts',
        component: SweetAlertsComponent,
        data: {
          title: 'Sweet Alerts'
        },
      },   
      {
        path: 'typography',
        component: TypographyComponent,
        data: {
          title: 'Typography'
        }
      } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UIElementsRoutingModule { }
