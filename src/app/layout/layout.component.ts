import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    hideSideBar: boolean = false; //make default value to false after completing SMS manager;
    constructor(public router: Router) { }

    ngOnInit() {
        let url: any = new Array();
        url = this.router.url.split('/');
        let t: any = url.find(d => d === 'shop_detail');
        let r:any=url.find(d => d === 'details');
        if (t || r) {
            this.hideSideBar = true
        }

    }
}
