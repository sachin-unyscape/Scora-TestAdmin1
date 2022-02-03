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
import { indexOf } from 'lodash';

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
  blueprint_name: string;
  subjectsData: any = [];
  topicsData: any = [];
  bloomTaxonomyData: any = [];
  itemTypeListData: any = [];
  difficultyLevelListData: any = [];
  subarray: any = [];
  topicArray: any = [];
  taxonomyArray: any = [];
  itemTypesArray: any = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  subject_ids = [];
  bp_name: boolean;
  section_name: boolean;
  duration: string;
  status_name: boolean;
  item_name: boolean;
  date_selected: boolean;
  subject_selected: boolean;
  duration_value: boolean;
  topic_selected: boolean;
  section: string;
  blueprint_value: boolean = false;
  blueprint: string;
  FinalitemTypesArray: any[];
  TableArray: any = [];
  TableObject: any = {};
  requiredItems: any;
  Sections: any = [
    {
      "section": '',
      "subject": '',
      "duration": '',
      "selectedItems": [],
      "topicsData": [],
      "bloomTaxonomyData": [],
      "itemTypeListData": [],
      "difficultyLevelListData": [],
      "TableArray": [],
    }
  ];
  total_required_number: number = 0;
  check_topic_boom: boolean;
  check_item_type_difficulty: boolean;
  table_created: boolean;
  required_items_values: boolean;


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
          if (this.subjectsData.length > 0){
            const newArrayOfObj = this.subjectsData.map(({
              Subject_ID: id,
              Subject_Nm: itemName,
              Subject_Count: items_count,
            }) => ({
              id,
              itemName,
              items_count
            }));
            console.log("newArrayOfObj", newArrayOfObj);
            this.dropdownList = newArrayOfObj;
            this.dropdownSettings = {
              singleSelection: false,
              text: "Select Subjects",
              selectAllText: 'Select All',
              unSelectAllText: 'UnSelect All',
              enableSearchFilter: true,
              classes: "myclass custom-class"
            };
          }
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

  getSubjectTopics(section_index) {
    if (this.subject_ids.length > 0) {
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
            this.Sections[section_index].topicsData = data;
            for (let i = 0; i < this.Sections[section_index].topicsData.length; i++) {
              for (let j = 0; j < this.Sections[section_index].topicsData[i][0].topic.length; j++) {
                this.Sections[section_index].topicsData[i][0].topic[j].is_select = true;
              }
            }
            console.log("getSubjectsTopics", this.Sections);
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
  }

  getBloomTaxonomy(section_index) {
    if (this.subject_ids.length > 0) {
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
      body['topic_id'] = this.topicArray.toString();
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
            this.Sections[section_index].bloomTaxonomyData = data;
            for (let i = 0; i < this.Sections[section_index].bloomTaxonomyData.length; i++) {
              if (this.Sections[section_index].bloomTaxonomyData[i].length > 0) {
                for (let j = 0; j < this.Sections[section_index].bloomTaxonomyData[i][0].taxonomy.length; j++) {
                  this.Sections[section_index].bloomTaxonomyData[i][0].taxonomy[j].is_select = true;
                }
              }
            }
            console.log("getBloomTaxonomy", this.Sections[section_index].bloomTaxonomyData);
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
  }


  getItemTypeList(section_index) {
    if (this.subject_ids.length > 0) {
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
      body['topic_id'] = this.topicArray.toString();
      body['taxonomy_id'] = this.taxonomyArray.toString();

      return this.http
        .post(credentials.host + "/blueprint_get_iteam_type/" + orgId, body, {
          headers: headers,
        })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })
        .subscribe(
          (data: any) => {
            this.Sections[section_index].itemTypeListData = data;
            for (let i = 0; i < this.Sections[section_index].itemTypeListData.length; i++) {
              if (this.Sections[section_index].itemTypeListData[i].length > 0) {
                for (let j = 0; j < this.Sections[section_index].itemTypeListData[i][0].item[0].itemtype.length; j++) {
                  this.Sections[section_index].itemTypeListData[i][0].item[0].itemtype[j].is_select = true;
                }
              }
            }
            console.log("itemTypeListData", this.Sections[section_index].itemTypeListData);
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
  }

  getDifficultyList(section_index) {
    if (this.subject_ids.length > 0) {
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
      body['topic_id'] = this.topicArray.toString();
      body['taxonomy_id'] = this.taxonomyArray.toString();
      body['item_type_id'] = this.itemTypesArray.toString();
      body['sub_item_type_id'] = null

      return this.http
        .post(credentials.host + "/blueprint_get_difficultylevel/" + orgId, body, {
          headers: headers,
        })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })
        .subscribe(
          (data: any) => {
            this.Sections[section_index].difficultyLevelListData = data;
            for (let i = 0; i < this.Sections[section_index].difficultyLevelListData.length; i++) {
              if (this.Sections[section_index].difficultyLevelListData[i].length > 0) {
                for (let j = 0; j < this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel.length; j++) {
                  this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel[j].is_select = true;
                }
              }
            }
            console.log("difficultyLevelListData", this.Sections[section_index].difficultyLevelListData);
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
  }


  getSatusId(id) {
    this.status_id = id;
    this.getSubjects();
    console.log(this.status_id);
  }
  getItemUsesId(id) {
    this.item_usage = id;
    this.getSubjects();
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
  onItemSelect(item: any, section_index) {
    console.log(item);
    console.log(this.Sections[section_index].selectedItems);
    this.subject_ids = [];
    this.Sections[section_index].selectedItems.forEach((x) => {
      this.subject_ids.push(x.id);
    });
    console.log(this.subject_ids);
    this.getSubjectTopics(section_index);
  }
  OnItemDeSelect(item: any, section_index) {
    console.log(item);
    console.log(this.Sections[section_index].selectedItems);
    this.subject_ids = [];
    this.Sections[section_index].selectedItems.forEach((x) => {
      this.subject_ids.push(x.id);
    });
    console.log(this.subject_ids);
    this.getSubjectTopics(section_index);
  }
  onSelectAll(items: any, section_index) {
    console.log(items);
    console.log(this.Sections[section_index].selectedItems);
    this.subject_ids = [];
    this.Sections[section_index].selectedItems.forEach((x) => {
      this.subject_ids.push(x.id);
    });
    console.log(this.subject_ids);
    this.getSubjectTopics(section_index);

  }
  onDeSelectAll(items: any, section_index) {
    console.log(items);
    console.log(this.Sections[section_index].selectedItems);
    this.subject_ids = [];
    this.Sections[section_index].selectedItems.forEach((x) => {
      this.subject_ids.push(x.id);
    });
    console.log(this.subject_ids);
    this.getSubjectTopics(section_index);
  }

  selectTopic(i, i2, section_index) {
    this.Sections[section_index].topicsData[i][0].topic[i2].is_select = !this.Sections[section_index].topicsData[i][0].topic[i2].is_select;
    if (this.Sections[section_index].topicsData[i][0].topic[i2].is_select == false) {
      console.log(this.Sections[section_index].topicsData[i][0].Subject_ID, this.Sections[section_index].topicsData[i][0].topic[i2].Topic_ID);
      this.topicArray.push(this.Sections[section_index].topicsData[i][0].topic[i2].Topic_ID);
      if (this.subarray.indexOf(this.Sections[section_index].topicsData[i][0].Subject_ID) == -1) {
        this.subarray.push(this.Sections[section_index].topicsData[i][0].Subject_ID);
      }
    } else {
      console.log(this.Sections[section_index].topicsData[i][0].Subject_ID, this.Sections[section_index].topicsData[i][0].topic[i2].Topic_ID);
      let idx = this.topicArray.indexOf(this.Sections[section_index].topicsData[i][0].topic[i2].Topic_ID);
      this.topicArray.splice(idx, 1);
      this.getItemTypeList(section_index);
      this.getDifficultyList(section_index);
    }
    console.log(this.topicArray)
    console.log(this.subarray)
    this.getBloomTaxonomy(section_index);
  };

  selectBloomTaxonomy(i, i2, section_index) {
    this.Sections[section_index].bloomTaxonomyData[i][0].taxonomy[i2].is_select = !this.Sections[section_index].bloomTaxonomyData[i][0].taxonomy[i2].is_select;
    if (this.Sections[section_index].bloomTaxonomyData[i][0].taxonomy[i2].is_select == false) {
      console.log(this.Sections[section_index].bloomTaxonomyData[i][0].taxonomy[i2].Taxonomy_ID);
      this.taxonomyArray.push(this.Sections[section_index].bloomTaxonomyData[i][0].taxonomy[i2].Taxonomy_ID);
    } else {
      console.log(this.Sections[section_index].bloomTaxonomyData[i][0].taxonomy[i2].Taxonomy_ID);
      let idx = this.taxonomyArray.indexOf(this.Sections[section_index].bloomTaxonomyData[i][0].taxonomy[i2].Taxonomy_ID);
      this.taxonomyArray.splice(idx, 1);
      this.getDifficultyList(section_index);
    }
    console.log(this.taxonomyArray);
    this.getItemTypeList(section_index);
  }

  selectItemTypes(i, i2, section_index) {
    this.Sections[section_index].itemTypeListData[i][0].item[0].itemtype[i2].is_select = !this.Sections[section_index].itemTypeListData[i][0].item[0].itemtype[i2].is_select;
    if (this.Sections[section_index].itemTypeListData[i][0].item[0].itemtype[i2].is_select == false) {
      console.log(this.Sections[section_index].itemTypeListData[i][0].item[0].itemtype[i2].Item_Type_ID);
      this.itemTypesArray.push(this.Sections[section_index].itemTypeListData[i][0].item[0].itemtype[i2].Item_Type_ID);
    } else {
      console.log(this.Sections[section_index].itemTypeListData[i][0].item[0].itemtype[i2].Item_Type_ID);
      let idx = this.itemTypesArray.indexOf(this.Sections[section_index].itemTypeListData[i][0].item[0].itemtype[i2].Item_Type_ID);
      this.itemTypesArray.splice(idx, 1);
    }
    console.log(this.itemTypesArray);
    this.getDifficultyList(section_index);
  }

  selectDifficultyLevel(i, i2, section_index) {
    this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel[i2].is_select = !this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel[i2].is_select;
    console.log(this.Sections[section_index].difficultyLevelListData[i][0]);
    console.log(this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel[i2]);
    if (this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel[i2].is_select == false) {
      this.TableObject = {
        subject: this.Sections[section_index].difficultyLevelListData[i][0].subject.Subject_Nm,
        topic: this.Sections[section_index].difficultyLevelListData[i][0].topicname[0].Topic_Nm,
        taxonomy: this.Sections[section_index].difficultyLevelListData[i][0].taxonomy[0].Taxonomy_Nm,
        itemtype: this.Sections[section_index].difficultyLevelListData[i][0].item[0].itemtype[0].Item_Type_Nm,
        difficultyLevel: this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel[i2].Diff_Lvl_Nm,
        Diff_Lvl_ID: this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel[i2].Diff_Lvl_ID,
        requiredItems: ''
      };
      console.log(this.TableObject)
      let idx = this.Sections[section_index].TableArray.findIndex(x => x.Diff_Lvl_ID == this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel[i2].Diff_Lvl_ID)
      if (idx == -1) {
        this.Sections[section_index].TableArray.push(this.TableObject);
      }
    } else {
      let idx = this.Sections[section_index].TableArray.findIndex(x => x.Diff_Lvl_ID == this.Sections[section_index].difficultyLevelListData[i][0].difficultylevel[i2].Diff_Lvl_ID)
      console.log("idex", idx);
      console.log("this.TableObject.Diff_Lvl_ID", this.TableObject.Diff_Lvl_ID);
      this.Sections[section_index].TableArray.splice(idx, 1);
     
    }
    // this.goToMarkingSchema();
  }
  addSections(section_index) {
    let required_items_value = false;
    if (this.Sections[section_index].section.length == 0) {
      this.section_name = true;
    }
    if (this.Sections[section_index].selectedItems.length == 0) {
      this.subject_selected = true;
    }
    if (this.Sections[section_index].duration == '' || this.Sections[section_index].duration == null) {
      this.duration_value = true;
    }
    if (this.Sections[section_index].topicsData.length == 0 || this.Sections[section_index].bloomTaxonomyData.length == 0) {
      this._notifications.error('', 'Please select atleast one topic and one bloomTaxonomy for this section!');
    }
    else if (this.Sections[section_index].itemTypeListData.length == 0 || this.Sections[section_index].difficultyLevelListData.length == 0) {
      this._notifications.error('', 'Please select atleast one itemType and one difficultyLevel for this section!');
    }
    else if (this.Sections[section_index].TableArray.length == 0) {
      this._notifications.error('', 'Please select atleast one difficultyLevel for this section!');
    }
    this.Sections[section_index].TableArray.map((item) => {
      if (item.requiredItems == '' || item.requiredItems == null) {
        required_items_value = true;
        this._notifications.error('', 'Please enter the required items values for this section!');
      }
    });
    if (this.Sections[section_index].selectedItems.length > 0 && this.Sections[section_index].topicsData.length > 0 && this.Sections[section_index].bloomTaxonomyData.length > 0
      && this.Sections[section_index].itemTypeListData.length > 0 && this.Sections[section_index].difficultyLevelListData.length > 0
      && this.Sections[section_index].TableArray.length > 0 && this.Sections[section_index].section.length > 0 && this.Sections[section_index].duration != ''
      && required_items_value == false) {
      this.Sections.push({
        "section": '',
        "subject": '',
        "duration": '',
        "selectedItems": [],
        "topicsData": [],
        "bloomTaxonomyData": [],
        "itemTypeListData": [],
        "difficultyLevelListData": [],
        "TableArray": [],
      });
      this.section_name = false;
      this.subject_selected = false;
      this.duration_value = false;
    }
  }
  goToMarkingSchema() {
    this.blueprint_value = false;
    this.status_name = false;
    this.item_name = false;
    this.date_selected = false;
    this.section_name = false;
    this.subject_selected = false;
    this.duration_value = false;
    this.check_topic_boom = false;
    this.check_item_type_difficulty = false;
    this.required_items_values = false;
    this.table_created = false
    console.log(this.Sections);
    let obj = {};
    obj['blueprint_name'] = this.blueprint;
    obj['no_of_sections'] = this.Sections.length;
    obj['sections'] = [];
    obj['subjects'] = [];
    obj['topics'] = [];
    obj['blooms_taxonomy'] = [];
    obj['difficulty_levels'] = [];
    obj['item_types'] = [];
    obj['total_time'] = 0;
    obj['total_required_items'] = 0;
    obj['total_available_items'] = 0;
    obj['start_dt'] = this.start_date;
    obj['end_dt'] = this.end_date;
    obj['item_usage_id'] = this.item_usage;
    obj['item_status_id'] = this.status_id;
    obj['org_id'] = parseInt(this.cookieService.get("_PAOID"));


    for (let i = 0; i < this.Sections.length; i++) {
      for(let j = 0; j < this.Sections[i].TableArray.length; j++){
      console.log(this.Sections[i])
      let obj1 = {
        "section_name": this.Sections[i].section,
        "required_items": this.Sections[i].TableArray.reduce((n, { requiredItems }) => n + requiredItems, 0),
        "available_items": 2,
        "time": this.time_convert(this.Sections[i].duration),
        "subjects":[],
        "topics": [],
        "blooms_taxonomy": [],
        "item_types": [],
        "difficulty_levels": []
      };
      this.Sections[i].selectedItems.forEach((element,po) => {
        if( this.Sections[i].selectedItems[po].itemName == this.Sections[i].TableArray[j].subject){
          obj1['subjects'].push(element)
        }
      });
      obj1.subjects.map((v) => {
        obj['subjects'].push(v.itemName)
      })
      obj['total_time'] += +this.Sections[i].duration;
      obj['total_required_items'] += +obj1.required_items;
      this.total_required_number = obj['total_required_items'];
      obj['total_available_items'] += +obj1.available_items;
      this.Sections[i].topicsData.forEach((element, i1) => {
        this.Sections[i].topicsData[i1][0].topic.map((v, i2) => {
          console.log(element);
          if (  v.Topic_Nm == this.Sections[i].TableArray[j].topic) {
            let objects1 = {
              "id": v.Topic_ID,
              "subject": v.subject.Subject_Nm,
              "itemName": v.Topic_Nm,
              "items_count": this.Sections[i].topicsData[i1][0].topic_count,
            };
            obj['topics'].push(objects1.itemName);
            obj1.topics.push(objects1);
          }
        })
      }),
        this.Sections[i].bloomTaxonomyData.forEach((element, i1) => {
          if (this.Sections[i].bloomTaxonomyData[i1].length > 0) {
            this.Sections[i].bloomTaxonomyData[i1][0].taxonomy.map((v, i2) => {
              if (v.Taxonomy_Nm == this.Sections[i].TableArray[j].taxonomy) {
                let objects1 = {
                  "id": v.Taxonomy_ID,
                  "subject": this.Sections[i].bloomTaxonomyData[i1][0].subject.Subject_Nm,
                  "topic": this.Sections[i].bloomTaxonomyData[i1][0].topicname[0].Topic_Nm,
                  "itemName": v.Taxonomy_Nm,
                  "items_count": this.Sections[i].bloomTaxonomyData[i1][0].taxonomy_count,
                };
                obj['blooms_taxonomy'].push(objects1.itemName);
                obj1.blooms_taxonomy.push(objects1);
              }
            })
          }
        }),
        this.Sections[i].itemTypeListData.forEach((element, i1) => {
          if (this.Sections[i].itemTypeListData[i1].length > 0) {
            this.Sections[i].itemTypeListData[i1][0].item[0].itemtype.map((v, i2) => {
              if (v.Item_Type_Nm == this.Sections[i].TableArray[j].itemtype) {
                let objects1 = {
                  "id": v.Item_Type_ID,
                  "subject": this.Sections[i].itemTypeListData[i1][0].subject.Subject_Nm,
                  "topic": this.Sections[i].itemTypeListData[i1][0].topicname[0].Topic_Nm,
                  "blooms_taxonomy": this.Sections[i].itemTypeListData[i1][0].taxonomy[0].Taxonomy_Nm,
                  "itemName": v.Item_Type_Nm,
                  "items_count": this.Sections[i].itemTypeListData[i1][0].item[0].itemtype_count,
                  "sub_id":null
                };
                obj['item_types'].push(v.Item_Type_ID);
                obj1.item_types.push(objects1);
              }
            })
          }
        }),
        this.Sections[i].difficultyLevelListData.forEach((element, i1) => {
          if (this.Sections[i].difficultyLevelListData[i1].length > 0) {
            this.Sections[i].difficultyLevelListData[i1][0].difficultylevel.map((v, i2) => {
              if (v.Diff_Lvl_Nm == this.Sections[i].TableArray[j].difficultyLevel) {
                let objects1 = {
                  "id": v.Diff_Lvl_ID,
                  "subject": this.Sections[i].difficultyLevelListData[i1][0].subject.Subject_Nm,
                  "topic": this.Sections[i].difficultyLevelListData[i1][0].topicname[0].Topic_Nm,
                  "blooms_taxonomy": this.Sections[i].difficultyLevelListData[i1][0].taxonomy[0].Taxonomy_Nm,
                  "item_type": this.Sections[i].difficultyLevelListData[i1][0].item[0].itemtype[0].Item_Type_Nm,
                  "itemName": v.Diff_Lvl_Nm,
                  "available_items": +this.Sections[i].difficultyLevelListData[i1][0].difficultylevel_count,
                  "required_items": +this.total_required_number,
                };
                obj['difficulty_levels'].push(v.Diff_Lvl_Nm);
                obj1.difficulty_levels.push(objects1);
              }
            })
          }
        }),
        obj['sections'].push(obj1);
      }
    }
    console.log("obj", obj)
    if (this.blueprint == "" || this.blueprint == null || this.blueprint.length == 0) {
      this.blueprint_value = true;
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
   
     for(let i = 0; i < this.Sections.length; i++){
      if (this.Sections[i].section.length == 0) {
        this.section_name = true;
      }
      if (this.Sections[i].selectedItems.length == 0) {
        this.subject_selected = true;
      }
      if (this.Sections[i].duration == '' || this.Sections[i].duration == null) {
        this.duration_value = true;
      }
      if (this.Sections[i].topicsData.length == 0 || this.Sections[i].bloomTaxonomyData.length == 0) {
        this._notifications.error('', 'Please select atleast one topic and one bloomTaxonomy for this section!');
         this.check_topic_boom = true;
      }
      else if (this.Sections[i].itemTypeListData.length == 0 || this.Sections[i].difficultyLevelListData.length == 0) {
        this._notifications.error('', 'Please select atleast one itemType and one difficultyLevel for this section!');
        this.check_item_type_difficulty = true
      }
      else if (this.Sections[i].TableArray.length == 0) {
        this._notifications.error('', 'Please select atleast one difficultyLevel for this section!');
        this.table_created  = true;
      }
      this.Sections[i].TableArray.map((item) => {
        if (item.requiredItems == '' || item.requiredItems == null) {
          this.required_items_values = true;
          this._notifications.error('', 'Please enter the required items values for this section!');
        }
      });
     }

    console.log(this.blueprint_value, this.status_name,
       this.item_name, this.date_selected, this.section_name, 
       this.subject_selected, this.duration_value, this.check_topic_boom,
        this.check_item_type_difficulty,this.table_created,
        this.required_items_values)
    if (this.blueprint_value == false && this.status_name == false && this.item_name == false && this.date_selected == false
      && this.section_name == false && this.subject_selected == false && this.duration_value == false
      && this.check_topic_boom == false && this.check_item_type_difficulty == false && this.table_created == false && this.required_items_values == false) {
      console.log("API HIT")
      if (this.authService.canActivate()) {
        this.showload = true;
        var headers = new Headers();
        headers.append(
          "Authorization",
          "Bearer " + this.cookieService.get("_PTBA")
        );
        obj['subjects'] = obj['subjects'].toString();
        obj['topics'] = obj['topics'].toString();
        obj['blooms_taxonomy'] = obj['blooms_taxonomy'].toString();
        obj['item_types'] = obj['item_types'].toString();
        obj['difficulty_levels'] = obj['difficulty_levels'].toString();
        obj['total_time'] = this.time_convert(obj['total_time']);
        console.log("obj", obj)

        // return obj;
        return this.http
          .post(credentials.host + "/create_testschema", obj, {
            headers: headers,
          })
          .map((res) => res.json())
          .catch((e: any) => {
            return Observable.throw(e);
          })
          .subscribe(
            (data: any) => {
              setTimeout(() => {
                this.showload = false;
                this._notifications.create("", data.message, "info");  
                if(data.success == true){
                  $("#test-bank").modal('show');
                }
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
    }
  };
 time_convert(num)
 { 
  var hours = Math.floor(num / 60);  
  var minutes = num % 60;
  return hours + ":" + minutes;         
}
}

