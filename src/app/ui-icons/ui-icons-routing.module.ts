import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FontAwesomeComponent } from './font-awesome/font-awesome.component';
import { MaterialDesignComponent } from './material-design/material-design.component';
import { ThemifyComponent } from './themify/themify.component';
import { LineIconsComponent } from './line-icons/line-icons.component';

const routes: Routes = [
  {
    path: '',
    children: [          
      {
        path: 'font-awesome-icon',
        component: FontAwesomeComponent,
        data: {
          title: 'Font Awesome icon'
        }
      },
      {
        path: 'material-design',
        component: MaterialDesignComponent,
        data: {
          title: 'Material Design'
        }
      }, 
      {
        path: 'themify',
        component: ThemifyComponent,
        data: {
          title: 'Themify'
        }
      },  
      {
        path: 'line-icons',
        component: LineIconsComponent,
        data: {
          title: 'Line Icons'
        }
      },   
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UiIconsRoutingModule { }
