import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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

@Component({
  selector: 'app-print-certificates',
  templateUrl: './print-certificates.component.html',
  styleUrls: ['./print-certificates.component.scss']
})
export class PrintCertificatesComponent implements OnInit {

  @ViewChild('getPDF')
  getPDFZIP: ElementRef;

  constructor(private http:Http, public router: Router,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,private _notifications: NotificationsService,public getItemService:GetItemService) { }


  public showError = '';
  public saveMSg;
  public showMsg;
  public fullpageload;
  public FileDataTypeSelected;
  public reviewerList;
  public reviewer;
  public reviewWorkFlowFlag;
  public selectedFileName;
  public currentFileUploadId;
  public getZipURL;
  public uploadingMsg;

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
    this.uploadingMsg = '';
    this.getZipURL = '';
    this.selectedFileName = '';
    this.metaData();
    this.reviewWorkFlowFlag = this.getItemService.sendReviewWrkFlwFlag();
  }

  deleteSelectedFile() {
    this.selectedFileName = '';
    this.getPDFZIP.nativeElement.value = '';
    this.getZipURL = '';
  }

  // upload test detail api----- not in use
  uploadExcel(event) {

    if(this.authService.canActivate()){

      let fileList: FileList = event.target.files;

      this.showError = '';
      // $(this).fileList[0].name.split('.').pop();
      if(fileList[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

          if(fileList.length > 0) {
              let file: File = fileList[0];

              this.fullpageload = true;
              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id',this.cookieService.get('_PAOID'));

              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.host +'/create_users_tests_groups', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.fullpageload = false;

                        if(data.success == true){

                        // this.saveMSg = true;
                        // this.showMsg = data.message;
                        this._notifications.create('',data.message, 'info');

                        }else if(data.success == false){
                          this.showError =  data.message;

                        }
                      },
                      error => {

                        this.fullpageload  = false;
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

      }else{
        this.showError = "Invalid extension for file "+fileList[0].name+". Only .xlsx files are supported.";
          setTimeout(()=>{
            this.showError = '';
        },10000);
      }
    }
  }


  // upload test detail api Ends----- not in use


  // meta data to bind reviewer
  metaData(){
        
    localStorage.removeItem('TZNM');
    localStorage.removeItem('TZNMVL');
    if(this.authService.canActivate()){
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/get_metadatas/"+this.cookieService.get('_PAOID'),{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {
              
        localStorage.setItem('TZNM' , data.timezone_name);
        localStorage.setItem('TZNMVL' , data.timezone_value);
         this.fullpageload = false;
         this.reviewerList = data.reviewers_without_auth_user;
         this.getItemService.getMetaDataDetails(data);
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
            this.router.navigateByUrl('pages/serverError');
          }
        },
      );


    }
  }





  uploadFileDataExcel(event){

    if(this.authService.canActivate()){
      this.getZipURL = '';
      let fileList: FileList = event.target.files;


      this.showError = '';
      if(fileList[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

        if(fileList.length > 0) {

            let file: File = fileList[0];
            this.uploadingMsg = 'Please wait. Uploading the template.';
            this.fullpageload = true;
            let body = new FormData();
            body.append('file', file, file.name);
            body.append('org_id',this.cookieService.get('_PAOID'));
            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
            this.http.post(credentials.host + '/upload_certificate', body,{headers:headers})
            .map(res => res.json())
            .catch(error => Observable.throw(error))

                .subscribe(
                    data => {
                      this.fullpageload = false;
                      this.uploadingMsg = '';
                      this.getZipURL = '';
                      if(data.success == true){
                      this.selectedFileName = fileList[0].name;
                      this.currentFileUploadId = data.upload_id;
                      this._notifications.create('',data.message, 'info');

                      }else if(data.success == false){
                        this.showError =  data.message;
                      }
                    },
                    error => {
                      this.uploadingMsg = '';
                      this.fullpageload  = false;
                      if(error.status == 404){
                        this.router.navigateByUrl('pages/NotFound');
                      }
                      else if(error.status == 401){
                        this.cookieService.deleteAll();
                        window.location.href=credentials.accountUrl;
                      }
                      else{
                        this.router.navigateByUrl('pages/serverError');
                      }

                    }
                )

        }

      }else{
        this.showError = "Invalid extension for file "+fileList[0].name+". Only .xlsx files are supported.";
          setTimeout(()=>{
            this.showError = '';
        },10000);
      }

    }
  }


  public toggled(open: boolean): void {

  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
  }

  generatePDF() {
    this.fullpageload = true;
    this.uploadingMsg = 'Please wait. We are generating the certificates. Click on download button to download the certificates.';
    if (this.authService.canActivate()) {
      let headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http
        .get(credentials.host + "/generate_pdf/" + this.currentFileUploadId, { headers: headers })
        .map(res => res.json())
        .catch(error => Observable.throw(error))

        .subscribe(
          data => {
            this.fullpageload = false;
            this.uploadingMsg = '';
            if (data.success == true) {
              this.getZipURL = credentials.host + "/download_zip/" + this.currentFileUploadId;
              this._notifications.create("", data.message, "info");
            } else if (data.success == false) {
              this.showError = data.message;
            }
          },
          error => {
            this.fullpageload = false;
            this.uploadingMsg = '';
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = "http://scora.io:5200";
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    }
  }

  downloadZIP() {
    if (this.authService.canActivate()) {
      let headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http
        .get(credentials.host + "/download_zip/" + this.currentFileUploadId, { headers: headers })
        .map(res => res.json())
        .catch(error => Observable.throw(error))

        .subscribe(
          data => {
            this.fullpageload = false;

            if (data.success == true) {
              this._notifications.create("", data.message, "info");
            } else if (data.success == false) {
              this.showError = data.message;
            }
          },
          error => {
            this.fullpageload = false;
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = "http://scora.io:5200";
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    }
  }


}
