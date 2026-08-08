import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'; 
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const header = new HttpHeaders({
  'content-type': 'application/json',
});

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private http: HttpClient) { }

  async get(endPoint) {
    return new Promise((resolve, reject) => {
      this.http.get(environment.apiBaseUrl + endPoint).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  authPost(endPoint, body): Observable<any> {
    // API Services
    return this.http.post<any>(environment.apiBaseUrl + endPoint, body, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  async post(endPoint, body) {
    return new Promise((resolve, reject) => {
      this.http.post(environment.apiBaseUrl + endPoint, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  async put(endPoint, body) {
    return new Promise((resolve, reject) => {
      this.http.put(environment.apiBaseUrl + endPoint, body).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  async delete(endPoint) {
    return new Promise((resolve, reject) => {
      this.http.delete(environment.apiBaseUrl + endPoint).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  // Error Handling
  handleError(error) {
    let errorMessage = {};
    if (error.error instanceof ErrorEvent) {
      // Client-side Error Handle
      errorMessage = {
        message: error.error.message
      };
    } else {
      // Server-side Error Handle
      errorMessage = {
        error: error.status,
        message: error.error ? error.error.message : error.message
      };
    }
    return throwError(errorMessage);
  }
}
