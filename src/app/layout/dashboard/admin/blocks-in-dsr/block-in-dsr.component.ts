import {Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewChildren} from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'block-in-dsr',
  templateUrl: './block-in-dsr.component.html',
  styleUrls: ['./block-in-dsr.component.scss']
})


export class BlocksInDsrComponent implements OnInit, OnChanges {
  @Input('data') getBlockWiseShops: any;
  @Input('dsrList') dsrList: any;
  @Input('selectedBlock') selectedBlock: any;

  @Output('updateBlockInDsr') updateBlockInDsr = new EventEmitter<any>();
  @ViewChildren('checked') private myCheckbox: any;


  allSelected: boolean;
  selectedShops = [];
  selectedDE: any;
  selectedDSR: any;
  selectedRegion: any;
  isSelected: boolean;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.selectedShops = [];

    // tslint:disable-next-line:triple-equals
    if (changes.getBlockWiseShops) {
      this.getBlockWiseShops = changes.getBlockWiseShops.currentValue;


      this.selectedRegion = this.getBlockWiseShops[0].region_id;

    } if (changes.blockList) {
      this.dsrList = changes.blockList.currentValue;
    }
    if (changes.selectedBlock) {
      this.selectedBlock = changes.selectedBlock.currentValue;
    }
    console.log(this.getBlockWiseShops);
    console.log(this.dsrList);
    console.log(this.selectedBlock);

  }

  ngOnInit() {
    this.allSelected = false;
    // this.selectedDE = this.getBlockWiseShops[0].de_code;
  }

  counter(event, item, index) {
    debugger;
    if (!event.checked) {
    this.selectedShops.push(item.block_id);
    } else {
      const i = this.selectedShops.indexOf(item.block_id);
      this.selectedShops.splice(i, 1);
    }
    console.log(this.selectedShops);
  }

  checkUncheckAll(event) {
    debugger;
    if (event.checked == true) {
      for (let i = 0; i < this.getBlockWiseShops.length; i++) {
        this.selectedShops.push(this.getBlockWiseShops[i].block_id);
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
          this.myCheckbox._results[index]._checked  = true;
      }
    } else {
      for (let i = 0; i < this.getBlockWiseShops.length; i++) {
        /*this.selectedShops.remove(this.getBlockWiseShops[i].block_id);*/
        const i = this.selectedShops.indexOf('block_id');
        this.selectedShops.splice(i, 1);
        this.selectedShops = [];
      }
      for (let index = 0; index < this.myCheckbox._results.length; index++) {
        this.myCheckbox._results[index]._checked  = false;
      }

    }
  }

  isAllSelected() {
    this.allSelected = this.getBlockWiseShops.every(function(item: any) {
        return item.isSelected === true;
      });
  }

  emitValue() {
    const obj = {
      blocks: this.selectedShops.join(),
      dsrId: this.selectedBlock,
      userId: localStorage.getItem('user_id')
    };
    this.updateBlockInDsr.emit(obj);
  }


}

