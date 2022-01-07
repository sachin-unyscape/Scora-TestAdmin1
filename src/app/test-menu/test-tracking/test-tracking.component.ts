import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { credentials } from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { IMyDpOptions } from 'mydatepicker';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GetItemService } from '../../get-item.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService } from 'angular2-notifications';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TemplateRef } from '@angular/core/src/linker/template_ref';
import { ViewSolutions } from "./view-solutions";

@Component({
  selector: 'app-test-tracking',
  templateUrl: './test-tracking.component.html',
  styleUrls: ['./test-tracking.component.scss']
})

export class TestTrackingComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  };


  constructor(private http: Http, private router: Router, public route: ActivatedRoute, private cookieService: CookieService, private authService: AuthServiceService, public getItemService: GetItemService, private modalService: BsModalService, private _notifications: NotificationsService, public sanitizer: DomSanitizer) { }


  public viewSolutions: ViewSolutions;
  public showLoad = false;
  public scheduleInstanceDet;
  public testStatus;
  public scheduleId;
  public userID;
  public userStatus;
  public timeZoneName;
  public alertType;
  public etm_Data;
  public viewSolutionsData;
  public viewSolutionItems;
  public curItemIndex;
  public curSecId;
  public explanationView;
  public ETM_excelFileUrl;
  public testInstance_details = [];
  public Notificationoptions = {
    position: ["center"],
    timeOut: 4000,
    lastOnBottom: true,
    showProgressBar: true,
    preventDuplicates: true,
    animate: "scale",
    pauseOnHover: false,
    clickToClose: false,
    clickIconToClose: false


  }

  ngOnInit() {
    this.curItemIndex = null;
    this.explanationView = false;
    this.curSecId = null;
    this.timeZoneName = localStorage.getItem('TZNM')
    this.viewSolutionItems = false;
    this.getScheduleInstanceDetails();
  }
  // ngOnDestroy() {
  //   this.modalRef.hide();
  // }

  getScheduleInstanceDetails() {
    if (this.authService.canActivate()) {
      this.showLoad = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/test_instance_details/" + this.cookieService.get('_PAOID') + '/' + this.getItemService.sendTestId() + '/' + this.getItemService.sendScheduleId(), { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
          data => {
            var temp = [];
            this.showLoad = false;
            this.scheduleInstanceDet = data;
            for(let data of this.scheduleInstanceDet){
              temp = data.test_attended_attempt_details;
			  //temp.push(data.test_attended_attempt_details);
			  this.testInstance_details = temp;
            }
			
            
          },

          error => {

            this.showLoad = false;
            if (error.status == 404) {
              this.router.navigateByUrl('pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href=credentials.accountUrl;
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }

          }
        );
    }
  }

  terminateStatus(test_status, scheduleId, userID, user_status, template: TemplateRef<any>, alertType) {
    switch (alertType) {
      case 'terminate':
        if (test_status != 'Offline') {
          this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' }, this.config));
        }
        break;
      case 'deactivate':
        if (test_status != 'Debar' && test_status != 'Deactive') {
          this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' }, this.config));
        }
        break;
      case 'activate':
        if (test_status != 'Terminate' && test_status != 'Active' && test_status != 'Debar') {
          this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' }, this.config));
        }
        break;
      case 'debar':
        if (test_status != 'Debar') {
          this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' }, this.config));
        }
        break;
    }
    this.testStatus = test_status;
    this.scheduleId = scheduleId;
    this.userID = userID;
    this.userStatus = user_status;
    if (alertType === 'Terminate') {
      alertType = 'terminate';
    }
    this.alertType = alertType;
  }

  viewTestPopupClose() {
    this.modalRef.hide();
  }
  openExplanation(itemInd, secId) {
    this.curItemIndex = itemInd;
    this.curSecId = secId;
    this.explanationView = true;
  }
  etmInfo(instance_id, template: TemplateRef<any>) {
    this.viewSolutionItems = false;
    
    var formData: any = new FormData();
  formData.append("org_id", this.cookieService.get('_PAOID'));
  formData.append("test_instance_id", instance_id);
  formData.append("download", 0);

    this.showLoad = true;
    var body = formData;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.post('http://127.0.0.1:8000/rtm_data/', body, { headers: headers })
      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          this.showLoad = false;
          this.etm_Data = data;

          this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: ' modal-lg _eTMPop' }, this.config),

          );
        },
        error => {

          this.showLoad = false;
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

        }
      );
  }

  downloadMyFile(){
    this.showLoad = false; 
    const link = document.createElement('a');
    // link.setAttribute('target', '_blank');
    link.setAttribute('href', 'http://127.0.0.1:8000/' + this.ETM_excelFileUrl);
    // link.setAttribute('download', "Test Schedule Details_" +this.currentDate+ ","+ this.current_Time_Hour + ":" + this.current_Time_Minutes + ".xlsx");
    link.setAttribute('download', `ETM Details_.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  downlaod_etmInfo(instance_id){
    this.viewSolutionItems = false;
    
    var formData: any = new FormData();
  formData.append("org_id", this.cookieService.get('_PAOID'));
  formData.append("test_instance_id", instance_id);
  formData.append("download", 1);

    this.showLoad = true;
    var body = formData;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.post('http://127.0.0.1:8000/rtm_data/', body, { headers: headers })
      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          this.showLoad = false;     
          this.ETM_excelFileUrl = data.path;
          this.downloadMyFile();   
          console.log(data)
         
        },
        error => {

          this.showLoad = false;
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

        }
      );
  }

  viewSolutionsApiCall(index,curAttempt, scheduleId, testId, insId, userId) {
    
    var org_id =  this.cookieService.get('_PAOID');
    var orgId = Number(org_id)
    this.showLoad = true;

    var test_Id = Number(testId);

    this.viewSolutions = new ViewSolutions();

    this.viewSolutions.test_attempt_id = curAttempt;
    this.viewSolutions.org_id = orgId;
    this.viewSolutions.schedule_id = scheduleId;
    this.viewSolutions.test_id = test_Id;
    this.viewSolutions.test_instance_id = insId;
    this.viewSolutions.user_id = userId;

    var body = this.viewSolutions;
    this.showLoad = true;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.post(credentials.userHost + '/view_solutions' ,body, { headers: headers })
      .map(res => res.json())
      .catch((e: any) => {
        return Observable.throw(e)
      })

      .subscribe(
        data => {
          console.log("response read" + data)
          this.showLoad = false;
          if (data != undefined && data != null) {
            this.viewSolutionItems = true;
            this.viewSolutionsData = data;
          }

        },
        error => {
          this.showLoad = false;
        }
      );


  }

  changeUserStatus() {
    this.modalRef.hide();
    if (this.authService.canActivate()) {
      if ((this.userStatus == 1 && this.testStatus == 'Online') || (this.userStatus == 2 && (this.testStatus != 'Deactive' && this.testStatus != 'Debar')) || (this.userStatus == 3 && this.testStatus != 'Debar') || (this.userStatus == 4 && (this.testStatus != 'Active' && this.testStatus != 'Terminate' && this.testStatus != 'Debar'))) {
        this.showLoad = true;
		
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.get(credentials.host + "/user_status_change/" + this.cookieService.get('_PAOID') + '/' + this.scheduleId + '/' + this.userID + '/' + this.userStatus, { headers: headers })
          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {
              this.showLoad = false;
              if (data.success == true) {
                this._notifications.create('', data.message, 'info');
                this.getScheduleInstanceDetails();
              } else {
                this._notifications.create('', data.message, 'error');
              }

            },

            error => {

              this.showLoad = false;
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

            }
          );
      }
    }
  }

}
