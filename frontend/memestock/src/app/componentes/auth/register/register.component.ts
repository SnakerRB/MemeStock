import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../servicios/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.email, this.password)
      .then(() => this.router.navigate(['/dashboard']))
      .catch(err => this.error = err.message);
  }
}
