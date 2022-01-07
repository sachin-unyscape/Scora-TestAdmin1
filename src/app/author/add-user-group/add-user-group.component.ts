import { Component, OnInit,TemplateRef,Output,EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';
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
  selector: 'app-add-user-group',
  templateUrl: './add-user-group.component.html',
  styleUrls: ['./add-user-group.component.scss']
})
export class AddUserGroupComponent implements OnInit {
  currentPage=1;
  originalList:any=[];
  addedUsersCount: any;
  addUsersErr: boolean;
  clikedData: any;
  selectedLable: any;
  separateName: { IsCheck: any; };
  selectedEmail: any;
  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;

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
      this.getFilterLables();
      
    }

    public Group_Name;
    public Group_Id;
    public showload = true;
    public IndividualGroupUsers;
    public userListTable;
    public grp_name;
    public allUsersList;
    public allFilterUsersList: any[]=[];
    public showAddFieldValue;
    finalUsers : any[]=[];
    finalFiltersEmail: any[]=[];
    finalFiltersRole: any[]=[];
    finalFiltersPhone: any[]=[];
    finalFiltersName: any[]=[];
    LablesData:any=[]=[];
    isChecked:any;





  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.Group_Id = id;
    this.grp_name = this.route.snapshot.paramMap.get('grp_name');
    this.getGroupUsersList(id);
    this.getTenantAllUsers();
    this.selectAllUsers('');
    this.getFilterLables();
    
  }
 // pager object
 pager: any = {};
 // paged items
 pagedItems: any[];
 // array of all items to be paged
 allItems: any[];
 
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
    this.originalList=this.pagedItems;
    console.log(this.pagedItems)
  }
 
  filterUsers(val:string){
    this.pagedItems=this.originalList.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
  }


 // get list for filters
 getFilterLables() {
  this.showload = true;
  var headers = new Headers();
  headers.append(
    "Authorization",
    "Bearer " + this.cookieService.get("_PTBA")
  );
  this.http
    .get(
      credentials.host +
        "/filter_field/" +
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
        this.LablesData = data;
        this.clikedData = this.LablesData[0];
        this.selectedLable = this.clikedData.label;
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

getLableData(item){
  this.clikedData = item;
  this.selectedLable = this.clikedData.label;
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
          this.addedUsersCount = this.IndividualGroupUsers.length;
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
  
  closeFilterModal(){
    $('#fillter').modal('hide');
    this.finalFiltersEmail = [];
    this.finalFiltersRole = [];
    this.finalFiltersName = [];
    this.finalFiltersPhone = [];
  }

  clearFilter(){
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
    this.finalFiltersEmail = [];
    this.finalFiltersRole = [];
    this.finalFiltersName = [];
    this.finalFiltersPhone = [];
  }
 
  getFinalFilters(value){
    if(this.selectedLable == "Email"){
      if(this.finalFiltersEmail.indexOf(value)== -1){
        this.finalFiltersEmail.push(value);
      }else{
        let idx = this.finalFiltersEmail.indexOf(value);
        this.finalFiltersEmail.splice(idx,1);
      }
      console.log("finalFiltersEmail",this.finalFiltersEmail);
    }else if(this.selectedLable == "Role"){
      if(this.finalFiltersRole.indexOf(value)== -1){
        this.finalFiltersRole.push(value);
      }else{
        let idx = this.finalFiltersRole.indexOf(value);
        this.finalFiltersRole.splice(idx,1);
      }
      console.log("finalFiltersRole",this.finalFiltersRole);
    }else if(this.selectedLable == "Phone Number"){
      if(this.finalFiltersPhone.indexOf(value)== -1){
        this.finalFiltersPhone.push(value);
      }else{
        let idx = this.finalFiltersPhone.indexOf(value);
        this.finalFiltersPhone.splice(idx,1);
      }
      console.log("finalFiltersPhone",this.finalFiltersPhone)
    }else if(this.selectedLable == "Name"){
      if(this.finalFiltersName.indexOf(value)== -1){
        this.finalFiltersName.push(value);
      }else{
        let idx = this.finalFiltersName.indexOf(value);
        this.finalFiltersName.splice(idx,1);
      }
      console.log("finalFiltersName",this.finalFiltersName)
    }

  }
  toggleCheckBox(elementId){
    // alert(elementId)
    console.log(elementId)
    return (this.finalFiltersEmail.indexOf(elementId) != -1) ? true : false;
 }

  ApplyFilter(){
      this.showload = true;
      var body = {};
      var headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      this.finalFiltersEmail.forEach((e) => {
        delete e.length;
      });
      this.finalFiltersRole.forEach((e) => {
        delete e.length;
        delete e.user_role_id;
      });
      this.finalFiltersPhone.forEach((e) => {
        delete e.length;
      });
      this.finalFiltersName.forEach((e) => {
        delete e.length;
      });
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      body['search_data'] ='',
      body['filters'] = {
        "Email": this.finalFiltersEmail == null || this.finalFiltersEmail.length == 0 ? [] : this.finalFiltersEmail,
        "Role": this.finalFiltersRole == null || this.finalFiltersRole.length == 0 ? [] : this.finalFiltersRole,
        "Phone": this.finalFiltersPhone == null || this.finalFiltersPhone.length == 0 ? [] : this.finalFiltersPhone,
        "Name": this.finalFiltersName == null || this.finalFiltersName.length == 0 ? [] : this.finalFiltersName,
        "attribute1": [],
        "attribute2": [],
        "attribute3": [],
        "attribute4": [],
        "attribute5": [],
        "attribute6": []
      },
      body['orgId'] = parseInt(this.cookieService.get("_PAOID"));
      body['groupId'] = parseInt(this.Group_Id);
      console.log(body)
      return this.http
        .post(credentials.host + "/group_non_group_users", body, { headers: headers })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })
  
      .subscribe(
        (data) => {
         $('#fillter').modal('hide');
          this.allFilterUsersList = data;
          this.allItems =this.allFilterUsersList;
          console.log(this.allItems);
          this.setPage(1);
          setTimeout(() => {
            this.finalFiltersEmail = [];
            this.finalFiltersRole = [];
            this.finalFiltersName = [];
            this.finalFiltersPhone = [];
            this.getFilterLables();
            this.showload = false; 
          }, 300);
          },
          error => {
  
            this.showload= false;
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
  
          }
      );
  }

 
  //get all users of tentant admin
  getTenantAllUsers(){
    this.showload = true;
    var body = {};
    var headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    body['search_data'] ='',
    body['filters'] = {
      "Email": [],
      "Role": [],
      "Phone": [],
      "Name": [],
      "attribute1": [],
      "attribute2": [],
      "attribute3": [],
      "attribute4": [],
      "attribute5": [],
      "attribute6": []
    },
    body['orgId'] = parseInt(this.cookieService.get("_PAOID"));
    body['groupId'] = parseInt(this.Group_Id);
    console.log(body)
    return this.http
      .post(credentials.host + "/group_non_group_users", body, { headers: headers })
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })

    .subscribe(
      (data) => {
       $('#fillter').modal('hide');
        this.showload = false;
        this.allUsersList = data;
        this.allItems =this.allUsersList;
        this.setPage(1);
        // this.showAddFieldValue = false;
        },
        error => {

          this.showload= false;
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

        }
    );
  }
  backClicked() {
    this._location.back();
  }

  getFinalUsers(value){
    if(this.finalUsers.indexOf(value)== -1){
      this.finalUsers.push(value);
    }else{
      let idx = this.finalUsers.indexOf(value);
      this.finalUsers.splice(idx,1);
    }
    console.log("finalUsers",this.finalUsers)
  }

  selectAllUsers(allUsersList){
    let that = this
    $('#selectAll').click(function(e){
      var table= $(e.target).closest('table');
      $('td input:checkbox',table).prop('checked',this.checked);
      if ($('.abc:checked').length == $('.abc').length) {
        //do something
        // let users = arr.map((x)=>{return x.user_id})
        if(allUsersList.length > 0){
        allUsersList.map((x)=>{
          that.finalUsers.push(x)
        });
        // users.map((v)=>{
        //   if(that.finalUsers.indexOf(v)== -1){
        //     that.finalUsers.push(v)
        //   }
        // });
        }
     }else{
      that.finalUsers = []
     }
    console.log("finalUsersSelectAll",that.finalUsers)
    });
  }

  addSelected(){
    this.showload = true;
    let users = [];
    this.finalUsers.map((v)=>{
      let userData  = `${v.username}(${v.user_email})`
      console.log("<>>>>>>>>>>>>>>>>",userData);
      users.push(userData);
    })
    console.log("MMMM:_",users)
    this.addUsersErr = false;
    let body = {};
    body["org_id"] = parseInt(this.cookieService.get('_PAOID'));
    body["group_id"] = parseInt(this.Group_Id);
    body["users"] = users;
    this.showload = true;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host +"/usersmap_groups", body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
            data => {
            if(data.success == true){
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info');
              setTimeout(()=>{
              this.getTenantAllUsers();
              this.getGroupUsersList(this.Group_Id);
              this.finalUsers = []
              $("#selectAll").prop('checked', false);
             },3000);
              this.showload = false;
            }else{
              // this.modalRef.hide();
              this.showload = false;
            //   this.showMsg = data.message;
            // this.saveMsg = true;
            // this.userErrMsg = data.message;
            // this._notifications.create('',data.message, 'error');
            // setTimeout(()=>{
            //   this.saveMsg = false;
            //   this.userErrMsg = '';

            //   },3000);
            }
            },
            error => {
              // this.modalRef.hide();
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

   // add user to the group
   addUsersGroup(name,email){
    this.showload = true;
    let userData  = `${name}(${email})`
    console.log(userData)
    let users = [];
    users.push(userData);
    this.addUsersErr = false;
    let body = {};
    body["org_id"] = parseInt(this.cookieService.get('_PAOID'));
    body["group_id"] = parseInt(this.Group_Id);
    body["users"] = users;
    this.showload = true;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host +"/usersmap_groups", body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
            data => {
            if(data.success == true){
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info');
              setTimeout(()=>{
              this.getTenantAllUsers();
              this.getGroupUsersList(this.Group_Id);
             },3000);
              this.showload = false;
            }else{
              // this.modalRef.hide();
              this.showload = false;
            //   this.showMsg = data.message;
            // this.saveMsg = true;
            // this.userErrMsg = data.message;
            // this._notifications.create('',data.message, 'error');
            // setTimeout(()=>{
            //   this.saveMsg = false;
            //   this.userErrMsg = '';

            //   },3000);
            }
            },
            error => {
              // this.modalRef.hide();
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
  
 
}
