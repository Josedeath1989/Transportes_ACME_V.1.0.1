import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { VehicleService } from '../../../services/vehicle.service';
import { ConductorService } from '../../../services/conductor.service';
import { PropietarioService } from '../../../services/propietario.service';
import { Vehicle } from '../../../models/vehicle.model';
import { Conductor } from '../../../models/conductor.model';
import { Propietario } from '../../../models/propietario.model';
import { ApiResponse } from '../../../models/api-response.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isActive = false;
  userName = 'Usuario';
  userRole = 'Administrador';
  
  stats = {
    vehicles: 0,
    conductors: 0,
    propietarios: 0,
    reports: 0
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private vehicleService: VehicleService,
    private conductorService: ConductorService,
    private propietarioService: PropietarioService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUserInfo();
  }

  loadStats(): void {
    // Load vehicles count
    this.vehicleService.getVehicles().subscribe({
      next: (response: ApiResponse<Vehicle[]>) => {
        this.stats.vehicles = response.data?.length || 0;
      },
      error: (error: any) => {
        console.error('Error loading vehicles:', error);
        this.stats.vehicles = 0;
      }
    });

    // Load conductors count
    this.conductorService.getConductores().subscribe({
      next: (conductors: Conductor[]) => {
        this.stats.conductors = conductors.length || 0;
      },
      error: (error: any) => {
        console.error('Error loading conductors:', error);
        this.stats.conductors = 0;
      }
    });

    // Load propietarios count
    this.propietarioService.getPropietarios().subscribe({
      next: (response: ApiResponse<Propietario[]>) => {
        this.stats.propietarios = response.data?.length || 0;
      },
      error: (error: any) => {
        console.error('Error loading propietarios:', error);
        this.stats.propietarios = 0;
      }
    });
  }

  loadUserInfo(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: any) => {
        if (user) {
          this.userName = user.name || 'Usuario';
          this.userRole = user.role || 'Usuario';
        }
      },
      error: (error: any) => {
        console.error('Error loading user info:', error);
        this.userName = 'Usuario';
        this.userRole = 'Usuario';
      }
    });
  }

  toggleSidebar(): void {
    this.isActive = !this.isActive;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Error during logout:', error);
        this.router.navigate(['/login']);
      }
    });
  }
}
