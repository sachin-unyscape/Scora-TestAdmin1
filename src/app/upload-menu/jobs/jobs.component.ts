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
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  constructor(private http:Http, public router: Router,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,private _notifications: NotificationsService,public GetItemService:GetItemService) { }

  public showError = '';
  public saveMSg;
  public showMsg;
  public fullpageload;
  public uplodedFileDetails;


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
    this.getjobList();
  }

  // get job files list

  getjobList(){
    if(this.authService.canActivate()){
      this.fullpageload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/job_list/"+ this.cookieService.get('_PAOID'),{headers : headers})
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

}
