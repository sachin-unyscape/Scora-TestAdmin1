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
  selector: 'app-user-response',
  templateUrl: './user-response.component.html',
  styleUrls: ['./user-response.component.scss']
})
export class UserResponseComponent implements OnInit {

  constructor(private http:Http, public router: Router,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,private _notifications: NotificationsService,public GetItemService:GetItemService) { }

  public showError = '';
  public saveMSg;
  public showMsg;
  public fullpageload;
  public uplodedFileDetails;
  public  timeZoneName;


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
    this.timeZoneName = localStorage.getItem('TZNM')
    this.getUploadedFiles();
  }

  // 5 menus api calls

  // ProcessUserData(){
  //   if(this.authService.canActivate()){
  //     this.fullpageload = true;
  //     var headers = new Headers();
  //     headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
  //     this.http.get(credentials.host +"/create_user_response/"+ this.cookieService.get('_PAOID'),{headers : headers})
  //     .map(res => res.json())
  //     .catch((e: any) =>{
  //       return Observable.throw(e)
  //     } )

  //     .subscribe(
  //       data => {

  //         this.fullpageload = false;
  //         if(data.success == true){
  //         this._notifications.create('',data.message, 'info');
  //         }else{
  //           this._notifications.create('',data.message, 'error')
  //         }
  //       },

  //         error => {

  //           this.fullpageload= false;
  //           if(error.status == 404){
  //             this.router.navigateByUrl('pages/NotFound');
  //           }
  //           else if(error.status == 401){
  //             this.cookieService.deleteAll();
  //             window.location.href='https://accounts.scora.in';
  //             // window.location.href='https://accounts.scora.in';
  //           }
  //           else{
  //             this.router.navigateByUrl('pages/serverError');
  //           }

  //         }
  //     );
  //   }
  // }

  // EmailReport(){
  //   if(this.authService.canActivate()){
  //     this.fullpageload = true;
  //     var headers = new Headers();
  //     headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
  //     this.http.get(credentials.host +"/test_report/"+ this.cookieService.get('_PAOID'),{headers : headers})
  //     .map(res => res.json())
  //     .catch((e: any) =>{
  //       return Observable.throw(e)
  //     } )

  //     .subscribe(
  //       data => {

  //         this.fullpageload = false;
  //         if(data.success == true){
  //         this._notifications.create('',data.message, 'info');
  //         }else{
  //           this._notifications.create('',data.message, 'error')
  //         }
  //       },

  //         error => {

  //           this.fullpageload= false;
  //           if(error.status == 404){
  //             this.router.navigateByUrl('pages/NotFound');
  //           }
  //           else if(error.status == 401){
  //             this.cookieService.deleteAll();
  //             window.location.href='https://accounts.scora.in';
  //             // window.location.href='https://accounts.scora.in';
  //           }
  //           else{
  //             this.router.navigateByUrl('pages/serverError');
  //           }

  //         }
  //     );
  //   }
  // }


  // emailRanking(){
  //   if(this.authService.canActivate()){
  //     this.fullpageload = true;
  //     var headers = new Headers();
  //     headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
  //     this.http.get(credentials.host +"/subject_track_rank/"+ this.cookieService.get('_PAOID'),{headers : headers})
  //     .map(res => res.json())
  //     .catch((e: any) =>{
  //       return Observable.throw(e)
  //     } )

  //     .subscribe(
  //       data => {

  //         this.fullpageload = false;
  //         if(data.success == true){
  //         this._notifications.create('',data.message, 'info');
  //         }else{
  //           this._notifications.create('',data.message, 'error')
  //         }
  //       },

  //         error => {

  //           this.fullpageload= false;
  //           if(error.status == 404){
  //             this.router.navigateByUrl('pages/NotFound');
  //           }
  //           else if(error.status == 401){
  //             this.cookieService.deleteAll();
  //             window.location.href='https://accounts.scora.in';
  //             // window.location.href='https://accounts.scora.in';
  //           }
  //           else{
  //             this.router.navigateByUrl('pages/serverError');
  //           }

  //         }
  //     );
  //   }
  // }

  // emailThemeReport(){
  //   if(this.authService.canActivate()){
  //     this.fullpageload = true;
  //     var headers = new Headers();
  //     headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
  //     this.http.get(credentials.host +"/theme_rank/"+ this.cookieService.get('_PAOID'),{headers : headers})
  //     .map(res => res.json())
  //     .catch((e: any) =>{
  //       return Observable.throw(e)
  //     } )

  //     .subscribe(
  //       data => {

  //         this.fullpageload = false;
  //         if(data.success == true){
  //         this._notifications.create('',data.message, 'info');
  //         }else{
  //           this._notifications.create('',data.message, 'error')
  //         }
  //       },

  //         error => {

  //           this.fullpageload= false;
  //           if(error.status == 404){
  //             this.router.navigateByUrl('pages/NotFound');
  //           }
  //           else if(error.status == 401){
  //             this.cookieService.deleteAll();
  //             window.location.href='https://accounts.scora.in';
  //             // window.location.href='https://accounts.scora.in';
  //           }
  //           else{
  //             this.router.navigateByUrl('pages/serverError');
  //           }

  //         }
  //     );
  //   }
  // }

  // 5 menus api calls ends


  // get uploaded files list

  getUploadedFiles(){
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/files_list/"+ this.cookieService.get('_PAOID'),{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.fullpageload = false;
          this.uplodedFileDetails = data;
        },

          error => {

            this.fullpageload= false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href=credentials.accountUrl;
              // window.location.href='https://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );
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
                // window.location.href='https://accounts.scora.in';
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


}
