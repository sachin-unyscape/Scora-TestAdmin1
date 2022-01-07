import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms/src/directives/ng_form';
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

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
// declare var Razorpay:any;
export class CheckoutComponent implements OnInit {

  constructor(private http:Http,private router: Router,private cookieService: CookieService,private authService :AuthServiceService,public GetItemService:GetItemService,) {

    this.paymentForm = new FormGroup({
      'username' : new FormControl('',Validators.required),
      'address' : new FormControl('',Validators.compose([
        Validators.required
      ])),
      'pincode' : new FormControl('',Validators.required),
      'city': new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9]*$")

      ])),
      'state': new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9]*$")

      ])),
      'country': new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9]*$")

      ]))
    })
    this.router.events
    .filter(e => e instanceof RoutesRecognized)
    .pairwise()
    .subscribe((event: any[]) => {

    });

  }




  paymentForm:FormGroup;
  public fullpageload;
  public universityall;
  public tenantLogo;
  public planDetails;

  ngOnInit() {
    this.UniversityItems();

    this.getIndividualPlanDetails();
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  omit_special_char(event)
  {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
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
          window.location.href=credentials.accountUrl;
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
          window.location.href=credentials.accountUrl;
          // window.location.href='http://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/serverError');
        }
      },

    );
    }
  }


  getIndividualPlanDetails(){
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +'/plan_details/'+this.cookieService.get('_PAOID')+'/'+localStorage.getItem('planId'),{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )
        .subscribe(
        data => {

          this.fullpageload = false;

         this.planDetails = data.plan_details;


        },
        error => {
          this.fullpageload = false;

          if(error.status == 404){
            this.router.navigateByUrl('pages/NotFound');
          }
          else if(error.status == 401){
            this.cookieService.deleteAll();
            window.location.href=credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else{
            this.router.navigateByUrl('pages/serverError');
          }
        },

      );
    }
  }


  rzp1:any;


  public initPay():void {
    var options = {
      "key": "rzp_test_0HHU8ZMVhTXuzK",
      "amount":1000, // 2000 paise = INR 20
      "name": " MARKET",
      "description": "Order #",

      "handler": function (response){

          alert(response.razorpay_payment_id);



         },

      "notes": {  },
      "theme": {
          "color": "blue"
      }
  };

//   var rzp1 = new Razorpay(options);

this.rzp1 = new this.GetItemService.nativeWindow.Razorpay(options);
this.rzp1.open();
  }

}
