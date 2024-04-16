import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule, RouterModule],
  templateUrl: './staff-login.component.html',
  styleUrl: './staff-login.component.css'
})
export class StaffLoginComponent {
  name: string = '';
  staffId: number = 0;
  errormessage: string = '';

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) {}

  login(): void {
    this.http.get<any>(`http://localhost:3000/api/staff/${this.name}`).subscribe(
      (response) => {
        this.errormessage = '';
        this.authService.setLoggedInUserId(response.staffid);
        this.router.navigateByUrl('/staff-home');
      },
      (error) => {
        console.error('Error fetching staff members', error);
        this.errormessage = 'Error: Staff member not found';
      }
    );
  }
}
