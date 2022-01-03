import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:3000/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  currentUser!: string;

  constructor(private http: HttpClient) { }

  registerUser(data: any): Observable<any> {
    return this.http.post(baseUrl + '/auth/signup', data, httpOptions);
  }

  login(data: any): Observable<any> {
    return this.http.post(baseUrl + '/auth/signin', data, httpOptions);
  }
 
  validateUserNotTaken(username: any): Observable<any> {
    let params = new HttpParams().append('username', username)
    return this.http.get(baseUrl + '/auth/checkUsernameTaken', {params: params});
  }

}

