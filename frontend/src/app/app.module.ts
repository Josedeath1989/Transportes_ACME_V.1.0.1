import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Third party modules
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VehicleListComponent } from './components/vehicles/vehicles-list/vehicle-list.component';
import { VehicleFormComponent } from './components/vehicles/vehicles-form/vehicle-form.component';
import { ConductorListComponent } from './components/conductors/conductor-list/conductor-list.component';
import { ConductorFormComponent } from './components/conductors/conductor-form/conductor-form.component';
import { PropietarioListComponent } from './components/propietarios/propietario-list/propietario-list.component';
import { PropietarioFormComponent } from './components/propietarios/propietario-form/propietario-form.component';
import { ReportsComponent } from './components/reports/reports.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { ModalComponent } from './components/shared/modal/modal.component';

// Services
import { AuthService } from './auth.service';
import { ApiService } from './services/api.service';
import { VehicleService } from './services/vehicle.service';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './auth.interceptor';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'vehicles', 
    component: VehicleListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'conductors', 
    component: ConductorListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'propietarios', 
    component: PropietarioListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'reports', 
    component: ReportsComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    VehicleListComponent,
    VehicleFormComponent,
    ConductorListComponent,
    ConductorFormComponent,
    PropietarioListComponent,
    PropietarioFormComponent,
    ReportsComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    
    // Third party modules
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxSpinnerModule
  ],
  providers: [
    AuthService,
    ApiService,
    VehicleService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
