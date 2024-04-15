import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseRoleComponent } from './choose-role/choose-role.component';
import { CustomerSignupComponent } from './customer-signup/customer-signup.component';
import { StaffSignupComponent } from './staff-signup/staff-signup.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { StaffLoginComponent } from './staff-login/staff-login.component';
import { ShoppingPageComponent } from './shopping-page/shopping-page.component';
import { StaffHomeComponent } from './staff-home/staff-home.component';
import { AddProductComponent } from './add-product/add-product.component';

export const routes: Routes = [
    { path: '', redirectTo: '/choose-role', pathMatch: 'full' },
    { path: 'choose-role', component: ChooseRoleComponent},
    { path: 'customer-signup', component: CustomerSignupComponent},
    { path: 'staff-signup', component: StaffSignupComponent},
    { path: 'customer-login', component: CustomerLoginComponent},
    { path: 'staff-login', component: StaffLoginComponent},
    { path: 'shopping', component: ShoppingPageComponent},
    { path: 'staff-home', component: StaffHomeComponent},
    { path: 'add-product', component: AddProductComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
