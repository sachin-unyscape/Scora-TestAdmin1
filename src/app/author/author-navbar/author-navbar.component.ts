import { Component, OnInit, HostListener } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AllBaseimage } from './admin';
import { allimage } from './image';
import { UniversityDetails } from './university';
import { NgClass } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import{credentials} from '../../credentials';
//cookie
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { GetItemService } from '../../get-item.service';
import 'rxjs/add/observable/throw';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { DomSanitizer,SafeUrl } from "@angular/platform-browser";
// import 'rxjs/add/operator/shareReplay';
import {  LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
  selector: 'app-author-navbar',
  templateUrl: './author-navbar.component.html',
  styleUrls: ['./author-navbar.component.scss'],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class AuthorNavbarComponent implements OnInit {
  public disabled: boolean = false;
  public status: {isopen: boolean} = {isopen: false};

  public data: any;
  public AllBaseimage: AllBaseimage;
  public universityall: any;
  public theme: any;

  public adminimage: any;

  public configuretheme: string;
  public fullpageload: boolean = false;

  public userOrgId;
  public tenantLogo;
  public uploadProfile = false;
  public profileLoader;
  public availableModulesList;
  public currentApplicationName;
  public currentActivatedRoute;
  public normalImage;
  public currentOrgName;
  public alerts: any[] =[];
  public assignThemeValue:boolean = false;
  public publicIP;

  public org_themes;

  public toggled(open: boolean): void {

  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  constructor(private location: Location,private http: Http,public sanitizer:DomSanitizer, private router: Router, private activeroute: ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,public GetItemService:GetItemService){
    this.AllBaseimage = new AllBaseimage();
    this.UniversityItems();

  }


  ngOnInit(){
    this.org_themes = {
      content_display_area_color: "#545454",
      current_active: true,
      default_brand_color: "#00aed9",
      left_navigation_bar_color: "#3d454e",
      selected_menu_item_color: "#272d33",
      selected_menu_text_color: "#f4f4f4",
      theme_id: 1,
      themename: "theme 1",
      top_navigation_bar_color: "#e8eff6",
      unselected_menu_items_color: "#acacac",
    }
    this.GetItemService.cast.subscribe(update =>{


      if(update.updateAPIkey){
        this.UniversityItems();
      }else if(!update.updateAPIkey && update.themevalue != null){
        this.assignThemeValue = true;
        this.org_themes = update.themevalue;
        this.UniversityItems();
      }


      this.currentActivatedRoute = this.router.url;

    });





// this.abc();
  }


// abc(){
//   (function(document){
//     var div = document.getElementById('container');
//     var icon = document.getElementById('icon');
//     var open = false;

//     div.addEventListener('click', function(){
//       if(open){
//         icon.className = 'fa fa-arrow-down';
//       } else{
//         icon.className = 'fa fa-arrow-down open';
//       }

//       open = !open;
//     });
//   })(document);
// }


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
        this.availableModulesList = [];
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
              this.userOrgId = this.universityall.available_organization[o].org_id;
              this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[o].review_work_flow);
              this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[o].organization_img);
              this.currentOrgName = this.universityall.available_organization[o].organization_name;
              this.adminimage = this.universityall.available_organization[o];
              if(this.assignThemeValue == false){        // to assign theme choosen from profile but not value from USER DETAILS API
                this.org_themes = this.universityall.available_organization[o].organization_theme;
              }
              this.GetItemService.getOrganisationRoles(this.universityall.available_organization[o].organization_roles);
              for(var j=0;j<this.adminimage.applications.length;j++){
                if(this.adminimage.applications[j].application_name == 'Admin/Author'){
                  this.currentApplicationName = this.adminimage.applications[j].application_name;
                  this.availableModulesList = this.adminimage.applications[j].available_modules;
                  if(this.currentActivatedRoute == '/author'){
                    this.router.navigate(['/author/dashboard']);
                  }else{
                    this.router.navigateByUrl(this.currentActivatedRoute);
                  }
                  if(this.currentActivatedRoute == '/author'){
                    this.router.navigate(['/author/dashboard']);
                  }else{
                    this.router.navigateByUrl(this.currentActivatedRoute);
                  }
                  break;
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
                  // window.location.href='https://apps.scora.in';
                  window.location.href=credentials.appUrl;
                }
              }
            }
          }
          if(this.adminimage == undefined){   // to check whether any value is assigned (if there is not default organisation from the org list) to this variable otherwise take 0th index from organisation list
              this.cookieService.set( '_PAOID', this.universityall.available_organization[0].org_id);
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
                  this.availableModulesList = this.adminimage.applications[j].available_modules;
                  if(this.currentActivatedRoute == '/author'){
                    this.router.navigate(['/author/dashboard']);
                  }else{
                    this.router.navigateByUrl(this.currentActivatedRoute);
                  }
                  if(this.currentActivatedRoute == '/author'){
                    this.router.navigate(['/author/dashboard']);
                  }else{
                    this.router.navigateByUrl(this.currentActivatedRoute);
                  }
                  break;
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
                  // window.location.href='https://apps.scora.in';
                  window.location.href=credentials.appUrl;
                }
              }
          }

        }else{
          for(var i=0;i<this.universityall.available_organization.length;i++){
            var cookieORgId = this.cookieService.get('_PAOID');
            if(cookieORgId == this.universityall.available_organization[i].org_id){
              this.cookieService.set( '_PAOID', this.universityall.available_organization[i].org_id);
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
                  this.availableModulesList =this.adminimage.applications[j].available_modules;
                  if(this.currentActivatedRoute == '/author' ){
                    this.router.navigate(['/author/dashboard']);
                  }else{
                    this.router.navigateByUrl(this.currentActivatedRoute);
                  }
                  break;

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
                  // window.location.href='https://apps.scora.in';
                  window.location.href=credentials.appUrl;
                }
              }


            }
          }
          if(this.adminimage == undefined){  // to check whether any value is assigned (if there is not default organisation from the org list) to this variable otherwise take 0th index from organisation list
            for(var o=0;o<this.universityall.available_organization.length;o++){
              if(this.universityall.available_organization[o].default == true){
                this.cookieService.set( '_PAOID', this.universityall.available_organization[o].org_id);
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
                    this.availableModulesList = this.adminimage.applications[j].available_modules;
                    if(this.currentActivatedRoute == '/author'){
                      this.router.navigate(['/author/dashboard']);
                    }else{
                      this.router.navigateByUrl(this.currentActivatedRoute);
                    }
                    if(this.currentActivatedRoute == '/author'){
                      this.router.navigate(['/author/dashboard']);
                    }else{
                      this.router.navigateByUrl(this.currentActivatedRoute);
                    }
                    break;
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
                  // window.location.href='https://apps.scora.in';
                  window.location.href=credentials.appUrl;
                  }
                }
              }
            }
            if(this.adminimage == undefined){
              this.cookieService.set( '_PAOID', this.universityall.available_organization[0].org_id);
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
                    this.availableModulesList = this.adminimage.applications[j].available_modules;
                    if(this.currentActivatedRoute == '/author'){
                      this.router.navigate(['/author/dashboard']);
                    }else{
                      this.router.navigateByUrl(this.currentActivatedRoute);
                    }
                    if(this.currentActivatedRoute == '/author'){
                      this.router.navigate(['/author/dashboard']);
                    }else{
                      this.router.navigateByUrl(this.currentActivatedRoute);
                    }
                    break;
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
                  // window.location.href='https://apps.scora.in';
                  window.location.href=credentials.userDashboardUrl;
                  }
                }
            }
          }
        }
      },
      error => {
        this.fullpageload = false;

        if(error.status == 404){
          this.router.navigateByUrl('author/NotFound');
        }
        else if(error.status == 401){
          this.cookieService.deleteAll();
          // window.location.href='https://accounts.scora.in';
           window.location.href=credentials.accountUrl;
        }
        else{
          this.router.navigateByUrl('author/serverError');
        }
      },

    );
  }
}

