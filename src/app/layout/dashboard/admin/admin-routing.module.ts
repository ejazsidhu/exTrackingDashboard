import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DEDetailsComponent } from './DE-DSR-components/dedetails/dedetails.component';
import { DSRDetailComponent } from './DE-DSR-components/dsrdetail/dsrdetail.component';
import { DSRBlockDetailComponent } from './DE-DSR-components/dsrblock-detail/dsrblock-detail.component';
import { RootComponent } from './root/root.component';
import {DistributionDetailComponent} from './distributiondetail-component/distributiondetail.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import {StockTransferComponent} from './stock-transfer/stock-transfer.component';
import {StockReceiverComponent} from './stock-receiver/stock-receiver.component';
import {ViewStockComponent} from './view-stock/view-stock.component';
import {AddFactoryStockComponent} from './add-factory-stock/add-factory-stock.component';
import { DistributionListComponent } from './distribution-list/distribution-list.component';
import { DsrSaleTargetComponent } from './dsr-sale-target/dsr-sale-target.component';
import { DeAttendanceComponent } from './de-attendance/de-attendance.component';
import { MerchandiserDsrSalesComponent } from './merchandiser-dsr-sales/merchandiser-dsr-sales.component';
import {StockTransactionsComponent} from './stock-transactions/stock-transactions.component';
import {AttendanceApprovalComponent} from './attendance-approval/attendance-approval.component';
import {CensusMapViewComponent} from './census-map-view/census-map-view.component';
import {WwWrMapViewComponent} from './ww-wr-map-view/ww-wr-map-view.component';
import { MapWithWaypointsTrackComponent } from './map-with-waypoints-track/map-with-waypoints-track.component';
import {AddTownComponent} from './add-town/add-town.component';

const routes: Routes = [
  // { path: '', component: RootComponent, children: [

  //   { path: '', redirectTo: 'DE_Summary', pathMatch: 'full'},
  //   { path: 'DE_Summary', component: DEDetailsComponent },
  //   { path: 'DSR_Detail', component: DSRDetailComponent },
  //   { path: 'DSR_Block_Detail', component: DSRBlockDetailComponent },


  // ]
  // },
  { path: '', component: RootComponent},
  { path: 'add_device', component: AddDeviceComponent },
  {path: 'stock_transfer', component: StockTransferComponent},
  {path: 'stock_receiver' , component: StockReceiverComponent } ,
  {path: 'merchandiser_dsr_sales' , component: MerchandiserDsrSalesComponent } ,
  {path: 'view_stock' , component: ViewStockComponent},
  {path: 'add-factory_stock' , component: AddFactoryStockComponent},
  { path: 'distribution_details', component: DistributionDetailComponent},
  { path: 'distribution_list', component: DistributionListComponent},
  { path: 'dsr_sale_target', component: DsrSaleTargetComponent },
  { path: 'de-attendance', component: DeAttendanceComponent },
  { path: 'stock_transactions' , component: StockTransactionsComponent },
  {path: 'attendance_approval' , component: AttendanceApprovalComponent},
  {path: 'census_map_view', component: CensusMapViewComponent},
  {path: 'ww-wr_map_view', component: WwWrMapViewComponent},
  {path: 'ww-wr_map_view_direction_track', component: MapWithWaypointsTrackComponent},
  {path: 'add_town', component: AddTownComponent},


  { path: '**', redirectTo: '' },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
