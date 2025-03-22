import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/auth/login/login.component';
import { RegisterComponent } from './componentes/auth/register/register.component';
import { DashboardComponent } from './componentes/pages/dashboard/dashboard.component';
import { HomeComponent } from './componentes/pages/home/home.component';
import { AuthGuard } from './guards/auth_guard/authguard.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
];
