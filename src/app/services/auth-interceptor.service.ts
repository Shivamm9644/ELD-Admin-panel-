import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    const publicEndpoints = [
      '/auth/',
      '/master/',
      '/dispacth/',
      '/service/'
    ];
    // const isPublic = req.url.includes('/auth/login_web') || req.url.includes('/register');
    const isPublic = publicEndpoints.some(endpoint =>
      req.url.startsWith(environment.apiBaseUrl + endpoint)
    );
    if (token && !isPublic) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Outgoing request:', cloned);
      return next.handle(cloned);
    }
    // console.log(' >> Outgoing request:', req);
    return next.handle(req);
  }
}