onMouseOver(image, index, name){


  var baseimage = this.adminimage;

  var hover = baseimage.applications.filter(data=> data.application_image == image )

  for(var i=0;i<hover.length;i++){
    if(hover[i].application_name == 'User Dashboard'){
      this.normalImage = image;
      this.adminimage.applications[index].application_image = hover[i].application_hover_image;
      this.adminimage.applications[index].application_hover_image = hover[i].application_hover_image;
    }
  }

}

onMouseOut(image, index, name){

  var baseimage = this.adminimage;

  var hover = baseimage.applications.filter(data=> data.application_image == image )

  for(var i=0;i<hover.length;i++){
    if(hover[i].application_name == 'User Dashboard'){
      this.adminimage.applications[index].application_name = 'User Dashboard';
      this.adminimage.applications[index].application_image = this.normalImage;
      this.adminimage.applications[index].application_hover_image = hover[i].application_hover_image;
    }
  }

}


admin_redirect(admin_name){
  if(admin_name == 'Author'){
    this.router.navigate(['/author/dashboard']);
    // window.open('http://192.168.1.8:4200/#/author/dashboard', '_blank')
    // window.open('http://www.google.com');
  }
  if(admin_name == 'Tenant Admin'){
    // window.open('http://www.google.com','_blank');
    // this.router.navigate(['/testadmin/dashboard'])
  }
  // if(admin_name == 'author_admin'){
  //   this.router.navigate(['/author/dashboard'])
  // }
  // if(admin_name == 'test_admin'){
  //   this.router.navigate(['/testadmin/dashboard'])
  // }
  if(admin_name == 'User Dashboard'){
    // window.open('https://user.scora.in','_blank');
    window.open(credentials.userDashboardUrl,'_blank');
  }

}


