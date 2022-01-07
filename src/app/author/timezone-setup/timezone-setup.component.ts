import { Component, OnInit } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { IMyDrpOptions } from "mydaterangepicker";
import { TagInputModule } from "ngx-chips";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { credentials } from "../../credentials";
import { CookieService } from "ngx-cookie-service";
import {
  FancyImageUploaderOptions,
  UploadedFile,
} from "ng2-fancy-image-uploader";
//authService
import { AuthServiceService } from "../../auth-service.service";
import { LoaderComponent } from "../../loader/loader.component";
import { NotificationsService } from "angular2-notifications";
import { GetItemService } from "../../get-item.service";
import { AlertComponent } from "ngx-bootstrap/alert/alert.component";

import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Country, State, City } from "country-state-city";
import { HttpParams, HttpRequest, HttpEvent } from "@angular/common/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpEventType } from "@angular/common/http";
import { RESTApiService } from "app/restapi-service.service";
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import {Location} from '@angular/common';



@Component({
  selector: 'app-timezone-setup',
  templateUrl: './timezone-setup.component.html',
  styleUrls: ['./timezone-setup.component.scss']
})
export class TimezoneSetupComponent implements OnInit {
  stateId: any;

  constructor( private restapiservice: RESTApiService,
    private httpClient: HttpClient,
    private http: Http,
    private router: Router,
    public sanitizer: DomSanitizer,
    public route: ActivatedRoute,
    private cookieService: CookieService,
    private authService: AuthServiceService,
    private _notifications: NotificationsService,
    public GetItemService: GetItemService,
    private _location: Location,
    private _formBuilder: FormBuilder,) { }
    
    public tenantDetails;
    public showload;
    public showMsg;
    public saveMsg;
    public edit = false;
    public nameErr = false;
    public timezoneerror = false;
    public timeZoneMetaData;
    public planExpires;
    public alerts: any[] = [];
    public reviewAlert = false;
    public selectedThemeId: number;
    public defautSelectedThemeId: any;
    public defaultThemeObj;
    public pattern1 = /^[^\s].*/;
    public emailErr = false;
    public cityErr = false;
    public countryErr = false;
    public mobErr = false;
    public codeErr = false;
    public Mobpattern = /^[0-9]*$/;
  
    public customFieldsMeta;
    public showCFMD;
    public editablePopup;
    public curId;
  
    public newFieldLabel;
    public newFieldType;
    public universityall: any;
    public fullpageload: boolean = false;
    public availableModulesList;
    public userOrgId;
    public tenantLogo;
    public currentOrgName;
    public adminimage: any;
    public assignThemeValue: boolean = false;
    public org_themes;
    public currentApplicationName;
    public currentActivatedRoute;
    public getAllCountries;
    public countryId;
    public statesList;
    public cityList;
    public password;
    myForm: FormGroup;
    submitted = false;
    new_country:any;
    new_state:any;

