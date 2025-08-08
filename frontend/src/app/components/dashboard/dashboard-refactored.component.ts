import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable, forkJoin, of } from 'rxjs';
import { takeUntil, catchError, finalize, tap } from 'rxjs/operators';

// Services
import { VehicleService } from '../../services/vehicle.service';
import { ConductorService } from '../../services/conductor.service';
import { PropietarioService } from '../../services/propietario.service';
import { ReportService } from '../../services/report.service';

// Form Components
import { VehicleFormComponent } from '../vehicles/vehicles-form/vehicle-form.component';
import { ConductorFormComponent } from '../conductors/conductor-form/conductor-form.component';
import { PropietarioFormComponent } from '../propietarios/propietario-form/propietario-form.component';

// Models
import { Vehicle } from '../../models/vehicle.model';
import { Conductor } from '../../models/conductor.model';
import { Propietario } from '../../models/propietario.model';

// Interfaces
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
  selector: 'app-dashboard-refactored',
  templateUrl: './dashboard-refactored.component.html',
  styleUrls: ['./dashboard-refactored.component.css']
})
export class DashboardRefactoredComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    vehicles: 0,
    conductors: 0,
    propietarios: 0,
    reports: 0
  };

  isLoading = false;
  isModalLoading = false;
  error: string | null = null;
  modalError: string | null = null;

  recentActivities: RecentActivity[] = [];
  
  private destroy$ = new Subject<void>();
  private activeModals = new Set<MatDialogRef<any>>();

  constructor(
    private vehicleService: VehicleService,
    private conductorService: ConductorService,
    private propietarioService: PropietarioService,
    private reportService: ReportService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.initializeRecentActivities();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.closeAllModals();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

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
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.stats = {
          vehicles: this.getDataLength(data.vehicles),
          conductors: this.getDataLength(data.conductors),
          propietarios: this.getDataLength(data.propietarios),
          reports: this.getDataLength(data.reports)
        };
      },
      error: (error) => {
        this.error = 'Error al cargar las estadísticas del dashboard';
        console.error('Dashboard error:', error);
      }
    });
  }

  private getDataLength(response: any): number {
    if (Array.isArray(response)) return response.length;
    if (response?.data) return Array.isArray(response.data) ? response.data.length : 0;
    return 0;
  }

  private initializeRecentActivities(): void {
    this.recentActivities = [
      {
        type: 'vehicle',
        icon: 'fas fa-truck',
        description: 'Sistema listo para registrar nuevos vehículos',
        time: 'Ahora'
      },
      {
        type: 'conductor',
        icon: 'fas fa-user-tie',
        description: 'Gestión de conductores activa',
        time: 'Hace 1 minuto'
      },
      {
        type: 'propietario',
        icon: 'fas fa-user-circle',
        description: 'Sistema de propietarios operativo',
        time: 'Hace 2 minutos'
      },
      {
        type: 'report',
        icon: 'fas fa-chart-bar',
        description: 'Reportes disponibles para consulta',
        time: 'Hace 3 minutos'
      }
    ];
  }

  // Modal Management Methods
  openVehicleModal(vehicle?: Vehicle): void {
    this.openModal<Vehicle>(VehicleFormComponent, {
      width: '700px',
      data: { vehicle, mode: vehicle ? 'edit' : 'create' }
    }).subscribe(result => this.handleModalResult(result, 'vehicle'));
  }

  openConductorModal(conductor?: Conductor): void {
    this.openModal<Conductor>(ConductorFormComponent, {
      width: '600px',
      data: { conductor, mode: conductor ? 'edit' : 'create' }
    }).subscribe(result => this.handleModalResult(result, 'conductor'));
  }

  openPropietarioModal(propietario?: Propietario): void {
    this.openModal<Propietario>(PropietarioFormComponent, {
      width: '600px',
      data: { propietario, mode: propietario ? 'edit' : 'create' }
    }).subscribe(result => this.handleModalResult(result, 'propietario'));
  }

  private openModal<T>(
    component: any,
    config: { width?: string; data?: any }
  ): Observable<ModalResult<T>> {
    this.isModalLoading = true;
    this.modalError = null;

    const dialogRef = this.dialog.open(component, {
      width: config.width || '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: ['modern-modal-container'],
      backdropClass: 'modern-backdrop',
      data: config.data || {},
      autoFocus: false,
      restoreFocus: true
    });

    this.activeModals.add(dialogRef);

    return dialogRef.afterClosed().pipe(
      tap(() => this.activeModals.delete(dialogRef)),
      catchError(error => {
        console.error('Modal error:', error);
        return of({ success: false, error: error.message });
      }),
      finalize(() => this.isModalLoading = false)
    );
  }

  private handleModalResult<T>(result: ModalResult<T>, type: string): void {
    if (result?.success) {
      this.loadDashboardData();
      this.addRecentActivity(type, `Nuevo ${type} registrado exitosamente`);
    } else if (result?.error) {
      this.modalError = result.error;
      console.error(`Error creating/updating ${type}:`, result.error);
    }
  }

  private addRecentActivity(type: string, description: string): void {
    this.recentActivities.unshift({
      type: type as RecentActivity['type'],
      icon: this.getActivityIcon(type),
      description: description,
      time: 'Hace un momento'
    });

    // Keep only the latest 5 activities
    if (this.recentActivities.length > 5) {
      this.recentActivities.pop();
    }
  }

  private getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      vehicle: 'fas fa-truck',
      conductor: 'fas fa-user-tie',
      propietario: 'fas fa-user-circle',
      report: 'fas fa-chart-bar'
    };
    return icons[type] || 'fas fa-info-circle';
  }

  private closeAllModals(): void {
    this.activeModals.forEach(modal => modal.close());
    this.activeModals.clear();
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }
}
