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
    }
    ,legend:{
      position:"right"
    }
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
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    this.barChartData[0].data = data;
  }
ngOnChanges(changes:SimpleChanges){
  console.log("on changes",changes);
  let result=[]
  if(changes.inputForBarChart){

    let dataArray=[...changes.inputForBarChart.currentValue];

    dataArray.forEach(element => {

      let obj={
        data:[element.avg],
        label:element.name
      }
      result.push(obj);
      
    });

    console.log("result",result)
    this.barChartData=result;



  }

}
}
