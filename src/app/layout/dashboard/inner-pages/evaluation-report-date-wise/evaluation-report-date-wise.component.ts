import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluation-report-date-wise',
  templateUrl: './evaluation-report-date-wise.component.html',
  styleUrls: ['./evaluation-report-date-wise.component.scss']
})
export class EvaluationReportDateWiseComponent implements OnInit {
  title = 'Daily Evaluation Date Wise';
  reportType = 2;
  constructor() { }

  ngOnInit() {
  }

}
