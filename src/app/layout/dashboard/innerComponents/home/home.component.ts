import { Component, OnInit } from "@angular/core";
import { DashboardService } from "../../dashboard.service";


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {

  loading = true;
  dashboardData: any = [];
  
  constructor(private httpService: DashboardService) {}

  ngOnInit() {
    this.getEXTDashboardData();

  }


  getEXTDashboardData() {
    let obj = {
      userId: -1,
      cityId: -1,
      regionId: -1,
      brandId: -1,
      month: 11,
      year: 2019
    };
    this.httpService.getExTrackingDashboardData(obj).subscribe(
      (data: any) => {
     
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
