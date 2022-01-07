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
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService } from 'angular2-notifications';
import { Injector } from '@angular/core';
import { AuthorNavbarComponent } from '../author-navbar/author-navbar.component';
import { GetItemService } from '../../get-item.service';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { PagerService } from '../../_services/index';
import * as _ from 'underscore';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-user-group',
  templateUrl: './view-user-group.component.html',
  styleUrls: ['./view-user-group.component.scss']
})
export class ViewUserGroupComponent implements OnInit {
  addedUsersCount: any;
  saveMsg: boolean;
  searchUsers: string;
  userNameLists: any[];
  usersId :any[] = [];
  finalUsers : any[]=[];
  disableDelete: boolean = false;
  constructor( private http: Http,
    private router: Router,
    public route: ActivatedRoute,
    private cookieService: CookieService,
    private authService: AuthServiceService,
    private modalService: BsModalService,
    private _notifications: NotificationsService,
    private injector: Injector,
    public GetItemService: GetItemService,
    private pagerService: PagerService,
    private _location: Location
    ) { 
    }

    public Group_Name;
    public Group_Id;
    public showload = true;
    public IndividualGroupUsers;
    public userListTable;
    public grp_name;
    public allUsersList;
    public showAddFieldValue;





  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.Group_Id = id;
    this.grp_name = this.route.snapshot.paramMap.get('grp_name');
    this.getGroupUsersList(id);
    this.selectAllUsers('');
  }

  // get users list of each group
  getGroupUsersList(group_Id) {
    this.Group_Id = group_Id;
    // this.Group_Name = group_Name;
    this.showload = true;
    // var body = this.createGroup;
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
          this.allItems =this.IndividualGroupUsers;
          this.setPage(1);
          this.addedUsersCount = this.IndividualGroupUsers.length;
          this.userListTable = true;
          console.log('users',data)
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
  getUserId(user){
   if(user){
    this.usersId.push(user);
   }
  }

  selectAllUsers(IndividualGroupUsers){
    
    let that = this
    $('#selectAll').click(function(e){
      var table= $(e.target).closest('table');
      $('td input:checkbox',table).prop('checked',this.checked);
      if ($('.abc:checked').length == $('.abc').length) {
        //do something
        // let users = arr.map((x)=>{return x.user_id})
        if(IndividualGroupUsers.length > 0){
        let users = IndividualGroupUsers.map((x)=>{return x.user_id});
        users.map((v)=>{
          if(that.finalUsers.indexOf(v)== -1){
            that.finalUsers.push(v)
          }
        });
        }
     }else{
      that.finalUsers = []
     }
    console.log("finalUsersSelectAll",that.finalUsers)
    if(that.finalUsers && that.finalUsers.length > 0){
      this.disableDelete = true;
    }else{
      this.disableDelete = false;
    }
    console.log(this.disableDelete)
    });
  }

  getFinalUsers(value){
    if(this.finalUsers.indexOf(value)== -1){
      this.finalUsers.push(value);
    }else{
      let idx = this.finalUsers.indexOf(value);
      this.finalUsers.splice(idx,1);
    }
    console.log("finalUsers",this.finalUsers)
    if(this.finalUsers && this.finalUsers.length > 0){
      this.disableDelete = true;
    }else{
      this.disableDelete = false;
    }
    console.log(this.disableDelete)
  }
 
//delete multiple users
deleteSelected(){
  let selectedUsers = this.finalUsers.map(Number);
  console.log("MK::::",selectedUsers);
  this.showload = true;
  var body = {};
  body['group_id'] = this.Group_Id;
  body['org_id'] = parseInt(this.cookieService.get('_PAOID'));
  body['users'] = selectedUsers
  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
  let options = new RequestOptions({
    headers : headers,
    body:body
  })
  return this.http.delete(credentials.host +"/remove_group_users",options)
  .map(res => res.json())
  .catch((e: any) =>{
    return Observable.throw(e)
  } )

  .subscribe(
        data => {
        if(data.success == true){
          this.finalUsers = [];
          this.showload = false;
          $("#selectAll").prop('checked', false);
          // this.showMsg = data.message;
          // this.saveMsg = true;
          this._notifications.info(data.message, '');
          $('#multi-delete-succ').modal('show');
          setTimeout(()=>{
            this.getGroupUsersList(this.Group_Id);
            this.saveMsg = false;
           this.searchUsers = '';
           this.userNameLists = [];
            },3000);

        }else{
          $('#multi-delete-succ').modal('hide');
          this.showload = false;
        //   this.showMsg = data.message;
        // this.saveMsg = true;
        this._notifications.create(data.message,'');
        setTimeout(()=>{
          this.saveMsg = false;

          },3000);
        }
        },
        error => {
          $('#multi-delete-succ').modal('hide');
          this.showload= false;
          if(error.status == 404){
            this.router.navigateByUrl('pages/NotFound');
          }
          else if(error.status == 401){
            this.cookieService.deleteAll();
             window.location.href=credentials.accountUrl;
            // window.location.href=credentials.accountUrl;
          }
          else{
            this.router.navigateByUrl('pages/serverError');
          }

        }
  );
}

   // delete user function
   deleteUserPopup(){
    this.showload = true;
    var body = {};
    body['group_id'] = this.Group_Id;
    body['org_id'] = parseInt(this.cookieService.get('_PAOID'));
    body['users'] = this.usersId
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    let options = new RequestOptions({
      headers : headers,
      body:body
    })
    return this.http.delete(credentials.host +"/remove_group_users",options)
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
          data => {
          if(data.success == true){
            $('#delete').modal('hide');
            this.showload = false;
            // this.showMsg = data.message;
            // this.saveMsg = true;
            console.log("sachin")
            this._notifications.info(data.message, '');
            console.log("sachin")
            setTimeout(()=>{
              this.getGroupUsersList(this.Group_Id);
              this.saveMsg = false;
             this.searchUsers = '';
             this.userNameLists = [];
              },3000);

          }else{
            $('#delete').modal('hide');
            this.showload = false;
          //   this.showMsg = data.message;
          // this.saveMsg = true;
          this._notifications.create(data.message,'');
          setTimeout(()=>{
            this.saveMsg = false;

            },3000);
          }
          },
          error => {
            $('#delete').modal('hide');
            this.showload= false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
               window.location.href=credentials.accountUrl;
              // window.location.href=credentials.accountUrl;
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
    );

  }

  notDeleteUserPopup(){
    $('#delete').modal('hide');
    this.usersId = [];
  }
  closeSucessDelete(){
    $('#multi-delete-succ').modal('hide');
  }
  backClicked() {
    this._location.back();
  }
  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
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

}
