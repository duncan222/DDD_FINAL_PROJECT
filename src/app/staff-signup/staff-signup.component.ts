import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-staff-signup',
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterModule],
  templateUrl: './staff-signup.component.html',
  styleUrl: './staff-signup.component.css'
})
export class StaffSignupComponent {
  name: string = '';
  address: string = '';
  salary: number = 0;
  jobtitle: string = '';
  staffId: number = 0;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  createAccount(): void {
    this.http.post<any>('http://localhost:3000/api/staff', { name: this.name, address: this.address, salary: this.salary, jobtitle: this.jobtitle}).subscribe(
      (response) => {
        console.log('Staff registration successfull', response);
        this.staffId = response.staffid;
        this.authService.setLoggedInUserId(this.staffId);
        this.router.navigateByUrl('/staff-home');
      },
      (error) => {
        console.error('Error', error);
      }
    )
  }
}
