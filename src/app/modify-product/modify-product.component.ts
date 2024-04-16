import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modify-product',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './modify-product.component.html',
  styleUrl: './modify-product.component.css'
})
export class ModifyProductComponent {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) {}

  productId: number = 0;
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

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.params['productId']);
    this.getProductInfo(this.productId);
  }

  getProductInfo(productId: number): void {
    this.http.get<any>(`http://localhost:3000/api/product/${productId}`).subscribe(
      (response) => {
        // Assign the product info to the product variable
        this.product = response;
      },
      (error) => {
        console.error('Error fetching product info', error);
      }
    );
  }

  cancel(): void {
    this.router.navigateByUrl('/staff-home');
  }

  save(): void {
    this.http.put<any>(`http://localhost:3000/api/product/${this.productId}`, { name: this.product.name, category: this.product.category, type: this.product.type, 
      brand: this.product.brand, size: this.product.size, description: this.product.description, price: this.product.price, quantity: this.product.quantity}).subscribe(
        (response) => {
          console.log('Product updated', response);
          this.router.navigateByUrl('/staff-home');
        },
        (error) => {
          console.error('Error', error);
        }
    );
  }
}
