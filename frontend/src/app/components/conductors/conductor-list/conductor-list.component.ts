import { Component, OnInit } from '@angular/core';
import { ConductorService } from '../../../services/conductor.service';
import { ModalService } from '../../../services/modal.service';
import { Conductor } from '../../../models/conductor.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-conductor-list',
  templateUrl: './conductor-list.component.html',
  styleUrls: ['./conductor-list.component.css']
})
export class ConductorListComponent implements OnInit {
  conductores: Conductor[] = [];

  constructor(
    private conductorService: ConductorService,
    private modalService: ModalService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadConductores();
  }

  loadConductores(): void {
    this.conductorService.getConductores().subscribe({
      next: (data) => {
        this.conductores = data;
      },
      error: (error: any) => {
        console.error('Error loading conductores:', error);
        this.snackBar.open('Error al cargar conductores', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  openCreateModal(): void {
    const dialogRef = this.modalService.openConductorModal();
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadConductores();
        this.snackBar.open('Conductor creado exitosamente', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  openEditModal(conductor: Conductor): void {
    const dialogRef = this.modalService.openConductorModal(conductor);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadConductores();
        this.snackBar.open('Conductor actualizado exitosamente', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  refreshList(): void {
    this.loadConductores();
  }
}
