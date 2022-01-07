import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {FormBuilder,FormGroup,Validators ,FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Routes,Router,NavigationEnd,RoutesRecognized } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
// import{credentials} from '../credentials';
// //cookie
// import { CookieService } from 'ngx-cookie-service';
// //authService
// import { AuthServiceService } from '../../auth-service.service';
// import { GetItemService } from '../../get-item.service';

@Component({
  selector: 'app-plan-expires',
  templateUrl: './plan-expires.component.html',
  styleUrls: ['./plan-expires.component.scss']
})
export class PlanExpiresComponent implements OnInit {

  constructor(private http:Http,private router: Router) { }

  public fullpageload;
  public universityall;
  public tenantLogo;

  ngOnInit() {
    
  }


  




 

}
