import { Component, OnInit, OnDestroy } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { ConductorService } from '../../services/conductor.service';
import { PropietarioService } from '../../services/propietario.service';
import { ReportService } from '../../services/report.service';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { Vehicle } from '../../models/vehicle.model';
import { Conductor } from '../../models/conductor.model';
import { Propietario } from '../../models/propietario.model';

// Interfaces para tipado fuerte
interface DashboardStats {
  vehicles: number;
  conductors: number;
  propietarios: number;
  reports: number;
}

interface RecentActivity {
  type: 'vehicle' | 'conductor' | 'propietario' | 'report';
  icon: string;
  description: string;
  time: string;
}

interface ModalResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats = {
    vehicles: 0,
    conductors: 0,
    propietarios: 0,
    reports: 0
  };

  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  recentActivities = [
    {
      type: 'vehicle',
      icon: 'fas fa-truck',
      description: 'Nuevo vehículo registrado',
      time: 'Hace 5 minutos'
    },
    {
      type: 'conductor',
      icon: 'fas fa-user-tie',
      description: 'Conductor actualizado',
      time: 'Hace 15 minutos'
    },
    {
      type: 'propietario',
      icon: 'fas fa-user-circle',
      description: 'Propietario creado',
      time: 'Hace 1 hora'
    },
    {
      type: 'report',
      icon: 'fas fa-chart-bar',
      description: 'Reporte generado',
      time: 'Hace 2 horas'
    }
  ];

  constructor(
    private vehicleService: VehicleService,
    private conductorService: ConductorService,
    private propietarioService: PropietarioService,
    private reportService: ReportService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStats(): void {
    this.isLoading = true;
    this.error = null;

    function getLength(response: any): number {
      if (Array.isArray(response)) {
        return response.length;
      } else if (response && Array.isArray(response.data)) {
        return response.data.length;
      }
      return 0;
    }

    forkJoin({
      vehicles: this.vehicleService.getVehicles().pipe(
        catchError(error => {
          console.error('Error loading vehicles:', error);
          return of({ data: [] });
        })
      ),
      conductors: this.conductorService.getConductores().pipe(
        catchError(error => {
          console.error('Error loading conductors:', error);
          return of({ data: [] });
        })
      ),
      propietarios: this.propietarioService.getPropietarios().pipe(
        catchError(error => {
          console.error('Error loading propietarios:', error);
          return of({ data: [] });
        })
      ),
      reports: this.reportService.getReports().pipe(
        catchError(error => {
          console.error('Error loading reports:', error);
          return of([]);
        })
      )
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.stats.vehicles = getLength(data.vehicles);
        this.stats.conductors = getLength(data.conductors);
        this.stats.propietarios = getLength(data.propietarios);
        this.stats.reports = getLength(data.reports);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Error al cargar las estadísticas';
        this.isLoading = false;
      }
    });
  }

  openVehicleModal(): void {
    const dialogRef = this.modalService.openVehicleModal();
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStats();
        this.addRecentActivity('vehicle', 'Nuevo vehículo registrado');
      }
    });
  }

  openConductorModal(): void {
    const dialogRef = this.modalService.openConductorModal();
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStats();
        this.addRecentActivity('conductor', 'Nuevo conductor registrado');
      }
    });
  }

  openPropietarioModal(): void {
    const dialogRef = this.modalService.openPropietarioModal();
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStats();
        this.addRecentActivity('propietario', 'Nuevo propietario registrado');
      }
    });
  }

  private addRecentActivity(type: RecentActivity['type'], description: string): void {
    this.recentActivities.unshift({
      type,
      icon: this.getActivityIcon(type),
      description,
      time: 'Hace un momento'
    });
    
    // Mantener solo las últimas 4 actividades
    if (this.recentActivities.length > 4) {
      this.recentActivities.pop();
    }
  }

  private getActivityIcon(type: RecentActivity['type']): string {
    const icons: Record<RecentActivity['type'], string> = {
      vehicle: 'fas fa-truck',
      conductor: 'fas fa-user-tie',
      propietario: 'fas fa-user-circle',
      report: 'fas fa-chart-bar'
    };
    return icons[type] || 'fas fa-info-circle';
  }

  refreshData(): void {
    this.loadStats();
  }

  // Método para manejo de errores centralizado
  private handleError(error: any, context: string): void {
    console.error(`Error en ${context}:`, error);
    this.error = `Error al ${context}. Por favor, intente nuevamente.`;
    this.isLoading = false;
  }

  // Método para limpiar errores
  clearError(): void {
    this.error = null;
  }
}
