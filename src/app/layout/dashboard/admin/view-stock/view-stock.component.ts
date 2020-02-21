import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../dashboard.service';

@Component({
  selector: 'app-view-stock',
  templateUrl: './view-stock.component.html',
  styleUrls: ['./view-stock.component.scss']
})
export class ViewStockComponent implements OnInit {

  /*factories: any = [{id: 1, title: 'FACTORY - M1'}, {id: 2, title: 'FACTORY - M3'}, {id: 3, title: 'FACTORY - M4'}];*/
  factories: any ;
  territories: any;
  towns: any = [];
  availableStock: any = [];
  selectedFactory: any;
  selectedTerritory: any;
  selectedTown: any;
  isFactoryStock = false;
  isTerritoryStock = false;
  isTownStock = false;



  constructor(private httpService: DashboardService) {
    const obj = { type: 'ALL'};
    this.httpService.getfactoryList(obj).subscribe( factoryList => {
      this.factories = factoryList;
    });
  }

  ngOnInit() {
    this.territories =  JSON.parse(localStorage.getItem('regions') || '[]');
  }

  getFactoryStock() {
    this.isTerritoryStock = false;
    this.isTownStock = false;
    this.isFactoryStock = true;
    this.loadFactroryStockData();
    this.selectedTerritory = undefined;
    this.selectedTown = undefined;
  }

  getTerritoryStock() {
    debugger;
    console.log('selected territory id is ' + this.selectedTerritory);
    this.httpService.getTownList({regionId: this.selectedTerritory}).subscribe(val => {
      const towns = JSON.stringify(val);
      this.towns = JSON.parse(towns);
    });
    this.isFactoryStock = false;
    this.isTownStock = false;
    this.isTerritoryStock = true;
    this.loadTerritoryFamiliesData();
    this.selectedFactory = '';
    this.selectedTown = '';

  }


  getTownStock () {
    this.isFactoryStock = false;
    this.isTownStock = true;
    this.isTerritoryStock = false;
    this.loadTownFamiliesData();

  }


  loadTerritoryFamiliesData() {
    const obj = {
      territoryId: this.selectedTerritory
    };
    this.httpService.getTerritoryFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
  });
  }

  loadTownFamiliesData() {
    const obj = {
      townId: this.selectedTown
    };
    this.httpService.getTownFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
    });
    console.log(this.availableStock);
  }

  loadFactroryStockData() {
    const obj = {factoryId: this.selectedFactory};
    this.httpService.getFactoryStockFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
    });

  }


}
