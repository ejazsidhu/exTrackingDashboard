import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, FormArray} from '@angular/forms';
import {DashboardService} from '../../dashboard.service';
import * as moment from 'moment';
import {isArray} from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-stock-receiver',
  templateUrl: './stock-receiver.component.html',
  styleUrls: ['./stock-receiver.component.scss']
})
export class StockReceiverComponent implements OnInit {
title = 'add Device';
form: FormGroup;
response:  any ;
success: boolean;
transferType: any = ['FACTORY_TO_TERRITORY', 'TERRITORY_TO_TERRITORY', 'TERRITORY_TO_TOWN', 'TOWN_TO_TOWN'];
startDate: any;
  sender: any;
  receiver: any;
  receiver_title: any;
  changedTransferType: any;
  availableStock: any = [];
  transferCodes: any;
  transferCode: any;
  i: Number = 0;
  formValid: boolean;
  error: boolean;
  negativeAmountError: boolean;
  isResponseTrue: boolean;
  SubmitTransferStatusMessage: boolean;
  transitCodes: any;
  selectedTransitCode: any;
  transitDetails: any;
  stockSender: any;
  stockReceiver: any;
  sent_date: any;
  // @ts-ignore
  startDate = new Date();
  endDate = new Date();
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  transferId: any;
  factories = [{id: 1, title: 'FACTORY - 1'}, {id: 2, title: 'FACTORY - 2'}, {id: 3, title: 'FACTORY - 3'}];
  receiverId: Number = 0;
  isStockRendering = true;




  constructor(public fb: FormBuilder, private httpService: DashboardService, private toaster: ToastrService, public router: Router) {
   }

  ngOnInit() {
      this.startDate = new Date();
      if (!isArray(this.transitCodes)) {
        this.getReceivedStockTransitCodes();
      }

    console.log(this.transitCodes);
      this.form = this.fb.group({
        transferType: ['', Validators.required],
        receivedDate: [moment(this.startDate).format('YYYY-MM-DD')],
        transferStatus: ['RECEIVED'],
        transferCode: [this.transferCode],
        transferDevice: ['WEB', Validators.required],
        transferId: [this.transferId, Validators.required],
        toTransfer: [null, Validators.required],
        fromTransfer: [null, Validators.required],
        stockReceiver: [localStorage.getItem('user_id'), Validators.required],
        transferStock: this.fb.array([])

      });
      this.newOnChange();

  }

  onSubmit() {
    const formData = new FormData();

    const obj = this.form.get('transferStock').value;
    const StockTransfer = {
      transferType: this.form.get('transferType').value,
      receivedDate: this.form.get('receivedDate').value,
      transferStatus: this.form.get('transferStatus').value,
      transferCode: this.form.get('transferCode').value,
      transferDevice: this.form.get('transferDevice').value,
      transferId: this.form.get('transferId').value,
   /*   toSource: this.form.get('toTransfer').value,*/
      stockReceiver: this.form.get('stockReceiver').value,
      transferedStock: obj
    };
    this.receiverId = this.form.get('toTransfer').value;
    debugger;
    this.SubmitTransferStatusMessage = true;
    formData.append('StockTransfer', JSON.stringify(StockTransfer));
    this.httpService.submitReceivedStockData(formData).subscribe((data: any) => {
      console.log(data);
      if (data.status) {
        this.SubmitTransferStatusMessage = false;
        this.toaster.success(data.message);
        this.isResponseTrue = true;
      //  this.router.navigate(['/admin/stock_receiver']);
       // this.isStockRendering = false;
        // tslint:disable-next-line:max-line-length
        if (this.form.get('transferType').value === 'FACTORY_TO_TERRITORY' || this.form.get('transferType').value === 'TERRITORY_TO_TERRITORY') {
      //  this.loadTerritoryFamiliesData();
          // tslint:disable-next-line:max-line-length
        } else if (this.form.get('transferType').value === 'FACTORY_TO_TOWN' || this.form.get('transferType').value === 'TERRITORY_TO_TOWN' || this.form.get('transferType').value === 'TOWN_TO_TOWN') {
     //       this.loadTownFamiliesData();
        }

        // this.form.reset();
        this.ngOnInit();
      /*   this.availableStock = [];*/
        this.transitCodes = [];
        this.getReceivedStockTransitCodes();

      } else {
        this.SubmitTransferStatusMessage = false;
        this.toaster.warning(data.message);
        this.form.reset();
      }
    });

  }


