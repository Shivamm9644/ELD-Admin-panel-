import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const rawToken = localStorage.getItem('auth_token');
    let token: string | null = null;
    if (rawToken && rawToken !== 'null' && rawToken !== 'undefined' && rawToken !== '""') {
      token = rawToken.replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '').trim();
      if (!token || token === 'null' || token === 'undefined') {
        token = null;
      }
    }

    // Check if the request is a public login/auth API
    const isLoginEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/login_web');

    // Check if request is to external third-party service
    const isExternal = (req.url.startsWith('http://') || req.url.startsWith('https://')) &&
                       !req.url.startsWith(environment.apiBaseUrl);

    const setHeaders: { [key: string]: string } = {};

    if (!isExternal) {
      setHeaders['X-Requested-With'] = 'XMLHttpRequest';
    }

    if (token && !isLoginEndpoint && !isExternal) {
      setHeaders['Authorization'] = `Bearer ${token}`;
    }

    const authReq = Object.keys(setHeaders).length > 0 ? req.clone({ setHeaders }) : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isLoginEndpoint) {
          localStorage.removeItem('auth_token');
          this.router.navigate(['/auth/signin']);
        }
        return throwError(error);
      })
    );
  }
}