import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ModalConfig {
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  customClass?: string;
  disableClose?: boolean;
  showHeader?: boolean;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Configurar cierre con ESC y clic fuera por defecto
    if (!data.disableClose) {
      dialogRef.keydownEvents().subscribe(event => {
        if (event.key === 'Escape') {
          this.onClose();
        }
      });

      dialogRef.backdropClick().subscribe(() => {
        this.onClose();
      });
    }
  }

  ngOnInit(): void {
    // Establecer valores por defecto
    this.data.showCloseButton = this.data.showCloseButton !== false;
    this.data.showHeader = this.data.showHeader !== false;
  }

  onClose(): void {
    if (!this.data.disableClose) {
      this.dialogRef.close();
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Manejar eventos de teclado
  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.data.disableClose) {
      this.onClose();
    }
  }
}
