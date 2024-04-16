import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { BrowserModule } from '@angular/platform-browser';


interface categoryType {
  category: string;
  types: string[]; 
}

interface cartItem { 
  productID: number; 
  size: string;
  tile: string; 
  brand: string;
  quantity: number; 
  price: number; 
}

@Component({
  selector: 'app-shopping-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './shopping-page.component.html',
  styleUrl: './shopping-page.component.css'
})
export class ShoppingPageComponent implements OnInit{

  
  message: string = 'stuff';
  products: any[] = [];
  categories: categoryType[] = [];
  cartTotal: number = 0; 
  shoppingCart: cartItem[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = "";
  c_validity: boolean = true; 
  t_validity: boolean = true;


  getProducts(): void {
    this.http.get<any[]>('http://localhost:3000/api/product').subscribe(
      (response) => {
        this.products = response;
        this.filteredProducts = this.products;
        this.sortProducts(); 
        console.log(this.categories);
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }


  filterProducts() {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1
    );
  }

  AddToCart(new_item: any): void{ 
    if(this.shoppingCart.some(item => item.productID === new_item.productid)){
      const index = this.shoppingCart.find(item => item.productID === new_item.productid); 
      if(index?.price != undefined && index?.quantity != undefined){
        index.price = parseFloat((Number(index.price) + Number(new_item.price)).toFixed(2)); 
        index.quantity += 1; 
      }
    }
    else{
      this.shoppingCart.push({ 
        productID: new_item.productid, 
        size: new_item.size,
        tile: new_item.name,
        brand: new_item.brand,
        quantity: 1,
        price: Number(new_item.price)
      });
    }
    this.cartTotal = Number((this.cartTotal + Number(new_item.price)).toFixed(2));
  }

  isCategoryValid(category: any): boolean{ 
    if(this.filteredProducts.some(item => item.category == category.category)){ 
      
      return true;
    }
    else{
      return false;
    }
  }

  isTypeValid(type: any): boolean{ 
    if(this.filteredProducts.some(item => item.type == type)){ 
      return true;
    }
    else{
      return false;
    }
  }

  RemoveFromCart(old_item: any): void{ 
    if(old_item.quantity == 1){
      this.shoppingCart = this.shoppingCart.filter(item => item.productID != old_item.productID);
      this.cartTotal = Number((this.cartTotal - Number(old_item.price)).toFixed(2));
    }
    else{ 
      const indexCart = this.shoppingCart.find(item => item.productID === old_item.productID); 
      const indexProduct = this.products.find(item => item.productid === old_item.productID); 
      if(indexCart?.price != undefined && indexCart?.quantity != undefined){
        indexCart.price = parseFloat((Number(old_item.price) - Number(indexProduct.price)).toFixed(2)); 
        indexCart.quantity -= 1; 
      }    
      this.cartTotal = Number((this.cartTotal -  Number(indexProduct.price)).toFixed(2));
    }
  }

  //make an interface that stores both the category and an array of objects to go with it. 

  sortProducts(): void { 
    this.products.forEach(product => { 
      if(!this.categories.some(category => category.category === product.category)){
        this.categories.push({category: product.category, types: [product.type]});
      }  
      else{
        const index = this.categories.find(category => category.category === product.category);
        if(!index?.types.includes(product.type)){
          index?.types.push(product.type);
        }
      }
    });
  }

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
      this.getProducts(); 
  }

}
