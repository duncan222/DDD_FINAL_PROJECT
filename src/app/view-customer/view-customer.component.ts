import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-customer',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './view-customer.component.html',
  styleUrl: './view-customer.component.css'
})
export class ViewCustomerComponent {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) {}

  customerId: number = 0;
  addressId: number = 0;
  customer: any = {
    name: '',
    balance: 0
  }
  addresses: any = {
    paymentaddress: '',
    deliveryaddress: ''
  }

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.params['customerid']);
    this.getCustomerInfo(this.customerId);
  }

  getCustomerInfo(customerid: number): void {
    this.http.get<any>(`http://localhost:3000/api/customer/id/${customerid}`).subscribe(
        (response) => {
          this.customer.name = response.name;
          this.customer.balance = response.balance;
          this.addressId = response.customeraddressid;
          this.getAddresses(this.addressId);
        },
        (error) => {
          console.error('Error fetching staff info', error);
        }
      );
  }

  getAddresses(addressid: number): void {
    this.http.get<any>(`http://localhost:3000/api/addresses/id/${addressid}`).subscribe(
        (response) => {
          this.addresses.paymentaddress = response.paymentaddress;
          this.addresses.deliveryaddress = response.deliveryaddress;
        },
        (error) => {
          console.error('Error fetching staff info', error);
        }
      );
  }

  goBack(): void {
    this.router.navigateByUrl('/staff-home');
  }
}
