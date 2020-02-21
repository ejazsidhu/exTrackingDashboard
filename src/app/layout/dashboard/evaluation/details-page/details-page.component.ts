import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { EvaluationService } from '../evaluation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Alert } from 'selenium-webdriver';
import { config } from 'src/assets/config';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss']
})
export class DetailsPageComponent implements OnInit {
  // ip = environment.ip;
  configFile = config;

  ip: any = this.configFile.ip;
  tableData: any = [];
  headingsList: any = [];
  loading = true;
  p = 0;
  params: any = {};
  constructor(private router: Router, private toastr: ToastrService, private httpService: EvaluationService, private activeRoute: ActivatedRoute) {
    this.activeRoute.queryParams.subscribe(p => {
      console.log('active params', p);
      this.params = p;
      if (p.surveyorId && p.startDate && p.endDate) {

        this.getTableData(p);
      }

    });

   }

  ngOnInit() {
    // this.getTableData();

    const that = this;
    const flag = false;
    document.addEventListener('visibilitychange', function(e) {
      console.log(document.hidden);
      if (!document.hidden) {
      that.getTableData(that.params);
      }


  });

  }

  getTableData(obj) {
    // let date='2019-04-29';//new Date();
    // let obj={
    //   startDate:moment(date).format('YYYY-MM-DD'),
    //   endDate:moment(date).format('YYYY-MM-DD')
    // }

    this.httpService.getData(obj).subscribe(data => {
      // console.log(data);
      this.tableData = data;
      if (this.tableData.length === 0) {
        this.loading = false;
        this.toastr.info('No record found.');
        setTimeout(() => {
        this.router.navigate(['/dashboard/merchandiser_List']);

        }, 3000);
      }
    this.headingsList = Object.keys(data);

    }, error => {});


  }

  gotoNewPage(item) {
    if (item.flag !== 1) {
    window.open(`${environment.hash}dashboard/evaluation/list/details/${item.survey_id}`, '_blank');
    }
    }

}
