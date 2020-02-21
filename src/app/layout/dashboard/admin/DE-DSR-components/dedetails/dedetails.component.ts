import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DashboardService} from '../../../dashboard.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';


@Component({
  selector: 'DE-details',
  templateUrl: './dedetails.component.html',
  styleUrls: ['./dedetails.component.scss']
})
export class DEDetailsComponent implements OnChanges {
  title = 'D.E Details Summary';
  @Input('data') tableData: any;
  @Input('employeeList') employeeList: any;
  @Output('selectedId') selectedId = new EventEmitter<any>();
  @ViewChild('childModal') childModal: ModalDirective;
  selectedItem: any = {};
  selectedDEName: any = '';
  selectedDECode: any = '';
  selectedDEId: any = '';
  sortBy: any;
  sortOrder: boolean;
  selectedEmployee: any;


  color = 'primary';
  checked = false;
  disabled = false;
  constructor( private httpService: DashboardService, private toaster: ToastrService) {
  }

  showChildModal(item?): void {
    console.log(this.employeeList);
    console.log(item);
    this.selectedItem = item;
    this.selectedDEName  = this.selectedItem.DEs_name;
    this.selectedDECode = this.selectedItem.m_code;
    this.selectedDEId = this.selectedItem.employee_id;
    this.selectedEmployee = this.selectedItem.employee_id;
    this.checked = (this.selectedItem.status === 'Y') ? this.checked = true : this.checked = false;
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  updateArray(id, name) {
    const i = _.findIndex(this.tableData, {surveyor_id: id});
    if (i > -1) {
      this.tableData[i].DEs_name = name;
    }

  }

  updateDEName() {

    if (this.selectedDEName === '') {

      this.toaster.info('Name can not be empty');
    }
    if (this.selectedDEName.length > 20) {

      this.toaster.info('Name can not be greater than 20 characters');
    } else {
      const obj = {
        surveyorId: this.selectedItem.surveyor_id,
        employeeId: this.selectedEmployee,
       /* deName: this.selectedDEName,*/
        userId: localStorage.getItem('user_id'),
        deStatus: (this.checked === true) ? 'Y' : 'N'
      };

      this.httpService.updateDEName(obj).subscribe((data: any) => {
        if (data.status) {
            this.toaster.success(data.message);
          this.updateArray(data.surveyorId, data.deName);
        } else {
          this.toaster.warning(data.message);
        }
        this.hideChildModal();

      }, error => {
        if (error.statusText) {
        this.toaster.error(error.statusText);
        } else {
        this.toaster.error(error.message);
        }
        this.hideChildModal();

      });
    }


  }





  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableData) {
    this.tableData = changes.tableData.currentValue;
    }
    if (changes.employeeList) {
      this.employeeList = changes.employeeList.currentValue;
    }
  }
  setId(id) {
    this.selectedId.emit(id);
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


}
