import { Component, OnInit, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from '../../../dashboard.service';

@Component({
  selector: 'DSR-block',
  templateUrl: './dsrblock-detail.component.html',
  styleUrls: ['./dsrblock-detail.component.scss']
})
export class DSRBlockDetailComponent {
  sortBy: any;
  sortOrder: boolean;
 @Input('data') dsrAreasDetailTable: any;
 @Output('updateBlock') updateBlock = new EventEmitter<{}>();
 @Output('getBlockShops') getBlockShops = new EventEmitter<{}>();
  constructor(private httpService: DashboardService, public activatedRoute: ActivatedRoute) { }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {

    this.dsrAreasDetailTable = changes.dsrAreasDetailTable.currentValue;

  }


  emitObj(item) {

      this.updateBlock.emit(item);
  }
  emitShop(item) {

    this.getBlockShops.emit(item);
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
}
