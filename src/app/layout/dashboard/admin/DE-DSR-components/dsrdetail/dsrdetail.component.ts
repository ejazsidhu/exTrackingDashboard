import { Component, OnInit, SimpleChanges, Input, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../../dashboard.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'DSR-detail',
  templateUrl: './dsrdetail.component.html',
  styleUrls: ['./dsrdetail.component.scss']
})
export class DSRDetailComponent implements OnChanges, OnInit {
  @Input('data') dsrTabledata: any;
  @Output('selectedId') selectedId = new EventEmitter<any>();
  @Output('updateDSR') updateDSR = new EventEmitter<{}>();
  @Output('DsrBlocks') DsrBlocks = new EventEmitter<{}>();


  DEList: any = [];
  selectedItemCloneForPayload: any = {
    dsrName: ''
  };
  selectedItem: any;
  selectedDE: any = {};
  sortBy: any;
  sortOrder: boolean;
  constructor(private httpService: DashboardService, public activatedRoute: ActivatedRoute, private toaster: ToastrService) {}
  ngOnInit() {
    this.getDesList();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.dsrTabledata = changes.dsrTabledata.currentValue;

  }
  setId(id) {
    this.selectedId.emit(id);
  }


 /*updateArray(id, name) {
    let i = _.findIndex(this.dsrTabledata, { surveyor_id: id });
    if (i > -1) {
      this.dsrTabledata[i].DEs_name = name;
    }
  }*/
  getDesList() {
    const obj = {
      regionId: -1
    };
    this.httpService.getDesAndDsrs(obj).subscribe(data => {
      this.DEList = data;
    });
  }



  emitObj(item) {

    const obj = {
      surveyorId: item.surveyor_id,
      dsrId: item.dsr_id,
      dsrName: item.dsr_name,
      dsr_status: item.dsr_status,
      dsrType: item.dsr_type
    };

    this.updateDSR.emit(obj);

  }


  sortIt(key) {

    debugger;
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

  emitShop(item) {
    this.DsrBlocks.emit(item);
  }
}
