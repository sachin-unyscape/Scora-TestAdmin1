import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';
import { TagInputModule } from 'ngx-chips';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { credentials } from '../../../credentials';
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
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';

@Component({
  selector: 'app-create-test-schema',
  templateUrl: './create-test-schema.component.html',
  styleUrls: ['./create-test-schema.component.scss']
})
export class CreateTestSchemaComponent implements OnInit {
  metaData: any;
  myDateRangePickerOptions: IMyDrpOptions = {
    // other options...
    dateFormat: 'yyyy-mm-dd',
  };
  private model: any = {
    beginDate: '',
    endDate: ''
  };
  start_date: string;
  end_date: string;
  status_id: any;
  item_usage: any;
  blueprint_name:string;
  subjectsData:any = [];
  topicsData:any = [];
  bloomTaxonomyData:any = [];
  subarray:any = [];
  topicArray:any = [];
  taxonomyArray: any = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  subject_ids = [];
  bp_name:boolean;
  section_name: boolean;
  duration: string;
  status_name: boolean;
  item_name: boolean;
  date_selected: boolean;
  subject_selected: boolean;
  duration_value: boolean;
  topic_selected: boolean;
  section: string;
  blueprint_value: boolean;
  blueprint: string;

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
  showload = false;


  ngOnInit() {
    this.getMetaDatas();
  }


