import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../dashboard.service';
import {environment} from '../../../../../environments/environment';



@Component({
  selector: 'app-census-map-view',
  templateUrl: './census-map-view.component.html',
  styleUrls: ['./census-map-view.component.scss']
})
export class CensusMapViewComponent implements OnInit {
  towns: any = [];
  availableStock: any = [];
  selectedFactory: any;
  selectedTerritory: any;
  selectedTown: any;
  isFactoryStock = false;
  isTerritoryStock = false;
  isTownStock = false;
  zones: any = [];
  regions: any = [];
  selectedRegionFilter: any = -1;
  selectedZoneFilter: any = -1;
  selectedDe: any = -1;
  selectedDsr: any = -1;
  chooseDate = new Date();
  userType = 'DE';
  isAdmin = false;
  DeList: any;
  DsrList: any;
  trackedShops: any = [];
  show: boolean;
  latitude;
  longitude;
  colorType1 = '../../../../../assets/map-marker-icons/';
  colorType = 'http://ndn1.concavetech.com/dist/assets/map-marker-icons/';
  loading = false;





  constructor(private httpService: DashboardService) {}

  ngOnInit() {
    // tslint:disable-next-line:radix
    if (parseInt(localStorage.getItem('user_zone_id')) === -1) {
      //   this.getTabsData();
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.zones = JSON.parse(localStorage.getItem('zones'));
 /*   this.regions = JSON.parse(localStorage.getItem('regions'));*/
    this.latitude = 31.501804;
    this.longitude =  74.335541;

  }

/*

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

  }*/



/*  loadTerritoryFamiliesData() {
    const obj = {
      territoryId: this.selectedTerritory
    };
    this.httpService.getTerritoryFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
  });
  }*/


  getRegionsByZoneId() {
    // tslint:disable-next-line:triple-equals radix
    if ( parseInt(localStorage.getItem('user_zone_id')) == -1) {
      let parsedData: any = [];
      const obj = {
        zoneId : this.selectedZoneFilter
      };
      this.httpService.getRegionsByZoneId(obj).subscribe(data => {
        parsedData = JSON.stringify(data);
        this.regions = JSON.parse(parsedData);

      });
    }
  }

  getDeListByRegionId() {

    const obj = {
      zoneId: (this.selectedZoneFilter) ? this.selectedZoneFilter : -1,
      regionId: (this.selectedRegionFilter) ? this.selectedRegionFilter : -1,
      mapViewType: 'census',
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.getDeListByRegionIdForDETracking(obj).subscribe( data => {
      this.DeList = data;
    });
  }

  getDsrsBySurveyorId() {
    const obj = {
      surveyorId: (this.selectedDe) ? this.selectedDe : -1,
      dsrType: 'DSR',
      mapViewType: 'census',
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.getDsrListBySurveyorIdForDETracking(obj).subscribe(data => {
      this.DsrList = data;

    });
  }

  selectFilters(data?) {
    if (data === 'zoneSelected') {
      this.getRegionsByZoneId();
      this.selectedRegionFilter = -1;
      this.selectedDe = -1;
     this.selectedDsr = -1;
    } else if (data === 'regionSelected') {
      this.getDeListByRegionId();
      this.selectedDe = -1;
      this.selectedDsr = -1;
    } else if (data === 'deSelected') {
      this.getDsrsBySurveyorId();
      this.selectedDsr = -1;
    }
  }

  goToEvaluation(id, visitType) {
    window.open(`${environment.hash}dashboard/evaluation/shop_list/details/${id}/${visitType}?location=shop`, '_blank');
  }

  resetFilters() {
    this.selectedRegionFilter = -1;
    this.selectedZoneFilter = -1;
    this.selectedDe = -1;
    this.selectedDsr = -1;
  }

  getShopsForDETracking() {
    this.loading = true;
    const obj = {
      zoneId: this.selectedZoneFilter,
      regionId: this.selectedRegionFilter,
      surveyorId: this.selectedDe,
      dsrId: this.selectedDsr,
      mapViewType: 'census',
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.getShopsForDETracking(obj).subscribe(res => {
      this.trackedShops = [];
      this.trackedShops = res;
      this.loading = false;
    });

  }

}
