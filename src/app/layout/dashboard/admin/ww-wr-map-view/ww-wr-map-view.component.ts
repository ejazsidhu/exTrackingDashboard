import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../dashboard.service';
import {environment} from '../../../../../environments/environment';
import * as moment from 'moment';



@Component({
  selector: 'app-wwwr-map-view',
  templateUrl: './ww-wr-map-view.component.html',
  styleUrls: ['./ww-wr-map-view.component.scss']
})
export class WwWrMapViewComponent implements OnInit {
  towns: any = [];
  availableStock: any = [];

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
  latitude = 31.948084;
  longitude = 72.715577;
  colorType1 = '../../../../../assets/map-marker-icons/';
  colorType = 'http://ndn1.concavetech.com/dist/assets/map-marker-icons/';
  loading = false;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  fitBounds = true;





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
    this.latitude = 31.948084;
    this.longitude = 72.715577;

  }

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
      mapViewType: 'ww-wr',
      selectedDate: moment(this.chooseDate).format('YYYY-MM-DD'),
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
      mapViewType: 'ww-wr',
      selectedDate: moment(this.chooseDate).format('YYYY-MM-DD'),
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
    // console.log(visitType);
    window.open(`${environment.hash}dashboard/evaluation/shop_list/details/${id}/${visitType}?location=evaluation&`, '_blank');
  }

  resetFilters() {
    this.selectedRegionFilter = -1;
    this.selectedZoneFilter = -1;
    this.selectedDe = -1;
    this.selectedDsr = -1;
    this.chooseDate = new Date();
  }

  getShopsForDETracking() {
    this.loading = true;
    const obj = {
      zoneId: this.selectedZoneFilter,
      regionId: this.selectedRegionFilter,
      surveyorId: this.selectedDe,
      dsrId: this.selectedDsr,
      selectedDate: moment(this.chooseDate).format('YYYY-MM-DD'),
      mapViewType: 'ww-wr',
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.getShopsForDETracking(obj).subscribe(res => {
      this.trackedShops = [];
      this.trackedShops = res;
      this.loading = false;
    });

  }

}
