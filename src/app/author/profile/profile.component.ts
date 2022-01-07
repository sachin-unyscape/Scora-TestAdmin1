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

import { AddNewField } from "./add-new-field";
import { NewFieldKeys } from "./new-field-keys";
import { EditLabelNames } from "./edit-label";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Country, State, City } from "country-state-city";
import { HttpParams, HttpRequest, HttpEvent } from "@angular/common/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HttpEventType } from "@angular/common/http";
import { RESTApiService } from "app/restapi-service.service";
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';


@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  animations: [
    trigger("dialog1", [
      transition("void => *", [
        style({ transform: "scale3d(.3, .3, .3)" }),
        animate(100),
      ]),
      transition("* => void", [
        animate(100, style({ transform: "scale3d(.0, .0, .0)" })),
      ]),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  filename: any;
  tenant_logo: any;
  stateId: any;

  constructor(
    private restapiservice: RESTApiService,
    private httpClient: HttpClient,
    private http: Http,
    private router: Router,
    public sanitizer: DomSanitizer,
    public route: ActivatedRoute,
    private cookieService: CookieService,
    private authService: AuthServiceService,
    private _notifications: NotificationsService,
    public GetItemService: GetItemService,
    private _formBuilder: FormBuilder,
  ) {
    
  }

  public addNewFieldClass: AddNewField;
  public newFieldKeysClass: NewFieldKeys;
  public editLabelNameClass: EditLabelNames;
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
 

  public Notificationoptions = {
    position: ["center"],
    timeOut: 4000,
    lastOnBottom: true,
    showProgressBar: true,
    preventDuplicates: true,
    animate: "scale",
    pauseOnHover: false,
    clickToClose: false,
    clickIconToClose: false,
  };

  options: FancyImageUploaderOptions = {
    thumbnailHeight: 150,
    thumbnailWidth: 150,
    authTokenPrefix: "Bearer ",
    authToken: this.cookieService.get("_PTBA"),
    uploadUrl:
      credentials.host +
      "/tenant_picture_update/" +
      this.cookieService.get("_PAOID"),
    allowedImageTypes: ["image/png", "image/jpeg"],
    maxImageSize: 5,
  };

  ngOnInit() {
    
    this.editablePopup = false;
    this.showCFMD = false;
    this.newFieldLabel = "";
    this.newFieldType = "";
    // this.planExpires = this.GetItemService.sendPlanExpireKEy();
    // if(this.planExpires == undefined){
    //   this.planExpires = localStorage.getItem('hideButton');
    //   if(this.planExpires == 'false'){
    //     this.planExpires = false;
    //   }else if(this.planExpires == 'true'){
    //     this.planExpires = true;
    //   }

    // }
    //
    this.getMetaData();
    this.UniversityItems();
    this.getTimeZone();
    this.getAllCountries = Country.getAllCountries();
    console.log('countrie',this.getAllCountries)
    this.myForm = this._formBuilder.group({
      //from validation of contact details...
      name: new FormControl('', [ Validators.required]),
      timezone: new FormControl('', [ Validators.required]),
      emailId:new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
      ]),
      country:new FormControl('', [Validators.required]),
      mobNo: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(12),
        Validators.pattern('^[0-9]*$')]),
      state: new FormControl('', [Validators.required,]),
      city:new FormControl('', [Validators.required,]),
      org_name:new FormControl('', [Validators.required,]),
      designation: new FormControl('', [Validators.required,]),
      address: new FormControl('', [Validators.required,]),
      password: new FormControl('', []),
      postalcode: new FormControl('', [Validators.required,]),
    });
  }
  get f() {
    return this.myForm.controls;
  }

  populateState(CountryName) {
    this.statesList = [];
    this.cityList = [];
    let countryData = this.getAllCountries.filter(x => x.name == CountryName);
    console.log('21345',countryData)
    this.countryId = countryData[0]["isoCode"];
    this.new_country = CountryName;
    this.statesList = State.getStatesOfCountry(this.countryId);
    console.log('state list populated',this.statesList);
    let stateName=this.statesList.find(x=>x.isoCode==this.tenantDetails.tenant_state);
    console.log(stateName);
    if(stateName){
      this.tenantDetails.tenant_state=stateName.name;
    }
  }

  populateCity(StateName) {
    let stateData = this.statesList.filter(x => x.name == StateName);
    console.log(stateData )
    if(stateData && stateData.length > 0){
      this.stateId = stateData[0]["isoCode"];
    }
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
          (data) => {
            this.availableModulesList = [];
            this.showload = false;
            this.universityall = data.user_login_details;
            // this.myForm.patchValue({
            //   name:this.universityall.profile_name,
            //  })
            var tempOrgMail;
            tempOrgMail = data.user_login_details.profile_email;
            if (tempOrgMail != "" && tempOrgMail != null) {
              this.cookieService.set("_TEM", tempOrgMail);
            }

            var tempOrgName;
            tempOrgName = data.user_login_details.profile_organization_text;
            if (tempOrgName != "" && tempOrgName != null) {
              this.cookieService.set("_TON", tempOrgName);
            }

            // security
            var tempProfilePic = this.sanitizer.bypassSecurityTrustUrl(
              this.universityall.profile_picture
            );
            this.universityall.profile_picture = tempProfilePic;
            // org logo
            for (
              var i = 0;
              i < this.universityall.available_organization.length;
              i++
            ) {
              var tempOrgLogo =
                this.universityall.available_organization[i].organization_img;
              this.universityall.available_organization[i].organization_img =
                tempOrgLogo;
            }

            //security ends

            if (!this.cookieService.check("_PAOID")) {
              for (
                var o = 0;
                o < this.universityall.available_organization.length;
                o++
              ) {
                if (
                  this.universityall.available_organization[o].default == true
                ) {
                  this.cookieService.set(
                    "_PAOID",
                    this.universityall.available_organization[o].org_id
                  );
                  this.cookieService.set(
                    "_userID",
                    this.universityall.profile_id
                  );
                  this.userOrgId =
                    this.universityall.available_organization[o].org_id;
                  this.GetItemService.getReviewWrkFlwFlag(
                    this.universityall.available_organization[o]
                      .review_work_flow
                  );
                  this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(
                    this.universityall.available_organization[o]
                      .organization_img
                  );
                  this.currentOrgName =
                    this.universityall.available_organization[
                      o
                    ].organization_name;
                  this.adminimage =
                    this.universityall.available_organization[o];
                  if (this.assignThemeValue == false) {
                    this.org_themes =
                      this.universityall.available_organization[
                        o
                      ].organization_theme;
                  }
                  this.GetItemService.getOrganisationRoles(
                    this.universityall.available_organization[o]
                      .organization_roles
                  );
                  for (
                    var j = 0;
                    j < this.adminimage.applications.length;
                    j++
                  ) {
                    if (
                      this.adminimage.applications[j].application_name ==
                      "Admin/Author"
                    ) {
                      this.currentApplicationName =
                        this.adminimage.applications[j].application_name;
                      console.log(
                        "1-currentApplicationName",
                        this.currentApplicationName
                      );
                      this.availableModulesList =
                        this.adminimage.applications[j].available_modules;
                      console.log(
                        "1-availableModulesList",
                        this.availableModulesList
                      );
                      // if(this.currentActivatedRoute == '/'){
                      //   this.router.navigate(['/author']);
                      // }else{
                      //   this.router.navigateByUrl(this.currentActivatedRoute);
                      // }
                      // if(this.currentActivatedRoute == '/author'){
                      // this.router.navigate(['/author/dashboard']);
                      // }else{
                      //   this.router.navigateByUrl(this.currentActivatedRoute);
                      // }
                      break;
                    } else if (
                      this.adminimage.applications[j].application_name ==
                      "User Dashboard"
                    ) {
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
                      window.location.href = credentials.userDashboardUrl;
                      // window.location.href='http://apps.scora.in';
                    }
                  }
                }
              }
              if (this.adminimage == undefined) {
                this.cookieService.set(
                  "_PAOID",
                  this.universityall.available_organization[0].org_id
                );
                this.cookieService.set(
                  "_userID",
                  this.universityall.profile_id
                );
                this.userOrgId =
                  this.universityall.available_organization[0].org_id;
                this.GetItemService.getReviewWrkFlwFlag(
                  this.universityall.available_organization[0].review_work_flow
                );
                this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(
                  this.universityall.available_organization[0].organization_img
                );
                this.currentOrgName =
                  this.universityall.available_organization[0].organization_name;
                this.adminimage = this.universityall.available_organization[0];
                if (this.assignThemeValue == false) {
                  this.org_themes =
                    this.universityall.available_organization[0].organization_theme;
                }
                this.GetItemService.getOrganisationRoles(
                  this.universityall.available_organization[0]
                    .organization_roles
                );
                for (var j = 0; j < this.adminimage.applications.length; j++) {
                  if (
                    this.adminimage.applications[j].application_name ==
                    "Admin/Author"
                  ) {
                    this.currentApplicationName =
                      this.adminimage.applications[j].application_name;
                    console.log(
                      "2-currentApplicationName",
                      this.currentApplicationName
                    );
                    this.availableModulesList =
                      this.adminimage.applications[j].available_modules;
                    console.log(
                      "2-availableModulesList",
                      this.availableModulesList
                    );
                    // this.router.navigate(['/author']);
                    // if(this.currentActivatedRoute == '/'){
                    //   this.router.navigate(['/author']);
                    // }else{
                    //   this.router.navigateByUrl(this.currentActivatedRoute);
                    // }
                    break;
                  } else if (
                    this.adminimage.applications[j].application_name ==
                    "User Dashboard"
                  ) {
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
                    window.location.href = credentials.userDashboardUrl;
                    // window.location.href='http://apps.scora.in';
                  }
                }
              }
            } else {
              for (
                var i = 0;
                i < this.universityall.available_organization.length;
                i++
              ) {
                var cookieORgId = this.cookieService.get("_PAOID");
                var cookieUserId = this.cookieService.get("_userID");
                if (
                  cookieORgId ==
                  this.universityall.available_organization[i].org_id
                ) {
                  this.cookieService.set(
                    "_PAOID",
                    this.universityall.available_organization[i].org_id
                  );
                  this.cookieService.set(
                    "_userID",
                    this.universityall.profile_id
                  );
                  this.GetItemService.getReviewWrkFlwFlag(
                    this.universityall.available_organization[i]
                      .review_work_flow
                  );
                  this.userOrgId =
                    this.universityall.available_organization[i].org_id;
                  this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(
                    this.universityall.available_organization[i]
                      .organization_img
                  );
                  this.currentOrgName =
                    this.universityall.available_organization[
                      i
                    ].organization_name;
                  this.adminimage =
                    this.universityall.available_organization[i];
                  if (this.assignThemeValue == false) {
                    this.org_themes =
                      this.universityall.available_organization[
                        i
                      ].organization_theme;
                  }

                  this.GetItemService.getOrganisationRoles(
                    this.universityall.available_organization[i]
                      .organization_roles
                  );
                  for (
                    var j = 0;
                    j < this.adminimage.applications.length;
                    j++
                  ) {
                    if (
                      this.adminimage.applications[j].application_name ==
                      "Admin/Author"
                    ) {
                      this.currentApplicationName =
                        this.adminimage.applications[j].application_name;
                      console.log(
                        "3-currentApplicationName",
                        this.currentApplicationName
                      );
                      this.availableModulesList =
                        this.adminimage.applications[j].available_modules;
                      console.log(
                        "3-availableModulesList",
                        this.availableModulesList
                      );
                      // this.router.navigate(['/author']);
                      // if(this.currentActivatedRoute == '/'){
                      //   this.router.navigate(['/author']);
                      // }else{
                      //   this.router.navigateByUrl(this.currentActivatedRoute);
                      // }
                      break;
                    } else if (
                      this.adminimage.applications[j].application_name ==
                      "User Dashboard"
                    ) {
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
                      window.location.href = credentials.userDashboardUrl;
                      // window.location.href='http://apps.scora.in';
                    }
                  }
                }
              }
              if (this.adminimage == undefined) {
                for (
                  var o = 0;
                  o < this.universityall.available_organization.length;
                  o++
                ) {
                  if (
                    this.universityall.available_organization[o].default == true
                  ) {
                    this.cookieService.set(
                      "_PAOID",
                      this.universityall.available_organization[o].org_id
                    );
                    this.cookieService.set(
                      "_userID",
                      this.universityall.profile_id
                    );
                    this.userOrgId =
                      this.universityall.available_organization[o].org_id;
                    this.GetItemService.getReviewWrkFlwFlag(
                      this.universityall.available_organization[o]
                        .review_work_flow
                    );
                    this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(
                      this.universityall.available_organization[o]
                        .organization_img
                    );
                    this.currentOrgName =
                      this.universityall.available_organization[
                        o
                      ].organization_name;
                    this.adminimage =
                      this.universityall.available_organization[o];
                    if (this.assignThemeValue == false) {
                      this.org_themes =
                        this.universityall.available_organization[
                          o
                        ].organization_theme;
                    }
                    this.GetItemService.getOrganisationRoles(
                      this.universityall.available_organization[o]
                        .organization_roles
                    );
                    for (
                      var j = 0;
                      j < this.adminimage.applications.length;
                      j++
                    ) {
                      if (
                        this.adminimage.applications[j].application_name ==
                        "Admin/Author"
                      ) {
                        this.currentApplicationName =
                          this.adminimage.applications[j].application_name;
                        console.log(
                          "4-currentApplicationName",
                          this.currentApplicationName
                        );
                        this.availableModulesList =
                          this.adminimage.applications[j].available_modules;
                        console.log(
                          "4-availableModulesList",
                          this.availableModulesList
                        );
                        // this.router.navigate(['/author']);
                        // if(this.currentActivatedRoute == '/'){
                        //   this.router.navigate(['/author']);
                        // }else{
                        //   this.router.navigateByUrl(this.currentActivatedRoute);
                        // }
                        break;
                      } else if (
                        this.adminimage.applications[j].application_name ==
                        "User Dashboard"
                      ) {
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
                        window.location.href = credentials.userDashboardUrl;
                        // window.location.href='http://apps.scora.in';
                      }
                    }
                  }
                }
                if (this.adminimage == undefined) {
                  this.cookieService.set(
                    "_PAOID",
                    this.universityall.available_organization[0].org_id
                  );
                  this.cookieService.set(
                    "_userID",
                    this.universityall.profile_id
                  );
                  this.userOrgId =
                    this.universityall.available_organization[0].org_id;
                  this.GetItemService.getReviewWrkFlwFlag(
                    this.universityall.available_organization[0]
                      .review_work_flow
                  );
                  this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(
                    this.universityall.available_organization[0]
                      .organization_img
                  );
                  this.currentOrgName =
                    this.universityall.available_organization[0].organization_name;
                  this.adminimage =
                    this.universityall.available_organization[0];
                  if (this.assignThemeValue == false) {
                    this.org_themes =
                      this.universityall.available_organization[0].organization_theme;
                  }
                  this.GetItemService.getOrganisationRoles(
                    this.universityall.available_organization[0]
                      .organization_roles
                  );
                  for (
                    var j = 0;
                    j < this.adminimage.applications.length;
                    j++
                  ) {
                    if (
                      this.adminimage.applications[j].application_name ==
                      "Admin/Author"
                    ) {
                      this.currentApplicationName =
                        this.adminimage.applications[j].application_name;
                      console.log(
                        "5-currentApplicationName",
                        this.currentApplicationName
                      );
                      this.availableModulesList =
                        this.adminimage.applications[j].available_modules;
                      console.log(
                        "5-availableModulesList",
                        this.availableModulesList
                      );
                      // this.router.navigate(['/author']);
                      //  if(this.currentActivatedRoute == '/'){
                      //     this.router.navigate(['/author']);
                      //   }else{
                      //     this.router.navigateByUrl(this.currentActivatedRoute);
                      //   }
                      break;
                    } else if (
                      this.adminimage.applications[j].application_name ==
                      "User Dashboard"
                    ) {
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
                      window.location.href = credentials.userDashboardUrl;
                      // window.location.href='http://apps.scora.in';
                    }
                  }
                }
              }
            }
          },
          (error) => {
            this.fullpageload = false;

            if (error.status == 404) {
              this.router.navigateByUrl("/pages/NotFound");
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
            console.log('tenant details',this.tenantDetails);
            this.populateState(this.tenantDetails.tenant_country);
            // this.populateCity(this.tenantDetails.tenant_state);
            // let countryName=this.getAllCountries.find(x=>x.isoCode==this.tenantDetails.tenant_country);
            // this.tenantDetails.tenant_country=countryName.name;
            // this.tenantDetails.tenant_logo = data.tenant_logo;
          //  this.myForm.patchValue({
          //   country:this.tenantDetails.tenant_country,
          //   state:this.tenantDetails.tenant_state,
          //   org_name:this.tenantDetails.tenant_name,
          //   designation:this.tenantDetails.tenant_designation,
          //   city:this.tenantDetails.tenant_city,
          //   emailId:this.tenantDetails.tenant_email,
          //   mobNo:this.tenantDetails.tenant_phone,
          //   address:this.tenantDetails.tenant_address,
          //   password:'',
          //   timezone:this.tenantDetails.tenant_timezone,
          //   postalcode:this.tenantDetails.tenant_zip_code,

          //  })
            this.getBaseMetadata();
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

  onlyNumberKey(event) {
    return event.charCode == 8 || event.charCode == 0
      ? null
      : event.charCode >= 48 && event.charCode <= 57;
  }

  //image upload
  onImageUpload(event) {
    let files = event.target.files;
    if (files.length == 0) {
      console.log("No file selected!");
      return;
    }
    let file: File = files[0];
    this.restapiservice
      .uploadFile(
        credentials.host +
          "/tenant_picture_update/" +
          this.cookieService.get("_PAOID"),
        file
      )
      .subscribe(
        (event) => {
          if (event.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * event.loaded) / event.total);
            console.log(`File is ${percentDone}% loaded.`);
          } else {
            this.filename = event["body"];
            if(this.filename){
              this.tenantDetails.tenant_logo = this.filename["path"];
            }
          
          }
        },
        (err) => {
          // console.log("Upload Error:", err);
        },
        () => {
          console.log("Upload done");
        }
      );
  }
  onImageUpload1(event) {
    let files = event.target.files;
    if (files.length == 0) {
      console.log("No file selected!");
      return;
    }
    let file: File = files[0];
    let org_id = this.cookieService.get('_PAOID');
    this.restapiservice
      .uploadFile1(
        credentials.host + "/update_profile",
          file,
          org_id
      )
      .subscribe(
        (event) => {
          if (event.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round((100 * event.loaded) / event.total);
            console.log(`File is ${percentDone}% loaded.`);
          } else {
            this.filename = event["body"];
            if(this.filename){
              this.universityall.profile_picture = this.filename["path"];
              console.log(this.universityall.profile_picture);
            }
          }
        },
        (err) => {
          // console.log("Upload Error:", err);
        },
        () => {
          console.log("Upload done");
        }
      );
  }

  cancelProfile() {
    if (this.selectedThemeId != undefined) {
      for (var i = 0; i < this.tenantDetails.tenant_themes.length; i++) {
        if (
          this.defautSelectedThemeId ==
          this.tenantDetails.tenant_themes[i].theme_id
        ) {
          this.tenantDetails.tenant_themes[i].current_active = true;
          this.defaultThemeObj = this.tenantDetails.tenant_themes[i];
          this.GetItemService.UpdateUserDetails(false, this.defaultThemeObj);
        } else {
          this.tenantDetails.tenant_themes[i].current_active = false;
        }
      }
    }

    this.edit = false;
    this.nameErr = false;
    this.timezoneerror = false;
    this.emailErr = false;
    this.cityErr = false;
    this.countryErr = false;
    this.reviewAlert = false;
    this.mobErr = false;
    this.codeErr = false;
    this.getMetaData();
  }

  // editTenantProfile(){
  //   if(this.planExpires ==false){
  //     this.edit = true;
  //   }
  //   else  if(this.planExpires ==true){
  //     this.alerts.push({
  //       type: 'danger',
  //       msg:"Looks like your plan is expired.. Please contact your Super Admin",
  //       timeout:4000
  //     });
  //   }
  // }

  changedTimeZone(data) {
    this.tenantDetails.tenant_timezone = data;
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
      body["Tenant_user_nm"] = this.myForm.get('name').value;
      body["tenant_country"] = this.myForm.get('country').value;
      body['tenant_name'] = this.myForm.get('org_name').value;
      body["State"] = this.myForm.get('state').value;
      // body["tenant_state"] = this.myForm.get('state').value;
      body["tenant_designation"] = this.myForm.get('designation').value;
      body["tenant_city"] = this.myForm.get('city').value;
      body["tenant_email"] = this.myForm.get('emailId').value;
      body["tenant_phone"] = this.myForm.get('mobNo').value;
      body["Addr_Ln1"] = this.myForm.get('address').value;
      // body["tenant_address"] = this.myForm.get('address').value;
      body["password"] = this.myForm.get('password').value;
      body["tenant_timezone"] = this.myForm.get('timezone').value;
      body["Zip_Code"] = this.myForm.get('postalcode').value;
      body["tenant_themes"] = this.tenantDetails.tenant_themes;
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
              //  this.showMsg = data.message;
              // this.saveMsg = true;
              this.getMetaData();
              this.UniversityItems();
              this.getTimeZone();
              this._notifications.create("", data.message, "info");
              setTimeout(() => {
                this.saveMsg = false;
                this.GetItemService.UpdateUserDetails(true, null);
                // window.location.reload();
              }, 2000);
              this.edit = false;
            } else if (data.success == false) {
              this.showload = false;

              //   this.showMsg = data.message;
              //  this.saveMsg = true;
              this._notifications.create("", data.message, "error");
              setTimeout(() => {
                this.saveMsg = false;
              }, 2000);
              this.getMetaData();
              this.UniversityItems();
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

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter((alert) => alert !== dismissedAlert);
  }

  ReviewWorkflowToggle(flag) {
    if (
      this.tenantDetails.tenant_review_workflow_is == false &&
      this.tenantDetails.tenant_review_workflow == "y"
    ) {
      if (flag == "n") {
        this.tenantDetails.tenant_review_workflow = "n";
      } else if (flag == "y") {
        this.tenantDetails.tenant_review_workflow = "n";
      }
    } else {
      if (flag == "n") {
        this.tenantDetails.tenant_review_workflow = "n";
      } else if (flag == "y") {
        this.tenantDetails.tenant_review_workflow = "n";
      }
    }
  }

  // theme change
  changeTheme(selectedTheme) {
    this.selectedThemeId = selectedTheme.theme_id;
    if (this.selectedThemeId != undefined) {
      for (var i = 0; i < this.tenantDetails.tenant_themes.length; i++) {
        if (
          this.selectedThemeId == this.tenantDetails.tenant_themes[i].theme_id
        ) {
          this.tenantDetails.tenant_themes[i].current_active = true;
        } else {
          this.tenantDetails.tenant_themes[i].current_active = false;
        }
      }
    }
    this.GetItemService.UpdateUserDetails(false, selectedTheme);
  }

  public countryCodes = [
    {
      name: "Afghanistan",
      dial_code: "+93",
      code: "AF",
    },
    {
      name: "Aland Islands",
      dial_code: "+358",
      code: "AX",
    },
    {
      name: "Albania",
      dial_code: "+355",
      code: "AL",
    },
    {
      name: "Algeria",
      dial_code: "+213",
      code: "DZ",
    },
    {
      name: "AmericanSamoa",
      dial_code: "+1684",
      code: "AS",
    },
    {
      name: "Andorra",
      dial_code: "+376",
      code: "AD",
    },
    {
      name: "Angola",
      dial_code: "+244",
      code: "AO",
    },
    {
      name: "Anguilla",
      dial_code: "+1264",
      code: "AI",
    },
    {
      name: "Antarctica",
      dial_code: "+672",
      code: "AQ",
    },
    {
      name: "Antigua and Barbuda",
      dial_code: "+1268",
      code: "AG",
    },
    {
      name: "Argentina",
      dial_code: "+54",
      code: "AR",
    },
    {
      name: "Armenia",
      dial_code: "+374",
      code: "AM",
    },
    {
      name: "Aruba",
      dial_code: "+297",
      code: "AW",
    },
    {
      name: "Australia",
      dial_code: "+61",
      code: "AU",
    },
    {
      name: "Austria",
      dial_code: "+43",
      code: "AT",
    },
    {
      name: "Azerbaijan",
      dial_code: "+994",
      code: "AZ",
    },
    {
      name: "Bahamas",
      dial_code: "+1242",
      code: "BS",
    },
    {
      name: "Bahrain",
      dial_code: "+973",
      code: "BH",
    },
    {
      name: "Bangladesh",
      dial_code: "+880",
      code: "BD",
    },
    {
      name: "Barbados",
      dial_code: "+1246",
      code: "BB",
    },
    {
      name: "Belarus",
      dial_code: "+375",
      code: "BY",
    },
    {
      name: "Belgium",
      dial_code: "+32",
      code: "BE",
    },
    {
      name: "Belize",
      dial_code: "+501",
      code: "BZ",
    },
    {
      name: "Benin",
      dial_code: "+229",
      code: "BJ",
    },
    {
      name: "Bermuda",
      dial_code: "+1441",
      code: "BM",
    },
    {
      name: "Bhutan",
      dial_code: "+975",
      code: "BT",
    },
    {
      name: "Bolivia, Plurinational State of",
      dial_code: "+591",
      code: "BO",
    },
    {
      name: "Bosnia and Herzegovina",
      dial_code: "+387",
      code: "BA",
    },
    {
      name: "Botswana",
      dial_code: "+267",
      code: "BW",
    },
    {
      name: "Brazil",
      dial_code: "+55",
      code: "BR",
    },
    {
      name: "British Indian Ocean Territory",
      dial_code: "+246",
      code: "IO",
    },
    {
      name: "Brunei Darussalam",
      dial_code: "+673",
      code: "BN",
    },
    {
      name: "Bulgaria",
      dial_code: "+359",
      code: "BG",
    },
    {
      name: "Burkina Faso",
      dial_code: "+226",
      code: "BF",
    },
    {
      name: "Burundi",
      dial_code: "+257",
      code: "BI",
    },
    {
      name: "Cambodia",
      dial_code: "+855",
      code: "KH",
    },
    {
      name: "Cameroon",
      dial_code: "+237",
      code: "CM",
    },
    {
      name: "Canada",
      dial_code: "+1",
      code: "CA",
    },
    {
      name: "Cape Verde",
      dial_code: "+238",
      code: "CV",
    },
    {
      name: "Cayman Islands",
      dial_code: "+ 345",
      code: "KY",
    },
    {
      name: "Central African Republic",
      dial_code: "+236",
      code: "CF",
    },
    {
      name: "Chad",
      dial_code: "+235",
      code: "TD",
    },
    {
      name: "Chile",
      dial_code: "+56",
      code: "CL",
    },
    {
      name: "China",
      dial_code: "+86",
      code: "CN",
    },
    {
      name: "Christmas Island",
      dial_code: "+61",
      code: "CX",
    },
    {
      name: "Cocos (Keeling) Islands",
      dial_code: "+61",
      code: "CC",
    },
    {
      name: "Colombia",
      dial_code: "+57",
      code: "CO",
    },
    {
      name: "Comoros",
      dial_code: "+269",
      code: "KM",
    },
    {
      name: "Congo",
      dial_code: "+242",
      code: "CG",
    },
    {
      name: "Congo, The Democratic Republic of the Congo",
      dial_code: "+243",
      code: "CD",
    },
    {
      name: "Cook Islands",
      dial_code: "+682",
      code: "CK",
    },
    {
      name: "Costa Rica",
      dial_code: "+506",
      code: "CR",
    },
    {
      name: "Cote d'Ivoire",
      dial_code: "+225",
      code: "CI",
    },
    {
      name: "Croatia",
      dial_code: "+385",
      code: "HR",
    },
    {
      name: "Cuba",
      dial_code: "+53",
      code: "CU",
    },
    {
      name: "Cyprus",
      dial_code: "+357",
      code: "CY",
    },
    {
      name: "Czech Republic",
      dial_code: "+420",
      code: "CZ",
    },
    {
      name: "Denmark",
      dial_code: "+45",
      code: "DK",
    },
    {
      name: "Djibouti",
      dial_code: "+253",
      code: "DJ",
    },
    {
      name: "Dominica",
      dial_code: "+1767",
      code: "DM",
    },
    {
      name: "Dominican Republic",
      dial_code: "+1849",
      code: "DO",
    },
    {
      name: "Ecuador",
      dial_code: "+593",
      code: "EC",
    },
    {
      name: "Egypt",
      dial_code: "+20",
      code: "EG",
    },
    {
      name: "El Salvador",
      dial_code: "+503",
      code: "SV",
    },
    {
      name: "Equatorial Guinea",
      dial_code: "+240",
      code: "GQ",
    },
    {
      name: "Eritrea",
      dial_code: "+291",
      code: "ER",
    },
    {
      name: "Estonia",
      dial_code: "+372",
      code: "EE",
    },
    {
      name: "Ethiopia",
      dial_code: "+251",
      code: "ET",
    },
    {
      name: "Falkland Islands (Malvinas)",
      dial_code: "+500",
      code: "FK",
    },
    {
      name: "Faroe Islands",
      dial_code: "+298",
      code: "FO",
    },
    {
      name: "Fiji",
      dial_code: "+679",
      code: "FJ",
    },
    {
      name: "Finland",
      dial_code: "+358",
      code: "FI",
    },
    {
      name: "France",
      dial_code: "+33",
      code: "FR",
    },
    {
      name: "French Guiana",
      dial_code: "+594",
      code: "GF",
    },
    {
      name: "French Polynesia",
      dial_code: "+689",
      code: "PF",
    },
    {
      name: "Gabon",
      dial_code: "+241",
      code: "GA",
    },
    {
      name: "Gambia",
      dial_code: "+220",
      code: "GM",
    },
    {
      name: "Georgia",
      dial_code: "+995",
      code: "GE",
    },
    {
      name: "Germany",
      dial_code: "+49",
      code: "DE",
    },
    {
      name: "Ghana",
      dial_code: "+233",
      code: "GH",
    },
    {
      name: "Gibraltar",
      dial_code: "+350",
      code: "GI",
    },
    {
      name: "Greece",
      dial_code: "+30",
      code: "GR",
    },
    {
      name: "Greenland",
      dial_code: "+299",
      code: "GL",
    },
    {
      name: "Grenada",
      dial_code: "+1473",
      code: "GD",
    },
    {
      name: "Guadeloupe",
      dial_code: "+590",
      code: "GP",
    },
    {
      name: "Guam",
      dial_code: "+1671",
      code: "GU",
    },
    {
      name: "Guatemala",
      dial_code: "+502",
      code: "GT",
    },
    {
      name: "Guernsey",
      dial_code: "+44",
      code: "GG",
    },
    {
      name: "Guinea",
      dial_code: "+224",
      code: "GN",
    },
    {
      name: "Guinea-Bissau",
      dial_code: "+245",
      code: "GW",
    },
    {
      name: "Guyana",
      dial_code: "+595",
      code: "GY",
    },
    {
      name: "Haiti",
      dial_code: "+509",
      code: "HT",
    },
    {
      name: "Holy See (Vatican City State)",
      dial_code: "+379",
      code: "VA",
    },
    {
      name: "Honduras",
      dial_code: "+504",
      code: "HN",
    },
    {
      name: "Hong Kong",
      dial_code: "+852",
      code: "HK",
    },
    {
      name: "Hungary",
      dial_code: "+36",
      code: "HU",
    },
    {
      name: "Iceland",
      dial_code: "+354",
      code: "IS",
    },
    {
      name: "India",
      dial_code: "+91",
      code: "IN",
    },
    {
      name: "Indonesia",
      dial_code: "+62",
      code: "ID",
    },
    {
      name: "Iran, Islamic Republic of Persian Gulf",
      dial_code: "+98",
      code: "IR",
    },
    {
      name: "Iraq",
      dial_code: "+964",
      code: "IQ",
    },
    {
      name: "Ireland",
      dial_code: "+353",
      code: "IE",
    },
    {
      name: "Isle of Man",
      dial_code: "+44",
      code: "IM",
    },
    {
      name: "Israel",
      dial_code: "+972",
      code: "IL",
    },
    {
      name: "Italy",
      dial_code: "+39",
      code: "IT",
    },
    {
      name: "Jamaica",
      dial_code: "+1876",
      code: "JM",
    },
    {
      name: "Japan",
      dial_code: "+81",
      code: "JP",
    },
    {
      name: "Jersey",
      dial_code: "+44",
      code: "JE",
    },
    {
      name: "Jordan",
      dial_code: "+962",
      code: "JO",
    },
    {
      name: "Kazakhstan",
      dial_code: "+77",
      code: "KZ",
    },
    {
      name: "Kenya",
      dial_code: "+254",
      code: "KE",
    },
    {
      name: "Kiribati",
      dial_code: "+686",
      code: "KI",
    },
    {
      name: "Korea, Democratic People's Republic of Korea",
      dial_code: "+850",
      code: "KP",
    },
    {
      name: "Korea, Republic of South Korea",
      dial_code: "+82",
      code: "KR",
    },
    {
      name: "Kuwait",
      dial_code: "+965",
      code: "KW",
    },
    {
      name: "Kyrgyzstan",
      dial_code: "+996",
      code: "KG",
    },
    {
      name: "Laos",
      dial_code: "+856",
      code: "LA",
    },
    {
      name: "Latvia",
      dial_code: "+371",
      code: "LV",
    },
    {
      name: "Lebanon",
      dial_code: "+961",
      code: "LB",
    },
    {
      name: "Lesotho",
      dial_code: "+266",
      code: "LS",
    },
    {
      name: "Liberia",
      dial_code: "+231",
      code: "LR",
    },
    {
      name: "Libyan Arab Jamahiriya",
      dial_code: "+218",
      code: "LY",
    },
    {
      name: "Liechtenstein",
      dial_code: "+423",
      code: "LI",
    },
    {
      name: "Lithuania",
      dial_code: "+370",
      code: "LT",
    },
    {
      name: "Luxembourg",
      dial_code: "+352",
      code: "LU",
    },
    {
      name: "Macao",
      dial_code: "+853",
      code: "MO",
    },
    {
      name: "Macedonia",
      dial_code: "+389",
      code: "MK",
    },
    {
      name: "Madagascar",
      dial_code: "+261",
      code: "MG",
    },
    {
      name: "Malawi",
      dial_code: "+265",
      code: "MW",
    },
    {
      name: "Malaysia",
      dial_code: "+60",
      code: "MY",
    },
    {
      name: "Maldives",
      dial_code: "+960",
      code: "MV",
    },
    {
      name: "Mali",
      dial_code: "+223",
      code: "ML",
    },
    {
      name: "Malta",
      dial_code: "+356",
      code: "MT",
    },
    {
      name: "Marshall Islands",
      dial_code: "+692",
      code: "MH",
    },
    {
      name: "Martinique",
      dial_code: "+596",
      code: "MQ",
    },
    {
      name: "Mauritania",
      dial_code: "+222",
      code: "MR",
    },
    {
      name: "Mauritius",
      dial_code: "+230",
      code: "MU",
    },
    {
      name: "Mayotte",
      dial_code: "+262",
      code: "YT",
    },
    {
      name: "Mexico",
      dial_code: "+52",
      code: "MX",
    },
    {
      name: "Micronesia, Federated States of Micronesia",
      dial_code: "+691",
      code: "FM",
    },
    {
      name: "Moldova",
      dial_code: "+373",
      code: "MD",
    },
    {
      name: "Monaco",
      dial_code: "+377",
      code: "MC",
    },
    {
      name: "Mongolia",
      dial_code: "+976",
      code: "MN",
    },
    {
      name: "Montenegro",
      dial_code: "+382",
      code: "ME",
    },
    {
      name: "Montserrat",
      dial_code: "+1664",
      code: "MS",
    },
    {
      name: "Morocco",
      dial_code: "+212",
      code: "MA",
    },
    {
      name: "Mozambique",
      dial_code: "+258",
      code: "MZ",
    },
    {
      name: "Myanmar",
      dial_code: "+95",
      code: "MM",
    },
    {
      name: "Namibia",
      dial_code: "+264",
      code: "NA",
    },
    {
      name: "Nauru",
      dial_code: "+674",
      code: "NR",
    },
    {
      name: "Nepal",
      dial_code: "+977",
      code: "NP",
    },
    {
      name: "Netherlands",
      dial_code: "+31",
      code: "NL",
    },
    {
      name: "Netherlands Antilles",
      dial_code: "+599",
      code: "AN",
    },
    {
      name: "New Caledonia",
      dial_code: "+687",
      code: "NC",
    },
    {
      name: "New Zealand",
      dial_code: "+64",
      code: "NZ",
    },
    {
      name: "Nicaragua",
      dial_code: "+505",
      code: "NI",
    },
    {
      name: "Niger",
      dial_code: "+227",
      code: "NE",
    },
    {
      name: "Nigeria",
      dial_code: "+234",
      code: "NG",
    },
    {
      name: "Niue",
      dial_code: "+683",
      code: "NU",
    },
    {
      name: "Norfolk Island",
      dial_code: "+672",
      code: "NF",
    },
    {
      name: "Northern Mariana Islands",
      dial_code: "+1670",
      code: "MP",
    },
    {
      name: "Norway",
      dial_code: "+47",
      code: "NO",
    },
    {
      name: "Oman",
      dial_code: "+968",
      code: "OM",
    },
    {
      name: "Pakistan",
      dial_code: "+92",
      code: "PK",
    },
    {
      name: "Palau",
      dial_code: "+680",
      code: "PW",
    },
    {
      name: "Palestinian Territory, Occupied",
      dial_code: "+970",
      code: "PS",
    },
    {
      name: "Panama",
      dial_code: "+507",
      code: "PA",
    },
    {
      name: "Papua New Guinea",
      dial_code: "+675",
      code: "PG",
    },
    {
      name: "Paraguay",
      dial_code: "+595",
      code: "PY",
    },
    {
      name: "Peru",
      dial_code: "+51",
      code: "PE",
    },
    {
      name: "Philippines",
      dial_code: "+63",
      code: "PH",
    },
    {
      name: "Pitcairn",
      dial_code: "+872",
      code: "PN",
    },
    {
      name: "Poland",
      dial_code: "+48",
      code: "PL",
    },
    {
      name: "Portugal",
      dial_code: "+351",
      code: "PT",
    },
    {
      name: "Puerto Rico",
      dial_code: "+1939",
      code: "PR",
    },
    {
      name: "Qatar",
      dial_code: "+974",
      code: "QA",
    },
    {
      name: "Romania",
      dial_code: "+40",
      code: "RO",
    },
    {
      name: "Russia",
      dial_code: "+7",
      code: "RU",
    },
    {
      name: "Rwanda",
      dial_code: "+250",
      code: "RW",
    },
    {
      name: "Reunion",
      dial_code: "+262",
      code: "RE",
    },
    {
      name: "Saint Barthelemy",
      dial_code: "+590",
      code: "BL",
    },
    {
      name: "Saint Helena, Ascension and Tristan Da Cunha",
      dial_code: "+290",
      code: "SH",
    },
    {
      name: "Saint Kitts and Nevis",
      dial_code: "+1869",
      code: "KN",
    },
    {
      name: "Saint Lucia",
      dial_code: "+1758",
      code: "LC",
    },
    {
      name: "Saint Martin",
      dial_code: "+590",
      code: "MF",
    },
    {
      name: "Saint Pierre and Miquelon",
      dial_code: "+508",
      code: "PM",
    },
    {
      name: "Saint Vincent and the Grenadines",
      dial_code: "+1784",
      code: "VC",
    },
    {
      name: "Samoa",
      dial_code: "+685",
      code: "WS",
    },
    {
      name: "San Marino",
      dial_code: "+378",
      code: "SM",
    },
    {
      name: "Sao Tome and Principe",
      dial_code: "+239",
      code: "ST",
    },
    {
      name: "Saudi Arabia",
      dial_code: "+966",
      code: "SA",
    },
    {
      name: "Senegal",
      dial_code: "+221",
      code: "SN",
    },
    {
      name: "Serbia",
      dial_code: "+381",
      code: "RS",
    },
    {
      name: "Seychelles",
      dial_code: "+248",
      code: "SC",
    },
    {
      name: "Sierra Leone",
      dial_code: "+232",
      code: "SL",
    },
    {
      name: "Singapore",
      dial_code: "+65",
      code: "SG",
    },
    {
      name: "Slovakia",
      dial_code: "+421",
      code: "SK",
    },
    {
      name: "Slovenia",
      dial_code: "+386",
      code: "SI",
    },
    {
      name: "Solomon Islands",
      dial_code: "+677",
      code: "SB",
    },
    {
      name: "Somalia",
      dial_code: "+252",
      code: "SO",
    },
    {
      name: "South Africa",
      dial_code: "+27",
      code: "ZA",
    },
    {
      name: "South Sudan",
      dial_code: "+211",
      code: "SS",
    },
    {
      name: "South Georgia and the South Sandwich Islands",
      dial_code: "+500",
      code: "GS",
    },
    {
      name: "Spain",
      dial_code: "+34",
      code: "ES",
    },
    {
      name: "Sri Lanka",
      dial_code: "+94",
      code: "LK",
    },
    {
      name: "Sudan",
      dial_code: "+249",
      code: "SD",
    },
    {
      name: "Suriname",
      dial_code: "+597",
      code: "SR",
    },
    {
      name: "Svalbard and Jan Mayen",
      dial_code: "+47",
      code: "SJ",
    },
    {
      name: "Swaziland",
      dial_code: "+268",
      code: "SZ",
    },
    {
      name: "Sweden",
      dial_code: "+46",
      code: "SE",
    },
    {
      name: "Switzerland",
      dial_code: "+41",
      code: "CH",
    },
    {
      name: "Syrian Arab Republic",
      dial_code: "+963",
      code: "SY",
    },
    {
      name: "Taiwan",
      dial_code: "+886",
      code: "TW",
    },
    {
      name: "Tajikistan",
      dial_code: "+992",
      code: "TJ",
    },
    {
      name: "Tanzania, United Republic of Tanzania",
      dial_code: "+255",
      code: "TZ",
    },
    {
      name: "Thailand",
      dial_code: "+66",
      code: "TH",
    },
    {
      name: "Timor-Leste",
      dial_code: "+670",
      code: "TL",
    },
    {
      name: "Togo",
      dial_code: "+228",
      code: "TG",
    },
    {
      name: "Tokelau",
      dial_code: "+690",
      code: "TK",
    },
    {
      name: "Tonga",
      dial_code: "+676",
      code: "TO",
    },
    {
      name: "Trinidad and Tobago",
      dial_code: "+1868",
      code: "TT",
    },
    {
      name: "Tunisia",
      dial_code: "+216",
      code: "TN",
    },
    {
      name: "Turkey",
      dial_code: "+90",
      code: "TR",
    },
    {
      name: "Turkmenistan",
      dial_code: "+993",
      code: "TM",
    },
    {
      name: "Turks and Caicos Islands",
      dial_code: "+1649",
      code: "TC",
    },
    {
      name: "Tuvalu",
      dial_code: "+688",
      code: "TV",
    },
    {
      name: "Uganda",
      dial_code: "+256",
      code: "UG",
    },
    {
      name: "Ukraine",
      dial_code: "+380",
      code: "UA",
    },
    {
      name: "United Arab Emirates",
      dial_code: "+971",
      code: "AE",
    },
    {
      name: "United Kingdom",
      dial_code: "+44",
      code: "GB",
    },
    {
      name: "United States",
      dial_code: "+1",
      code: "US",
    },
    {
      name: "Uruguay",
      dial_code: "+598",
      code: "UY",
    },
    {
      name: "Uzbekistan",
      dial_code: "+998",
      code: "UZ",
    },
    {
      name: "Vanuatu",
      dial_code: "+678",
      code: "VU",
    },
    {
      name: "Venezuela, Bolivarian Republic of Venezuela",
      dial_code: "+58",
      code: "VE",
    },
    {
      name: "Vietnam",
      dial_code: "+84",
      code: "VN",
    },
    {
      name: "Virgin Islands, British",
      dial_code: "+1284",
      code: "VG",
    },
    {
      name: "Virgin Islands, U.S.",
      dial_code: "+1340",
      code: "VI",
    },
    {
      name: "Wallis and Futuna",
      dial_code: "+681",
      code: "WF",
    },
    {
      name: "Yemen",
      dial_code: "+967",
      code: "YE",
    },
    {
      name: "Zambia",
      dial_code: "+260",
      code: "ZM",
    },
    {
      name: "Zimbabwe",
      dial_code: "+263",
      code: "ZW",
    },
  ];

  getBaseMetadata() {
    localStorage.removeItem("TZNM");
    localStorage.removeItem("TZNMVL");
    this.showload = true;
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    this.http
      .get(
        credentials.host + "/get_metadatas/" + this.cookieService.get("_PAOID"),
        { headers: headers }
      )
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })

      .subscribe(
        (data) => {
          localStorage.setItem("TZNM", data.timezone_name);
          localStorage.setItem("TZNMVL", data.timezone_value);

          this.showload = false;
          this.customFieldsMeta = data.custom_fields_datatype;
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

  selValNewField(val) {
    this.newFieldType = val;
  }

  addNewField() {
    this.addNewFieldClass = new AddNewField();
    this.curId = undefined;
    this.addNewFieldClass.org_id = this.cookieService.get("_PAOID");
    this.addNewFieldClass.user_id = this.cookieService.get("_userID");
    this.addNewFieldClass.profile = "TenantProfile";
    this.addNewFieldClass.fields = [];
    this.newFieldKeysClass = new NewFieldKeys();
    this.newFieldKeysClass.label = this.newFieldLabel;
    this.newFieldKeysClass.datatype = this.newFieldType;
    this.addNewFieldClass.fields.push(this.newFieldKeysClass);
    // this.showCFMD = false;

    if (this.authService.canActivate()) {
      this.showload = true;
      var body = this.addNewFieldClass;
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      return this.http
        .post(credentials.host + "/cf_add", body, { headers: headers })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          (data) => {
            this.showCFMD = false;
            this.newFieldType = "";
            this.newFieldLabel = "";
            if (data.success == true) {
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create("", data.message, "info");
              setTimeout(() => {
                this.saveMsg = false;
                this.getMetaData();
              }, 4000);
            } else {
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create("", data.message, "error");
              setTimeout(() => {
                this.saveMsg = false;
              }, 4000);
            }
          },
          (error) => {
            this.showCFMD = false;
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

  curEditableField(val) {
    this.editablePopup = true;
    this.newFieldLabel = val.label;
    this.newFieldType = val.datatype;
    this.curId = val.id;
  }

  cancelNewField() {
    this.showCFMD = false;
    this.newFieldType = "";
    this.newFieldLabel = "";
  }

  cancelEditField() {
    this.editablePopup = false;
    this.newFieldType = "";
    this.newFieldLabel = "";
  }

  deleteField() {
    var deleteStructure;
    deleteStructure = new EditLabelNames();
    deleteStructure.org_id = this.cookieService.get("_PAOID");
    deleteStructure.user_id = this.cookieService.get("_userID");
    deleteStructure.profile = "TenantProfile";
    deleteStructure.id = this.curId;
    delete deleteStructure.label;
    this.showCFMD = false;
    this.editablePopup = false;
    this.newFieldType = "";
    this.newFieldLabel = "";

    // if (this.authService.canActivate()) {
    //   this.showload = true;
    //   var body = deleteStructure;
    //   var headers = new Headers();
    //   headers.append("Content-Type", "application/json");
    //   headers.append(
    //     "Authorization",
    //     "Bearer " + this.cookieService.get("_PTBA")
    //   );
    //   return this.http
    //     .delete(credentials.host + "/cf_delete", body, { headers: headers })
    //     .map(res => res.json())
    //     .catch((e: any) => {
    //       return Observable.throw(e);
    //     })

    //     .subscribe(
    //       data => {
    //         this.showCFMD = false;
    //         this.editablePopup = false;
    //         this.newFieldType = "";
    //         this.newFieldLabel = "";
    //         this.curId = undefined;
    //         if (data.success == true) {
    //           // this.showMsg = data.message;
    //           // this.saveMsg = true;
    //           this._notifications.create("", data.message, "info");
    //           setTimeout(() => {
    //             this.saveMsg = false;
    //             this.getMetaData();
    //           }, 4000);
    //         } else {
    //           // this.showMsg = data.message;
    //           // this.saveMsg = true;
    //           this._notifications.create("", data.message, "error");
    //           setTimeout(() => {
    //             this.saveMsg = false;
    //           }, 4000);
    //         }
    //       },
    //       error => {
    //         this.showCFMD = false;
    //         this.showload = false;
    //         this.editablePopup = false;
    //         this.curId = undefined;
    //         if (error.status == 404) {
    //           this.router.navigateByUrl("pages/NotFound");
    //         } else if (error.status == 401) {
    //           this.cookieService.deleteAll();
    //           window.location.href = "http://accounts.scora.in";
    //           // window.location.href='http://accounts.scora.in';
    //         } else {
    //           this.router.navigateByUrl("pages/serverError");
    //         }
    //       }
    //     );
    // }
  }

  editLabelName() {
    this.editLabelNameClass = new EditLabelNames();
    this.editLabelNameClass.org_id = this.cookieService.get("_PAOID");
    this.editLabelNameClass.user_id = this.cookieService.get("_userID");
    this.editLabelNameClass.profile = "TenantProfile";
    this.editLabelNameClass.id = this.curId;
    this.editLabelNameClass.label = this.newFieldLabel;

    if (this.authService.canActivate()) {
      this.showload = true;
      var body = this.editLabelNameClass;
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      return this.http
        .post(credentials.host + "/cf_edit", body, { headers: headers })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          (data) => {
            this.showCFMD = false;
            this.editablePopup = false;
            this.newFieldType = "";
            this.newFieldLabel = "";
            this.curId = undefined;
            if (data.success == true) {
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create("", data.message, "info");
              setTimeout(() => {
                this.saveMsg = false;
                this.getMetaData();
              }, 4000);
            } else {
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create("", data.message, "error");
              setTimeout(() => {
                this.saveMsg = false;
              }, 4000);
            }
          },
          (error) => {
            this.showCFMD = false;
            this.showload = false;
            this.editablePopup = false;
            this.curId = undefined;
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = "http://scora.io:5200";
              // window.location.href='http://accounts.scora.in';
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    }
  }

  patchForm(){
    console.log('state list in patch',this.statesList);
    console.log('city list in patch',this.cityList);
    this.populateCity(this.tenantDetails.tenant_state);
    // let country=this.getAllCountries.find(x=>x.name==this.tenantDetails.tenant_country);
    // let state=this.statesList.find(x=>x.name==this.tenantDetails.tenant_state);
    // let city=this.cityList.find(x=>x.name==this.tenantDetails.tenant_city);
    this.myForm.patchValue({
    name:this.universityall.profile_name,
    country:this.tenantDetails.tenant_country,
    state:this.tenantDetails.tenant_state,
    org_name:this.tenantDetails.tenant_name,
    designation:this.tenantDetails.tenant_designation,
    city:this.tenantDetails.tenant_city,
    emailId:this.tenantDetails.tenant_email,
    mobNo:this.tenantDetails.tenant_phone,
    address:this.tenantDetails.tenant_address,
    password:'',
    timezone:this.tenantDetails.tenant_timezone,
    postalcode:this.tenantDetails.tenant_zip_code,

    })
  }
}
