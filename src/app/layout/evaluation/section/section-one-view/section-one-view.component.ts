import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Title }     from '@angular/platform-browser';
import { config } from 'src/assets/config';

@Component({
  selector: 'section-one-view',
  templateUrl: './section-one-view.component.html',
  styleUrls: ['./section-one-view.component.scss']
})
export class SectionOneViewComponent implements OnInit {
  @Input('data') data;
  @Output('showModal') showModal: any = new EventEmitter<any>();

  selectedImage: any = {};
  selectedShop: any;
  // ip=environment.ip;
  configFile = config;
  ip: any = this.configFile.ip;

  constructor(private titleService: Title) { }
  ngOnChanges(changes: SimpleChanges ): void {

    this.data = changes.data.currentValue;
    this.selectedImage = this.data.imageList[0];

  }
  ngOnInit() {
    this.titleService.setTitle(this.data.sectionTitle);
  }
  showChildModal(shop): void {
    this.selectedShop = shop;
    this.showModal.emit(this.selectedImage);

    // this.childModal.show();
  }
  setSelectedImage(img) {
    this.selectedImage = img;

  }
  hideChildModal() {

  }

  goToEvaluation(id, visitType) {
    window.open(`${environment.hash}dashboard/evaluation/shop_list/details/${id}/${visitType}?location=shop`, '_blank');
    // window.open(`${environment.hash}dashboard/evaluation/shop_list/details/${id}/${visitType}`, '_blank');
  }
}
