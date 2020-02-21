import { Injectable } from '@angular/core';
import {HttpHeaders, HttpClient, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { config } from 'src/assets/config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  configFile = config;

 ip: any = this.configFile.ip;
//  // ip = 'http://192.168.3.162:8080/census/';
 //  ip = 'http://192.168.3.5:8080/ndn/';
  // ip = environment.ip;
  // ip = 'http://ndn1.concavetech.com/';
  //  ip = 'http://localhost:8080/census/';
   // ip = environment.ip;







  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin' : '*'
    }),
    withCredentials: true
  };

  // @ts-ignore
  httpOptions_with_surveyorId = {
    headers: new HttpHeaders({
      /*'surveyorId' : localStorage.getItem('user_id')*/
      'surveyorId': '-1'
    }),
    withCredentials: true
  };

  user_id: any = 0;
  private selectedRegion: number;


  constructor(private http: HttpClient) {
    this.user_id = localStorage.getItem('user_id');

  }


  merchandiserShopListCBL(obj) {
    const body = this.UrlEncodeMaker(obj);
    // tslint:disable-next-line:max-line-length
    // `zoneId=${obj.zoneId}&regionId=${obj.regionId}&endDate=${obj.endDate}&startDate=${obj.startDate}&distributionId=${obj.distributionId}&cityId=${obj.cityId}&storeType=${obj.storeType}&channelId=${obj.channelId}`;
    const url = this.ip + 'portal/ndn/getMerchandiserShopListNDN';
    return this.http.post(url, body, this.httpOptions);
  }

  TmProductivityNDN(obj) {
    const body = this.UrlEncodeMaker(obj);
    // tslint:disable-next-line:max-line-length
    // `zoneId=${obj.zoneId}&regionId=${obj.regionId}&endDate=${obj.endDate}&startDate=${obj.startDate}&distributionId=${obj.distributionId}&cityId=${obj.cityId}&storeType=${obj.storeType}&channelId=${obj.channelId}`;
    const url = this.ip + 'portal/ndn/getTmProductivityNDN';
    return this.http.post(url, body, this.httpOptions);

  }



  public login(credentials: any) {
    let body = new HttpParams();
    body = body.set('userName', credentials.userName);
    body = body.set('password', credentials.password);
    // const body = 'userName=qamar&password=qamar';
    // let body=JSON.stringify(credentials)
    const url = this.ip + 'portal/ndn/login';
    return this.http.post(url, body);

  }
  getZone() {
    this.user_id = localStorage.getItem('user_id');

    const filter = JSON.stringify({ act: 0, userId: this.user_id });
    const url = this.ip + 'loadFilters';
    return this.http.post(url, filter);

  }

  getCities(regionId) {
    this.user_id = localStorage.getItem('user_id');

    const filter = JSON.stringify({ act: 2, regionId: regionId, userId: this.user_id });
    const url = this.ip + 'loadFilters';
    return this.http.post(url, filter);

  }

  getAreas(channelId) {
    this.user_id = localStorage.getItem('user_id');

    const filter = JSON.stringify({ act: 3, channelId: channelId, userId: this.user_id });
    const url = this.ip + 'loadFilters';
    return this.http.post(url, filter);

  }

  getRegion(zoneId) {
    this.user_id = localStorage.getItem('user_id');

    const filter = JSON.stringify({ act: 1, zoneId: zoneId, userId: this.user_id });
    const url = this.ip + 'loadFilters';
    return this.http.post(url, filter);

  }

  getMerchandiserListForEvaluation(obj) {

    const urlEncode = this.UrlEncodeMaker(obj);
    const url = this.ip + 'merchandiserList';
    return this.http.post(url, urlEncode, this.httpOptions);
  }

  getRegionFixed() {
    this.user_id = localStorage.getItem('user_id');
    const url = this.ip + 'portal/ndn/getRegions?userId=' + this.user_id;
    // const url = this.ip + 'portal/ndn/getRegions';
    return  this.http.get(url, this.httpOptions);
    // return this.http.post(url, filter);

  }

  getRTE(regionID) {
    const filter = JSON.stringify({ act: 8, regionId: regionID });
    const url = this.ip + 'loadFilters';
    return this.http.post(url, filter);

  }

  getMerchandiserListRTE(rteId) {
    const filter = JSON.stringify({ act: 9, rteId: rteId });
    const url = this.ip + 'loadFilters';
    return this.http.post(url, filter);

  }

  public DownloadResource(obj, url) {
    let path;

    path = this.ip + url;


    const form = document.createElement('form');

    form.setAttribute('action', path);

    form.setAttribute('method', 'post');
    // form.setAttribute('target', '_blank');

    document.body.appendChild(form);

    this.appendInputToForm(form, obj);

    form.submit();

    document.body.removeChild(form);


  }
  private appendInputToForm(form, obj) {
    Object.keys(obj).forEach(key => {
      const input = document.createElement('input');

      input.setAttribute('value', obj[key]);

      input.setAttribute('name', key);

      form.appendChild(input);
    });
  }
  UrlEncodeMaker(obj) {
    let url = '';
    // tslint:disable-next-line:forin
    for (const key in obj) {
      url += `${key}=${obj[key]}&`;
    }
    const newUrl = url.substring(0, url.length - 1);
    return newUrl;
  }

  getKeyForReport(reportUrl, body) {
    const url = this.ip + reportUrl;
    return this.http.post(url, body, this.httpOptions);

  }

  getKeyForProductivityReport(body, reportUrl) {
    const url = this.ip + reportUrl;
    return this.http.post(url, body, this.httpOptions);

  }
  getTableList(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/completedShopListNDN';
    return this.http.post(url, body, this.httpOptions);
  }

  getTableOfVisitShops(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/completedVisitShopListNDN';
    return this.http.post(url, body, this.httpOptions);
  }
  getQueryTypeList(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/query-type-list';
    return this.http.post(url, body, this.httpOptions);
  }
  getDashboardData(obj) {
    let body = null;
    if (obj != null) {
      body = this.UrlEncodeMaker(obj);
      // tslint:disable-next-line:max-line-length
      // `zoneId=${obj.zoneId}&regionId=${obj.regionId}&endDate=${obj.endDate}&startDate=${obj.startDate}&distributionId=${obj.distributionId}&cityId=${obj.cityId}&storeType=${obj.storeType}&channelId=${obj.channelId}`;
    }
    const url = this.ip + 'dashboardDataCBL';
    return this.http.post(url, body, this.httpOptions);


  }

  getRegionsFOrDeAndDsrs() {
    this.user_id = localStorage.getItem('user_id');
    const url = this.ip + 'portal/ndn/getRegions?userId=' + this.user_id;
    // return this.http.post(url, body, this.httpOptions);
    return  this.http.get(url, this.httpOptions);
  }

   getDesAndDsrs(obj) {

    const body = this.UrlEncodeMaker(obj);

    // if (selectedRegion > 0) {
      const url_1 = this.ip + 'portal/ndn/getDesAndDsrs';
      return  this.http.post(url_1, body, this.httpOptions);
    // } else {
    //   const url_0 = this.ip + 'portal/ndn/getDesAndDsrs?regionId=' + 0;
    //   return this.http.get(url_0, this.httpOptions);
    // }
  }

  getDsrAreasDetails(obj) {
    const body  = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/getDsrAreasDetails';
    return this.http.post(url, body , this.httpOptions);
  }

  getBlockWiseShopList(obj) {
    const body  = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/block-wise-shop-list';
    return this.http.post(url, body , this.httpOptions);
  }


  getDsrDetails(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/getDsrsDetails';
    return this.http.post(url, body , this.httpOptions);
  }

  uploadImei(obj) {
    const url  = this.ip + 'portal/ndn/uploadImeisOnPortal';
    // @ts-ignore
    return this.http.post(url, obj
    );
  }

  updateDEName(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/updateDeName';
    return this.http.post(url, body, this.httpOptions);
  }
  updateDSR(obj) {
    const body = this.UrlEncodeMaker(obj);

    const url  = this.ip + 'portal/ndn/updateDsrDetails';
    return this.http.post(url, body, this.httpOptions);

  }

  addDSR(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/addDsr';
    return this.http.post(url, body, this.httpOptions);

  }

  addBlock(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/addBlock';
    return this.http.post(url, body, this.httpOptions);

  }

  getTownList(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/getTowns';
    return this.http.post(url, body, this.httpOptions);
  }

  getRegionsByZoneId(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/getRegionsByZoneId';
    return this.http.post(url, body, this.httpOptions);
  }

  getFamilies() {
    const url  = this.ip + 'portal/ndn/getFamiliesForPortal';
    return this.http.get(url , this.httpOptions);
  }
  getTerritoryFamilies(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/getTerritoryFamiliesForPortal';
    return this.http.post(url , body , this.httpOptions);
  }

  saveDsrSale(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/save-dsr-sale';
    return this.http.post(url , body , this.httpOptions);
  }

  getTownFamilies(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/getTownFamiliesForPortal';
    return this.http.post(url , body , this.httpOptions);
  }


  updateDSRArea(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/updateDsrAreasDetails';
    return this.http.post(url, body, this.httpOptions);

  }


  submitStockTransferedData(obj) {

    const url = this.ip + 'portal/ndn/submitTransferedStock';
    // @ts-ignore
    return this.http.post(url, obj );
  }

  getImeis() {
    const url = this.ip + 'portal/ndn/getImeis';
    return this.http.get(url , this.httpOptions);
  }

  updateImeiStatus(obj) {
  const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/updateImei';
  return this.http.post(url, body, this.httpOptions);
  }


  getTransferCodesFromServerSide(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/getTerritoryReceivedStockTransferCodes';
    return this.http.post(url, body , this.httpOptions);
  }

  getTerritoryReceivedStock(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/getTerritoryReceivedStock';
    return this.http.post(url, body , this.httpOptions);
  }

  submitReceivedStockData(obj) {
    const url = this.ip + 'portal/ndn/submitReceivedStock';
    // @ts-ignore
    return this.http.post(url, obj );
  }

  checkValidTransferCode(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/checkTransferCode';
    return this.http.post(url, body , this.httpOptions);
  }

  getReceivedStockTransitCodes() {
    const url = this.ip + 'portal/ndn/getReceivedStockTransferCodesForPortal';
    return this.http.get(url , this.httpOptions_with_surveyorId );
  }

  getTransitCodeDetails(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/getTransitCodeDetails';
    return this.http.post(url, body , this.httpOptions);
  }

  getReceivedStock(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/getReceivedStock';
    return this.http.post(url, body , this.httpOptions);
  }

  getFactoryStockFamilies(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/getFactoryStockFamilies';
    return this.http.post(url, body , this.httpOptions);
  }
  getDistributionList(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/distribution-list';
    return this.http.post(url, body, this.httpOptions);
  }

  updateDistribution(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/update-distribution';
    return this.http.post(url, body, this.httpOptions);
    throw new Error('Method not implemented.');
  }

  getSaleList(obj) {

    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'ndn/getSaleTarget';
    return this.http.post(url , body,  this.httpOptions);
  }

  uploadDsrSaleTarget(obj) {
    const url  = this.ip + 'ndn/uploadDsrSaleTarget';
    // @ts-ignore
    return this.http.post(url, obj
    );
  }

  // portal/ndn/transfer-shops

  transferShop(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/transfer-shops';
    return this.http.post(url, body, this.httpOptions);
  }

  getSurveyorList() {
    const url  = this.ip + 'portal/ndn/surveyor-list';
    return this.http.post(url, this.httpOptions);
  }

  getfactoryList(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/getFactoryList';
    return this.http.post(url, body , this.httpOptions);
  }

  getDeAttendanceList(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url =  this.ip + 'portal/ndn/de-attendance';
    return this.http.post(url, body, this.httpOptions);
  }


  getRemarksList() {
    const url  = this.ip + 'portal/ndn/getRemarks';
    return this.http.get(url , this.httpOptions);
  }

  updateDeRemarkType(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/update-workType';
    return this.http.post(url, body, this.httpOptions);
  }

  getDsrsBySurveyorId (obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/getDsrs';
    return this.http.post(url, body, this.httpOptions);
  }


  getEmployeesList(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/employee-list';
    return this.http.post(url, body, this.httpOptions);
  }


  transferBlocks(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/transfer-blocks';
    return this.http.post(url, body, this.httpOptions);
  }

  merchandiserDsrSales(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/merchandiser-dsr-sales-list';
    return this.http.post(url, body, this.httpOptions);
  }

  updateDsrSales(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/update-dsr-sales';
    return this.http.post(url, body, this.httpOptions);
  }
  getStockTransactionsData(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/getTransactionsData';
    return this.http.post(url, body, this.httpOptions);
  }

  getStockTransactionStockDetails (obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/getTransactionsStockData';
    return this.http.post(url, body, this.httpOptions);
  }

  getDEListByRegionId(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/getDeListByRegionId';
    return this.http.post(url, body, this.httpOptions);
  }

  getDSRsByDEId(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url  = this.ip + 'portal/ndn/dsrs-by-de-id';
    return this.http.post(url, body, this.httpOptions);
  }
  reverseTransaction(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/reverseTransaction';
    return this.http.post(url, body, this.httpOptions);
  }

  getAttendanceDataForApproval(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/getUsersAttendanceForApproval';
    return this.http.post(url, body, this.httpOptions);
  }

  updateAttendanceApproval(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/updateAttendanceForApproval';
    return this.http.post(url, body, this.httpOptions);
  }

  getShopsForDETracking(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/getShopsForMapView';
    return this.http.post(url, body, this.httpOptions);
  }

  getDeListByRegionIdForDETracking(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/getDeListByRegionIdForDeTracking';
    return this.http.post(url, body, this.httpOptions);
  }

  getDsrListBySurveyorIdForDETracking(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/getDsrListBySurveyorIdForDeTracking';
    return this.http.post(url, body, this.httpOptions);
  }

  addTownFromPortal(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/insertCityFromPortal';
    return this.http.post(url, body, this.httpOptions);
  }

  updateTownFromPortal(obj) {
    const body = this.UrlEncodeMaker(obj);
    const url = this.ip + 'portal/ndn/updateCityName';
    return this.http.post(url, body, this.httpOptions);
  }
}
