import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-process-order',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './process-order.component.html',
  styleUrl: './process-order.component.css'
})
export class ProcessOrderComponent {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) {}

  orderid: number = 0;
  order: any = {
    status: '',
    deliverplanid: 0,
    deliverytype: '',
    deliveryprice: 0,
    deliverydate: '',
    shipdate: '',
    cardnumber: '',
    customerid: 0
  };

  ngOnInit(): void {
    this.orderid = Number(this.route.snapshot.params['orderid']);
    this.getOrderInfo(this.orderid);
  }

  getOrderInfo(orderid: number): void {
    this.http.get<any>(`http://localhost:3000/api/orders/${orderid}`).subscribe(
      (response) => {
        this.order = response;
      },
      (error) => {
        console.error('Error fetching order info', error);
      }
    );
  }

  cancel(): void {
    this.router.navigateByUrl('/staff-home');
  }

  save(): void {
    this.http.put<any>(`http://localhost:3000/api/orders/${this.orderid}`, { status: this.order.status, deliveryplanid: this.order.deliveryplanid, deliverytype: this.order.deliverytype, 
      deliveryprice: this.order.deliveryprice, deliverydate: this.order.deliverydate, shipdate: this.order.shipdate, cardnumber: this.order.cardnumber, customerid: this.order.customerid}).subscribe(
        (response) => {
          console.log('Order updated', response);
          this.router.navigateByUrl('/staff-home');
        },
        (error) => {
          console.error('Error', error);
        }
    );
  }
}
