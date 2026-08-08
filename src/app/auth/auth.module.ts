import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './signin/signin.component';
import { Signin1Component } from './signin1/signin1.component';
import { Signup1Component } from './signup1/signup1.component';
import { Signin2Component } from './signin2/signin2.component';
import { Signup2Component } from './signup2/signup2.component';
import { LockScreenComponent } from './lock-screen/lock-screen.component';
import { ResetPassword1Component } from './reset-password1/reset-password1.component';
import { ResetPassword2Component } from './reset-password2/reset-password2.component';
import { AutoLoginComponent } from './auto-login/auto-login.component';

@NgModule({
  declarations: [
    SigninComponent, 
    Signin1Component, 
    Signup1Component, 
    Signin2Component, 
    Signup2Component,
    LockScreenComponent, 
    ResetPassword1Component, 
    ResetPassword2Component, 
    AutoLoginComponent, 
   ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule
  ]
})
export class AuthModule { }
