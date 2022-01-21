import { Component, OnInit,TemplateRef,HostListener, ViewChild, ElementRef } from '@angular/core';
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
import { addUser } from './addUser';
import { userList } from './userList';
import { userValidate} from './userValidate';
import { Compiler } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService } from 'angular2-notifications';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { GetItemService } from '../../get-item.service';

import { AddNewField } from "./add-new-field";
import { NewFieldKeys } from "./new-field-keys";
import { EditLabelNames } from "./edit-label";

import { SelfRegistrationUpdate } from './self-register-update';
import { PagerService } from '../../_services/index';
import * as _ from 'underscore';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  animations: [
    trigger('dialog1', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class ManageUsersComponent implements OnInit {
  
  @ViewChild('inviteUserModel') inviteUserModel: any;
  @ViewChild('inviteSingle') inviteSingle:ElementRef;
  @ViewChild('updatesingle') updatesingle:ElementRef;
  @ViewChild('deleteSingle') deleteSingle:ElementRef;
  @ViewChild('createfields') createfields:ElementRef;
  @ViewChild('popOver') popOver:ElementRef;
  fileToUpload: File | null = null;
  vrius: any;
  size: any;
  extension: any;
  virusScanning: boolean;
  uploadText:boolean=true;
  uploadedsuccessfully: boolean = false;
  mandatoryFieldCheckBoxFlag=false;
  currentPage=1;
  edit_first_name="";
  edit_email="";
  edit_mobile_no="";
  edit_country_code=null;
  edit_roles=[];
  edit_pre_approved:any;
  edit_user_id:number;
  edit_custom_fields = Array();

  modalRef: BsModalRef;
    config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
  label: boolean;
  fieldtype: boolean;
  placehoder: boolean;

  constructor(private http:Http, private pagerService: PagerService,
    private router: Router,private _compiler: Compiler,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,private modalService: BsModalService,private _notifications: NotificationsService,public GetItemService:GetItemService) {
    this.addSingleUsers = new addUser();
    this.addMultipleUsers = new addUser();
    this.userList = new userList();
    this.userValidate = new userValidate();
    this.multipleUsersList = new addUser();
    this.deleteUserList = new addUser();

    this._compiler.clearCache();
  }

  // @HostListener('document:click', ['$event'])
  //   handleMouseEvent(event: MouseEvent) {
  //     if(this.showBulkUploadDiv == true){
  //       this.showBulkUploadDiv = false;
  //     }
  //

  //   }

  public addNewFieldClass: AddNewField;
  public newFieldKeysClass: NewFieldKeys;
  public editLabelNameClass: EditLabelNames;
  public activeTab = 1;
  public showload;
  public roleLists;
  public allUsersList;
  public userValidate:userValidate;
  public addSingleUsers:addUser;
  public addMultipleUsers:addUser;
  public multipleUsersList :addUser;
  public userList:userList;
  public deleteUserList:addUser;
  public customRolesId =[];
  public addsingleuser;
  public addMultipleuser;
  public showMsg;
  public saveMsg;
  public settings1;
  public validateErr =-1;
  public validateErrMsg = "";
  public mailValidate = false;
  public customFieldValidate = false;
  public customFieldValidateType = false;
  public fnameerr = false;
  public lnameerr = false;
  public emailerr = false;
  public roleserr = false;
  public mobErr = false;
  public codeErr = false;
  public multipleUSerErrIndex = -1;
  public checkAllRoles = false;
  public showBulkUploadDiv = false;
  public showErrorUpload;
  public alerts: any[] =[];
  public labelshow;

  public checkAuthor = false;
  public checkTestAdmin = false;
  public planExpires;
  public getAllCusFields;
  public Fieldsleft;


  public curId;
  public customFieldsMeta;
  public newFieldLabel;
  public newFieldType;
  public newPlaceholdername;
  // public newrequired = false;
  public newrequiredfield;
  

  public showCFMD;
  public dropRadioValues;
  public showAddFieldValue;
  public editablePopup;
  public preApprovedToggle;
  public currentUser;
  public curUserPassword;
  public currentPreMails;
  public approveTabData;
  public showApproveUsersTab;
  public selfRegisterMetaData;
  public currentUserDetails;

  public employee_type;
  public first_name;
  public last_name;
  public employee_id;
  public user_email;
  public country;
  public department;
  public supervisorName;
  public supervisorEmail;
  public selectedEmailEnd;
  public currentDepartments;
  public currentSupervisors;
  public contInd;
  public deptInd;
  public supsInd;
  public showError;
  public confirmMsgVal;
  public selectedIDs;
    // pager object
    pager: any = {};
     // paged items
  pagedItems: any[];
    // array of all items to be paged
    private allItems: any[];

  public selfRegistrationUpdate: SelfRegistrationUpdate;

  public Notificationoptions = {
    position: ["center"],
    timeOut: 4000,
    lastOnBottom: true,
    showProgressBar:true,
    preventDuplicates : true,
    animate : "scale",
    pauseOnHover :false,
    clickToClose :false,
    clickIconToClose:false


}

  ngOnInit() {

    this.checkYokogawa();

    this.curUserPassword = '';
    this.preApprovedToggle = false;
    this.labelshow = false;
    this.editablePopup = false;
    this.showAddFieldValue = false;
    this.dropRadioValues = '';
    this.showCFMD = false;
    this.newFieldLabel = '';
    this.newFieldType = '';
    this.newPlaceholdername = ''; 
    // this.newrequired = false;
    this.showError = false;
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
    this.showBulkUploadDiv = false;
    this._compiler.clearCache();
    this.getAllRoles();
    this.settings1 = {
      singleSelection: false,
      text: "Select Roles",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "myclass custom-class-example"
    };

    // this.addSingleUsers.users.push(new userList());
    for(var i=0;i<10;i++){
      this.addMultipleUsers.users.push(new userList());
    }

    var getPreMail;
    getPreMail = this.cookieService.get('_TEM');
    var curPreMail;
    curPreMail = getPreMail.split("@")[1];
    if(curPreMail != '' && curPreMail != null) {
      this.currentPreMails = '@' + curPreMail;
    } else {
      this.currentPreMails = '@brigita.co';
    }

  }

  checkYokogawa() {
    var tempOrg;
    tempOrg = this.cookieService.get('_TON');

    if (tempOrg === null || tempOrg === undefined || tempOrg === '') {
      setTimeout(() => {
        this.checkYokogawa();
      }, 50);
    } else {
      var checkIt = tempOrg.includes('Yokogawa');

      if (checkIt) {
        this.getSelfRegistrationMetaData();
      }
    }



    this.showApproveUsersTab = checkIt;
  }

  validate(data){

  }

  getAllRoles(){

    this.showload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +"/all_roles",{headers : headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {
        this.getBaseMetadata();
        // this.showload = false;
        this.getCreatedCustomFieldList();
        this.getTenantAllUsers();
        this.roleLists = data;
          for(var i=0;i<this.roleLists.length;i++){
            if(this.roleLists[i].itemName == 'Participant'){
              this.userList.roles.push(this.roleLists[i]);
            }
          }

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

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    this.currentPage=page;

    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
}

  getCreatedCustomFieldList() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +"/cf_list/" + this.cookieService.get('_PAOID'),{headers : headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {
        this.getAllCusFields = data;
        this.Fieldsleft = 6-this.getAllCusFields.length;
        console.log(this.getAllCusFields);
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


  getTenantAllUsers(){
    this.showload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
  //  this.http.get(credentials.host +"/tenant_users/" +this.cookieService.get('_PAOID') ,{headers : headers})
    this.http.get('http://15.207.209.163/new-scora/scoraauthor/public/api' +"/tenant_users/" +this.cookieService.get('_PAOID') ,{headers : headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {

        this.showload = false;
        this.allUsersList = data;

        this.allItems =this.allUsersList;
        this.setPage(1);

        this.showAddFieldValue = false;
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

  LabelCheckbox(){
    // if(this.newrequired == false){
    //   this.newrequired = true;
    // }
    // else if(this.newrequired == true){
    //   this.newrequired = false;
    // }
    console.log(this.mandatoryFieldCheckBoxFlag);
  }

  NewUserAddCheckPreApprove() {
    this.preApprovedToggle = !this.preApprovedToggle;

    if (this.preApprovedToggle == true) {
      this.checkAllRoles = false;
      this.userList.roles=[];
      this.customRolesId = [];
      this.userList.roles=[{id: 4, itemName: "Participant", itemName_description: "Attempts tests & view analytics, solutions"}]
    }

    var getPreMail;
    getPreMail = this.cookieService.get('_TEM');
    var curPreMail;
    curPreMail = getPreMail.split("@")[1];
    if(curPreMail != '' && curPreMail != null) {
      this.currentPreMails = '@' + curPreMail;
    } else {
      this.currentPreMails = '@brigita.co';
    }
  }

  selectRoles(roleDet){
    if(!this.customRolesId.includes(roleDet.id)){
      this.customRolesId.push(roleDet.id);
      if(roleDet.itemName == 'Super Admin'){
        this.checkAllRoles = true;
        this.userList.roles=[];
        this.userList.roles=[{id: 4, itemName: "Participant", itemName_description: "Attempts tests & view analytics, solutions"}]
        this.userList.roles.push(roleDet);
      }
      else
      {
         this.userList.roles.push(roleDet);
      }


    }else{
      if(roleDet.itemName == 'Super Admin'){
        this.checkAllRoles = false;
        this.userList.roles=[];
        this.customRolesId = [];
        this.userList.roles=[{id: 4, itemName: "Participant", itemName_description: "Attempts tests & view analytics, solutions"}]
      }
      else
      {
          for(var i=0;i<this.userList.roles.length;i++){
            if(this.userList.roles[i].id == roleDet.id){
              this.userList.roles.splice(i,1);
              }
          }
      }
      for(var j=0;j<this.customRolesId.length;j++)
      {
        if(this.customRolesId[j] == roleDet.id){
          this.customRolesId.splice(j,1);
        }
      }
    }

  }

  onlyNumberKey(event) {

    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }


  addSingleUser(){
    debugger
    this.fnameerr = false;
    // this.lnameerr = false;
    this.emailerr = false;
    this.roleserr = false;
    this.mobErr = false;
    this.codeErr = false;

      const pattern1 = /^[^\s].*/;

    if(this.userList.first_name == '' || !pattern1.test(this.userList.first_name) ){
      this.fnameerr = true;
    }
    // if(this.userList.last_name == ''  ){
    //   this.lnameerr = true;
    // }
    console.log('this.preApprovedToggle',this.preApprovedToggle);
    if (this.preApprovedToggle == false) {
      const EmailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if(this.userList.email == '' || !EmailPattern.test(this.userList.email) ){
        this.emailerr = true;
      }
      else
        this.emailerr=false;
    }
    console.log('email err',this.emailerr);

    if(this.userList.roles.length == 0 ){
      this.roleserr = true;
    }
    const pattern = /^[0-9]*$/;
    if((this.userList.mobile_no !='' && this.userList.mobile_no != null && this.userList.mobile_no != undefined) && this.userList.country_code != null ){
      if(pattern.test(this.userList.mobile_no)){
        this.mobErr = false;
      }else{
        this.mobErr = true;
      }
    }else if((this.userList.mobile_no ==''  || this.userList.mobile_no == null || this.userList.mobile_no == undefined) && this.userList.country_code != null){
      this.mobErr = true;
    }else if((this.userList.mobile_no !=''  && this.userList.mobile_no != null && this.userList.mobile_no != undefined) && this.userList.country_code == null){
      this.codeErr = true;
    }

    if(this.preApprovedToggle == true) {

      var getPreMail;
      getPreMail = this.cookieService.get('_TEM');
      var curPreMail;
      curPreMail = getPreMail.split("@")[1];

      this.userList.email = this.userList.email + '@' + curPreMail;
      this.userList.pre_approved = 'y';
    } else {
      this.userList.pre_approved = 'n';
    }

    if(this.fnameerr == false && this.emailerr == false && this.roleserr == false && this.mobErr == false && this.codeErr == false){
      this.addSingleUsers.users =[];

     // this.modalRef.hide();
      this.showload = true;
      this.addSingleUsers.org_id = parseInt(this.cookieService.get('_PAOID'));
      this.addSingleUsers.users.push(this.userList);

      var body = this.addSingleUsers;
      var headers = new Headers();

      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host +"/create_tenant_users", body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )
      .subscribe(
            data => {

            if(data.success == true){
              this.getCreatedCustomFieldList();
              this.getTenantAllUsers();
              this.getAllRoles();
              // this.showload = false;
              //  this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info', {timeOut: 3000});
              // document.getElementById('inviteSingle').click();
              this.inviteSingle.nativeElement.click();
              setTimeout(()=>{
                this.saveMsg = false;
                this.userList.email="";
                this.userList.first_name="";
                // this.userList.last_name="";
                this.userList.mobile_no="";
                this.checkAllRoles= false;
                this.customRolesId = [];
                this.userList.roles=[];
                this.userList.pre_approved = 'n';
                this.preApprovedToggle = false;
                this.userList.country_code = null;
                this.userList.roles=[{id: 4, itemName: "Participant", itemName_description: "Attempts tests & view analytics, solutions"}]
                this.checkAuthor = false;
                this.checkTestAdmin = false;
                },3000);

            }else{
              // this.modalRef.hide();
              this.showload = false;
            //   this.showMsg = data.message;
            //  this.saveMsg = true;
            this._notifications.create('',data.message, 'error');
            setTimeout(()=>{
              this.saveMsg = false;
              this.userList.email="";
              this.userList.first_name="";
              // this.userList.last_name="";
              this.userList.mobile_no="";
              this.userList.roles=[];
              this.checkAuthor = false;
              this.checkTestAdmin = false;
              this.userList.roles=[{id: 4, itemName: "Participant", itemName_description: "Attempts tests & view analytics, solutions"}]

              },3000);
            }
            },
            error => {
              this.modalRef.hide();
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
  }

  cancelDeleteUser(){
    $('#delete').modal('hide');
  }
  
  cancelSingleUser(){
    $('#inviteuser').modal('hide');
    //this.modalRef.hide();
    this.customRolesId = [];
    this.checkAllRoles= false;
    this.userList.email="";
    this.userList.first_name="";
    // this.userList.last_name="";
    this.userList.mobile_no="";
    this.userList.roles=[];
    this.userList.country_code = null;
    this.userList.roles=[{id: 4, itemName: "Participant", itemName_description: "Attempts tests & view analytics, solutions"}]

    this.fnameerr = false;
    // this.lnameerr = false;
    this.emailerr = false;
    this.roleserr = false;
    this.mobErr = false;
    this.codeErr = false;
    this.getTenantAllUsers();
    this.getCreatedCustomFieldList();
  }

  cancelUpdateUser(){
    $('#updatesingle').modal('hide');
    //this.modalRef.hide();
    this.customRolesId = [];
    this.checkAllRoles= false;
    this.userList.email="";
    this.userList.first_name="";
    // this.userList.last_name="";
    this.userList.mobile_no="";
    this.userList.roles=[];
    this.userList.country_code = null;
    this.userList.roles=[{id: 4, itemName: "Participant", itemName_description: "Attempts tests & view analytics, solutions"}]

    this.fnameerr = false;
    // this.lnameerr = false;
    this.emailerr = false;
    this.roleserr = false;
    this.mobErr = false;
    this.codeErr = false;
    this.getTenantAllUsers();
    this.getCreatedCustomFieldList();
  }

  addMore(){
    this.addMultipleUsers.users.push(new userList());
  }

  addMultipleUser(){
    this.fnameerr = false;
    this.lnameerr = false;
    this.emailerr = false;
    this.roleserr = false;
    this.mobErr = false;
    this.multipleUSerErrIndex = -1;


    // var err = false;
    // if(this.addMultipleUsers.users[0].first_name =='' && this.addMultipleUsers.users[0].last_name == '' && this.addMultipleUsers.users[0].email == '' && this.addMultipleUsers.users[0].roles.length == 0 ){
    //   alert("Please add atleast one user");
    //   var err = true;
    // }

    // if(err == false){

    var validUsers = Array();
    for(var i=0;i<this.addMultipleUsers.users.length;i++){
      if(this.addMultipleUsers.users[i].first_name!="" && this.addMultipleUsers.users[i].last_name!="" && this.addMultipleUsers.users[i].email!=""  && this.addMultipleUsers.users[i].roles.length !=0){
        validUsers.push(this.addMultipleUsers.users[i]);
      }
    }

    const pattern = /^[0-9]*$/;
    if(validUsers.length == 0){
      if(this.addMultipleUsers.users[0].first_name == '' ){
        this.fnameerr = true;
        this.multipleUSerErrIndex = 0;

      }
      else if(this.addMultipleUsers.users[0].last_name == '' ){
        this.lnameerr = true;
        this.multipleUSerErrIndex = 0;

      }
      else if(this.addMultipleUsers.users[0].email == '' || this.addMultipleUsers.users[0].email.indexOf(" ") >=0 ){
        this.emailerr = true;
        this.multipleUSerErrIndex = 0;

      }
      else if(this.addMultipleUsers.users[0].roles.length == 0 ){
        this.roleserr = true;
        this.multipleUSerErrIndex = 0;

      }

        else if(this.addMultipleUsers.users[0].mobile_no !=''){
          if(pattern.test(this.addMultipleUsers.users[0].mobile_no)){
            this.mobErr = false;
          }else{
            this.mobErr = true;
            this.multipleUSerErrIndex = i;
          }
        }
      validUsers.push(this.addMultipleUsers.users[0]);
    }
    else{

      for(var i=0;i<validUsers.length;i++){
        if(validUsers[i].first_name == '' ){
          this.fnameerr = true;
          this.multipleUSerErrIndex = i;
          break;
        }
        else if(validUsers[i].last_name == '' ){
          this.lnameerr = true;
          this.multipleUSerErrIndex = i;
          break;
        }
        else if(validUsers[i].email == '' || validUsers[i].email.indexOf(" ") >=0 ){
          this.emailerr = true;
          this.multipleUSerErrIndex = i;
          break;
        }
        else if(validUsers[i].roles.length == 0 ){
          this.roleserr = true;
          this.multipleUSerErrIndex = i;
          break;
        }
        const pattern = /^[0-9]*$/;
        if(validUsers[i].mobile_no !=''){
          if(pattern.test(validUsers[i].mobile_no)){
            this.mobErr = false;
          }else{
            this.mobErr = true;
            this.multipleUSerErrIndex = i;
          }
        }
      }
    }


    if(this.fnameerr == false &&  this.lnameerr == false && this.emailerr == false && this.roleserr == false && this.validateErr == -1 && this.mobErr == false){
      this.showload = true;
      this.multipleUsersList.org_id = parseInt(this.cookieService.get('_PAOID'));
    this.multipleUsersList.users = validUsers;

    var body = this.multipleUsersList;
    var headers = new Headers();

    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.post(credentials.host +"/create_tenant_users", body,{headers: headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
          data => {

           if(data.success == true){

             this.modalRef.hide();
            this.showload = false;
            //  this.showMsg = data.message;
            // this.saveMsg = true;
            this._notifications.create('',data.message, 'info', {timeOut: 3000});
            setTimeout(()=>{
              this.showload = true;
              this.getTenantAllUsers();
              this.getCreatedCustomFieldList();
              this.saveMsg = false;
              this.addMultipleUsers.users = [];
              for(var i=0;i<10;i++){
                this.addMultipleUsers.users.push(new userList());
              }
              },3000);

           }else{
            this.modalRef.hide();
            this.showload = false;
          //   this.showMsg = data.message;
          //  this.saveMsg = true;
          this._notifications.create('',data.message, 'error');
           setTimeout(()=>{
             this.saveMsg = false;
             },3000);
           }
          },
          error => {
            this.modalRef.hide();
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

    // }

  }

  cancelMultipleUser(){
    this.modalRef.hide();
    this.fnameerr = false;
    this.lnameerr = false;
    this.emailerr = false;
    this.roleserr = false;
    this.checkAuthor = false;
    this.checkTestAdmin = false;
    this.addMultipleUsers.users = [];
    for(var i=0;i<10;i++){
      this.addMultipleUsers.users.push(new userList());
    }
  }

  userValidateApi(email,index){
    if(email !=''){
      this.userValidate.email = email;
      this.userValidate.org_id = parseInt(this.cookieService.get('_PAOID'));
      var body = this.userValidate;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host +"/user_validate", body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
            data => {

            if(data.success == true){
              this.showload = false;
              this.validateErr = -1;
              this.validateErrMsg ="";

            }else{
              this.showload = false;
              this.validateErr = index;
              this.validateErrMsg = data.message;
            }
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
  }

  openSingleUserModal(template: TemplateRef<any>) {

    if (this.getAllCusFields != undefined) {
      this.userList.custom_fields = this.getAllCusFields;
    }

    this.curUserPassword = '';
    this.preApprovedToggle = false;
    this.editablePopup = false;
    this.showAddFieldValue = false;

    // if(this.planExpires == false){
    this.modalRef = this.modalService.show(template,this.config);
    // }else if(this.planExpires == true){
    //   this.alerts.push({
    //     type: 'danger',
    //     msg: "Looks like your plan is expired.. Please contact your Super Admin",
    //     timeout:4000
    //   });
    // }
  }

  BulkUploadBtn(){
    // if(this.planExpires == false){
      this.showBulkUploadDiv == false ? this.showBulkUploadDiv = true:this.showBulkUploadDiv = false
    // }else if(this.planExpires == true){
    //   this.alerts.push({
    //     type: 'danger',
    //     msg: "Looks like your plan is expired.. Please contact your Super Admin",
    //     timeout:4000
    //   });
    // }
  }

  openMultipleUserModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: ' modal-lg' },this.config),
    );
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
    this.uploadUsers(files);
}
closeModal(){
  if(this.uploadedsuccessfully){
    $('#importdata').modal('hide');
    this.fileToUpload = null,
    this.uploadedsuccessfully = false;
  }
}
  uploadUsers(event) {
    this.showBulkUploadDiv = false;
    console.log('function called!')
    console.log(event)
    if(this.authService.canActivate()){


      // this.showErrorUpload = '';
      // $(this).this.fileToUpload.name.split('.').pop();
      if(this.fileToUpload.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

          if(this.fileToUpload) {
              let file: File = this.fileToUpload;
              this.virusScanning = true;
              this.uploadText = false;
              this.vrius = false;
              this.extension = false;
              this.size = false;
              this.uploadedsuccessfully = false;
              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id',this.cookieService.get('_PAOID'));

              let headers = new Headers();
              this.showload = true;
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.host +'/users_import', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.showload = false;

                        if(data.success == true){
                          this.virusScanning = false;
                          this.uploadedsuccessfully = true;
                          this.getTenantAllUsers();

                        // this.saveMSg = true;
                        // this.showMsg = data.message;
                        this._notifications.create('',data.message, 'info', {timeOut: 3000});
                        setTimeout(()=>{
                          // this.saveMSg = false;
                          // this.router.navigate(['author/Items/viewitems', data.upload_id]);
                      },3000);
                        }else if(data.success == false){
                          this.showload = false;
                          this._notifications.create('',data.message, 'error', {timeOut: 3000});
                          // this.showErrorUpload =  data.message;
                          this.virusScanning = false;
                          this.showload = false;
                        }
                      },
                      error => {
                        console.log("Upload Error:", error.error);
                        let errorArray = error.error;
                        let arr = errorArray[0];
                        let finalerror = arr.file; 
                        console.log("finalerror Error:",finalerror);
                        this.vrius = finalerror.includes('virus');
                        this.size = finalerror.includes('size');
                        this.extension = finalerror.includes('extension');
                        this.virusScanning = false;
                        this.showload = false;
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
                  )

      }
      else
        console.log('upload file')

    }else{
      // this.showErrorUpload = "Invalid extension for file "+this.fileToUpload.name+". Only .xlsx files are supported.";
      // this.alerts.push({
      //   type: 'danger',
      //   msg: "Invalid extension for file "+this.fileToUpload.name+". Only .xlsx files are supported.",
      //   timeout:4000
      // });
       console.log('here')
      this._notifications.error(`Invalid extension for file ${this.fileToUpload.name}. Only .xlsx files are supported.`)
      setTimeout(()=>{
        // this.showErrorUpload = '';
    },10000);
    }
    }
    else
      console.log('cant activate')
  }


  RemoveTenantUsers(userid,template: TemplateRef<any>,access_flag,alert_msg){
    // if(this.planExpires == false){
      console.log('remove tenant user called!');
      console.log(access_flag)
      if(access_flag == true){
        this.deleteSingle.nativeElement.click();
        this.deleteUserList.users = [];
        this.deleteUserList.org_id = parseInt(this.cookieService.get('_PAOID'));
        this.deleteUserList.users.push(userid);

        // this.modalRef = this.modalService.show(
        //   template,
        //   Object.assign({}, { class: ' modal-sm' },this.config),

        // );
      }
      else{
        this._notifications.error('',alert_msg);
        // this.alerts.push({
        //   type: 'danger',
        //   msg: alert_msg,
        //   timeout:4000
        // });
      }
  }

  close(){
    $('#importdata').modal('hide');
  }

  deleteUserConfirm(){
    // $('#delete').modal('hide');
   // this.modalRef.hide();
   console.log('final delete function called!');
    if(this.authService.canActivate()){

      this.showload = true;
      var body = this.deleteUserList;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      // let options = new RequestOptions({
      //   headers : headers,
      //   body:body
      // })
      this.deleteSingle.nativeElement.click();
      return this.http.post(credentials.host + '/remove_tenant_users', body,{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {
            this.showload = false;

            if(data.success == true){
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info', {timeOut: 3000});
              setTimeout(()=>{
                this.saveMsg = false;
                this.getTenantAllUsers();
                },4000);
            } else{
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'error');
              setTimeout(()=>{
                this.saveMsg = false;

              },4000);
            }
          },
          error => {

            this.showload = false;
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
  }

  showPassword(curUserDet, template: TemplateRef<any> ) {
    this.curUserPassword = '';

    this.currentUser = curUserDet;

    this.showload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host + "/show_password/" + this.currentUser.user_id,{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {
        this.showload = false;
        if(data != undefined) {
          this.curUserPassword = data;
          this.modalRef = this.modalService.show(template,this.config);
        } else {
          this.currentUser = undefined;
          this.showload = false;
        }
      },
      error => {
        this.showload = false;
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

  cancelThePop() {
    this.modalRef.hide();
    setTimeout(() => {
      this.curUserPassword = '';
      this.currentUser = undefined;
    },500);

  }

  generateNewPassword() {
    this.showload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host + "/generate_password/" + this.currentUser.user_id,{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {
        if(data.success == true) {
          this.modalRef.hide();
          this._notifications.create('',data.message, 'info', {timeOut: 3000});
          setTimeout(()=>{
            this.getTenantAllUsers();
          },4000);

        } else {
          this._notifications.create('',data.message, 'error');
          this.showload = false;
        }
      },
      error => {
        this.showload = false;
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

  editUser(editableUser,template: TemplateRef<any>,access_flag,alert_msg){
    // if(this.planExpires == false){
      if(access_flag == true){
        this.customRolesId =[];
        this.checkTestAdmin = false;
        this.checkAuthor = false;
        // this.edit_first_name = editableUser.username;
        // this.edit_email = editableUser.email;
        // this.edit_mobile_no = editableUser.mobile_no;
        // this.edit_user_id = editableUser.user_id;
        // this.edit_country_code = editableUser.country_code;
        // this.edit_custom_fields = editableUser.custom_fields;
        // this.edit_pre_approved = editableUser.pre_approved;

        this.userList.first_name = editableUser.username;
        this.userList.email = editableUser.email;
        this.userList.mobile_no = editableUser.mobile_no;
        this.userList.user_id = editableUser.user_id;
        this.userList.country_code = editableUser.country_code;
        this.userList.custom_fields = editableUser.custom_fields;
        this.userList.pre_approved = editableUser.pre_approved;

        if (this.userList.pre_approved == 'y') {
        // if (this.edit_pre_approved == 'y') {
          this.preApprovedToggle == true;
        } else {
          this.preApprovedToggle == false;
        }

        var rolesToSplit = editableUser.roles.split(',');

        for(var i=0;i<rolesToSplit.length;i++){
          if(rolesToSplit[i] == "Test Admin"){
            // this.userList.roles.push({id: 3, itemName: "Test Admin", itemName_description: "Create & Manage Tests & Test groups"});
            this.edit_roles.push({id: 3, itemName: "Test Admin", itemName_description: "Create & Manage Tests & Test groups"});
            this.checkTestAdmin = true;
            this.customRolesId.push(3);
          }else if(rolesToSplit[i] == "Super Admin"){
            this.userList.roles.push({id: 1, itemName: "Super Admin", itemName_description: "Manage the subscriptions & user access"});
            this.userList.roles.push({id: 3, itemName: "Test Admin", itemName_description: "Create & Manage Tests & Test groups"});
            this.userList.roles.push({id: 2, itemName: "Author", itemName_description: "Add, Delete, Edit Items & Item sets"});
            // this.edit_roles.push({id: 1, itemName: "Super Admin", itemName_description: "Manage the subscriptions & user access"});
            // this.edit_roles.push({id: 3, itemName: "Test Admin", itemName_description: "Create & Manage Tests & Test groups"});
            // this.edit_roles.push({id: 2, itemName: "Author", itemName_description: "Add, Delete, Edit Items & Item sets"});
            this.checkAllRoles = true;
            this.customRolesId.push(1);
          }else if(rolesToSplit[i] == "Author"){
            this.userList.roles.push({id: 2, itemName: "Author", itemName_description: "Add, Delete, Edit Items & Item sets"});
            // this.edit_roles.push({id: 2, itemName: "Author", itemName_description: "Add, Delete, Edit Items & Item sets"});
            this.checkAuthor = true;
            this.customRolesId.push(2);
          }
        }
        // document.getElementById('updateSingle').click();
        this.updatesingle.nativeElement.click();
        // this.modalRef = this.modalService.show(template,this.config);
      }else if(access_flag == false){
        this._notifications.info('Alert!',alert_msg);
        // this.alerts.push({
        //   type: 'danger',
        //   msg: alert_msg,
        //   timeout:4000
        // });
      }
    // }
    console.log(editableUser)
  }


  UpdateSingleUser(){
    this.fnameerr = false;
    // this.lnameerr = false;
    this.emailerr = false;
    this.roleserr = false;

    this.mobErr = false;
    this.codeErr = false;
    ////////
      // const pattern1 = /^[^\s].*/;
      // if(this.userList.first_name !=''){
      //   if(pattern1.test(this.userList.first_name)){
      //     this.mobErr = false;
      //   }else{
      //     this.mobErr = true;
      //   }
      // }
      //

      const pattern1 = /^[^\s].*/;

    if(this.userList.first_name == '' || !pattern1.test(this.userList.first_name) ){
      this.fnameerr = true;
    }
    // if(this.userList.last_name == ''  ){
    //   this.lnameerr = true;
    // }

    const EmailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (this.preApprovedToggle == false) {
      if(this.userList.email == '' || !pattern1.test(this.userList.email) ){
        this.emailerr = true;
      }
    }

    if(this.userList.roles.length == 0 ){
      this.roleserr = true;
    }
    const pattern = /^[0-9]*$/;
    if((this.userList.mobile_no !='' && this.userList.mobile_no != null && this.userList.mobile_no != undefined) && this.userList.country_code != null ){
      if(pattern.test(this.userList.mobile_no)){
        this.mobErr = false;
      }else{
        this.mobErr = true;
      }
    }else if((this.userList.mobile_no ==''  || this.userList.mobile_no == null || this.userList.mobile_no == undefined) && this.userList.country_code != null){
      this.mobErr = true;
    }else if((this.userList.mobile_no !=''  && this.userList.mobile_no != null && this.userList.mobile_no != undefined) && this.userList.country_code == null){
      this.codeErr = true;
    }

    if(this.fnameerr == false && this.emailerr == false && this.roleserr == false && this.mobErr == false && this.codeErr == false){
      this.addSingleUsers.users =[];

      // this.modalRef.hide();
      document.getElementById('updateSingle').click();
      this.showload = true;
      this.addSingleUsers.org_id = parseInt(this.cookieService.get('_PAOID'));
      this.userList.pre_approved = this.userList.pre_approved;
      this.addSingleUsers.users.push(this.userList);

      var body = this.addSingleUsers;
      var headers = new Headers();

      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.put(credentials.host +"/edit_tenant_users", body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
            data => {

            if(data.success == true){
              this.getTenantAllUsers();

              this.showload = false;
              //  this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info', {timeOut: 3000});
              setTimeout(()=>{
                this.saveMsg = false;
                this.userList.email="";
                this.userList.first_name="";
                // this.userList.last_name="";
                this.userList.mobile_no="";
                this.checkAllRoles= false;
                this.customRolesId = [];
                this.userList.roles=[];
                this.userList.country_code = null;
                this.userList.roles=[{id: 4, itemName: "Participant", itemName_description: "Attempts tests & view analytics, solutions"}]
                this.checkAuthor = false;
                this.checkTestAdmin = false;
                },3000);

            }else{
              // this.modalRef.hide();
              this.showload = false;
            //   this.showMsg = data.message;
            //  this.saveMsg = true;
            this._notifications.create('',data.message, 'error');
            setTimeout(()=>{
              this.saveMsg = false;
              this.userList.email="";
              this.userList.first_name="";
              // this.userList.last_name="";
              this.userList.mobile_no="";
              this.userList.roles=[];
              this.userList.roles=[{id: 4, itemName: "Participant", itemName_description: "Attempts tests & view analytics, solutions"}]
              this.checkAuthor = false;
              this.checkTestAdmin = false;
              },3000);
            }
            },
            error => {
              this.modalRef.hide();
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
    else
      this._notifications.error('Check all fields');
  }


  public countryCodes = [
    {
    "name": "Afghanistan",
    "dial_code": "+93",
    "code": "AF"
    },
    {
    "name": "Aland Islands",
    "dial_code": "+358",
    "code": "AX"
    },
    {
    "name": "Albania",
    "dial_code": "+355",
    "code": "AL"
    },
    {
    "name": "Algeria",
    "dial_code": "+213",
    "code": "DZ"
    },
    {
    "name": "AmericanSamoa",
    "dial_code": "+1684",
    "code": "AS"
    },
    {
    "name": "Andorra",
    "dial_code": "+376",
    "code": "AD"
    },
    {
    "name": "Angola",
    "dial_code": "+244",
    "code": "AO"
    },
    {
    "name": "Anguilla",
    "dial_code": "+1264",
    "code": "AI"
    },
    {
    "name": "Antarctica",
    "dial_code": "+672",
    "code": "AQ"
    },
    {
    "name": "Antigua and Barbuda",
    "dial_code": "+1268",
    "code": "AG"
    },
    {
    "name": "Argentina",
    "dial_code": "+54",
    "code": "AR"
    },
    {
    "name": "Armenia",
    "dial_code": "+374",
    "code": "AM"
    },
    {
    "name": "Aruba",
    "dial_code": "+297",
    "code": "AW"
    },
    {
    "name": "Australia",
    "dial_code": "+61",
    "code": "AU"
    },
    {
    "name": "Austria",
    "dial_code": "+43",
    "code": "AT"
    },
    {
    "name": "Azerbaijan",
    "dial_code": "+994",
    "code": "AZ"
    },
    {
    "name": "Bahamas",
    "dial_code": "+1242",
    "code": "BS"
    },
    {
    "name": "Bahrain",
    "dial_code": "+973",
    "code": "BH"
    },
    {
    "name": "Bangladesh",
    "dial_code": "+880",
    "code": "BD"
    },
    {
    "name": "Barbados",
    "dial_code": "+1246",
    "code": "BB"
    },
    {
    "name": "Belarus",
    "dial_code": "+375",
    "code": "BY"
    },
    {
    "name": "Belgium",
    "dial_code": "+32",
    "code": "BE"
    },
    {
    "name": "Belize",
    "dial_code": "+501",
    "code": "BZ"
    },
    {
    "name": "Benin",
    "dial_code": "+229",
    "code": "BJ"
    },
    {
    "name": "Bermuda",
    "dial_code": "+1441",
    "code": "BM"
    },
    {
    "name": "Bhutan",
    "dial_code": "+975",
    "code": "BT"
    },
    {
    "name": "Bolivia, Plurinational State of",
    "dial_code": "+591",
    "code": "BO"
    },
    {
    "name": "Bosnia and Herzegovina",
    "dial_code": "+387",
    "code": "BA"
    },
    {
    "name": "Botswana",
    "dial_code": "+267",
    "code": "BW"
    },
    {
    "name": "Brazil",
    "dial_code": "+55",
    "code": "BR"
    },
    {
    "name": "British Indian Ocean Territory",
    "dial_code": "+246",
    "code": "IO"
    },
    {
    "name": "Brunei Darussalam",
    "dial_code": "+673",
    "code": "BN"
    },
    {
    "name": "Bulgaria",
    "dial_code": "+359",
    "code": "BG"
    },
    {
    "name": "Burkina Faso",
    "dial_code": "+226",
    "code": "BF"
    },
    {
    "name": "Burundi",
    "dial_code": "+257",
    "code": "BI"
    },
    {
    "name": "Cambodia",
    "dial_code": "+855",
    "code": "KH"
    },
    {
    "name": "Cameroon",
    "dial_code": "+237",
    "code": "CM"
    },
    {
    "name": "Canada",
    "dial_code": "+1",
    "code": "CA"
    },
    {
    "name": "Cape Verde",
    "dial_code": "+238",
    "code": "CV"
    },
    {
    "name": "Cayman Islands",
    "dial_code": "+ 345",
    "code": "KY"
    },
    {
    "name": "Central African Republic",
    "dial_code": "+236",
    "code": "CF"
    },
    {
    "name": "Chad",
    "dial_code": "+235",
    "code": "TD"
    },
    {
    "name": "Chile",
    "dial_code": "+56",
    "code": "CL"
    },
    {
    "name": "China",
    "dial_code": "+86",
    "code": "CN"
    },
    {
    "name": "Christmas Island",
    "dial_code": "+61",
    "code": "CX"
    },
    {
    "name": "Cocos (Keeling) Islands",
    "dial_code": "+61",
    "code": "CC"
    },
    {
    "name": "Colombia",
    "dial_code": "+57",
    "code": "CO"
    },
    {
    "name": "Comoros",
    "dial_code": "+269",
    "code": "KM"
    },
    {
    "name": "Congo",
    "dial_code": "+242",
    "code": "CG"
    },
    {
    "name": "Congo, The Democratic Republic of the Congo",
    "dial_code": "+243",
    "code": "CD"
    },
    {
    "name": "Cook Islands",
    "dial_code": "+682",
    "code": "CK"
    },
    {
    "name": "Costa Rica",
    "dial_code": "+506",
    "code": "CR"
    },
    {
    "name": "Cote d'Ivoire",
    "dial_code": "+225",
    "code": "CI"
    },
    {
    "name": "Croatia",
    "dial_code": "+385",
    "code": "HR"
    },
    {
    "name": "Cuba",
    "dial_code": "+53",
    "code": "CU"
    },
    {
    "name": "Cyprus",
    "dial_code": "+357",
    "code": "CY"
    },
    {
    "name": "Czech Republic",
    "dial_code": "+420",
    "code": "CZ"
    },
    {
    "name": "Denmark",
    "dial_code": "+45",
    "code": "DK"
    },
    {
    "name": "Djibouti",
    "dial_code": "+253",
    "code": "DJ"
    },
    {
    "name": "Dominica",
    "dial_code": "+1767",
    "code": "DM"
    },
    {
    "name": "Dominican Republic",
    "dial_code": "+1849",
    "code": "DO"
    },
    {
    "name": "Ecuador",
    "dial_code": "+593",
    "code": "EC"
    },
    {
    "name": "Egypt",
    "dial_code": "+20",
    "code": "EG"
    },
    {
    "name": "El Salvador",
    "dial_code": "+503",
    "code": "SV"
    },
    {
    "name": "Equatorial Guinea",
    "dial_code": "+240",
    "code": "GQ"
    },
    {
    "name": "Eritrea",
    "dial_code": "+291",
    "code": "ER"
    },
    {
    "name": "Estonia",
    "dial_code": "+372",
    "code": "EE"
    },
    {
    "name": "Ethiopia",
    "dial_code": "+251",
    "code": "ET"
    },
    {
    "name": "Falkland Islands (Malvinas)",
    "dial_code": "+500",
    "code": "FK"
    },
    {
    "name": "Faroe Islands",
    "dial_code": "+298",
    "code": "FO"
    },
    {
    "name": "Fiji",
    "dial_code": "+679",
    "code": "FJ"
    },
    {
    "name": "Finland",
    "dial_code": "+358",
    "code": "FI"
    },
    {
    "name": "France",
    "dial_code": "+33",
    "code": "FR"
    },
    {
    "name": "French Guiana",
    "dial_code": "+594",
    "code": "GF"
    },
    {
    "name": "French Polynesia",
    "dial_code": "+689",
    "code": "PF"
    },
    {
    "name": "Gabon",
    "dial_code": "+241",
    "code": "GA"
    },
    {
    "name": "Gambia",
    "dial_code": "+220",
    "code": "GM"
    },
    {
    "name": "Georgia",
    "dial_code": "+995",
    "code": "GE"
    },
    {
    "name": "Germany",
    "dial_code": "+49",
    "code": "DE"
    },
    {
    "name": "Ghana",
    "dial_code": "+233",
    "code": "GH"
    },
    {
    "name": "Gibraltar",
    "dial_code": "+350",
    "code": "GI"
    },
    {
    "name": "Greece",
    "dial_code": "+30",
    "code": "GR"
    },
    {
    "name": "Greenland",
    "dial_code": "+299",
    "code": "GL"
    },
    {
    "name": "Grenada",
    "dial_code": "+1473",
    "code": "GD"
    },
    {
    "name": "Guadeloupe",
    "dial_code": "+590",
    "code": "GP"
    },
    {
    "name": "Guam",
    "dial_code": "+1671",
    "code": "GU"
    },
    {
    "name": "Guatemala",
    "dial_code": "+502",
    "code": "GT"
    },
    {
    "name": "Guernsey",
    "dial_code": "+44",
    "code": "GG"
    },
    {
    "name": "Guinea",
    "dial_code": "+224",
    "code": "GN"
    },
    {
    "name": "Guinea-Bissau",
    "dial_code": "+245",
    "code": "GW"
    },
    {
    "name": "Guyana",
    "dial_code": "+595",
    "code": "GY"
    },
    {
    "name": "Haiti",
    "dial_code": "+509",
    "code": "HT"
    },
    {
    "name": "Holy See (Vatican City State)",
    "dial_code": "+379",
    "code": "VA"
    },
    {
    "name": "Honduras",
    "dial_code": "+504",
    "code": "HN"
    },
    {
    "name": "Hong Kong",
    "dial_code": "+852",
    "code": "HK"
    },
    {
    "name": "Hungary",
    "dial_code": "+36",
    "code": "HU"
    },
    {
    "name": "Iceland",
    "dial_code": "+354",
    "code": "IS"
    },
    {
    "name": "India",
    "dial_code": "+91",
    "code": "IN"
    },
    {
    "name": "Indonesia",
    "dial_code": "+62",
    "code": "ID"
    },
    {
    "name": "Iran, Islamic Republic of Persian Gulf",
    "dial_code": "+98",
    "code": "IR"
    },
    {
    "name": "Iraq",
    "dial_code": "+964",
    "code": "IQ"
    },
    {
    "name": "Ireland",
    "dial_code": "+353",
    "code": "IE"
    },
    {
    "name": "Isle of Man",
    "dial_code": "+44",
    "code": "IM"
    },
    {
    "name": "Israel",
    "dial_code": "+972",
    "code": "IL"
    },
    {
    "name": "Italy",
    "dial_code": "+39",
    "code": "IT"
    },
    {
    "name": "Jamaica",
    "dial_code": "+1876",
    "code": "JM"
    },
    {
    "name": "Japan",
    "dial_code": "+81",
    "code": "JP"
    },
    {
    "name": "Jersey",
    "dial_code": "+44",
    "code": "JE"
    },
    {
    "name": "Jordan",
    "dial_code": "+962",
    "code": "JO"
    },
    {
    "name": "Kazakhstan",
    "dial_code": "+77",
    "code": "KZ"
    },
    {
    "name": "Kenya",
    "dial_code": "+254",
    "code": "KE"
    },
    {
    "name": "Kiribati",
    "dial_code": "+686",
    "code": "KI"
    },
    {
    "name": "Korea, Democratic People's Republic of Korea",
    "dial_code": "+850",
    "code": "KP"
    },
    {
    "name": "Korea, Republic of South Korea",
    "dial_code": "+82",
    "code": "KR"
    },
    {
    "name": "Kuwait",
    "dial_code": "+965",
    "code": "KW"
    },
    {
    "name": "Kyrgyzstan",
    "dial_code": "+996",
    "code": "KG"
    },
    {
    "name": "Laos",
    "dial_code": "+856",
    "code": "LA"
    },
    {
    "name": "Latvia",
    "dial_code": "+371",
    "code": "LV"
    },
    {
    "name": "Lebanon",
    "dial_code": "+961",
    "code": "LB"
    },
    {
    "name": "Lesotho",
    "dial_code": "+266",
    "code": "LS"
    },
    {
    "name": "Liberia",
    "dial_code": "+231",
    "code": "LR"
    },
    {
    "name": "Libyan Arab Jamahiriya",
    "dial_code": "+218",
    "code": "LY"
    },
    {
    "name": "Liechtenstein",
    "dial_code": "+423",
    "code": "LI"
    },
    {
    "name": "Lithuania",
    "dial_code": "+370",
    "code": "LT"
    },
    {
    "name": "Luxembourg",
    "dial_code": "+352",
    "code": "LU"
    },
    {
    "name": "Macao",
    "dial_code": "+853",
    "code": "MO"
    },
    {
    "name": "Macedonia",
    "dial_code": "+389",
    "code": "MK"
    },
    {
    "name": "Madagascar",
    "dial_code": "+261",
    "code": "MG"
    },
    {
    "name": "Malawi",
    "dial_code": "+265",
    "code": "MW"
    },
    {
    "name": "Malaysia",
    "dial_code": "+60",
    "code": "MY"
    },
    {
    "name": "Maldives",
    "dial_code": "+960",
    "code": "MV"
    },
    {
    "name": "Mali",
    "dial_code": "+223",
    "code": "ML"
    },
    {
    "name": "Malta",
    "dial_code": "+356",
    "code": "MT"
    },
    {
    "name": "Marshall Islands",
    "dial_code": "+692",
    "code": "MH"
    },
    {
    "name": "Martinique",
    "dial_code": "+596",
    "code": "MQ"
    },
    {
    "name": "Mauritania",
    "dial_code": "+222",
    "code": "MR"
    },
    {
    "name": "Mauritius",
    "dial_code": "+230",
    "code": "MU"
    },
    {
    "name": "Mayotte",
    "dial_code": "+262",
    "code": "YT"
    },
    {
    "name": "Mexico",
    "dial_code": "+52",
    "code": "MX"
    },
    {
    "name": "Micronesia, Federated States of Micronesia",
    "dial_code": "+691",
    "code": "FM"
    },
    {
    "name": "Moldova",
    "dial_code": "+373",
    "code": "MD"
    },
    {
    "name": "Monaco",
    "dial_code": "+377",
    "code": "MC"
    },
    {
    "name": "Mongolia",
    "dial_code": "+976",
    "code": "MN"
    },
    {
    "name": "Montenegro",
    "dial_code": "+382",
    "code": "ME"
    },
    {
    "name": "Montserrat",
    "dial_code": "+1664",
    "code": "MS"
    },
    {
    "name": "Morocco",
    "dial_code": "+212",
    "code": "MA"
    },
    {
    "name": "Mozambique",
    "dial_code": "+258",
    "code": "MZ"
    },
    {
    "name": "Myanmar",
    "dial_code": "+95",
    "code": "MM"
    },
    {
    "name": "Namibia",
    "dial_code": "+264",
    "code": "NA"
    },
    {
    "name": "Nauru",
    "dial_code": "+674",
    "code": "NR"
    },
    {
    "name": "Nepal",
    "dial_code": "+977",
    "code": "NP"
    },
    {
    "name": "Netherlands",
    "dial_code": "+31",
    "code": "NL"
    },
    {
    "name": "Netherlands Antilles",
    "dial_code": "+599",
    "code": "AN"
    },
    {
    "name": "New Caledonia",
    "dial_code": "+687",
    "code": "NC"
    },
    {
    "name": "New Zealand",
    "dial_code": "+64",
    "code": "NZ"
    },
    {
    "name": "Nicaragua",
    "dial_code": "+505",
    "code": "NI"
    },
    {
    "name": "Niger",
    "dial_code": "+227",
    "code": "NE"
    },
    {
    "name": "Nigeria",
    "dial_code": "+234",
    "code": "NG"
    },
    {
    "name": "Niue",
    "dial_code": "+683",
    "code": "NU"
    },
    {
    "name": "Norfolk Island",
    "dial_code": "+672",
    "code": "NF"
    },
    {
    "name": "Northern Mariana Islands",
    "dial_code": "+1670",
    "code": "MP"
    },
    {
    "name": "Norway",
    "dial_code": "+47",
    "code": "NO"
    },
    {
    "name": "Oman",
    "dial_code": "+968",
    "code": "OM"
    },
    {
    "name": "Pakistan",
    "dial_code": "+92",
    "code": "PK"
    },
    {
    "name": "Palau",
    "dial_code": "+680",
    "code": "PW"
    },
    {
    "name": "Palestinian Territory, Occupied",
    "dial_code": "+970",
    "code": "PS"
    },
    {
    "name": "Panama",
    "dial_code": "+507",
    "code": "PA"
    },
    {
    "name": "Papua New Guinea",
    "dial_code": "+675",
    "code": "PG"
    },
    {
    "name": "Paraguay",
    "dial_code": "+595",
    "code": "PY"
    },
    {
    "name": "Peru",
    "dial_code": "+51",
    "code": "PE"
    },
    {
    "name": "Philippines",
    "dial_code": "+63",
    "code": "PH"
    },
    {
    "name": "Pitcairn",
    "dial_code": "+872",
    "code": "PN"
    },
    {
    "name": "Poland",
    "dial_code": "+48",
    "code": "PL"
    },
    {
    "name": "Portugal",
    "dial_code": "+351",
    "code": "PT"
    },
    {
    "name": "Puerto Rico",
    "dial_code": "+1939",
    "code": "PR"
    },
    {
    "name": "Qatar",
    "dial_code": "+974",
    "code": "QA"
    },
    {
    "name": "Romania",
    "dial_code": "+40",
    "code": "RO"
    },
    {
    "name": "Russia",
    "dial_code": "+7",
    "code": "RU"
    },
    {
    "name": "Rwanda",
    "dial_code": "+250",
    "code": "RW"
    },
    {
    "name": "Reunion",
    "dial_code": "+262",
    "code": "RE"
    },
    {
    "name": "Saint Barthelemy",
    "dial_code": "+590",
    "code": "BL"
    },
    {
    "name": "Saint Helena, Ascension and Tristan Da Cunha",
    "dial_code": "+290",
    "code": "SH"
    },
    {
    "name": "Saint Kitts and Nevis",
    "dial_code": "+1869",
    "code": "KN"
    },
    {
    "name": "Saint Lucia",
    "dial_code": "+1758",
    "code": "LC"
    },
    {
    "name": "Saint Martin",
    "dial_code": "+590",
    "code": "MF"
    },
    {
    "name": "Saint Pierre and Miquelon",
    "dial_code": "+508",
    "code": "PM"
    },
    {
    "name": "Saint Vincent and the Grenadines",
    "dial_code": "+1784",
    "code": "VC"
    },
    {
    "name": "Samoa",
    "dial_code": "+685",
    "code": "WS"
    },
    {
    "name": "San Marino",
    "dial_code": "+378",
    "code": "SM"
    },
    {
    "name": "Sao Tome and Principe",
    "dial_code": "+239",
    "code": "ST"
    },
    {
    "name": "Saudi Arabia",
    "dial_code": "+966",
    "code": "SA"
    },
    {
    "name": "Senegal",
    "dial_code": "+221",
    "code": "SN"
    },
    {
    "name": "Serbia",
    "dial_code": "+381",
    "code": "RS"
    },
    {
    "name": "Seychelles",
    "dial_code": "+248",
    "code": "SC"
    },
    {
    "name": "Sierra Leone",
    "dial_code": "+232",
    "code": "SL"
    },
    {
    "name": "Singapore",
    "dial_code": "+65",
    "code": "SG"
    },
    {
    "name": "Slovakia",
    "dial_code": "+421",
    "code": "SK"
    },
    {
    "name": "Slovenia",
    "dial_code": "+386",
    "code": "SI"
    },
    {
    "name": "Solomon Islands",
    "dial_code": "+677",
    "code": "SB"
    },
    {
    "name": "Somalia",
    "dial_code": "+252",
    "code": "SO"
    },
    {
    "name": "South Africa",
    "dial_code": "+27",
    "code": "ZA"
    },
    {
    "name": "South Sudan",
    "dial_code": "+211",
    "code": "SS"
    },
    {
    "name": "South Georgia and the South Sandwich Islands",
    "dial_code": "+500",
    "code": "GS"
    },
    {
    "name": "Spain",
    "dial_code": "+34",
    "code": "ES"
    },
    {
    "name": "Sri Lanka",
    "dial_code": "+94",
    "code": "LK"
    },
    {
    "name": "Sudan",
    "dial_code": "+249",
    "code": "SD"
    },
    {
    "name": "Suriname",
    "dial_code": "+597",
    "code": "SR"
    },
    {
    "name": "Svalbard and Jan Mayen",
    "dial_code": "+47",
    "code": "SJ"
    },
    {
    "name": "Swaziland",
    "dial_code": "+268",
    "code": "SZ"
    },
    {
    "name": "Sweden",
    "dial_code": "+46",
    "code": "SE"
    },
    {
    "name": "Switzerland",
    "dial_code": "+41",
    "code": "CH"
    },
    {
    "name": "Syrian Arab Republic",
    "dial_code": "+963",
    "code": "SY"
    },
    {
    "name": "Taiwan",
    "dial_code": "+886",
    "code": "TW"
    },
    {
    "name": "Tajikistan",
    "dial_code": "+992",
    "code": "TJ"
    },
    {
    "name": "Tanzania, United Republic of Tanzania",
    "dial_code": "+255",
    "code": "TZ"
    },
    {
    "name": "Thailand",
    "dial_code": "+66",
    "code": "TH"
    },
    {
    "name": "Timor-Leste",
    "dial_code": "+670",
    "code": "TL"
    },
    {
    "name": "Togo",
    "dial_code": "+228",
    "code": "TG"
    },
    {
    "name": "Tokelau",
    "dial_code": "+690",
    "code": "TK"
    },
    {
    "name": "Tonga",
    "dial_code": "+676",
    "code": "TO"
    },
    {
    "name": "Trinidad and Tobago",
    "dial_code": "+1868",
    "code": "TT"
    },
    {
    "name": "Tunisia",
    "dial_code": "+216",
    "code": "TN"
    },
    {
    "name": "Turkey",
    "dial_code": "+90",
    "code": "TR"
    },
    {
    "name": "Turkmenistan",
    "dial_code": "+993",
    "code": "TM"
    },
    {
    "name": "Turks and Caicos Islands",
    "dial_code": "+1649",
    "code": "TC"
    },
    {
    "name": "Tuvalu",
    "dial_code": "+688",
    "code": "TV"
    },
    {
    "name": "Uganda",
    "dial_code": "+256",
    "code": "UG"
    },
    {
    "name": "Ukraine",
    "dial_code": "+380",
    "code": "UA"
    },
    {
    "name": "United Arab Emirates",
    "dial_code": "+971",
    "code": "AE"
    },
    {
    "name": "United Kingdom",
    "dial_code": "+44",
    "code": "GB"
    },
    {
    "name": "United States",
    "dial_code": "+1",
    "code": "US"
    },
    {
    "name": "Uruguay",
    "dial_code": "+598",
    "code": "UY"
    },
    {
    "name": "Uzbekistan",
    "dial_code": "+998",
    "code": "UZ"
    },
    {
    "name": "Vanuatu",
    "dial_code": "+678",
    "code": "VU"
    },
    {
    "name": "Venezuela, Bolivarian Republic of Venezuela",
    "dial_code": "+58",
    "code": "VE"
    },
    {
    "name": "Vietnam",
    "dial_code": "+84",
    "code": "VN"
    },
    {
    "name": "Virgin Islands, British",
    "dial_code": "+1284",
    "code": "VG"
    },
    {
    "name": "Virgin Islands, U.S.",
    "dial_code": "+1340",
    "code": "VI"
    },
    {
    "name": "Wallis and Futuna",
    "dial_code": "+681",
    "code": "WF"
    },
    {
    "name": "Yemen",
    "dial_code": "+967",
    "code": "YE"
    },
    {
    "name": "Zambia",
    "dial_code": "+260",
    "code": "ZM"
    },
    {
    "name": "Zimbabwe",
    "dial_code": "+263",
    "code": "ZW"
    }
  ];

  getBaseMetadata(){    
    localStorage.removeItem('TZNM');
    localStorage.removeItem('TZNMVL');
    this.showload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host + "/get_metadatas/" + this.cookieService.get('_PAOID'),{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {    
        localStorage.setItem('TZNM' , data.timezone_name);
        localStorage.setItem('TZNMVL' , data.timezone_value);
        // this.showload = false;
        this.customFieldsMeta = data.custom_fields_datatype;

      },
      error => {

        this.showload = false;
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

  selValNewField(val) {
    this.newFieldType = val;

     //for the custom field type validation
     if(val === '' || val === undefined || val === null)
     {
       this.customFieldValidateType = true;
     }
     else if(val !== '' && val !== undefined && val !== null){
       this.customFieldValidateType = false;
     }
     /*..*/

    if(val == 'DropDown' || val == 'RadioButtons') {
      this.dropRadioValues = '';
    } else {
      this.dropRadioValues = '';
    }

  }

  CFinput(obj){
    if(obj === '')
    {
      this.customFieldValidate = true;
    }
    else if(obj !== ''){
      this.customFieldValidate = false;
    }
  }

  showcreatfield() {
    this.showCFMD = true;
  }

  addNewField1(obj1, obj2) {  

    // if(this.newrequired == false)
    // {
    //   this.newrequiredfield = '0';
    // }
    // else if(this.newrequired == true)
    // {
      // this.newrequiredfield = '1';
    // }
    if(this.mandatoryFieldCheckBoxFlag)
      this.newrequiredfield='1';
    else
    this.newrequiredfield='0';

    if(obj1 === '' || obj2 === '' )
    {
      this.customFieldValidate = true;
    }
    else if( obj1 === ''  || obj2 !== ''){
      this.customFieldValidate = false;
    }

    
    if(this.newFieldType === '' || this.newFieldType === undefined || this.newFieldType === null)
    {
      this.customFieldValidateType = true;
    }
    else if(this.newFieldType !== '' && this.newFieldType !== undefined && this.newFieldType !== null){
      this.customFieldValidateType = false;
    }

    this.addNewFieldClass = new AddNewField();
    this.curId = undefined;
    this.addNewFieldClass.org_id = this.cookieService.get('_PAOID');
    // this.addNewFieldClass.user_id  = this.cookieService.get('_userID');
    this.addNewFieldClass.profile = 'UserProfile';
    this.addNewFieldClass.fields = [];
    this.newFieldKeysClass = new NewFieldKeys();
    this.newFieldKeysClass.label = this.newFieldLabel;
    this.newFieldKeysClass.datatype = this.newFieldType;
    this.newFieldKeysClass.placeholder_name = this.newPlaceholdername;
    this.newFieldKeysClass.is_required = this.newrequiredfield;

    if(this.dropRadioValues == '') {
      delete this.newFieldKeysClass.value;
    } else {
      let tempArr = this.dropRadioValues.split(",");
      this.newFieldKeysClass.value = tempArr;
    }

    this.addNewFieldClass.fields.push(this.newFieldKeysClass);

    // this.showCFMD = false;

    if(this.authService.canActivate()){

      if (this.newFieldType != '' && this.newFieldLabel != '' && this.newPlaceholdername != '') {
        this.showload = true;
        var body = this.addNewFieldClass;
        console.log("body checking:__",body)
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        return this.http.post(credentials.host + '/cf_add', body,{headers: headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
            data => {
              this.showCFMD = true;
              this.newFieldType = '';
              this.newFieldLabel = '';
              this.newPlaceholdername ='';
              if(data.success == true){
               
                // this.showMsg = data.message;
                // this.saveMsg = true;
                this._notifications.create('',data.message, 'info', {timeOut: 3000})
                setTimeout(()=>{
                  // $('#createfields').modal('hide');
                  this.saveMsg = false;
                  this.getCreatedCustomFieldList();
                  this.getTenantAllUsers();
                  },4000);
              } else{
                // this.showMsg = data.message;
                // this.saveMsg = true;
                this._notifications.create('',data.message, 'error')
                // $('#createfields').modal('hide');
                setTimeout(()=>{
                  this.saveMsg = false;

                },4000);
              }
            },
            error => {
              // this.showCFMD = false;
              this.showload = false;
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

    }

  }

  addNewField(obj1, obj2, closeModel?:string) {
    const pattern1 = /^[^\s].*/;
    this.label = false;
    this.fieldtype = false;
    this.placehoder =false;
    if (this.newFieldLabel == "" || this.newFieldLabel == null || this.newFieldLabel.length == 0) {
      this.label = true;
    }
    if (this.newFieldType == "" || this.newFieldType == null || this.newFieldType.length == 0) {
      this.fieldtype = true;
    }
    if (this.newPlaceholdername == "" || this.newPlaceholdername == null || this.newPlaceholdername.length == 0) {
      this.placehoder = true;
    }
    // if(this.newrequired == false)
    // {
    //   this.newrequiredfield = '0';
    // }
    // else if(this.newrequired == true)
    // {
    //   this.newrequiredfield = '1';
    // }

    if(this.mandatoryFieldCheckBoxFlag)
      this.newrequiredfield = '1';
    else
      this.newrequiredfield = '0';


    if(obj1 === '' || obj2 === '' )
    {
      this.customFieldValidate = true;
    }
    else if( obj1 === ''  || obj2 !== ''){
      this.customFieldValidate = false;
    }

    
    if(this.newFieldType === '' || this.newFieldType === undefined || this.newFieldType === null)
    {
      this.customFieldValidateType = true;
    }
    else if(this.newFieldType !== '' && this.newFieldType !== undefined && this.newFieldType !== null){
      this.customFieldValidateType = false;
    }

    this.addNewFieldClass = new AddNewField();
    this.curId = undefined;
    this.addNewFieldClass.org_id = this.cookieService.get('_PAOID');
    // this.addNewFieldClass.user_id  = this.cookieService.get('_userID');
    this.addNewFieldClass.profile = 'UserProfile';
    this.addNewFieldClass.fields = [];
    this.newFieldKeysClass = new NewFieldKeys();
    this.newFieldKeysClass.label = this.newFieldLabel;
    this.newFieldKeysClass.datatype = this.newFieldType;
    this.newFieldKeysClass.placeholder_name = this.newPlaceholdername;
    this.newFieldKeysClass.is_required = this.newrequiredfield;

    if(this.dropRadioValues == '') {
      delete this.newFieldKeysClass.value;
    } else {
      let tempArr = this.dropRadioValues.split(",");
      this.newFieldKeysClass.value = tempArr;
    }

    this.addNewFieldClass.fields.push(this.newFieldKeysClass);

    // this.showCFMD = false;

    if(this.authService.canActivate()){

      if (this.newFieldType != '' && this.newFieldLabel != '' && this.newPlaceholdername != '') {
        this.showload = true;
        var body = this.addNewFieldClass;
        console.log("body checking:__111",body)
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        return this.http.post(credentials.host + '/cf_add', body,{headers: headers})
        
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
            data => {
              // this.showCFMD = false;
              this.newFieldType = '';
              this.newFieldLabel = '';
              this.newPlaceholdername ='';
              if(data.success == true){
                if(closeModel=='yes')
                  this.createfields.nativeElement.click();
                console.log('data is true!')
                // this.showMsg = data.message;
                // this.saveMsg = true;
                this._notifications.create('',data.message, 'info', {timeOut: 3000})
                //  $('#createfields').modal('hide');
                setTimeout(()=>{
                  this.saveMsg = false;
                  this.getCreatedCustomFieldList();
                  this.getTenantAllUsers();
                  this.getAllRoles();
                  },4000);
              } else{
                console.log('data is false!')
                // this.showMsg = data.message;
                // this.saveMsg = true;
                this._notifications.create('',data.message, 'error', {timeOut: 3000})
                $('#createfields').modal('hide');
                setTimeout(()=>{
                  this.saveMsg = false;

                },4000);
                this.showload=false;
                return;
              }
            },
            error => {
              // this.showCFMD = false;
              this.showload = false;
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

    }

  }

  cancelNewField() {
    this.showCFMD = false;
    this.newFieldType = '';
    this.newFieldLabel = '';
    this.newPlaceholdername = '';
    $('#createfields').modal('hide');

  }

  showCusPop() {
    this.showCFMD = true;
    this.showAddFieldValue = false;
  }

  curEditableField(val) {
    this.showAddFieldValue = undefined;
    this.editablePopup = true;
    this.newFieldLabel = val.label;
    this.newFieldType = val.datatype;
    this.newPlaceholdername = val.placeholder_name;
    this.curId = val.id;
  }


  cancelEditField() {
    this.showAddFieldValue = false;
    this.editablePopup = false;
    this.newFieldType = '';
    this.newFieldLabel = '';
    this.newPlaceholdername = '';
  }

  editLabelName() {
    this.editLabelNameClass = new EditLabelNames();
    this.editLabelNameClass.org_id = this.cookieService.get('_PAOID');
    // this.editLabelNameClass.user_id = this.cookieService.get('_userID');
    this.editLabelNameClass.profile = 'UserProfile';
    this.editLabelNameClass.id = this.curId;
    this.editLabelNameClass.label = this.newFieldLabel;
    this.editLabelNameClass.placeholder_name = this.newPlaceholdername;
    

    if (this.authService.canActivate()) {
      if(this.newFieldLabel != '' && this.newPlaceholdername != '') {
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
          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e);
          })

          .subscribe(
            data => {
              this.showCFMD = false;
              this.editablePopup = false;
              this.newFieldType = "";
              this.newFieldLabel = "";
              this.newPlaceholdername = "";
              this.curId = undefined;
              if (data.success == true) {
                // this.showMsg = data.message;
                // this.saveMsg = true;
                this._notifications.create("", data.message, "info", {timeOut: 3000});
                setTimeout(() => {
                  this.saveMsg = false;
                  this.getCreatedCustomFieldList();
                  this.getTenantAllUsers();
                }, 4000);
              } else {
                // this.showMsg = data.message;
                // this.saveMsg = true;
                this._notifications.create("", data.message, "error", {timeOut: 3000});
                setTimeout(() => {
                  this.saveMsg = false;
                }, 4000);
              }
            },
            error => {
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

  }

  deleteField(){
    var deleteStructure;
    deleteStructure = new EditLabelNames();
    deleteStructure.org_id = this.cookieService.get('_PAOID');
    // deleteStructure.user_id = this.cookieService.get('_userID');
    deleteStructure.profile = 'UserProfile';
    deleteStructure.id = this.curId;
    delete deleteStructure.label;

    this.showCFMD = false;
    this.editablePopup = false;
    this.newFieldType = "";
    this.newFieldLabel = "";
    this.newPlaceholdername = "";

    if (this.authService.canActivate()) {
      this.showload = true;
      var body = deleteStructure;
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      return this.http
        .post(credentials.host + "/cf_delete", body, { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          data => {
            // this.showCFMD = false;
            this.editablePopup = false;
            this.newFieldType = "";
            this.newFieldLabel = "";
            this.newPlaceholdername = "";
            this.curId = undefined;
            if (data.success == true) {
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create("", data.message, "info", {timeOut: 3000});
              setTimeout(() => {
                this.saveMsg = false;
                this.getCreatedCustomFieldList();
                this.getTenantAllUsers();
              }, 4000);
            } else {
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create("", data.message, "error", {timeOut: 3000});
              setTimeout(() => {
                this.saveMsg = false;
              }, 4000);
            }
          },
          error => {
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

  addNewCFField(){
    this.customFieldValidate = false;
    this.showAddFieldValue = true
  }

  getApproveUserDetails() {
    this.showload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +"/get_self_registered_users/" + this.cookieService.get('_PAOID'), {headers : headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {
        this.showload = false;
        this.approveTabData = data;
        },
        error => {
          this.showload = false;
          console.log(error);
        }
    );
  }

  getSelfRegistrationMetaData() {
    const header = new Headers();
    header.append('Content-Type', 'application/json');

    this.http.get(credentials.accountHost + '/get_self_registration_metadata' , {headers: header})
    .map(res => res.json())
    .subscribe(
      data => {
        this.selfRegisterMetaData = data;
        this.getApproveUserDetails();
      },
      error => {
        this.showload = false;
        console.log(error);
      }
    )

  }

  viewCurrentUser(template: TemplateRef<any>, val) {
    this.currentUserDetails = val;

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-md' },this.config),

    );

  }

  viewConfirmation(template: TemplateRef<any>, val, ID) {
    this.selectedIDs = ID;
    this.confirmMsgVal = val;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-sm' },this.config),

    );
  }

  editApproveUser(template: TemplateRef<any>) {
    this.modalRef.hide();
    setTimeout(() => {

      this.employee_type = this.currentUserDetails.employee_type;
      this.first_name = this.currentUserDetails.first_name;
      this.last_name = this.currentUserDetails.last_name;
      this.employee_id = this.currentUserDetails.employee_id;

      this.country = this.currentUserDetails.country;
      this.department = this.currentUserDetails.department;
      this.supervisorName = this.currentUserDetails.supervisor_name;
      this.supervisorEmail = this.currentUserDetails.supervisor_email;
      let stringVal;
      stringVal = this.currentUserDetails.user_email.split('@');
      let lastVal;
      lastVal = stringVal[stringVal.length-1];
      this.selectedEmailEnd = lastVal;
      this.user_email = stringVal[0];



      let curDeptVal;
      curDeptVal = this.selfRegisterMetaData.meta_datas.supervisor_details.country.filter(obj => obj.country_name === this.country);
      this.currentDepartments = curDeptVal[0];

      let curSupers;
      curSupers = this.currentDepartments.department.filter(obj => obj.department_name === this.department);

      this.currentSupervisors = curSupers[0];

      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: ' modal-md' },this.config),
      );
    },5);
  }

  editCloseApprove(template: TemplateRef<any>) {
    this.modalRef.hide();

    this.employee_type = undefined;
    this.first_name = undefined;
    this.last_name = undefined;
    this.employee_id = undefined;
    this.user_email = undefined;
    this.country = undefined;
    this.department = undefined;
    this.supervisorName = undefined;
    this.supervisorEmail = undefined;
    this.selectedEmailEnd = undefined;

    // setTimeout(() => {
    //   this.modalRef = this.modalService.show(
    //     template,
    //     Object.assign({}, { class: ' modal-md' },this.config),
    //   );
    // },5);
  }

  selectCountry(ind) {
    this.contInd = ind;
    this.currentDepartments = undefined;
    this.currentDepartments = this.selfRegisterMetaData.meta_datas.supervisor_details.country[ind];
    this.country = this.currentDepartments.country_name;
    this.deptInd = undefined;
    this.supsInd = undefined;
    this.department = undefined;
    this.supervisorName = undefined;
    this.currentSupervisors = undefined;
  }

  selectDepartments(ind) {
    if (this.currentDepartments !== undefined) {
      this.deptInd = ind;
      this.supsInd = undefined;
      this.supervisorName = undefined;
      this.currentSupervisors = this.currentDepartments.department[this.deptInd];
      this.department = this.currentSupervisors.department_name;
    }
  }

  chooseSupsEmail(ind) {
    this.supsInd = ind;
    this.supervisorName = this.currentSupervisors.supervisors[ind].supervisor_name;
    this.supervisorEmail = this.currentSupervisors.supervisors[ind].supervisor_email;
  }

  updateUserDet() {

    this.showError = false;

    if (this.currentSupervisors !== undefined) {
      this.supervisorName = this.currentSupervisors.supervisors[0].supervisor_name;
      this.supervisorEmail = this.currentSupervisors.supervisors[0].supervisor_email;
    }

    if (this.employee_type === undefined || this.employee_type === '' ||
      this.first_name === undefined || this.first_name === '' ||
      this.last_name === undefined || this.last_name === '' ||
      this.employee_id === undefined || this.employee_id === '' ||
      this.user_email === undefined || this.user_email === '' ||
      this.country === undefined || this.country === '' ||
      this.department === undefined || this.department === '' ||
      this.supervisorName === undefined || this.supervisorName === '' ||
      this.supervisorEmail === undefined || this.supervisorEmail === '' ||
      this.selectedEmailEnd === undefined || this.selectedEmailEnd === '') {
        this.showError = true;
      }

      if (this.showError == false) {
        this.selfRegistrationUpdate = new SelfRegistrationUpdate();
        this.selfRegistrationUpdate.id = this.currentUserDetails.id;
        this.selfRegistrationUpdate.employee_type = this.employee_type;
        this.selfRegistrationUpdate.first_name = this.first_name;
        this.selfRegistrationUpdate.last_name = this.last_name;
        this.selfRegistrationUpdate.employee_id = this.employee_id;
        this.selfRegistrationUpdate.user_email = this.user_email + '@' + this.selectedEmailEnd;
        this.selfRegistrationUpdate.country = this.country;
        this.selfRegistrationUpdate.department = this.department;
        this.selfRegistrationUpdate.supervisor_name = this.supervisorName;
        this.selfRegistrationUpdate.supervisor_email = this.supervisorEmail;
        this.selfRegistrationUpdate.org_id = this.cookieService.get('_PAOID');

        this.showload = true;
        const body = this.selfRegistrationUpdate;
          const headers = new Headers();
          headers.append("Content-Type", "application/json");
          headers.append(
            "Authorization",
            "Bearer " + this.cookieService.get("_PTBA")
          );

          return this.http.post(credentials.host + '/update_self_registered_users', body, {headers: headers})
          .map(res => res.json())
          .subscribe(
               data => {

                if (data.success === true) {
                  this._notifications.create('',data.message, 'info', {timeOut: 3000});
                  this.getApproveUserDetails();
                  this.modalRef.hide();
                } else {
                  this.showload= false;
                  this._notifications.create('',data.message, 'error');
                }

               },
               error => {
                this.modalRef.hide();
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
  }

  approveReject() {

    let tempArr;
    tempArr = [];
    tempArr.push(this.selectedIDs);
    let tempObj;
    tempObj = new Object({
      employee_ids: tempArr
    });

    this.showload = true;

    const body = tempObj;
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );

      return this.http.post(credentials.host + '/self_registered_users_status' + '/' + this.confirmMsgVal, body, {headers: headers})
      .map(res => res.json())
      .subscribe(
            data => {

              if (data.success === true) {
                this._notifications.create('',data.message, 'info', {timeOut: 3000});
                this.getApproveUserDetails();
                this.getTenantAllUsers();
                this.modalRef.hide();
              } else {
                this.showload= false;
                this._notifications.create('',data.message, 'error');
              }

            },
            error => {
            this.modalRef.hide();
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

  selectEmployeeType(val) {
    this.employee_type = val;
  }

  selectEmailDomain(val) {
    this.selectedEmailEnd = val;
  }


  closePopover(){
    this.popOver.nativeElement.click();
  }




}
