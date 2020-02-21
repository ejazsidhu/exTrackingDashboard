import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardService } from '../layout/dashboard/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { config } from 'src/assets/config';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any = {
    userName: '',
    password: ''
  };
  loading = false;
  constructor(private router: Router, private httpService: DashboardService, private toastr: ToastrService) { }

  ngOnInit() {
    localStorage.clear();
  }

  onLogin(loginForm: any) {
    this.loading = true;
    console.log(loginForm);

    this.httpService.login(loginForm).subscribe(
      (data: Response) => {
        // tslint:disable-next-line:no-debugger
        //  debugger;
        const res: any = data;
        localStorage.clear();
        // console.log('data', data.headers);
        // this.toastr.success(res, 'Login Status');
        localStorage.setItem('isLoggedin', 'true');
        localStorage.setItem('today', moment(new Date()).format('YYYY-MM-DD'));
        if (res.Authenticated === true) {
          localStorage.setItem('user_id', res.user.userId);
          localStorage.setItem('regionId', res.user.regionId);
          localStorage.setItem('username', res.user.userName);
          localStorage.setItem('user_type', res.user.typeId);
          localStorage.setItem('user_zone_id', res.user.zoneId);
          localStorage.setItem('menu', JSON.stringify(res.list));
          localStorage.setItem('towns', JSON.stringify(res.town));
          localStorage.setItem('regions', JSON.stringify(res.regions));
          localStorage.setItem('zones', JSON.stringify(res.zones));



          // tslint:disable-next-line:no-debugger
          // debugger;


          if (res.user.typeId === 4) {
            // tslint:disable-next-line:no-debugger
            //  debugger;
            this.router.navigate(['/dashboard/productivity_report']);
          } else {
            this.router.navigate(['/dashboard/productivity_report']);
          }
          // tslint:disable-next-line:no-debugger
          // debugger;
          /*          if (res.Authenticated) {
                    //  this.router.navigate(['/dashboard/merchandiser_List']);
                      this.router.navigate(['/dashboard/home']);
                    } else {
                      this.router.navigate(['/dashboard']);
                    }*/


          setTimeout(() => {
            this.loading = false;
          }, 30000);
        } else {
          this.toastr.warning(res.User);
          this.loading = false;

        }


      },
      (error: HttpErrorResponse) => {
        this.loading = false;

        if (error.status === 403) {
          this.toastr.error(error.error.description, 'Login Status');
        } else if (error.status === 400) {
          this.toastr.error(error.error.description, 'Login Status');
        } else if (error.status === 500) {
          this.toastr.error('Internal server error', 'Login Status');
        } else {
          this.toastr.error(error.message, 'Login Status');
          console.log('error', error);
        }
        this.loading = false;
      }
    );
  }
}
