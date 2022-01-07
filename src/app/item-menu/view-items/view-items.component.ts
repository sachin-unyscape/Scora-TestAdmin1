import { Component, OnInit,TemplateRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GetItemService } from '../../get-item.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { searchFilter } from './searchFilter';
import { attributeSearch } from '../../itemset-menu/view-item-sets/attributefilter';
import { deleteObj } from './deleteTest';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationsService } from 'angular2-notifications';
import { searchdata } from "../../itemset-menu/view-item-sets/searchData";


@Component({
  selector: 'app-view-items',
  templateUrl: './view-items.component.html',
  styleUrls: ['./view-items.component.scss'],
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
export class ViewItemsComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private http:Http,private router: Router,private _notifications: NotificationsService,public route:ActivatedRoute,private getItemService :GetItemService,private cookieService: CookieService,private authService :AuthServiceService,private modalService: BsModalService,public sanitizer: DomSanitizer) {
    this.searchFilter = new searchdata();
    this.searchfilter = new searchFilter()
    this.searchFilter.filters = new attributeSearch();
    this.deleteItems = new deleteObj();
  }

  public searchFilter :searchdata;
  public showLoad;
  public allItemsList = [];
  public showItem;
  public searchfilter : searchFilter;
  public searchedData;
  public searchItems;
  public showAttributeFilter = false;
  public searchError;
  public path;
  public deleteitemPopup;
  public deleteItemId;
  public showMsg;
  public saveMsg;
  public deleteItems : deleteObj;
  public showClearBtn = false;
  public disableScrollWhenFiltering = false;
  public uploadBack = false;
  public page;
  public lazyLoadScroll = false;
  public callApi:boolean;
  public deleteItemFlag = false;
  public deletedItemIdList;
  public deleteItemsTooltip;
  public getMetadataFromService;
  public subjectList=[];
  public subLabelName;
  public topLabelName;
  public subTopLabelName;
  public diffLevelLabelName;
  public TaxonomyLabelName;
  public difficultyLevel;
  public taxonomyList;
  public topicsList = [];
  public selectedSub=[];
  public disableAttributes;
  public settings1;
  public subtopicList = [];
  public selectedTopic =[];
  public settings2;
  public settings3;
  public selectedSubtopic =[];
  public allItemsResp_data =[];
  public custom_Attributes = [];
  public difficulty_level;
  public diffLevel_boolean = true;
  public taxonomy;
  public isFilterApplied = false;
  public goToTrashToggle;
  public goToViewsolutionsToggle;
  public disableDeleteEditButtons;
  public secondAttrOne;
  public secondAttrTwo;
  public secondAttrThree;
  public secondAttrFour;
  public secondAttrFive;

  public secAttrOne;
  public secAttrTwo;
  public secAttrThree;
  public secAttrFour;
  public secAttrFive;
  public activeTab;
  public viewItemQuestions = [];
  public insight_Data = [];


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
    this.activeTab = 0;
    this.secAttrOne = '';
    this.secAttrTwo = '';
    this.secAttrThree = '';
    this.secAttrFour = '';
    this.secAttrFive = '';
    this.goToTrashToggle = true;
    this.goToViewsolutionsToggle = true;
    this.getMetadata()
    this.showAttributeFilter == false
    this.deletedItemIdList = [];
    this.callApi = true;
    this.page = 1;
    this.route.params.subscribe((params)=>{
      this.path = params.bulkupload;
      if(this.path == 'allitem'){
        this.getAllItems();
      }
      if(this.path != 'allitem'){
        this.getAllUploadedItems();
      }
    })
    this.showItem =0;


    this.settings1 = {
      singleSelection: false,
      text: "Select Subject",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "myclass custom-class-example"
    };

    this.settings2 = {
      singleSelection: false,
      text: "Select Topic",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "subject",
      classes: "myclass custom-class-example"
    };

    this.settings3 = {
      singleSelection: false,
      text: "Select SubTopic",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "topic",
	    classes: "myclass custom-class-example"
    };

    this.diffLevel_boolean = true;

  }

  getAllItems(){

    if(this.authService.canActivate() && this.callApi == true){
      if(this.deleteItemFlag == true){
        this.showLoad = true;
      }
      if(this.allItemsList.length == 0){
        this.showLoad = true;
      }else{
        this.lazyLoadScroll = true;
      }
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/all_items/" + this.cookieService.get('_PAOID')+'?page='+this.page,{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {
          this.goToTrashToggle = true;
          this.goToViewsolutionsToggle = true;
          this.showLoad = false;
          this.lazyLoadScroll = false;

          this.viewItemQuestions = data;
        var temp_arr = [];

        if(this.viewItemQuestions[this.showItem].item_type === 2){
          for(let data of this.viewItemQuestions[this.showItem].answer_choices){
            data.data_insight = data.data_insight;
          }
          this.custom_Attributes = this.viewItemQuestions[this.showItem];
        console.log(this.custom_Attributes)
        }
    
        if(this.viewItemQuestions[this.showItem].item_type === 1){
          for(let data of this.viewItemQuestions[this.showItem].answer_choices){
            for(let datas of data.choice_elements){
              data.data_insight = datas.data_insight;
              break
            }
          }
          this.custom_Attributes = this.viewItemQuestions[this.showItem];
        console.log(this.custom_Attributes)
        }
          // console.log("Thisis cu at     " +JSON.stringify(this.custom_Attributes))

          var index;
          if(this.allItemsList.length == 0){
            var item_count = 1;
          }else{
            var arrayLength = this.allItemsList.length-1;
            var item_count = parseInt(this.allItemsList[arrayLength].index)+1;
          }

          if(this.deleteItemFlag == true){
            this.allItemsList = [];
            this.deleteItemFlag = false;
            var item_count = 1;
          }
          if(data.length != 0){
            for(var i=0;i<data.length;i++){
              if(data[i].item_type != 6){

              if(data[i].answer_choices.length != '0'){
                for(var j=0;j<data[i].answer_choices.length;j++){
                  data[i].answer_choices[j].label = String.fromCharCode(97+j);
                  if(data[i].item_type == 1){
                    for(var c=0;c<data[i].answer_choices[j].choice_elements.length;c++){
                      if(data[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(data[i].answer_choices[j].choice_elements[c].data_format_value);
                        data[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                      }else if(data[i].answer_choices[j].choice_elements[c].answer_df_id == 6 || data[i].answer_choices[j].choice_elements[c].answer_df_id == 10 || data[i].answer_choices[j].choice_elements[c].answer_df_id == 11){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(data[i].answer_choices[j].choice_elements[c].data_format_value);
                        data[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                      }
                    }
                  }else if(data[i].item_type == 3 && data[i].matchlist_type == 5){
                    if(data[i].answer_choices[j].answer_df_id == 1){
                      var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(data[i].answer_choices[j].data_format_value);
                      data[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                    }else if(data[i].answer_choices[j].answer_df_id == 6 || data[i].answer_choices[j].answer_df_id == 10 || data[i].answer_choices[j].answer_df_id == 11){
                      var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(data[i].answer_choices[j].data_format_value);
                      data[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                    }
                  }
                }
              }
              data[i].index= item_count;
              item_count ++;
              for(var k=0;k<data[i].item.length;k++){
                if(data[i].item[k].item_df_id == 1){
                  var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(data[i].item[k].data_format_value);
                  data[i].item[k].data_format_value = changeRTEFormat;
                }if(data[i].item[k].item_df_id == 6 || data[i].item[k].item_df_id == 10 || data[i].item[k].item_df_id == 11){
                  var changeRTEFormat = this.sanitizer.bypassSecurityTrustUrl(data[i].item[k].data_format_value);
                  data[i].item[k].data_format_value = changeRTEFormat;
                }
                else if(data[i].item[k].item_df_id  == 9){
                  for(var d=0;d<data[i].item[k].data_format_value.length;d++){
                  for(var m=0;m<data[i].item[k].data_format_value[d].match_data.length;m++){
                    if(data[i].item[k].data_format_value[d].match_data[m].header != 1){
                      if(data[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 6 || data[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 10 || data[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 11){
                        var sanitizeURLMatch = this.sanitizer.bypassSecurityTrustUrl(data[i].item[k].data_format_value[d].match_data[m].match_value);
                        data[i].item[k].data_format_value[d].match_data[m].match_value = sanitizeURLMatch;
                      }
                    }
                  }
                  }
                }
              }


              }else if(data[i].item_type == 6){
                // this.directive_items_count = data.section_items[i].directive_items_count;
                // this.directIdArray.push(data.section_items[i].directive_id);
                var directiveItemCount = item_count + data[i].directive_items_count -1;
                data[i].index = item_count +"-"+ directiveItemCount;
                for(var k=0;k<data[i].directive_content.length;k++){
                  if(data[i].directive_content[k].item_df_id == 1){
                    var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(data[i].directive_content[k].data_format_value);
                    data[i].directive_content[k].data_format_value = changeRTEFormat;
                  }
                }

              }
            }

            for(var pg=0;pg<data.length;pg++){
              this.allItemsList.push(data[pg]);
            }
          }
          // if data returns empty array or array less than 10 no need to call this function again so this var is set to false to stop calling this function again
          else if(data.length == 0 || data.length < 10){
            this.callApi = false;
          }


        },
        error => {

          this.showLoad  = false;
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

  getAllUploadedItems(){
    if(this.authService.canActivate()){
     this.showLoad = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/all_items/" + this.cookieService.get('_PAOID') +'/'+this.path,{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {
          this.showLoad= false;
          var index;
          var item_count = 1;


          if(data[this.showItem].item_type === 2){
      for(let data1 of data[this.showItem].answer_choices){
        data1.data_insight = data1.data_insight;
      }
      this.custom_Attributes = data[this.showItem];
    console.log(this.custom_Attributes)
    }

    if(data[this.showItem].item_type === 1){
      for(let data1 of this.allItemsList[this.showItem].answer_choices){
        for(let datas of data1.choice_elements){
          data1.data_insight = datas.data_insight;
          break
        }
      }
      this.custom_Attributes = data[this.showItem];
    console.log(this.custom_Attributes)
    }
  
            this.custom_Attributes = data[this.showItem];
          this.allItemsList = data;
          this.uploadBack = true;
          for(var i=0;i<this.allItemsList.length;i++){
            if(this.allItemsList[i].item_type != 6){

            if(this.allItemsList[i].answer_choices.length != '0'){
              for(var j=0;j<this.allItemsList[i].answer_choices.length;j++){
                this.allItemsList[i].answer_choices[j].label = String.fromCharCode(97+j);
                if(this.allItemsList[i].item_type == 1){
                  for(var c=0;c<this.allItemsList[i].answer_choices[j].choice_elements.length;c++){
                    if(this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
                      var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value);
                      this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                    }else if(this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 6 || this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 10 || this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 11){
                      var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value);
                      this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                    }
                  }
                }else if(this.allItemsList[i].item_type == 3 && this.allItemsList[i].matchlist_type == 5){
                  if(this.allItemsList[i].answer_choices[j].answer_df_id == 1){
                    var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].answer_choices[j].data_format_value);
                    this.allItemsList[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                  }else if(this.allItemsList[i].answer_choices[j].answer_df_id == 6 || this.allItemsList[i].answer_choices[j].answer_df_id == 10 || this.allItemsList[i].answer_choices[j].answer_df_id == 11){
                    var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].answer_choices[j].data_format_value);
                    this.allItemsList[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                  }
                }
              }
            }
            this.allItemsList[i].index= item_count;
            item_count ++;
            for(var k=0;k<this.allItemsList[i].item.length;k++){
              if(this.allItemsList[i].item[k].item_df_id == 1){
                var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].item[k].data_format_value);

                this.allItemsList[i].item[k].data_format_value = changeRTEFormat;
              }if(this.allItemsList[i].item[k].item_df_id == 6 || this.allItemsList[i].item[k].item_df_id == 10 || this.allItemsList[i].item[k].item_df_id == 11){
                var changeRTEFormat = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].item[k].data_format_value);
                this.allItemsList[i].item[k].data_format_value = changeRTEFormat;
              }
              else if(this.allItemsList[i].item[k].item_df_id  == 9){
                for(var d=0;d<this.allItemsList[i].item[k].data_format_value.length;d++){
                 for(var m=0;m<this.allItemsList[i].item[k].data_format_value[d].match_data.length;m++){
                   if(this.allItemsList[i].item[k].data_format_value[d].match_data[m].header != 1){
                     if(this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 6 || this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 10 || this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 11){
                      var sanitizeURLMatch = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_value);
                      this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_value = sanitizeURLMatch;
                     }
                   }
                 }
                }
              }
            }


            }else if(this.allItemsList[i].item_type == 6){
              // this.directive_items_count = this.allItemsList.section_items[i].directive_items_count;
              // this.directIdArray.push(this.allItemsList.section_items[i].directive_id);
              var directiveItemCount = item_count + this.allItemsList[i].directive_items_count -1;
              this.allItemsList[i].index = item_count +"-"+ directiveItemCount;
              for(var k=0;k<this.allItemsList[i].directive_content.length;k++){
                if(this.allItemsList[i].directive_content[k].item_df_id == 1){
                  var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].directive_content[k].data_format_value);
                  this.allItemsList[i].directive_content[k].data_format_value = changeRTEFormat;
                }
              }
            }
          }

        },
        error => {

          this.showLoad  = false;
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

  onScroll(){
    if(this.disableScrollWhenFiltering === false){
      this.page = this.page + 1;
      if(this.callApi == true){   // call this function only if this var is set to true ...
        this.getAllItems();
      }
    }
  }

  showQues(index){
    this.showItem = index;
    
    
    if(this.allItemsList[this.showItem].item_type === 2){
      for(let data of this.allItemsList[this.showItem].answer_choices){
        data.data_insight = data.data_insight;
      }
      this.custom_Attributes = this.allItemsList[this.showItem];
    console.log(this.custom_Attributes)
    }

    if(this.allItemsList[this.showItem].item_type === 1){
      for(let data of this.allItemsList[this.showItem].answer_choices){
        for(let datas of data.choice_elements){
          data.data_insight = datas.data_insight;
          break
        }
      }
      this.custom_Attributes = this.allItemsList[this.showItem];
    console.log(this.custom_Attributes)
    }
    
  }

  editItemList(editableItem,editFlag){
    if(this.deletedItemIdList.length == 0){
      if(editFlag){
        if(editableItem.item_type != 6){
          for(var i=0;i<editableItem.item.length;i++){
            if(editableItem.item[i].item_df_id == 1 || editableItem.item[i].item_df_id == 6 || editableItem.item[i].item_df_id == 10 || editableItem.item[i].item_df_id == 11){
              editableItem.item[i].data_format_value = editableItem.item[i].data_format_value.changingThisBreaksApplicationSecurity;
            }
            else if(editableItem.item[i].item_df_id == 9){
              for(var d=0;d<editableItem.item[i].data_format_value.length;d++){
              for(var m=0;m<editableItem.item[i].data_format_value[d].match_data.length;m++){
                if(editableItem.item[i].data_format_value[d].match_data[m].header != 1){
                  if(editableItem.item[i].data_format_value[d].match_data[m].match_data_format_id == 6 || editableItem.item[i].data_format_value[d].match_data[m].match_data_format_id == 10 || editableItem.item[i].data_format_value[d].match_data[m].match_data_format_id == 11){
                    editableItem.item[i].data_format_value[d].match_data[m].match_value = editableItem.item[i].data_format_value[d].match_data[m].match_value.changingThisBreaksApplicationSecurity;
                  }
                }
              }
              }
            }
          }

          if(editableItem.item_type == 1){
            for(var a=0;a<editableItem.answer_choices.length;a++){
              for(var b=0;b<editableItem.answer_choices[a].choice_elements.length;b++){
                if(editableItem.answer_choices[a].choice_elements[b].answer_df_id == 1 || editableItem.answer_choices[a].choice_elements[b].answer_df_id == 6 ||editableItem.answer_choices[a].choice_elements[b].answer_df_id == 10 || editableItem.answer_choices[a].choice_elements[b].answer_df_id == 11){
                  editableItem.answer_choices[a].choice_elements[b].data_format_value = editableItem.answer_choices[a].choice_elements[b].data_format_value.changingThisBreaksApplicationSecurity;
                }
              }
            }
          }else if(editableItem.item_type == 3 && editableItem.matchlist_type == 5){
            for(var a=0;a<editableItem.answer_choices.length;a++){
              if(editableItem.answer_choices[a].answer_df_id == 1 || editableItem.answer_choices[a].answer_df_id == 6 || editableItem.answer_choices[a].answer_df_id == 10 || editableItem.answer_choices[a].answer_df_id == 11){
                editableItem.answer_choices[a].data_format_value = editableItem.answer_choices[a].data_format_value.changingThisBreaksApplicationSecurity;
              }
            }
          }
        }else if(editableItem.item_type == 6){
          for(var i=0;i<editableItem.directive_content.length;i++){
            if(editableItem.directive_content[i].item_df_id == 1){
              editableItem.directive_content[i].data_format_value = editableItem.directive_content[i].data_format_value.changingThisBreaksApplicationSecurity;
            }
          }
        }
        this.getItemService.getResponse(editableItem,'',this.path);
        this.router.navigate(['Items/additem',0,0,7]);
      }
    }
  }

  SearchKeywords(searchdata){

    const pattern1 = /^[^\s].*/;

    if(pattern1.test(searchdata)){
      // this.searchfilter = new searchFilter();
      this.searchfilter.search_data = searchdata;
      this.searchfilter.filters = new attributeSearch();
      this.searchfilter.org_id = this.cookieService.get('_PAOID');

      var body = this.searchfilter;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + '/search_items_suggestions', body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {


          this.searchedData = data;


        },
        error => {

          this.showLoad  = false;
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

//search by filter

searchByFilter(event){
  this.disableScrollWhenFiltering = true;
  const pattern1 = /^[^\s].*/;
  if(this.authService.canActivate()){
    if((this.searchItems == '' || this.searchItems == undefined || !pattern1.test(this.searchItems))){
      this.showAttributeFilter = false;
      this.searchError = true;
    }
    else if((event.keyCode == 13 || event ==13) && pattern1.test(this.searchItems)){
      this.searchError = false;
      this.searchfilter.search_data = this.searchItems;
      this.searchfilter.org_id = this.cookieService.get('_PAOID');
      this.showLoad = true;
      this.searchfilter.filters=new attributeSearch();
      this.searchfilter.filters.subject = this.selectedSub;
      this.searchfilter.filters.topic = this.selectedTopic;
      this.searchfilter.filters.subtopic = this.selectedSubtopic;
      this.searchfilter.filters.difficulty_level = this.difficulty_level== undefined ? "" : this.difficulty_level;
      this.searchfilter.filters.taxonomy = this.taxonomy == undefined ? "": this.taxonomy;
      this.searchfilter.filters.secondary_attribute_01 = this.secAttrOne;
      this.searchfilter.filters.secondary_attribute_02 = this.secAttrTwo;
      this.searchfilter.filters.secondary_attribute_03 = this.secAttrThree;
      this.searchfilter.filters.secondary_attribute_04 = this.secAttrFour;
      this.searchfilter.filters.secondary_attribute_05 = this.secAttrFive;

      // this.searchFilter.filters.element_search = this.searchFilter.filters.element_search == undefined ? false : this.searchFilter.filters.element_search;

      this.showAttributeFilter = false;
      this.isFilterApplied = true;

      var body = this.searchfilter;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + '/filter_items', body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {
            this.showLoad = false;

            this.showClearBtn = true;
            var index;
            var item_count = 1;
            this.allItemsList = data;
            this.deletedItemIdList = [];
            for(var i=0;i<this.allItemsList.length;i++){
              if(this.allItemsList[i].item_type != 6){

                if(this.allItemsList[i].answer_choices.length != '0'){
                  for(var j=0;j<this.allItemsList[i].answer_choices.length;j++){
                    this.allItemsList[i].answer_choices[j].label = String.fromCharCode(97+j);
                    if(this.allItemsList[i].item_type == 1){
                      for(var c=0;c<this.allItemsList[i].answer_choices[j].choice_elements.length;c++){
                        if(this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
                          var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value);
                          this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                        }else if(this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 6 || this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 10 || this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 11){
                          var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value);
                          this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                        }
                      }
                    }else if(this.allItemsList[i].item_type == 3 && this.allItemsList[i].matchlist_type == 5){
                      if(this.allItemsList[i].answer_choices[j].answer_df_id == 1){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].answer_choices[j].data_format_value);
                        this.allItemsList[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                      }else if(this.allItemsList[i].answer_choices[j].answer_df_id == 6 || this.allItemsList[i].answer_choices[j].answer_df_id == 10 || this.allItemsList[i].answer_choices[j].answer_df_id == 11){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].answer_choices[j].data_format_value);
                        this.allItemsList[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                      }
                    }
                  }
                }
              this.allItemsList[i].index= item_count;
              item_count ++;
              for(var k=0;k<this.allItemsList[i].item.length;k++){
                if(this.allItemsList[i].item[k].item_df_id == 1){
                  var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].item[k].data_format_value);

                  this.allItemsList[i].item[k].data_format_value = changeRTEFormat;
                }if(this.allItemsList[i].item[k].item_df_id == 6 || this.allItemsList[i].item[k].item_df_id == 10 || this.allItemsList[i].item[k].item_df_id == 11){
                  var changeRTEFormat = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].item[k].data_format_value);
                  this.allItemsList[i].item[k].data_format_value = changeRTEFormat;
                }
                else if(this.allItemsList[i].item[k].item_df_id  == 9){
                  for(var d=0;d<this.allItemsList[i].item[k].data_format_value.length;d++){
                   for(var m=0;m<this.allItemsList[i].item[k].data_format_value[d].match_data.length;m++){
                     if(this.allItemsList[i].item[k].data_format_value[d].match_data[m].header != 1){
                       if(this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 6 || this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 10 || this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 11){
                        var sanitizeURLMatch = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_value);
                        this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_value = sanitizeURLMatch;
                       }
                     }
                   }
                  }
                }
              }

              }else if(this.allItemsList[i].item_type == 6){
                // this.directive_items_count = this.allItemsList.section_items[i].directive_items_count;
                // this.directIdArray.push(this.allItemsList.section_items[i].directive_id);
                var directiveItemCount = item_count + this.allItemsList[i].directive_items_count -1;
                this.allItemsList[i].index = item_count +"-"+ directiveItemCount;
                for(var k=0;k<this.allItemsList[i].directive_content.length;k++){
                  if(this.allItemsList[i].directive_content[k].item_df_id == 1){
                    var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].directive_content[k].data_format_value);
                    this.allItemsList[i].directive_content[k].data_format_value = changeRTEFormat;
                  }
                }
              }
            }
          },
          error => {
            this.showClearBtn = false;
            this.showLoad  = false;
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
}

