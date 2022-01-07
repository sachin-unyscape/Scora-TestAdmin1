import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import { FormsModule,FormGroup,FormBuilder,FormArray } from '@angular/forms';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import{credentials} from '../../credentials';
import { trigger, state, style, animate, transition } from '@angular/animations';

//cookie
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { NotificationsService } from 'angular2-notifications';
import { GetItemService } from '../../get-item.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    // backdrop: true,
    // ignoreBackdropClick: true,
    // keyboard : false
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(private modalService: BsModalService, private http:Http, public router: Router,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,private _notifications: NotificationsService,public GetItemService:GetItemService) { }

  public showError = '';
  public saveMSg;
  public showMsg;
  public fullpageload;
  public uplodedFileDetails;
  public currentModel;
  public valueExist;
  public valuesExists;
  public batchListData;
  public selectedBatch;
  public userProfileValue;
  public userResponseValue;
  public QP_rankValue;
  public disableDownload : boolean = false;
  public enableExcludeItem: Boolean = false;
  public showManualScoraId: Boolean = false;
  public openRedownloadPopup : boolean = false;
  public showNegativeScenario : boolean = false;
  public unselectingProfileValues : boolean = false;
  public unselectingresponseValues : boolean = false;
  public unselectingqpValues : boolean = false;
  public popupNumber: Number;
  public showMatchDescription : boolean = false;
  public showUserResponse : boolean = false;
  public batchValue: any = [];
  public scoraItem_id: any;

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
    this.popupNumber = 0;
    this.showNegativeScenario = false;
    this.userProfileValue = undefined;
    this.userResponseValue = undefined;
    this.QP_rankValue = undefined;
    this.getBatchList()
    this.getUploadedFiles();
  }

  // 5 menus api calls

  ProcessUserData(){
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/create_user_response/"+ this.cookieService.get('_PAOID'),{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.fullpageload = false;
          if(data.success == true){
          this._notifications.create('',data.message, 'info');
          }else{
            this._notifications.create('',data.message, 'error')
          }
        },

          error => {

            this.fullpageload= false;
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

  EmailReport(){
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/test_report/"+ this.cookieService.get('_PAOID'),{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.fullpageload = false;
          if(data.success == true){
          this._notifications.create('',data.message, 'info');
          }else{
            this._notifications.create('',data.message, 'error')
          }
        },

          error => {

            this.fullpageload= false;
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


  emailRanking(){
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/subject_track_rank/"+ this.cookieService.get('_PAOID'),{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.fullpageload = false;
          if(data.success == true){
          this._notifications.create('',data.message, 'info');
          }else{
            this._notifications.create('',data.message, 'error')
          }
        },

          error => {

            this.fullpageload= false;
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

  emailThemeReport(){
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/theme_rank/"+ this.cookieService.get('_PAOID'),{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.fullpageload = false;
          if(data.success == true){
          this._notifications.create('',data.message, 'info');
          }else{
            this._notifications.create('',data.message, 'error')
          }
        },

          error => {

            this.fullpageload= false;
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

  // 5 menus api calls ends


  // get uploaded files list

  getUploadedFiles(){

    if(this.authService.canActivate()){
      this.fullpageload = false;
      // this.fullpageload = true;
      // var headers = new Headers();
      // headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      // this.http.get(credentials.host +"/files_list/"+ this.cookieService.get('_PAOID'),{headers : headers})
      // .map(res => res.json())
      // .catch((e: any) =>{
      //   return Observable.throw(e)
      // } )

      // .subscribe(
      //   data => {

      //     this.fullpageload = false;
      //     this.uplodedFileDetails = data;
      //   },

      //     error => {

      //       this.fullpageload= false;
      //       if(error.status == 404){
      //         this.router.navigateByUrl('pages/NotFound');
      //       }
      //       else if(error.status == 401){
      //         this.cookieService.deleteAll();
      //         window.location.href=credentials.accountUrl;
      //         // window.location.href=credentials.accountUrl;
      //       }
      //       else{
      //         this.router.navigateByUrl('pages/serverError');
      //       }

      //     }
      // );
    }
  }


  // view file details

  ViewFileDetails(file_id,file_type){
    if(file_type == 'User Profile Data' || file_type == 'User Response Data'){
      if(this.authService.canActivate()){
        this.fullpageload = true;
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.get(credentials.host +"/view_file_details/"+ this.cookieService.get('_PAOID')+'/'+file_id + '/'+1+'/'+20,{headers : headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
          data => {

            this.fullpageload = false;
            this.GetItemService.getFileUploadDetailsToView(data);
            this.router.navigateByUrl('/Upload/ViewFileDetails');
          },

            error => {

              this.fullpageload= false;
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
    }else if(file_type == 'Items'){
      this.GetItemService.getBulkUploadedIds(file_id);
      this.router.navigate(['Items/bulkuploadItems']);
    }
  }

  openbatchModel(dropVal, template: TemplateRef<any>) {
    this.showMatchDescription = true;
    this.popupNumber = dropVal;
    this.currentModel = dropVal;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-sm' }),
    );
    this.showNegativeScenario = false;
    this.userProfileValue = undefined;
    this.userResponseValue = undefined;
    this.QP_rankValue = undefined;
    this.batchValue = undefined;
    this.enableExcludeItem = false;
    this.showManualScoraId = false;
    this.scoraItem_id = '';
  }
  selectBatchValue(data){
    this.userResponseValue = undefined;
    this.batchValue = data.response_value;
    this.userProfileValue = data.profile_id;
  }

  enableExclude(status){
    this.enableExcludeItem = !this.enableExcludeItem;
    if(this.enableExcludeItem === true){
      this.showManualScoraId = true;
    }
    else if(this.enableExcludeItem === false){
      this.showManualScoraId = false;
      this.scoraItem_id = '';
    }
  }

  sendAndDownload(data) {
    var scoraIds = [];
    if(data === ''){
      scoraIds = [];
    }
    else{
      var scoraItemId = this.scoraItem_id.split(",");
      scoraIds = scoraItemId.map(Number)
    }
    if (this.popupNumber == 1 || this.popupNumber == 3) {
      if(this.userResponseValue === undefined || this.userProfileValue === undefined){
        this.disableDownload = true;
        this.unselectingProfileValues = true;
        this.showNegativeScenario = true;
      }
      else{
        this.disableDownload = false;
        this.unselectingProfileValues = false;
        this.showNegativeScenario = false;
      }
    } else if (this.popupNumber == 2) {
      if(this.userResponseValue === undefined || this.userProfileValue === undefined || this.QP_rankValue === undefined){
        this.disableDownload = true;
        this.unselectingProfileValues = true;
        this.showNegativeScenario = true;
      }
      else{
        this.disableDownload = false;
        this.unselectingProfileValues = false;
        this.showNegativeScenario = false;
      }
    }

    if(this.popupNumber == 1 && this.userProfileValue != undefined && this.userResponseValue != undefined) {
      if(this.authService.canActivate()){
        this.modalRef.hide();
        this.showMatchDescription = false;
        this.fullpageload = true;

        let body;
        let tempObj = new Object({
          items: scoraIds
        });
        body = tempObj
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.post(credentials.host +"/test_report/"+ this.cookieService.get('_PAOID') + '/' + this.userProfileValue + '/' + this.userResponseValue, body, {headers : headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
          data => {
            this.valueExist = data.is_exist;
            this.fullpageload = false;
            if(this.valueExist === false){
              if(data.success == true){
                this._notifications.create('',data.message, 'info');
                }else{
                  this._notifications.create('',data.message, 'error')
                }
            }
            else{
              this.openRedownloadPopup = true;
            }

          },

            error => {

              this.fullpageload= false;
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
    } else if (this.popupNumber == 2 && this.userProfileValue != undefined && this.userResponseValue != undefined && this.QP_rankValue != undefined) {
      if(this.authService.canActivate()){
        this.modalRef.hide();
        this.showMatchDescription = false;
        this.fullpageload = true;
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.get(credentials.host +"/rank_dumbing/"+ this.cookieService.get('_PAOID') + '/' + this.userProfileValue + '/' + this.userResponseValue + '/' + this.QP_rankValue, {headers : headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
          data => {
            this.valuesExists = data.is_exist;
            this.fullpageload = false;
            if(this.valuesExists === false){
              if(data.success == true){
                this._notifications.create('',data.message, 'info');
                }else{
                  this._notifications.create('',data.message, 'error')
                }
            }
            else{
              this.openRedownloadPopup = true;
            }

          },

            error => {

              this.fullpageload= false;
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
    } else if (this.popupNumber == 3 && this.userProfileValue != undefined && this.userResponseValue != undefined) {
      if(this.authService.canActivate()){
        this.modalRef.hide();
        this.showMatchDescription = false;
        this.fullpageload = true;

        let body;
        let tempObj = new Object({
          items: scoraIds
        });
        body = tempObj

        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.post(credentials.host +"/theme_rank/"+ this.cookieService.get('_PAOID') + '/' + this.userProfileValue + '/' + this.userResponseValue, body, {headers : headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
          data => {

            this.fullpageload = false;
            if(data.success == true){
            this._notifications.create('',data.message, 'info');
            }else{
              this._notifications.create('',data.message, 'error')
            }
          },

            error => {

              this.fullpageload= false;
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
  }

  reDownloadReports(){
    if(this.popupNumber == 1) {
      var scoraIds = [];
      if(this.scoraItem_id === ''){
        scoraIds = [];
      }
      else{
        var scoraItemId = this.scoraItem_id.split(",");
        scoraIds = scoraItemId.map(Number)
      }
      // console.log(scoraIds);
      if(this.authService.canActivate()){
        this.openRedownloadPopup = false
        this.fullpageload = true;

        let body;
        let tempObj = new Object({
          items: scoraIds
        });
        body = tempObj

        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.post(credentials.host +"/test_report/"+ this.cookieService.get('_PAOID') + '/' + this.userProfileValue + '/' + this.userResponseValue + '/' + 1, body, {headers : headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
          data => {
            if(data.success == true){
              this._notifications.create('',data.message, 'info');
              }else{
                this._notifications.create('',data.message, 'error')
              }            this.fullpageload = false;
          },

            error => {
              this.fullpageload= false;
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
    } else if (this.popupNumber == 2) {
      if(this.authService.canActivate()){
        this.fullpageload = true;
        this.openRedownloadPopup = false
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.get(credentials.host +"/rank_dumbing/"+ this.cookieService.get('_PAOID') + '/' + this.userProfileValue + '/' + this.userResponseValue + '/' + this.QP_rankValue+ '/' + 1, {headers : headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
          data => {
            if(data.success == true){
              this._notifications.create('',data.message, 'info');
              }else{
                this._notifications.create('',data.message, 'error')
              }           this.fullpageload = false;
          },

            error => {
              this.fullpageload= false;
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
  }

  cancelSendAndDonwload() {
    this.showMatchDescription = false
    this.currentModel = undefined;
    this.selectedBatch = undefined;
    this.modalRef.hide();
  }

  getBatchList() {
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/batch_no_list/"+ this.cookieService.get('_PAOID'),{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {
          this.fullpageload = false;
          this.batchListData = data;
        },

          error => {

            this.fullpageload= false;
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


}
