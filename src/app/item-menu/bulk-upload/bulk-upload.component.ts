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
import {BulkUploadItemsListComponent} from '../bulk-upload-items-list/bulk-upload-items-list.component';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss'],
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
export class BulkUploadComponent implements OnInit {

  constructor(private http:Http, public router: Router,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,private _notifications: NotificationsService,public GetItemService:GetItemService) { }

  public showError = '';
  public saveMSg;
  public showMsg;
  public fullpageload;
  public uploadedItemsDetails;
  public IndividualItemsList;
  public planExpires:any;
  public dwnldalertMsgs = false;
  public uploadalertMsgs = false;


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
    this.uploadedItemsList();
  }

  uploadedItemsList(){
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/upload_log/"+this.cookieService.get('_PAOID'),{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.fullpageload  = false;
          this.uploadedItemsDetails = data;
        },
        error => {

          this.fullpageload  = false;
          if(error.status == 404){
            this.router.navigateByUrl('pages/NotFound');
          }
          else if(error.status == 401){
            this.cookieService.deleteAll();
           window.location.href=credentials.authorUrl;
             // window.location.href=credentials.authorUrl;
          }
          else{
            this.router.navigateByUrl('pages/serverError');
          }

        }
      );
    }
  }


  getUploadInstanceItem(uploadId){


        this.GetItemService.getBulkUploadedIds(uploadId);

        this.router.navigate(['Items/bulkuploadItems']);

        // this.uploadedItemsDetails = data;

  }


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
              this.http.post(credentials.host +'/items_import', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.fullpageload = false;

                        if(data.success == true){

                        // this.saveMSg = true;
                        // this.showMsg = data.message;
                        this._notifications.create('',data.message, 'info');
                        setTimeout(()=>{
                          this.saveMSg = false;
                          this.router.navigate(['Items/viewitems', data.upload_id]);
                      },3000);
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
                         window.location.href=credentials.authorUrl;
                           // window.location.href=credentials.authorUrl;
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


  // downloadAlert(id){
  //   // if(this.planExpires == true){
  //     if(id==1){
  //       this.dwnldalertMsgs = true;
  //     }else if(id==2){
  //       this.dwnldalertMsgs = false;
  //     }
  //     if(id==3){
  //       this.uploadalertMsgs = true;
  //     }else if(id==4){
  //       this.uploadalertMsgs = false;
  //     }
  //   // }
  // }

}
