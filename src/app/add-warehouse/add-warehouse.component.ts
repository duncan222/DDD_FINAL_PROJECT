import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-warehouse',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './add-warehouse.component.html',
  styleUrl: './add-warehouse.component.css'
})
export class AddWarehouseComponent {

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  address: string = '';

  cancel(): void {
    this.router.navigateByUrl('/staff-home');
  }

  save(): void {
    this.http.post<any>('http://localhost:3000/api/warehouse', { address: this.address }).subscribe(
        (response) => {
          console.log('Warehouse added', response);
          this.router.navigateByUrl('/staff-home');
        },
        (error) => {
          console.error('Error', error);
        }
    )
  }
}
