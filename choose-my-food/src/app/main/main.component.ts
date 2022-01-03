import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RestaurantsService } from '../_services/restaurants.service';
import { AuthService } from '../_services/auth.service';


const baseUrl = 'http://localhost:3000/api';


export class Restaurant {
  constructor(
    public tags: Tags[],
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

  userData !: {
    "username": string,
    "name": string,
    "tags": Tags[]
  }

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private authService: AuthService,
    private restaurantService: RestaurantsService
  ) {  }

  ngOnInit() {
    this.restaurants = this.getRestaurants(this.authService.currentUser);
    console.log(this.authService.currentUser);
  }

  getRestaurants(user: any): any{
    let params = new HttpParams().append('username', user);
    this.http.get<any>(baseUrl + '/getRestaurants', {params: params}).subscribe(
      response => {

        this.restaurants = response; 
        console.log(response);    
      }
    )
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddRestaurantDialog, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.getRestaurants(this.authService.currentUser);

    });
  }

  onDelete(restaurant: Restaurant) {
    this.userData = {
      username: this.authService.currentUser,
      name: restaurant.name,
      tags: restaurant.tags
    }
    this.restaurantService.deleteRestaurant(this.userData).subscribe(
      res => {
        this.getRestaurants(this.authService.currentUser);
      },
      err => {
      }
    )

  }

}

export interface Tags {
  value: string;
}

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'add-restaurant-dialog',
  templateUrl: 'add-restaurant-dialog.html',
  styleUrls: ['./main.component.css']

})
export class AddRestaurantDialog {

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tags[] = [];
  newRestaurant!: string;
  change_me!: {
    "tags": Tags[],
    "name": string,
    "username": string
  }

  constructor(
    private restaurantService: RestaurantsService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<AddRestaurantDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Tags) {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add tag
    if (value) {
      this.tags.push({value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }
  remove(tags: Tags): void {
    const index = this.tags.indexOf(tags);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onSubmit() {
    this.change_me = {
      "tags": this.tags, 
      "name": this.newRestaurant, 
      "username": this.authService.currentUser
    };
    this.restaurantService.addRestaurant(this.change_me).subscribe(
      res => {
        console.log("very nice");
      },
      err => {
        console.log("failed");
      }
    )


  }

}
