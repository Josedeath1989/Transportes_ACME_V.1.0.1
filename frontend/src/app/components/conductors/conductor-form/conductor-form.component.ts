import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-conductor-form',
  templateUrl: './conductor-form.component.html',
  styleUrls: ['./conductor-form.component.css']
})
export class ConductorFormComponent implements OnInit {
  form!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      license: new FormControl('')
    });
  }

  onSubmit(): void {
    console.log(this.form.value);
  }
}