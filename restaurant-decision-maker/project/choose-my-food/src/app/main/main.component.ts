import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogActions, MatDialogContainer, MatDialogContent } from '@angular/material/dialog';

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
    private http: HttpClient,
    public dialog: MatDialog
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

  openDialog() {
    const dialogRef = this.dialog.open(AddRestaurantDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'add-restaurant-dialog',
  templateUrl: 'add-restaurant-dialog.html',
})
export class AddRestaurantDialog {}
