import { Component, OnInit,Output,EventEmitter,TemplateRef,ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { searchdata } from '../view-item-sets/searchData';
import { attributeSearch } from '../view-item-sets/attributefilter';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { itemMap } from '../view-item-sets/itemMap';
import { deleteObj } from '../view-item-sets/deleteItem-itemset';
import { GetItemService } from '../../get-item.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationsService } from 'angular2-notifications';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AddComments } from '../../task-menu/to-create/AddComments';
import * as _ from 'lodash';

@Component({
  selector: 'app-requested-itemset',
  templateUrl: './requested-itemset.component.html',
  styleUrls: ['./requested-itemset.component.scss'],
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
  ],
  viewProviders: [DragulaService]
})
export class RequestedItemsetComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  constructor(private http:Http,private router: Router,public route:ActivatedRoute,private dragulaService: DragulaService,private getItemService :GetItemService,private cookieService: CookieService,private authService :AuthServiceService,private modalService: BsModalService, private _notifications: NotificationsService,public sanitizer: DomSanitizer) {
    this.searchFilter = new searchdata();
    this.searchFilter.filters = new attributeSearch();
    this.itemMapDetail = new itemMap();
    this.itemsetValidation = new itemMap();
    this.deleteItemset = new  deleteObj();
    this.deleteItemItemset = new itemMap();
    this.getItemComments = new AddComments();

