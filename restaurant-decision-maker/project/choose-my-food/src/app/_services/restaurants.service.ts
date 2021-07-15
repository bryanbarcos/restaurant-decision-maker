import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

const baseUrl = 'http://localhost:3000/api';

export class Restaurant {
  constructor(
    public tags: string[],
    public name: string
  ) {

  }
}

@Injectable({
  providedIn: 'root'
})

export class RestaurantsService {

  constructor(private http: HttpClient) { }

  restaurants!: Restaurant[];

  getRestaurants(user: any): any{
    let params = new HttpParams().append('username', user);
    this.http.get<any>(baseUrl + '/getRestaurants', {params: params}).subscribe(
      response => {

        this.restaurants = response;     
      }
    )
  }


}
