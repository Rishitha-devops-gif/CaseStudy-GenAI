import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <h1>Digital Art Portal</h1>
      </div>
      <div class="nav-links">
        <ng-container *ngIf="authService.currentUser$ | async as user; else loginLinks">
          <span>Welcome, {{ user.username }}!</span>
          <button (click)="logout()" class="btn btn-outline">Logout</button>
        </ng-container>
        <ng-template #loginLinks>
          <a routerLink="/login" class="nav-link">Login</a>
          <a routerLink="/register" class="nav-link">Register</a>
        </ng-template>
      </div>
    </nav>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 1rem 2rem; 
      background: #343a40; 
      color: white; 
    }
    .nav-brand h1 { margin: 0; }
    .nav-links { display: flex; align-items: center; gap: 1rem; }
    .nav-link { color: white; text-decoration: none; padding: 0.5rem 1rem; }
    .nav-link:hover { background: rgba(255,255,255,0.1); border-radius: 4px; }
    .btn { padding: 0.5rem 1rem; border: 1px solid white; background: transparent; color: white; cursor: pointer; border-radius: 4px; }
    .btn:hover { background: white; color: #343a40; }
    .main-content { min-height: calc(100vh - 80px); }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}