import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { Signin1Component } from './signin1/signin1.component';
import { Signup1Component } from './signup1/signup1.component';
import { Signin2Component } from './signin2/signin2.component';
import { Signup2Component } from './signup2/signup2.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { ResetPassword1Component } from './reset-password1/reset-password1.component';
import { ResetPassword2Component } from './reset-password2/reset-password2.component';
import { AutoLoginComponent } from './auto-login/auto-login.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'auto-login',
        component: AutoLoginComponent,
        data: {
          title: 'Auto Login'
        }
      },
      {
        path: 'signin',
        component: SigninComponent,
        data: {
          title: 'SignIn'
        }
      },
      {
        path: 'signin1',
        component: Signin1Component,
        data: {
          title: 'SignIn 1'
        }
      },
      {
        path: 'signup1',
        component: Signup1Component,
        data: {
          title: 'SignUp 1'
        }
      },
      {
        path: 'signin2',
        component: Signin2Component,
        data: {
          title: 'SignIn 2'
        }
      },
      {
        path: 'signup2',
        component: Signup2Component,
        data: {
          title: 'SignUp 2'
        }
      },
      {
        path: 'lock-screen',
        component: LockScreenComponent,
        data: {
          title: 'Lock Screen'
        }
      },
      {
        path: 'reset-password1',
        component: ResetPassword1Component,
        data: {
          title: 'Reset Password 1'
        }
      },
      {
        path: 'reset-password2',
        component: ResetPassword2Component,
        data: {
          title: 'Reset Password 2'
        }
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
