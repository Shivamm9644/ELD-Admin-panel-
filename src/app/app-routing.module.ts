import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";

const routes: Routes = [
  // {
  //   path: '',
  //   // redirectTo: 'dashboard/ecommerce-v1',
  //   redirectTo: 'form/dispatch',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    // redirectTo: 'dashboard/ecommerce-v1',
    redirectTo: 'auth/signin',
    pathMatch: 'full',
  },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  // { path: '**', redirectTo: 'dashboard/ecommerce-v1' }
  // { path: '**', redirectTo: 'form/dispatch' }
  { path: '**', redirectTo: 'auth/signin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
