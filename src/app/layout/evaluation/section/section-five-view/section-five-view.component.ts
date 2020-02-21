import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DashboardService } from 'src/app/layout/dashboard/dashboard.service';
import { environment } from 'src/environments/environment';
import { config } from 'src/assets/config';
@Component({
  selector: 'section-five-view',
  templateUrl: './section-five-view.component.html',
  styleUrls: ['./section-five-view.component.scss']
})
export class SectionFiveViewComponent implements OnInit, AfterViewInit {
  @Input('data') data;
  // ip = environment.ip;
  configFile = config;
  ip: any = this.configFile.ip;
  audio =new Audio();
  // showbtns=false
  constructor(private dashboard: DashboardService) {

  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.data.currentValue;
    const url = changes.data.currentValue.audioFileUrl;
    this.data.audioFileUrl = url;

  }

  ngAfterViewInit() {
// this.showbtns=true
   // this.data.audioFileUrl;
    // this.audio.play();

  }

  playAudio() {
    this.audio.src = 'assets/test.mp3';
    this.audio.src = this.ip + this.data.audioFileUrl.toString();
    console.log(this.ip + this.data.audioFileUrl.toString());
    this.audio.load();

    this.audio.play();
}
  }