  ngOnInit() {
    this.getMetaData();
    this.UniversityItems();
    this.getTimeZone();
    this.getAllCountries = Country.getAllCountries();
    this.myForm = this._formBuilder.group({
      //from validation of contact details...
      timezone: new FormControl('', [ Validators.required]),
      country:new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required,]),
      city:new FormControl('', [Validators.required,]),
      org_name:new FormControl('', [Validators.required,]),
      address: new FormControl('', [Validators.required,]),
      postalcode: new FormControl('', [Validators.required,]),
    });
  }
  get f() {
    return this.myForm.controls;
  }
  
  populateState(CountryName) {
    let countryData = this.getAllCountries.filter(x => x.name == CountryName);
    this.countryId = countryData[0]["isoCode"];
    this.new_country = CountryName;
    this.statesList = State.getStatesOfCountry(this.countryId);
  }
  populateCity(StateName) {
    let stateData = this.statesList.filter(x => x.name == StateName);
    this.stateId = stateData[0]["isoCode"];
    this.new_state = StateName;
    this.cityList = City.getCitiesOfState(this.countryId, this.stateId);
  }
  
  UniversityItems() {
    if (this.authService.canActivate()) {
      this.cookieService.delete("_TEM");
      this.cookieService.delete("_TON");
      this.showload = true;
      var headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http
        .get(credentials.accountHost + "/user_details", { headers: headers })
        .map((res) => res.json())

        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          data => {
            this.availableModulesList = [];
            this.fullpageload = false;
            this.universityall = data.user_login_details;
            console.log(this.universityall)
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
    
            // security
            var tempProfilePic = this.sanitizer.bypassSecurityTrustUrl(this.universityall.profile_picture);
            this.universityall.profile_picture = tempProfilePic;
            // org logo
            for(var i=0;i<this.universityall.available_organization.length;i++){
              var tempOrgLogo  = this.universityall.available_organization[i].organization_img;
              this.universityall.available_organization[i].organization_img = tempOrgLogo;
            }
    
            //security ends
    
            if(!this.cookieService.check('_PAOID')){
              for(var o=0;o<this.universityall.available_organization.length;o++){
                if(this.universityall.available_organization[o].default == true){
                  this.cookieService.set( '_PAOID', this.universityall.available_organization[o].org_id);
                  this.cookieService.set('_userID',this.universityall.profile_id);
                  this.userOrgId = this.universityall.available_organization[o].org_id;
                  this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[o].review_work_flow);
                  this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[o].organization_img);
                  this.currentOrgName = this.universityall.available_organization[o].organization_name;
                  this.adminimage = this.universityall.available_organization[o];
                  if(this.assignThemeValue == false){
                    this.org_themes = this.universityall.available_organization[o].organization_theme;
                  }
                  this.GetItemService.getOrganisationRoles(this.universityall.available_organization[o].organization_roles);
                  for(var j=0;j<this.adminimage.applications.length;j++){
                    if(this.adminimage.applications[j].application_name == 'Admin/Author'){
                      this.currentApplicationName = this.adminimage.applications[j].application_name;
                      console.log("1-currentApplicationName",this.currentApplicationName)
                      this.availableModulesList = this.adminimage.applications[j].available_modules;
                      console.log("1-availableModulesList",this.availableModulesList)
                    
                      this.router.navigateByUrl(this.currentActivatedRoute);
                   
                    }else if(this.adminimage.applications[j].application_name == 'User Dashboard'){
                      // this.currentApplicationName = this.adminimage.applications[j].application_name;
                      // this.availableModulesList = [
                      //   {module_name:"Dashboard",module_id: 1,access: true},
                      //   {module_name: "Items", module_id: 2, access: true},
                      //   {module_name: "Itemsets", module_id: 3, access: true},
                      //   {module_name: "Test", module_id: 4, access: true},
                      //   {module_name: "Profile", module_id: 5, access: true},
                      //   {module_name: "Tenant Metadata", module_id: 6, access: true},
                      //   {module_name: "Manage Users", module_id: 7, access: true},
                      //   {module_name: "User Groups", module_id: 17, access: true}
    
                      // ]
                      // this.router.navigate(['author/Unauthorized']);
                      // break;
                      // window.location.href='http://192.168.1.13:9002';
                      window.location.href=credentials.userDashboardUrl;
                      // window.location.href='http://apps.scora.in';
                    }
                  }
                }
              }
              if(this.adminimage == undefined){
                this.cookieService.set( '_PAOID', this.universityall.available_organization[0].org_id);
                this.cookieService.set('_userID',this.universityall.profile_id);
                  this.userOrgId = this.universityall.available_organization[0].org_id;
                  this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[0].review_work_flow);
                  this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[0].organization_img);
                  this.currentOrgName = this.universityall.available_organization[0].organization_name;
                  this.adminimage = this.universityall.available_organization[0];
                  if(this.assignThemeValue == false){
                    this.org_themes = this.universityall.available_organization[0].organization_theme;
                  }
                  this.GetItemService.getOrganisationRoles(this.universityall.available_organization[0].organization_roles);
                  for(var j=0;j<this.adminimage.applications.length;j++){
                    if(this.adminimage.applications[j].application_name == 'Admin/Author'){
                      this.currentApplicationName = this.adminimage.applications[j].application_name;
                      console.log("2-currentApplicationName",this.currentApplicationName)
                      this.availableModulesList = this.adminimage.applications[j].available_modules;
                      console.log("2-availableModulesList",this.availableModulesList)
                      this.router.navigateByUrl(this.currentActivatedRoute);

                    }else if(this.adminimage.applications[j].application_name == 'User Dashboard'){
                      // this.currentApplicationName = this.adminimage.applications[j].application_name;
                      // this.availableModulesList = [
                      //   {module_name:"Dashboard",module_id: 1,access: true},
                      //   {module_name: "Items", module_id: 2, access: true},
                      //   {module_name: "Itemsets", module_id: 3, access: true},
                      //   {module_name: "Test", module_id: 4, access: true},
                      //   {module_name: "Profile", module_id: 5, access: true},
                      //   {module_name: "Tenant Metadata", module_id: 6, access: true},
                      //   {module_name: "Manage Users", module_id: 7, access: true},
                      //   {module_name: "User Groups", module_id: 17, access: true}
    
                      // ]
                      // this.router.navigate(['author/Unauthorized']);
                      // break;
                      // window.location.href='http://192.168.1.13:9002';
                      window.location.href=credentials.userDashboardUrl;
                      // window.location.href='http://apps.scora.in';
                    }
                  }
              }
    
            }else{
              for(var i=0;i<this.universityall.available_organization.length;i++){
                var cookieORgId = this.cookieService.get('_PAOID');
                var cookieUserId = this.cookieService.get('_userID');
                if(cookieORgId == this.universityall.available_organization[i].org_id){
                  this.cookieService.set( '_PAOID', this.universityall.available_organization[i].org_id);
                  this.cookieService.set('_userID',this.universityall.profile_id);
                  this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[i].review_work_flow);
                  this.userOrgId = this.universityall.available_organization[i].org_id;
                  this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[i].organization_img);
                  this.currentOrgName = this.universityall.available_organization[i].organization_name;
                  this.adminimage = this.universityall.available_organization[i];
                  if(this.assignThemeValue == false){
                    this.org_themes = this.universityall.available_organization[i].organization_theme;
                  }
    
                  this.GetItemService.getOrganisationRoles(this.universityall.available_organization[i].organization_roles);
                  for(var j=0;j<this.adminimage.applications.length;j++){
                    if(this.adminimage.applications[j].application_name == 'Admin/Author'){
                      this.currentApplicationName = this.adminimage.applications[j].application_name;
                      console.log("3-currentApplicationName",this.currentApplicationName)
                      this.availableModulesList =this.adminimage.applications[j].available_modules;
                      console.log("3-availableModulesList",this.availableModulesList);
                      this.router.navigateByUrl(this.currentActivatedRoute);

                    }else if(this.adminimage.applications[j].application_name == 'User Dashboard'){
                      // this.currentApplicationName = this.adminimage.applications[j].application_name;
                      // this.availableModulesList = [
                      //   {module_name:"Dashboard",module_id: 1,access: true},
                      //   {module_name: "Item", module_id: 2, access: true},
                      //   {module_name: "Itemset", module_id: 3, access: true},
                      //   {module_name: "Test", module_id: 4, access: true},
                      //   {module_name: "Profile", module_id: 5, access: true},
                      //   {module_name: "Tenant Metadata", module_id: 6, access: true},
                      //   {module_name: "Manage Users", module_id: 7, access: true},
                      //   {module_name: "User Groups", module_id: 17, access: true}
    
    
                      // ]
                      // this.router.navigate(['author/Unauthorized']);
                      // break;
                      // window.location.href='http://192.168.1.13:9002';
                      // window.location.href=credentials.userDashboardUrl;
                      // window.location.href='http://apps.scora.in';
                    }
                  }
    
    
                }
              }
              if(this.adminimage == undefined){
                for(var o=0;o<this.universityall.available_organization.length;o++){
                  if(this.universityall.available_organization[o].default == true){
                    this.cookieService.set( '_PAOID', this.universityall.available_organization[o].org_id);
                    this.cookieService.set('_userID',this.universityall.profile_id);
                    this.userOrgId = this.universityall.available_organization[o].org_id;
                    this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[o].review_work_flow);
                    this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[o].organization_img);
                    this.currentOrgName = this.universityall.available_organization[o].organization_name;
                    this.adminimage = this.universityall.available_organization[o];
                    if(this.assignThemeValue == false){
                      this.org_themes = this.universityall.available_organization[o].organization_theme;
                    }
                    this.GetItemService.getOrganisationRoles(this.universityall.available_organization[o].organization_roles);
                    for(var j=0;j<this.adminimage.applications.length;j++){
                      if(this.adminimage.applications[j].application_name == 'Admin/Author'){
                        this.currentApplicationName = this.adminimage.applications[j].application_name;
                        console.log("4-currentApplicationName",this.currentApplicationName)
                        this.availableModulesList = this.adminimage.applications[j].available_modules;
                        console.log("4-availableModulesList",this.availableModulesList)
                        this.router.navigateByUrl(this.currentActivatedRoute);

                      }else if(this.adminimage.applications[j].application_name == 'User Dashboard'){
                        // this.currentApplicationName = this.adminimage.applications[j].application_name;
                        // this.availableModulesList = [
                        //   {module_name:"Dashboard",module_id: 1,access: true},
                        //   {module_name: "Items", module_id: 2, access: true},
                        //   {module_name: "Itemsets", module_id: 3, access: true},
                        //   {module_name: "Test", module_id: 4, access: true},
                        //   {module_name: "Profile", module_id: 5, access: true},
                        //   {module_name: "Tenant Metadata", module_id: 6, access: true},
                        //   {module_name: "Manage Users", module_id: 7, access: true},
                        //   {module_name: "User Groups", module_id: 17, access: true}
    
                        // ]
                        // this.router.navigate(['author/Unauthorized']);
                        // break;
                        // window.location.href='http://192.168.1.13:9002';
                      window.location.href=credentials.userDashboardUrl;
                      // window.location.href='http://apps.scora.in';
                      }
                    }
                  }
                }
                if(this.adminimage == undefined){
                  this.cookieService.set( '_PAOID', this.universityall.available_organization[0].org_id);
                  this.cookieService.set('_userID',this.universityall.profile_id);
                    this.userOrgId = this.universityall.available_organization[0].org_id;
                    this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[0].review_work_flow);
                    this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[0].organization_img);
                    this.currentOrgName = this.universityall.available_organization[0].organization_name;
                    this.adminimage = this.universityall.available_organization[0];
                    if(this.assignThemeValue == false){
                      this.org_themes = this.universityall.available_organization[0].organization_theme;
                    }
                    this.GetItemService.getOrganisationRoles(this.universityall.available_organization[0].organization_roles);
                    for(var j=0;j<this.adminimage.applications.length;j++){
                      if(this.adminimage.applications[j].application_name == 'Admin/Author'){
                        this.currentApplicationName = this.adminimage.applications[j].application_name;
                        console.log("5-currentApplicationName",this.currentApplicationName)
                        this.availableModulesList = this.adminimage.applications[j].available_modules;
                        console.log("5-availableModulesList",this.availableModulesList)
                        this.router.navigateByUrl(this.currentActivatedRoute);

                      }else if(this.adminimage.applications[j].application_name == 'User Dashboard'){
                        // this.currentApplicationName = this.adminimage.applications[j].application_name;
                        // this.availableModulesList = [
                        //   {module_name:"Dashboard",module_id: 1,access: true},
                        //   {module_name: "Items", module_id: 2, access: true},
                        //   {module_name: "Itemsets", module_id: 3, access: true},
                        //   {module_name: "Test", module_id: 4, access: true},
                        //   {module_name: "Profile", module_id: 5, access: true},
                        //   {module_name: "Tenant Metadata", module_id: 6, access: true},
                        //   {module_name: "Manage Users", module_id: 7, access: true},
                        //   {module_name: "User Groups", module_id: 17, access: true}
    
                        // ]
                        // this.router.navigate(['author/Unauthorized']);
                        // break;
                        // window.location.href='http://192.168.1.13:9002';
                      window.location.href=credentials.userDashboardUrl;
                      // window.location.href='http://apps.scora.in';
                      }
                    }
                }
              }
            }
          },
          error => {
            this.fullpageload = false;
    
            if(error.status == 404){
              this.router.navigateByUrl('/pages/NotFound');
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
    console.log(this.universityall)
  }
    
  logout(){
    this.fullpageload = true;
    var headers = new Headers();
  
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +'/logout',{headers:headers}).map(res => res.json()).catch((error: any) =>{return Observable.throw(error)} ).subscribe(
      data => {
          
        this.fullpageload = false;
  
       if(data.success == true){
        localStorage.removeItem('dataSource');
         this.cookieService.deleteAll('/', '.scora.io'); 
      this.cookieService.deleteAll('/', 'scora.io'); 
  
        window.location.href=credentials.accountUrl;
         // window.location.href='http://accounts.scora.in';
       }
     this.cookieService.deleteAll('/', '.scora.io'); 
    this.cookieService.deleteAll('/', 'scora.io'); 
       window.location.href=credentials.accountUrl;
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
          //this.router.navigateByUrl('pages/serverError');
      this.cookieService.deleteAll('/', '.scora.io'); 
      this.cookieService.deleteAll('/', 'scora.io'); 
          window.location.href=credentials.accountUrl;
        }
      },
  
    );
  }
  getTimeZone() {
    this.showload = true;
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    this.http
      .get(credentials.host + "/time_zones", { headers: headers })
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })

      .subscribe(
        (data) => {
          this.showload = false;
          this.timeZoneMetaData = data;
        },

        (error) => {
          this.showload = false;
          if (error.status == 404) {
            this.router.navigateByUrl("pages/NotFound");
          } else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          } else {
            this.router.navigateByUrl("pages/serverError");
          }
        }
      );
  }

  getMetaData() {
    if (this.authService.canActivate()) {
      this.showload = true;
      var headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http
        .get(
          credentials.host +
            "/tenant_details/" +
            this.cookieService.get("_PAOID"),
          { headers: headers }
        )
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          (data) => {
            this.showload = false;
            this.tenantDetails = data;
            this.tenantDetails.tenant_logo = data.tenant_logo;
          //  this.populateState(this.tenantDetails.tenant_country);
          //  this.populateCity(this.tenantDetails.tenant_state);
          //   this.getBaseMetadata();
            for (var i = 0; i < this.tenantDetails.tenant_themes.length; i++) {
              if (this.tenantDetails.tenant_themes[i].current_active == true) {
                this.defautSelectedThemeId =
                  this.tenantDetails.tenant_themes[i].theme_id;
              }
            }
          },
          (error) => {
            this.showload = false;
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    }
  }

  
  saveProfile() {
    this.submitted = true;
    // stop here if form is invalid
     if (this.myForm.invalid) {
      return;
     }else{
      this.showload = true;
      this.tenantDetails.org_id = this.cookieService.get("_PAOID");
      let body= {} ;
      body = this.tenantDetails;
      body["org_id"] = this.cookieService.get("_PAOID");
      body["tenant_logo"] = this.tenantDetails.tenant_logo;
      body["Tenant_user_nm"] = this.universityall.profile_name;
      body["tenant_country"] = this.myForm.get('country').value;
      body['tenant_name'] = this.myForm.get('org_name').value;
      body["State"] = this.myForm.get('state').value;
      // body["tenant_state"] = this.myForm.get('state').value;
      body["tenant_designation"] = this.tenantDetails.tenant_designation;
      body["tenant_city"] = this.myForm.get('city').value;
      body["tenant_email"] = this.tenantDetails.tenant_email;
      body["tenant_phone"] = this.tenantDetails.tenant_phone;
      body["Addr_Ln1"] = this.myForm.get('address').value;
      // body["tenant_address"] = this.myForm.get('address').value;
      // body["password"] = this.myForm.get('password').value;
      body["tenant_timezone"] = this.myForm.get('timezone').value;
      body["Zip_Code"] = this.myForm.get('postalcode').value;
      // body["tenant_themes"] = this.tenantDetails.tenant_themes;
      // body["tenant_zip_code"] = this.myForm.get('postalcode').value;
      if(this.new_country){
        console.log("NEW COUNTRY");
        body["tenant_country"] = this.new_country;
      }
      if(this.new_state){
        console.log("NEW STATE");
        body["tenant_state"] = this.new_state;
        body["State"] = this.new_state;
      }
      console.log("body>>>>>>>>>>>>>>>>>>>>>.", body);
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      return this.http
        .put(credentials.host + "/update_tenant_details", body, {
          headers: headers,
        })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          (data) => {
            if (data.success == true) {
              this.showload = false;
              this._notifications.create("", data.message, "info");
              setTimeout(() => {
                localStorage.setItem('dataSource', "welcome");
                this.router.navigate(['/author/home'])
              }, 2000);
              this.edit = false;
            } else if (data.success == false) {
              this.showload = false;
              this._notifications.create("", data.message, "error");
              setTimeout(() => {
                this.saveMsg = false;
              }, 2000);
            }
          },
          (error) => {
            this.showload = false;
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
     }
  }

  backClicked() {
    this._location.back();
  }
 
}
