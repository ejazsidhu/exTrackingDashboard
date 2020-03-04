import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { DashboardService } from '../../../dashboard.service';
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

  @Input('chartName') chartName;

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
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          var label = data.datasets[tooltipItem.datasetIndex].label || "";
          console.log("tooltip point", label,data["datasets"]);
          this.selectedBar=label;
          // var dataset = data["datasets"].filter(d=>d.label==this.selectedBar).data[0];

          return label;
        }
      }
    }
  };
  public barChartLabels = ['2019'];
  public barChartType: ChartType = 'bar';
  // public barChartType: ChartType = 'horizontalBar';

  public barChartLegend = true;
  // public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
  ];
  selectedBar: any="";

  constructor(private httpService:DashboardService) { }

  ngOnInit() {
  }

  // events
  public chartClicked(e): void {

    // const activePoints = this.barChartType.getElementAtEvent(e.event);
    console.log("chart clicked",this.chartName,this.selectedBar,)
    this.httpService.updatedChartStatus({chartName:this.chartName,selectedBar:this.selectedBar})


  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

 
ngOnChanges(changes:SimpleChanges){
  // console.log("on changes",changes);
  let result=[];
  if(changes.inputForBarChart.currentValue){

    let dataArray=[...changes.inputForBarChart.currentValue];
debugger
    dataArray.forEach(element => {

      let obj={
        data:[element.avg] || [0],
        label:element.name
      }
      result.push(obj);
      
    });

    //
    
    console.log("result",result)
    if(result)
    this.barChartData=result || [];



  }

}
}

