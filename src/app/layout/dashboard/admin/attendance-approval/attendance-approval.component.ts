import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../dashboard.service';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-attendance-approval',
  templateUrl: './attendance-approval.component.html',
  styleUrls: ['./attendance-approval.component.scss']
})
export class AttendanceApprovalComponent implements OnInit {

  /*factories: any = [{id: 1, title: 'FACTORY - M1'}, {id: 2, title: 'FACTORY - M3'}, {id: 3, title: 'FACTORY - M4'}];*/

  towns: any = [];
  dataTable: any = [];
  selectedTerritory: any;
  isFactoryStock = false;
  isTerritoryStock = false;
  isTownStock = false;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  zones: any = [];
  regions: any = [];
  selectedRegion: any = -1;
  selectedZoneFilter: any = -1;
  chooseDate = new Date();
  userType = 'DE';
  isAdmin = false;


  constructor(private httpService: DashboardService , private toasterService: ToastrService) {

  }

  ngOnInit() {
    // tslint:disable-next-line:radix
    if (parseInt(localStorage.getItem('user_zone_id')) === -1) {
      //   this.getTabsData();
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.zones = JSON.parse(localStorage.getItem('zones'));
    this.regions = JSON.parse(localStorage.getItem('regions'));
  }

  getUsers() {

    const obj = {
      // tslint:disable-next-line:radix
      zoneId: (this.selectedZoneFilter) ? this.selectedZoneFilter : parseInt(localStorage.getItem('user_zone_id')),
      // tslint:disable-next-line:radix
      regionId: (this.selectedRegion) ? this.selectedRegion : parseInt(localStorage.getItem('regionId')),
      selectedDate: moment(this.chooseDate).format('YYYY-MM-DD'),
      userType: this.userType,
      userId: localStorage.getItem('user_id'),
    };
    console.log(obj);
    this.httpService.getAttendanceDataForApproval(obj).subscribe( value => {
    this.dataTable = value;
  });
  }

  updateAttendanceApproval(attendanceId) {
    const obj = {
      attendanceId: attendanceId,
      approvalStatus: 'Y',
      userName: localStorage.getItem('username'),
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.updateAttendanceApproval(obj).subscribe((res: any) => {
      if (res.status === true) {
        this.toasterService.success('Status approved');
        this.getUsers();
      } else {
        this.toasterService.error('Something went wrong.');

      }
    });
  }

  resetFilters() {
    this.selectedZoneFilter = -1;
    this.selectedRegion = -1;
    this.chooseDate = new Date();
  }

  getRegionsByZoneId() {
    // tslint:disable-next-line:triple-equals
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

}