    dragulaService.drop.subscribe((value) => {



    });
  }


  public searchFilter :searchdata;
  public itemMapDetail : itemMap;
  public itemsetValidation : itemMap;
  public deleteItemset : deleteObj;
  public deleteItemItemset : itemMap;


  public itemSetLists;
  public getOneItem;
  public showItemList;
  public showItemSetList;
  public choosenItemSetId;
  public choosenItemSetSection;
  public eachSectionItems;
  public showItem;
  public showItemBank;
  public showItemSearch;
  public showLoad;
  public showSearchFilter;
  public showAttributeFilter = false;
  public subjectList=[];
  public topicsList = [];
  public subtopicList = [];
  public taxonomyList;
  public difficultyLevel;
  public difficulty_level;
  public taxonomy;
  public selectedSub=[];
  public selectedTopic =[];
  public selectedSubtopic =[];
  public settings1;
  public settings2;
  public settings3;
  public checkToggle: boolean = false;
  public searchItems;
  public searchedData = [];
  public disableAttributes;
  public searchError;
  public searchedItems = [];
  public selectedSectionItems;
  public itemidArray =[];
  public checkEachItem = false;
  public checkAllItems = false;
  public items=[];
  public selectAllFlag = false;
  public isclick = true;
  public showALLItems = false;
  public sectionName;
  public allItemListFlag;
  public showPreviewModal;
  public arrayToDrag=[];
  public previewQuestions;
  public directivepreviewQuestions;
  public showMsg;
  public saveMsg;
  public path;
  public itemset_id;
  public sectionid;
  public activeTab;
  public activeSubTab = 1;
  public hideIcon = true;
  public activeIndex;
  public colors = [];
  public onlydirect;
  public direcQues;
  public directive_items_count;
  public directIdArray =[];
  public visibleItemDistribution;
  public itemDistribution;
  public deleteitemPopup;
  public deleteCategory;
  public deleteID;
  public choosenSectionId;
  public deleteitemfromitemsetPopup;
  public itemsetMapAlert;
  public backToviewList = false;
  isModalShown: boolean = false;
  public diffLevel_boolean = true;
  public isFilterApplied = false;
  public subLabelName;
  public topLabelName;
  public subTopLabelName;
  public diffLevelLabelName;
  public TaxonomyLabelName;
  public ContentTypelabelName:string;
  public getItemComments:AddComments;
  public EachItemComments:any;
  public SaveCommentsLoader = false;
  public eachItemStatus = false;
  public sectionStatus = false;
  public itemsetComments;
  public fileChoosen;


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

  options1: any = {
    copy: true,
    copySortSource: true
  }

  ngOnInit() {
   this.diffLevel_boolean = true;
    this.activeTab = 0;

    this.ItemSetList();
    this.showItemList = false;
    this.showItemSetList = true;

    this.settings1 = {
      singleSelection: false,
      text: "Select"+''+this.subLabelName,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "myclass custom-class-example"
    };

    this.settings2 = {
      singleSelection: false,
      text: "Select"+''+this.topLabelName,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "subject",
      classes: "myclass custom-class-example"
    };

    this.settings3 = {
      singleSelection: false,
      text: "Select"+''+this.subTopLabelName,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "topic",
	    classes: "myclass custom-class-example"
    };

   this.colors = ['#f2bf93','#f7ede3','#f8dbf9','#f4f0be','#ddefbf','#d4efbd','#c5f4b7','#b5f4db','#caddf9','#d0bfef'];

  }

  ItemSetList(){
    if(this.authService.canActivate()){
    this.showLoad = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +"/review_menu/" + this.cookieService.get('_PAOID') +'/' + 'requested_itemsets',{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {

        this.showLoad = false;
        this.itemSetLists= data;
        if(this.path == 3){
          this.getItemsetDet(this.itemset_id,this.sectionid);
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

  getItemsetDet(id,sectionid){
    if(this.authService.canActivate()){
    this.isclick = true;
      this.showLoad = true;
      this.choosenItemSetId= id;
      this.choosenSectionId = sectionid;
      this.showItem = 0;

      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/item_details/" +this.cookieService.get('_PAOID') +"/"+ id + "/all_sections/"+ 1+'/'+ 2,{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.itemidArray = [];
          this.showLoad = false;
          this.getOneItem = data;
          var index;

          if(sectionid != 0 && sectionid != undefined){
            for(var m1=0;m1<this.getOneItem.itemset_sections.length;m1++){
              // if(this.getOneItem.itemset_sections[i].section_id == sectionid){
                index = m1;
                var item_count = 1;
                this.eachSectionItems = this.getOneItem.itemset_sections[index];
                // this.itemsetComments = this.getOneItem.itemset_sections[index].comments;
                // this.choosenItemSetSection = this.eachSectionItems.section_id;
                this.sectionName = this.eachSectionItems.section_name;
                for(var i=0;i<this.eachSectionItems.section_items.length;i++){

                  if(this.eachSectionItems.section_items[i].item_type != 6){
                  this.itemidArray.push(this.eachSectionItems.section_items[i].item_id);
                  if(this.eachSectionItems.section_items[i].answer_choices.length != '0'){
                    for(var j=0;j<this.eachSectionItems.section_items[i].answer_choices.length;j++){
                      this.eachSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j);

                      if(this.eachSectionItems.section_items[i].item_type == 1){
                        for(var c=0;c<this.eachSectionItems.section_items[i].answer_choices[j].choice_elements.length;c++){
                          if(this.eachSectionItems.section_items[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
                            var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value);
                            this.eachSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                          }
                        }
                      }else if(this.eachSectionItems.section_items[i].item_type == 3 && this.eachSectionItems.section_items[i].matchlist_type == 5){
                        if(this.eachSectionItems.section_items[i].answer_choices[j].answer_df_id == 1){
                          var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].answer_choices[j].data_format_value);
                          this.eachSectionItems.section_items[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                        }
                      }
                    }
                  }

                  this.eachSectionItems.section_items[i].index= item_count;
                  item_count ++;

                  for(var k=0;k<this.eachSectionItems.section_items[i].item.length;k++){
                    if(this.eachSectionItems.section_items[i].item[k].item_df_id ==1){

                      var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].item[k].data_format_value);

                      this.eachSectionItems.section_items[i].item[k].data_format_value = changeRTEFormat;

                    }else if(this.eachSectionItems.section_items[i].item[k].item_df_id == 6 || this.eachSectionItems.section_items[i].item[k].item_df_id == 10 || this.eachSectionItems.section_items[i].item[k].item_df_id == 11){
                      var sanitizeURL = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].item[k].data_format_value);
                      this.eachSectionItems.section_items[i].item[k].data_format_value = sanitizeURL;
                    }else if(this.eachSectionItems.section_items[i].item[k].item_df_id == 9){
                      for(var d=0;d<this.eachSectionItems.section_items[i].item[k].data_format_value.length;d++){
                       for(var m=0;m<this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data.length;m++){
                         if(this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].header != 1){
                           if(this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 6 || this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 10 || this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 11){
                            var sanitizeURLMatch = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_value);
                            this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_value = sanitizeURLMatch;

                           }
                         }
                       }
                      }
                    }

                  }

                  if(this.eachSectionItems.section_items[i].item_type == 1){
                    for(var a=0;a<this.eachSectionItems.section_items[i].answer_choices.length;a++){
                      for(var c=0;c<this.eachSectionItems.section_items[i].answer_choices[a].choice_elements.length;c++){
                        if(this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].answer_df_id == 6 || this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].answer_df_id == 10 || this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].answer_df_id == 11){
                          var sanitizeURLAns = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].data_format_value);
                          this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].data_format_value = sanitizeURLAns;
                        }
                      }
                    }
                  }else if(this.eachSectionItems.section_items[i].item_type == 3 && this.eachSectionItems.section_items[i].matchlist_type == 5){
                    for(var ma=0;ma<this.eachSectionItems.section_items[i].answer_choices.length;ma++){
                      if(this.eachSectionItems.section_items[i].answer_choices[ma].answer_df_id == 6 || this.eachSectionItems.section_items[i].answer_choices[ma].answer_df_id == 10 || this.eachSectionItems.section_items[i].answer_choices[ma].answer_df_id == 11){
                        var sanitizeURLMatchAns = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].answer_choices[ma].data_format_value);
                        this.eachSectionItems.section_items[i].answer_choices[ma].data_format_value = sanitizeURLMatchAns;
                      }
                    }
                  }

                  }else if(this.eachSectionItems.section_items[i].item_type == 6){
                    this.directive_items_count = this.eachSectionItems.section_items[i].directive_items_count;
                    this.directIdArray.push(this.eachSectionItems.section_items[i].directive_id);
                    var directiveItemCount = item_count + this.eachSectionItems.section_items[i].directive_items_count -1;
                    this.eachSectionItems.section_items[i].index = item_count +"-"+ directiveItemCount;

                    for(var k=0;k<this.eachSectionItems.section_items[i].directive_content.length;k++){
                      if(this.eachSectionItems.section_items[i].directive_content[k].item_df_id ==1){

                        var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].directive_content[k].data_format_value)
                        this.eachSectionItems.section_items[i].directive_content[k].data_format_value = changeRTEFormat;
                      }else if(this.eachSectionItems.section_items[i].directive_content[k].item_df_id == 6 || this.eachSectionItems.section_items[i].directive_content[k].item_df_id == 10 || this.eachSectionItems.section_items[i].directive_content[k].item_df_id == 11){
                        var sanitizeURL = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].directive_content[k].data_format_value);
                        this.eachSectionItems.section_items[i].directive_content[k].data_format_value = sanitizeURL;
                      }
                    }
                  }

                }
              // }
              if(this.getOneItem.itemset_sections[m].section_id == sectionid){
                var sectionIndex = m;
              }
            }
            this.eachSectionItems = this.getOneItem.itemset_sections[sectionIndex];
            this.itemsetComments = this.getOneItem.itemset_sections[sectionIndex].comments;
            this.choosenItemSetSection = this.eachSectionItems.section_id;

          }else{
            for(var m1=0;m1<this.getOneItem.itemset_sections.length;m1++){
              index = m1;
              var item_count = 1;
              this.eachSectionItems = this.getOneItem.itemset_sections[index];
              // this.itemsetComments = this.getOneItem.itemset_sections[index].comments;
              // this.choosenItemSetSection = this.eachSectionItems.section_id;
              this.sectionName = this.eachSectionItems.section_name;

              for(var i=0;i<this.eachSectionItems.section_items.length;i++){
                if(this.eachSectionItems.section_items[i].item_type != 6){
                this.itemidArray.push(this.eachSectionItems.section_items[i].item_id);
                if(this.eachSectionItems.section_items[i].answer_choices.length != '0'){
                  for(var j=0;j<this.eachSectionItems.section_items[i].answer_choices.length;j++){
                    this.eachSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j);

                    if(this.eachSectionItems.section_items[i].item_type == 1){
                      for(var c=0;c<this.eachSectionItems.section_items[i].answer_choices[j].choice_elements.length;c++){
                        if(this.eachSectionItems.section_items[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
                          var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value);
                          this.eachSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                        }
                      }
                    }else if(this.eachSectionItems.section_items[i].item_type == 3 && this.eachSectionItems.section_items[i].matchlist_type == 5){
                      if(this.eachSectionItems.section_items[i].answer_choices[j].answer_df_id == 1){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].answer_choices[j].data_format_value);
                        this.eachSectionItems.section_items[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                      }
                    }
                  }
                }
                this.eachSectionItems.section_items[i].index= item_count;
                item_count ++;
                for(var k=0;k<this.eachSectionItems.section_items[i].item.length;k++){
                  if(this.eachSectionItems.section_items[i].item[k].item_df_id ==1){

                    var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].item[k].data_format_value);

                    this.eachSectionItems.section_items[i].item[k].data_format_value = changeRTEFormat;

                  }else if(this.eachSectionItems.section_items[i].item[k].item_df_id == 6 || this.eachSectionItems.section_items[i].item[k].item_df_id == 10 || this.eachSectionItems.section_items[i].item[k].item_df_id == 11){
                    var sanitizeURL = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].item[k].data_format_value);
                    this.eachSectionItems.section_items[i].item[k].data_format_value = sanitizeURL;
                  }else if(this.eachSectionItems.section_items[i].item[k].item_df_id == 9){
                    for(var d=0;d<this.eachSectionItems.section_items[i].item[k].data_format_value.length;d++){
                    for(var m=0;m<this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data.length;m++){
                      if(this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].header != 1){
                        if(this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 6 || this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 10 || this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 11){
                          var sanitizeURLMatch = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_value);

                          this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_value = sanitizeURLMatch;
                        }
                      }
                    }
                    }
                  }
                }

                if(this.eachSectionItems.section_items[i].item_type == 1){
                  for(var a=0;a<this.eachSectionItems.section_items[i].answer_choices.length;a++){
                    for(var c=0;c<this.eachSectionItems.section_items[i].answer_choices[a].choice_elements.length;c++){
                      if(this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].answer_df_id == 6 || this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].answer_df_id == 10 || this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].answer_df_id == 11){
                        var sanitizeURLAns = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].data_format_value);
                        this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].data_format_value = sanitizeURLAns;
                      }
                    }
                  }
                }else if(this.eachSectionItems.section_items[i].item_type == 3 && this.eachSectionItems.section_items[i].matchlist_type == 5){
                  for(var ma=0;ma<this.eachSectionItems.section_items[i].answer_choices.length;ma++){
                    if(this.eachSectionItems.section_items[i].answer_choices[ma].answer_df_id == 6 || this.eachSectionItems.section_items[i].answer_choices[ma].answer_df_id == 10 || this.eachSectionItems.section_items[i].answer_choices[ma].answer_df_id == 11){
                      var sanitizeURLMatchAns = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].answer_choices[ma].data_format_value);
                      this.eachSectionItems.section_items[i].answer_choices[ma].data_format_value = sanitizeURLMatchAns;
                    }
                  }
                }

                }else if(this.eachSectionItems.section_items[i].item_type == 6){
                  this.directive_items_count = this.eachSectionItems.section_items[i].directive_items_count;
                  this.directIdArray.push(this.eachSectionItems.section_items[i].directive_id);
                  var directiveItemCount = item_count + this.eachSectionItems.section_items[i].directive_items_count -1;
                  this.eachSectionItems.section_items[i].index = item_count +"-"+ directiveItemCount;
                  for(var k=0;k<this.eachSectionItems.section_items[i].directive_content.length;k++){
                    if(this.eachSectionItems.section_items[i].directive_content[k].item_df_id ==1){

                      var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].directive_content[k].data_format_value)
                      this.eachSectionItems.section_items[i].directive_content[k].data_format_value = changeRTEFormat;
                    }else if(this.eachSectionItems.section_items[i].directive_content[k].item_df_id == 6 || this.eachSectionItems.section_items[i].directive_content[k].item_df_id == 10 || this.eachSectionItems.section_items[i].directive_content[k].item_df_id == 11){
                      var sanitizeURL = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].directive_content[k].data_format_value);
                      this.eachSectionItems.section_items[i].directive_content[k].data_format_value = sanitizeURL;
                    }
                  }
                }
              }
            }
            this.eachSectionItems = this.getOneItem.itemset_sections[0];
            this.itemsetComments = this.getOneItem.itemset_sections[0].comments;
            this.choosenItemSetSection = this.eachSectionItems.section_id;
          }

          for(var a=0;a<this.eachSectionItems.section_items.length;a++){
            if(this.eachSectionItems.section_items[a].item_status != 'Approved'){
              this.sectionStatus = true;
              break;
            }
          }

          if(this.eachSectionItems.section_items.length != 0){
            this.EachItemComments = this.eachSectionItems.section_items[this.showItem].comments;
          }

          if(this.showALLItems == false){
            this.showItemList = true;
            this.showItemSetList = false;
            this.showSearchFilter = false;
          }


          if(this.allItemListFlag){

            this.showItemList=false;
            this.showALLItems = true;
          }

            if(this.showALLItems == true){
              this.showSearchFilter = true;
              if(this.eachSectionItems.section_items[this.showItem].item_status == 'Approved'){
                this.eachItemStatus = false;
              }else{
                this.eachItemStatus = true;
              }
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

  getNextSection(index){
    if(this.authService.canActivate()){
      this.showItem = 0;

      this.eachSectionItems = this.getOneItem.itemset_sections[index];
      this.itemsetComments = this.getOneItem.itemset_sections[index].comments;
      this.choosenItemSetSection = this.eachSectionItems.section_id;
      this.sectionName = this.eachSectionItems.section_name;
      var item_count =1;
      for(var i=0;i<this.eachSectionItems.section_items.length;i++){
        if(this.eachSectionItems.section_items[i].item_type != 6){
        this.itemidArray.push(this.eachSectionItems.section_items[i].item_id);
        if(this.eachSectionItems.section_items[i].answer_choices.length != '0'){
          for(var j=0;j<this.eachSectionItems.section_items[i].answer_choices.length;j++){
            this.eachSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j)
          }
        }
        this.eachSectionItems.section_items[i].index= item_count;
        item_count ++;


        }else if(this.eachSectionItems.section_items[i].item_type == 6){
          this.directive_items_count = this.eachSectionItems.section_items[i].directive_items_count;
          this.directIdArray.push(this.eachSectionItems.section_items[i].directive_id);
          var directiveItemCount = item_count + this.eachSectionItems.section_items[i].directive_items_count -1;
          this.eachSectionItems.section_items[i].index = item_count +"-"+ directiveItemCount;

        }
      }

      for(var a=0;a<this.eachSectionItems.section_items.length;a++){
        if(this.eachSectionItems.section_items[a].item_status != 'Approved'){
          this.sectionStatus = true;
          break;
        }
      }

      if(this.showALLItems == true){
        if(this.eachSectionItems.section_items.length != 0){
          this.EachItemComments = this.eachSectionItems.section_items[this.showItem].comments;
          if(this.eachSectionItems.section_items[this.showItem].item_status == 'Approved'){
            this.eachItemStatus = false;
          }else{
            this.eachItemStatus = true;
          }
        }
        this.itemsetComments = this.getOneItem.itemset_sections[index].comments;

      }
    }
  }

  showQues(index){
    this.showItem = index;
    if(this.showALLItems == true){
      this.EachItemComments = this.eachSectionItems.section_items[this.showItem].comments;
      if(this.eachSectionItems.section_items[this.showItem].item_status == 'Approved'){
        this.eachItemStatus = false;
      }else{
        this.eachItemStatus = true;
      }
    }
  }
  showQuesBank(index){
    this.showItemBank = index;
  }
  showQuesSearch(index){
    this.showItemSearch = index;
  }
  backToViewList(){
    this.showItemList = false;
    this.showItemSetList = true;
  }
  backToItemList(){
    if(this.allItemListFlag){

      this.showItemList=false;
      this.showALLItems = true;
    }else{
      this.backToviewList = true;
      this.getItemsetDet(this.choosenItemSetId,this.choosenItemSetSection);
      this.showSearchFilter = false;
    }
  }


  filterWithAttributes(){
    if(this.showAttributeFilter == false){
      this.showAttributeFilter = true;
    }else if(this.showAttributeFilter == true){
      this.showAttributeFilter = false;
    }

  }

  // onChangeToggle(event){
  //   if(event == true){
  //     this.checkToggle = true;
  //     this.searchFilter.filters.element_search = event;
  //     this.disableAttributes = true;
  //     this.selectedSub=[];
  //     this.selectedTopic =[];
  //     this.selectedSubtopic =[];
  //     this.topicsList = [];
  //     this.subtopicList = [];
  //     this.taxonomy = "";
  //     this.difficulty_level ="";
  //   }
  //   else{
  //     this.checkToggle = false;
  //     this.disableAttributes = false;
  //     this.searchFilter.filters.element_search = event;
  //   }
  // }

  ApplyFilter(){

    this.searchFilter.search_data = this.searchItems;
    this.searchFilter.filters.subject = this.selectedSub;
    this.searchFilter.filters.topic = this.selectedTopic;
    this.searchFilter.filters.subtopic = this.selectedSubtopic;
    this.searchFilter.filters.difficulty_level = this.difficulty_level== undefined ? "" : this.difficulty_level;
    this.searchFilter.filters.taxonomy = this.taxonomy == undefined ? "": this.taxonomy;
    // this.searchFilter.filters.element_search = this.searchFilter.filters.element_search == undefined ? false : this.searchFilter.filters.element_search;

    this.showAttributeFilter = false;
    this.isFilterApplied = true;
  }

  searchByFilter(event){
    if(this.authService.canActivate()){
      if(this.searchItems == '' || this.searchItems == undefined){
        this.showAttributeFilter = false;
        this.searchError = true;
      }
      else if(event.keyCode == 13 || event ==13){
        this.searchError = false;
        this.searchFilter.search_data = this.searchItems;
        this.searchFilter.itemset_id = this.choosenItemSetId;
        this.searchFilter.org_id = this.cookieService.get('_PAOID')
        this.showLoad = true;
        var body = this.searchFilter;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        return this.http.post(credentials.host + '/search_items', body,{headers: headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
            data => {
              this.showLoad = false;

              this.checkAllItems = !data;
              this.selectAllFlag= false;
              this.searchedItems = data;
              var direct_Id =-1;
              var color =0;
              var directiveItemCount = 0;

              for(var i=0;i<this.searchedItems.length;i++){
                this.searchedItems[i].checkEachItem = false;

                if(this.searchedItems[i].item_type == 6){
                  direct_Id = this.searchedItems[i].directive_id;
                  directiveItemCount =1;
                  color++;
                  this.searchedItems[i].color = this.colors[color];
                  for(var k=0;k<this.searchedItems[i].directive_content.length;k++){
                    if(this.searchedItems[i].directive_content[k].item_df_id ==1){

                      var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].directive_content[k].data_format_value)
                      this.searchedItems[i].directive_content[k].data_format_value = changeRTEFormat;
                    }else if(this.searchedItems[i].directive_content[k].item_df_id == 6 || this.searchedItems[i].directive_content[k].item_df_id == 10 || this.searchedItems[i].directive_content[k].item_df_id == 11){
                      var sanitizeURL = this.sanitizer.bypassSecurityTrustUrl(this.searchedItems[i].directive_content[k].data_format_value);
                      this.searchedItems[i].directive_content[k].data_format_value = sanitizeURL;
                    }
                  }

                }else if(this.searchedItems[i].directive_id == direct_Id){
                  this.searchedItems[i].color = this.colors[color];
                  this.searchedItems[i].directiveItem =directiveItemCount;
                  directiveItemCount ++;
                  for(var j=0;j<this.searchedItems[i].answer_choices.length;j++){
                    this.searchedItems[i].answer_choices[j].label = String.fromCharCode(97+j)
                  }
                }else{
                  this.searchedItems[i].color = '#fafafa';
                  for(var j=0;j<this.searchedItems[i].answer_choices.length;j++){
                    this.searchedItems[i].answer_choices[j].label = String.fromCharCode(97+j)
                  }
                }
                if(this.searchedItems[i].item_type != 6){
                  for(var k=0;k<this.searchedItems[i].item.length;k++){
                    if(this.searchedItems[i].item[k].item_df_id ==1){

                      var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].item[k].data_format_value);
                      this.searchedItems[i].item[k].data_format_value = changeRTEFormat;
                    }else if(this.searchedItems[i].item[k].item_df_id == 6 || this.searchedItems[i].item[k].item_df_id == 10 || this.searchedItems[i].item[k].item_df_id == 11){
                      var sanitizeURL = this.sanitizer.bypassSecurityTrustUrl(this.searchedItems[i].item[k].data_format_value);
                      this.searchedItems[i].item[k].data_format_value = sanitizeURL;
                    }else if(this.searchedItems[i].item[k].item_df_id == 9){
                      for(var d=0;d<this.searchedItems[i].item[k].data_format_value.length;d++){
                       for(var m=0;m<this.searchedItems[i].item[k].data_format_value[d].match_data.length;m++){
                         if(this.searchedItems[i].item[k].data_format_value[d].match_data[m].header != 1){
                           if(this.searchedItems[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 6 || this.searchedItems[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 10 || this.searchedItems[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 11){
                            var sanitizeURLMatch = this.sanitizer.bypassSecurityTrustUrl(this.searchedItems[i].item[k].data_format_value[d].match_data[m].match_value);
                            this.searchedItems[i].item[k].data_format_value[d].match_data[m].match_value = sanitizeURLMatch;
                           }
                         }
                       }
                      }
                    }
                  }
                  if(this.searchedItems[i].item_type == 1){
                    for(var a=0;a<this.searchedItems[i].answer_choices.length;a++){
                      for(var c=0;c<this.searchedItems[i].answer_choices[a].choice_elements.length;c++){
                        if(this.searchedItems[i].answer_choices[a].choice_elements[c].answer_df_id == 6 || this.searchedItems[i].answer_choices[a].choice_elements[c].answer_df_id == 10 || this.searchedItems[i].answer_choices[a].choice_elements[c].answer_df_id == 11){
                          var sanitizeURLAns = this.sanitizer.bypassSecurityTrustUrl(this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value);
                          this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value = sanitizeURLAns;
                        }
                      }
                    }
                  }else if(this.searchedItems[i].item_type == 3 && this.searchedItems[i].matchlist_type == 5){
                    for(var ma=0;ma<this.searchedItems[i].answer_choices.length;ma++){
                      if(this.searchedItems[i].answer_choices[ma].answer_df_id == 6 || this.searchedItems[i].answer_choices[ma].answer_df_id == 10 || this.searchedItems[i].answer_choices[ma].answer_df_id == 11){
                        var sanitizeURLMatchAns = this.sanitizer.bypassSecurityTrustUrl(this.searchedItems[i].answer_choices[ma].data_format_value);
                        this.searchedItems[i].answer_choices[ma].data_format_value = sanitizeURLMatchAns;
                      }
                    }
                  }
                }

              }


              // this.searchItems == ''
              // this.showAttributeFilter = false;
              // this.searchItems = "";
              // this.selectedSub=[];
              // this.selectedTopic =[];
              // this.selectedSubtopic =[];
              // this.topicsList = [];
              // this.subtopicList = [];
              // this.taxonomy = "";
              // this.difficulty_level ="";

              if(data.length == 0){
                this.searchItems == ''
                this.showAttributeFilter = false;
                this.searchItems = "";
                this.selectedSub=[];
                this.selectedTopic =[];
                this.selectedSubtopic =[];
                this.topicsList = [];
                this.subtopicList = [];
                this.taxonomy = "";
                this.difficulty_level ="";
                this.showAttributeFilter = false;
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
  }

  resetAttribute(){
    this.selectedSub=[];
    this.selectedTopic =[];
    this.selectedSubtopic =[];
    this.topicsList = [];
    this.subtopicList = [];
    this.taxonomy = "";
    this.difficulty_level ="";
    this.showAttributeFilter = false;
    this.isFilterApplied = false;
  }


  viewAllItems(itemsetid,choosenItemSetSection){

    this.isclick = false;
    this.showItemList=false;
    this.showALLItems = true;
    this.allItemListFlag = true;
    this.getItemsetDet(itemsetid,choosenItemSetSection);
    if(this.eachSectionItems.section_items.length != 0){
      this.EachItemComments = this.eachSectionItems.section_items[0].comments;
    }
  }

  BackToItemsetList(){

    this.showItemList=true;
    this.showALLItems = false;
    this.showSearchFilter = false;
    this.allItemListFlag = false;
  }


  //preview
  showPreview(itemid,directiveID,template: TemplateRef<any>){
    if(this.eachSectionItems.access == true){
      this.onlydirect = false;
      this.direcQues = false;
      if(itemid != 'null' && directiveID == undefined){
        for(var i=0;i<this.eachSectionItems.section_items.length;i++){
          if(this.eachSectionItems.section_items[i].item_id == itemid){
            this.previewQuestions = this.eachSectionItems.section_items[i];
          }
        }
        this.directivepreviewQuestions = undefined;
      } else if( directiveID != undefined){
        for(var i=0;i<this.eachSectionItems.section_items.length;i++){
          if(this.eachSectionItems.section_items[i].item_id == itemid && this.eachSectionItems.section_items[i].directive_id == directiveID){
            this.previewQuestions = this.eachSectionItems.section_items[i];
            this.direcQues = true;
          }
          if(this.eachSectionItems.section_items[i].directive_id == directiveID && this.eachSectionItems.section_items[i].item_type == 6){
            this.directivepreviewQuestions = this.eachSectionItems.section_items[i];
            this.onlydirect = true;
          }
        }
      }
      // this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-lg' },this.config));
      this.arrayToDrag = [];
      this.fileChoosen = [];
      if(itemid != 'null' && this.previewQuestions.item_type !=6){
      if(this.previewQuestions.matchlist_type == 3){
        for(var i=0;i<this.previewQuestions.item.length;i++){
          if(this.previewQuestions.item[i].item_df_id ==9){
            for(var j=0;j<this.previewQuestions.item[i].data_format_value.length;j++){
              if(this.previewQuestions.item[i].data_format_value[j].match_data[1].header != 1){
              this.arrayToDrag.push(this.previewQuestions.item[i].data_format_value[j].match_data[1]);
              }
            }
          }
        }
      }

      }
      if(itemid != 'null' && this.previewQuestions.item_type !=6){
      if(this.previewQuestions.matchlist_type == 2){
        for(var i=0;i<this.previewQuestions.item.length;i++){
          if(this.previewQuestions.item[i].item_df_id ==9){
            for(var j=0;j<this.previewQuestions.item[i].data_format_value.length;j++){
              if(this.previewQuestions.item[i].data_format_value[j].match_data[1].header != 1 && this.previewQuestions.item[i].data_format_value[j].match_data[0].match_value != 'abc'){
              this.arrayToDrag.push(this.previewQuestions.item[i].data_format_value[j].match_data[1]);
              }
            }
          }
        }
      }

      }

      if(itemid != 'null' && this.previewQuestions.item_type !=6){
        if(this.previewQuestions.item_type == 7){
          for(var ac=0;ac<this.previewQuestions.answer_choices.length;ac++){
            this.previewQuestions.answer_choices[ac].sortedArray = [];
            if(this.previewQuestions.answer_choices[ac].data_format_type.length != 0){
              var a =  _.orderBy(this.previewQuestions.answer_choices[ac].data_format_type, ['file_type'],['asc']);
              this.previewQuestions.answer_choices[ac].sortedArray = (_(a)
              .groupBy(x => x.file_type)
              .map((value, key) => ({format: key, value: value}))
              .value())
            }
          }
        }
      }

      this.showPreviewModal = true;
    }
  }

  closePreview(){
    this.showPreviewModal = false;
  }

  showEachAttribute(index){
    this.activeIndex = index;
    this.hideIcon = false;
  }


  //item distribution

  ItemDistributionPopUP(itemsetID,template: TemplateRef<any>){
    for(var i=0;i<this.itemSetLists.length;i++){
      if(this.itemSetLists[i].itemset_id == itemsetID){
        this.itemDistribution = this.itemSetLists[i].item_distributions;
      }
    }

    this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-lg' },this.config));
  }



  deleteItemfromItemset(itemid,deleteFlag,template: TemplateRef<any>){
    if(deleteFlag){
      this.deleteItemItemset.items = [];
      this.deleteItemItemset.items.push(itemid);

      this.deleteItemItemset.itemset_id = this.choosenItemSetId;
      this.deleteItemItemset.section_id = this.choosenItemSetSection;
      delete this.deleteItemItemset.search;
      this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' },this.config));

    }
  }


  deleteItemPopup(){
    this.modalRef.hide();
    if(this.authService.canActivate()){

      this.deleteItemItemset.org_id = this.cookieService.get('_PAOID');

      this.showLoad = true;
      var body = this.deleteItemItemset;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      let options = new RequestOptions({
        headers : headers,
        body:body
      })
      return this.http.delete(credentials.host + '/itemset_item_remove', options)
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {
            this.showLoad = false;

            if(data.success == true){
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info')
              this.selectedSectionItems = data.remaining_items.itemset_sections;
                this.eachSectionItems = data.remaining_items.itemset_sections;
                var item_count =1;
                var item_count2 = 1;
                for(var i=0;i<this.selectedSectionItems.section_items.length;i++){
                  this.itemidArray.push(this.selectedSectionItems.section_items[i].item_id);
                  if(this.selectedSectionItems.section_items[i].item_type !=6){
                    this.selectedSectionItems.section_items[i].index = item_count;
                    item_count ++;

                    for(var j=0;j<this.selectedSectionItems.section_items[i].answer_choices.length;j++){
                      this.selectedSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j)

                    }
                  }else if(this.selectedSectionItems.section_items[i].item_type == 6){
                    this.directive_items_count = this.selectedSectionItems.section_items[i].directive_items_count;
                    this.directIdArray.push(this.selectedSectionItems.section_items[i].directive_id);
                    var directiveItemCount = item_count + this.selectedSectionItems.section_items[i].directive_items_count -1;
                    this.selectedSectionItems.section_items[i].index = item_count +"-"+ directiveItemCount;
                  }
                }
                for(var i=0;i<this.eachSectionItems.section_items.length;i++){
                  if(this.eachSectionItems.section_items[i].item_type != 6){
                  this.itemidArray.push(this.eachSectionItems.section_items[i].item_id);
                  if(this.eachSectionItems.section_items[i].answer_choices.length != '0'){
                    for(var j=0;j<this.eachSectionItems.section_items[i].answer_choices.length;j++){
                      this.eachSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j)
                    }
                  }
                  this.eachSectionItems.section_items[i].index= item_count2;
                  item_count2 ++;

                  }else if(this.eachSectionItems.section_items[i].item_type == 6){
                    this.directive_items_count = this.eachSectionItems.section_items[i].directive_items_count;
                    this.directIdArray.push(this.eachSectionItems.section_items[i].directive_id);
                    var directiveItemCount = item_count2 + this.eachSectionItems.section_items[i].directive_items_count -1;
                    this.eachSectionItems.section_items[i].index = item_count2 +"-"+ directiveItemCount;
                  }
                }
              setTimeout(()=>{
                this.saveMsg = false;
                // this.ItemSetList();
                },4000);
            } else{
              // this.showMsg = data.message;
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


  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  // comments popup open


  opencommentModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }


  rejectItem(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }



  saveItemComments(){
    if(this.eachSectionItems.section_items[this.showItem].item_type != 6){
      this.getItemComments.org_id = parseInt(this.cookieService.get('_PAOID'));
      this.getItemComments.instance_id = this.eachSectionItems.section_items[this.showItem].instance_id;
      this.getItemComments.item_ref_id = this.eachSectionItems.section_items[this.showItem].item_ref_id;
      this.getItemComments.itemset_id = this.choosenItemSetId;
      this.getItemComments.itemset_item_id = this.eachSectionItems.section_items[this.showItem].itemset_item_id;
      this.getItemComments.req_id = this.eachSectionItems.section_items[this.showItem].req_id;
      this.getItemComments.section_id = this.choosenItemSetSection;
      this.getItemComments.user_type = 'Test_Admin';
      this.getItemComments.directive_id = null;
      }else if(this.eachSectionItems.section_items[this.showItem].item_type == 6){
        this.getItemComments.org_id = parseInt(this.cookieService.get('_PAOID'));
        this.getItemComments.instance_id = this.eachSectionItems.instance_id;
        this.getItemComments.item_ref_id = "123";
        this.getItemComments.itemset_id = this.choosenItemSetId;
        this.getItemComments.itemset_item_id = "123";
        this.getItemComments.req_id = this.eachSectionItems.req_id;
        this.getItemComments.section_id = this.choosenItemSetSection;
        this.getItemComments.user_type = 'Test_Admin';
        this.getItemComments.directive_id = this.eachSectionItems.section_items[this.showItem].directive_id;
      }
      this.SaveCommentsLoader = true;
      var body = this.getItemComments;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + '/item_level_comments', body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {
            this.SaveCommentsLoader = false;

            if(data.success == true){
              this.getItemComments.comment = '';
              for(var c=0;c<this.eachSectionItems.section_items.length;c++){
                // directive content
                if(this.eachSectionItems.section_items[c].directive_id == this.getItemComments.directive_id && this.eachSectionItems.section_items[c].item_type == 6){
                  this.eachSectionItems.section_items[c].comments = data.comments;
                  this.EachItemComments = data.comments;
                  break;
                }
                else if(this.eachSectionItems.section_items[c].itemset_item_id == this.getItemComments.itemset_item_id && this.eachSectionItems.section_items[c].item_type != 6){
                  this.eachSectionItems.section_items[c].comments = data.comments;
                  this.EachItemComments = data.comments;
                  break;
                }
              }
            } else{
              this.getItemComments.comment = '';
              this._notifications.create('',data.message, 'error')
              setTimeout(()=>{
                this.saveMsg = false;

              },4000);
            }
          },
          error => {

            this.SaveCommentsLoader = false;
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

   // itemset comments
   saveItemsetComments(){
    this.getItemComments.org_id = parseInt(this.cookieService.get('_PAOID'));
    this.getItemComments.instance_id = this.eachSectionItems.instance_id;
    delete this.getItemComments.item_ref_id;
    this.getItemComments.itemset_id = this.choosenItemSetId;
    delete this.getItemComments.itemset_item_id;
    this.getItemComments.req_id = this.eachSectionItems.req_id;
    this.getItemComments.section_id = this.choosenItemSetSection;
    this.getItemComments.user_type = 'Test_Admin';

    this.SaveCommentsLoader = true;
    var body = this.getItemComments;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.post(credentials.host + '/itemset_level_comments', body,{headers: headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
        data => {
          this.SaveCommentsLoader = false;

          if(data.success == true){
            this.getItemComments.comment = '';
            for(var c=0;c<this.getOneItem.itemset_sections.length;c++){
              if(this.getOneItem.itemset_sections[c].section_id == this.getItemComments.section_id){
                this.getOneItem.itemset_sections[c].comments = data.comments;
                this.itemsetComments = data.comments;
                break;
              }
            }
          } else{
            this.getItemComments.comment = '';
            this._notifications.create('',data.message, 'error')
            setTimeout(()=>{
              this.saveMsg = false;

            },4000);
          }
        },
        error => {

          this.SaveCommentsLoader = false;
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



  getCurrentSectionDetails(id,sectionid){

    this.showLoad = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host + "/item_details/" +this.cookieService.get('_PAOID') +"/"+ id + "/all_sections/"+ 1+'/'+ 2,{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {

        this.itemidArray = [];
        this.showLoad = false;
        this.getOneItem = data;
        var index;

        if(sectionid != 0){
          for(var n=0;n<this.getOneItem.itemset_sections.length;n++){
            // if(this.getOneItem.itemset_sections[i].section_id == sectionid){
              index = n;
              var item_count = 1;
              this.eachSectionItems = this.getOneItem.itemset_sections[index];
              // this.itemsetComments = this.getOneItem.itemset_sections[index].comments;
              this.choosenItemSetSection = this.eachSectionItems.section_id;
              this.sectionName = this.eachSectionItems.section_name;
              for(var i=0;i<this.eachSectionItems.section_items.length;i++){

                if(this.eachSectionItems.section_items[i].item_type != 6){
                this.itemidArray.push(this.eachSectionItems.section_items[i].item_id);
                if(this.eachSectionItems.section_items[i].answer_choices.length != '0'){
                  for(var j=0;j<this.eachSectionItems.section_items[i].answer_choices.length;j++){
                    this.eachSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j);

                    if(this.eachSectionItems.section_items[i].item_type == 1){
                      for(var c=0;c<this.eachSectionItems.section_items[i].answer_choices[j].choice_elements.length;c++){
                        if(this.eachSectionItems.section_items[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
                          var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value);
                          this.eachSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                        }
                      }
                    }else if(this.eachSectionItems.section_items[i].item_type == 3 && this.eachSectionItems.section_items[i].matchlist_type == 5){
                      if(this.eachSectionItems.section_items[i].answer_choices[j].answer_df_id == 1){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].answer_choices[j].data_format_value);
                        this.eachSectionItems.section_items[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                      }
                    }
                  }
                }

                this.eachSectionItems.section_items[i].index= item_count;
                item_count ++;

                for(var k=0;k<this.eachSectionItems.section_items[i].item.length;k++){
                  if(this.eachSectionItems.section_items[i].item[k].item_df_id ==1){

                    var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].item[k].data_format_value);

                    this.eachSectionItems.section_items[i].item[k].data_format_value = changeRTEFormat;

                  }else if(this.eachSectionItems.section_items[i].item[k].item_df_id == 6 || this.eachSectionItems.section_items[i].item[k].item_df_id == 10 || this.eachSectionItems.section_items[i].item[k].item_df_id == 11){
                    var sanitizeURL = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].item[k].data_format_value);
                    this.eachSectionItems.section_items[i].item[k].data_format_value = sanitizeURL;
                  }else if(this.eachSectionItems.section_items[i].item[k].item_df_id == 9){
                    for(var d=0;d<this.eachSectionItems.section_items[i].item[k].data_format_value.length;d++){
                     for(var m=0;m<this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data.length;m++){
                       if(this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].header != 1){
                         if(this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 6 || this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 10 || this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 11){
                          var sanitizeURLMatch = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_value);
                          this.eachSectionItems.section_items[i].item[k].data_format_value[d].match_data[m].match_value = sanitizeURLMatch;

                         }
                       }
                     }
                    }
                  }

                }

                if(this.eachSectionItems.section_items[i].item_type == 1){
                  for(var a=0;a<this.eachSectionItems.section_items[i].answer_choices.length;a++){
                    for(var c=0;c<this.eachSectionItems.section_items[i].answer_choices[a].choice_elements.length;c++){
                      if(this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].answer_df_id == 6 || this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].answer_df_id == 10 || this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].answer_df_id == 11){
                        var sanitizeURLAns = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].data_format_value);
                        this.eachSectionItems.section_items[i].answer_choices[a].choice_elements[c].data_format_value = sanitizeURLAns;
                      }
                    }
                  }
                }else if(this.eachSectionItems.section_items[i].item_type == 3 && this.eachSectionItems.section_items[i].matchlist_type == 5){
                  for(var ma=0;ma<this.eachSectionItems.section_items[i].answer_choices.length;ma++){
                    if(this.eachSectionItems.section_items[i].answer_choices[ma].answer_df_id == 6 || this.eachSectionItems.section_items[i].answer_choices[ma].answer_df_id == 10 || this.eachSectionItems.section_items[i].answer_choices[ma].answer_df_id == 11){
                      var sanitizeURLMatchAns = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].answer_choices[ma].data_format_value);
                      this.eachSectionItems.section_items[i].answer_choices[ma].data_format_value = sanitizeURLMatchAns;
                    }
                  }
                }

                }else if(this.eachSectionItems.section_items[i].item_type == 6){
                  this.directive_items_count = this.eachSectionItems.section_items[i].directive_items_count;
                  this.directIdArray.push(this.eachSectionItems.section_items[i].directive_id);
                  var directiveItemCount = item_count + this.eachSectionItems.section_items[i].directive_items_count -1;
                  this.eachSectionItems.section_items[i].index = item_count +"-"+ directiveItemCount;

                  for(var k=0;k<this.eachSectionItems.section_items[i].directive_content.length;k++){
                    if(this.eachSectionItems.section_items[i].directive_content[k].item_df_id ==1){

                      var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].directive_content[k].data_format_value)
                      this.eachSectionItems.section_items[i].directive_content[k].data_format_value = changeRTEFormat;
                    }else if(this.eachSectionItems.section_items[i].directive_content[k].item_df_id == 6 || this.eachSectionItems.section_items[i].directive_content[k].item_df_id == 10 || this.eachSectionItems.section_items[i].directive_content[k].item_df_id == 11){
                      var sanitizeURL = this.sanitizer.bypassSecurityTrustUrl(this.eachSectionItems.section_items[i].directive_content[k].data_format_value);
                      this.eachSectionItems.section_items[i].directive_content[k].data_format_value = sanitizeURL;
                    }
                  }
                }

              }
            // }
            if(this.getOneItem.itemset_sections[n].section_id == sectionid){
              var sectionIndex = n;
            }
          }
          this.eachSectionItems = this.getOneItem.itemset_sections[sectionIndex];
          this.itemsetComments = this.getOneItem.itemset_sections[sectionIndex].comments;

        }

          // if(this.showALLItems == true){
            this.showSearchFilter = true;
            if(this.eachSectionItems.section_items.length != 0){
              this.EachItemComments = this.eachSectionItems.section_items[0].comments;

            if(this.eachSectionItems.section_items[this.showItem].item_status == 'Approved'){
              this.eachItemStatus = false;
            }else{
              this.eachItemStatus = true;
            }
          }
          // }

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


  editItemset(itemsetId){
    this.showLoad = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host + "/view_itemset_details/" + this.cookieService.get('_PAOID') +'/' + itemsetId,{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {
        this.showLoad = false;
        if(data.success == true){
          this.getItemService.getItemsetDetails(data);
          this.router.navigate(['ItemSets/edititemset']);
        }else{
          this._notifications.create('',data.message, 'error');
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



  deleteItemsets(itemset_Id,category,template: TemplateRef<any>){

      this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' },this.config));
      this.deleteID = itemset_Id;
      this.deleteCategory = category;

  }



  deleteItemsetPopup(){
    this.modalRef.hide();
    if(this.authService.canActivate()){
      this.deleteItemset.category = this.deleteCategory;
      this.deleteItemset.value.push(this.deleteID);
      this.deleteItemset.org_id = this.cookieService.get('_PAOID');

      this.showLoad = true;
      var body = this.deleteItemset;
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
            this.showLoad = false;

            if(data.success == true){
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info')
              setTimeout(()=>{
                this.saveMsg = false;
                this.ItemSetList();
                },4000);
            } else{
              // this.showMsg = data.message;
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

}
