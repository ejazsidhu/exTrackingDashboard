import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visit-productivity',
  templateUrl: './visit-productivity.component.html',
  styleUrls: ['./visit-productivity.component.scss']
})
export class VisitProductivityComponent implements OnInit {

  title="visit productivity"
  constructor(private router:Router) { }

  ngOnInit() {
  let userType=JSON.parse(localStorage.getItem("user_type"))

    if(userType==16){
      this.router.navigate(['/dashboard/merchandiser_List'])
    }

  }

}
