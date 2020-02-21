import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap';
import { ngxCsv } from 'ngx-csv';
import { ExcelService } from '../../excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dsr-sale-target',
  templateUrl: './dsr-sale-target.component.html',
  styleUrls: ['./dsr-sale-target.component.scss']
})
export class DsrSaleTargetComponent implements OnInit {
  title = 'add DSR Sale Target';
  @ViewChild('childModal') childModal: ModalDirective;
  loadingReportMessage = false;
  loadingData: boolean;
  selectedMonth: any = -1;
  selectedYear: any = -1;
  selectedRegion: any = -1;
  selectedZone: any = -1;
  selectedTown = -1;
  currentMonth: any;
  currentYear: any;
  month: any;
  year: any;
  tableData: any = [];
  regions: any = [];
  regionsTemp: any = [];
  towmsTemp: any = [];
  zones: any = [];
  towns: any = [];
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
  downloadList = [{ key: 'csv', title: 'CSV', icon: 'fa fa-file-text-o' }, { key: 'xlsx', title: 'Excel', icon: 'fa fa-file-excel-o' }];
  selectedFileType: any = {};
  loading = false;


  form: FormGroup;
  response: any;
  success: boolean;

  selectedItem: any = {};
  selectedImeiNumber: any = '';

  statusArray: any = [{ title: 'Activate', value: 'Y' }, { title: 'De-activate', value: 'N' }];

  number = new FormControl('', [Validators.maxLength(16), Validators.minLength(16)]);
  constructor(
    public fb: FormBuilder,
    private httpService: DashboardService,
    private toaster: ToastrService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.currentMonth = -1;
    this.currentYear = -1;
    this.form = this.fb.group({
      number: this.number,
      avatar: null
    });
    this.zones = JSON.parse(localStorage.getItem('zones'));
    // this.getRegions();
    //  this.getTowns(this.selectedRegion);
    // this.getSaleTargetList(obj);

  }


  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }
  }

  onSubmit(post) {
    const formData = new FormData();

    // tslint:disable-next-line:-const
    let model: any;

    formData.append('imei_number', post.number);
    formData.append('avatar', this.form.get('avatar').value);
    formData.append('userId', localStorage.getItem('user_id'));
    this.httpService.uploadDsrSaleTarget(formData).subscribe(data => {
      console.log(data);
      this.response = data;
    });
    if (this.response === 'Imeis Added into System.') {
      this.success = true;
    }
  }

  getSaleTargetList() {
    this.loading = true;
    const obj = {
      month: (this.selectedMonth) ? this.selectedMonth : -1,
      year: (this.selectedYear) ? this.selectedYear : -1,
      zoneId: (this.selectedZone) ? this.selectedZone : -1,
      regionId: (this.selectedRegion) ? this.selectedRegion : -1,
      townId: (this.selectedTown) ? this.selectedTown : -1,
    };
    console.log(obj);
    this.httpService.getSaleList(obj).subscribe(data => {
      this.tableData = data;
      this.loading = false;
    });
  }
  fun() {
    console.log(this.selectedMonth, this.selectedYear);
    const obj = {
      month: this.selectedMonth, year: this.selectedYear,
      regionId: this.selectedRegion, townId: this.selectedTown
    };

    this.getSaleTargetList();
  }

  downloadDsrDataReport() {

    this.loadingReportMessage = true;
    this.loadingData = true;

    // const obj = {
    //   month: this.selectedMonth,
    //   year: this.selectedYear,
    //   regionId: this.selectedRegion,
    //   townId: this.selectedTown
    // };

    const obj = {
      month: (this.selectedMonth) ? this.selectedMonth : -1,
      year: (this.selectedYear) ? this.selectedYear : -1,
      zoneId: (this.selectedZone) ? this.selectedZone : -1,
      regionId: (this.selectedRegion) ? this.selectedRegion : -1,
      townId: (this.selectedTown) ? this.selectedTown : -1,
    };
    console.log(obj);
    const url = 'report/dsrSaleTarget';

    const body = this.httpService.UrlEncodeMaker(obj);
    this.getproductivityDownload(obj, url);
  }
  getproductivityDownload(obj, url) {
    const u = url;
    this.httpService.DownloadResource(obj, u);
    setTimeout(() => {
      this.loadingData = false;
      this.loadingReportMessage = false;
    }, 1000);
  }


  downloadFile(file) {

    this.loading = true;
    console.log(file);
    const type = file.key;
    let data: any = {};
    const fileTitle = 'DSR Sale Target';

    data = this.tableData;

    if (type === 'csv') {
      new ngxCsv(data, fileTitle);
    } else if (type === 'xlsx') {
      this.excelService.exportAsExcelFile(data, fileTitle);
    }

    this.selectedFileType = {};
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }


  onZoneChange() {
    this.regions = [];
    this.towns = [];
    this.regionsTemp = JSON.parse(localStorage.getItem('regions'));
    this.regionsTemp.forEach(element => {
      if (element.zoneId === this.selectedZone) {
        this.regions.push(element);
      }
    });
  }



  onRegionChange() {

    this.towns = [];

    this.towmsTemp = JSON.parse(localStorage.getItem('towns'));

    this.towmsTemp.forEach(element => {
      if (element.regionId === this.selectedRegion) {
        this.towns.push(element);
      }
    });
  }

  onTownChange() {
    this.getTowns(this.selectedRegion);
    // this.getSaleTargetList();
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

  getTowns(obj) {

    obj = {
      regionId: this.selectedRegion,
    };
    this.httpService.getTownList(obj).subscribe(data => {
      console.log(data);
      if (data) {
        this.towns = data;
      }
    });
  }
  resetFilters() {
    this.selectedMonth = -1;
    this.selectedYear = -1;
    this.selectedRegion = -1;
    this.selectedTown = -1;
    this.selectedZone = -1;
  }

}