RedirectSourceFile(){
  window.open('http://www.source.scora.in/','_blank');
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
       this.cookieService.deleteAll();
       localStorage.removeItem('dataSource');  
      // window.location.href='https://accounts.scora.in';
       window.location.href=credentials.accountUrl;
     }
    },
    error => {
      this.fullpageload = false;

      if(error.status == 404){
        this.router.navigateByUrl('author/NotFound');
      }
      else if(error.status == 401){
        this.cookieService.deleteAll();
        // window.location.href='https://accounts.scora.in';
         window.location.href=credentials.accountUrl;
      }
      else{
        this.router.navigateByUrl('author/serverError');
      }
    },

  );
}

nextOrganisation(orgId){
  this.cookieService.set( '_PAOID', orgId);
      this.userOrgId = orgId;

    for(var i=0;i<this.universityall.available_organization.length;i++){
      if(this.universityall.available_organization[i].org_id == orgId){
        this.adminimage = this.universityall.available_organization[i];
        if(this.assignThemeValue == false){
          this.org_themes = this.universityall.available_organization[i].organization_theme;
        }
        this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[i].organization_img);
        this.currentOrgName = this.universityall.available_organization[i].organization_name;
        this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[i].review_work_flow);
        this.GetItemService.getOrganisationRoles(this.universityall.available_organization[i].organization_roles);
        for(var j=0;j<this.adminimage.applications.length;j++){
          if(this.adminimage.applications[j].application_name == 'Admin/Author'){
            this.currentApplicationName = this.adminimage.applications[j].application_name;
            this.availableModulesList =this.adminimage.applications[j].available_modules;
            this.router.navigateByUrl('/home');
            // window.location.reload();
            break;
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
                  // window.location.href='https://apps.scora.in';
                  window.location.href=credentials.appUrl;
          }
        }

      }
    }


}


showUpload(){   //to show profile icon when hover
  this.uploadProfile = true;
}

removeUpload(){  //to remove profile icon when hover
  this.uploadProfile = false;
}

onClosed(dismissedAlert: AlertComponent): void {
  this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
}


