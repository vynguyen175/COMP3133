import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeAdd } from './components/employee-add/employee-add';
import { EmployeeEdit } from './components/employee-edit/employee-edit';
import { EmployeeView } from './components/employee-view/employee-view';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'employees', component: EmployeeList, canActivate: [authGuard] },
  { path: 'employees/add', component: EmployeeAdd, canActivate: [authGuard] },
  { path: 'employees/edit/:id', component: EmployeeEdit, canActivate: [authGuard] },
  { path: 'employees/view/:id', component: EmployeeView, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
