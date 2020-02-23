import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { DashboardService } from '../../dashboard.service';
import { ChartType, ChartOptions } from 'chart.js';
import * as moment from 'moment';
declare const google: any;
// tslint:disable-next-line: import-blacklist
import { Observable, interval } from 'rxjs';

import { Router } from '@angular/router';
import { checkAndUpdateTextDynamic } from '@angular/core/src/view/text';
import { positionElements } from 'ngx-bootstrap';
// import { Label } from 'ng2-charts';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {

  tabsData: any = [];
  loading = true;
  date = Date();
  dasboardData: any=[];
  brandData: any=[];
  territoryData: any=[];

  brandAchivementAvgList:any=[];
  terretoryAchivementAvgList:any=[];
  constructor(private httpService: DashboardService, private router: Router) { }

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
  public doughnutChartLabels: any[] = ['CBL', 'Competition',];
  public doughnutChartData: any = [
    [350, 450]
  ];
  public doughnutChartType: ChartType = 'doughnut';

  public doughnutChartOptions: any = {
    type: 'doughnut',
    legend: {
      position: 'right',
    },
    tooltips: {
      callbacks: {
        afterLabel: function (tooltipItem, data) {
          var dataset = data['datasets'][0];
          var percent = Math.round((dataset['data'][tooltipItem['index']]))
          return '(' + percent + '%)';
        }
      }
    }
  }
  // doughnut chart end
  // pi cahrt
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
    },

    tooltips: {
      callbacks: {
        // title: function(tooltipItem, data) {
        //   return data['labels'][tooltipItem[0]['index']];
        // },
        // label: function(tooltipItem, data) {
        //   return data['datasets'][0]['data'][tooltipItem['index']];
        // },
        afterLabel: function (tooltipItem, data) {
          var dataset = data['datasets'][0];
          var percent = Math.round((dataset['data'][tooltipItem['index']]))
          return '(' + percent + '%)';
        }
      }
    },
    // plugins: {   
    //   datalabels: {
    //     formatter: (value, ctx) => {
    //       const label = ctx.chart.data.labels[ctx.dataIndex];
    //       return label;
    //     },
    //   },
    // }
  };
  public pieChartLabels: any[] = [['Achievement Average'], ['Total']];
  public pieChartData: number[] = [67, 100];
  // public pieChartLabels2: any[] = [['CBL'], ['Competition']];
  // public pieChartData2: number[] = [45,100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  // public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      // 
      backgroundColor: ['#AFFCAF', '#FCAFAF'],
    },
  ];
  public pieChartColors2 = [
    {
      backgroundColor: ['#FFA726', '#00B8F0'],
    },
  ];
  public chartClicked(e: any): void {
    const chart = e.active[0]._chart;
    // if (e.active.length > 0) {
    //   const chart = e.active[0]._chart;
    //   const activePoints = chart.getElementAtEvent(e.event);
    //   if (activePoints.length > 0) {
    //     // get the internal index of slice in pie chart
    //     const clickedElementIndex = activePoints[0]._index;
    //     const label = chart.data.labels[clickedElementIndex];
    //     // get value by index
    //     const value = chart.data.datasets[0].data[clickedElementIndex];
    //     // console.log(clickedElementIndex, label, value)
    //     this.router.navigate(['/dashboard/msl_dashboard']);
    //   }
    // }

    console.log('chart data',chart.data)
  }
  // pie chart end







  getEXTDashboardData() {
    let obj = {
      userId: -1,
      cityId: -1,
      regionId: -1,
      brandId: -1,
      month: 11,
      year: 2019,
    }
    this.httpService.getExTrackingDasboardData(obj).subscribe(data => {
      // console.log(data, 'home data');
      if (data){
        this.dasboardData = data;
        this.compileDataForCharts(data);

      }
      this.loading = false;

      // this.pieChartData=[this.tabsData.msl,100-this.tabsData.msl];
      // this.doughnutChartData=[this.tabsData.sos,100-this.tabsData.sos]

    }, error => {
      console.log(error, 'home error')

    })
  }

  compileDataForCharts(data){
    console.log("data array",data.length)
    this.brandData=data.map(m=>{
      let obj={
        brandId:m.family_id,
        brandName:m.family_title,
        achievement:m.achievement || 0
      }
      return obj;
    })
    this.territoryData=data.map(m=>{
      let obj={
        territoryId:m.territory_id,
        territoryName:m.territory_name,
        achievement:m.achievement || 0,

      }
      return obj;
    });
let achivementArray=data.map(m=>(m.achievement|| 0))
    let achievementAverage=achivementArray.reduce((a,b)=>{return a+b});
    const brandIds:any=data.map(b=>b.family_id);
    const territoryIds:any=data.map(b=>b.territory_id)
    let brandDistinctList=[...new Set(brandIds)];
    let territorySistintList=[...new Set(territoryIds)];
    
    console.log('brand, territorySistintList data',brandDistinctList,territorySistintList);
    // console.log('territory data',this.territoryData.slice(0,5));

    

    brandDistinctList.forEach(element => {

      let obj={
        id:element,
        name:this.brandData.filter(b=>b.brandId==element)[0].brandName,
        // brandOBJ:this.brandData.filter(b=>b.brandId==element),
        avg:this.getAverage(this.brandData.filter(b=>b.brandId==element)),
        total:this.getTotal(this.brandData.filter(b=>b.brandId==element))
      }

      this.brandAchivementAvgList.push(obj)

    });

    territorySistintList.forEach(element => {

      let obj={
        id:element,
        name:this.territoryData.filter(b=>b.territoryId==element)[0].territoryName,
        // terretoryOBJ:this.territoryData.filter(b=>b.territoryId==element),
        avg:this.getAverage(this.territoryData.filter(b=>b.territoryId==element)),
        total:this.getTotal(this.territoryData.filter(b=>b.territoryId==element))
      }

      this.terretoryAchivementAvgList.push(obj)

    });
    console.log("total brand",this.brandAchivementAvgList);
    console.log("total terrtory",this.terretoryAchivementAvgList);

    this.pieChartData=[Math.round(achievementAverage/achivementArray.length),100]


  }

  getAverage(list){
    
    let ach=list.map(m=>m.achievement)
    let avg=ach.reduce((a,b)=>{return a+b });
    console.log(avg)
    return Math.round(avg/list.length);

  }
  getTotal(list){

    let ach=list.map(m=>m.achievement)
    let avg=ach.reduce((a,b)=>{return a+b });
    console.log(avg)
    return Math.round(avg);

  }

}
