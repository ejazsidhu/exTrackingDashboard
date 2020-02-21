import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DashboardService} from '../../dashboard.service';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';
import {isArray} from 'ngx-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-factory-stock',
  templateUrl: './add-factory-stock.component.html',
  styleUrls: ['./add-factory-stock.component.scss']
})
export class AddFactoryStockComponent implements OnInit {

  title = 'add Device';
  form: FormGroup;
  response: any;
  success: boolean;
  // receiver = [{id: 1, title: 'FACTORY - M1'}, {id: 2, title: 'FACTORY - M3'}, {id: 3, title: 'FACTORY - M4'}];
  receiver: any;

  transferCode: any;
  stockSender: any;
  stockReceiver: any;
  date: any;
  transferDate: any;
  transferStatus: any;
  toTransfer: any;
  availableStock: any = [];
  startDate = new Date();
  endDate = new Date();
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  i: Number = 0;
  j: Number = 0;
  error: boolean;
  formValid: boolean;
  isResponseTrue: boolean;
  validTransferCode: boolean;
  inValidTransferCode: boolean;
  SubmitTransferStatusMessage: boolean;
/*  showAvailableStock = false;*/
  negativeAmountError: boolean;



  constructor(public fb: FormBuilder, private httpService: DashboardService, private toaster: ToastrService , private router: Router) {
    const obj = { type: 'FACTORY' }
    this.httpService.getfactoryList(obj).subscribe( factoryList => {
      this.receiver = factoryList;
    });
  }

  ngOnInit() {
    this.startDate = new Date();
    this.form = this.fb.group({

      transferDate: [moment(this.startDate).format('YYYY-MM-DD'), Validators.required],
      transferType: ['FACTORY_INTAKE', Validators.required],
/*      fromTransfer: [this.sender, Validators.required],*/
      toTransfer: [this.receiver, Validators.required],
      receivedDate: [moment(this.startDate).format('YYYY-MM-DD')],
      transferStatus: ['RECEIVED', Validators.required],
      stockSender: [localStorage.getItem('user_id'), Validators.required],
      stockReceiver: [-1, Validators.required],
/*      transferCode: ['', Validators.required],*/
      transferDevice: ['WEB', Validators.required],
      transferStock: this.fb.array([])

    });
    this.onChanges();
  }


  onChanges(): void {
    this.form.get('toTransfer').valueChanges.subscribe(val => {
    this.loadFactroryStockData();
    });
    this.form.get('transferStock').valueChanges.subscribe(value => {
      let notFound = false;
      let negativeAmountErrorNotFound = false;
      value.forEach(obj => {
        /*if (obj.stock < obj.receiveQty  ) {
          this.error = true;
          // @ts-ignore
          notFound = true;
        } else */
          if (obj.receiveQty < 0) {
          this.negativeAmountError = true;
          negativeAmountErrorNotFound = true;
        }
      });
    /*  if (!notFound) {
        this.error = false;
      }*/
      if (!negativeAmountErrorNotFound) {
        this.negativeAmountError = false;
      }
    });

  }


  onSubmit() {
    const formData = new FormData();
    const obj = this.filterTransferedStock(this.form.get('transferStock').value);
    const timestamp = this.startDate.getHours() + ':' + this.startDate.getMinutes() +  ':' + this.startDate.getSeconds();
    const dateTime = moment(this.form.get('transferDate').value).format('YYYY-MM-DD') + ' ' + timestamp;
    // @ts-ignore
    if (!this.checkTransferedStock(obj)){
      this.toaster.warning('Please assign at-least one brand quantity');
    } else {
      const StockTransfer = {
        transferDate: dateTime,
        transferType: this.form.get('transferType').value,
        /*      fromSource: this.form.get('fromTransfer').value,*/
        toSource: this.form.get('toTransfer').value,
        transferStatus: this.form.get('transferStatus').value,
        stockSender: this.form.get('stockSender').value,
        stockReceiver: this.form.get('stockReceiver').value,
        /*     transferCode: this.form.get('transferCode').value,*/
        receivedDate: this.form.get('receivedDate').value,
        transferDevice: this.form.get('transferDevice').value,
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
          /*        this.showAvailableStock = true;*/
          // this.loadFactroryStockData();
          this.ngOnInit()
          this.availableStock = [];
        } else {
          this.SubmitTransferStatusMessage = false;
          this.toaster.warning(data.description);
        }
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

  loadFactroryStockData() {
    const obj = {factoryId: this.form.get('toTransfer').value};
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
    debugger;
    var i = 0;
    for ( i; i < obj.length ; i++){
      if (obj[i].receiveQty > 0 ) {
        return true;
      } else {
        return false;
      }
    }
  }

}
