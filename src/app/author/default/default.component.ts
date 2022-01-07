import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import{credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { GetItemService } from '../../get-item.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { isEmpty } from 'rxjs/operator/isEmpty';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  APPNAME: string;

  constructor(private router: Router, private activeroute: ActivatedRoute ,private http:Http,private cookieService: CookieService,private authService :AuthServiceService,private GetItemService:GetItemService) {
     this.APPNAME = this.cookieService.get('_APPNAME');
     console.log("<<<<<<<<<<<??:" + this.APPNAME);
   }
  public Roles : any[] =[];

  ngOnInit() {
    this.Roles = this.GetItemService.sendOrganisationRoles();
    this.setRoles();
  }
  routerDirect(){

  }

  setRoles(){
    this.Roles = this.GetItemService.sendOrganisationRoles();
    if(this.Roles == undefined){
      setTimeout(() => {
       this.setRoles();
      },2000)
    }else{

    }
  }
  roleBaseNavigation(id){
    for(var i=0;i<this.Roles.length;i++){     
      if(id ==1 && (this.Roles[i]=="Author" || this.Roles[i] == "Super Admin")){
        this.router.navigate(['/Items/additem',0,0,0]);
       }
       else if(id == 2 && (this.Roles[i] == "Test Admin" || this.Roles[i] == "Super Admin")){
        this.router.navigate(['/Tests/createTest',0]);
       }
    }
  }


}
