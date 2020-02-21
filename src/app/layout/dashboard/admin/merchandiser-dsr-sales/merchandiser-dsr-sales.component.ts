import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DashboardService } from '../../dashboard.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-merchandiser-dsr-sales',
  templateUrl: './merchandiser-dsr-sales.component.html',
  styleUrls: ['./merchandiser-dsr-sales.component.scss']
})
export class MerchandiserDsrSalesComponent implements OnInit {


  constructor(public toastr: ToastrService, public router: Router, private httpService: DashboardService) { }
  @ViewChild('updateSales') updateSales: ModalDirective;
  @ViewChild('addSaleTarget') addSaleTarget: ModalDirective;
  title = 'Edit Sales Data';
  sortBy: any;
  sortOrder: boolean;
  zones: any = [];
  regions: any = [];
  channels: any = [];
  areas: any = [];
  cities: any = [];
  date = new Date();
  bsValue = new Date();
  startDate = new Date();
  endDate = new Date();
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  selectedZone: any = {};
  selectedRegion: any = {};
  selectedDSR: any = -1;
  selectedSurveyorId = -1;
  retailValue: any;
  wholeSaleValue: any;
  retailValueNew: any;
  wholeSaleValueNew: any;
  selectedDsrSale: any;
  loading: boolean;
  selectedCity: any = {};
  selectedDistribution: any = {};
  selectedStoreType: any = '';
  tableData: any = [];
  dsrList: any = [];
  distributionList: any = [];
  visitType: any = '';
  storeType: any = ['Elite',
    'Platinum',
    'Gold',
    'Silver',
    'Others'];
  loadingData: boolean;
  selectedArea: {};
  loadingReportMessage: boolean;
  DeList: any;
  selectedDENew: any = [];
  selectedDSRNew: any = [];
  familyList: any = [];
  selectedFamily: any = [];
error;
  ngOnInit() {
    // tslint:disable-next-line:prefer-const
    let t = moment(new Date).format('YYYY-MM-DD');
    // tslint:disable-next-line:prefer-const
    let st = localStorage.getItem('today');
    if (t > st) {
      this.router.navigate(['/login']);
    }
    this.zones = JSON.parse(localStorage.getItem('zones'));
    this.getTabsData();
  }


  getZone() {
    this.httpService.getZone().subscribe(
      data => {
        const res: any = data;
        if (res.zoneList) {
          localStorage.setItem('zoneList', JSON.stringify(res.zoneList));
          localStorage.setItem('assetList', JSON.stringify(res.assetList));
          localStorage.setItem('channelList', JSON.stringify(res.channelList));
        }
      },
      error => {
        this.clearLoading();

        error.status === 0 ? this.toastr.error('Please check Internet Connection', 'Error') : this.toastr.error(error.description, 'Error');
      }
    );
  }


  getRegionsByZoneId() {
    let parsedData: any = [];
    const obj = {
      zoneId: this.selectedZone.id
    };
    this.httpService.getRegionsByZoneId(obj).subscribe(data => {
      parsedData = JSON.stringify(data);
      this.regions = JSON.parse(parsedData);
    });
  }

  getDSRListByDE() {
    const obj = {
      deId: this.selectedDENew || this.selectedSurveyorId || -1
    };
    this.httpService.getDSRsByDEId(obj).subscribe(
      data => {
        console.log(data);
        const res: any = data;
        if (res) {
          this.dsrList = res;
        } else {
          this.clearLoading();

          this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
        }

        setTimeout(() => {
          this.loadingData = false;
        }, 500);
      },
      error => {
        this.clearLoading();

      }
    );
  }

  zoneChange() {
    this.loadingData = true;

    // this.getTabsData();


    this.httpService.getRegion(this.selectedZone.id).subscribe(
      data => {
        const res: any = data;
        if (res) {
          this.regions = res;
        } else {
          this.clearLoading();

          this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
        }

        setTimeout(() => {
          this.loadingData = false;
        }, 500);
      },
      error => {
        this.clearLoading();

      }
    );
  }

  getTabsData(data?: any, dateType?: string) {
    this.selectedDENew = this.selectedSurveyorId;
    this.loading = true;
    if (dateType === 'zone') {
      this.selectedRegion.id = -1;
      this.selectedCity.id = -1;
      this.selectedSurveyorId = -1;
      this.selectedDSR = -1;
      this.DeList = [];
      this.dsrList = [];
    }
    if (dateType === 'territory') {
      this.selectedCity.id = -1;
      this.selectedSurveyorId = -1;
      this.selectedDSR = -1;
      this.dsrList = [];
      this.getDeListByRegionId();
    }
    if (dateType === 'de') {
      this.selectedDSR = -1;
      this.getDSRListByDEId();
    }


    const obj: any = {
      zoneId: (this.selectedZone.id) ? this.selectedZone.id : -1,
      regionId: (this.selectedRegion.id) ? this.selectedRegion.id : -1,
      startDate: (dateType === 'start') ? moment(data).format('YYYY-MM-DD') : moment(this.startDate).format('YYYY-MM-DD'),
      endDate: (dateType === 'end') ? moment(data).format('YYYY-MM-DD') : moment(this.endDate).format('YYYY-MM-DD'),
      cityId: this.selectedCity.id || -1,
      distributionId: this.selectedDistribution.id || -1,
      storeType: this.selectedStoreType,
      channelId: -1,
      dsrId: this.selectedDSR || -1,
      surveyorId: this.selectedSurveyorId,
      visitType: this.visitType,
      userId: localStorage.getItem('user_id'),
    };
    console.log(obj);
    localStorage.setItem('obj', JSON.stringify(obj));
    this.getTableData(obj);
    if (this.selectedZone.id) {
      this.getRegionsByZoneId();
    }
    if (this.selectedRegion.id) {
      this.onRegionChange(this.selectedRegion.id);
    }
  }