clearData(){
  this.allItemsList = [];
  this.page = 1;
  this.disableScrollWhenFiltering = false;
  this.callApi = true;
  this.showLoad = true;
  this.allItemsList = [];
  this.page = 1;
  this.secAttrOne = '';
  this.secAttrTwo = '';
  this.secAttrThree = '';
  this.secAttrFour = '';
  this.secAttrFive = '';
  this.selectedSub=[];
  this.selectedTopic =[];
  this.selectedSubtopic =[];
  this.topicsList = [];
  this.subtopicList = [];
  this.taxonomy = "";
  this.difficulty_level ="";
  this.showAttributeFilter = false;
  this.isFilterApplied = false;
  this.searchItems = '';
  this.searchError = false;
  this.showClearBtn = false;
  this.searchedData = [];
  this.getAllItems();
}


//delete item
deleteItem(itemid,deleteFlag,template: TemplateRef<any>){
  if(this.deletedItemIdList.length == 0){
    if(deleteFlag){
      this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-md' },this.config));
      // this.deleteitemPopup = true;
      this.deleteItemId = itemid;
    }
  }
}

bulkItemDelete(template: TemplateRef<any>){
  this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-md' },this.config));
}

deleteItemConfirm(findDeleteType){
  this.modalRef.hide();
  if(this.authService.canActivate()){
    this.deleteItems = new deleteObj();

    if(findDeleteType == 1) {
      this.deleteItems.category = 1;
      this.deleteItems.value.push(this.deleteItemId);
    }else if(findDeleteType == 2){
      if(this.deletedItemIdList.length == 0){
        // Delete Entire Items From Item Bank
        this.deleteItems.value = [];
        this.deleteItems.category = 4;
      }else{
        this.deleteItems.category = 1;
        this.deleteItems.value = this.deletedItemIdList;
      }
    }

    if(this.goToTrashToggle == true){
      this.deleteItems.trash = "y";
    }else{
      this.deleteItems.trash = "n";
    }

    if(this.goToViewsolutionsToggle == true){
      this.deleteItems.view_solutions = "y";
    }else{
      this.deleteItems.view_solutions = "n";
    }

    this.deleteItems.org_id = this.cookieService.get('_PAOID');
    this.showLoad = true;

    var body = this.deleteItems;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    let options = new RequestOptions({
      headers : headers,
      body:body
    })
    return this.http.delete(credentials.host + '/remove_data', options)
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
        data => {
          // this.showLoad = false;

          if(data.success == true){
            this.deletedItemIdList = [];
            this.showMsg = data.message;
            this.deleteItemFlag = true;  // This var is set true to empty allItemList var.
            // this.saveMsg = true;
            this._notifications.create('',data.message, 'info');
            // setTimeout(()=>{
            this.saveMsg = false;
            this.allItemsList = [];
            this.page = 1;

            this.searchItems = '';
            this.showClearBtn = false;
            this.searchedData = [];
            this.getAllItems();
            if(this.deletedItemIdList.length != 0){
              this.disableDeleteEditButtons = true;
            }else{
              this.disableDeleteEditButtons = false;
            }

            // },3000);

          } else{
            this.showMsg = data.message;
            // this.saveMsg = true;
            this._notifications.create('',data.message, 'error')
            setTimeout(()=>{
              this.saveMsg = false;

            },4000);
          }
        },
        error => {

          this.showLoad = false;
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

  selctedItemsToDelete(deletedItemId){
    if(this.deletedItemIdList.includes(deletedItemId)) {
      var getCurInd = this.deletedItemIdList.indexOf(deletedItemId)
      this.deletedItemIdList.splice(getCurInd, 1);
    }else{
      this.deletedItemIdList.push(deletedItemId);
    }

    if(this.deletedItemIdList.length != 0){
      this.disableDeleteEditButtons = true;
    }else{
      this.disableDeleteEditButtons = false;
    }
  }

  getToolTipValue() {
    if(this.deletedItemIdList.length == 0){
      this.deleteItemsTooltip = 'Remove all items from item bank';
    }else {
      this.deleteItemsTooltip = 'Remove selected item(s) from item bank';
    }
  }

  filterWithAttributes(){
    if(this.showAttributeFilter == false){
      this.showAttributeFilter = true;
    }else if(this.showAttributeFilter == true){
      this.showAttributeFilter = false;
    }

  }

  getTopic(selectedSub){
    if(this.authService.canActivate()){
      if(selectedSub.length==0){
        this.topicsList =[];
        this.subtopicList = [];
      }
      var body = selectedSub;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + '/get_topics/'+ this.cookieService.get('_PAOID'), body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {
            this.topicsList=data;

          },
          error => {

            this.showLoad = false;
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

  getSubtopic(selectedTopic){
    if(this.authService.canActivate()){
    var body = selectedTopic;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.post(credentials.host + '/get_subtopics/' + this.cookieService.get('_PAOID'), body,{headers: headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
          data => {
            this.subtopicList=data;
          },
          error => {

            this.showLoad = false;
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

  ApplyFilter(){
    this.disableScrollWhenFiltering = true;
    if(this.searchItems == undefined){
      this.searchFilter.search_data = '';
    }else{
      this.searchFilter.search_data = this.searchItems;
    }

    this.searchFilter.org_id = this.cookieService.get('_PAOID')
    this.searchfilter.filters=new attributeSearch();
    this.searchFilter.filters.subject = this.selectedSub;
    this.searchFilter.filters.topic = this.selectedTopic;
    this.searchFilter.filters.subtopic = this.selectedSubtopic;
    this.searchFilter.filters.difficulty_level = this.difficulty_level== undefined ? "" : this.difficulty_level;
    this.searchFilter.filters.taxonomy = this.taxonomy == undefined ? "": this.taxonomy;
    this.searchFilter.filters.secondary_attribute_01 = this.secAttrOne;
    this.searchFilter.filters.secondary_attribute_02 = this.secAttrTwo;
    this.searchFilter.filters.secondary_attribute_03 = this.secAttrThree;
    this.searchFilter.filters.secondary_attribute_04 = this.secAttrFour;
    this.searchFilter.filters.secondary_attribute_05 = this.secAttrFive;

    // this.searchFilter.filters.element_search = this.searchFilter.filters.element_search == undefined ? false : this.searchFilter.filters.element_search;

    this.showAttributeFilter = false;
    this.isFilterApplied = true;

    this.showLoad = true;
      var body = this.searchFilter;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + '/filter_items', body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {
            this.showLoad = false;

            this.showClearBtn = true;
            var index;
            var item_count = 1;
            this.allItemsList = data;
            if(this.allItemsList.length === 0){
              this.page = 1;
              this.showClearBtn = false;
              this._notifications.create('','Item not found', 'error')
              setTimeout(()=>{
                this.saveMsg = false;

                },4000);
                this.searchItems = '';
               this.selectedSub = [];
               this.selectedTopic = [];
               this.selectedSubtopic = [];
               this.difficulty_level = '';
               this.taxonomy = '';
               this.secAttrOne = '';
               this.secAttrTwo = '';
               this.secAttrThree = '';
               this.secAttrFour = '';
               this.secAttrFive = '';
              this.getAllItems();
            }
            this.deletedItemIdList = [];
            for(var i=0;i<this.allItemsList.length;i++){
              if(this.allItemsList[i].item_type != 6){

                if(this.allItemsList[i].answer_choices.length != '0'){
                  for(var j=0;j<this.allItemsList[i].answer_choices.length;j++){
                    this.allItemsList[i].answer_choices[j].label = String.fromCharCode(97+j);
                    if(this.allItemsList[i].item_type == 1){
                      for(var c=0;c<this.allItemsList[i].answer_choices[j].choice_elements.length;c++){
                        if(this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
                          var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value);
                          this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                        }else if(this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 6 || this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 10 || this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 11){
                          var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value);
                          this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                        }
                      }
                    }else if(this.allItemsList[i].item_type == 3 && this.allItemsList[i].matchlist_type == 5){
                      if(this.allItemsList[i].answer_choices[j].answer_df_id == 1){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].answer_choices[j].data_format_value);
                        this.allItemsList[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                      }else if(this.allItemsList[i].answer_choices[j].answer_df_id == 6 || this.allItemsList[i].answer_choices[j].answer_df_id == 10 || this.allItemsList[i].answer_choices[j].answer_df_id == 11){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].answer_choices[j].data_format_value);
                        this.allItemsList[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                      }
                    }
                  }
                }
              this.allItemsList[i].index= item_count;
              item_count ++;
              for(var k=0;k<this.allItemsList[i].item.length;k++){
                if(this.allItemsList[i].item[k].item_df_id == 1){
                  var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].item[k].data_format_value);

                  this.allItemsList[i].item[k].data_format_value = changeRTEFormat;
                }if(this.allItemsList[i].item[k].item_df_id == 6 || this.allItemsList[i].item[k].item_df_id == 10 || this.allItemsList[i].item[k].item_df_id == 11){
                  var changeRTEFormat = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].item[k].data_format_value);
                  this.allItemsList[i].item[k].data_format_value = changeRTEFormat;
                }
                else if(this.allItemsList[i].item[k].item_df_id  == 9){
                  for(var d=0;d<this.allItemsList[i].item[k].data_format_value.length;d++){
                   for(var m=0;m<this.allItemsList[i].item[k].data_format_value[d].match_data.length;m++){
                     if(this.allItemsList[i].item[k].data_format_value[d].match_data[m].header != 1){
                       if(this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 6 || this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 10 || this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 11){
                        var sanitizeURLMatch = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_value);
                        this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_value = sanitizeURLMatch;
                       }
                     }
                   }
                  }
                }
              }

              }else if(this.allItemsList[i].item_type == 6){
                // this.directive_items_count = this.allItemsList.section_items[i].directive_items_count;
                // this.directIdArray.push(this.allItemsList.section_items[i].directive_id);
                var directiveItemCount = item_count + this.allItemsList[i].directive_items_count -1;
                this.allItemsList[i].index = item_count +"-"+ directiveItemCount;
                for(var k=0;k<this.allItemsList[i].directive_content.length;k++){
                  if(this.allItemsList[i].directive_content[k].item_df_id == 1){
                    var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].directive_content[k].data_format_value);
                    this.allItemsList[i].directive_content[k].data_format_value = changeRTEFormat;
                  }
                }
              }
            }
          },
          error => {
            this.showClearBtn = false;
            this.showLoad  = false;
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

  resetAttribute(){
    this.allItemsList = [];
    this.page = 1;
    this.disableScrollWhenFiltering = false;
    this.selectedSub=[];
    this.selectedTopic =[];
    this.selectedSubtopic =[];
    this.topicsList = [];
    this.subtopicList = [];
    this.taxonomy = "";
    this.difficulty_level ="";
    this.showAttributeFilter = false;
    this.isFilterApplied = false;
    this.secAttrOne = '';
    this.secAttrTwo = '';
    this.secAttrThree = '';
    this.secAttrFour = '';
    this.secAttrFive = '';
    this.getAllItems();
  }

  getMetadata(){
        
    localStorage.removeItem('TZNM');
    localStorage.removeItem('TZNMVL');
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host + "/get_metadatas/" + this.cookieService.get('_PAOID'),{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {
            
        localStorage.setItem('TZNM' , data.timezone_name);
        localStorage.setItem('TZNMVL' , data.timezone_value);
        this.difficultyLevel=data.difficulty_level;
        this.taxonomyList =data.taxonomy;
        this.subjectList = data.subjects;
        this.subLabelName = data.parameters.linked_attribute_1;
        this.topLabelName = data.parameters.linked_attribute_2;
        this.subTopLabelName = data.parameters.linked_attribute_3;
        this.diffLevelLabelName = data.parameters.difficulty_level;
        this.TaxonomyLabelName = data.parameters.taxonomy;
        this.secondAttrOne = data.sec_attr_01;
        this.secondAttrTwo = data.sec_attr_02;
        this.secondAttrThree = data.sec_attr_03;
        this.secondAttrFour = data.sec_attr_04;
        this.secondAttrFive = data.sec_attr_05;
      },
      error => {

        this.showLoad = false;
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

  changeDeleteChecks(val){
    if(val == 1){
      if(this.goToTrashToggle == true){
        this.goToTrashToggle = false;
      }else{
        this.goToTrashToggle = true;
      }
    }else if(val == 2){
      if(this.goToViewsolutionsToggle == true){
        this.goToViewsolutionsToggle = false;
      }else{
        this.goToViewsolutionsToggle = true;
        this.goToTrashToggle = true;
      }
    }
  }

}