  getMetaDatas() {
    this.showload = true;
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    let orgId = parseInt(this.cookieService.get("_PAOID"));
    return this.http
      .get(credentials.host + "/get_metadatas/" + orgId, {
        headers: headers,
      })
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })
      .subscribe(
        (data: any) => {
          console.log("get meta data's", data);
          this.metaData = data;
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

  getSubjects() {
    this.showload = true;
    let body = {};
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
      let orgId = parseInt(this.cookieService.get("_PAOID"));
      body['iteam_status'] = this.status_id,
      body['iteam_usage'] = this.item_usage,
      body['from_date'] = this.start_date,
      body['to_date'] = this.end_date

    return this.http
      .post(credentials.host + "/blueprint_get_subject/" + orgId, body, {
        headers: headers,
      })
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })
      .subscribe(
        (data: any) => {
          console.log("getSubjects", data);
          this.subjectsData = data;
          console.log("subjectsData", this.subjectsData);
          const newArrayOfObj = this.subjectsData.map(({
            Subject_ID:id,
            Subject_Nm: itemName,
          }) => ({
            id,
            itemName,
          }));
          console.log("newArrayOfObj", newArrayOfObj);
          this.dropdownList = newArrayOfObj;
          this.dropdownSettings = { 
            singleSelection: false, 
            text:"Select Subjects",
            selectAllText:'Select All',
            unSelectAllText:'UnSelect All',
            enableSearchFilter: true,
            classes:"myclass custom-class"
          };      
          setTimeout(() => {
            this.showload = false;
          }, 300);
          this._notifications.create('', data.message, 'info', { timeOut: 3000 });
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

  getSubjectTopics() {
    if(this.subject_ids.length > 0){
      this.showload = true;
      let body = {};
      var headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
        let orgId = parseInt(this.cookieService.get("_PAOID"));
        body['iteam_status'] = this.status_id,
        body['iteam_usage'] = this.item_usage,
        body['from_date'] = this.start_date,
        body['to_date'] = this.end_date
        body['subject_id'] = this.subject_ids.toString();
      return this.http
        .post(credentials.host + "/blueprint_get_subject_topics/" + orgId, body, {
          headers: headers,
        })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })
        .subscribe(
          (data: any) => {
            console.log("getSubjectsTopics", data);
            this.topicsData = data;
            for (let i = 0; i < this.topicsData.length; i++) {
              for (let j = 0; j < this.topicsData[i][0].topic.length; j++) {
                     this.topicsData[i][0].topic[j].is_select = true;
              }
            }
            console.log("getSubjectsTopics", this.topicsData);
            setTimeout(() => {
              this.showload = false;
            }, 300);
            this._notifications.create('', data.message, 'info', { timeOut: 3000 });
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
  }

  getBloomTaxonomy() {
    if(this.subject_ids.length > 0){
      this.showload = true;
      let body = {};
      var headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
        let orgId = parseInt(this.cookieService.get("_PAOID"));
        body['iteam_status'] = this.status_id,
        body['iteam_usage'] = this.item_usage,
        body['from_date'] = this.start_date,
        body['to_date'] = this.end_date
        body['subject_id'] = this.subject_ids.toString();
        body['topic_id'] =  this.topicArray.toString();
      return this.http
        .post(credentials.host + "/blueprint_get_bloom_taxonomy/" + orgId, body, {
          headers: headers,
        })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })
        .subscribe(
          (data: any) => {
            this.bloomTaxonomyData = data;
            for (let i = 0; i < this.bloomTaxonomyData.length; i++) {
              if (this.bloomTaxonomyData[i].length > 0) {
                for (let j = 0; j < this.bloomTaxonomyData[i][0].taxonomy.length; j++) {
                  this.bloomTaxonomyData[i][0].taxonomy[j].is_select = true;
                }
              }
            }
            console.log("getBloomTaxonomy", this.bloomTaxonomyData);
            setTimeout(() => {
              this.showload = false;
            }, 300);
            this._notifications.create('', data.message, 'info', { timeOut: 3000 });
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
  }

  getSatusId(id) {
    this.status_id = id;
    console.log(this.status_id);
  }
  getItemUsesId(id) {
    this.item_usage = id;
    console.log(this.item_usage);
  }

  onDateRangeChanged(event: IMyDateRangeModel) {
    // event properties are: event.beginDate, event.endDate, event.formatted,
    // event.beginEpoc and event.endEpoc
    console.log(event.formatted);
    let dates = event.formatted.split(' - ');
    this.start_date = dates[0];
    this.end_date = dates[1];
    console.log(this.start_date, this.end_date);
    this.getSubjects();
    console.log("sachin")
  }
  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
    this.subject_ids = [];
    this.selectedItems.forEach((x) => {
      this.subject_ids.push(x.id);
    });
    console.log(this.subject_ids);
    this.getSubjectTopics();
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
    this.subject_ids = [];
    this.selectedItems.forEach((x) => {
      this.subject_ids.push(x.id);
    });
    console.log(this.subject_ids);
    this.getSubjectTopics();

  }
  onSelectAll(items: any) {
    console.log(items);
    this.subject_ids = [];
    this.selectedItems.forEach((x) => {
      this.subject_ids.push(x.id);
    });
    console.log(this.subject_ids);
    this.getSubjectTopics();

  }
  onDeSelectAll(items: any) {
    console.log(items);
    this.subject_ids = [];
    this.selectedItems.forEach((x) => {
      this.subject_ids.push(x.id);
    });
    console.log(this.subject_ids);
    this.getSubjectTopics();
  }

  selectTopic(i,i2){
    this.topicsData[i][0].topic[i2].is_select = !this.topicsData[i][0].topic[i2].is_select;
    if(this.topicsData[i][0].topic[i2].is_select == false){
      console.log(this.topicsData[i][0].Subject_ID,this.topicsData[i][0].topic[i2].Topic_ID);
      this.topicArray.push(this.topicsData[i][0].topic[i2].Topic_ID);
      if(this.subarray.indexOf(this.topicsData[i][0].Subject_ID)== -1){
        this.subarray.push(this.topicsData[i][0].Subject_ID);
      }
    }else{
      console.log(this.topicsData[i][0].Subject_ID,this.topicsData[i][0].topic[i2].Topic_ID);
      let idx = this.topicArray.indexOf(this.topicsData[i][0].topic[i2].Topic_ID);
      this.topicArray.splice(idx,1);
    }
    console.log(this.topicArray)
    console.log(this.subarray)
    this.getBloomTaxonomy();
  };

  selectBloomTaxonomy(i,i2){
    this.bloomTaxonomyData[i][0].taxonomy[i2].is_select = !this.bloomTaxonomyData[i][0].taxonomy[i2].is_select;
    if(this.bloomTaxonomyData[i][0].taxonomy[i2].is_select == false){
      console.log(this.bloomTaxonomyData[i][0].taxonomy[i2].Taxonomy_ID);
      this.taxonomyArray.push(this.bloomTaxonomyData[i][0].taxonomy[i2].Taxonomy_ID);
    }else{
      console.log(this.bloomTaxonomyData[i][0].taxonomy[i2].Taxonomy_ID);
      let idx = this.taxonomyArray.indexOf(this.bloomTaxonomyData[i][0].taxonomy[i2].Taxonomy_ID);
      this.taxonomyArray.splice(idx,1);
    }
    console.log(this.taxonomyArray)
  }
  goToMarkingSchema() {
    this.blueprint_value = false;
    this.status_name = false;
    this.item_name = false;
    this.date_selected = false;
    this.section_name = false;
    this.subject_selected = false;
    this.duration_value = false;
    if (this.blueprint == "" || this.blueprint == null) {
        this.blueprint_value = true;
        console.log(this.blueprint_value)
    }
    if (this.status_id == "" || this.status_id == null || this.status_id.length == 0) {
      this.status_name = true;
    }
    if (this.item_usage == "" || this.item_usage == null || this.item_usage.length == 0) {
      this.item_name = true;
    }
    if (this.end_date == "" || this.end_date == null || this.end_date.length == 0) {
      this.date_selected = true;
    }
    if (this.section == "" || this.section == null || this.section.length == 0) {
      this.section_name = true;
    }
    if (this.subject_ids == null || this.subject_ids.length == 0) {
      this.subject_selected = true;
    }
    if (this.duration == "" || this.duration == null || this.duration.length == 0) {
      this.duration_value = true;
    }
    if (this.blueprint_value = false && this.status_name == false && this.item_name == false && this.date_selected == false &&
      this.subject_selected == false && this.duration_value == false) {
      $('#test-bank').modal('show');
    }

  }
}