  getTableData(obj) {
    this.loadingData = true;
    this.tableData = [];
    this.httpService.merchandiserDsrSales(obj).subscribe(data => {
      console.log(data, 'table data');
      const res: any = data;

      if (res) {
        this.tableData = res;
        if (this.tableData.length === 0) {
          this.toastr.info('No data found against selected data.', 'Info');
        }
        this.loadingData = false;
      }
      // if (res.planned == 0)
      //   this.toastr.info('No data available for current selection', 'Summary')
    }, error => {
      // this.clearLoading();

      console.log(error, 'Error');

    });
  }

  getDSRListByDEId() {
    const obj = {
      deId: this.selectedSurveyorId,
    };
    this.httpService.getDSRsByDEId(obj).subscribe( data => {
      this.dsrList = data;
    });

  }

  onRegionChange(regionId) {
    let parsedData: any = [];
    const obj = {
      regionId: regionId
    };
    this.httpService.getTownList(obj).subscribe(data => {
      parsedData = JSON.stringify(data);
      this.cities = JSON.parse(parsedData);
    });
  }

  getFamilies() {
    this.httpService.getFamilies().subscribe(data => {
      console.log(data);
      const res: any = data;

      if (res) {
        this.familyList = res;
        this.loadingData = false;
      }
    }, error => {
      // this.clearLoading();

      console.log(error, 'Error');

    });
  }

  clearLoading() {
    this.loading = false;
    this.loadingData = false;
    this.loadingReportMessage = false;
  }

  sortIt(key) {
    this.sortBy = key;
    this.sortOrder = !this.sortOrder;
  }
  getArrowType(key) {
    if (key === this.sortBy) {
      return (this.sortOrder) ? 'arrow_upward' : 'arrow_downward';
    } else {
      return '';
    }
  }

  openDsrSaleModal(item) {
    this.selectedDsrSale = item;
    this.retailValue = item.retailValue;
    this.wholeSaleValue = item.wholeSaleValue;
    this.showUpdateSalesModal();
    console.log(item);
  }



  showUpdateSalesModal(): void {
    this.updateSales.show();
  }

  hideUpdateSalesModal(): void {
    this.updateSales.hide();
  }

  showAddSaleTargetModal(): void {

    this.getDeListByRegionId();
    this.getDSRListByDE();
    this.getFamilies();
    this.addSaleTarget.show();
  }

  hideAddSaleTargetModal(): void {
    this.selectedDENew = -1;
    this.selectedDSRNew = -1;
    this.selectedFamily = -1;
    this.wholeSaleValueNew = [];
    this.retailValueNew = [];
    this.addSaleTarget.hide();
  }

  updateDsrSale() {
    const obj: any = {
      dsrSaleId: this.selectedDsrSale.dsr_sales_id,
      retailValue: this.retailValue,
      wholeSaleValue: this.wholeSaleValue,
      userId: localStorage.getItem('user_id'),
    };

    this.httpService.updateDsrSales(obj).subscribe(data => {
      console.log(data, 'table data');
      const res: any = data;

      if (res) {
        this.clearLoading();
        this.hideUpdateSalesModal();
        this.loadingData = false;
        if (res.status) {
          this.getTabsData();
          this.toastr.success(res.message, 'Message');
        } else {
          this.toastr.error(res.message, 'Message');
        }
      }
      // if (res.planned == 0)
      //   this.toastr.info('No data available for current selection', 'Summary')
    });
  }

  getDeListByRegionId() {

    const obj = {
      zoneId: (this.selectedZone.id) ? this.selectedZone.id : -1,
      regionId: (this.selectedRegion.id) ? this.selectedRegion.id : -1,
    };
    this.httpService.getDEListByRegionId(obj).subscribe( data => {
      this.DeList = data;
      console.log(this.DeList);
    });
  }

  saveDsrSale() {
    const obj = {
      date: moment(this.date).format('YYYY-MM-DD'),
      surveyorId: this.selectedDENew,
      dsrId: this.selectedDSRNew,
      familyId: this.selectedFamily,
      retailValue: this.retailValueNew,
      wholeSaleValue: this.wholeSaleValueNew,
      userId: localStorage.getItem('user_id'),
    };
    console.log(obj);
    this.httpService.saveDsrSale(obj).subscribe(data => {
      console.log(data, 'table data');
      const res: any = data;

      if (res.status) {
          this.toastr.info(res.message, res.title);
        } else {
          this.toastr.info(res.message, res.title);
        }
        this.loadingData = false;
      // if (res.planned == 0)
      //   this.toastr.info('No data available for current selection', 'Summary')
    }, error  => {
      // this.clearLoading();

      console.log(error, 'Error');

    });
  }
  resetFilters() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.selectedZone = -1;
    this.selectedRegion = -1;
    this.selectedCity = -1;
    this.selectedSurveyorId = -1;
    this.selectedDSR = -1;
    this.getTabsData();
  }


}
