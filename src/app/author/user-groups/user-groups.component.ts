import { Component, OnInit,TemplateRef,Output,EventEmitter } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {IMyDrpOptions} from 'mydaterangepicker';
import { TagInputModule } from 'ngx-chips';
import { trigger, state, style, animate, transition } from '@angular/animations';
import{credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { LoaderComponent } from '../../loader/loader.component';
import { createGroup } from './createGroup';
import { userSuggestion } from './user-suggesstion';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService } from 'angular2-notifications';
import { Injector } from '@angular/core';
import { AuthorNavbarComponent } from '../author-navbar/author-navbar.component';
import { GetItemService } from '../../get-item.service';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { PagerService } from '../../_services/index';
import * as _ from 'underscore';


@Component({
  selector: "app-user-groups",
  templateUrl: "./user-groups.component.html",
  styleUrls: ["./user-groups.component.scss"],
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
export class UserGroupsComponent implements OnInit {
  currentPage=1;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  grpDescLimit: boolean;
  constructor(
    private http: Http,
    private router: Router,
    public route: ActivatedRoute,
    private cookieService: CookieService,
    private authService: AuthServiceService,
    private modalService: BsModalService,
    private _notifications: NotificationsService,
    private injector: Injector,
    public GetItemService: GetItemService,
    private pagerService: PagerService,
  ) {
    this.createGroup = new createGroup();
    this.userSuggestion = new userSuggestion();
  }

  public showload = true;
  public userGroupList;
  public IndividualGroupUsers;
  public createGroup: createGroup;
  public userSuggestion: userSuggestion;
  public createGroupPopup;
  public showMsg;
  public saveMsg;
  public addUSerPopup = false;
  public userListTable;
  public grpName = false;
  public grpDesc = false;
  public Group_Name;
  public Group_Id;
  public userNameLists = [];
  public selected = [];
  public query;
  public filteredList;
  public searchUsers;
  public addUsersErr;
  public deleteUSerPopup;
  public userErrMsg;
  public planExpires;
  public alerts: any[] = [];
  public showBulkUploadDiv = false;

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

  ngOnInit() {
    this.getUserGroupsList();

    // this.planExpires = this.GetItemService.sendPlanExpireKEy();
    // if(this.planExpires == undefined){
    //   this.planExpires = localStorage.getItem('hideButton');
    //   if(this.planExpires == 'false'){
    //     this.planExpires = false;
    //   }else if(this.planExpires == 'true'){
    //     this.planExpires = true;
    //   }
    //
    // }
  }

  // getuserlist function
  getUserGroupsList() {
    if (this.authService.canActivate()) {
      this.showload = true;
      var headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http
        .get(
          credentials.host + "/groups_list/" + this.cookieService.get("_PAOID"),
          { headers: headers }
        )
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          (data) => {
            this.showload = false;
            this.userGroupList = data;
            this.allItems =this.userGroupList;
             this.setPage(1);
          },
          (error) => {
            this.showload = false;
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href=credentials.accountUrl;
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    }
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.currentPage=page;
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  // array of all items to be paged
  private allItems: any[];

  // creategroup function
  createUserGroup() {
    const pattern1 = /^[^\s].*/;
    this.grpName = false;
    this.grpDesc = false;
    this.grpDescLimit =false
    if (
      this.createGroup.group_name == "" ||
      !pattern1.test(this.createGroup.group_name)
    ) {
      this.grpName = true;
    }
    if (
      this.createGroup.group_description == "" ||
      !pattern1.test(this.createGroup.group_description)
    ) {
      this.grpDesc = true;
    }
    if(this.createGroup.group_description.length > 100){
      this.grpDescLimit = true;
    }
    if (this.grpName == false && this.grpDesc == false && this.grpDescLimit ==false) {
      this.showload = true;
      this.createGroup.org_id = parseInt(this.cookieService.get("_PAOID"));
      var body = this.createGroup;
      var headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      return this.http
        .post(credentials.host + "/create_groups", body, { headers: headers })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          (data) => {
            if (data.success == true) {
              $('#newuser').modal('hide');
              this.showload = false;
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create("", data.message, "info");
              setTimeout(() => {
                this.getUserGroupsList();
                this.saveMsg = false;
                this.createGroup.group_name = "";
                this.createGroup.group_description = "";
              }, 3000);
            } else {
              // this.modalRef.hide();
              // this.editParams = false;
              this.showload = false;
              //   this.showMsg = data.message;
              // this.saveMsg = true;
              this.userErrMsg = data.message;
              // this._notifications.create('',data.message, 'error');
              setTimeout(() => {
                this.saveMsg = false;
                this.userErrMsg = "";
              }, 3000);
            }
          },
          (error) => {
            // this.modalRef.hide();
            $('#newuser').modal('hide');
            this.showload = false;
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href=credentials.accountUrl;
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    }
  }

  // function to close create group popup

  cancelTestGroup() {
    // this.modalRef.hide();
    $('#newuser').modal('hide');
    this.createGroup.group_name = "";
    this.createGroup.group_description = "";
    this.grpName = false;
    this.grpDesc = false;
  }

  // close bootstrap alert
  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter((alert) => alert !== dismissedAlert);
  }

  // get users list of each group
  getGroupUsersList(group_Id, group_Name) {
    this.Group_Id = group_Id;
    this.Group_Name = group_Name;
    this.showload = true;
    var body = this.createGroup;
    var headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    this.http
      .get(
        credentials.host +
          "/group_users/" +
          this.cookieService.get("_PAOID") +
          "/" +
          this.Group_Id,
        { headers: headers }
      )
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })

      .subscribe(
        (data) => {
          this.showload = false;
          this.IndividualGroupUsers = data;
          this.userListTable = true;
        },
        (error) => {
          this.showload = false;
          if (error.status == 404) {
            this.router.navigateByUrl("pages/NotFound");
          } else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href=credentials.accountUrl;
          } else {
            this.router.navigateByUrl("pages/serverError");
          }
        }
      );
  }

  // user name suggesstion ajax call

  userNameSuggesstion(search_data) {
    const pattern1 = /^[^\s].*/;
    if (search_data != "" && pattern1.test(search_data)) {
      delete this.userSuggestion.users;
      this.userSuggestion.org_id = parseInt(this.cookieService.get("_PAOID"));
      this.userSuggestion.group_id = this.Group_Id;
      this.userSuggestion.search_data = search_data;
      var body = this.userSuggestion;
      var headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      return this.http
        .post(credentials.host + "/users_suggestions", body, {
          headers: headers,
        })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          (data) => {
            this.userNameLists = data;
          },
          (error) => {
            this.showload = false;
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href=credentials.accountUrl;
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    } else {
      this.userNameLists = [];
    }
  }

  // clicked name from suggestion

  select(item) {
    if (!this.selected.includes(item)) {
      this.selected.push(item);
    }
    this.query = "";
    this.userNameLists = [];
    this.searchUsers = "";
  }

  // remove user name from array
  remove(item) {
    this.selected.splice(this.selected.indexOf(item), 1);
  }

  // add user to the group
  addUsersGroup() {
    this.addUsersErr = false;
    if (this.selected.length != 0) {
      this.userSuggestion.org_id = parseInt(this.cookieService.get("_PAOID"));
      this.userSuggestion.group_id = this.Group_Id;
      this.userSuggestion.users = this.selected;
      delete this.userSuggestion.search_data;
      this.showload = true;

      var body = this.userSuggestion;
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      return this.http
        .post(credentials.host + "/usersmap_groups", body, { headers: headers })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          (data) => {
            if (data.success == true) {
              this.modalRef.hide();
              this.showload = false;
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create("", data.message, "info");
              setTimeout(() => {
                this.selected = [];
                this.getGroupUsersList(this.Group_Id, this.Group_Name);
                this.saveMsg = false;
                this.searchUsers = "";
              }, 3000);
            } else {
              // this.modalRef.hide();
              this.showload = false;
              //   this.showMsg = data.message;
              // this.saveMsg = true;
              this.userErrMsg = data.message;
              // this._notifications.create('',data.message, 'error');
              setTimeout(() => {
                this.saveMsg = false;
                this.userErrMsg = "";
              }, 3000);
            }
          },
          (error) => {
            this.modalRef.hide();
            this.showload = false;
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href=credentials.accountUrl;
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    } else {
      this.addUsersErr = true;
      setTimeout(() => {
        this.addUsersErr = false;
      }, 3000);
    }
  }

  // delete user open popup
  deleteUser(userID, template: TemplateRef<any>) {
    // if(this.planExpires == false){
    this.userSuggestion.users = [];
    this.userSuggestion.users.push(userID);
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: " modal-sm" }, this.config)
    );
    // }
  }

  // delete user function
  deleteUserPopup() {
    this.userSuggestion.org_id = parseInt(this.cookieService.get("_PAOID"));
    this.userSuggestion.group_id = this.Group_Id;

    this.showload = true;
    var body = this.userSuggestion;
    var headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    let options = new RequestOptions({
      headers: headers,
      body: body,
    });
    return this.http
      .delete(credentials.host + "/remove_group_users", options)
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })

      .subscribe(
        (data) => {
          if (data.success == true) {
            this.modalRef.hide();
            this.showload = false;
            // this.showMsg = data.message;
            // this.saveMsg = true;
            this._notifications.create("", data.message, "info");
            setTimeout(() => {
              this.IndividualGroupUsers = data.users;
              this.saveMsg = false;
              this.searchUsers = "";
              this.userNameLists = [];
            }, 3000);
          } else {
            this.modalRef.hide();
            this.showload = false;
            //   this.showMsg = data.message;
            // this.saveMsg = true;
            this._notifications.create("", data.message, "error");
            setTimeout(() => {
              this.saveMsg = false;
            }, 3000);
          }
        },
        (error) => {
          this.modalRef.hide();
          this.showload = false;
          if (error.status == 404) {
            this.router.navigateByUrl("pages/NotFound");
          } else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href=credentials.accountUrl;
          } else {
            this.router.navigateByUrl("pages/serverError");
          }
        }
      );
  }

  // cancel function for add user popup
  cancelAddUser() {
    this.modalRef.hide();
    this.searchUsers = "";
    this.selected = [];
    this.userNameLists = [];
  }

  // modal popup
  openModal(template: TemplateRef<any>) {
    // if(this.planExpires == false){
    this.modalRef = this.modalService.show(template, this.config);
    // }else if(this.planExpires == true){
    //   this.alerts.push({
    //     type: 'danger',
    //     msg: "Looks like your plan is expired.. Please contact your Super Admin",
    //     timeout:4000
    //   });
    // }
  }

  AddUserPopup(template: TemplateRef<any>) {
    // if(this.planExpires == false){
    this.modalRef = this.modalService.show(template, this.config);
    // }else if(this.planExpires == true){
    //   this.alerts.push({
    //     type: 'danger',
    //     msg: "Looks like your plan is expired.. Please contact your Super Admin",
    //     timeout:4000
    //   });
    // }
  }
}
