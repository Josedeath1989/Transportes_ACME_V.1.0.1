import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: any[] = [];

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getReports().subscribe(reports => {
      this.reports = reports;
    });
  }
}
