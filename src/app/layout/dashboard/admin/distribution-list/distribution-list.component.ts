import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { error } from '@angular/compiler/src/util';
import { subscribeOn } from 'rxjs/operators';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
declare const google: any;

@Component({
  selector: 'app-distribution-list',
  templateUrl: './distribution-list.component.html',
  styleUrls: ['./distribution-list.component.scss']
})
export class DistributionListComponent implements OnInit {
  @ViewChild('staticMapModal') staticMapModal: ModalDirective;
  @ViewChild('googleMapModal') googleMapModal: ModalDirective;
  @ViewChild('updateDistributionModal') updateDistributionModal: ModalDirective;
  title = '';
  distributionList: any;
  cloneDistributionList: any;
  latLongIndex: any;
  selectedDistribution: any;
  selectedDistributionId: any;
  currentLat: number;
  currentLong: number;
  selectedLat: number;
  updateDistribution: boolean;
  selectedLong: number;
  updatedLat: number;
  updatedLong: number;
  updateColor: boolean;
  selectedDistributionName: any;
  selectedDistributionLat: any;
  loading = false;
  selectedDistributionLong: any;
  selectedDistributionType: any;
  selectedRegion: any;
  selectedCity: any;
  selectedSurveyor: any;
  investment: any;
  totalDSR: any;
  totalDE: any;
  regions: any = [];
  cities: any = [];
  surveyors: any = [];


  constructor(private httpService: DashboardService, private toastr: ToastrService) { }

  ngOnInit() {
    this.updateDistribution = false;
    this.getDistributionList(-1);
    this.getSurveyorList();
    this.getRegions();
    this.getCities();

  }

  getDistributionList(regionId) {
    this.loading = true;
    const obj = {
      regionId: regionId
    };
    this.httpService.getDistributionList(obj).subscribe(
      list => {
        if (list) {
          console.log(list);
          this.distributionList = list;
          this.cloneDistributionList = list;
          this.loading = false;
        }
      }
    );

  }

  onDistributionTypeChange() {

    if (this.selectedDistributionType === 'SUB') {
      this.getRegions();
    }
    if (this.selectedDistributionType === 'SOLE') {
      this.getCities();
    }

  }

  getRegions() {
    this.httpService.getRegionFixed().subscribe(data => {
      if (data) {

        this.regions = data;
        console.log(this.regions);
        // this.selectedRegion=data[0]
        setTimeout(() => {

        }, 1000);
      }

    });
  }

  getCities() {
    this.httpService.getTownList({ regionId: -1 }).subscribe(data => {
      console.log(data);
      if (data) {
        this.cities = data;
      }
    });
  }

  getSurveyorList() {
    this.httpService.getSurveyorList().subscribe(
      list => {
        if (list) {
          console.log(list);
          this.surveyors = list;
        }
      }, error => {

      }
    );

  }


  showChildModal(distribution: any): void {
    this.selectedDistribution = distribution;
    this.selectedLat = parseFloat(distribution.latitude);
    this.selectedLong = parseFloat(distribution.longitude);
    this.initMap();
  }

  hideChildModal(): void {
    this.staticMapModal.hide();
  }



  initMap() {
    const that = this;
    // var marksman = {lat: 31.502102, lng: 74.335109};
    that.updatedLat = this.selectedLat || 31.502102;
    that.updatedLong = this.selectedLong || 74.335109;
    const myLatlng = new google.maps.LatLng(that.updatedLat, that.updatedLong);

    const mapOptions = {
      zoom: 15,
      center: myLatlng
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOptions);

    const marker = new google.maps.Marker({
      position: myLatlng,
      draggable: true,
      map: map,
      title: this.selectedDistribution.title || 'Marksman Office'
    });
    const infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'dragend', function (event) {
      that.updatedLat = event.latLng.lat();
      that.updatedLong = event.latLng.lng();

      console.log(that.updatedLat + ' : ' + that.updatedLong);
      infoWindow.open(map, marker);
      infoWindow.setContent('Your Location!');
      infoWindow.open(map);

    });

