import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Email:</label>
          <input type="email" formControlName="email" class="form-control">
          <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error">
            Valid email is required
          </div>
        </div>
        
        <div class="form-group">
          <label>Password:</label>
          <input type="password" formControlName="password" class="form-control">
          <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error">
            Password is required
          </div>
        </div>
        
        <button type="submit" [disabled]="loginForm.invalid" class="btn btn-primary">Login</button>
        <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
      </form>
    </div>
  `,
  styles: [`
    .login-container { max-width: 400px; margin: 50px auto; padding: 20px; }
    .form-group { margin-bottom: 15px; }
    .form-control { width: 100%; padding: 8px; margin-top: 5px; }
    .btn { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
    .btn:disabled { background: #ccc; }
    .error { color: red; font-size: 12px; margin-top: 5px; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/artworks']),
        error: (error) => this.errorMessage = error.error?.error || 'Login failed'
      });
    }
  }
}