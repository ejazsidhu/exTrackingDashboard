import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';
import { ExcelService } from '../../excel.service';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-de-attendance',
  templateUrl: './de-attendance.component.html',
  styleUrls: ['./de-attendance.component.scss']
})
export class DeAttendanceComponent implements OnInit {

  @ViewChild('childModal') childModal: ModalDirective;
  loading = false;
  attendanceList: any;
  selectedWorkType: any = {};
  tableData: any = [];
  selectedId: any;
  selectedWorkTypeId: any;
  selectedWork: any;
  selectedRegion: any = -1;
  selectedAttendanceType: any = '';
  regions: any = [];
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  startDate = new Date();
  endDate = new Date();
  downloadList = [{ key: 'csv', title: 'CSV', icon: 'fa fa-file-text-o' }, { key: 'xlsx', title: 'Excel', icon: 'fa fa-file-excel-o' }];
  selectedFileType: any = {};
  sortBy: any;
  sortOrder: boolean;
  constructor(private httpService: DashboardService, private toastr: ToastrService, private excelService: ExcelService) { }

  ngOnInit() {

    this.getRegions();

    this.getRemarksList();
    this.getDeAttendanceList(-1);
    this.sortIt('m_code');
    this.sortOrder = false;
  }


  getDeAttendanceList(obj) {

    this.loading = true;
    // if (this.endDate >= this.startDate) {
     obj = {
        regionId: this.selectedRegion,
        startDate: moment(this.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.endDate).format('YYYY-MM-DD'),
        attendanceType: this.selectedAttendanceType
     };
    // }
    this.httpService.getDeAttendanceList(obj).subscribe(
      list => {
        if (list) {
          // console.log(list);
          this.attendanceList = list;
          this.loading = false;
        }
      }
    );

  }

  onAttendanceTypeChange(attendanceType) {
    this.getDeAttendanceList(this.selectedAttendanceType);

  }


  showChildModal(item?): void {

    this.selectedId = item;
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }


  getRemarksList() {

  this.httpService.getRemarksList().subscribe(data => {
    console.log(data);
    if (data) {
      this.tableData = data;
    }
  });

  }

  updateWorkType() {

    const obj = {
      Id: this.selectedId.id ,
      workTypeId: this.selectedWork,
      userId: localStorage.getItem('user_id')
    };

    this.httpService.updateDeRemarkType(obj).subscribe(( data: any ) => {
      if (data.status) {
        this.toastr.success(data.message);
       /* this.updateArray(data.surveyorId,data.deName)*/
        this.getDeAttendanceList(-1);
      } else {
        this.toastr.warning(data.message);
      }
      this.hideChildModal();

    }, error => {
      if (error.statusText) {
        this.toastr.error(error.statusText);
      } else {
        this.toastr.error(error.message);
      }
      this.hideChildModal();

    });

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

  onRegionChange(reg) {

    this.getDeAttendanceList(this.selectedRegion);
  }



  getTabsData(data?: any, dateType?: string) {

    this.loading = true;

    const obj: any = {

      regionId: (this.selectedRegion.id) ? this.selectedRegion.id : -1,
      startDate: (dateType === 'start') ? moment(data).format('YYYY-MM-DD') : moment(this.startDate).format('YYYY-MM-DD'),
      endDate: (dateType === 'end') ? moment(data).format('YYYY-MM-DD') : moment(this.endDate).format('YYYY-MM-DD'),
    };
    localStorage.setItem('obj', JSON.stringify(obj));
    this.getDeAttendanceList(obj);

    if (this.selectedRegion.id) {
      this.onRegionChange(this.selectedRegion);
    }



  }



  downloadFile(file) {

    this.loading = true;
    console.log(file);
    const type = file.key;
    let data: any = {};
    const fileTitle = 'Attendance';

      data = this.attendanceList;

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

  resetFilters() {
    this.selectedAttendanceType = '';
    this.selectedRegion = -1;
    this.startDate = new Date();
    this.endDate = new Date();
  }
}
