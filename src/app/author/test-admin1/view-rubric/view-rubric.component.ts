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
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-view-rubric',
  templateUrl: './view-rubric.component.html',
  styleUrls: ['./view-rubric.component.scss']
})
export class ViewRubricComponent implements OnInit {
  Item_Type_ID: string;
  Item_ID: string;
  version: any;
  version_id: any;
  selected_version: any;
  rubricItems:any=[];
  totalPoints = 0;
  baseURL = 'http://15.207.209.163/new-scora/scoraauthor/public/api/';
  
  constructor(
    private http: Http,
    private httpClient: HttpClient,
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
    this.version_id = this.route.snapshot.paramMap.get('version')
    this.get_rubric_details(this.Item_Type_ID,this.Item_ID,this.version_id);
  }

  public showload = false;
  public show = false; 
  public edit = false;
  view_rubric_data: any[] = [];
  rubric:  any[] = [];
  keywords: any ='';
  rubric_col: any[] = []

  backClicked() {
    this._location.back();
  }

  get_filterId(event)
  {
     this.version_id = event;
    this.get_rubric_details(this.Item_Type_ID,this.Item_ID,this.version_id)
  }
  
  useThisVersion(){
    this.showload = true;
    var body = {};
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    body["orgId"] = parseInt(this.cookieService.get("_PAOID"));
    body["version"] = this.version_id;
    body["itemId"] = this.Item_ID ;
    return this.http
      .post(credentials.host + "/use_this_version", body, {
        headers: headers,
      })
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })
      .subscribe(
        (data:any) => {
          setTimeout(() => {
            this.showload = false;
          }, 300);
          this._notifications.create('',data.message, 'info', {timeOut: 3000});
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

  get_rubric_details(Item_Type_ID,Item_ID,version_id) {
   
    this.showload = true;
    var body = {};
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    body["orgId"] = parseInt(this.cookieService.get("_PAOID"));
    body["itemTypeId"] = parseInt(Item_Type_ID);
    body["itemId"] = parseInt(Item_ID) ;
    console.log("<>>>>>>>>>>>>>>>>>>>>>>>>>>>",version_id)
    body["version"] = version_id;
   
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
          this.version = data.data.version;
          this.selected_version = data.data.selected_version;
          console.log(this.selected_version + "xdm,mc,xcmx,m")
          console.log(this.view_rubric_data)
          this.rubric = data.data.rubric;
          this.rubric_col = data.data.rubric_col;
          this.keywords = data.data.keywords.toString();
          this.rubricItems=[];
          this.rubric_col.forEach((x,index1)=>{
            let tempData =[];
            this.rubric.forEach((y,index2)=>{
             tempData.push({
              criteria_id:y[index1].criteria_id,
              criteria_name:y[index1].criteria_name,
              description:y[index1].description,
              point:y[index1].points
             })
            })
            this.rubricItems.push({
              performance_rating_id:x.performance_id,
              performance_rating_name:x.performance_rating_name,
              criteria : tempData
            })
            tempData=[];
          })
          console.log('-->',this.rubricItems)
          this.getTotalPoints();
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
    if(!this.checkIfValid()){
      return;
    }
    if(!this.checkIfValid2()){
      this._notifications.error('','Incorrect Value(s) entered. Please read instructions!');
      return;
    }
    if(!this.checkIfValid3()){//checks if numbers are in series
      this._notifications.error('','Incorrect Value(s) entered. Please read instructions!');
      return;
    }
    if (this.authService.canActivate()) {
      this.showload = true;
      let formData = {
        performance: this.rubricItems,
        orgId: this.cookieService.get('_PAOID'),
        itemId: this.Item_ID,
        keywords: this.keywords,
        version: this.version_id
      };
      let headers = new HttpHeaders();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.httpClient.post<any>(this.baseURL + 'edit_rubric', formData, { headers: headers }).subscribe(data => {
        this.showload = false;
        console.log(data);
        if (!data.success) {
          this._notifications.create("", data.message, "error");  
          return;
        }
        this._notifications.create("", data.message, "info");  
        this.edit=false;
        this.get_rubric_details(this.Item_Type_ID,this.Item_ID,this.version_id);
      });
    }
  }

  getTotalPoints() {
    let total = 0;
    this.rubricItems[this.rubricItems.length-1].criteria.forEach(x=>{
      total += +x.point;
    })
    this.totalPoints = total;
  }

  getLastPoint(index1:number,index2:number){
    return this.rubricItems[index1-1].criteria[index2].point;
  }
  deleteMainItem() {
    this.rubricItems.pop();
    this.getTotalPoints();
  }

  addMainItem() {
    let no = this.rubricItems[0].criteria.length;
    let subItems = [];
    for (let i = 0; i < no; i++) {
      subItems.push({
        'criteria_name': this.rubricItems[0].criteria[i].criteria_name,
        'description': '',
        'point': 0.0
      })
    }
    this.rubricItems.push({
      'performance_rating_name': '',
      'selected_value':0.00,
      'criteria': subItems
    })
    this.getTotalPoints();
  }

  addSubItems() {
    this.rubricItems.forEach(x => {
      x.criteria.push({
        'criteria_name': '',
        'description': '',
        'point': 0.0
      })
    })
    this.getTotalPoints();
  }

  deleteSubItems() {
    this.rubricItems.forEach(x => {
      x.criteria.pop();
    })
    this.getTotalPoints();
  }

  checkIfValid(){
    let isValid=true;
    let prevHiherThanLast=false;
    let notValid=false;
    this.rubricItems.forEach((x,index1)=>{
      x.criteria.forEach((y,index2)=>{
        if(index1>0 && y.point<this.rubricItems[index1-1].criteria[index2].point){
          prevHiherThanLast=true;
          isValid=false;
        }
        if(y.point%0.25!=0 && (+(Math.floor( y.point ) - y.point).toFixed(2))%0.33!=0){
          notValid=true;
          isValid=false;
        }
      })
    })
    if(prevHiherThanLast)
      this._notifications.error('','Points value must be higher than previous Column!');
    else if(notValid)
      this._notifications.error('','Only whole numbers or multiples of 0.25 (1/4) or 0.33 (1/3) are accepted!');
    return isValid;
  }

  checkIfValid2(){
    let arr=[];
    for(let i=0;i<this.rubricItems[0].criteria.length;i++){
      let arr2=[];
      for(let j=0;j<this.rubricItems.length;j++){
        arr2.push(this.rubricItems[j].criteria[i].point)
      }
      arr.push(arr2);
      arr2=[];
    }
  let isValid=true;
   for(let i=0;i<arr.length;i++){
     let type=1;
     for(let j=0;j<arr[i].length;j++){

       if(j==0){
         if(arr[i][j]==0 || arr[i][j]%1==0)
          type=3;
         else if(arr[i][j]%0.25!=0 && (+(Math.floor( arr[i][j] ) - arr[i][j]).toFixed(2))%0.33==0){
          type=2;
         }
       }
       else{
        if(type==1 && arr[i][j]%0.25!=0)
           isValid=false;
         else if(type==2 && (+(Math.floor( arr[i][j] ) - arr[i][j]).toFixed(2))%0.33!=0)
           isValid=false;
          else if(type==3 && arr[i][j]%0.25!=0 && (+(Math.floor( arr[i][j] ) - arr[i][j]).toFixed(2))%0.33!=0)
            isValid=false;
      }

     }
   }
   return isValid;
  }

  checkIfValid3(){
    let arr=[];
    for(let i=0;i<this.rubricItems[0].criteria.length;i++){
      let arr2=[];
      for(let j=0;j<this.rubricItems.length;j++){
        arr2.push(this.rubricItems[j].criteria[i].point)
      }
      arr.push(arr2);
      arr2=[];
    }
  let isValid=true;
   for(let i=0;i<arr.length;i++){
     for(let j=0;j<arr[i].length;j++){
       if(j>0){
         let decVal=+(arr[i][j]-arr[i][j-1]).toFixed(2);
         if(decVal!= 1 && decVal!=0.25 && decVal!=0.33 && decVal!=0.34){
           console.log('problem',decVal)
          isValid=false;
        }
       }
     }
   }
   return isValid;
  }

  replaceSpace(){
    this.keywords=this.keywords.replace(/ /g,",");
    return 1;
  }

}
