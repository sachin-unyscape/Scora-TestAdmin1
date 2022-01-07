import { Component, OnInit } from '@angular/core';
import{credentials} from '../credentials';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {FormBuilder,FormGroup,Validators ,FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Routes,Router,NavigationEnd,RoutesRecognized } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
//cookie
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../auth-service.service';
import { GetItemService } from '../get-item.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(private http:Http,private router: Router,private cookieService: CookieService,private authService :AuthServiceService,public GetItemService:GetItemService) { }

  public fullpageload;
  public universityall;
  public tenantLogo;


  ngOnInit() {
    this.UniversityItems();
  }


  logout(){
    this.fullpageload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +'/logout',{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )
    .subscribe(
      data => {
        this.fullpageload = false;

       if(data.success == true){
        localStorage.removeItem('dataSource');
         this.cookieService.deleteAll();
        window.location.href=credentials.accountUrl;
        localStorage.setItem('showAlert', null);
        // window.location.href='http://accounts.scora.in';
       }
      },
      error => {
        this.fullpageload = false;

        if(error.status == 404){
          this.router.navigateByUrl('pages/NotFound');
        }
        else if(error.status == 401){
          this.cookieService.deleteAll();
          window.location.href='http://scoraaccounts.brigita.co';
          // window.location.href='http://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/serverError');
        }
      },

    );
  }




  UniversityItems() {


    if(this.authService.canActivate()){
      this.cookieService.delete('_TEM');
      this.cookieService.delete('_TON');
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.accountHost +'/user_details',{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )
    .subscribe(
      data => {

        this.fullpageload = false;
        this.universityall = data.user_login_details;

        var tempOrgMail;
        tempOrgMail = data.user_login_details.profile_email;
        if(tempOrgMail != '' && tempOrgMail != null) {
          this.cookieService.set( '_TEM', tempOrgMail );
        }

        var tempOrgName;
        tempOrgName = data.user_login_details.profile_organization_text;
        if(tempOrgName != '' && tempOrgName != null) {
          this.cookieService.set( '_TON', tempOrgName );
        }

        if(!this.cookieService.check('_PAOID')){
        this.tenantLogo = this.universityall.available_organization[0].organization_img;
        }else{
          for(var i=0;i<this.universityall.available_organization.length;i++){
            var cookieORgId = this.cookieService.get('_PAOID');
            if(cookieORgId == this.universityall.available_organization[i].org_id){
              this.tenantLogo = this.universityall.available_organization[i].organization_img;
            }
          }

        }
      },
      error => {
        this.fullpageload = false;

        if(error.status == 404){
          this.router.navigateByUrl('pages/NotFound');
        }
        else if(error.status == 401){
          this.cookieService.deleteAll();
          window.location.href='http://scoraaccounts.brigita.co';
          // window.location.href='http://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/serverError');
        }
      },

    );
    }
  }

}
