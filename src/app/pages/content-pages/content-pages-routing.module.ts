import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { Error3Component } from './error3/error3.component';
import { Error500Component } from './error500/error500.component';
import { Error4Component } from './error4/error4.component';
import { ClientLoginComponent } from './client-login/client-login.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'client-login',
        component: ClientLoginComponent,
        data: {
          title: 'Client Login'
        }
      },
      {
        path: 'coming-soon',
        component: ComingSoonComponent,
        data: {
          title: 'Coming Soon'
        }
      },
      {
        path: 'error-403',
        component: Error3Component,
        data: {
          title: 'Error 403'
        }
      },
      {
        path: 'error-404',
        component: Error4Component,
        data: {
          title: 'Error 404'
        }
      },
      {
        path: 'error-500',
        component: Error500Component,
        data: {
          title: 'Error 500'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentPagesRoutingModule { }
