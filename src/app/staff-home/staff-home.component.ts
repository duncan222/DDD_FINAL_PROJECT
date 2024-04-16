import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-home',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './staff-home.component.html',
  styleUrl: './staff-home.component.css'
})
export class StaffHomeComponent {

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  products: any[] = [];
  warehouses: any[] = [];
  warehousestock: number = 0;
  customers: any[] = [];

  ngOnInit(): void {
    this.getProducts();
    this.getWarehouses();
    this.getCustomers();
  }

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

  getWarehouses(): void {
    this.http.get<any[]>('http://localhost:3000/api/warehouse').subscribe(
      (response) => {
        this.warehouses = response;
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  getCustomers(): void {
    this.http.get<any[]>('http://localhost:3000/api/customer').subscribe(
      (response) => {
        this.customers = response;
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  addProduct(): void {
    this.router.navigateByUrl('/add-product');
  }

  addWarehouse(): void {
    this.router.navigateByUrl('/add-warehouse');
  }

  modifyProduct(productId: number): void {
    this.router.navigate(['/modify-product', productId]);
  }

  deleteProduct(productId: number): void {
    this.http.delete<any>(`http://localhost:3000/api/product/${productId}`).subscribe(
      () => {
        console.log('Product deleted successfully');
        //refresh
        window.location.reload();
      },
      (error) => {
        console.error('Error deleting product', error);
      }
    );
  }

  modifyStock(warehouseid: number): void {

  }

  seeCustomerDetails(customerid: number): void {
    
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/choose-role');
  }

  editStaffAccount(): void {
    this.router.navigateByUrl('/edit-staff');
  }
}
