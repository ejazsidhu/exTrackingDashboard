import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { DashboardService } from '../../../dashboard.service';
import { Router } from '@angular/router';
import { ChartType, ChartOptions } from "chart.js";


@Component({
  selector: 'draw-chart',
  templateUrl: './draw-chart.component.html',
  styleUrls: ['./draw-chart.component.scss']
})
export class DrawChartComponent implements OnChanges {

  @Input("chartsData") chartsData;
  @Input() loading;
  @Output() resetChart=new EventEmitter();

  tabsData: any = [];
  // loading = true;
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

  ngOnChanges(){
    if (this.chartsData.length>0) {
              this.dashboardData = this.chartsData;
              this.compileDataForCharts(this.chartsData.slice());
            }

            this.httpService.chartSelectedData.subscribe((data:any)=>{
              console.log("chart data in draw chart component",data);
              if(this.selectedZone && data.chartName=="brand")
              {
                let bData=this.dashboardData.filter(b=>b.region_name==this.selectedZone && b.family_title==data.selectedBar);
                this.getTerritoryByBrandName(bData,data.selectedBar);

                     
              }

              if(this.selectedZone && data.chartName=="territory")
              {
                let tData=this.dashboardData.filter(b=>b.region_name==this.selectedZone && b.territory_name==data.selectedBar);
                this.getBrandsByTerritoryName(tData,data.selectedBar);
                     
              }

            })
  }
  resetCharts(){
    // this.brandData=[];
    // this.territoryData=[];
    // this.brandAchievementAvgList=[];
    // this.territoryAchievementAvgList=[];
    // // this.compileDataForCharts(this.dashboardData)
    this.resetChart.emit(true)
  }
 
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

    this.pieChartData = [saleList||[0], 100];
    this.pieChartLabels = [];
    this.pieChartLabels = saleLabels;
  }

  getTerritoryByBrandName(brandArray,brandName){
    this.territoryData=[];
    this.territoryAchievementAvgList=[];
    const territoryIds: any = brandArray.map(b => b.territory_id);
    let territoryDistinctList = [...new Set(territoryIds)];
    this.territoryData = brandArray.map(m => {

        let obj = {
          territoryId: m.territory_id,
          territoryName: m.territory_name,
          achievement: m.achievement || 0
        };
        return obj;
      
      
    });

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

    console.log('brand based territory',this.territoryAchievementAvgList)

  }

  getBrandsByTerritoryName(territoryArray,brandName){
    this.brandData=[];
    this.brandAchievementAvgList=[];
    this.brandData = territoryArray.map(m => {
  
      let obj = {
        brandId: m.family_id,
        brandName: m.family_title,
        achievement: m.achievement || 0,
      }
      return obj;
    
    });

    const brandIds: any = territoryArray.map(b => b.family_id);
    let brandDistinctList = [...new Set(brandIds)];
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
        achievement: m.achievement || 0,
        
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
