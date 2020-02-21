import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ModalDirective } from 'ngx-bootstrap';
import { config } from 'src/assets/config';

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.town_storming.component.html',
  styleUrls: ['./shop-detail.town_storming.component.scss']
})
// tslint:disable-next-line:class-name
export class ShopDetailTownStormingComponent implements OnInit {
  title = 'shop list';
  tableData: any = [];
  loading = false;
  // ip = environment.ip;
  configFile = config;
  ip: any = this.configFile.ip;
  remarksId: any = 0;
  visitType: any = '';

  @ViewChild('childModal') childModal: ModalDirective;
  selectedItem: any = {};
  tableTitle = '';



  constructor(private router: Router, private httpService: DashboardService, public activatedRoute: ActivatedRoute) {


   }
   showChildModal(): void {
    this.childModal.show();
  }
  goToEvaluation(id, visitType) {
   // console.log(visitType);
  window.open(`${environment.hash}dashboard/evaluation/shop_list/details/${id}/${visitType}?location=shop&`, '_blank');
  }
  hideChildModal(): void {
    this.childModal.hide();
  }

  setSelectedItem(item) {
    this.selectedItem = item;

  }
  ngOnInit() {
    let id = 0;
    let visitType = '';
    const o: any = JSON.parse(localStorage.getItem('obj'));
    console.log(o);
    this.activatedRoute.queryParams.subscribe(p => {
      this.remarksId = p.remark_id;
      id = p.id;
      visitType = p.visitType;
      const obj = {
        zoneId: o.zoneId,
        regionId: o.regionId,
        startDate: o.startDate,
        endDate: o.endDate,
        merchandiserId: id,
        remarksId: this.remarksId,
       visitType : visitType
        // cityId: o.cityId || -1,
        // distributionId:o.selectedDitribution.id ||-1,
        // storeType:o.selectedStoreType || null,
      };

      this.getTableData(obj);
    });
    if (this.remarksId === -1) {
    this.tableTitle = 'Visited';
    } else if (this.remarksId === 0) {
    this.tableTitle = 'Work with';
         } else if (this.remarksId === 1) {
    this.tableTitle = 'Work review';
         } else if(this.remarksId === 2) {
    this.tableTitle = 'Town Storming';
    }

  }
  getTableData(obj) {
    this.loading = true;
    this.httpService.getTableOfVisitShops(obj).subscribe(data => {
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
