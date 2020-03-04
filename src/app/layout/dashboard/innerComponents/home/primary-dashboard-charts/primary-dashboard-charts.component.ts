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
  brandAchievementAvgList: any[];

  constructor() { }

  ngOnChanges(){
    this.getDistinctFactories([...this.chartsData]);
    this.getDistinctBrand([...this.chartsData])

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

  getDistinctBrand(data){
    debugger
    this.brandAchievementAvgList=[];
    const brandIds: any = data.map(b => b.family_id);
    let brandDistinctList = [...new Set(brandIds)];

    brandDistinctList.forEach(element => {
      let obj = {
        id:element,
        name:data.filter(b => b.family_id == element)[0].family_title,
        avg:this.getTotal(data.map(f=>f.family_id==element?f.qty:0))
      };

      this.brandAchievementAvgList.push(obj);
    });

    console.log(this.brandAchievementAvgList,"brand list primary ")
  }


  getTotal(list) {
    
    let avg = list.reduce((a, b) => {
      return a + b;
    });
    
    return Math.round(avg);
  }

}
