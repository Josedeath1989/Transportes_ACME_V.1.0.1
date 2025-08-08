import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VehicleListComponent } from './components/vehicles/vehicles-list/vehicle-list.component';
import { VehicleFormComponent } from './components/vehicles/vehicles-form/vehicle-form.component';
import { ConductorListComponent } from './components/conductors/conductor-list/conductor-list.component';
import { ConductorFormComponent } from './components/conductors/conductor-form/conductor-form.component';
import { PropietarioListComponent } from './components/propietarios/propietario-list/propietario-list.component';
import { PropietarioFormComponent } from './components/propietarios/propietario-form/propietario-form.component';
import { ReportsComponent } from './components/reports/reports.component';

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
    path: 'vehicles/new', 
    component: VehicleFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'vehicles/edit/:id', 
    component: VehicleFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'conductors', 
    component: ConductorListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'conductors/new', 
    component: ConductorFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'conductors/edit/:id', 
    component: ConductorFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'propietarios', 
    component: PropietarioListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'propietarios/new', 
    component: PropietarioFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'propietarios/edit/:id', 
    component: PropietarioFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports', 
    component: ReportsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
