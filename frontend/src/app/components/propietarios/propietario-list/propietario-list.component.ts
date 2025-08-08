import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-propietario-list',
  templateUrl: './propietario-list.component.html',
  styleUrls: ['./propietario-list.component.css']
})
export class PropietarioListComponent implements OnInit {
  propietarios = [
    { id: 1, name: 'Juan Pérez', address: 'Calle 123' },
    { id: 2, name: 'María Rodríguez', address: 'Avenida 456' },
    { id: 3, name: 'Carlos López', address: 'Calle 789' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}