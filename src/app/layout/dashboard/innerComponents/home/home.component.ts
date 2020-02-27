import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { DashboardService } from "../../dashboard.service";
import { ChartType, ChartOptions } from "chart.js";
import * as moment from "moment";
declare const google: any;
// tslint:disable-next-line: import-blacklist
import { Observable, interval } from "rxjs";

import { Router } from "@angular/router";
import { checkAndUpdateTextDynamic } from "@angular/core/src/view/text";
import { positionElements } from "ngx-bootstrap";
// import { Label } from 'ng2-charts';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  tabsData: any = [];
  loading = true;
  date = Date();
  dashboardData: any = [];
  brandData: any = [];
  territoryData: any = [];

  brandAchievementAvgList: any = [];
  territoryAchievementAvgList: any = [];
  regionData: any = [];
  regionAchievementAvgList: any = [];
  selectedZone = "";
  zoneClicked = false;
  constructor(private httpService: DashboardService, private router: Router) {}

  ngOnInit() {
    this.getEXTDashboardData();

    // interval(300000).subscribe(i=>{this.getData()})
    // this.httpService.checkDate();

    // let userType=JSON.parse(localStorage.getItem("user_type"))

    // if(userType==16){
    //   this.router.navigate(['/dashboard/merchandiser_List'])
    // }
  }

  // doughnut chart
  public doughnutChartLabels: any[] = ["CBL", "Competition"];
  public doughnutChartData: any = [[350, 450]];
  public doughnutChartType: ChartType = "doughnut";

  public doughnutChartOptions: any = {
    type: "doughnut",
    legend: {
      position: "right"
    },
    tooltips: {
      callbacks: {
        afterLabel: function(tooltipItem, data) {
          var dataset = data["datasets"][0];
          var percent = Math.round(dataset["data"][tooltipItem["index"]]);
          return "(" + percent + "%)";
        }
      }
    }
  };
  // doughnut chart end
  // pi cahrt
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: "right"
    },

    tooltips: {
      callbacks: {
        // title: function(tooltipItem, data) {
        //   return data['labels'][tooltipItem[0]['index']];
        // },
        // label: function(tooltipItem, data) {
        //   return data['datasets'][0]['data'][tooltipItem['index']];
        // },
        afterLabel: (tooltipItem, data) => {
          console.log(
            "tooltip point",
            data["labels"][tooltipItem["index"]][0].toString()
          );
          // this.regionAchievementAvgList
          this.selectedZone = data["labels"][
            tooltipItem["index"]
          ][0].toString();

          var dataset = data["datasets"][0];
          var percent = Math.round(dataset["data"][tooltipItem["index"]]);
          return "(" + percent + "%)";
        }
      }
    }
    // plugins: {
    //   datalabels: {
    //     formatter: (value, ctx) => {
    //       const label = ctx.chart.data.labels[ctx.dataIndex];
    //       return label;
    //     },
    //   },
    // }
  };
  public pieChartLabels: any[] = [["Achievement Average"], ["Total"]];
  public pieChartData: number[] = [67, 100];
  // public pieChartLabels2: any[] = [['CBL'], ['Competition']];
  // public pieChartData2: number[] = [45,100];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  // public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      //
      backgroundColor: ["#AFFCAF", "#FCAFAF", "#FFE29A", "#86C7F3", "#F6CA95"]
    }
  ];
  public pieChartColors2 = [
    {
      backgroundColor: ["#FFA726", "#00B8F0", , "#FFE29A", "#86C7F3", "#F6CA95"]
    }
  ];
  public chartClicked(e: any): void {
    this.zoneClicked = true;
    let bList = this.dashboardData.filter(
      b => b.region_name == this.selectedZone
    );
    // console.log("brand with region name", bList);
     this.getSingleZoneData(bList);
  }
  // pie chart end

  

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
        // console.log(data, 'home data');
        if (data) {
          this.dashboardData = data;
          this.compileDataForCharts(data.slice());
        }
        this.loading = false;

        // this.pieChartData=[this.tabsData.msl,100-this.tabsData.msl];
        // this.doughnutChartData=[this.tabsData.sos,100-this.tabsData.sos]
      },
      error => {
        console.log(error, "home error");
      }
    );
  }

  compileDataForCharts(data) {
    console.log("data array", data);
      this.regionData = data.map(m => {
        let obj = {
          regionId: m.region_id,
          regionName: m.region_name,
          achievement: m.achievement || 0,
          sale: m.sale,
          target: m.target
        };
        return obj;
      });
    

    this.brandData = data.map(m => {
      let obj = {
        brandId: m.family_id,
        brandName: m.family_title,
        achievement: m.achievement || 0
      };
      return obj;
    });
    this.territoryData = data.map(m => {
      let obj = {
        territoryId: m.territory_id,
        territoryName: m.territory_name,
        achievement: m.achievement || 0
      };
      return obj;
    });
    let achievementArray = data.map(m => m.achievement || 0);
    let achievementAverage = achievementArray.reduce((a, b) => {
      return a + b;
    });
    const brandIds: any = data.map(b => b.family_id);
    const territoryIds: any = data.map(b => b.territory_id);
    const regionIds: any = data.map(b => b.region_id);
    let brandDistinctList = [...new Set(brandIds)];
    let territoryDistinctList = [...new Set(territoryIds)];
    let regionDistinctList = [...new Set(regionIds)];

    // console.log('brand, territoryDistinctList data',brandDistinctList,territoryDistinctList);
    // console.log('territory data',this.territoryData.slice(0,5));

    regionDistinctList.forEach(element => {
      let obj = {
        id: element,
        name: this.regionData.filter(b => b.regionId == element)[0].regionName,
        brandOBJ: this.regionData.filter(b => b.regionID == element),
        totalSale: this.getTotalSaleAndTarget(
          this.regionData.filter(b => b.regionId == element)
        ).totalSale,
        totalTarget: this.getTotalSaleAndTarget(
          this.regionData.filter(b => b.regionId == element)
        ).totalTarget
      };

      this.regionAchievementAvgList.push(obj);
    });
    brandDistinctList.forEach(element => {
      let obj = {
        id: element,
        name: this.brandData.filter(b => b.brandId == element)[0].brandName,
        brandOBJ: this.brandData.filter(b => b.brandId == element),
        avg: this.getAverage(this.brandData.filter(b => b.brandId == element)),
        total: this.getTotal(this.brandData.filter(b => b.brandId == element))
      };

      this.brandAchievementAvgList.push(obj);
    });

    let t = [];
    territoryDistinctList.forEach(element => {
      let obj = {
        id: element,
        name: this.territoryData.filter(b => b.territoryId == element)[0]
          .territoryName,
        territoryOBJ: this.territoryData.filter(b => b.territoryId == element),
        avg: this.getAverage(
          this.territoryData.filter(b => b.territoryId == element)
        ),
        total: this.getTotal(
          this.territoryData.filter(b => b.territoryId == element)
        )
      };

      this.territoryAchievementAvgList.push(obj);
      // t.push(obj)
    });

    // this.territoryAchievementAvgList=t.slice(1,10)

    // console.log("total brand",this.brandAchievementAvgList);
    // console.log("total territory",this.territoryAchievementAvgList);
    console.log("total region", this.regionAchievementAvgList);

    let saleList = this.regionAchievementAvgList.map(r =>
      Math.round(r.totalSale)
    );
    let saleLabels = this.regionAchievementAvgList.map(r => [r.name]);

    this.pieChartData = [saleList, 100];
    this.pieChartLabels = [];
    this.pieChartLabels = saleLabels;
  }

  getSingleZoneData(data) {
    // this.loading=true;
    this.brandData=[];
    this.territoryData=[];

    this.territoryAchievementAvgList=[];
    this.brandAchievementAvgList=[];

    this.brandData = data.map(m => {
      if(this.selectedZone==m.region_name){

      let obj = {
        brandId: m.family_id,
        brandName: m.family_title,
        achievement: m.achievement || 0
      };
      return obj;
    }
    });
    this.territoryData = data.map(m => {

      if(this.selectedZone==m.region_name){
        let obj = {
          territoryId: m.territory_id,
          territoryName: m.territory_name,
          achievement: m.achievement || 0
        };
        return obj;
      }
      
    });
    let achievementArray = data.map(m => m.achievement || 0);
    let achievementAverage = achievementArray.reduce((a, b) => {
      return a + b;
    });
    const brandIds: any = data.map(b => b.family_id);
    const territoryIds: any = data.map(b => b.territory_id);
    const regionIds: any = data.map(b => b.region_id);
    let brandDistinctList = [...new Set(brandIds)];
    let territoryDistinctList = [...new Set(territoryIds)];
    let regionDistinctList = [...new Set(regionIds)];

    brandDistinctList.forEach(element => {
      let obj = {
        id: element,
        name: this.brandData.filter(b => b.brandId == element)[0].brandName,
        brandOBJ: this.brandData.filter(b => b.brandId == element),
        avg: this.getAverage(this.brandData.filter(b => b.brandId == element)),
        total: this.getTotal(this.brandData.filter(b => b.brandId == element))
      };

      this.brandAchievementAvgList.push(obj);
    });

    let t = [];
    territoryDistinctList.forEach(element => {
      let obj = {
        id: element,
        name: this.territoryData.filter(b => b.territoryId == element)[0]
          .territoryName,
        territoryOBJ: this.territoryData.filter(b => b.territoryId == element),
        avg: this.getAverage(
          this.territoryData.filter(b => b.territoryId == element)
        ),
        total: this.getTotal(
          this.territoryData.filter(b => b.territoryId == element)
        )
      };

      this.territoryAchievementAvgList.push(obj);
      // t.push(obj)
    });
  }

  getAverage(list) {
    let ach = list.map(m => m.achievement);
    let avg = ach.reduce((a, b) => {
      return a + b;
    });
    // console.log(avg)
    return Math.round(avg / list.length);
  }

  getTotal(list) {
    let ach = list.map(m => m.achievement);
    let avg = ach.reduce((a, b) => {
      return a + b;
    });
    // console.log(avg)
    return Math.round(avg);
  }

  getTotalSaleAndTarget(list) {
    let sales = list.map(m => m.sale || 0);
    let totalSale = sales.reduce((a, b) => {
      return a + b;
    });

    let target = list.map(m => m.target);
    let totalTarget = target.reduce((a, b) => {
      return a + b;
    });

    // console.log(avg)
    return {
      totalSale: Math.round(totalSale),
      totalTarget: Math.round(totalTarget)
    };
  }
}
