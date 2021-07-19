import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:3000/api';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class RestaurantsService {

  constructor(private http: HttpClient) { }

  addRestaurant(data: any): Observable<any> {
    //let params = new HttpParams().append('username', data);
    return this.http.post(baseUrl + '/addRestaurantWithTags', data, httpOptions);
  }

  deleteRestaurant(data: any): Observable<any> {
    console.log(data);
    return this.http.post(baseUrl + '/deleteRestaurant', data, httpOptions);

  }

}