  newOnChange() {

    this.form.get('transferCode').valueChanges.subscribe( val => {
      // method call for transitCodeDetails
      console.log('i am being called');
      const req_obj = {
        transitCode: val,
        userId: localStorage.getItem('user_id'),
      };
     if ( val != null) {
       this.getTransitCodeDetails(req_obj);
     }
    });

    this.form.get('transferStock').valueChanges.subscribe(value => {
      let notFound = false;
      let negativeAmountErrorNotFound = false;
      value.forEach(obj => {
        if (obj.stock < obj.receiveQty) {
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


 /* onTransferedTypeSelectChange() {

    if (this.changedTransferType == 'FACTORY_TO_TERRITORY') {

      // @ts-ignore
      this.sender = [{id: -1, title: 'FACTORY'}];
      const territories = JSON.parse(localStorage.getItem('regions') || '[]');
      this.receiver = [territories[3] || '[]'];
      console.log(this.receiver);
    } else if (this.changedTransferType == 'TERRITORY_TO_TERRITORY') {
      const territories = JSON.parse(localStorage.getItem('regions') || '[]');
      this.sender = territories;
      this.receiver = JSON.parse(localStorage.getItem('regions') || '[]');
    } else if (this.changedTransferType == 'TERRITORY_TO_TOWN') {
      console.log('this is from TERRITORY_TO_TOWN' + this.availableStock)
      const territories = JSON.parse(localStorage.getItem('regions') || '[]');
      this.sender = territories;
      this.httpService.getTownList({regionId: 3}).subscribe(val => {
        const towns = JSON.stringify(val);
        this.receiver = JSON.parse(towns);
      });

    } else if (this.changedTransferType == 'TOWN_TO_TOWN') {
      this.httpService.getTownList({regionId: 3}).subscribe(val => {
        const towns = JSON.parse(JSON.stringify(val)  || '[]');
        this.sender = towns;
        this.receiver = '';
      });
    }
  }*/

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
    if (isArray(this.availableStock)) {
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

  getTransferCodesFromServerSide(obj) {
    this.httpService.getTransferCodesFromServerSide(obj).subscribe( data => {
  this.transferCodes = [];
  this.transferCodes = JSON.parse(JSON.stringify(data));
  console.log(this.transferCodes);
});
}

getTerritoryReceivedStock_componentMethod(obj) {
  this.httpService.getTerritoryReceivedStock(obj).subscribe( data => {
    this.availableStock = [];
    this.availableStock = JSON.parse(JSON.stringify(data));
    this.addNewRow();
    console.log(this.availableStock);
  });
}


  getReceivedStockTransitCodes() {
    this.httpService.getReceivedStockTransitCodes().subscribe( data => {
      const codes = JSON.stringify(data);
      this.transitCodes = JSON.parse(codes);
    });
  }


  getTransitCodeDetails (obj) {
    this.httpService.getTransitCodeDetails(obj).subscribe( res => {
      // tslint:disable-next-line:no-debugger
    if (res) {
    debugger;
      this.transitDetails = res;
     // this.transferId = this.transitDetails.id;
      this.form.get('transferId').patchValue(this.transitDetails.id);
      const obj_for_stock_request = {
        transferId: this.transitDetails.id,
        userId: localStorage.getItem('user_id'),
       };
      /*    this.getTerritoryReceivedStock_componentMethod(obj_for_stock_request);*/
      this.getReceivedStock(obj_for_stock_request);


      if (this.transitDetails.transferType === 'TOWN_TO_TOWN') {
        this.form.patchValue({transferDate: this.transitDetails.sentDate , transferType: this.transitDetails.transferType
          , fromTransfer: this.transitDetails.sender , toTransfer: this.transitDetails.receiver});
        /*this.httpService.getTownList({regionId: 3}).subscribe(val => {
          const towns = JSON.stringify(val);
          this.receiver = JSON.parse(towns);

          const var1 = res[0].sender_id;
          const var2 = res[0].receiver_id;
          this.receiver.forEach( t => {
            if (t.id == var1 ) {
              this.stockSender = t.town_name;
            } else if ( t.id == var2 ) {
              this.stockReceiver = t.town_name;
            }
          });

        });*/

      } else if (this.transitDetails.transferType === 'TERRITORY_TO_TERRITORY' ) {
        this.form.patchValue({transferDate: this.transitDetails.sentDate , transferType: this.transitDetails.transferType
          , fromTransfer: this.transitDetails.sender , toTransfer: this.transitDetails.receiver});
        /*const territories = JSON.parse(localStorage.getItem('regions') || '[]');
        const var1 = res[0].sender_id;
        const var2 = res[0].receiver_id;
        territories.forEach( t => {
          if (t.id == var1 ) {
            this.stockSender = t.title;
          } else if ( t.id == var2 ) {
            this.stockReceiver = t.title;
          }
        });*/
      } else if (this.transitDetails.transferType === 'TERRITORY_TO_TOWN') {

        this.form.patchValue({transferDate: this.transitDetails.sentDate , transferType: this.transitDetails.transferType
          , fromTransfer: this.transitDetails.sender , toTransfer: this.transitDetails.receiver});
        /*const territories = JSON.parse(localStorage.getItem('regions') || '[]');
        const var1 = res[0].sender_id;
        const var2 = res[0].receiver_id;
        territories.forEach( t => {
          if (t.id == var1 ) {
            this.stockSender = t.title;
          } else if ( t.id == var2 ) {
            this.stockReceiver = t.title;
          }
        });*/

        /*this.httpService.getTownList({regionId: res[0].sender_id}).subscribe(val => {
          const towns = JSON.stringify(val);
          this.receiver = JSON.parse(towns);
          const var2 = res[0].receiver_id;
          this.receiver.forEach( t => {
            if ( t.id == var2 ) {
              this.stockReceiver = t.town_name;
            }
          });

        });*/

      } else if (this.transitDetails.transferType === 'FACTORY_TO_TERRITORY') {
        this.form.patchValue({transferDate: this.transitDetails.sentDate , transferType: this.transitDetails.transferType
          , fromTransfer: this.transitDetails.sender , toTransfer: this.transitDetails.receiver});
        /*const territories = JSON.parse(localStorage.getItem('regions') || '[]');
        const var1 = res[0].sender_id;
        const var2 = res[0].receiver_id;

        this.factories.forEach( f => {
          if (f.id == var1) {
            this.stockSender = f.title;
          }
        });
        territories.forEach( t => {
          if ( t.id == var2 ) {
            this.stockReceiver = t.title;
          }
        });*/
      } else if (this.transitDetails.transferType === 'FACTORY_TO_TOWN') {
      debugger;
        this.form.patchValue({transferDate: this.transitDetails.sentDate , transferType: this.transitDetails.transferType
          , fromTransfer: this.transitDetails.sender , toTransfer: this.transitDetails.receiver});

        /*this.httpService.getTownList({regionId: 3}).subscribe(val => {
          const towns = JSON.stringify(val);
          this.receiver = JSON.parse(towns);

          const var1 = res[0].sender_id;
          this.factories.forEach( f => {
            if (f.id == var1) {
              this.stockSender = f.title;
            }
          });
          const var2 = res[0].receiver_id;
          this.receiver.forEach( t => {
            if ( t.id == var2 ) {
              this.stockReceiver = t.town_name;
            }
          });

        });*/

      } else if (this.transitDetails.transferType === 'FACTORY_TO_WAREHOUSE') {
        this.form.patchValue({transferDate: this.transitDetails.sentDate , transferType: this.transitDetails.transferType
          , fromTransfer: this.transitDetails.sender , toTransfer: this.transitDetails.receiver});
      } else if (this.transitDetails.transferType === 'WAREHOUSE_TO_TERRITORY') {
        this.form.patchValue({transferDate: this.transitDetails.sentDate , transferType: this.transitDetails.transferType
          , fromTransfer: this.transitDetails.sender , toTransfer: this.transitDetails.receiver});
      } else if (this.transitDetails.transferType === 'WAREHOUSE_TO_TOWN') {
        this.form.patchValue({transferDate: this.transitDetails.sentDate , transferType: this.transitDetails.transferType
          , fromTransfer: this.transitDetails.sender , toTransfer: this.transitDetails.receiver});
      }
    }
    });
  }


  getReceivedStock(obj) {
    this.httpService.getReceivedStock(obj).subscribe( data => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
      this.addNewRow();
      console.log(this.availableStock);
    });


  }


  loadTerritoryFamiliesData() {
    const obj = {
      territoryId: this.receiverId
    };

    this.httpService.getTerritoryFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
      this.addNewRow();
    });
  }

  loadTownFamiliesData() {
    const obj = {
      townId: this.receiverId
    };

    this.httpService.getTownFamilies(obj).subscribe((data: any) => {
      this.availableStock = [];
      this.availableStock = JSON.parse(JSON.stringify(data));
      this.addNewRow();
    });
    console.log(this.availableStock);
  }

}
