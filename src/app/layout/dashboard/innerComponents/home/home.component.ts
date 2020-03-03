import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import * as moment from 'moment';


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  loading = false;
  dashboardData: any = [];
  selectedMonth=moment(new Date()).format("M");
  selectedYear=moment(new Date).format("Y");
  constructor(private httpService: DashboardService) {}

  ngOnInit() {
    this.getEXTDashboardData();

    this.httpService.SelectedDate.subscribe(date=>{
      if(date){
        this.selectedMonth=date.month;
        this.selectedYear=date.year;
        this.getEXTDashboardData();
      }

    })

  }


  getEXTDashboardData() {
    this.loading=true;
    let obj = {
      userId: -1,
      cityId: -1,
      regionId: -1,
      brandId: -1,
      month: +(this.selectedMonth),
      year: +(this.selectedYear)
    };
    this.httpService.getExTrackingDashboardData(obj).subscribe(
      (data: any) => {
     this.dashboardData=[];
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

  
}
