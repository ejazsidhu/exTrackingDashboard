import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DEDetailsComponent } from './DE-DSR-components/dedetails/dedetails.component';
import { DSRDetailComponent } from './DE-DSR-components/dsrdetail/dsrdetail.component';
import { DSRBlockDetailComponent } from './DE-DSR-components/dsrblock-detail/dsrblock-detail.component';
import {
  MatCardModule,
  MatTableModule,
  MatButtonModule,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatTabsModule,
  MatDatepickerModule,
  MatCheckboxModule, MatSlideToggleModule, MatProgressSpinnerModule
} from '@angular/material';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { RootComponent } from './root/root.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {DistributionDetailComponent} from './distributiondetail-component/distributiondetail.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { DummayTableComponent } from './dummay-table/dummay-table.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap';
import {StockTransferComponent} from './stock-transfer/stock-transfer.component';
import {StockReceiverComponent} from './stock-receiver/stock-receiver.component';
import { ViewStockComponent } from './view-stock/view-stock.component';
import { AddFactoryStockComponent } from './add-factory-stock/add-factory-stock.component';
import { DistributionListComponent } from './distribution-list/distribution-list.component';
import { DsrSaleTargetComponent } from './dsr-sale-target/dsr-sale-target.component';
import { ShopsInBlockComponent } from './shops-in-block/shops-in-block.component';
import { DeAttendanceComponent } from './de-attendance/de-attendance.component';
import {BlocksInDsrComponent} from './blocks-in-dsr/block-in-dsr.component';
import { MerchandiserDsrSalesComponent } from './merchandiser-dsr-sales/merchandiser-dsr-sales.component';
import {StockTransactionsComponent} from './stock-transactions/stock-transactions.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {AttendanceApprovalComponent} from './attendance-approval/attendance-approval.component';
import {AgmCoreModule} from '@agm/core';
// @ts-ignore
import {AgmSnazzyInfoWindowModule} from '@agm/snazzy-info-window';
// @ts-ignore
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import {CensusMapViewComponent} from './census-map-view/census-map-view.component';
import {WwWrMapViewComponent} from './ww-wr-map-view/ww-wr-map-view.component';
// @ts-ignore
import { AgmDirectionModule } from 'agm-direction';
import { MapWithWaypointsTrackComponent } from './map-with-waypoints-track/map-with-waypoints-track.component';
import {AddTownComponent} from './add-town/add-town.component';

@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [DEDetailsComponent, DSRDetailComponent, DSRBlockDetailComponent, RootComponent , DistributionDetailComponent, AddDeviceComponent, DummayTableComponent , StockTransferComponent, StockReceiverComponent, ViewStockComponent, AddFactoryStockComponent, DistributionListComponent, DsrSaleTargetComponent, ShopsInBlockComponent,
    // tslint:disable-next-line:max-line-length
    DeAttendanceComponent , BlocksInDsrComponent, MerchandiserDsrSalesComponent , StockTransactionsComponent , AttendanceApprovalComponent , CensusMapViewComponent , WwWrMapViewComponent, MapWithWaypointsTrackComponent,
    DeAttendanceComponent , BlocksInDsrComponent, MerchandiserDsrSalesComponent , StockTransactionsComponent , AttendanceApprovalComponent , CensusMapViewComponent , WwWrMapViewComponent,
    AddTownComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    Ng2OrderModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    NgxPaginationModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatTabsModule,
    TabsModule,
    ModalModule.forRoot(),
    MatDatepickerModule,
    MatSlideToggleModule,
    BsDatepickerModule.forRoot(),
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    MatProgressSpinnerModule,
    AgmJsMarkerClustererModule,
    AgmDirectionModule

  ]
})
export class AdminModule { }