    this.googleMapModal.show();
  }

  updateDistributorLocation() {
    this.googleMapModal.hide();
    const index = this.distributionList.findIndex((e) => e.id === this.selectedDistribution.id);
    this.latLongIndex = index;
    this.distributionList[index].latitude = this.updatedLat.toFixed(6);
    this.distributionList[index].longitude = this.updatedLong.toFixed(6);

    console.log(this.distributionList);
    const obj = {
      distributionId: this.selectedDistribution.id,
      distLat: this.updatedLat.toFixed(6) || this.selectedDistribution.latitude,
      distLong: this.updatedLong.toFixed(6) || this.selectedDistribution.longitude,
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.updateDistribution(obj).subscribe(
      (res: any) => {
        if (res.status) {
          // this.toastr.success('Distribution Location Update Successfully', 'Update Status');
        } else {
          // this.toastr.error('Distribution Location Update Un-Successfully', 'Update Status');
        }

      }
    );
  }

  editDistribution(distribution) {
    this.updateDistribution = true;
    this.title = 'Update Distribution';
    console.log(distribution);
    this.selectedDistribution = distribution;
    this.selectedDistributionId = distribution.id;
    this.selectedDistributionName = distribution.title;
    this.selectedDistributionLat = distribution.latitude;
    this.selectedDistributionLong = distribution.longitude;
    this.selectedDistributionType = distribution.distribution_type;
    this.selectedRegion = distribution.region_id;
    this.selectedCity = distribution.city_id;
    this.selectedSurveyor = distribution.surveyor_id;
    this.totalDSR = distribution.total_dsr;
    this.totalDE = distribution.total_de;
    this.investment = distribution.investment;
    this.onDistributionTypeChange();
    this.updateDistributionModal.show();

  }


  updateDistributionData() {
    let region = -1;
    let city = -1;
    if (this.selectedDistributionType === 'SOLE') {
      region = this.selectedRegion;
    }
    if (this.selectedDistributionType === 'SUB') {
      city = this.selectedCity;
    }
    const obj = {
      distributionId: this.selectedDistribution.id,
      distLat: this.selectedDistributionLat,
      distLong: this.selectedDistributionLong,
      distName: this.selectedDistributionName,
      totalDE: this.totalDE,
      totalDSR: this.totalDSR,
      investment: this.investment,
      distType: this.selectedDistributionType,
      regionId: region,
      cityId: city,
      userId: localStorage.getItem('user_id'),
    };
    console.log(obj);
    this.httpService.updateDistribution(obj).subscribe(
      (res: any) => {
        if (res.status) {
          this.toastr.success(res.message, 'Update Status');
          this.getDistributionList(-1);
          this.updateDistributionModal.hide();
        } else {
          this.toastr.error(res.message, 'Update Status');
        }

      }
    );


  }


  saveDistributionData() {
    let region = -1;
    let city = -1;
    if (this.selectedDistributionType === 'SOLE') {
      region = this.selectedRegion;
    }
    if (this.selectedDistributionType === 'SUB') {
      city = this.selectedCity;
    }
    const obj = {
      distributionId: -1,
      distLat: this.selectedDistributionLat.toFixed(6),
      distLong: this.selectedDistributionLong.toFixed(6),
      distName: this.selectedDistributionName,
      totalDE: this.totalDE,
      totalDSR: this.totalDSR,
      investment: this.investment,
      distType: this.selectedDistributionType,
      regionId: region,
      cityId: city,
      userId: localStorage.getItem('user_id'),
    };
    console.log(obj);
    this.httpService.updateDistribution(obj).subscribe(
      (res: any) => {
        if (res.status) {
          this.toastr.success(res.message, 'Update Status');
          this.getDistributionList(-1);
          this.updateDistributionModal.hide();
        } else {
          this.toastr.error(res.message, 'Update Status');
        }

      }
    );

  }

  onRegionChange() {
    this.selectedCity = undefined;
    this.getDistributionList(this.selectedRegion);
  }


  showAddDistributionModal() {
    this.updateDistributionModal.show();
    this.updateDistribution = false;
    this.title = 'Add New Distribution';
  }

}
