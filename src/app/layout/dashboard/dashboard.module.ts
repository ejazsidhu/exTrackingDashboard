import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSelectModule, MatNativeDateModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { RawDataComponent } from './raw-data/raw-data.component';
import { FormsModule } from '@angular/forms';
import { FilterBarComponent } from './inner-pages/filter-bar/filter-bar.component';
import { VisitProductivityComponent } from './inner-pages/visit-productivity/visit-productivity.component';

import { AttendanceReportComponent } from './inner-pages/attendance-report/attendance-report.component';
import { MerchandiserListComponent } from './inner-pages/merchandiser-list/merchandiser-list.component';
import { MerchandiserProductivityComponent } from './inner-pages/merchandiser-productivity/merchandiser-productivity.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { ShopDetailComponent } from './inner-pages/shop-detail/shop-detail.component';
import { ModalModule } from 'ngx-bootstrap';
import { UniqueBaseProductivityComponent } from './inner-pages/unique-base-productivity/unique-base-productivity.component';
import { NgxPaginationModule } from 'ngx-pagination';
/*import {LineChartComponent} from './inner-pages/home/line-chart/line-chart.component';*/
import { HomeComponent } from './inner-pages/home/home.component';
import { ShopDetailVisitComponent } from './inner-pages/shop-detail-visit/shop-detail.visit.component';
import { ShopDetailTownStormingComponent } from './inner-pages/shop-detail-town-storming/shop-detail.town_storming.component';

import { StockTransferComponent } from './admin/stock-transfer/stock-transfer.component';

import { ExportDataComponent } from './inner-pages/export-data/export-data.component';
import { DsrSaleComponent } from './inner-pages/dsr-sale/dsr-sale.component';
import { DeWwWrSummaryComponent } from './inner-pages/de-ww-wr-summary/de-ww-wr-summary.component';
import { TmProductivityComponent } from './inner-pages/tm-productivity/tm-productivity.component';

import { SaleAchievementComponent } from './inner-pages/sale-achievement/sale-achievement.component';

import { EvaluationReportVisitWiseComponent } from './inner-pages/evaluation-report-visit-wise/evaluation-report-visit-wise.component';
import { EvaluationReportDateWiseComponent } from './inner-pages/evaluation-report-date-wise/evaluation-report-date-wise.component';
import { DsrAttendanceComponent } from './inner-pages/dsr-attendance/dsr-attendance.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatGridListModule,
    StatModule,
    MatCardModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false }),
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    Ng2OrderModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    MatTooltipModule
  ],
  // tslint:disable-next-line:max-line-length

  // tslint:disable-next-line:max-line-length
  declarations: [FilterBarComponent, ShopDetailTownStormingComponent, HomeComponent, DashboardComponent, VisitProductivityComponent, AttendanceReportComponent, MerchandiserListComponent, MerchandiserProductivityComponent, ShopDetailComponent, RawDataComponent, UniqueBaseProductivityComponent,
    ShopDetailVisitComponent,
    ExportDataComponent,
    DsrSaleComponent,
    DeWwWrSummaryComponent,
    TmProductivityComponent,
    SaleAchievementComponent,
    EvaluationReportVisitWiseComponent,
    EvaluationReportDateWiseComponent,
    DsrAttendanceComponent]

})
export class DashboardModule { }
