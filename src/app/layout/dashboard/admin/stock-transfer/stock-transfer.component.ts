import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,

} from '@angular/forms';
import {DashboardService} from '../../dashboard.service';
import * as moment from 'moment';
import {ToastrService} from 'ngx-toastr';
import {isArray} from 'ngx-bootstrap';
import {debug} from 'util';
import {isEmpty} from 'rxjs/operators';


@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent implements OnInit {


  title = 'add Device';
  form: FormGroup;
  response: any;
  success: boolean;
  sender: any = [];
  receiver: any;

  transferCode: any;
  stockSender: any;
  stockReceiver: any ;
  date: any;
  transferDate: any;
  transferType: any = ['FACTORY_TO_WAREHOUSE', 'FACTORY_TO_TERRITORY', 'FACTORY_TO_TOWN' , 'WAREHOUSE_TO_TERRITORY' , 'WAREHOUSE_TO_TOWN' ,
    'TERRITORY_TO_TERRITORY', 'TERRITORY_TO_TOWN', 'TOWN_TO_TOWN' ];
  transferStatus: any;
  fromTransfer: any;
  toTransfer: any;
  availableStock: any = [];
  startDate = new Date();
  endDate = new Date();
  minDate = new Date(2000, 0, 1, 24, 5, 1);
  maxDate = new Date(2050, 0, 1 , 24, 1, 1);
  changedTransferType: any;
  selectTerritory: any;
  i: Number = 0;
  j: Number = 0;
  error: boolean;
  formValid = true;
  isResponseTrue: boolean;
  validTransferCode: boolean;
  inValidTransferCode: boolean;
  SubmitTransferStatusMessage: boolean;
  negativeAmountError: boolean;
  receiverTerritory: boolean;
  emptyTransferStock: boolean;
  receiverTerritories = JSON.parse(localStorage.getItem('regions'));
  wareHouseList: any;


  constructor(public fb: FormBuilder, private httpService: DashboardService, private toaster: ToastrService) {
  }

  ngOnInit() {
    this.startDate = new Date();
    this.form = this.fb.group({

      transferDate: [moment(this.startDate).format('YYYY-MM-DD') , Validators.required],
      transferType: [this.transferType, Validators.required],
      fromTransfer: [this.sender, Validators.required],
      toTransfer: [this.receiver, Validators.required],
      transferStatus: ['SENT', Validators.required],
      stockSender: [localStorage.getItem('user_id'), Validators.required],
      stockReceiver: [-1, Validators.required],
/*      transferCode: ['', Validators.required],*/
      transferDevice: ['WEB', Validators.required],
      receiverTerritory: [0],
      senderTerritory: [3],
      transferStock: this.fb.array([])

    });
    console.log(this.form.get('transferDate').value);
    this.onChanges();
  }


  onChanges(): void {
    this.form.get('transferType').valueChanges.subscribe(val => {
      this.changedTransferType = val;
    });
    this.sender = [];
    this.receiver = [];
    this.onTransferedTypeSelectChange();

    this.form.get('fromTransfer').valueChanges.subscribe(val => {
      this.selectTerritory = val;
      if (this.changedTransferType == 'FACTORY_TO_TERRITORY' || this.changedTransferType == 'FACTORY_TO_WAREHOUSE') {
        this.loadFactroryStockData();
      } else if (this.changedTransferType == 'FACTORY_TO_TOWN') {
        this.loadFactroryStockData();
      } else if (this.changedTransferType == 'TERRITORY_TO_TERRITORY') {
        this.loadTerritoryFamiliesData();
      } else if (this.changedTransferType == 'TERRITORY_TO_TOWN') {
        this.loadTerritoryFamiliesData();
        this.chooseTownsOfTerritory();
      } else if (this.changedTransferType == 'TOWN_TO_TOWN' ) {
        this.loadTownFamiliesData();
      } else if (this.changedTransferType == 'WAREHOUSE_TO_TERRITORY' ) {
        this.loadFactroryStockData();
      } else if ( this.changedTransferType == 'WAREHOUSE_TO_TOWN') {
        this.loadFactroryStockData();
        this.chooseTownsOfTerritory();
      }

    });

    this.form.get('receiverTerritory').valueChanges.subscribe( change => {
      debugger;
      console.log(this.form.get('receiverTerritory').value);
      // tslint:disable-next-line:max-line-length
      if (this.changedTransferType == 'FACTORY_TO_TOWN' || this.changedTransferType == 'TERRITORY_TO_TOWN' || this.changedTransferType == 'TOWN_TO_TOWN'
      || this.changedTransferType == 'WAREHOUSE_TO_TOWN') {
        this.httpService.getTownList({regionId: change}).subscribe(val => {
          const towns = JSON.stringify(val);
          this.receiver = JSON.parse(towns);
        });
      }
    });


   /* this.form.get('transferCode').valueChanges.subscribe( value => {
      this.httpService.checkValidTransferCode({transferCode: value}).subscribe( res => {
        // tslint:disable-next-line:triple-equals

        if (JSON.parse(JSON.stringify(res)).valid === true) {
          console.log('valid transferCode');
          this.inValidTransferCode = false;
          this.validTransferCode = true;
        } else {
          console.log('Invalid transferCode');
          this.validTransferCode = false;
          this.inValidTransferCode = true;

        }
     });

    });*/



      this.form.get('transferStock').valueChanges.subscribe(value => {
        let notFound = false;
        let negativeAmountErrorNotFound = false;
        value.forEach(obj => {
          if (obj.stock < obj.receiveQty  ) {
            this.error = true;
            // @ts-ignore
            notFound = true;
          } else if (obj.receiveQty < 0) {
            this.negativeAmountError = true;
            negativeAmountErrorNotFound = true;
          }
        });
        if (!notFound) {
          this.error = false;
        }
        if (!negativeAmountErrorNotFound) {
          this.negativeAmountError = false;
        }
      });
  }


  onSubmit() {

    const formData = new FormData();
    const obj = this.filterTransferedStock(this.form.get('transferStock').value);
    if (!this.checkTransferedStock(obj)) {
      this.toaster.warning('Please assign at-least one brand quantity');
    } else {
      const timestamp = this.startDate.getHours() + ':' + this.startDate.getMinutes() + ':' + this.startDate.getSeconds();
      const dateTime = moment(this.form.get('transferDate').value).format('YYYY-MM-DD') + ' ' + timestamp;
      const StockTransfer = {
        transferDate: dateTime,
        transferType: this.form.get('transferType').value,
        fromSource: this.form.get('fromTransfer').value,
        toSource: this.form.get('toTransfer').value,
        transferStatus: this.form.get('transferStatus').value,
        stockSender: this.form.get('stockSender').value,
        stockReceiver: this.form.get('stockReceiver').value,
        /*  transferCode: this.form.get('transferCode').value,*/
        transferDevice: this.form.get('transferDevice').value,
        receiverTerritory: this.form.get('receiverTerritory').value,
        senderTerritory: this.form.get('senderTerritory').value,
        transferedStock: obj
      };
      this.SubmitTransferStatusMessage = true;
      formData.append('StockTransfer', JSON.stringify(StockTransfer));
      this.httpService.submitStockTransferedData(formData).subscribe((data: any) => {
        console.log(data);
        if (data.status) {
          this.SubmitTransferStatusMessage = false;
          this.toaster.success(data.description);
          this.isResponseTrue = true;
          this.validTransferCode = false;
          this.inValidTransferCode = false;

          if ((this.changedTransferType == 'TERRITORY_TO_TERRITORY') || (this.changedTransferType == 'TERRITORY_TO_TOWN')) {
            this.loadTerritoryFamiliesData();
          } else if (this.changedTransferType == 'TOWN_TO_TOWN') {
            this.loadTownFamiliesData();
          } else if (this.changedTransferType == 'FACTORY_TO_TERRITORY') {
            this.loadFactroryStockData();
          } else if (this.changedTransferType == 'FACTORY_TO_TOWN') {
            this.loadFactroryStockData();
          }
         /* this.form.reset();*/
          this.ngOnInit();
          this.availableStock = [];
        } else {
          this.SubmitTransferStatusMessage = false;
          this.toaster.warning(data.description);
        }
      });
    }

  }

  // @ts-ignore
  onTransferedTypeSelectChange() {

    if (this.changedTransferType == 'FACTORY_TO_WAREHOUSE') {
      const obj = {
        type: 'FACTORY'
      }
      this.httpService.getfactoryList(obj).subscribe( factoryList => {
        this.sender = factoryList;
      });
       const obj1 = {
         type: 'WAREHOUSE'
       }
       this.httpService.getfactoryList(obj1).subscribe( wareHouseList => {
         this.receiver = wareHouseList;
       });
    } else if (this.changedTransferType == 'FACTORY_TO_TERRITORY') {
      const obj = {
        type: 'FACTORY'
      }
      this.httpService.getfactoryList(obj).subscribe( factoryList => {
        this.sender = factoryList;
      });
      const territories = JSON.parse(localStorage.getItem('regions') || '[]');
      this.receiver = territories;
      console.log(this.receiver);
      this.receiverTerritory = false;
    } else if (this.changedTransferType == 'FACTORY_TO_TOWN') {
      const obj = {
        type: 'FACTORY'
      }
      this.httpService.getfactoryList(obj).subscribe( factoryList => {
        this.sender = factoryList;
      });
      this.receiverTerritory = true;
    } else if (this.changedTransferType == 'TERRITORY_TO_TERRITORY') {
      this.receiverTerritory = false;
      const territories = JSON.parse(localStorage.getItem('regions') || '[]');
      /*this.sender = [territories || '[]'];*/
      this.sender = territories;
      this.receiver = JSON.parse(localStorage.getItem('regions') || '[]');
    } else if (this.changedTransferType == 'TERRITORY_TO_TOWN') {
      this.receiverTerritory = true;
      const territories = JSON.parse(localStorage.getItem('regions') || '[]');
      this.sender = territories;

    } else if (this.changedTransferType == 'TOWN_TO_TOWN') {
      console.log(this.availableStock);
      this.receiverTerritory = true;
      this.httpService.getTownList({regionId: 3}).subscribe(val => {
        const towns = JSON.stringify(val);
        this.sender = JSON.parse(towns);
        this.receiver = JSON.parse(towns);
      });
    } else if ( this.changedTransferType == 'WAREHOUSE_TO_TERRITORY') {
      const obj1 = {
        type: 'WAREHOUSE'
      }
      this.httpService.getfactoryList(obj1).subscribe( wareHouseList => {
        this.sender = wareHouseList;
      });
      const territories = JSON.parse(localStorage.getItem('regions') || '[]');
      this.receiver = territories;
      this.receiverTerritory = false;
    } else if ( this.changedTransferType == 'WAREHOUSE_TO_TOWN') {
      this.receiverTerritory = true;
      const obj1 = {
        type: 'WAREHOUSE'
      }
      this.httpService.getfactoryList(obj1).subscribe( wareHouseList => {
        this.sender = wareHouseList;
      });
    }
  }


  initItemRows(modal: any) {

    return this.fb.group({
      // tslint:disable-next-line:radix
      familyId: modal.familyId,
      brandName: modal.brandName,
      stock: modal.stock,
      // tslint:disable-next-line:radix
      receiveQty: [parseInt(modal.transferQty)]

    });
  }

  addNewRow() {
// control refers to your formarray
    const control = <FormArray>this.form.controls['transferStock'];
    // tslint:disable-next-line:no-debugger
    debugger;
    if (isArray(this.availableStock) ) {
        this.availableStock.forEach( x => {
          control.removeAt(0);
          // @ts-ignore
          this.i++;

        });

        this.i = 0;

        this.availableStock.forEach(x => {
          // @ts-ignore
          control.push(this.initItemRows(this.availableStock[this.i]));
          // @ts-ignore
          this.i++;

        });
        this.i = 0;


    }
  }

  loadTownFamiliesData() {
    const obj = {
      townId: this.form.get('fromTransfer').value
    };

    this.httpService.getTownFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
     this.availableStock = JSON.parse(JSON.stringify(data));
     this.addNewRow();
    });
    console.log(this.availableStock);
  }

  loadTerritoryFamiliesData() {
    const obj = {
      territoryId: this.form.get('fromTransfer').value
    };

    this.httpService.getTerritoryFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
      this.addNewRow();
    });
  }


  chooseTownsOfTerritory() {
    const obj = {regionId: this.form.get('fromTransfer').value};
    console.log('getting town list against territory id ' + obj.regionId);
    this.httpService.getTownList(obj).subscribe(val => {
      const towns = JSON.stringify(val);
      this.receiver = JSON.parse(towns);
    });
  }

  loadFactroryStockData() {
    const obj = {factoryId: this.form.get('fromTransfer').value};
    this.httpService.getFactoryStockFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
      this.addNewRow();
    });

  }


  filterTransferedStock(ar) {
    const final_obj = [];
    ar.forEach(obj => {
      if ( obj.receiveQty > 0 ) {
        final_obj.push(obj);
      }
    });
    return final_obj;
  }

  checkTransferedStock(obj) {
    var i = 0;
    for ( i; i < obj.length ; i++){
      if (obj[i].receiveQty > 0 ) {
        return true;
      } else {
        return false;
      }
    }
  }

  /*getWareHouseList () {
    const obj = { type: 'WAREHOUSE'}
    this.httpService.getfactoryList(obj).subscribe( wareHouseList => {
       return wareHouseList;
    });
  }
*/
}
