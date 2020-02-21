import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { VisitProductivityComponent } from './inner-pages/visit-productivity/visit-productivity.component';

import { AttendanceReportComponent } from './inner-pages/attendance-report/attendance-report.component';
import { MerchandiserListComponent } from './inner-pages/merchandiser-list/merchandiser-list.component';
import { MerchandiserProductivityComponent } from './inner-pages/merchandiser-productivity/merchandiser-productivity.component';
import { ShopDetailComponent } from './inner-pages/shop-detail/shop-detail.component';
import { RawDataComponent } from './raw-data/raw-data.component';
import { UniqueBaseProductivityComponent } from './inner-pages/unique-base-productivity/unique-base-productivity.component';
import {HomeComponent} from './inner-pages/home/home.component';
import {ShopDetailVisitComponent} from './inner-pages/shop-detail-visit/shop-detail.visit.component';
import {ShopDetailTownStormingComponent} from './inner-pages/shop-detail-town-storming/shop-detail.town_storming.component';
import { ExportDataComponent } from './inner-pages/export-data/export-data.component';
import {DsrSaleComponent} from './inner-pages/dsr-sale/dsr-sale.component';
import { DeWwWrSummaryComponent } from './inner-pages/de-ww-wr-summary/de-ww-wr-summary.component';
import { TmProductivityComponent } from './inner-pages/tm-productivity/tm-productivity.component';
import { SaleAchievementComponent } from './inner-pages/sale-achievement/sale-achievement.component';
import { EvaluationReportVisitWiseComponent } from './inner-pages/evaluation-report-visit-wise/evaluation-report-visit-wise.component';
import { EvaluationReportDateWiseComponent } from './inner-pages/evaluation-report-date-wise/evaluation-report-date-wise.component';
import { DsrAttendanceComponent } from './inner-pages/dsr-attendance/dsr-attendance.component';

const routes: Routes = [
    /*{
      /!*  path: '',
        redirectTo: 'visit_productivity'*!/
      path : '',
      redirectTo : 'home'

    },*/
  { path: '', redirectTo: 'productivity_report', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
    { path: 'visit_productivity', component: VisitProductivityComponent },
    { path: 'attendance_report', component: AttendanceReportComponent },
    { path: 'unique-base-productivity', component: UniqueBaseProductivityComponent },
    { path: 'merchandiser_List', component: MerchandiserListComponent },
    { path: 'productivity_report', component: MerchandiserProductivityComponent },
    { path: 'export-data', component: ExportDataComponent },
    { path: 'evaluation_report_visit_wise', component: EvaluationReportVisitWiseComponent },
    { path: 'evaluation_report_date_wise', component: EvaluationReportDateWiseComponent },
    { path: 'dsr_attendance', component: DsrAttendanceComponent },
    { path: 'raw_data', component: RawDataComponent },
    { path: 'evaluation', loadChildren: '../evaluation/evaluation.module#EvaluationModule' },
    { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
    {path : 'de_wwwr_summary', component: DeWwWrSummaryComponent },
    { path: 'shop_detail/:id', component: ShopDetailComponent },
    {path : 'shop_detail_visit/:id' , component: ShopDetailVisitComponent },
    {path : 'shop_detail_town_storming/:id', component: ShopDetailTownStormingComponent },
    {path : 'dsr-sale', component: DsrSaleComponent },
    {path: 'tm_productivity_report' , component: TmProductivityComponent },
    {path: 'sale_achievement' , component: SaleAchievementComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {}
