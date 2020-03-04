import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'primary-dashboard-charts',
  templateUrl: './primary-dashboard-charts.component.html',
  styleUrls: ['./primary-dashboard-charts.component.scss']
})
export class PrimaryDashboardChartsComponent implements OnInit, OnChanges {

  loading=false;
  @Input('chartsData') chartsData; 
  factoryChartData: any=[];

  constructor() { }

  ngOnChanges(){
    this.getDistinctFactories([...this.chartsData])

  }
  ngOnInit() {
    // this.getDistinctFactories([...this.chartsData])

  }

  getDistinctFactories(data){
    this.factoryChartData=[];
    this.loading=true
    const factoryIds: any = data.map(b => b.sendder);
    let factoryDistinctList = [...new Set(factoryIds)];
    console.log("factoryDistinctList",factoryDistinctList);

    factoryDistinctList.forEach(element => {
      let obj={
        // id:data.filter(f=>f.sendder==element).sender_location_id,
        label:element,
        data:this.getTotal(data.map(f=>f.qty))
      }

      this.factoryChartData.push(obj);


      
    });

    setTimeout(() => {
      this.loading=false;
    }, 2000);
  }


  getTotal(list) {
    
    let avg = list.reduce((a, b) => {
      return a + b;
    });
    
    return Math.round(avg);
  }

}
