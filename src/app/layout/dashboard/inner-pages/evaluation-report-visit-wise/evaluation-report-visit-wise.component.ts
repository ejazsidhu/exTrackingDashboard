import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluation-report-visit-wise',
  templateUrl: './evaluation-report-visit-wise.component.html',
  styleUrls: ['./evaluation-report-visit-wise.component.scss']
})
export class EvaluationReportVisitWiseComponent implements OnInit {
  title = 'Daily Evaluation Visit Wise';
  reportType = 1;
  constructor() { }

  ngOnInit() {
  }

}
