import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-staff',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule],
  templateUrl: './edit-staff.component.html',
  styleUrl: './edit-staff.component.css'
})
export class EditStaffComponent {

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private authService: AuthService) {}

  staffid: number | null = 0;
  staff: any = {
    name: '',
    address: '',
    salary: '',
    jobtitle: ''
  }

  ngOnInit(): void {
    this.staffid = this.authService.getLoggedInUserId();
    this.getStaffDetail(this.staffid);
  }

  getStaffDetail(staffid: number | null): void {
    if (staffid !== null) {
      console.log(staffid);
      this.http.get<any>(`http://localhost:3000/api/staff/id/${staffid}`).subscribe(
        (response) => {
          this.staff = response;
        },
        (error) => {
          console.error('Error fetching staff info', error);
        }
      );
    } else {
      console.error('Invalid staffid:', staffid);
    }
  }

  cancel(): void {
    this.router.navigateByUrl('/staff-home');
  }

  save(): void {
    this.http.put<any>(`http://localhost:3000/api/staff/id/${this.staffid}`, { name: this.staff.name, address: this.staff.address, salary: this.staff.salary, jobtitle: this.staff.jobtitle }).subscribe(
        (response) => {
          console.log('Staff updated', response);
          this.router.navigateByUrl('/staff-home');
        },
        (error) => {
          console.error('Error', error);
        }
    );
  }
}
