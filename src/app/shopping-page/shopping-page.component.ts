import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shopping-page',
  standalone: true,
  imports: [],
  templateUrl: './shopping-page.component.html',
  styleUrl: './shopping-page.component.css'
})
export class ShoppingPageComponent implements OnInit{

  message: string = 'stuff';
  items: any[] = [];




  // boiler plate. app may be small enough that we done need an external service file. could be wrong tho. 
  getItems(): void{ 
    this.http.get<any[]>('/api/items').subscribe(
      (response) => { 
        this.items = response; 
      }, 
      (error) => { 
        console.error('Error', error); 
      }
    )
    
  }

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      
  }

}
