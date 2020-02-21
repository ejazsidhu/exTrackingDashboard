import {Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewChildren} from '@angular/core';

@Component({
  selector: 'shops-in-block',
  templateUrl: './shops-in-block.component.html',
  styleUrls: ['./shops-in-block.component.scss']
})


export class ShopsInBlockComponent implements OnInit, OnChanges {
  @Input('data') getBlockWiseShops: any;
  @Input('blockList') blockList: any;
  @Input('selectedBlock') selectedBlock: any;

  @Output('updateShopInBlock') updateShopInBlock = new EventEmitter<any>();
  @ViewChildren('checked') private myCheckbox: any;


  allSelected: boolean;
  selectedShops: any = [];
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
      this.blockList = changes.blockList.currentValue;
    }
    if (changes.selectedBlock) {
      this.selectedBlock = changes.selectedBlock.currentValue;
    }
    console.log(this.getBlockWiseShops);
    console.log(this.blockList);
    console.log(this.selectedBlock);

  }

  ngOnInit() {
    this.allSelected = false;
    // this.selectedDE = this.getBlockWiseShops[0].de_code;
  }

  counter(event, item, index) {
    if (!event.checked) {
    this.selectedShops.push(item.shop_id);
    } else {
      const i = this.selectedShops.indexOf(item.shop_id);
      this.selectedShops.splice(i, 1);
    }
    console.log(this.selectedShops);

  }

  /*checkUncheckAll() {
    // for (let i = 0; i < this.getBlockWiseShops.length; i++) {
    //   this.getBlockWiseShops[i].isSelected = this.allSelected;
    // }
  }*/
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
      shops: this.selectedShops.join(),
      areaId: this.selectedBlock,
      userId: localStorage.getItem('user_id')
    };
    this.updateShopInBlock.emit(obj);
  }


}

