import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  vehicles: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initialize with empty array or load from service
    this.vehicles = [];
  }
}
