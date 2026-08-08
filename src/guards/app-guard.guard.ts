import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuardGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

   
  //   console.log('Route: ', route.data.roles); 
  //   console.log('state: ', state); 

  //   let currentUser;
  //   this.utility.getCurrentUser().then((user) => {
  //     currentUser = user;
  //   });

  //   return this.auth.isAuthenticate().then((isValid) => {
  //     console.log('IsValid: ', isValid);
      
  //     console.log('User: ', currentUser); 
  //     // if (this.utility.loggedIn() && isValid && route.data.roles.indexOf(currentUser.role) != -1) {
  //     if (this.utility.loggedIn() && isValid) {
  //       return true;
  //     } else {
  //       this.router.navigate(['/auth/signin'], { queryParams: { returnUrl: state.url } });
  //       return false;
  //     }
  //   });
  // }

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      // console.log("Login");
      return true;
    } else {
      this.router.navigate(['/auth/signin']);
      return false;
    }
  }
  
}
