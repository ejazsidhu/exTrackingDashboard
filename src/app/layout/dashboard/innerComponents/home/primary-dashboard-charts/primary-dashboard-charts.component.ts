import { Component, OnInit, Input, OnChanges } from "@angular/core";

@Component({
  selector: "primary-dashboard-charts",
  templateUrl: "./primary-dashboard-charts.component.html",
  styleUrls: ["./primary-dashboard-charts.component.scss"]
})
export class PrimaryDashboardChartsComponent implements OnInit, OnChanges {
  loading = false;
  @Input("chartsData") chartsData;
  factoryChartData: any = [];
  brandAchievementAvgList: any[];
  territoryAchievementAvgList: any=[];
  townAchievementAvgList: any=[];

  constructor() {}

  ngOnChanges() {
    this.getDistinctFactories([...this.chartsData]);
    this.getDistinctBrand([...this.chartsData]);
    let town = [];
    town = [...this.chartsData].filter(t => t.recevier_type == "TOWN");
    if(town.length>0)this.getDistinctTown([...town])
    let territory = [];
    territory = [...this.chartsData].filter(
      t => t.recevier_type == "TERRITORY"
    );
    if(territory.length>0)this.getDistinctTerritories([...territory])

  }
  ngOnInit() {
    // this.getDistinctFactories([...this.chartsData])
  }

  getDistinctFactories(data) {
    this.factoryChartData = [];
    this.loading = true;
    const factoryIds: any = data.map(b => b.sender);
    let factoryDistinctList = [...new Set(factoryIds)];
    console.log("factoryDistinctList", factoryDistinctList);

    factoryDistinctList.forEach(element => {
      let obj = {
        // id:data.filter(f=>f.sendder==element).sender_location_id,
        label: element,
        data: this.getTotal(data.map(f => f.qty))
      };

      this.factoryChartData.push(obj);
    });

    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  getDistinctBrand(data) {
    this.brandAchievementAvgList = [];
    const brandIds: any = data.map(b => b.family_id);
    let brandDistinctList = [...new Set(brandIds)];

    brandDistinctList.forEach(element => {
      let obj = {
        id: element,
        name: data.filter(b => b.family_id == element)[0].family_title,
        avg: this.getTotal(data.map(f => (f.family_id == element ? f.qty : 0)))
      };

      this.brandAchievementAvgList.push(obj);
    });

    console.log(this.brandAchievementAvgList, "brand list primary ");
  }

  getDistinctTerritories(data) {
    this.territoryAchievementAvgList=[]
    const territoryIds: any = data.map(b => b.receiver_location_id);
    let territoryDistinctList = [...new Set(territoryIds)];
    territoryDistinctList.forEach(element => {
      let obj = {
        id: element,
        name: data.filter(b => b.receiver_location_id == element)[0].recevier,
        avg: this.getTotal(data.map(f => (f.receiver_location_id == element ? f.qty : 0)))
     
      };

      this.territoryAchievementAvgList.push(obj);
     
    });
  }
  getDistinctTown(data){
    this.townAchievementAvgList=[]
    const townIds: any = data.map(b => b.receiver_location_id);
    let townDistinctList = [...new Set(townIds)];
    townDistinctList.forEach(element => {
      let obj = {
        id: element,
        name: data.filter(b => b.receiver_location_id == element)[0].recevier,
        avg: this.getTotal(data.map(f => (f.receiver_location_id == element ? f.qty : 0)))
     
      };
      this.townAchievementAvgList.push(obj);
     
    });
  }

  getTotal(list) {
    let avg = list.reduce((a, b) => {
      return a + b;
    });

    return Math.round(avg);
  }
}
