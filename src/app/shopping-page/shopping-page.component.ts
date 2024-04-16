import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-shopping-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './shopping-page.component.html',
  styleUrl: './shopping-page.component.css'
})
export class ShoppingPageComponent implements OnInit{

  message: string = 'stuff';
  products: any[] = [];
  types: any[] = []; 
  category: any[] = [];



  // boiler plate. app may be small enough that we done need an external service file. could be wrong tho. 

  getProducts(): void {
    this.http.get<any[]>('http://localhost:3000/api/product').subscribe(
      (response) => {
        this.products = response;
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }


  //make an interface that stores both the category and an array of objects to go with it. 

  sortProducts(): void { 
    this.products.forEach(product => { 
      const categories = product.category; 
      const type = product.type;

      if(!this.types.includes(type)){
        this.types.push(type);
      }
      if(!this.category.includes(categories)){
        this.types.push(categories);
      }  });
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

      this.getProducts(); 
  }

}
