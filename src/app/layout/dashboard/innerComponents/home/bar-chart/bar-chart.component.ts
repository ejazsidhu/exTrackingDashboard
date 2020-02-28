import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit,OnChanges {

  @Input('barCharData') inputForBarChart;
  @Input('chartPosition') chartPosition;

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    legend:{
      position:this.chartPosition || "bottom"
    },
    events: ['click']
  };
  public barChartLabels = ['2019'];
  public barChartType: ChartType = 'bar';
  // public barChartType: ChartType = 'horizontalBar';

  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
  ];

  constructor() { }

  ngOnInit() {
  }

  // events
  public chartClicked(e): void {

    // const activePoints = this.barChartType.getElementAtEvent(e.event);
    // console.log("chart clicked",activePoints)


  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

 
ngOnChanges(changes:SimpleChanges){
  // console.log("on changes",changes);
  let result=[];
  if(changes.inputForBarChart.currentValue.length>0){

    let dataArray=[...changes.inputForBarChart.currentValue];

    dataArray.forEach(element => {

      let obj={
        data:[element.avg] || [0],
        label:element.name
      }
      result.push(obj);
      
    });

    //
    
    console.log("result",result)
    if(result.length>0)
    this.barChartData=result;



  }

}
}
