import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import * as moment from 'moment';
import { routerNgProbeToken } from '@angular/router/src/router_module';
@Component({
  selector: 'filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  //#region veriables
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  @Input() title;
  @Input() reportType;
  loadingData: boolean;
  regions: any = [];
  tableData: any = [];
  queryList: any = [];
  selectedQuery: any = {};
  selectedRegion: any = {};
  selectedZoneFilter: any;
  selectedRegionFilter: any;
  selectedTownFilter = -1;
  merchandiser: any = {};
  sortOrder = true;
  sortBy: 'completed';
  startDate = new Date();
  endDate = new Date();
  selectedAttendanceType = -1;
  loadingReportMessage = false;
  tabsData: any = [];
  loading = true;
  RTEList: any = [];
  selectedRTE: any = {};
  merchandiserRTEList: any = [];
  selectedMerchandiserRTE: any = {};
  isAdmin = false;
  selectedStatus: any = '';

  selectedTown: any = {};
  selectedZone: any = {};
  selectedCity: any = {};
  cities: any = [];
  zones: any = [];
  towns: any = [];
  townId: any;
  selectedMeasurment: any = {};
  selectedMonth: any = -1;
  selectedYear: any = -1;

  measurementList = [
    { key: 0.1, value: 'CTN' },
    { key: 1, value: 'M' },
    { key: 5, value: 'Outer' },
    { key: 50, value: 'Packet' },
    { key: 1000, value: 'Sticks' }
  ];

  monthList = [
    { key: 1, value: 'January' },
    { key: 2, value: 'February' },
    { key: 3, value: 'March' },
    { key: 4, value: 'April' },
    { key: 5, value: 'May' },
    { key: 6, value: 'June' },
    { key: 7, value: 'July' },
    { key: 8, value: 'August' },
    { key: 9, value: 'September' },
    { key: 10, value: 'October' },
    { key: 11, value: 'November' },
    { key: 12, value: 'December' }
  ];

  yearList = [{ key: 2018, value: '2018' }, { key: 2019, value: '2019' }, { key: 2020, value: '2020' }];

  //#endregion

  constructor(private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router) { }

  ngOnInit() {
    // this.selectedMeasurment = { key: 1, value: 'M' };
    console.log('report type' + this.reportType);
    this.loading = true;

    console.log(this.router.url);
    if (this.router.url !== '/dashboard/dsr-sale' && this.router.url !== '/dashboard/de_wwwr_summary' &&
      this.router.url !== '/dashboard/export-data') {
      this.getRegions();
    }
    if (this.router.url === '/dashboard/visit_productivity') {
      this.getTabsData();
    }
    if (this.router.url === '/dashboard/raw_data') {
      this.getQueryTypeList();
    }

    this.zones = JSON.parse(localStorage.getItem('zones'));
    this.regions = JSON.parse(localStorage.getItem('regions'));

    if (parseInt(localStorage.getItem('user_zone_id')) === -1) {
      // this.getTabsData();
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
  getRTE(regionId) {
    this.httpService.getRTE(regionId).subscribe((data: any) => {
      if (data) {
        this.RTEList = data;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }

      this.getTabsData();
    });
  }
  getMerchandiserListRTE(regionId) {
    this.httpService.getMerchandiserListRTE(regionId).subscribe((data: any) => {
      if (data) {
        this.merchandiserRTEList = data;
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }


      this.getTabsData();
    });
  }
  regionChange() {
    this.loading = true;
    this.RTEList = [];
    this.selectedRTE = {};
    this.merchandiserRTEList = [];
    this.selectedMerchandiserRTE = {};

    this.getRTE(this.selectedRegion.id);


  }


  regionRTE() {
    this.merchandiserRTEList = [];
    this.selectedMerchandiserRTE = {};
    this.loading = true;
    this.getMerchandiserListRTE(this.selectedRTE.id);

  }

  statsMerchandiserWise() {
    this.loading = true;
    this.getTabsData();
  }
  getQueryTypeList() {
    const obj = {
      userId: localStorage.getItem('user_id'),
    };

    this.httpService.getQueryTypeList(obj).subscribe(data => {
      console.log('qurry list', data);
      if (data) {
        this.queryList = data;
      }

    }, error => {
      (error.status === 0) ?
        this.toastr.error('Please check Internet Connection', 'Error') :
        this.toastr.error(error.description, 'Error');


    });

  }


  downloadReport() {
    if (this.endDate >= this.startDate) {
      this.loadingReportMessage = true;
      const obj = {
        regionId: this.selectedRegion.id || -1,
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
        rteId: this.selectedRTE.id || -1,
        merchandiserId: this.selectedMerchandiserRTE.id || -1,
      };

      const url = 'visitProductivityReport';
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForReport(url, body).subscribe(data => {
        const res: any = data;

        if (res) {
          const obj2 = {
            key: res.key,
            fileType: 'json.fileType'
          };
          const url = 'downloadReport';
          this.getproductivityDownload(obj2, url);
        } else {
          // this.clearLoading()

          this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
        }
      });

    } else {
      this.toastr.info('End date must be greater than start date', 'Date Selection');

    }

  }


  downloadUniqueBaseProductivityReport() {
    if (this.endDate >= this.startDate) {
      this.loadingReportMessage = true;
      this.loadingData = true;
      const obj = {
        regionId: this.selectedRegion.id || -1,
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
      };

      const url = 'capturedAbnormalUnvisited';
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForReport(url, body).subscribe(data => {
        const res: any = data;

        if (res) {
          const obj2 = {
            key: res.key,
            fileType: 'json.fileType'
          };
          const url = 'downloadReport';
          this.getproductivityDownload(obj2, url);
        } else {
          // this.clearLoading()

          this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
        }
      });

    } else {
      this.toastr.info('End date must be greater than start date', 'Date Selection');

    }

  }

  downloadRawDataReport() {

    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        typeId: this.selectedQuery.id,
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
      };

      const url = 'portal/report/dashboard-data';
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(data => {
        console.log(data, 'query list');
        const res: any = data;

        if (res) {
          const obj2 = {
            key: res.key,
            fileType: res.fileType
          };
          const url = 'portal/report/download-csv-report';
          this.getproductivityDownload(obj2, url);
        } else {
          // this.clearLoading()

          this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
        }


      }, error => {
        // this.clearLoading()

      });
    } else {
      // this.clearLoading();
      this.toastr.info('End date must be greater than start date', 'Date Selection');
    }
  }
  downloadAttandanceReport() {
    if (this.endDate >= this.startDate) {
      this.loadingReportMessage = true;
      const obj = {
        regionId: this.selectedRegion.id || -1,
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
      };

      const url = 'merchandiserAttendance';
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForReport(url, body).subscribe(data => {
        const res: any = data;

        if (res) {
          const obj2 = {
            key: res.key,
            fileType: 'json.fileType'
          };
          const url = 'downloadReport';
          this.getproductivityDownload(obj2, url);
        } else {
          // this.clearLoading()

          this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
        }
      });

    } else {
      this.toastr.info('End date must be greater than start date', 'Date Selection');

    }

  }

  getRegions() {
    if (parseInt(localStorage.getItem('user_zone_id')) === -1) {
      this.loading = true;
      this.httpService.getRegionFixed().subscribe(data => {
        if (data) {
          this.regions = data;
          // this.selectedRegion=data[0]
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      });
    }
  }
  getproductivityDownload(obj, url) {
    const u = url;
    this.httpService.DownloadResource(obj, u);
    setTimeout(() => {
      this.loadingData = false;
      this.loadingReportMessage = false;
    }, 1000);

  }

  getAttendanceDownload(obj, url) {
    const u = url;
    this.httpService.DownloadResource(obj, u);
    setTimeout(() => {
      this.loadingData = false;
      this.loadingReportMessage = false;
    }, 1000);

  }

  getTabsData(data?: any, dateType?: string) {

    this.loading = true;
    //
    const obj: any = {
      // zoneId: (this.selectedZone.id) ? this.selectedZone.id : -1,
      regionId: (this.selectedRegion.id) ? this.selectedRegion.id : localStorage.getItem('regionId'),
      startDate: (dateType === 'start') ? moment(data).format('YYYY-MM-DD') : moment(this.startDate).format('YYYY-MM-DD'),
      endDate: (dateType === 'end') ? moment(data).format('YYYY-MM-DD') : moment(this.endDate).format('YYYY-MM-DD'),
      rteId: this.selectedRTE.id || -1,
      merchandiserId: this.selectedMerchandiserRTE.id || -1

    };
    localStorage.setItem('obj', JSON.stringify(obj));
    this.getTableData(obj);


    /*this.httpService.getDashboardData(obj).subscribe(data => {
      // console.log(data, 'home data');
      const res: any = data;
      if (res) {
        this.tabsData = data;
      }
      this.loading = false;
      // if (res.planned == 0)
      //   this.toastr.info('No data available for current selection', 'Summary')
    }, error => {


    });*/


  }
  getTableData(obj) {

    this.httpService.merchandiserShopListCBL(obj).subscribe(data => {
      console.log(data, 'table data');
      const res: any = data;

      if (res) {
        this.tableData = res;
      }
      this.loading = false;
      // if (res.planned == 0)
      //   this.toastr.info('No data available for current selection', 'Summary')
    }, error => {
      // this.clearLoading();

      console.log(error, 'home error');

    });
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

  downloadExportDataReport() {
  
    this.loadingReportMessage = true;
    this.loadingData = true;

    if (this.endDate >= this.startDate) {

      const obj = {
        // tslint:disable-next-line:radix
        zoneId: (this.selectedZoneFilter) ? this.selectedZoneFilter : parseInt(localStorage.getItem('user_zone_id')),
        // tslint:disable-next-line:radix
        regionId: (this.selectedRegionFilter) ? this.selectedRegionFilter : parseInt(localStorage.getItem('regionId')),
        townId: (this.selectedTownFilter) ? this.selectedTownFilter : -1,
        areaId: -1,
        typeId: -1,
        actionType: -1,
        viewType: [],
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
      };
      const url = 'report/export-data';
      const body = this.httpService.UrlEncodeMaker(obj);
      this.getproductivityDownload(obj, url);
      // this.httpService.getKeyForReport(url, body).subscribe(data => {
      //   const res: any = data;

      //   if (res) {
      //     const obj2 = {
      //       key: res.key,
      //       fileType: 'json.fileType'
      //     };
      //     const url = 'downloadReport';
      //     this.getproductivityDownload(obj, url);
      //   } else {
      //     // this.clearLoading()

      //     this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
      //   }
      // });

    } else {
      this.toastr.info('End date must be greater than start date', 'Date Selection');

    }
  }

  downloadDailyEvaluationReport() {
    //
    this.loadingReportMessage = true;
    this.loadingData = true;
    if (this.endDate >= this.startDate) {

      const obj = {
        zoneId: (this.selectedZoneFilter) ? this.selectedZoneFilter : -1,
        regionId: (this.selectedRegionFilter) ? this.selectedRegionFilter : -1,
        townId: (this.selectedTownFilter) ? this.selectedTownFilter : -1,
        areaId: -1,
        typeId: -1,
        actionType: this.reportType,
        viewType: [],
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
      };
      const url = 'portal/report/daily-evaluation-report';
      const body = this.httpService.UrlEncodeMaker(obj);
      this.httpService.getKeyForProductivityReport(body, url).subscribe(data => {
        console.log(data, 'query list');
        const res: any = data;

        if (res) {
          const obj2 = {
            key: res.key,
            fileType: res.fileType
          };
          const url = 'portal/report/download-report';
          this.getproductivityDownload(obj2, url);
        } else {
          // this.clearLoading()

          this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
        }


      }, error => {
        // this.clearLoading()

      });

    } else {
      this.toastr.info('End date must be greater than start date', 'Date Selection');

    }
  }

  downloadDSRAttendanceReport() {
    if (this.selectedAttendanceType === -1) {
      this.toastr.info('Select attendance type', 'Attendance Type Error');
    } else {
      this.loadingReportMessage = true;
      this.loadingData = true;
      if (this.endDate >= this.startDate) {

        const obj = {
          zoneId: (this.selectedZoneFilter) ? this.selectedZoneFilter : -1,
          regionId: (this.selectedRegionFilter) ? this.selectedRegionFilter : -1,
          townId: (this.selectedTownFilter) ? this.selectedTownFilter : -1,
          areaId: -1,
          typeId: -1,
          actionType: this.selectedAttendanceType,
          viewType: [],
          startDate: moment(this.startDate).format('YYYY-MM-DD'),
          endDate: moment(this.endDate).format('YYYY-MM-DD'),
        };
        const url = 'portal/report/attendance-report';
        const body = this.httpService.UrlEncodeMaker(obj);
        this.httpService.getKeyForProductivityReport(body, url).subscribe(data => {
          console.log(data, 'query list');
          const res: any = data;

          if (res) {
            const obj2 = {
              key: res.key,
              fileType: res.fileType
            };
            const url = 'portal/report/download-report';
            this.getproductivityDownload(obj2, url);
          } else {
            // this.clearLoading()

            this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
          }


        }, error => {
          // this.clearLoading()

        });

      } else {
        this.toastr.info('End date must be greater than start date', 'Date Selection');

      }
    }
  }


  downloadDsrDataReport() {

    if (this.selectedMeasurment.key == undefined || this.selectedMeasurment.value == undefined) {
      this.toastr.info('Please, Select measurment', 'Info');
    } else {

      if (this.endDate >= this.startDate) {
        this.loadingReportMessage = true;
        this.loadingData = true;
        const obj = {
          // tslint:disable-next-line:radix
          zoneId: (this.selectedZoneFilter) ? this.selectedZoneFilter : parseInt(localStorage.getItem('user_zone_id')),
          // tslint:disable-next-line:radix
          regionId: (this.selectedRegionFilter) ? this.selectedRegionFilter : parseInt(localStorage.getItem('regionId')),
          townId: (this.selectedTownFilter) ? this.selectedTownFilter : -1,
          measurmentFactor: (this.selectedMeasurment) ? this.selectedMeasurment.key : -1,
          status: (this.selectedStatus) ? this.selectedStatus : '',
          measurmentTitle: this.selectedMeasurment.value,
          startDate: moment(this.startDate).format('YYYY-MM-DD'),
          endDate: moment(this.endDate).format('YYYY-MM-DD'),
          userId: localStorage.getItem('user_id'),
        };
        console.log(obj);
        const url = 'report/dsrSale';
        const body = this.httpService.UrlEncodeMaker(obj);
        this.getproductivityDownload(obj, url);


      } else {
        this.toastr.info('End date must be greater than start date', 'Date Selection');

      }
    }
  }
  downloadDeWWWRReport() {
    this.loadingReportMessage = true;
    this.loadingData = true;
    if (this.endDate >= this.startDate) {

      const obj = {
        // tslint:disable-next-line:radix
        zoneId: (this.selectedZoneFilter) ? this.selectedZoneFilter : parseInt(localStorage.getItem('user_zone_id')),
        // tslint:disable-next-line:radix
        regionId: (this.selectedRegionFilter) ? this.selectedRegionFilter : parseInt(localStorage.getItem('regionId')),
        townId: (this.selectedTownFilter) ? this.selectedTownFilter : -1,
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
      };
      const url = 'report/de-WWWRSummary';
      const body = this.httpService.UrlEncodeMaker(obj);
      this.getproductivityDownload(obj, url);


    } else {
      this.toastr.info('End date must be greater than start date', 'Date Selection');

    }
  }

  getTabData(data?: any, dateType?: string) {
    this.loading = true;
    if (dateType === 'zone') {
      this.selectedRegionFilter = -1;
      this.selectedTownFilter = -1;
    }
    if (dateType === 'territory') {
      this.selectedTownFilter = -1;
    }
    const obj: any = {
      zoneId: (this.selectedZoneFilter) ? this.selectedZoneFilter : -1,
      regionId: (this.selectedRegionFilter) ? this.selectedRegionFilter : -1,
      townId: (this.selectedTownFilter) ? this.selectedTownFilter : -1,
      startDate: (dateType === 'start') ? moment(data).format('YYYY-MM-DD') : moment(this.startDate).format('YYYY-MM-DD'),
      endDate: (dateType === 'end') ? moment(data).format('YYYY-MM-DD') : moment(this.endDate).format('YYYY-MM-DD'),

    };
    localStorage.setItem('obj', JSON.stringify(obj));

    if (this.selectedZoneFilter) {
      this.getRegionsByZoneId();
    }
    if (this.selectedRegionFilter) {
      this.onRegionChange(this.selectedRegionFilter);
    }

  }

  getRegionsByZoneId() {
    if (parseInt(localStorage.getItem('user_zone_id')) === -1) {
      let parsedData: any = [];
      const obj = {
        zoneId: this.selectedZoneFilter
      };
      this.httpService.getRegionsByZoneId(obj).subscribe(data => {
        parsedData = JSON.stringify(data);
        this.regions = JSON.parse(parsedData);
      });
    }
  }

  onRegionChange(regionId) {
    let parsedData: any = [];
    const obj = {
      regionId: regionId,
    };
    this.httpService.getTownList(obj).subscribe(data => {
      parsedData = JSON.stringify(data);
      this.cities = JSON.parse(parsedData);
    });

  }


  downloadSaleAchievementReport() {
    this.loading = true;
    const obj = {
      month: (this.selectedMonth) ? this.selectedMonth : -1,
      year: (this.selectedYear) ? this.selectedYear : -1,
      // tslint:disable-next-line:radix
      zoneId: (this.selectedZoneFilter) ? this.selectedZoneFilter : parseInt(localStorage.getItem('user_zone_id')),
      // tslint:disable-next-line:radix
      regionId: (this.selectedRegionFilter) ? this.selectedRegionFilter : parseInt(localStorage.getItem('regionId')),
      townId: (this.selectedTownFilter) ? this.selectedTownFilter : -1,
    };
    const url = 'portal/report/sale-achievement';
    const body = this.httpService.UrlEncodeMaker(obj);
    this.getproductivityDownload(obj, url);
  }

  onAttendanceTypeChange(selectedAttendanceType) {

  }

  resetFilters() {
    this.selectedZoneFilter = -1;
    this.selectedRegionFilter = -1;
    this.selectedTownFilter = -1;
    this.startDate = new Date();
    this.endDate = new Date();
    this.selectedMeasurment = -1;
    this.selectedYear = -1;
    this.selectedMonth = -1;
    this.selectedAttendanceType = -1;
    this.selectedStatus = -1;
  }
}
