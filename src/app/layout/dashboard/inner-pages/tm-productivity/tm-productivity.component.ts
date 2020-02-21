import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {DashboardService} from '../../dashboard.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tm-productivity',
  templateUrl: './tm-productivity.component.html',
  styleUrls: ['./tm-productivity.component.scss']
})
export class TmProductivityComponent implements OnInit {

 /* constructor() { }

  ngOnInit() {
  }*/

  title = 'T.M Productivity';
  sortBy: any;
  sortOrder: boolean;
  zones: any = [];
  regions: any = [];
  channels: any = [];
  areas: any = [];
  cities: any = [];
  startDate = new Date();
  endDate = new Date();
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  selectedZone: any = {};
  selectedRegion: any = {};
  loading: boolean;
  selectedCity: any = {};
  selectedDistribution: any = {};
  selectedStoreType: any = '';
  tableData: any = [];
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
  isAdmin = false;


  constructor(public toastr: ToastrService, public router: Router, private httpService: DashboardService) { }

  ngOnInit() {
    // tslint:disable-next-line:prefer-const
    let t = moment(new Date).format('YYYY-MM-DD');
    // tslint:disable-next-line:prefer-const
    let st = localStorage.getItem('today');
    if (t > st) {
      this.router.navigate(['/login']);
    }
    if (parseInt(localStorage.getItem('user_zone_id')) === -1) {
   //   this.getTabsData();
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    // this.getZone();
    this.sortIt('added');
     this.regions = JSON.parse(localStorage.getItem('regions'));
    this.zones = JSON.parse(localStorage.getItem('zones'));
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

  getTabsData(data?: any, dateType?: string) {

    this.loading = true;
    if (dateType === 'zone') {
      this.selectedRegion.id = -1;
      this.selectedCity.id = -1;
    }
    if (dateType === 'territory') {
      this.selectedCity.id = -1;
    }
    const obj: any = {
      // tslint:disable-next-line:radix
      zoneId: (this.selectedZone.id) ? this.selectedZone.id : parseInt(localStorage.getItem('user_zone_id')),
      // tslint:disable-next-line:radix
      regionId: (this.selectedRegion.id) ? this.selectedRegion.id :  parseInt(localStorage.getItem('regionId')),
      startDate: (dateType === 'start') ? moment(data).format('YYYY-MM-DD') : moment(this.startDate).format('YYYY-MM-DD'),
      endDate: (dateType === 'end') ? moment(data).format('YYYY-MM-DD') : moment(this.endDate).format('YYYY-MM-DD'),
      cityId: this.selectedCity.id || -1,
      distributionId: this.selectedDistribution.id || -1,
      storeType: this.selectedStoreType ,
      channelId: -1,
      rteId : -1,
      surveyorId: -1,
      visitType: this.visitType,
      userId: localStorage.getItem('user_id'),
    };
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
    this.httpService.TmProductivityNDN(obj).subscribe(data => {
      console.log(data, 'table data');
      const res: any = data;

      if (res) {
        this.tableData = res;
        this.loadingData = false;
      }

      // if (res.planned == 0)
      //   this.toastr.info('No data available for current selection', 'Summary')
    }, error => {
      // this.clearLoading();

      console.log(error, 'home error');

    });
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

  zoneChange() {
    this.loadingData = true;
    // this.regions = [];
    // this.channels = [];
    if (this.router.url === '/dashboard/productivity_report') {
      this.getTabsData();
    }

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

  MProductivityReport() {
    if (this.endDate >= this.startDate) {
      this.loadingData = true;
      this.loadingReportMessage = true;
      const obj = {
        zoneId: this.selectedZone.id || -1,
        regionId: this.selectedRegion.id || -1,
        cityId: this.selectedCity.id || -1,
        distributionId: this.selectedDistribution.id || -1,
        storeType: this.selectedStoreType || null,
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
        // totalShops: this.selectedImpactType,
        channelId: -1

      };
      const url = 'productivityreport';
      const body = `type=2&pageType=1&zoneId=${obj.zoneId}&regionId=${obj.regionId}&startDate=${obj.startDate}&endDate=${obj.endDate}&distributionId=${obj.distributionId}&cityId=${obj.cityId}&storeType=${obj.storeType}&channelId=${obj.channelId}`;

      this.httpService.getKeyForProductivityReport(body, url).subscribe(data => {
        const res: any = data;

        if (res) {
          const obj2 = {
            key: res.key,
            fileType: 'json.fileType'
          };
          const url = 'downloadReport';
          this.getproductivityDownload(obj2, url);
        } else {
          this.clearLoading();

          this.toastr.info('Something went wrong,Please retry', 'Connectivity Message');
        }

      }, error => {
        this.clearLoading();

        console.log(error, 'productivity error');

      });
    } else {
      this.clearLoading();

      this.toastr.info('End date must be greater than start date', 'Date Selection');

    }

  }

  regionChange() {

    this.selectedArea = {};
    this.selectedCity = {};
    this.selectedDistribution = {};
    if (this.router.url === '/dashboard/daily_visit_report') {
      // this.getMerchandiserList(this.startDate);

      // if (this.router.url === '/dashboard/productivity_report')
      this.getTabsData();
    }
    if ((this.router.url !== '/dashboard/daily_visit_report')) {
      this.loadingData = true;

      console.log('regions id', this.selectedRegion);
      this.httpService.getCities(this.selectedRegion.id).subscribe(
        data => {
          // this.channels = data[0];
          const res: any = data;
          if (res) {
            this.areas = res.areaList;
            this.cities = res.cityList;
            this.distributionList = res.distributionList;
          } else {
            // this.clearLoading();
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
    if (this.router.url === '/dashboard/daily_visit_report') {
      // this.getMerchandiserList(this.startDate)
    }
  }

  categoryChange() {
    // this.loadingData = true;

    // this.httpService.getProducts(this.selectedCategory.id).subscribe(
    //   data => {
    //     this.productsList = data;

    //     setTimeout(() => {
    //       this.loadingData = false;
    //     }, 500);
    //   },
    //   error => {
    // this.clearLoading()

    //  }
    // );
  }

  cityChange() {
    // this.httpService.getAreas(this.selectedChannel).subscribe(
    //   data => {
    //     this.areas = data;
    //     // this.filterAllData();
    //   },
    //   error => {
    // this.clearLoading()

    // }
    // );
  }

  chanelChange() {
    // console.log('seelcted chanel', this.selectedChannel);
    // this.httpService.getAreas(this.selectedChannel).subscribe(
    //   data => {
    //     this.areas = data;
    //     // this.filterAllData();
    //   },
    //   error => {
    // this.clearLoading()

    // }
    // );
  }

  clearLoading() {
    this.loading = false;
    this.loadingData = false;
    this.loadingReportMessage = false;
  }


  getproductivityDownload(obj, url) {
    const u = url;
    this.httpService.DownloadResource(obj, u);
    setTimeout(() => {
      this.loadingData = false;
      this.loadingReportMessage = false;
    }, 1000);

  }

  onRegionChange(regionId) {
    let parsedData: any = [];
    const obj = {
      regionId: regionId
    };
    this.httpService.getTownList(obj).subscribe( data => {
      parsedData = JSON.stringify(data);
      this.cities = JSON.parse(parsedData);
    });
  }

  getRegionsByZoneId() {
    // tslint:disable-next-line:triple-equals
   if ( parseInt(localStorage.getItem('user_zone_id')) == -1) {
     let parsedData: any = [];
     const obj = {
       zoneId : this.selectedZone.id
     };
     this.httpService.getRegionsByZoneId(obj).subscribe(data => {
       parsedData = JSON.stringify(data);
       this.regions = JSON.parse(parsedData);
     });
   }
  }

  resetFilters() {
    this.selectedZone.id = -1;
    this.selectedRegion.id = -1;
    this.selectedCity.id = -1;
    this.startDate = new Date();
    this.endDate = new Date();
  }
}
