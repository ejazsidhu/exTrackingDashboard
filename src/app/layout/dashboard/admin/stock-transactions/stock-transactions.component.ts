import {Component, OnInit, ViewChild} from '@angular/core';
import {DashboardService} from '../../dashboard.service';
import * as moment from 'moment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-view-stock',
  templateUrl: './stock-transactions.component.html',
  styleUrls: ['./stock-transactions.component.scss']
})
export class StockTransactionsComponent implements OnInit {

  @ViewChild('TransactionDetailModal') TransactionDetailModal: ModalDirective;
  factories: any ;
  territories: any;
  stockTransactionsData;
  towns: any = [];
  availableStock: any = [];
  selectedFactory: any;
  selectedTerritory: any;
  selectedTown: any;
  isFactoryStock = false;
  isTerritoryStock = false;
  isTownStock = false;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  startDate = new Date() ;
  endDate = new Date();
  // tslint:disable-next-line:max-line-length
  transferTypes = ['FACTORY_TO_WAREHOUSE', 'FACTORY_TO_TERRITORY' , 'FACTORY_TO_TOWN' , 'WAREHOUSE_TO_TERRITORY' , 'WAREHOUSE_TO_TOWN' , 'TERRITORY_TO_TERRITORY' , 'TERRITORY_TO_TOWN' ,
  'TOWN_TO_TOWN' ];
  form: FormGroup;
  isReversAble: boolean;
  transactionId: number;



  constructor(private httpService: DashboardService, public fb: FormBuilder , private toaster: ToastrService) {
    const obj = { type: 'ALL'};
    this.httpService.getfactoryList(obj).subscribe( factoryList => {
      this.factories = factoryList;
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      startDate: [moment(this.startDate).format('YYYY-MM-DD') , Validators.required],
      endDate: [moment(this.endDate).format('YYYY-MM-DD') , Validators.required],
      transferType: ['', Validators.required]
    });
  this.onChanges();
  }

  onChanges(): void {
  this.form.get('startDate').valueChanges.subscribe( value => {
    this.form.get('transferType').patchValue('');
  });
  this.form.get('endDate').valueChanges.subscribe( value => {
    this.form.get('transferType').patchValue('');
  });
  }
  getFactoryStock() {
    this.isTerritoryStock = false;
    this.isTownStock = false;
    this.isFactoryStock = true;
    this.loadFactroryStockData();
    this.selectedTerritory = undefined;
    this.selectedTown = undefined;
  }

  getTerritoryStock() {
    console.log('selected territory id is ' + this.selectedTerritory);
    this.httpService.getTownList({regionId: this.selectedTerritory}).subscribe(val => {
      const towns = JSON.stringify(val);
      this.towns = JSON.parse(towns);
    });
    this.isFactoryStock = false;
    this.isTownStock = false;
    this.isTerritoryStock = true;
    this.loadTerritoryFamiliesData();
    this.selectedFactory = '';
    this.selectedTown = '';

  }


  getTownStock () {
    this.isFactoryStock = false;
    this.isTownStock = true;
    this.isTerritoryStock = false;
    this.loadTownFamiliesData();

  }


  loadTerritoryFamiliesData() {
    const obj = {
      territoryId: this.selectedTerritory
    };
    this.httpService.getTerritoryFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
  });
  }

  loadTownFamiliesData() {
    const obj = {
      townId: this.selectedTown
    };
    this.httpService.getTownFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
    });
    console.log(this.availableStock);
  }

  loadFactroryStockData() {
    const obj = {factoryId: this.selectedFactory};
    this.httpService.getFactoryStockFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
    });

  }

  getStockTransactionsData() {
    const obj = {
      transferType: this.form.get('transferType').value,
      startDate : moment(this.form.get('startDate').value).format('YYYY-MM-DD') ,
      endDate:  moment(this.form.get('endDate').value ).format('YYYY-MM-DD'),
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.getStockTransactionsData(obj).subscribe( data => {
      this.stockTransactionsData = data;
    });
  }

  hideChildModal(): void {
    this.TransactionDetailModal.hide();
  }

  showChildModal(id , receiveDate , status): void {
    // @ts-ignore
    const obj = {
      transferId: id,
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.getStockTransactionStockDetails(obj).subscribe( data => {
    this.availableStock = data;
    });
    if (receiveDate == null && status === 'SENT') {
      this.isReversAble = true;
    } else {
      this.isReversAble = false;
    }
    this.transactionId = id;
    this.TransactionDetailModal.show();

  }


  reverseTransaction() {
    const obj = {
      transactionId: this.transactionId,
      userId: localStorage.getItem('user_id'),
    };
    this.httpService.reverseTransaction(obj).subscribe( (res: any) => {
      if (res.transactionReversed === true) {
        this.toaster.success(res.message);
        this.getStockTransactionsData();
        this.TransactionDetailModal.hide();
      } else {
        this.toaster.error(res.message);
        this.TransactionDetailModal.hide();
      }
    });
  }

}
