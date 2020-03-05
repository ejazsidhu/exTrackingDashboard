import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import * as moment from "moment";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  loading = false;
  dashboardData: any = [];
  selectedMonth = moment(new Date()).format("M");
  selectedYear = moment(new Date()).format("Y");
  primaryDashboardData: any[];
  regionId=-1;
  zoneId=-1;
  constructor(private httpService: DashboardService,private activatedRoute:ActivatedRoute) {}

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params=>{
console.log(params)
    })

    this.getEXTPrimaryDashboardData();

    setTimeout(() => {
      this.getEXTSecondaryDashboardData();
    }, 1000);

    this.httpService.SelectedDate.subscribe(date => {
      if (date) {
        this.selectedMonth = date.month;
        this.selectedYear = date.year;
        if(date.dashboardName=='primary')
        this.getEXTPrimaryDashboardData();

      if(date.dashboardName=='secondary'){
        setTimeout(() => {
          this.getEXTSecondaryDashboardData();
        }, 1000);
      }
      }
    });
  }

  getEXTSecondaryDashboardData() {
    this.loading = true;
    let obj = {
      userId: -1,
      cityId: -1,
      regionId: -1,
      brandId: -1,
      month: +this.selectedMonth,
      year: +this.selectedYear
    };
    this.httpService.getExTrackingSecondaryDashboardData(obj).subscribe(
      (data: any) => {
        this.dashboardData = [];

        if (data) {
          this.dashboardData = data;
        }
        this.loading = false;
      },
      error => {
        console.log(error, "home error");
      }
    );
  }

  getEXTPrimaryDashboardData() {
    this.loading = true;
    let obj = {
      userId: -1,
      cityId: -1,
      regionId: -1,
      brandId: -1,
      month: +this.selectedMonth,
      year: +this.selectedYear
    };
    this.httpService.getExTrackingPrimaryDashboardData(obj).subscribe(
      (data: any) => {
        this.primaryDashboardData = [];
        if (data) {
          this.primaryDashboardData = data;
        }
        this.loading = false;
      },
      error => {
        console.log(error, "home error");
      }
    );
  }
}
