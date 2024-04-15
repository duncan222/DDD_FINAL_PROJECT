import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseRoleComponent } from './choose-role/choose-role.component';
import { CustomerSignupComponent } from './customer-signup/customer-signup.component';
import { StaffSignupComponent } from './staff-signup/staff-signup.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { StaffLoginComponent } from './staff-login/staff-login.component';
import { ShoppingPageComponent } from './shopping-page/shopping-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/choose-role', pathMatch: 'full' },
    { path: 'choose-role', component: ChooseRoleComponent},
    { path: 'customer-signup', component: CustomerSignupComponent},
    { path: 'staff-signup', component: StaffSignupComponent},
    { path: 'customer-login', component: CustomerLoginComponent},
    { path: 'staff-login', component: StaffLoginComponent},
    { path: 'shopping', component: ShoppingPageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
