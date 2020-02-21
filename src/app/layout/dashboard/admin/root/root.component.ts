import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { TabsetComponent, ModalDirective } from 'ngx-bootstrap';
import { HomeComponent } from '../../inner-pages/home/home.component';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ExcelService } from '../../excel.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  title = 'DE portal';
  regions: any;
  tableData: any = [];
  employeeList: any = [];
  dsrStatusArray = [{title: 'Active' , value: 'Y'} , { title: 'deActive' , value: 'N'}];
  dsrTypes = [{type: 'DSR'} , { type: 'VAN'} ];
  tabName: string;
  selectedRegion: any;
  @ViewChild('tabset') tabset: TabsetComponent;
  dsrTabledata: Object;
  getBlockWiseShops: Object;
  dsrAreasDetailTable;
  selectedItem: any;
  dsrType: any;
  color = 'primary';
  checked = false;
  selectedDsrVan: Number = -1;
  selectedItemCloneForPayload: any = {
    dsrName: '',
    deId: 0,
    status: '',
    surveyorId: -1,
    dsrType: 'DSR'
  };
  selectedDE: Number = -1;
  selectedDSR: Number = -1;
  selectedBlock: Number = -1;
  dsrsList;
  dsrsVanList;
  selectedDsrSurveyorId = -1;
  selectedDsrId = -1;

  selectedFileType: any = {};

  selectedItemCloneForPayload_areadetails: any = {
    dsrName: '',
    deId: 0
  };
  @ViewChild('childModal') childModal: ModalDirective;
  @ViewChild('Block') Block: ModalDirective;
  @ViewChild('blockShops') blockShops: ModalDirective;
  @ViewChild('DsrBlocks') dsrBlocks: ModalDirective;

  isEditing = false;
  townList: any = [];
  downloadList = [{ key: 'csv', title: 'CSV', icon: 'fa fa-file-text-o' }, { key: 'xlsx', title: 'Excel', icon: 'fa fa-file-excel-o' }];

  constructor(private httpService: DashboardService, private toaster: ToastrService, private excelService: ExcelService) {
    this.selectedRegion = -1;
  }
  loading = false;
  ngOnInit() {
    this.loading = true;
    this.regionChange();
    this.getDesAndDsrs();
    this.getEmployeesList();
    this.tabName = 'DE';
    this.getDsrDetails(-1);
    this.getTownList();
    this.getDsrsBySurveyorId();
  }

  downloadFile(file) {
    debugger;
    this.loading = true;
    console.log(file);
    const type = file.key;
    let data: any = {};
    const areaList: any  = {};
    let fileTitle = '';
    if (this.tabName === 'DE') {
      data = this.tableData;
      fileTitle = this.title;
    } else if (this.tabName === 'DSR') {
      data = this.dsrTabledata;
      fileTitle = this.title;
    } else if (this.tabName === 'Block') {
      data = this.dsrAreasDetailTable;
      fileTitle = this.title;
    }

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



  regionChange() {
    this.selectedFileType = {};
    this.httpService.getRegionsFOrDeAndDsrs().subscribe(data => {
      this.regions = data;
    });
  }

  getDsrsBySurveyorId(dsrType?: string) {
    let obj;
    // let dsrType;
    // dsrType = (itemObj === undefined) ? this.selectedItem.dsr_type : itemObj;

    // if (itemObj === undefined) {
    //   obj = {
    //     surveyorId: this.selectedItem.surveyor_id,
    //     dsrType: dsrType
    //   };
    // } else {
    //   obj = {
    //     surveyorId: this.selectedDE,
    //     dsrType: dsrType
    //   };
    // }

    obj = {
          surveyorId: this.selectedDE,
          dsrType: dsrType
        };



    this.httpService.getDsrsBySurveyorId(obj).subscribe(data => {
      if (dsrType === 'DSR') {
        this.dsrsList = data;
      } else if (dsrType === 'VAN') {
        this.dsrsVanList = data;
      }
    //  this.dsrsList = data;
    });
  }

  getTownList() {
  /*  let obj;*/
    /*if (this.dsrAreasDetailTable.length > 0) {
      obj = {
        regionId: this.dsrAreasDetailTable[0].region_id
      };
    } else {*/
    const   obj = {
        regionId: this.selectedRegion
      };

    this.httpService.getTownList(obj).subscribe(data => {
      this.townList = data;
    });
  }
  getShopsList(blockObj) {
    this.loading = true;
    console.log(blockObj);
    this.selectedBlock = blockObj.block_id;
    this.selectedDSR = blockObj.dsr_id;
    const obj = {
      areaId: blockObj.block_id,
      regionId: this.selectedRegion || blockObj.region_id,
      surveyorId: blockObj.surveyor_id,
      dsrId: blockObj.dsr_id,
    };
    this.blockShops.show();

    this.httpService.getBlockWiseShopList(obj).subscribe(data => {

      this.getBlockWiseShops = data;
      console.log('block wise shops' + data);
      this.loading = false;
    });
  }

  getBlocksByDsr(DsrObj) {
    // @ts-ignore
    this.selectedDsrSurveyorId = DsrObj.surveyor_id;
    const obj1 = {
      surveyorId: DsrObj.surveyor_id   };
    this.httpService.getDsrsBySurveyorId(obj1).subscribe(data => {
      this.dsrsList = data;
    });
    this.loading = true;
    const obj = {
      dsrId: DsrObj.dsr_id,
      regionId: this.selectedRegion
    };
    this.httpService.getDsrAreasDetails(obj).subscribe(data => {
      this.dsrAreasDetailTable = data;
      this.loading = false;
    });
    this.dsrBlocks.show();

  }


  updateBlockInDsr(value) {
    this.httpService.transferBlocks(value).subscribe((data: any) => {
      // tslint:disable-next-line:no-debugger

    //  this.getBlockWiseShops = data;
      console.log('Dsr wise Blocks' + data);
      this.loading = false;
      if (data.status) {
        this.toaster.success(data.message);
        this.getDsrDetails(this.selectedDsrSurveyorId);
      } else {
        this.toaster.warning(data.message);
      }
    });
  }

  updateShopInBlock(value) {
    console.log('changed shops in Block', value);
    this.httpService.transferShop(value).subscribe((data: any) => {
      if (data.status) {
      this.toaster.success(data.message);
        this.getDsrAreasDetails(this.selectedDSR);
      } else {
      this.toaster.info(data.message);
      }

    }, error => {

    });
  }
  getDesAndDsrs() {
    this.loading = true;
    const obj = {
      regionId: this.selectedRegion
    };
    this.httpService.getDesAndDsrs(obj).subscribe(data => {
      this.tableData = data;
      this.loading = false;
    });
    this.getEmployeesList();
  }

  getDsrDetails(surveyor_id) {
    this.loading = true;
    const obj = {
      surveyorId: surveyor_id,
      regionId: this.selectedRegion
    };
    this.httpService.getDsrDetails(obj).subscribe(data => {
      this.dsrTabledata = data;
      this.loading = false;
    });
  }

  getDsrAreasDetails(dsrId) {

    this.loading = true;
    const obj = {
      dsrId: dsrId,
      regionId: this.selectedRegion
    };
    this.httpService.getDsrAreasDetails(obj).subscribe(data => {
      this.dsrAreasDetailTable = data;
      this.loading = false;
    });
  }
  clickedNow(data, title, tabName) {
    this.title = title;
    // alert(data,title)
    this.tabName = tabName;
  }

  hideBlockShopsModal(): void {
    this.blockShops.hide();
    this.clickedNow(3, 'Block', 'Block');
  }

  hideDsrBlockModal(): void {
    this.dsrBlocks.hide();
    this.clickedNow(2, 'DSR', 'DSR');
  }

  catchEvent(tabName?, tabTitle?, id?) {
    this.clickedNow('', tabTitle, tabName);
  debugger;
    switch (tabName) {
      case 'DE':
        this.getDesAndDsrs();
        // this.getEmployeesList();
        break;
      case 'DSR':
        this.selectedDE = id;
        this.getDsrDetails(id);
        break;
      case 'Block':
        this.selectedDSR = id;
        this.getDsrAreasDetails(id);
        break;
      case 'Shops':
        this.selectedBlock = id;
        this.getShopsList(id);
        break;
      case 'dsrBlocks':

        this.getBlocksByDsr(id);
        break;


      default:
        break;
    }
  }

  onRegionChange(value) {

    this.selectedRegion = value;
    switch (this.tabName) {
      case 'DE':
        this.getDesAndDsrs();
        break;
      case 'DSR':
        this.getDsrDetails((this.selectedItem.surveyorId != null) ? this.selectedItem.surveyorId : -1);
        break;
      case 'Block':
        this.getDsrAreasDetails((this.selectedItemCloneForPayload.dsrId != null ) ? this.selectedItemCloneForPayload.dsrId : -1);
        break;

      default:
        break;
    }
  }
  showChildModal(item?): void {
    debugger;
    if (item) {
      this.selectedItem = item;
      this.selectedItemCloneForPayload.surveyorId = this.selectedItem.surveyorId;
      this.selectedItemCloneForPayload.dsrName = this.selectedItem.dsrName;
      this.selectedItemCloneForPayload.dsrId = this.selectedItem.dsrId;
      this.checked = (this.selectedItem.dsr_status === 'Y') ? this.checked = true : this.checked = false;
      this.selectedItemCloneForPayload.dsrType = this.selectedItem.dsrType;
      this.isEditing = true;
    } else {
      this.selectedItemCloneForPayload.surveyorId = '';
      this.selectedItemCloneForPayload.dsrName = '';
      this.isEditing = false;
    }

    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  showBlock(item?): void {
    debugger;
    if (item) {
      this.selectedItem = item;
      this.dsrType = this.selectedItem.dsr_type;
      this.getDsrsBySurveyorId('DSR');
      this.getDsrsBySurveyorId('VAN');
      // this.getDsrsBySurveyorId(item);
      this.selectedItemCloneForPayload.blockId = this.selectedItem.block_id;
      this.selectedItemCloneForPayload.blockName = this.selectedItem.blocks;
      this.selectedItemCloneForPayload.dsrId = this.selectedItem.dsr_id;
      this.checked = (this.selectedItem.block_status === 'Y' ) ? this.checked = true : this.checked = false;
      this.isEditing = true;
    } else {
      this.selectedItemCloneForPayload.blockName = '';
      this.selectedItemCloneForPayload.dsrId = -1;
      this.selectedItemCloneForPayload.townId = -1;
      this.selectedDsrVan = -1;
      this.getTownList();
      this.getDsrsBySurveyorId('DSR');
      this.getDsrsBySurveyorId('VAN');
      this.isEditing = false;
    }

    this.Block.show();
  }

  hideBlock(): void {
    this.Block.hide();
    this.selectedItem = {};
  }

  setvalues(obj) {
    this.showChildModal(obj);
  }
  updateDSRName() {
    if (this.selectedItemCloneForPayload.dsrName === '') {
      this.toaster.info('Name can not be empty');
      return;
    } else if (this.selectedItemCloneForPayload.dsrName.length > 20) {
      this.toaster.info('Name can not be greater than 20 characters');
      return;
    } else {
      const obj = {
        surveyorId: this.selectedItemCloneForPayload.surveyorId,
        dsrId: this.selectedItemCloneForPayload.dsrId,
        dsrName: this.selectedItemCloneForPayload.dsrName,
        dsrStatus: (this.checked === true) ? 'Y' : 'N',
        userId: localStorage.getItem('user_id'),
        dsrType: this.selectedItemCloneForPayload.dsrType,
      };

      this.httpService.updateDSR(obj).subscribe(
        (data: any) => {
          if (data && data.status) {
            // this.toaster.info(data.message);
            this.toaster.success(data.message);
            this.updateDSRArray(data.dsrId, data.dsrName, data.surveyorId);

            this.getDsrDetails(this.selectedItemCloneForPayload.surveyorId);
          } else {
            this.toaster.warning(data.message);
          }
          this.hideChildModal();
        },
        error => {
          if (error.statusText) { this.toaster.error(error.statusText); } else { this.toaster.error(error.message); }
          this.hideChildModal();
        }
      );
    }
  }

  addDSR() {
    if (this.selectedItemCloneForPayload.dsrName === '') {
      this.toaster.info('Name can not be empty');
      return;
    } else if (this.selectedItemCloneForPayload.dsrName.length > 20) {
      this.toaster.info('Name can not be greater than 20 characters');
      return;
    } else {
      const obj = {
        surveyorId: this.selectedItemCloneForPayload.surveyorId,
        dsrName: this.selectedItemCloneForPayload.dsrName,
        userId: localStorage.getItem('user_id'),
        dsrType: this.selectedItemCloneForPayload.dsrType
      };
      this.httpService.addDSR(obj).subscribe(

        (data: any) => {
          if (data && data.status) {
            this.toaster.info(data.message);
            // this.updateDSRArray(data.dsrId, data.dsrName,data.surveyorId);
            this.getDsrDetails( this.selectedItemCloneForPayload.surveyorId);
          } else {
            this.toaster.warning(data.message);
          }
          this.hideChildModal();
        },
        error => {
          if (error.statusText) { this.toaster.error(error.statusText); } else { this.toaster.error(error.message); }
          this.hideChildModal();
        }
      );
    }
  }

  updateDSRArray(id, name, surveyor_id) {
    const i = _.findIndex(this.dsrTabledata, { dsr_id: id });
    if (i > -1) {
      this.dsrTabledata[i].dsr_name = name;
      this.dsrTabledata[i].surveyor_id = surveyor_id;
      const temp = this.dsrTabledata;
      this.dsrTabledata = [];
      this.dsrTabledata = temp;
    }
  }

  setvaluesForBlock(item) {
    this.showBlock(item);
  }

  setvaluesForShops(item) {
    console.log(item);
    // this.showBlock(item);
  }

  updateBlock() {
    if (this.selectedItemCloneForPayload.blockName === '') {
      this.toaster.info('Name can not be empty');
      return;
    } else if (this.selectedItemCloneForPayload.blockName.length > 100) {
      this.toaster.info('Name can not be greater than 100 characters');
      return;
    } else {
      const obj = {
        dsrId: this.selectedItemCloneForPayload.dsrId,
        blockName: this.selectedItemCloneForPayload.blockName,
        blockId: this.selectedItemCloneForPayload.blockId,
        dsrType: this.dsrType,
        dsrVanId: this.selectedDsrVan,
        userId: localStorage.getItem('user_id'),
        blockStatus: (this.checked === true ) ? 'Y' : 'N'
      };

      this.httpService.updateDSRArea(obj).subscribe(
        (data: any) => {
          if (data && data.status) {
            this.toaster.info(data.message);
            this.updateDSRArray(data.dsrId, data.dsrName, data.surveyorId);

            this.getDsrAreasDetails(this.selectedItemCloneForPayload.dsrId);
          } else {
            this.toaster.warning(data.message);
          }
          this.hideBlock();
        },
        error => {
          if (error.statusText) { this.toaster.error(error.statusText); } else { this.toaster.error(error.message); }
          this.hideBlock();
        }
      );
    }
  }

  addBlock() {
    if (this.selectedItemCloneForPayload.blockName === '') {
      this.toaster.info('Name can not be empty');
      return;
    } else if (this.selectedItemCloneForPayload.blockName.length > 100) {
      this.toaster.info('Name can not be greater than 100 characters');
      return;
    } else {
      const obj = {
        dsrId: this.selectedItemCloneForPayload.dsrId,
        blockName: this.selectedItemCloneForPayload.blockName,
        townId: this.selectedItemCloneForPayload.townId,
        dsrVanId: this.selectedDsrVan || -1,
        userId: localStorage.getItem('user_id')
      };

      this.httpService.addBlock(obj).subscribe(
        (data: any) => {
          if (data && data.status) {
            this.toaster.info(data.message);
            // this.updateDSRArray(data.dsrId, data.dsrName,data.surveyorId);

            this.getDsrAreasDetails(this.selectedItemCloneForPayload.dsrId);
          } else {
            this.toaster.warning(data.message);
          }
          this.hideBlock();
        },
        error => {
          if (error.statusText) { this.toaster.error(error.statusText); } else { this.toaster.error(error.message); }
          this.hideBlock();
        }
      );
    }
  }

 getEmployeesList() {
    this.loading = true;
    const obj = {
      regionId: this.selectedRegion
    };
    this.httpService.getEmployeesList(obj).subscribe(data => {
      // console.log(data)
      if (data) {
        this.employeeList = data;
      }
      this.loading = false;
    });
  }
}
