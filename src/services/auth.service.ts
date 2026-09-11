import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  // Login
  async authUser(credentials) {
    return this.http.post(environment.apiBaseUrl + '/auth/login', credentials);
  }
// for portal Login
  async authUserWebAccess(credentials) {
    return this.http.post(environment.apiBaseUrl + '/auth/login_web', credentials);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!(token && token !== 'null' && token !== 'undefined' && token.trim() !== '' && token !== '""');
  }

  getUserTypeId(): number {
    return Number(localStorage.getItem('userTypeId'));
  }

  isUserType3(): boolean {
    return this.getUserTypeId() === 3;
  }
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.clear();
  }
}