fileChange(event){

    if(this.authService.canActivate()){
      this.profileLoader = true;
      let fileList: FileList = event.target.files;

      if(fileList[0].type == "image/jpeg" || fileList[0].type == "image/jpg" || fileList[0].type == "image/png"){
        if(fileList[0].size < 3145728){
          if(fileList.length > 0) {
              let file: File = fileList[0];

              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id', this.cookieService.get('_PAOID'));

              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.host +'/update_profile', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        if(data.success == true){

                          this.profileLoader = false;
                          this.universityall.profile_picture = this.sanitizer.bypassSecurityTrustUrl(data.path);
                        }else{
                          this.profileLoader = false;
                        }
                      },
                      error => {
                        this.profileLoader = false;

                        if(error.status == 404){
                          this.router.navigateByUrl('author/NotFound');
                        }
                        else if(error.status == 401){
                          this.cookieService.deleteAll();
                          // window.location.href='https://accounts.scora.in';
                           window.location.href=credentials.accountUrl;
                        }
                        else{
                          this.router.navigateByUrl('author/serverError');
                        }
                      },
                  )
          }
        }else{
          this.profileLoader = false;
          // alert("This File Size Exceeds the Maximum Limit of 3MB");
          this.alerts.push({
            type: 'danger',
            msg:"This File Size Exceeds the Maximum Limit of 3MB",
            timeout:4000
          });
        }
      }else{
        this.profileLoader = false;
        // alert("Invalid extension for file "+fileList[0].name+". Only .jpg ,.jpeg and .png files are supported.");
        this.alerts.push({
          type: 'danger',
          msg:"Invalid extension for file "+fileList[0].name+". Only .jpg ,.jpeg and .png files are supported.",
          timeout:4000
        });


      }

    }
}





  //top navigation with brand background color function
  // getStyle1() {
  //   if(this.AllBaseimage.theme == 'theme0' ) {
  //     return "#e8eff6";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme1' ) {
  //     return "#e8eff6";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme2' ) {
  //     return "#f8f6ef";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme3' ) {
  //     return "#e8f7f3";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme4' ) {
  //     return "#fff2f2";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme5' ) {
  //     return "#e8faff";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme6' ) {
  //     return "#fff5ff";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme7' ) {
  //     return "#f2fff8";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme8' ) {
  //     return "#fff9f5";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme9' ) {
  //     return "#f2ffff";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme10' ) {
  //     return "#eff7ff";
  //   }
  // }

  //sidebar background with color function
  // getStyle() {
  //   if(this.AllBaseimage.theme == 'theme0' ) {
  //     return "#e8eff6";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme1' ) {
  //     return "#3d454e";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme2' ) {
  //     return "#3f3e3d";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme3' ) {
  //     return "#393c3b";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme4' ) {
  //     return "#f8f8f8";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme5' ) {
  //     return "#f8f8f8";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme6' ) {
  //     return "#fff5ff";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme7' ) {
  //     return "#f2fff8";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme8' ) {
  //     return "#fff9f5";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme9' ) {
  //     return "#f2ffff";
  //   }
  //   else if(this.AllBaseimage.theme == 'theme10' ) {
  //     return "#eff7ff";
  //   }
  // }

  // getStyle2() {

  //       if(this.AllBaseimage.theme == 'theme0' ) {
  //         let styles = {
  //           'color':  'white',
  //           'background': '#272d33',
  //           'border-left': '3px solid #00aed9'
  //         };
  //         return styles;
  //       }


  //       else if(this.AllBaseimage.theme == 'theme1' ) { // theme 00aed9
  //         let styles = {
  //           'color':  'white',
  //           'background': '#272d33',
  //           'border-left': '3px solid #00aed9'
  //         };
  //         return styles;
  //       }

  //       else if(this.AllBaseimage.theme == 'theme2' ) { // theme ffba00
  //         let styles = {
  //           'color':  'white',
  //           'background': '#3f3e3d',
  //           'border-left': '3px solid #ffba00'
  //         };
  //         return styles;
  //       }
  //       else if(this.AllBaseimage.theme == 'theme3' ) { // theme 22b089
  //           let styles = {
  //             'color':  'white',
  //             'background': '#393c3b',
  //             'border-left': '3px solid #22b089'

  //           };
  //           return styles;
  //       }
  //       else if(this.AllBaseimage.theme == 'theme4' ) { // theme d63b49
  //         let styles = {
  //           'color':  'white',
  //           'background': '#ffffff',
  //           'border-left': '3px solid #545454'
  //         };
  //         return styles;
  //       }
  //       else if(this.AllBaseimage.theme == 'theme5' ) { // theme d63b49
  //         let styles = {
  //           'color':  'white',
  //           'background': '#ffffff',
  //           'border-left': '3px solid #545454'
  //         };
  //         return styles;
  //       }

  // }

//   mouseEnter(){

//     if(this.AllBaseimage.theme == 2 ) {

//       this.mouseover_getStyle1();
//     }
//   }
// mouseover_getStyle1(){
//   let styles = {
//     'color':  'white',
//     'background': 'red !important',
//   };

//   return styles;
//   }



  //theme selection function
  // themechagne(theme){
  //   if(this.authService.canActivate()){
  //   if (theme == 'theme1'){
  //     this.http.get("../assets/imgaeload_1.json")
  //     .map(res => res.json())
  //     .subscribe(
  //       data => localStorage.setItem('theme1' , JSON.stringify(data)),
  //       error => alert(error),
  //       () => {

  //         this.AllBaseimage = new AllBaseimage();
  //         this.AllBaseimage = JSON.parse(localStorage.getItem('theme1'));

  //       }
  //    );
  //   }
  //   else if (theme == 'theme2'){
  //     this.http.get("../assets/imgaeload_2.json")
  //     .map(res => res.json())
  //     .subscribe(
  //       data => localStorage.setItem('theme2' , JSON.stringify(data)),
  //       error => alert(error),
  //       () => {

  //         this.AllBaseimage = new AllBaseimage();
  //         this.AllBaseimage = JSON.parse(localStorage.getItem('theme2'));

  //       }
  //    );
  //   }
  //   else if (theme == 'theme3'){
  //     this.http.get("../assets/imgaeload_3.json")
  //     .map(res => res.json())
  //     .subscribe(
  //       data => {
  //         this.data = data;
  //         this.AllBaseimage = this.data;


  //       },
  //       error => alert(error),

  //    );
  //   }
  //   else if (theme == 'theme4'){
  //     this.http.get("../assets/imgaeload_4.json")
  //     .map(res => res.json())
  //     .subscribe(
  //       data => {
  //         this.data = data;
  //         this.AllBaseimage = this.data;


  //       },
  //       error => alert(error),

  //    );
  //   }
  // }
  // }

}
