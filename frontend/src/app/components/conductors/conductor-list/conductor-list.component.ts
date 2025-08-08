import { Component, OnInit } from '@angular/core';
import { ConductorService } from '../../../services/conductor.service';
import { Conductor } from '../../../models/conductor.model';

@Component({
  selector: 'app-conductor-list',
  templateUrl: './conductor-list.component.html',
  styleUrls: ['./conductor-list.component.css']
})
export class ConductorListComponent implements OnInit {
  conductores: Conductor[] = [];

  constructor(private conductorService: ConductorService) { }

  ngOnInit(): void {
    this.conductorService.getConductores().subscribe(data => {
      this.conductores = data;
    });
  }
}
