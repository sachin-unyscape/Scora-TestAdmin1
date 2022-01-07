import { Component, OnInit } from '@angular/core';
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
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.scss']
})
export class TestDetailsComponent implements OnInit {

  constructor(private http:Http, public router: Router,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,private _notifications: NotificationsService,public getItemService:GetItemService) { }


  public showError = '';
  public saveMSg;
  public showMsg;
  public fullpageload;
  public FileDataTypeSelected;
  public reviewerList;
  public reviewer;
  public reviewWorkFlowFlag;
  public newBatchID;
  public batchListData;
  public UserProfileBatchNumber;
  public showLoadMessage;

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
    this.showLoadMessage = false;
    this.UserProfileBatchNumber = null;
    this.getBatchList();
    this.newBatchID = '';
    this.metaData();
    this.reviewWorkFlowFlag = this.getItemService.sendReviewWrkFlwFlag();
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
          console.log(this.batchListData)
        },

          error => {

            this.fullpageload= false;
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

  selectFileTypes() {
    this.newBatchID = '';
    this.UserProfileBatchNumber = null;
  }




  uploadFileDataExcel(event,filedatatype){
    if(this.authService.canActivate()){
      if(filedatatype == 1 || filedatatype == 2 && this.UserProfileBatchNumber != null){

        let fileList: FileList = event.target.files;

        this.showError = '';
        // $(this).fileList[0].name.split('.').pop();
        if(fileList[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

          if(fileList.length > 0) {
              let file: File = fileList[0];
              this.showLoadMessage = true;
              this.fullpageload = true;
              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id',this.cookieService.get('_PAOID'));
              body.append('file_data_type',filedatatype);
              body.append('batch_no',this.newBatchID);

              if (filedatatype ==  2) {
                body.append('profile_batch_no',this.UserProfileBatchNumber);
              }
              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.fileUploadHost, body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.fullpageload = false;
                        this.showLoadMessage = false;
                        if(data.success == true){
                          this.newBatchID = '';
                          this.FileDataTypeSelected = undefined;
                        this._notifications.create('',data.message, 'info');
                        setTimeout(()=>{
                          this.router.navigateByUrl('Upload/UploadedFiles');
                        },3000);


                        }else if(data.success == false){
                          this.showError =  data.message;

                        }
                      },
                      error => {

                        this.fullpageload  = false;
                        this.showLoadMessage = false;
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
      else if(filedatatype == 3){
        let fileList: FileList = event.target.files;

        this.showError = '';
        // $(this).fileList[0].name.split('.').pop();
        if(fileList[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

          if(fileList.length > 0) {
              let file: File = fileList[0];

              this.fullpageload = true;
              this.showLoadMessage = true;
              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id',this.cookieService.get('_PAOID'));
              body.append('reviewer',this.reviewer);
              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.host +'/items_import', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.fullpageload = false;
                        this.showLoadMessage = false;
                        if(data.success == true){
                        this.FileDataTypeSelected = undefined;
                        this._notifications.create('',data.message, 'info');
                        setTimeout(()=>{
                          this.router.navigate(['Items/viewitems', data.upload_id]);
                          },3000);

                        }else if(data.success == false){
                          this.showError =  data.message;

                        }
                      },
                      error => {

                        this.fullpageload  = false;
                        this.showLoadMessage = false;
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
      else if(filedatatype == 4){
        let fileList: FileList = event.target.files;

        this.showError = '';
        // $(this).fileList[0].name.split('.').pop();
        if(fileList[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

          if(fileList.length > 0) {
              let file: File = fileList[0];

              this.fullpageload = true;
              this.showLoadMessage = true;
              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id',this.cookieService.get('_PAOID'));
              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.host +'/create_match_details', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.fullpageload = false;
                        this.showLoadMessage = false;
                        if(data.success == true){
                        this.FileDataTypeSelected = undefined;
                        this._notifications.create('',data.message, 'info');


                        }else if(data.success == false){
                          this.showError =  data.message;

                        }
                      },
                      error => {

                        this.fullpageload  = false;
                        this.showLoadMessage = false;
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
      else if(filedatatype == 5){
        let fileList: FileList = event.target.files;

        this.showError = '';
        // $(this).fileList[0].name.split('.').pop();
        if(fileList[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

          if(fileList.length > 0) {
              let file: File = fileList[0];

              this.fullpageload = true;
              this.showLoadMessage = true;
              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id',this.cookieService.get('_PAOID'));
              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.host +'/users_import', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.fullpageload = false;
                        this.showLoadMessage = false;
                        if(data.success == true){
                        this.FileDataTypeSelected = undefined;
                        this._notifications.create('',data.message, 'info');
                        setTimeout(()=>{
                          this.router.navigate(['ManageUsers']);
                          },3000);


                        }else if(data.success == false){
                          this.showError =  data.message;

                        }
                      },
                      error => {

                        this.fullpageload  = false;
                        this.showLoadMessage = false;
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
      else if(filedatatype == 6){
        let fileList: FileList = event.target.files;

        this.showError = '';
        // $(this).fileList[0].name.split('.').pop();
        if(fileList[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

          if(fileList.length > 0) {
              let file: File = fileList[0];

              this.fullpageload = true;
              this.showLoadMessage = true;
              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id',this.cookieService.get('_PAOID'));
              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.host +'/bulk_attributes_import', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.fullpageload = false;
                        this.showLoadMessage = false;
                        if(data.success == true){
                        this.FileDataTypeSelected = undefined;
                        this._notifications.create('',data.message, 'info');
                        setTimeout(()=>{
                          this.router.navigate(['MetaData']);
                          },3000);


                        }else if(data.success == false){
                          this.showError =  data.message;

                        }
                      },
                      error => {

                        this.fullpageload  = false;
                        this.showLoadMessage = false;
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
      else if(filedatatype == 7) {
        console.log(this.newBatchID);

        let fileList: FileList = event.target.files;

        this.showError = '';
        // $(this).fileList[0].name.split('.').pop();
        if(fileList[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

          if(fileList.length > 0) {
              let file: File = fileList[0];

              this.fullpageload = true;
              this.showLoadMessage = true;
              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id',this.cookieService.get('_PAOID'));
              body.append('batch_no',this.newBatchID);
              let headers = new Headers();
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.host +'/qp_sectionpref_import', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.fullpageload = false;
                        this.showLoadMessage = false;
                        if(data.success == true){
                          this.newBatchID = '';
                          this.FileDataTypeSelected = undefined;
                        this._notifications.create('',data.message, 'info');
                        setTimeout(()=>{
                          this.router.navigate(['Items/viewitems', data.upload_id]);
                          },3000);

                        }else if(data.success == false){
                          this.showError =  data.message;

                        }
                      },
                      error => {

                        this.fullpageload  = false;
                        this.showLoadMessage = false;
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
  }


  public toggled(open: boolean): void {

  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
  }
}
