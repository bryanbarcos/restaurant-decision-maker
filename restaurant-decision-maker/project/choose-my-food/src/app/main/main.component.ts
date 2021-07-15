import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { RestaurantsService } from '../_services/restaurants.service';
//import { Restaurant } from '../_services/restaurants.service';

const baseUrl = 'http://localhost:3000/api';


export class Restaurant {
  constructor(
    public tags: string[],
    public name: string
  ) {

  }
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public restaurants!: Restaurant[]

  constructor(
    private restaurantService: RestaurantsService,
    private http: HttpClient
  ) {  }

  ngOnInit() {
    this.restaurants = this.getRestaurants('natasha');
  }

  getRestaurants(user: any): any{
    let params = new HttpParams().append('username', user);
    this.http.get<any>(baseUrl + '/getRestaurants', {params: params}).subscribe(
      response => {

        this.restaurants = response;     
      }
    )
  }

}
