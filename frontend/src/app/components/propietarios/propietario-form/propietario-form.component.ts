import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-propietario-form',
  templateUrl: './propietario-form.component.html',
  styleUrls: ['./propietario-form.component.css']
})
export class PropietarioFormComponent implements OnInit {
  form!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      address: new FormControl('')
    });
  }

  onSubmit(): void {
    console.log(this.form.value);
  }
}