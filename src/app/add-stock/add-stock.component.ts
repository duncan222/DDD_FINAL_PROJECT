import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './add-stock.component.html',
  styleUrl: './add-stock.component.css'
})
export class AddStockComponent {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) {}

  warehouseid: number = 0;
  productid: number = 0;

  ngOnInit(): void {
    this.warehouseid = Number(this.route.snapshot.params['warehouseid']);
  }

  onSave(): void {
    this.http.post<any>('http://localhost:3000/api/productstock', { warehouseid: this.warehouseid, productid: this.productid}).subscribe(
      (response) => {
        console.log('Stock update successfull', response);
        this.router.navigateByUrl('/staff-home');
      },
      (error) => {
        console.error('Error', error);
      }
    )
  }

  onCancel(): void {
    this.router.navigateByUrl('staff-home');
  }
}
