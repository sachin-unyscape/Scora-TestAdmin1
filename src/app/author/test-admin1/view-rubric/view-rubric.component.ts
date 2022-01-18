import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {IMyDrpOptions} from 'mydaterangepicker';
import { TagInputModule } from 'ngx-chips';
import { trigger, state, style, animate, transition } from '@angular/animations';
import{credentials} from '../../../credentials';
import { CookieService } from 'ngx-cookie-service';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
//authService
import { AuthServiceService } from '../../../auth-service.service';
import { LoaderComponent } from '../../../loader/loader.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService } from 'angular2-notifications';
import { Injector } from '@angular/core';
import { AuthorNavbarComponent } from '../../author-navbar/author-navbar.component';
import { GetItemService } from '../../../get-item.service';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { PagerService } from '../../../_services/index';
import * as _ from 'underscore';
import {Location} from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-view-rubric',
  templateUrl: './view-rubric.component.html',
  styleUrls: ['./view-rubric.component.scss']
})
export class ViewRubricComponent implements OnInit {
  Item_Type_ID: string;
  Item_ID: string;
 

  constructor(
    private http: Http,
    private router: Router,
    public route: ActivatedRoute,
    private cookieService: CookieService,
    private authService: AuthServiceService,
    private modalService: BsModalService,
    private _notifications: NotificationsService,
    private injector: Injector,
    public GetItemService: GetItemService,
    private pagerService: PagerService,
    private _location: Location,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.Item_Type_ID = this.route.snapshot.paramMap.get('Item_Type_ID');
    this.Item_ID = this.route.snapshot.paramMap.get('Item_ID');
    this.get_rubric_details(this.Item_Type_ID,this.Item_ID);
  }

  public showload = true;
  public show = false; 
  public edit = false;
  view_rubric_data: any[] = [];
  rubric:  any[] = [];
  keywords: any[] =[];
  rubric_col: any[] = []

  backClicked() {
    this._location.back();
  }

  get_rubric_details(Item_Type_ID,Item_ID) {
   
    this.showload = true;
    var body = {};
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    body["orgId"] = parseInt(this.cookieService.get("_PAOID"));
    body["itemTypeId"] = parseInt(Item_Type_ID);
    body["itemId"] = parseInt(Item_ID)  
  
    return this.http
      .post(credentials.host + "/view_rubric", body, {
        headers: headers,
      })
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })
      .subscribe(
        (data:any) => {
          this.view_rubric_data = data.data;
          console.log(this.view_rubric_data)
          this.rubric = data.data.rubric;
          this.rubric_col = data.data.rubric_col;
          this.keywords = data.data.keywords.toString();
          console.log(this.keywords)
          setTimeout(() => {
            this.showload = false;
          }, 300);
        },
        (error) => {
          this.showload = false;
          if (error.status == 404) {
            this.router.navigateByUrl("pages/NotFound");
          } else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          } else {
            this.router.navigateByUrl("pages/serverError");
          }
        }
      );
  }
  isedit(){
    this.edit = true;
  };
  cancel(){
    this.edit = false;
  }
  saveRubric(){
    let data = {
      performance:[],
      "orgId": parseInt(this.cookieService.get("_PAOID")),
      "itemId": parseInt(this.Item_ID),
      "keywords": this.keywords
    };
    this.rubric_col.forEach(element => {
      data.performance.push(element);
    });
    let data_arr = [];
    let data_arr1 = [];
    let data_arr2 = [];
    this.rubric.forEach((item,rubric_index)=>{
     item.forEach((element,index) => {
       if(rubric_index)
        data_arr.push(item[index]);
        data.performance[index].criteria = data_arr;
     });
    })
   console.log("Formated data",this.view_rubric_data);

  }
}
