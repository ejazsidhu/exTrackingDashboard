import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';
import { ExcelService } from '../../excel.service';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-add-town',
  templateUrl: './add-town.component.html',
  styleUrls: ['./add-town.component.scss']
})
export class AddTownComponent implements OnInit {

  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild('addTown') addTown: ModalDirective;
  loading = false;
  attendanceList: any;
  selectedWorkType: any = {};
  tableData: any = [];
  selectedId: any;
  selectedWorkTypeId: any;
  selectedWork: any;
  selectedRegionFilter = -1;
  selectedZoneFilter = -1;
  selectedAttendanceType: any = '';
  regions: any = [];
  zones: any = [];
  townList: any = [];
  downloadList = [{ key: 'csv', title: 'CSV', icon: 'fa fa-file-text-o' }, { key: 'xlsx', title: 'Excel', icon: 'fa fa-file-excel-o' }];
  selectedFileType: any = {};
  sortBy: any;
  sortOrder: boolean;
  isAdmin = false;
  selectedTownName =  '';
  selectedTownId = -1;
  selectedZoneIdForTownModal = -1;
  selectedRegionIdForTownModal = -1;
  townNameForAddTown = '';
  townObject = {
    cityName : '',
    cityId : -1
  };

  constructor(private httpService: DashboardService, private toastr: ToastrService, private excelService: ExcelService) { }

  ngOnInit() {
    if (parseInt(localStorage.getItem('user_zone_id')) === -1) {
      //   this.getTabsData();
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    this.zones = JSON.parse(localStorage.getItem('zones'));

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
      /* this.regions = data;*/

      });
    }
  }

  getTownListByRegionId() {
    this.httpService.getTownList({regionId: this.selectedRegionFilter}).subscribe(val => {
      const towns = JSON.stringify(val);
      this.townList = JSON.parse(towns);
    });
  }


  getArrowType(key) {
    if (key === this.sortBy) {
      return (this.sortOrder) ? 'arrow_upward' : 'arrow_downward';
    } else {
      return '';
    }
  }

  sortIt(key) {
    this.sortBy = key;
    this.sortOrder = !this.sortOrder;
  }

  resetFilters() {
    this.selectedRegionFilter = -1;
    this.selectedZoneFilter = -1;
  }

  showChildModal(town?): void {
    this.selectedTownName = town.title;
    this.selectedTownId = town.id;
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  showAddTownModal(item?): void {

    this.addTown.show();
  }

  hideAddTownModal(): void {
    this.addTown.hide();
  }

  addCity() {
  const obj = {
    regionId: this.selectedRegionIdForTownModal,
    cityName: this.townNameForAddTown,
    userId: localStorage.getItem('user_id'),
  };
  this.httpService.addTownFromPortal(obj).subscribe( (res: any) => {

    if (res.status) {
      this.toastr.success(res.message);
      this.selectedRegionIdForTownModal = -1;
      this.selectedZoneIdForTownModal = -1;
      this.townNameForAddTown = '';
      this.httpService.getTownList({regionId: this.selectedRegionFilter}).subscribe(val => {
        const towns = JSON.stringify(val);
        this.townList = JSON.parse(towns);
      });
      this.addTown.hide();
    } else {
      this.toastr.warning(res.message);
    }
  });
  }

  updateTown() {
    const obj = {
      cityName: this.selectedTownName,
      cityId: this.selectedTownId,
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.updateTownFromPortal(obj).subscribe( (res: any) => {

      if (res.status) {
        this.toastr.success(res.message);
        this.selectedTownName = '';
        this.selectedTownId = -1;
        this.httpService.getTownList({regionId: this.selectedRegionFilter}).subscribe(val => {
          const towns = JSON.stringify(val);
          this.townList = JSON.parse(towns);
        });
        this.addTown.hide();
      } else {
        this.toastr.warning(res.message);
      }
    });
  }
}
