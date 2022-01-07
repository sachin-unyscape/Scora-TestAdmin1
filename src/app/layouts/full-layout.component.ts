import { Component, OnInit, HostListener } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NgClass } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { credentials } from '../credentials';
//cookie
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../auth-service.service';
import { GetItemService } from '../get-item.service';
import 'rxjs/add/observable/throw';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
// import 'rxjs/add/operator/shareReplay';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';


import { RouteConfigLoadEnd } from "@angular/router";
import { RouteConfigLoadStart } from "@angular/router";

import { Event as RouterEvent } from "@angular/router";

var $: any;

@Component({
  selector: 'app-default',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.css'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})

export class FullLayoutComponent implements OnInit {

  public isShowingRouteLoadIndicator: boolean;

  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };

  public data: any;
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
  public alerts: any[] = [];
  public assignThemeValue: boolean = false;
  public showSideBar: boolean = true;
  public publicIP;

  public org_themes;
  public sidenavVsCommentsToggle;

  public toggled(open: boolean): void {

  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  constructor(private location: Location, private http: Http, public sanitizer: DomSanitizer, private router: Router, private activeroute: ActivatedRoute, private cookieService: CookieService, private authService: AuthServiceService, public GetItemService: GetItemService) {

    this.UniversityItems();

    this.isShowingRouteLoadIndicator = false;

    var asyncLoadCount = 0;

    router.events.subscribe((event: RouterEvent): void => {
      if (event instanceof RouteConfigLoadStart) {
        asyncLoadCount++;
      } else if (event instanceof RouteConfigLoadEnd) {
        asyncLoadCount--;
      }
      this.isShowingRouteLoadIndicator = !!asyncLoadCount;
    });

  }


  ngOnInit() {
    this.sidenavVsCommentsToggle = true;
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
    this.GetItemService.cast.subscribe(update => {


      if (update.updateAPIkey) {
        this.UniversityItems();
      } else if (!update.updateAPIkey && update.themevalue != null) {
        this.assignThemeValue = true;
        this.org_themes = update.themevalue;
        this.UniversityItems();
      }


      this.currentActivatedRoute = this.router.url;

    });
    this.sideNavDisplayAjax();
  }





  UniversityItems() {


    if (this.authService.canActivate()) {
      this.cookieService.delete('_TEM');
      this.cookieService.delete('_TON');
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.accountHost + '/user_details', { headers: headers })
        .map(res => res.json())

        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
          data => {
            this.availableModulesList = [];
            this.fullpageload = false;
            this.universityall = data.user_login_details;

            var tempOrgMail;
            tempOrgMail = data.user_login_details.profile_email;
            if (tempOrgMail != '' && tempOrgMail != null) {
              this.cookieService.set('_TEM', tempOrgMail);
            }

            var tempOrgName;
            tempOrgName = data.user_login_details.profile_organization_text;
            if (tempOrgName != '' && tempOrgName != null) {
              this.cookieService.set('_TON', tempOrgName);
            }

            // security
            var tempProfilePic = this.sanitizer.bypassSecurityTrustUrl(this.universityall.profile_picture);
            this.universityall.profile_picture = tempProfilePic;
            // org logo
            for (var i = 0; i < this.universityall.available_organization.length; i++) {
              var tempOrgLogo = this.universityall.available_organization[i].organization_img;
              this.universityall.available_organization[i].organization_img = tempOrgLogo;
            }

            //security ends

            if (!this.cookieService.check('_PAOID')) {
              for (var o = 0; o < this.universityall.available_organization.length; o++) {
                if (this.universityall.available_organization[o].default == true) {
                  this.cookieService.set('_PAOID', this.universityall.available_organization[o].org_id);
                  this.cookieService.set('_userID', this.universityall.profile_id);
                  this.userOrgId = this.universityall.available_organization[o].org_id;
                  this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[o].review_work_flow);
                  this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[o].organization_img);
                  this.currentOrgName = this.universityall.available_organization[o].organization_name;
                  this.adminimage = this.universityall.available_organization[o];
                  if (this.assignThemeValue == false) {
                    this.org_themes = this.universityall.available_organization[o].organization_theme;
                  }
                  this.GetItemService.getOrganisationRoles(this.universityall.available_organization[o].organization_roles);
                  for (var j = 0; j < this.adminimage.applications.length; j++) {

                    //testing code for test admin 1
                    if (this.adminimage.applications[j].default == true) {
                      this.currentApplicationName = this.adminimage.applications[j].application_name;
                      this.cookieService.set('_APPNAME', this.currentApplicationName);
                      this.availableModulesList = this.adminimage.applications[j].available_modules;
                      console.log("1-availableModulesList", this.availableModulesList)
                      console.log("1-currentApplicationName TEST ADMIN", this.currentApplicationName)
                      let data = localStorage.getItem('dataSource');
                      if (data && data === "welcome") {
                        this.router.navigate(['/author/home'])

                      } else {
                        if (this.universityall.user_visit == 1) {
                          console.log("User VISIT", this.universityall.user_visit);
                          this.showSideBar = false;
                          this.router.navigate(['/welcome'])
                        } else {
                          if (this.currentActivatedRoute == '/') {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigate(['/author/home']);
                            // }
                          } else {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigateByUrl(this.currentActivatedRoute);
                            // }
                          }
                        }
                      }
                      break;
                    }
                    //End testing code for test admin 1

                    if (this.adminimage.applications[j].application_name == 'Admin/Author') {
                      this.currentApplicationName = this.adminimage.applications[j].application_name;
                      console.log("1-currentApplicationName", this.currentApplicationName)
                      this.availableModulesList = this.adminimage.applications[j].available_modules;
                      console.log("1-availableModulesList", this.availableModulesList)
                      let data = localStorage.getItem('dataSource');
                      if (data && data === "welcome") {
                        this.router.navigate(['/author/home'])

                      } else {
                        if (this.universityall.user_visit == 1) {
                          console.log("User VISIT", this.universityall.user_visit);
                          this.showSideBar = false;
                          this.router.navigate(['/welcome'])
                        } else {
                          if (this.currentActivatedRoute == '/') {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigate(['/author/home']);
                            // }
                          } else {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigateByUrl(this.currentActivatedRoute);
                            // }
                          }
                        }
                      }
                      break;
                    } else if (this.adminimage.applications[j].application_name == 'User Dashboard') {
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
                this.cookieService.set('_PAOID', this.universityall.available_organization[0].org_id);
                this.cookieService.set('_userID', this.universityall.profile_id);
                this.userOrgId = this.universityall.available_organization[0].org_id;
                this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[0].review_work_flow);
                this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[0].organization_img);
                this.currentOrgName = this.universityall.available_organization[0].organization_name;
                this.adminimage = this.universityall.available_organization[0];
                if (this.assignThemeValue == false) {
                  this.org_themes = this.universityall.available_organization[0].organization_theme;
                }
                this.GetItemService.getOrganisationRoles(this.universityall.available_organization[0].organization_roles);
                for (var j = 0; j < this.adminimage.applications.length; j++) {

                  //testing code for test admin 1
                  if (this.adminimage.applications[j].default == true) {
                    this.currentApplicationName = this.adminimage.applications[j].application_name;
                    this.cookieService.set('_APPNAME', this.currentApplicationName);
                    this.availableModulesList = this.adminimage.applications[j].available_modules;
                    console.log("1-availableModulesList", this.availableModulesList)
                    console.log("2-currentApplicationName TEST ADMIN", this.currentApplicationName)

                    let data = localStorage.getItem('dataSource');
                    if (data && data === "welcome") {
                      this.router.navigate(['/author/home'])

                    } else {
                      if (this.universityall.user_visit == 1) {
                        console.log("User VISIT", this.universityall.user_visit);
                        this.showSideBar = false;
                        this.router.navigate(['/welcome'])
                      } else {
                        if (this.currentActivatedRoute == '/') {
                          // if(this.universityall.user_visit != 1){
                          //   this.router.navigate(['author/home']);
                          // }else{
                          this.router.navigate(['/author/home']);
                          // }
                        } else {
                          // if(this.universityall.user_visit != 1){
                          //   this.router.navigate(['author/home']);
                          // }else{
                          this.router.navigateByUrl(this.currentActivatedRoute);
                          // }
                        }
                      }
                    }
                    break;
                  }
                  //End testing code for test admin 1

                  if (this.adminimage.applications[j].application_name == 'Admin/Author') {
                    this.currentApplicationName = this.adminimage.applications[j].application_name;
                    console.log("2-currentApplicationName", this.currentApplicationName)
                    this.availableModulesList = this.adminimage.applications[j].available_modules;
                    console.log("2-availableModulesList", this.availableModulesList)
                    let data = localStorage.getItem('dataSource');
                    if (data && data === "welcome") {
                      this.router.navigate(['/author/home'])

                    } else {
                      if (this.universityall.user_visit == 1) {
                        console.log("User VISIT", this.universityall.user_visit);
                        this.showSideBar = false;
                        this.router.navigate(['/welcome'])
                      } else {
                        if (this.currentActivatedRoute == '/') {
                          // if(this.universityall.user_visit != 1){
                          //   this.router.navigate(['author/home']);
                          // }else{
                          this.router.navigate(['/author/home']);
                          // }
                        } else {
                          // if(this.universityall.user_visit != 1){
                          //   this.router.navigate(['author/home']);
                          // }else{
                          this.router.navigateByUrl(this.currentActivatedRoute);
                          // }
                        }
                      }
                    }
                    break;
                  } else if (this.adminimage.applications[j].application_name == 'User Dashboard') {
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
              for (var i = 0; i < this.universityall.available_organization.length; i++) {
                var cookieORgId = this.cookieService.get('_PAOID');
                var cookieUserId = this.cookieService.get('_userID');
                if (cookieORgId == this.universityall.available_organization[i].org_id) {
                  this.cookieService.set('_PAOID', this.universityall.available_organization[i].org_id);
                  this.cookieService.set('_userID', this.universityall.profile_id);
                  this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[i].review_work_flow);
                  this.userOrgId = this.universityall.available_organization[i].org_id;
                  this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[i].organization_img);
                  this.currentOrgName = this.universityall.available_organization[i].organization_name;
                  this.adminimage = this.universityall.available_organization[i];
                  if (this.assignThemeValue == false) {
                    this.org_themes = this.universityall.available_organization[i].organization_theme;
                  }

                  this.GetItemService.getOrganisationRoles(this.universityall.available_organization[i].organization_roles);
                  for (var j = 0; j < this.adminimage.applications.length; j++) {

                    //testing code for test admin 1
                    if (this.adminimage.applications[j].default == true) {
                      this.currentApplicationName = this.adminimage.applications[j].application_name;
                      this.cookieService.set('_APPNAME', this.currentApplicationName);
                      this.availableModulesList = this.adminimage.applications[j].available_modules;
                      console.log("1-availableModulesList", this.availableModulesList)
                      console.log("3-currentApplicationName TEST ADMIN", this.currentApplicationName)

                      let data = localStorage.getItem('dataSource');
                      if (data && data === "welcome") {
                        this.router.navigate(['/author/home'])

                      } else {
                        if (this.universityall.user_visit == 1) {
                          console.log("User VISIT", this.universityall.user_visit);
                          this.showSideBar = false;
                          this.router.navigate(['/welcome'])
                        } else {
                          if (this.currentActivatedRoute == '/') {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigate(['/author/home']);
                            // }
                          } else {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigateByUrl(this.currentActivatedRoute);
                            // }
                          }
                        }
                      }
                      break;
                    }
                    //End testing code for test admin 1

                    if (this.adminimage.applications[j].application_name == 'Admin/Author') {
                      this.currentApplicationName = this.adminimage.applications[j].application_name;
                      console.log("3-currentApplicationName", this.currentApplicationName)
                      this.availableModulesList = this.adminimage.applications[j].available_modules;
                      console.log("3-availableModulesList", this.availableModulesList);
                      // let data = localStorage.getItem('dataSource');
                      let data = '';
                      if (data && data === "welcome") {
                        this.router.navigate(['/author/home'])

                      } else {
                        if (this.universityall.user_visit == 1) {
                          // console.log("User VISIT", this.universityall.user_visit);
                          // this.showSideBar = false;
                          // this.router.navigate(['/welcome'])
                        } else {
                          if (this.currentActivatedRoute == '/') {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigate(['/author/home']);
                            // }
                          } else {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigateByUrl(this.currentActivatedRoute);
                            // }
                          }
                        }
                      }
                      break;
                    } else if (this.adminimage.applications[j].application_name == 'User Dashboard') {
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
                for (var o = 0; o < this.universityall.available_organization.length; o++) {
                  if (this.universityall.available_organization[o].default == true) {
                    this.cookieService.set('_PAOID', this.universityall.available_organization[o].org_id);
                    this.cookieService.set('_userID', this.universityall.profile_id);
                    this.userOrgId = this.universityall.available_organization[o].org_id;
                    this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[o].review_work_flow);
                    this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[o].organization_img);
                    this.currentOrgName = this.universityall.available_organization[o].organization_name;
                    this.adminimage = this.universityall.available_organization[o];
                    if (this.assignThemeValue == false) {
                      this.org_themes = this.universityall.available_organization[o].organization_theme;
                    }
                    this.GetItemService.getOrganisationRoles(this.universityall.available_organization[o].organization_roles);
                    for (var j = 0; j < this.adminimage.applications.length; j++) {

                      //testing code for test admin 1
                      if (this.adminimage.applications[j].default == true) {
                        this.currentApplicationName = this.adminimage.applications[j].application_name;
                        this.cookieService.set('_APPNAME', this.currentApplicationName);
                        this.availableModulesList = this.adminimage.applications[j].available_modules;
                        console.log("1-availableModulesList", this.availableModulesList);
                        console.log("4-currentApplicationName TEST ADMIN", this.currentApplicationName)

                        let data = localStorage.getItem('dataSource');
                        if (data && data === "welcome") {
                          this.router.navigate(['/author/home'])

                        } else {
                          if (this.universityall.user_visit == 1) {
                            console.log("User VISIT", this.universityall.user_visit);
                            this.showSideBar = false;
                            this.router.navigate(['/welcome'])
                          } else {
                            if (this.currentActivatedRoute == '/') {
                              // if(this.universityall.user_visit != 1){
                              //   this.router.navigate(['author/home']);
                              // }else{
                              this.router.navigate(['/author/home']);
                              // }
                            } else {
                              // if(this.universityall.user_visit != 1){
                              //   this.router.navigate(['author/home']);
                              // }else{
                              this.router.navigateByUrl(this.currentActivatedRoute);
                              // }
                            }
                          }
                        }
                        break;
                      }
                      //End testing code for test admin 1

                      if (this.adminimage.applications[j].application_name == 'Admin/Author') {
                        this.currentApplicationName = this.adminimage.applications[j].application_name;
                        console.log("4-currentApplicationName", this.currentApplicationName)
                        this.availableModulesList = this.adminimage.applications[j].available_modules;
                        console.log("4-availableModulesList", this.availableModulesList)
                        let data = localStorage.getItem('dataSource');
                        if (data && data === "welcome") {
                          this.router.navigate(['/author/home'])

                        } else {
                          if (this.universityall.user_visit == 1) {
                            console.log("User VISIT", this.universityall.user_visit);
                            this.showSideBar = false;
                            this.router.navigate(['/welcome'])
                          } else {
                            if (this.currentActivatedRoute == '/') {
                              // if(this.universityall.user_visit != 1){
                              //   this.router.navigate(['author/home']);
                              // }else{
                              this.router.navigate(['/author/home']);
                              // }
                            } else {
                              // if(this.universityall.user_visit != 1){
                              //   this.router.navigate(['author/home']);
                              // }else{
                              this.router.navigateByUrl(this.currentActivatedRoute);
                              // }
                            }
                          }
                        }
                        break;
                      } else if (this.adminimage.applications[j].application_name == 'User Dashboard') {
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
                  this.cookieService.set('_PAOID', this.universityall.available_organization[0].org_id);
                  this.cookieService.set('_userID', this.universityall.profile_id);
                  this.userOrgId = this.universityall.available_organization[0].org_id;
                  this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[0].review_work_flow);
                  this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[0].organization_img);
                  this.currentOrgName = this.universityall.available_organization[0].organization_name;
                  this.adminimage = this.universityall.available_organization[0];
                  if (this.assignThemeValue == false) {
                    this.org_themes = this.universityall.available_organization[0].organization_theme;
                  }
                  this.GetItemService.getOrganisationRoles(this.universityall.available_organization[0].organization_roles);
                  for (var j = 0; j < this.adminimage.applications.length; j++) {

                    //testing code for test admin 1
                    if (this.adminimage.applications[j].default == true) {
                      this.currentApplicationName = this.adminimage.applications[j].application_name;
                      this.cookieService.set('_APPNAME', this.currentApplicationName);
                      this.availableModulesList = this.adminimage.applications[j].available_modules;
                      console.log("1-availableModulesList", this.availableModulesList)
                      console.log("5-currentApplicationName TEST ADMIN", this.currentApplicationName)

                      let data = localStorage.getItem('dataSource');
                      if (data && data === "welcome") {
                        this.router.navigate(['/author/home'])

                      } else {
                        if (this.universityall.user_visit == 1) {
                          console.log("User VISIT", this.universityall.user_visit);
                          this.showSideBar = false;
                          this.router.navigate(['/welcome'])
                        } else {
                          if (this.currentActivatedRoute == '/') {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigate(['/author/home']);
                            // }
                          } else {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigateByUrl(this.currentActivatedRoute);
                            // }
                          }
                        }
                      }
                      break;
                    }
                    //End testing code for test admin 1

                    if (this.adminimage.applications[j].application_name == 'Admin/Author') {
                      this.currentApplicationName = this.adminimage.applications[j].application_name;
                      console.log("5-currentApplicationName", this.currentApplicationName)
                      this.availableModulesList = this.adminimage.applications[j].available_modules;
                      console.log("5-availableModulesList", this.availableModulesList)
                      let data = localStorage.getItem('dataSource');
                      if (data && data === "welcome") {
                        this.router.navigate(['/author/home'])

                      } else {
                        if (this.universityall.user_visit == 1) {
                          console.log("User VISIT", this.universityall.user_visit);
                          this.showSideBar = false;
                          this.router.navigate(['/welcome'])
                        } else {
                          if (this.currentActivatedRoute == '/') {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigate(['/author/home']);
                            // }
                          } else {
                            // if(this.universityall.user_visit != 1){
                            //   this.router.navigate(['author/home']);
                            // }else{
                            this.router.navigateByUrl(this.currentActivatedRoute);
                            // }
                          }
                        }
                      }
                      break;
                    } else if (this.adminimage.applications[j].application_name == 'User Dashboard') {
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
          error => {
            this.fullpageload = false;

            if (error.status == 404) {
              this.router.navigateByUrl('/pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }
          },

        );
    }
  }

  onMouseOver(image, index, name) {


    var baseimage = this.adminimage;

    var hover = baseimage.applications.filter(data => data.application_image == image)

    for (var i = 0; i < hover.length; i++) {
      if (hover[i].application_name == 'User Dashboard') {
        this.normalImage = image;
        this.adminimage.applications[index].application_image = hover[i].application_hover_image;
        this.adminimage.applications[index].application_hover_image = hover[i].application_hover_image;
      }
    }

  }

  onMouseOut(image, index, name) {

    var baseimage = this.adminimage;

    var hover = baseimage.applications.filter(data => data.application_image == image)

    for (var i = 0; i < hover.length; i++) {
      if (hover[i].application_name == 'User Dashboard') {
        this.adminimage.applications[index].application_name = 'User Dashboard';
        this.adminimage.applications[index].application_image = this.normalImage;
        this.adminimage.applications[index].application_hover_image = hover[i].application_hover_image;
      }
    }

  }


  admin_redirect(admin_name) {
    if (admin_name == 'Author') {
      this.router.navigate(['/home']);
      // window.open('http://192.168.1.8:4200/#/author/dashboard', '_blank')
      // window.open('http://www.google.com');
    }
    if (admin_name == 'Tenant Admin') {
      // window.open('http://www.google.com','_blank');
      // this.router.navigate(['/testadmin/dashboard'])
    }
    // if(admin_name == 'author_admin'){
    //   this.router.navigate(['/author/dashboard'])
    // }
    // if(admin_name == 'test_admin'){
    //   this.router.navigate(['/testadmin/dashboard'])
    // }
    if (admin_name == 'User Dashboard') {
      window.open(credentials.userDashboardUrl, '_blank');
      // window.open('http://user.scora.in','_blank');
    }

  }


  RedirectSourceFile() {
    window.open('http://www.source.scora.in/', '_blank');
  }

  logout() {
    this.fullpageload = true;
    var headers = new Headers();

    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host + '/logout', { headers: headers }).map(res => res.json()).catch((error: any) => { return Observable.throw(error) }).subscribe(
      data => {

        this.fullpageload = false;

        if (data.success == true) {
          localStorage.removeItem('dataSource');
          this.cookieService.deleteAll('/', '.scora.io');
          this.cookieService.deleteAll('/', 'scora.io');

          window.location.href = credentials.accountUrl;
          // window.location.href='http://accounts.scora.in';
        }
        this.cookieService.deleteAll('/', '.scora.io');
        this.cookieService.deleteAll('/', 'scora.io');
        window.location.href = credentials.accountUrl;
      },
      error => {
        this.fullpageload = false;

        if (error.status == 404) {
          this.router.navigateByUrl('pages/NotFound');
        }
        else if (error.status == 401) {
          this.cookieService.deleteAll();
          window.location.href = credentials.accountUrl;
          // window.location.href='http://accounts.scora.in';
        }
        else {
          //this.router.navigateByUrl('pages/serverError');
          this.cookieService.deleteAll('/', '.scora.io');
          this.cookieService.deleteAll('/', 'scora.io');
          window.location.href = credentials.accountUrl;
        }
      },

    );
  }

  nextOrganisation(orgId) {
    this.cookieService.set('_PAOID', orgId);
    this.userOrgId = orgId;

    for (var i = 0; i < this.universityall.available_organization.length; i++) {
      if (this.universityall.available_organization[i].org_id == orgId) {
        this.adminimage = this.universityall.available_organization[i];
        if (this.assignThemeValue == false) {
          this.org_themes = this.universityall.available_organization[i].organization_theme;
        }
        this.tenantLogo = this.sanitizer.bypassSecurityTrustUrl(this.universityall.available_organization[i].organization_img);
        this.currentOrgName = this.universityall.available_organization[i].organization_name;
        this.GetItemService.getReviewWrkFlwFlag(this.universityall.available_organization[i].review_work_flow);
        this.GetItemService.getOrganisationRoles(this.universityall.available_organization[i].organization_roles);
        for (var j = 0; j < this.adminimage.applications.length; j++) {
          if (this.adminimage.applications[j].application_name == 'Admin/Author') {
            this.currentApplicationName = this.adminimage.applications[j].application_name;
            console.log("7-currentApplicationName", this.currentApplicationName)
            this.availableModulesList = this.adminimage.applications[j].available_modules;
            console.log("7-availableModulesList", this.availableModulesList)
            this.router.navigateByUrl('/home');
            // window.location.reload();
            break;
          } else if (this.adminimage.applications[j].application_name == 'User Dashboard') {
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


  }


  showUpload() {
    this.uploadProfile = true;
  }

  removeUpload() {
    this.uploadProfile = false;
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }


  fileChange(event) {

    if (this.authService.canActivate()) {
      this.profileLoader = true;
      let fileList: FileList = event.target.files;

      if (fileList[0].type == "image/jpeg" || fileList[0].type == "image/jpg" || fileList[0].type == "image/png") {
        if (fileList[0].size < 3145728) {
          if (fileList.length > 0) {
            let file: File = fileList[0];

            let body = new FormData();
            body.append('file', file, file.name);
            body.append('org_id', this.cookieService.get('_PAOID'));

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
            this.http.post(credentials.host + '/update_profile', body, { headers: headers })
              .map(res => res.json())
              .catch(error => Observable.throw(error))

              .subscribe(
                data => {
                  if (data.success == true) {

                    this.profileLoader = false;
                    this.universityall.profile_picture = this.sanitizer.bypassSecurityTrustUrl(data.path);
                  } else {
                    this.profileLoader = false;
                  }
                },
                error => {
                  this.profileLoader = false;

                  if (error.status == 404) {
                    this.router.navigateByUrl('pages/NotFound');
                  }
                  else if (error.status == 401) {
                    this.cookieService.deleteAll();
                    window.location.href = credentials.accountUrl;
                    // window.location.href='http://accounts.scora.in';
                  }
                  else {
                    this.router.navigateByUrl('pages/serverError');
                  }
                },
              )
          }
        } else {
          this.profileLoader = false;
          // alert("This File Size Exceeds the Maximum Limit of 3MB");
          this.alerts.push({
            type: 'danger',
            msg: "This File Size Exceeds the Maximum Limit of 3MB",
            timeout: 4000
          });
        }
      } else {
        this.profileLoader = false;
        // alert("Invalid extension for file "+fileList[0].name+". Only .jpg ,.jpeg and .png files are supported.");
        this.alerts.push({
          type: 'danger',
          msg: "Invalid extension for file " + fileList[0].name + ". Only .jpg ,.jpeg and .png files are supported.",
          timeout: 4000
        });


      }

    }
  }


  sideNavDisplayAjax() {
    this.GetItemService.sidenavVsComments(this.sidenavVsCommentsToggle);
    setTimeout(() => {
      this.sideNavDisplayAjax();
    }, 300);
  }

  changeToggleEvent() {
    this.sidenavVsCommentsToggle = !this.sidenavVsCommentsToggle;
  }

}
