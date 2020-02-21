import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap';
import { config } from 'src/assets/config';
import { TooltipPosition } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit {
  title = 'shop list';
  tableData: any = [];
  loading = false;
  // ip = environment.ip;
  configFile = config;
  ip: any = this.configFile.ip;
  remarksId: any = 0;
  visitType: any = '';
  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[2]);
  @ViewChild('childModal') childModal: ModalDirective;
  selectedItem: any = {};
  tableTitle = '';
  sortToggle: any = false;



  constructor(private router: Router, private httpService: DashboardService, public activatedRoute: ActivatedRoute) {


   }
   showChildModal(): void {
    this.childModal.show();
  }
  goToEvaluation(id, visitType) {
  window.open(`${environment.hash}dashboard/evaluation/shop_list/details/${id}/${visitType}?location=shop`, '_blank');
  // window.open(`${environment.hash}dashboard/evaluation/shop_list/details/${id}/${visitType}`, '_blank');
  }
  hideChildModal(): void {
    this.childModal.hide();
  }

  setSelectedItem(item) {
    this.selectedItem = item;

  }
  ngOnInit() {
    let id = 0;
    const o: any = JSON.parse(localStorage.getItem('obj'));
    console.log(o);
    this.activatedRoute.queryParams.subscribe(p => {
      this.remarksId = p.remark_id;
      id = p.id;
      const obj = {
        zoneId: o.zoneId,
        regionId: o.regionId,
        startDate: o.startDate,
        endDate: o.endDate,
        merchandiserId: id,
        remarksId: this.remarksId,
        visitType : this.visitType
        // cityId: o.cityId || -1,
        // distributionId:o.selectedDitribution.id ||-1,
        // storeType:o.selectedStoreType || null,
      };

      this.getTableData(obj);
    });
    if (this.remarksId === 1) {
    this.tableTitle = 'Work With';
    } else if (this.remarksId === -1) {
    this.tableTitle = 'Added';
         } else if (this.remarksId === 0) {
    this.tableTitle = 'Work Review';
         } else if (this.remarksId === -2) {
    this. tableTitle = 'Visited Shops';
    }

  }

  toggleListOrder() {
    console.log(this.tableData, 'table data');
    this.sortToggle = !this.sortToggle;
    if (this.sortToggle) {
    this.tableData.sort( this.compare1 );
    } else {
    this.tableData.sort( this.compare2 );
    }


  }
  compare1( a, b ) {
    if ( a.startTime < b.startTime ) {
      return -1;
    }
    if ( a.startTime > b.startTime ) {
      return 1;
    }
    return 0;
  }
  compare2( a, b ) {
    if ( a.startTime > b.startTime ) {
      return -1;
    }
    if ( a.startTime < b.startTime ) {
      return 1;
    }
    return 0;
  }

  getTableData(obj) {
    this.loading = true;
    this.httpService.getTableList(obj).subscribe(data => {
      console.log(data, 'table data');
      const res: any = data;
      // this.dataSource = res;
      if (res != null) {
      this.tableData = res;
      }
      this.loading = false;
      // if (res.planned == 0)
      //   this.toastr.info('No data available for current selection', 'Summary')
    }, error => {
      console.log(error, 'home error');

    });
  }

  getPdf(item) {
    // debugger
    const obj = {
      surveyId: item.surveyId,
      type: 25,
      shopName: item.shopName
    };
    const url = 'url-pdf';
    this.httpService.DownloadResource(obj, url);

  }
}
