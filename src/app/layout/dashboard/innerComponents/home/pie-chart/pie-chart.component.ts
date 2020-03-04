import { Component, OnInit, Input } from '@angular/core';
import { ChartType, ChartOptions } from "chart.js";
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  @Input('pieChartInputData') pieChartInputData;

  constructor() { }

  ngOnInit() {
    this.pieChartLabels=this.pieChartInputData.map(m=>m.label);
    this.pieChartData=this.pieChartInputData.map(m=>m.data)
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
          // afterLabel: (tooltipItem, data) => {
          //   console.log(
          //     "tooltip point",
          //     data["labels"][tooltipItem["index"]][0].toString()
          //   );
          //   // this.regionAchievementAvgList
          //   this.selectedZone = data["labels"][
          //     tooltipItem["index"]
          //   ][0].toString();
  
          //   var dataset = data["datasets"][0];
          //   var percent = Math.round(dataset["data"][tooltipItem["index"]]);
          //   return "(" + percent + "%)";
          // }
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
 
    }
    // pie chart end

}
