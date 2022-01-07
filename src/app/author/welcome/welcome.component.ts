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
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(  private restapiservice: RESTApiService,
    private httpClient: HttpClient,
    private http: Http,
    private router: Router,
    public sanitizer: DomSanitizer,
    public route: ActivatedRoute,
    private cookieService: CookieService,
    private authService: AuthServiceService,
    private _notifications: NotificationsService,
    private _location: Location,
    public GetItemService: GetItemService,
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
    this.UniversityItems();
  }

  backClicked() {
    this._location.back();
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
      })
    }
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

}
