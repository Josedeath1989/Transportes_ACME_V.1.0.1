import { Component, OnInit, OnDestroy } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { ConductorService } from '../../services/conductor.service';
import { PropietarioService } from '../../services/propietario.service';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { VehicleFormComponent } from '../vehicles/vehicles-form/vehicle-form.component';
import { ConductorFormComponent } from '../conductors/conductor-form/conductor-form.component';
import { PropietarioFormComponent } from '../propietarios/propietario-form/propietario-form.component';

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
    private router: Router,
    private dialog: MatDialog
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
    const dialogRef = this.dialog.open(VehicleFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  openConductorModal(): void {
    const dialogRef = this.dialog.open(ConductorFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  openPropietarioModal(): void {
    const dialogRef = this.dialog.open(PropietarioFormComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshData();
      }
    });
  }

  refreshData(): void {
    this.loadStats();
  }
}
