import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  product: any = {
    name: '',
    category: '',
    type: '',
    brand: '',
    size: '',
    description: '',
    price: 0,
    quantity: 0
  };

  cancel(): void {
    this.router.navigateByUrl('/staff-home');
  }

  save(): void {
    this.http.post<any>('http://localhost:3000/api/product', { name: this.product.name, category: this.product.category, type: this.product.type, 
      brand: this.product.brand, size: this.product.size, description: this.product.description, price: this.product.price, quantity: this.product.quantity }).subscribe(
        (response) => {
          console.log('Product added', response);
          this.router.navigateByUrl('/staff-home');
        },
        (error) => {
          console.error('Error', error);
        }
    )
  }
}
