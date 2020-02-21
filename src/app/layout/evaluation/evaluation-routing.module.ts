import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SectionHomeComponent } from './section/section-home/section-home.component';
import { SectionLandingPageComponent } from './section/section-landing-page/section-landing-page.component';
import { ShopListComponent } from './section/shop-list/shop-list.component';

const routes: Routes = [ { path: '', redirectTo : 'shop_list' , pathMatch : 'full' },
{ path: 'shop_list', component: SectionLandingPageComponent,
children: [
{ path: '', redirectTo : 'home', pathMatch : 'full' },
{ path: 'home', component : ShopListComponent },
{ path: 'details/:id/:visitType', component : SectionHomeComponent },

] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluationRoutingModule { }
