import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-signup',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './customer-signup.component.html',
  styleUrl: './customer-signup.component.css'
})
export class CustomerSignupComponent {
  name: string = '';
  paymentaddress: string = '';
  deliveryaddress: string = '';
  customerId: number = 0;
  uniqueAddressId: number = 0;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  createAccount(): void {
    this.createAddress();
  }

  createAddress():void {
    this.http.post<any>('http://localhost:3000/api/addresses', { paymentaddress: this.paymentaddress, deliveryaddress: this.deliveryaddress }).subscribe(
      (response) => {
        console.log('Customer address registration successfull', response);
        this.uniqueAddressId = response.uniqueaddressid;
        this.createCustomer();
      },
      (error) => {
        console.error('Error', error);
      }
    )
  }

  createCustomer():void {
    this.http.post<any>('http://localhost:3000/api/customer', { name: this.name, balance: 0, customeraddressid: this.uniqueAddressId}).subscribe(
      (response) => {
        console.log('Customer registration successfull', response);
        this.customerId = response.customerid;
        this.authService.setLoggedInUserId(this.customerId);
        this.router.navigateByUrl('/shopping');
      },
      (error) => {
        console.error('Error', error);
      }
    )
  }
}
