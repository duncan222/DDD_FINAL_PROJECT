import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-role',
  standalone: true,
  imports: [],
  templateUrl: './choose-role.component.html',
  styleUrl: './choose-role.component.css'
})
export class ChooseRoleComponent {
  constructor(private router: Router) {}

  redirectToStaffLogin(): void {
    this.router.navigateByUrl('/staff-signup');
  }

  redirectToCustomerLogin(): void {
    this.router.navigateByUrl('/customer-signup');
  }
}
