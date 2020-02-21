import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-distributiondetail',
  templateUrl: './distributiondetail.component.html',
  styleUrls: ['./distributiondetail.component.scss']
})
export class DistributionDetailComponent implements OnInit {


  title = 'Distributions Detail';
  loading = false;
  surveyor_id: any = 0;
  dsrTabledata: any;
 ip: any = 'http://localhost:8080/census/';
 // ip: any =  'http://192.168.3.5:8080/ndn/';
  //  ip: any = 'http://ndn1.concavetech.com/';
  serialNumber: Number = 1;

  constructor(private http: HttpClient, public activatedRoute: ActivatedRoute) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin' : '*'
    }),
    withCredentials: true
  };

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(p => {
      this.surveyor_id = p.surveyorId;
    });
    this.getDsrDetails();
  }


  getDsrDetails() {
    const url = this.ip + 'portal/ndn/getDsrsDetails?surveyorId=' + this.surveyor_id;
    this.http.get(url, this.httpOptions).subscribe((data) => {
      this.dsrTabledata = data;
    });
  }
}
