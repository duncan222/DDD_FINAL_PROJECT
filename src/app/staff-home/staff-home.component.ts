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
  customers: any[] = [];
  orders: any[] = [];

  ngOnInit(): void {
    this.getProducts();
    this.getWarehouses();
    this.getCustomers();
    this.getOrders();
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
      (warehouses) => {
        this.warehouses = warehouses;
        for (const warehouse of warehouses) {
          this.http.get<any>(`http://localhost:3000/api/totalstock/id/${warehouse.warehouseid}`).subscribe(
            (response) => {
              warehouse.totalstock = response.totalstock;
            },
            (error) => {
              if (error.status === 404) {
                warehouse.totalstock = 0;
              } else {
                console.error('Error', error);
              }
            }
          );
        }
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

  getOrders(): void {
    this.http.get<any[]>('http://localhost:3000/api/orders').subscribe(
      (orders) => {
        this.orders = orders;
        for (const order of orders) {
          this.http.get<any>(`http://localhost:3000/api/order_products/id/${order.orderid}`).subscribe(
            (response) => {
              order.productid = response.productid;
              order.quantity = response.quantity;
            },
            (error) => {
              console.error("Error:", error);
            }
          );
        }
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
        console.log('Product deleted from product successfully');
        window.location.reload();
      },
      (error) => {
        console.error('Error deleting product', error);
      }
    );
  }

  deleteFromProductStock(productId: number): void {
    this.http.delete<any>(`http://localhost:3000/api/productstock/${productId}`).subscribe(
      () => {
        console.log('Product deleted from product stock successfully');
        //refresh
        this.deleteProduct(productId);
      },
      (error) => {
        console.error('Error deleting product', error);
      }
    );
  }

  addStock(warehouseid: number): void {
    this.router.navigate(['/add-stock', warehouseid]);
  }

  seeCustomerDetails(customerid: number): void {
    this.router.navigate(['/view-customer', customerid]);
  }

  processOrder(orderid: number): void {
    this.router.navigate(['/process-order', orderid]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/choose-role');
  }

  editStaffAccount(): void {
    this.router.navigateByUrl('/edit-staff');
  }
}
