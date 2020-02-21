import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import {environment} from '../../../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'app-map-with-waypoints-track',
  templateUrl: './map-with-waypoints-track.component.html',
  styleUrls: ['./map-with-waypoints-track.component.scss']
})
export class MapWithWaypointsTrackComponent implements OnInit {

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
  latitude;
  longitude;
  colorType1 = '../../../../../assets/map-marker-icons/';
  colorType = 'http://ndn1.concavetech.com/dist/assets/map-marker-icons/';
  loading = false;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);



  origin = { lat: 31.582045, lng: 74.329376 }
  destination = { lat: 31.5522, lng: 74.2796 }
  waypoints = [
     {location: { lat: 39.0921167, lng: -94.8559005 }},
     {location: { lat: 41.8339037, lng: -87.8720468 }}
  ]

  constructor(private httpService: DashboardService) {}

  ngOnInit() {
    // tslint:disable-next-line:radix
    if (parseInt(localStorage.getItem('user_zone_id')) == -1) {
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
    let obj = {
      surveyorId: (this.selectedDe) ? this.selectedDe : -1,
      dsrType: 'DSR',
      mapViewType: 'ww-wr',
      selectedDate: moment(this.chooseDate).format('YYYY-MM-DD')
    };
    this.httpService.getDsrListBySurveyorIdForDETracking(obj).subscribe(data => {
      this.DsrList = data;

    });
  }

  selectFilters(data?) {
    if (data === 'zoneSelected') {
      this.getRegionsByZoneId();
      this.selectedRegionFilter = -1
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
    this.httpService.getShopsForDETracking(obj).subscribe((res:any) => {
      this.trackedShops = [];
      

      this.trackedShops = res;
      this.origin={lat:+this.trackedShops[0].shop_latitude,lng:+this.trackedShops[0].shop_longitude}

  
      this.destination={lat:+this.trackedShops[this.trackedShops.length-1].shop_latitude,lng:+this.trackedShops[this.trackedShops.length-1].shop_longitude};
      

      let locations=this.trackedShops.map(m=>{
        let obj={location:{lat:(+m.shop_latitude),lng:(+m.shop_longitude)},stopover:false}
        return obj;

      })

      this.waypoints=locations.slice(0,24);
      // this.trackedShops=[];
      // this.trackedShops=[...this.waypoints]
      console.log("waypoints",this.waypoints)

      this.loading = false;
    });

  }

}
