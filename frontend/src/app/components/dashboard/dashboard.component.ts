import { Component, OnInit, OnDestroy } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { ConductorService } from '../../services/conductor.service';
import { PropietarioService } from '../../services/propietario.service';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

  modalTitle = '';
  modalType = '';
  showModal = false;

  constructor(
    private vehicleService: VehicleService,
    private conductorService: ConductorService,
    private propietarioService: PropietarioService,
    private reportService: ReportService,
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
    this.modalTitle = 'Nuevo Vehículo';
    this.modalType = 'vehicle';
    this.showModal = true;
  }

  openConductorModal(): void {
    this.modalTitle = 'Nuevo Conductor';
    this.modalType = 'conductor';
    this.showModal = true;
  }

  openPropietarioModal(): void {
    this.modalTitle = 'Nuevo Propietario';
    this.modalType = 'propietario';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  refreshData(): void {
    this.loadStats();
  }
}
