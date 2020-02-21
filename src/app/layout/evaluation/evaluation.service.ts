import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DashboardService } from '../dashboard/dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {

 // ip:any=environment.ip;

 ip: any = '';
 user_id: string;
 // 'http://192.168.3.94:8080/audit/';

 constructor(private http: HttpClient, private dashboardService: DashboardService) {

   this.ip = dashboardService.ip;
   this.user_id = localStorage.getItem('user_id');
 }
 httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/x-www-form-urlencoded'
   }),
   withCredentials: true
 };

 UrlEncodeMaker(obj) {
   let url = '';
     // tslint:disable-next-line:forin
     for (const key in obj) {
     url += `${key}=${obj[key]}&`;
   }
   const newUrl = url.substring(0, url.length - 1);
   return newUrl;
 }

 getData(obj) {
   const urlencoded = this.UrlEncodeMaker(obj);
   const url = this.ip + 'shopList';
   return this.http.post(url, urlencoded, this.httpOptions);
 }


 getShopDetails(obj) {
   const urlencoded = this.UrlEncodeMaker(obj);
   const url = this.ip + 'evaluationShop';
   return this.http.post(url, urlencoded, this.httpOptions);
 }
 evaluateShop(obj) {
  const urlencoded = this.UrlEncodeMaker(obj);
  const url = this.ip + 'portal/ndn/evaluate-single-shop';
  return this.http.post(url, obj);
}

}
