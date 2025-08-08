import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-navbar *ngIf="isAuthenticated"></app-navbar>
      <div class="main-content" [class.with-navbar]="isAuthenticated">
        <app-sidebar *ngIf="isAuthenticated"></app-sidebar>
        <div class="content-area" [class.with-sidebar]="isAuthenticated">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .main-content {
      flex: 1;
      display: flex;
    }
    
    .main-content.with-navbar {
      margin-top: 64px;
    }
    
    .content-area {
      flex: 1;
      padding: 20px;
      background-color: #f8f9fa;
    }
    
    .content-area.with-sidebar {
      margin-left: 250px;
    }
    
    @media (max-width: 768px) {
      .content-area.with-sidebar {
        margin-left: 0;
      }
    }
  `]
})
export class AppComponent {
  isAuthenticated = false;

  constructor() {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    this.isAuthenticated = !!token;
  }
} 