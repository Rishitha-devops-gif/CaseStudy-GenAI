import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Username:</label>
          <input type="text" formControlName="username" class="form-control">
          <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched" class="error">
            Username is required
          </div>
        </div>
        
        <div class="form-group">
          <label>Email:</label>
          <input type="email" formControlName="email" class="form-control">
          <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="error">
            Valid email is required
          </div>
        </div>
        
        <div class="form-group">
          <label>Password:</label>
          <input type="password" formControlName="password" class="form-control">
          <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="error">
            Password must be at least 6 characters
          </div>
        </div>
        
        <div class="form-group">
          <label>Role:</label>
          <select formControlName="role" class="form-control">
            <option value="artist">Artist</option>
            <option value="curator">Curator</option>
          </select>
        </div>
        
        <button type="submit" [disabled]="registerForm.invalid" class="btn btn-primary">Register</button>
        <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
        <div *ngIf="successMessage" class="success">{{ successMessage }}</div>
      </form>
    </div>
  `,
  styles: [`
    .register-container { max-width: 400px; margin: 50px auto; padding: 20px; }
    .form-group { margin-bottom: 15px; }
    .form-control { width: 100%; padding: 8px; margin-top: 5px; }
    .btn { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
    .btn:disabled { background: #ccc; }
    .error { color: red; font-size: 12px; margin-top: 5px; }
    .success { color: green; font-size: 12px; margin-top: 5px; }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['artist', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Please login.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (error) => this.errorMessage = error.error?.error || 'Registration failed'
      });
    }
  }
}