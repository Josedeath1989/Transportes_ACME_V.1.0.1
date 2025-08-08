import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  form!: FormGroup;

  constructor(private dialogRef: MatDialogRef<VehicleFormComponent>) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      year: new FormControl('')
    });
  }

  onSubmit(): void {
    console.log(this.form.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
