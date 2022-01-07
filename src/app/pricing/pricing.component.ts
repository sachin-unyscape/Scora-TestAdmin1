import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {FormBuilder,FormGroup,Validators ,FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Routes,Router,NavigationEnd,RoutesRecognized } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/pairwise';
import{credentials} from '../credentials';
//cookie
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../auth-service.service';
import { GetItemService } from '../get-item.service';
import { planChoose } from './planchoose';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  constructor(private http:Http,private router: Router,private cookieService: CookieService,private authService :AuthServiceService,public GetItemService:GetItemService,private _notifications: NotificationsService) {
    this.tenantPlanChoose = new planChoose();
  }


  public fullpageload;
  public universityall;
  public tenantLogo;
  public AllPlanLists;
  public FreeTrialPlan;
  public commonBenefits;
  public tenantPlanChoose:planChoose;


  public Notificationoptions = {
    position: ["center"],
    timeOut: 3000,
    lastOnBottom: true,
    showProgressBar:true,
    preventDuplicates : true,
    animate : "scale",
    pauseOnHover :false,
    clickToClose :false,
    clickIconToClose:false
  }

  ngOnInit() {
    this.UniversityItems();
    this.getPlanList();
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
          this.router.navigateByUrl('pages/404');
        }
        else if(error.status == 401){
          this.cookieService.deleteAll();
          window.location.href=credentials.accountUrl;
          // window.location.href='http://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/500');
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
          this.router.navigateByUrl('pages/404');
        }
        else if(error.status == 401){
          this.cookieService.deleteAll();
          window.location.href='http://scoraaccounts.brigita.co';
          // window.location.href='http://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/500');
        }
      },

    );
    }
  }

  getPlanList(){
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +'/current_active_plans/'+this.cookieService.get('_PAOID'),{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )
    .subscribe(
      data => {

        this.fullpageload = false;
        this.AllPlanLists = data.plans;
        this.commonBenefits = data.common_benifits;

        for(var i=0;i<this.AllPlanLists.length;i++){
          if(this.AllPlanLists[i].plan_price == 0){
            this.FreeTrialPlan = this.AllPlanLists.splice(i,1);

            break;
          }
        }


      },
      error => {
        this.fullpageload = false;

        if(error.status == 404){
          this.router.navigateByUrl('pages/404');
        }
        else if(error.status == 401){
          this.cookieService.deleteAll();
          window.location.href='http://scoraaccounts.brigita.co';
          // window.location.href='http://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/500');
        }
      },

    );
    }
  }

  getPlanId(id){
    localStorage.setItem('planId',id);
    this.router.navigateByUrl('/checkout');
  }


  choosePlan(planId){
    this.tenantPlanChoose.org_id = parseInt(this.cookieService.get('_PAOID'));
    this.tenantPlanChoose.plan_id = parseInt(planId);
    this.fullpageload = true;
    var body = this.tenantPlanChoose;
    var headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.post(credentials.host +"/plan_map", body,{headers: headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
          data => {
            this.fullpageload = false

            if(data.success == true){
              this._notifications.create('',data.message, 'info');
                setTimeout(()=>{
                this.router.navigateByUrl('/author/dashboard');
                },3000);

            }else{
              this._notifications.create('',data.message, 'error');
              setTimeout(()=>{
                this.router.navigateByUrl('/author/dashboard');
                },3000);
            }

          },
          error => {

            this.fullpageload = false;

            if(error.status == 404){
              this.router.navigateByUrl('pages/404');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href='http://scoraaccounts.brigita.co';
              // window.location.href='http://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/500');
            }
          }
    );
  }


}
