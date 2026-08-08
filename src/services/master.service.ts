import { environment } from '../environments/environment'; 
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestService } from '../services/request.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(
    private http: HttpClient,
    private request : RequestService,
    private router : Router
    ) { }

    private jsonUrl = 'assets/file/editingFile.json'; // Path to JSON file
    getJsonData(): Observable<any> {
      return this.http.get<any>(this.jsonUrl).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            console.error('JSON file not found.');
            return of(null); // Return null if file doesn't exist
          } else {
            return throwError(() => new Error('An error occurred while fetching JSON data.'));
          }
        })
      );
    }

}
