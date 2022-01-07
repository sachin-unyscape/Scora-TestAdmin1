import { Component, OnInit, TemplateRef } from '@angular/core';
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
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-match-item-upload',
  templateUrl: './match-item-upload.component.html',
  styleUrls: ['./match-item-upload.component.scss']
})
export class MatchItemUploadComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(private modalService: BsModalService, private http:Http, public router: Router,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,private _notifications: NotificationsService,public GetItemService:GetItemService) { }

  public showError = '';
  public saveMSg;
  public showMsg;
  public fullpageload;
  public listOfUploadFileDetails;
  public showLoadMessage;
  public showErrPop;


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
  // contentArray = new Array(this.GetItemService.sendFileUploadDetailsToList().datas.length).fill('');
  public contentArray;
  returnedArray: string[];
  maxSize = 5;
  rotate = true;

  ngOnInit() {
    this.showErrPop = 0;
    this.showLoadMessage = false;
    this.listOfUploadFileDetails = this.GetItemService.sendFileUploadDetailsToList();
    this.contentArray = this.listOfUploadFileDetails.datas;
    this.returnedArray = this.contentArray;
  }

  // function to upoad match items - Not in USe
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
              this.http.post(credentials.host +'/create_match_details', body,{headers:headers})
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
  // function to upoad match items Ends - Not in USe


  pageChanged(event: PageChangedEvent): void {

    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/view_file_details/"+ this.cookieService.get('_PAOID')+'/'+this.listOfUploadFileDetails.file_id + '/'+event.page+'/'+20+'?page='+event.page,{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.fullpageload = false;
          this.returnedArray = data.datas;
          this.listOfUploadFileDetails = data;
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


  processData(file_type,file_id){

    if(this.listOfUploadFileDetails.batch_no != null) {
      if(file_type == 'User Response Data'){
        if(this.authService.canActivate()){
          this.fullpageload = true;
          this.showLoadMessage = true;
          let body = new FormData();
          body.append('org_id',this.cookieService.get('_PAOID'));
          body.append('file_id',file_id);
          body.append('batch_no',this.listOfUploadFileDetails.batch_no);
          console.log(body);
          var headers = new Headers();
          headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
          this.http.post('http://source.scora.in/scoraauthor/bulkupload_process/',body,{headers : headers})
          .map(res => res.json())
          .catch((e: any) =>{
            return Observable.throw(e)
          } )

          .subscribe(
            data => {

              this.fullpageload = false;
              this.showLoadMessage = false;
              if(data.success == true){
              this.showErrPop = 1;
               // this._notifications.create('',data.message, 'info');
              }else{
               this.showErrPop = 2;
               // this._notifications.create('',data.message, 'error');
              }

            },

              error => {

                this.fullpageload= false;
                this.showLoadMessage = false;
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
          );
        }


      }else if(file_type == 'User Profile Data'){
        if(this.authService.canActivate()){
          this.fullpageload = true;
          this.showLoadMessage = true;
          let body = new FormData();
          body.append('org_id',this.cookieService.get('_PAOID'));
          body.append('file_id',file_id);
          body.append('batch_no',this.listOfUploadFileDetails.batch_no);
          console.log(body);
          var headers = new Headers();
          headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
          this.http.post("http://source.scora.in/scoraauthor/userprofile_process/",body,{headers : headers})
          .map(res => res.json())
          .catch((e: any) =>{
            return Observable.throw(e)
          })

          .subscribe(
            data => {

              this.fullpageload = false;
              this.showLoadMessage = false;
              if(data.success == true){
                this.showErrPop = 1;
                // this._notifications.create('',data.message, 'info');
              }else{
                this.showErrPop = 2;
                // this._notifications.create('',data.message, 'error');
              }

            },

              error => {

                this.fullpageload = false;
                this.showLoadMessage = false;
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
          );
        }
      }
    }
  }


  showAlertsPops(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-lg' },this.config));
  }


}
