import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {DashboardService} from '../../dashboard.service';
import {ModalDirective} from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {isString} from 'ngx-bootstrap/chronos/utils/type-checks';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit  {
title = 'add Device';
  @ViewChild('childModal') childModal: ModalDirective;
form: FormGroup;
response:  any ;
success: boolean;
imeis: any = [];
selectedItem: any = {};
selectedImeiNumber: any = '';
imeiStatus: any;
imeiValid: boolean;
color = 'primary';
loading = false;
checked = false;
loadingReportMessage = false;

statusArray: any = [{title: 'Activate' , value: 'Y'} , {title: 'De-activate' , value: 'N'}];

 number = new FormControl('', [ Validators.maxLength(15), Validators.minLength(15), Validators.pattern('[0-9]*')]);
  constructor(public fb: FormBuilder, private httpService: DashboardService , private toaster: ToastrService) {

   }

  ngOnInit() {
    this.form = this.fb.group({
      number: this.number,
      avatar: null
    });
    this.getImeis();
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }
  }

  onSubmit(post) {
    const formData = new FormData();

    // tslint:disable-next-line:prefer-const
    let model: any;
  //  model.Number = post.number;



   // formData.append('model', JSON.stringify(model));

    formData.append('imei_number', this.form.get('number').value);
    formData.append('avatar', this.form.get('avatar').value);
    if ( formData.get('imei_number') !== '' && formData.get('avatar') != null) {
      this.httpService.uploadImei(formData).subscribe(data => {
        console.log(data);
        this.response = data;
        this.getImeis();
      });
    }
    if (this.response === 'Imeis Added into System.') {
      this.success = true;
    }
  }

  getImeis() {
    this.loading = true;
    this.httpService.getImeis().subscribe(data => {
      this.imeis = data;
      this.loading = false;
    });
  }

  showChildModal(item?): void {
    this.selectedItem = item;
    this.selectedImeiNumber = this.selectedItem.imei;
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  updateImei(value, imeiNumber) {
    const obj = {
      imei: imeiNumber ,
      imeiStatus: (value.checked === true ) ? 'Y' : 'N'
    };

    this.httpService.updateImeiStatus(obj).subscribe(( data: any ) => {
      if (data.status) {
        this.toaster.success(data.message);
       /* this.updateArray(data.surveyorId,data.deName)*/
        this.getImeis();
      } else {
        this.toaster.warning(data.message);
      }
     // this.hideChildModal();

    }, error => {
      if (error.statusText) {
        this.toaster.error(error.statusText);
      } else {
        this.toaster.error(error.message);
      }
    //  this.hideChildModal();

    });
  }


/*  onChanges() {
    debugger;
  if (isNaN(this.form.get('number').value)) {
    this.imeiValid = false;
  } else {
    this.imeiValid = true;
  }
  }*/

}
