import { Component, OnInit,Output,EventEmitter,TemplateRef,ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { searchdata } from '../../itemset-menu/view-item-sets/searchData';
import { attributeSearch } from '../../itemset-menu/view-item-sets/attributefilter';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { itemMap } from '../../itemset-menu/view-item-sets/itemMap';
import { deleteObj } from '../../itemset-menu/view-item-sets/deleteItem-itemset';
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
import { AddComments } from '../to-create/AddComments';
import { updateItemScore } from '../to-create/updateItemScore';
import { section_status_update } from './section_status_update';
import * as _ from 'lodash';

@Component({
  selector: 'app-rejected',
  templateUrl: './rejected.component.html',
  styleUrls: ['./rejected.component.scss'],
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
export class RejectedComponent implements OnInit {


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
    this.updateItemScore = new updateItemScore();
    this.updateSectionStatus = new section_status_update();

    dragulaService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });
  }


  public searchFilter :searchdata;
  public itemMapDetail : itemMap;
  public itemsetValidation : itemMap;
  public deleteItemset : deleteObj;
  public deleteItemItemset : itemMap;
  public updateSectionStatus : section_status_update;


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
  public hideIcon = true;
  public activeIndex;
  public activeSubTab = 1;
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
  public updateItemScore : updateItemScore;
  public itemsetToggle = false;
  public itemsetComments;
  public pattern1 = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/;
  public fileChoosen;
  public rememberflag = false;
  public curItemsetDet;
  public curItemLevelComment;
  public curItemLevelStatus;

  public curComItemsetId;
  public curComSectionId;
  public curComItemId;
  public curItemCommentsArr;
  public commentLoad;

  public sidenavVsCommentsToggle;

  isEmptyObject(obj){
    for(var prop in obj){
      if(obj.hasOwnProperty(prop)){
        return false;
      }
    }
    return true;
  }

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

    this.commentLoad = false;
    this.getSideNaveValue();

    this.curItemCommentsArr = [];



    this.curItemLevelStatus = "";
    this.curItemLevelComment = "";
    this.curItemsetDet = null;
    this.diffLevel_boolean = true;

    this.activeTab = 0;
    this.route.params.subscribe(
			(params)=>{

        this.itemset_id = params.itemSetId;
        this.sectionid = params.sectionId;
        this.path = params.path;
        if(this.itemset_id != 0 && this.path == 11){
          this.ItemSetList();
          this.getItemsetDet(this.itemset_id,this.sectionid)
        }else if(this.itemset_id != 0 && this.path == 12){
          this.ItemSetList();
          this.getItemsetDet(this.itemset_id,this.sectionid)
          this.viewAllItems(this.itemset_id,this.sectionid);

        }
        else if(this.itemset_id != 0 && this.path == 19){
          this.rememberflag = true;
          this.ItemSetList();
          this.viewAllItems(this.itemset_id,this.sectionid);
          // this.getItemsetDet(this.itemset_id,this.sectionid)
          // this.viewAllItems(itemset_id,sectionid);
          // this.AddFromItemBank(this.eachSectionItems);
        }
        else if(this.itemset_id != 0 && this.path == 4){
          this.ItemSetList();
          this.viewAllItems(this.itemset_id,this.sectionid);
        }
        else if(this.itemset_id != 0 && this.path == 20){
          this.ItemSetList();
          this.viewAllItems(this.itemset_id,this.sectionid);
          this.rememberflag = false;
        }
        else{
          this.ItemSetList();
          this.showItemList = false;
          this.showItemSetList = true;
        }

      }
		);
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

   this.colors = ['#f2bf93','#f7ede3','#f8dbf9','#f4f0be','#ddefbf','#d4efbd','#c5f4b7','#b5f4db','#caddf9','#d0bfef'];

  }

  getSideNaveValue(){
    this.sidenavVsCommentsToggle = this.getItemService.sendSidenavVsComments();
    //
    setTimeout(() => {
      this.getSideNaveValue();
    },300);
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
            //
          },
          error => {

            this.showLoad = false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
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
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );
    }
  }

  ItemSetList(){
    if(this.authService.canActivate()){
    this.showLoad = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +"/review_menu/" + this.cookieService.get('_PAOID') +'/' + 'rejected',{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {

        this.showLoad = false;
        this.itemSetLists = data;
        // if(this.path == 19){
        //   this.getItemsetDet(this.itemset_id,this.sectionid);
        // }
        },
        error => {

          this.showLoad = false;
          if(error.status == 404){
            this.router.navigateByUrl('pages/NotFound');
          }
          else if(error.status == 401){
            this.cookieService.deleteAll();
            window.location.href='https://accounts.scora.in';
            // window.location.href='https://accounts.scora.in';
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
      this.http.get(credentials.host + "/item_details/" +this.cookieService.get('_PAOID') +"/"+ id + "/all_sections/" + 5,{headers:headers})
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
          this.showItemSetList = false;
          this.showALLItems = true;

          // if(this.getOneItem != undefined){
          //   if(this.getOneItem.itemset_sections.length != 0){
          //     for(var t=0;t<this.getOneItem.itemset_sections.length;t++){
          //       if(this.getOneItem.itemset_sections[t].section_items.length != 0){
          //         for(var r=0;r<this.getOneItem.itemset_sections[t].section_items.length;r++){
          //           this.getOneItem.itemset_sections[t].section_items[r].current_item_status = null;
          //         }
          //       }
          //     }
          //   }
          // }



          if(sectionid != 0 && sectionid != undefined){
            for(var m1=0;m1<this.getOneItem.itemset_sections.length;m1++){
              // if(this.getOneItem.itemset_sections[i].section_id == sectionid){
                index = m1;
                var item_count = 1;
                this.eachSectionItems = this.getOneItem.itemset_sections[index];

                for(var f=0;f<this.eachSectionItems.section_items.length;f++){
                  // this.eachSectionItems.section_items[f].action_list = this.eachSectionItems.action_list;
                  this.eachSectionItems.section_items[f].edit_attributes = this.eachSectionItems.edit_attributes;
                  this.eachSectionItems.section_items[f].edit_permission = this.eachSectionItems.edit_permission;
                  this.eachSectionItems.section_items[f].reject_permission = this.eachSectionItems.reject_permission;
                  this.eachSectionItems.section_items[f].view_attributes = this.eachSectionItems.view_attributes;
                  this.eachSectionItems.section_items[f].view_permission = this.eachSectionItems.view_permission;
                }

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
              if(this.getOneItem.itemset_sections[m1].section_id == sectionid){
                var sectionIndex = m1;

              }
            }
            this.eachSectionItems = this.getOneItem.itemset_sections[sectionIndex];

            for(var f=0;f<this.eachSectionItems.section_items.length;f++){
              // this.eachSectionItems.section_items[f].action_list = this.eachSectionItems.action_list;
              this.eachSectionItems.section_items[f].edit_attributes = this.eachSectionItems.edit_attributes;
              this.eachSectionItems.section_items[f].edit_permission = this.eachSectionItems.edit_permission;
              this.eachSectionItems.section_items[f].reject_permission = this.eachSectionItems.reject_permission;
              this.eachSectionItems.section_items[f].view_attributes = this.eachSectionItems.view_attributes;
              this.eachSectionItems.section_items[f].view_permission = this.eachSectionItems.view_permission;
            }


            this.itemsetComments = this.getOneItem.itemset_sections[sectionIndex].comments;
            this.choosenItemSetSection = this.eachSectionItems.section_id;




          }else{
            for(var m1=0;m1<this.getOneItem.itemset_sections.length;m1++){
              index = m1;
              var item_count = 1;
              this.eachSectionItems = this.getOneItem.itemset_sections[index];

              for(var f=0;f<this.eachSectionItems.section_items.length;f++){
                // this.eachSectionItems.section_items[f].action_list = this.eachSectionItems.action_list;
                this.eachSectionItems.section_items[f].edit_attributes = this.eachSectionItems.edit_attributes;
                this.eachSectionItems.section_items[f].edit_permission = this.eachSectionItems.edit_permission;
                this.eachSectionItems.section_items[f].reject_permission = this.eachSectionItems.reject_permission;
                this.eachSectionItems.section_items[f].view_attributes = this.eachSectionItems.view_attributes;
                this.eachSectionItems.section_items[f].view_permission = this.eachSectionItems.view_permission;
              }

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
            for(var f=0;f<this.eachSectionItems.section_items.length;f++){
              // this.eachSectionItems.section_items[f].action_list = this.eachSectionItems.action_list;
              this.eachSectionItems.section_items[f].edit_attributes = this.eachSectionItems.edit_attributes;
              this.eachSectionItems.section_items[f].edit_permission = this.eachSectionItems.edit_permission;
              this.eachSectionItems.section_items[f].reject_permission = this.eachSectionItems.reject_permission;
              this.eachSectionItems.section_items[f].view_attributes = this.eachSectionItems.view_attributes;
              this.eachSectionItems.section_items[f].view_permission = this.eachSectionItems.view_permission;
            }

            this.itemsetComments = this.getOneItem.itemset_sections[0].comments;
            this.choosenItemSetSection = this.eachSectionItems.section_id;

          }



          if(!this.showALLItems){
            this.showItemList = true;
            this.showItemSetList = false;
            this.showSearchFilter = false;
            this.path = 19;
          }

          if(this.allItemListFlag){
              if(this.path == 19 && this.showItemList == true){
                  this.showItemList = true;
                 }else{
              this.showItemList=false;
              }
            this.showALLItems = true;
          }
            if(this.path == 19 &&  this.backToviewList == false && this.allItemListFlag == true && this.showItemList == true){
              this.AddFromItemBank(this.eachSectionItems);
            }

            if(this.showALLItems == true){
              this.showSearchFilter = true;
              if(this.eachSectionItems.section_items.length !=0){
                this.EachItemComments = this.eachSectionItems.section_items[this.showItem].comments;
              }
            }

            this.CommentListAPI(this.getOneItem.itemset_id ,this.eachSectionItems.section_id, this.eachSectionItems.section_items[this.showItem].item_id);

        },
          error => {

            this.showLoad = false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
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
      for(var f=0;f<this.eachSectionItems.section_items.length;f++){
        // this.eachSectionItems.section_items[f].action_list = this.eachSectionItems.action_list;
        this.eachSectionItems.section_items[f].edit_attributes = this.eachSectionItems.edit_attributes;
        this.eachSectionItems.section_items[f].edit_permission = this.eachSectionItems.edit_permission;
        this.eachSectionItems.section_items[f].reject_permission = this.eachSectionItems.reject_permission;
        this.eachSectionItems.section_items[f].view_attributes = this.eachSectionItems.view_attributes;
        this.eachSectionItems.section_items[f].view_permission = this.eachSectionItems.view_permission;
      }

      this.choosenItemSetSection = this.eachSectionItems.section_id;
      this.sectionName = this.eachSectionItems.section_name;
      var item_count =1;
      for(var i=0;i<this.eachSectionItems.section_items.length;i++){
        if(this.eachSectionItems.section_items[i].item_type != 6){
        this.itemidArray.push(this.eachSectionItems.section_items[i].item_id);
        if(this.eachSectionItems.section_items[i].answer_choices.length != '0'){
          for(var j=0;j<this.eachSectionItems.section_items[i].answer_choices.length;j++){
            this.eachSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j);
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


      if(this.showALLItems == true){
        if(this.eachSectionItems.section_items.length != 0){
          this.EachItemComments = this.eachSectionItems.section_items[this.showItem].comments;

        }
        this.itemsetComments = this.getOneItem.itemset_sections[index].comments;
      }
    }
  }

  showQues(index){
    this.showItem = index;
    this.commentLoad = true;
    this.curItemCommentsArr = [];
    this.curItemLevelComment = "";
    this.CommentListAPI(this.getOneItem.itemset_id ,this.eachSectionItems.section_id, this.eachSectionItems.section_items[this.showItem].item_id);

    if(this.showALLItems == true){
      this.EachItemComments = this.eachSectionItems.section_items[this.showItem].comments;
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
    this.showItemSetList = false;
    this.showALLItems = true;

    this.getItemsetDet(this.choosenItemSetId,this.choosenSectionId);
  }
  backToItemList(){
    if(this.allItemListFlag){

      this.showItemList=false;
      this.showALLItems = true;
      this.getItemsetDet(this.choosenItemSetId,this.choosenItemSetSection);
    }else{
      this.backToviewList = true;
      this.getItemsetDet(this.choosenItemSetId,this.choosenItemSetSection);
      this.showSearchFilter = false;
    }
  }
  AddNewItems(){
    if(this.allItemListFlag){
      this.router.navigate(['Items/additem', this.choosenItemSetId, this.choosenItemSetSection,12]);
    }else{
      this.router.navigate(['Items/additem', this.choosenItemSetId, this.choosenItemSetSection,11]);
    }
  }

  getMetadata(){    
    localStorage.removeItem('TZNM');
    localStorage.removeItem('TZNMVL');
    this.showLoad = true;
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
        this.showLoad = false;
        this.difficultyLevel=data.difficulty_level;
        this.taxonomyList =data.taxonomy;
        this.subjectList = data.subjects;
        this.subLabelName = data.parameters.linked_attribute_1;
        this.topLabelName = data.parameters.linked_attribute_2;
        this.subTopLabelName = data.parameters.linked_attribute_3;
        this.diffLevelLabelName = data.parameters.difficulty_level;
        this.TaxonomyLabelName = data.parameters.taxonomy;
        this.getItemService.getMetaDataDetails(data);
      },
      error => {

        this.showLoad = false;
        if(error.status == 404){
          this.router.navigateByUrl('pages/NotFound');
        }
        else if(error.status == 401){
          this.cookieService.deleteAll();
          window.location.href='https://accounts.scora.in';
          // window.location.href='https://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/serverError');
        }

      }
    );
  }

  getItemsetRelatedItems(){
    this.showLoad = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host + "/itemset_related_items/" + this.cookieService.get('_PAOID') + '/' + this.choosenItemSetId + '/' + this.choosenItemSetSection,{headers:headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {
        this.showLoad = false;
        this.getMetadata();
        this.checkAllItems = !data;
        this.selectAllFlag= false;
        this.searchedItems = data;
        this.allItemListFlag = true;
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
                  }else if(this.searchedItems[i].answer_choices[a].choice_elements[c].answer_df_id == 1){
                    var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value);
                    this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value = changeRTEFormatAns;
                  }
                }
              }
            }else if(this.searchedItems[i].item_type == 3 && this.searchedItems[i].matchlist_type == 5){
              for(var ma=0;ma<this.searchedItems[i].answer_choices.length;ma++){
                if(this.searchedItems[i].answer_choices[ma].answer_df_id == 6 || this.searchedItems[i].answer_choices[ma].answer_df_id == 10 || this.searchedItems[i].answer_choices[ma].answer_df_id == 11){
                  var sanitizeURLMatchAns = this.sanitizer.bypassSecurityTrustUrl(this.searchedItems[i].answer_choices[ma].data_format_value);
                  this.searchedItems[i].answer_choices[ma].data_format_value = sanitizeURLMatchAns;
                }else if(this.searchedItems[i].answer_choices[ma].answer_df_id == 1){
                  var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].answer_choices[ma].data_format_value);
                  this.searchedItems[i].answer_choices[ma].data_format_value = changeRTEFormatAns;
                }
              }
            }
          }
        }


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
          window.location.href='https://accounts.scora.in';
          // window.location.href='https://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/serverError');
        }

      }
    );
  }

  AddFromItemBank(data){
    if(this.authService.canActivate()){

      if(this.getOneItem.is_itemset == true){
        if(this.eachSectionItems.no_of_filled_items != this.eachSectionItems.no_of_items_in_pool && this.eachSectionItems.access == true){
          this.searchedItems = [];
          this.searchItems = "";
          this.selectedSub=[];
          this.selectedTopic =[];
          this.selectedSubtopic =[];
          this.topicsList = [];
          this.subtopicList = [];
          this.taxonomy = "";
          this.difficulty_level ="";
          this.showAttributeFilter = false;
          this.selectedSectionItems= data;


          this.showSearchFilter = true;
          this.showItemList=true;
          this.showALLItems = false;
          this.backToviewList = false;

              // get itemset related items
              this.getItemsetRelatedItems();
        }
      }else{
        if(this.eachSectionItems.access == true){
          this.searchedItems = [];
          this.searchItems = "";
          this.selectedSub=[];
          this.selectedTopic =[];
          this.selectedSubtopic =[];
          this.topicsList = [];
          this.subtopicList = [];
          this.taxonomy = "";
          this.difficulty_level ="";
          this.showAttributeFilter = false;
          this.selectedSectionItems= data;


          this.showSearchFilter = true;
          this.showItemList=true;
          this.showALLItems = false;
          this.backToviewList = false;

              // get itemset related items
              this.getItemsetRelatedItems();
        }
      }


    }
  }

  SearchKeywords(searchdata){
    if(this.authService.canActivate()){

      this.searchFilter.search_data = searchdata;
      if(this.searchFilter.filters == null){
        this.searchFilter.filters = new attributeSearch();
      }
      if(searchdata !=''){
        this.searchFilter.org_id = this.cookieService.get('_PAOID');

      var body = this.searchFilter;
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


            if(data.length != 0){
              this.searchedData = data;

            }else{
              this.searchedData=[];
            }


          },
          error => {

            this.showLoad = false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href='https://accounts.scora.in';
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

  filterWithAttributes(){
    if(this.eachSectionItems.access == true){
      if(this.showAttributeFilter == false){
        this.showAttributeFilter = true;
      }else if(this.showAttributeFilter == true){
        this.showAttributeFilter = false;
      }
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
                        }else if(this.searchedItems[i].answer_choices[a].choice_elements[c].answer_df_id == 1){
                          var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value);
                          this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value = changeRTEFormatAns;
                        }
                      }
                    }
                  }else if(this.searchedItems[i].item_type == 3 && this.searchedItems[i].matchlist_type == 5){
                    for(var ma=0;ma<this.searchedItems[i].answer_choices.length;ma++){
                      if(this.searchedItems[i].answer_choices[ma].answer_df_id == 6 || this.searchedItems[i].answer_choices[ma].answer_df_id == 10 || this.searchedItems[i].answer_choices[ma].answer_df_id == 11){
                        var sanitizeURLMatchAns = this.sanitizer.bypassSecurityTrustUrl(this.searchedItems[i].answer_choices[ma].data_format_value);
                        this.searchedItems[i].answer_choices[ma].data_format_value = sanitizeURLMatchAns;
                      }else if(this.searchedItems[i].answer_choices[ma].answer_df_id == 1){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].answer_choices[ma].data_format_value);
                        this.searchedItems[i].answer_choices[ma].data_format_value = changeRTEFormatAns;
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
                window.location.href='https://accounts.scora.in';
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

  selectEachItem(status,sectionid,itemid,data){

    var directiveid = data.directive_id;
    if(itemid == undefined){
      for(var i=0;i<this.searchedItems.length;i++){
        if(this.searchedItems[i].directive_id == directiveid){
          this.searchedItems[i].checkEachItem = !status;
          if(!this.itemMapDetail.items.includes(this.searchedItems[i].item_id) && this.searchedItems[i].checkEachItem == true && this.searchedItems[i].item_type !=6){
            this.itemMapDetail.itemset_id = this.choosenItemSetId;
            this.itemMapDetail.section_id = sectionid;
            this.itemMapDetail.items.push(this.searchedItems[i].item_id);
            }else if(this.searchedItems[i].checkEachItem == false){
              this.itemMapDetail.itemset_id = this.choosenItemSetId;
              this.itemMapDetail.section_id = sectionid;
              var a = this.itemMapDetail.items.indexOf(this.searchedItems[i].item_id);
              this.itemMapDetail.items.splice(a,1);
            }
        }

      }
    }
    for(var i=0;i<this.searchedItems.length;i++){
      if(this.searchedItems[i].item_id == itemid && this.searchedItems[i].item_type != 6){
      this.searchedItems[i].checkEachItem = !status;
      if(this.selectAllFlag && this.searchedItems[i].checkEachItem == false){
        for(var i=0;i<this.itemMapDetail.items.length;i++){
          if(this.itemMapDetail.items[i] == itemid){
            this.itemMapDetail.items.splice(i,1)
          }
        }

      }else if(!this.itemMapDetail.items.includes(itemid) && this.searchedItems[i].checkEachItem == true){
      this.itemMapDetail.itemset_id = this.choosenItemSetId;
      this.itemMapDetail.section_id = sectionid;
      this.itemMapDetail.items.push(itemid);
      }
      else if(this.searchedItems[i].checkEachItem == false){
        for(var i=0;i<this.searchedItems.length;i++){
          if(this.searchedItems[i].item_type == 6 && this.searchedItems[i].directive_id == directiveid){
            this.searchedItems[i].checkEachItem = false;
          }
        }
        this.itemMapDetail.itemset_id = this.choosenItemSetId;
        this.itemMapDetail.section_id = sectionid;
        var a = this.itemMapDetail.items.indexOf(itemid);
        this.itemMapDetail.items.splice(a,1);
      }
      }else if(this.searchedItems[i].item_type == 6 && this.searchedItems[i].directive_id == directiveid && this.selectAllFlag){
        this.searchedItems[i].checkEachItem = false;
      }
    }


  }
  selectAllItems(data,sectionid){
    this.itemMapDetail.itemset_id = this.choosenItemSetId;
    this.itemMapDetail.section_id = sectionid;

    this.itemMapDetail.items=[];
    this.checkAllItems= !data;
    if(this.checkAllItems == true){
      this.selectAllFlag= true;
      for(var i=0;i<this.searchedItems.length;i++){
        if(this.searchedItems[i].item_type != 6){
        this.searchedItems[i].checkEachItem = !data;
        this.itemMapDetail.items.push(this.searchedItems[i].item_id)
        }else if(this.searchedItems[i].item_type == 6){
          this.searchedItems[i].checkEachItem = !data;
        }
      }
    }else{
      this.checkAllItems = !data;
      this.selectAllFlag= false;
      for(var i=0;i<this.searchedItems.length;i++){
        this.searchedItems[i].checkEachItem = !data;
      }
      this.itemMapDetail.items = [];
    }

  }

  private onDrop(args) {
    if(this.authService.canActivate()){

    var itemid;

      for(var i=0;i<this.selectedSectionItems.section_items.length;i++){
        if(this.selectedSectionItems.section_items[i].item_type !=6){
          if(!this.itemidArray.includes(this.selectedSectionItems.section_items[i].item_id) && !this.itemMapDetail.items.includes(this.selectedSectionItems.section_items[i].item_id)){
            this.itemMapDetail.items.push(this.selectedSectionItems.section_items[i].item_id);
          }
        }else if(this.selectedSectionItems.section_items[i].item_type ==6){
          if(this.selectedSectionItems.section_items[i].color != undefined && this.selectedSectionItems.section_items[i].color != ''){
          var DirID = this.selectedSectionItems.section_items[i].directive_id;
          if(this.directIdArray.includes(DirID)){
            for(var j=0;j<this.searchedItems.length;j++){
              if(this.searchedItems[j].item_type !=6 && this.searchedItems[j].directive_id == DirID){
                this.itemMapDetail.items.push(this.searchedItems[j].item_id)
              }
            }
          }else{
            for(var j=0;j<this.searchedItems.length;j++){
              if(this.searchedItems[j].item_type !=6 && this.searchedItems[j].directive_id == DirID){
                this.itemMapDetail.items.push(this.searchedItems[j].item_id)
              }
            }
          }
        }
        }
      }

    this.itemMapDetail.section_id = this.selectedSectionItems.section_id;
    this.itemMapDetail.itemset_id = this.choosenItemSetId;
    this.insertItems();
    }
  }

  onItemDrop(data,sectionid){

    var qustStatus = false;
    this.itemMapDetail.items = [];
    for(var i=0;i<this.selectedSectionItems.section_items.length;i++){
      if(this.selectedSectionItems.section_items[i].item_id != data.dragData.item_id && qustStatus == false){
        qustStatus = true;

        this.itemMapDetail.itemset_id = this.choosenItemSetId;
        this.itemMapDetail.section_id = sectionid;
        this.itemMapDetail.items.push(data.dragData.item_id);


      }
      else if(this.selectedSectionItems.section_items[i].item_id == data.dragData.item_id){
        alert("This item is already mapped to itemset")
      }
    }
    if(qustStatus){
    this.selectedSectionItems.section_items.push(data.dragData);
    }
    var body = this.itemMapDetail;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.post(credentials.host + '/itemsmap_itemsets', body,{headers: headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
        data => {

          },
          error => {

            this.showLoad = false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
        )

  }

  insertItems(){
    if(this.authService.canActivate() && this.itemMapDetail.items.length !=0){

    if(this.getOneItem.is_itemset == true){
      if(this.itemMapDetail.items.length > this.selectedSectionItems.remaining_no_of_items){
        // alert("You Can Map Only "+ this.selectedSectionItems.remaining_no_of_items +" Item to the ItemSet");
        this.itemsetMapAlert = "You have reached the maximum number of items for this Item Set. If you wish to add a new Item, please delete one of the existing items in the Item set.";
        this.isModalShown = true;

        for(var t=0; t<this.selectedSectionItems.section_items.length;t++){
          if(this.selectedSectionItems.section_items[t].item_type != 6){
            if(this.itemMapDetail.items.includes(this.selectedSectionItems.section_items[t].item_id)){
              this.selectedSectionItems.section_items.splice(t,1);
            }
          }
        }
        this.itemMapDetail.items = [];
        this.getItemsetRelatedItems();
      }else{
        this.itemMapDetail.search = this.searchFilter;
        this.itemMapDetail.org_id = this.cookieService.get('_PAOID');

        var body = this.itemMapDetail;
        this.showLoad = true;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        return this.http.post(credentials.host + '/itemsmap_itemsets', body,{headers: headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
          data => {

            this.showLoad = false;
            if(data.success){
              // this.showMsg = "Item is mapped to itemset";
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info');
              this.itemMapDetail.items = [];
              setTimeout(()=>{
              this.saveMsg = false;

              },4000);
            }else{
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'error')
              setTimeout(()=>{
                this.saveMsg = false;

                },4000);

            }
            this.selectedSectionItems = data.items;
            this.eachSectionItems = data.items;
            for(var f=0;f<this.eachSectionItems.section_items.length;f++){
              // this.eachSectionItems.section_items[f].action_list = this.eachSectionItems.action_list;
              this.eachSectionItems.section_items[f].edit_attributes = this.eachSectionItems.edit_attributes;
              this.eachSectionItems.section_items[f].edit_permission = this.eachSectionItems.edit_permission;
              this.eachSectionItems.section_items[f].reject_permission = this.eachSectionItems.reject_permission;
              this.eachSectionItems.section_items[f].view_attributes = this.eachSectionItems.view_attributes;
              this.eachSectionItems.section_items[f].view_permission = this.eachSectionItems.view_permission;
            }

            var item_count =1;
            var item_count2 = 1;
            for(var i=0;i<this.selectedSectionItems.section_items.length;i++){
              this.itemidArray.push(this.selectedSectionItems.section_items[i].item_id);
              if(this.selectedSectionItems.section_items[i].item_type !=6){
                this.selectedSectionItems.section_items[i].index = item_count;
                item_count ++;

                // for(var k=0;k<this.selectedSectionItems.section_items[i].item.length;k++){
                //   if(this.selectedSectionItems.section_items[i].item[k].item_df_id ==1){

                //     var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.selectedSectionItems.section_items[i].item[k].data_format_value)
                //     this.selectedSectionItems.section_items[i].item[k].data_format_value = changeRTEFormat;
                //   }
                // }


                // for(var j=0;j<this.selectedSectionItems.section_items[i].answer_choices.length;j++){
                //   this.selectedSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j);

                //   if(this.selectedSectionItems.section_items[i].item_type == 1){
                //     for(var c=0;c<this.selectedSectionItems.section_items[i].answer_choices[j].choice_elements.length;c++){
                //       if(this.selectedSectionItems.section_items[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
                //         var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.selectedSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value);
                //         this.selectedSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                //       }
                //     }
                //   }else if(this.selectedSectionItems.section_items[i].item_type == 3 && this.selectedSectionItems.section_items[i].matchlist_type == 5){
                //     if(this.selectedSectionItems.section_items[i].answer_choices[j].answer_df_id == 1){
                //       var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.selectedSectionItems.section_items[i].answer_choices[j].data_format_value);
                //       this.selectedSectionItems.section_items[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                //     }
                //   }

                // }


              }else if(this.selectedSectionItems.section_items[i].item_type == 6){
                this.directive_items_count = this.selectedSectionItems.section_items[i].directive_items_count;
                this.directIdArray.push(this.selectedSectionItems.section_items[i].directive_id);
                var directiveItemCount = item_count + this.selectedSectionItems.section_items[i].directive_items_count -1;
                this.selectedSectionItems.section_items[i].index = item_count +"-"+ directiveItemCount;

              //  for(var k=0;k<this.selectedSectionItems.section_items[i].directive_content.length;k++){
              //     if(this.selectedSectionItems.section_items[i].directive_content[k].item_df_id ==1){

              //       var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.selectedSectionItems.section_items[i].directive_content[k].data_format_value)
              //       this.selectedSectionItems.section_items[i].directive_content[k].data_format_value = changeRTEFormat;
              //     }
              //   }
              }
            }


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
              this.eachSectionItems.section_items[i].index= item_count2;
              item_count2 ++;

              for(var k=0;k<this.eachSectionItems.section_items[i].item.length;k++){
                if(this.eachSectionItems.section_items[i].item[k].item_df_id ==1){

                  var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].item[k].data_format_value)
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
                var directiveItemCount = item_count2 + this.eachSectionItems.section_items[i].directive_items_count -1;
                this.eachSectionItems.section_items[i].index = item_count2 +"-"+ directiveItemCount;

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

            this.searchedItems = data.search_items;
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
                      }else if(this.searchedItems[i].answer_choices[a].choice_elements[c].answer_df_id == 1){
                        var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value);
                        this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value = changeRTEFormatAns;
                      }
                    }
                  }
                }else if(this.searchedItems[i].item_type == 3 && this.searchedItems[i].matchlist_type == 5){
                  for(var ma=0;ma<this.searchedItems[i].answer_choices.length;ma++){
                    if(this.searchedItems[i].answer_choices[ma].answer_df_id == 6 || this.searchedItems[i].answer_choices[ma].answer_df_id == 10 || this.searchedItems[i].answer_choices[ma].answer_df_id == 11){
                      var sanitizeURLMatchAns = this.sanitizer.bypassSecurityTrustUrl(this.searchedItems[i].answer_choices[ma].data_format_value);
                      this.searchedItems[i].answer_choices[ma].data_format_value = sanitizeURLMatchAns;
                    }else if(this.searchedItems[i].answer_choices[ma].answer_df_id == 1){
                      var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].answer_choices[ma].data_format_value);
                      this.searchedItems[i].answer_choices[ma].data_format_value = changeRTEFormatAns;
                    }
                  }
                }
              }

            }
            this.searchItems = '';
            this.checkEachItem = false;
            this.selectAllFlag= false;
            // for(var i=0;i<this.searchedItems.length;i++){
            //   if(this.itemMapDetail.items.includes(this.searchedItems[i].item_id)){
            //     this.searchedItems.splice(i,1);
            //   }
            // }
            this.itemMapDetail.items = [];
            if(this.isEmptyObject (this.searchedItems)){
              this.getItemsetRelatedItems();
            }

          },
          error => {

            this.showLoad = false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
        )
      }
    }else{
      this.itemMapDetail.search = this.searchFilter;
      this.itemMapDetail.org_id = this.cookieService.get('_PAOID');

      var body = this.itemMapDetail;
      this.showLoad = true;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + '/itemsmap_itemsets', body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.showLoad = false;
          if(data.success){
            // this.showMsg = "Item is mapped to itemset";
            // this.saveMsg = true;
            this._notifications.create('',data.message, 'info');
            this.itemMapDetail.items = [];
            setTimeout(()=>{
            this.saveMsg = false;

            },4000);
          }else{
            // this.showMsg = data.message;
            // this.saveMsg = true;
            this._notifications.create('',data.message, 'error')
            setTimeout(()=>{
              this.saveMsg = false;

              },4000);

          }
          this.selectedSectionItems = data.items;
          this.eachSectionItems = data.items;
          for(var f=0;f<this.eachSectionItems.section_items.length;f++){
            // this.eachSectionItems.section_items[f].action_list = this.eachSectionItems.action_list;
            this.eachSectionItems.section_items[f].edit_attributes = this.eachSectionItems.edit_attributes;
            this.eachSectionItems.section_items[f].edit_permission = this.eachSectionItems.edit_permission;
            this.eachSectionItems.section_items[f].reject_permission = this.eachSectionItems.reject_permission;
            this.eachSectionItems.section_items[f].view_attributes = this.eachSectionItems.view_attributes;
            this.eachSectionItems.section_items[f].view_permission = this.eachSectionItems.view_permission;
          }

          var item_count =1;
          var item_count2 = 1;
          for(var i=0;i<this.selectedSectionItems.section_items.length;i++){
            this.itemidArray.push(this.selectedSectionItems.section_items[i].item_id);
            if(this.selectedSectionItems.section_items[i].item_type !=6){
              this.selectedSectionItems.section_items[i].index = item_count;
              item_count ++;

              // for(var k=0;k<this.selectedSectionItems.section_items[i].item.length;k++){
              //   if(this.selectedSectionItems.section_items[i].item[k].item_df_id ==1){

              //     var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.selectedSectionItems.section_items[i].item[k].data_format_value)
              //     this.selectedSectionItems.section_items[i].item[k].data_format_value = changeRTEFormat;
              //   }
              // }


              // for(var j=0;j<this.selectedSectionItems.section_items[i].answer_choices.length;j++){
              //   this.selectedSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j);

              //   if(this.selectedSectionItems.section_items[i].item_type == 1){
              //     for(var c=0;c<this.selectedSectionItems.section_items[i].answer_choices[j].choice_elements.length;c++){
              //       if(this.selectedSectionItems.section_items[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
              //         var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.selectedSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value);
              //         this.selectedSectionItems.section_items[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
              //       }
              //     }
              //   }else if(this.selectedSectionItems.section_items[i].item_type == 3 && this.selectedSectionItems.section_items[i].matchlist_type == 5){
              //     if(this.selectedSectionItems.section_items[i].answer_choices[j].answer_df_id == 1){
              //       var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.selectedSectionItems.section_items[i].answer_choices[j].data_format_value);
              //       this.selectedSectionItems.section_items[i].answer_choices[j].data_format_value = changeRTEFormatAns;
              //     }
              //   }

              // }


            }else if(this.selectedSectionItems.section_items[i].item_type == 6){
              this.directive_items_count = this.selectedSectionItems.section_items[i].directive_items_count;
              this.directIdArray.push(this.selectedSectionItems.section_items[i].directive_id);
              var directiveItemCount = item_count + this.selectedSectionItems.section_items[i].directive_items_count -1;
              this.selectedSectionItems.section_items[i].index = item_count +"-"+ directiveItemCount;

            //  for(var k=0;k<this.selectedSectionItems.section_items[i].directive_content.length;k++){
            //     if(this.selectedSectionItems.section_items[i].directive_content[k].item_df_id ==1){

            //       var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.selectedSectionItems.section_items[i].directive_content[k].data_format_value)
            //       this.selectedSectionItems.section_items[i].directive_content[k].data_format_value = changeRTEFormat;
            //     }
            //   }
            }
          }


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
            this.eachSectionItems.section_items[i].index= item_count2;
            item_count2 ++;

            for(var k=0;k<this.eachSectionItems.section_items[i].item.length;k++){
              if(this.eachSectionItems.section_items[i].item[k].item_df_id ==1){

                var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.eachSectionItems.section_items[i].item[k].data_format_value)
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
              var directiveItemCount = item_count2 + this.eachSectionItems.section_items[i].directive_items_count -1;
              this.eachSectionItems.section_items[i].index = item_count2 +"-"+ directiveItemCount;

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

          this.searchedItems = data.search_items;
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
                    }else if(this.searchedItems[i].answer_choices[a].choice_elements[c].answer_df_id == 1){
                      var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value);
                      this.searchedItems[i].answer_choices[a].choice_elements[c].data_format_value = changeRTEFormatAns;
                    }
                  }
                }
              }else if(this.searchedItems[i].item_type == 3 && this.searchedItems[i].matchlist_type == 5){
                for(var ma=0;ma<this.searchedItems[i].answer_choices.length;ma++){
                  if(this.searchedItems[i].answer_choices[ma].answer_df_id == 6 || this.searchedItems[i].answer_choices[ma].answer_df_id == 10 || this.searchedItems[i].answer_choices[ma].answer_df_id == 11){
                    var sanitizeURLMatchAns = this.sanitizer.bypassSecurityTrustUrl(this.searchedItems[i].answer_choices[ma].data_format_value);
                    this.searchedItems[i].answer_choices[ma].data_format_value = sanitizeURLMatchAns;
                  }else if(this.searchedItems[i].answer_choices[ma].answer_df_id == 1){
                    var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.searchedItems[i].answer_choices[ma].data_format_value);
                    this.searchedItems[i].answer_choices[ma].data_format_value = changeRTEFormatAns;
                  }
                }
              }
            }

          }
          this.searchItems = '';
          this.checkEachItem = false;
          this.selectAllFlag= false;
          // for(var i=0;i<this.searchedItems.length;i++){
          //   if(this.itemMapDetail.items.includes(this.searchedItems[i].item_id)){
          //     this.searchedItems.splice(i,1);
          //   }
          // }
          this.itemMapDetail.items = [];
          if(this.isEmptyObject (this.searchedItems)){
            this.getItemsetRelatedItems();
          }

        },
        error => {

          this.showLoad = false;
          if(error.status == 404){
            this.router.navigateByUrl('pages/NotFound');
          }
          else if(error.status == 401){
            this.cookieService.deleteAll();
            window.location.href='https://accounts.scora.in';
            // window.location.href='https://accounts.scora.in';
          }
          else{
            this.router.navigateByUrl('pages/serverError');
          }

        }
      )
    }

    }
  }

  editItem(sectionid,editableItem,editFlag){
    if(editFlag){
      localStorage.setItem('directive_id', '0');
      localStorage.setItem('item_count', '0');

    if(editableItem.item_type != 6){
    for(var i=0;i<editableItem.item.length;i++){
      if(editableItem.item[i].item_df_id == 1){
        editableItem.item[i].data_format_value = editableItem.item[i].data_format_value.changingThisBreaksApplicationSecurity;
      }else if(editableItem.item[i].item_df_id == 6 || editableItem.item[i].item_df_id == 10 || editableItem.item[i].item_df_id == 11){
        editableItem.item[i].data_format_value = editableItem.item[i].data_format_value.changingThisBreaksApplicationSecurity;
      }else if(editableItem.item[i].item_df_id == 9){
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
        for(var c=0;c<editableItem.answer_choices[a].choice_elements.length;c++){
          if(editableItem.answer_choices[a].choice_elements[c].answer_df_id == 1 || editableItem.answer_choices[a].choice_elements[c].answer_df_id == 6 || editableItem.answer_choices[a].choice_elements[c].answer_df_id == 10 || editableItem.answer_choices[a].choice_elements[c].answer_df_id == 11){
            editableItem.answer_choices[a].choice_elements[c].data_format_value = editableItem.answer_choices[a].choice_elements[c].data_format_value.changingThisBreaksApplicationSecurity;
          }
        }
      }
    }else if(editableItem.item_type == 3 && editableItem.matchlist_type == 5){
      for(var ma=0;ma<editableItem.answer_choices.length;ma++){
        if(editableItem.answer_choices[ma].answer_df_id == 1 || editableItem.answer_choices[ma].answer_df_id == 6 || editableItem.answer_choices[ma].answer_df_id == 10 || editableItem.answer_choices[ma].answer_df_id == 11){
          editableItem.answer_choices[ma].data_format_value = editableItem.answer_choices[ma].data_format_value.changingThisBreaksApplicationSecurity;
        }
      }
    }
    }else if(editableItem.item_type == 6){
      for(var i=0;i<editableItem.directive_content.length;i++){
        if(editableItem.directive_content[i].item_df_id == 1){
          editableItem.directive_content[i].data_format_value = editableItem.directive_content[i].data_format_value.changingThisBreaksApplicationSecurity;
        }else if(editableItem.directive_content[i].item_df_id == 6 || editableItem.directive_content[i].item_df_id == 10 || editableItem.directive_content[i].item_df_id == 11){
          editableItem.directive_content[i].data_format_value = editableItem.directive_content[i].data_format_value.changingThisBreaksApplicationSecurity;
        }
      }
    }
      this.getItemService.getResponse(editableItem,this.getOneItem,'');
      this.router.navigate(['Items/additem', this.choosenItemSetId, sectionid,19]);

  }
}

editItemList(sectionid,editableItem,editFlag){
  if(editFlag){
    localStorage.setItem('directive_id', '0');
    localStorage.setItem('item_count', '0');
      if(editableItem.item_type != 6){
        for(var i=0;i<editableItem.item.length;i++){
          if(editableItem.item[i].item_df_id == 1 || editableItem.item[i].item_df_id == 6 || editableItem.item[i].item_df_id == 10 || editableItem.item[i].item_df_id == 11){
            editableItem.item[i].data_format_value = editableItem.item[i].data_format_value.changingThisBreaksApplicationSecurity;
          }else if(editableItem.item[i].item_df_id == 9){
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
              if(editableItem.answer_choices[a].choice_elements[b].answer_df_id == 1 || editableItem.answer_choices[a].choice_elements[b].answer_df_id == 6 || editableItem.answer_choices[a].choice_elements[b].answer_df_id == 10 || editableItem.answer_choices[a].choice_elements[b].answer_df_id == 11){
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
          if(editableItem.directive_content[i].item_df_id == 1 || editableItem.directive_content[i].item_df_id == 6 || editableItem.directive_content[i].item_df_id == 10 || editableItem.directive_content[i].item_df_id == 11){
            editableItem.directive_content[i].data_format_value = editableItem.directive_content[i].data_format_value.changingThisBreaksApplicationSecurity;
          }
        }
      }
      this.getItemService.getResponse(editableItem,this.getOneItem,'');
      this.router.navigate(['Items/additem', this.choosenItemSetId, sectionid,20]);

    }
}

  viewAllItems(itemsetid,choosenItemSetSection){

    this.isclick = false;
    this.showItemList=false;
    // if(this.rememberflag == true){
    //   this.showALLItems = false;
    //   this.allItemListFlag = true;
    // }else{
    this.allItemListFlag = true;
    this.showItemSetList = true;
    this.showItemList = false;
      this.showALLItems = false;
    // }

    this.getItemsetDet(itemsetid,choosenItemSetSection);
    if(this.eachSectionItems.section_items.length != 0){
      this.EachItemComments = this.eachSectionItems.section_items[0].comments;
    }
  }

  BackToItemsetList(){

    this.showItemList = false;
    this.showALLItems = false;
    this.showSearchFilter = false;
    this.allItemListFlag = false;
    this.rememberflag = false;
    this.showItemSetList = true;
    this.ItemSetList();
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


  // itemset validation
  submitItemSetToTest(itemsetId){
    if(this.authService.canActivate()){

        this.itemsetValidation.itemset_id = itemsetId;
        this.itemsetValidation.org_id = this.cookieService.get('_PAOID');
        delete this.itemsetValidation.items;
        delete this.itemsetValidation.search;
        delete this.itemsetValidation.section_id;

        this.showLoad = true;
        var body = this.itemsetValidation;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        return this.http.post(credentials.host + '/itemset_validation', body,{headers: headers})
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
                window.location.href='https://accounts.scora.in';
                // window.location.href='https://accounts.scora.in';
              }
              else{
                this.router.navigateByUrl('pages/serverError');
              }

            }
        );

    }
  }


  // delete Item

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
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );

    }
  }

  // deleteItem(data,category){
  //   this.deleteitemPopup = true;
  //   this.deleteID = data.item_id;
  //   this.deleteCategory = category;

  // }


  deleteItemsets(itemset_Id,deleteFlag,category,template: TemplateRef<any>){
    if(deleteFlag){
      this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' },this.config));
      this.deleteID = itemset_Id;
      this.deleteCategory = category;
    }
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

              setTimeout(()=>{
                this.saveMsg = false;
                // this.ItemSetList();
                this.getItemsetDet(this.choosenItemSetId,this.choosenItemSetSection);
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
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
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

  openpopup(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' },this.config));
  }

  UpdateItemScoreModal(template: TemplateRef<any>,itemscore,itemsetItemId){
    if(this.eachSectionItems.access == true){
      this.updateItemScore.score = itemscore;
      this.updateItemScore.itemset_item_id = itemsetItemId;
      this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' },this.config));
    }
  }

  getItemsAfterScoreUpdate(id,sectionid){
    this.isclick = false;
    this.showItemList=false;
    this.showALLItems = true;
    this.allItemListFlag = true;
    this.EachItemComments = this.eachSectionItems.section_items[0].comments;

    if(this.authService.canActivate()){
      this.isclick = true;
      this.showLoad = true;
      this.choosenItemSetId= id;
      this.choosenSectionId = sectionid;
      // this.showItem = 0;

      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/item_details/" +this.cookieService.get('_PAOID') +"/"+ id + "/all_sections/" + 5,{headers:headers})
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

          if(this.choosenSectionId != 0 && this.choosenSectionId != undefined){
            for(var n=0;n<this.getOneItem.itemset_sections.length;n++){
              // if(this.getOneItem.itemset_sections[i].section_id == sectionid){
                index = n;
                var item_count = 1;
                this.eachSectionItems = this.getOneItem.itemset_sections[index];
                for(var f=0;f<this.eachSectionItems.section_items.length;f++){
                  // this.eachSectionItems.section_items[f].action_list = this.eachSectionItems.action_list;
                  this.eachSectionItems.section_items[f].edit_attributes = this.eachSectionItems.edit_attributes;
                  this.eachSectionItems.section_items[f].edit_permission = this.eachSectionItems.edit_permission;
                  this.eachSectionItems.section_items[f].reject_permission = this.eachSectionItems.reject_permission;
                  this.eachSectionItems.section_items[f].view_attributes = this.eachSectionItems.view_attributes;
                  this.eachSectionItems.section_items[f].view_permission = this.eachSectionItems.view_permission;
                }

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
              if(this.getOneItem.itemset_sections[n].section_id == this.choosenSectionId){
                var sectionIndex = n;
              }
            }
            this.eachSectionItems = this.getOneItem.itemset_sections[sectionIndex];
            for(var f=0;f<this.eachSectionItems.section_items.length;f++){
              // this.eachSectionItems.section_items[f].action_list = this.eachSectionItems.action_list;
              this.eachSectionItems.section_items[f].edit_attributes = this.eachSectionItems.edit_attributes;
              this.eachSectionItems.section_items[f].edit_permission = this.eachSectionItems.edit_permission;
              this.eachSectionItems.section_items[f].reject_permission = this.eachSectionItems.reject_permission;
              this.eachSectionItems.section_items[f].view_attributes = this.eachSectionItems.view_attributes;
              this.eachSectionItems.section_items[f].view_permission = this.eachSectionItems.view_permission;
            }

            this.itemsetComments = this.getOneItem.itemset_sections[sectionIndex].comments;
            this.choosenItemSetSection = this.eachSectionItems.section_id;

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
            if(this.path == 19 &&  this.backToviewList == false){
              this.AddFromItemBank(this.eachSectionItems);
            }
            if(this.showALLItems == true){
              this.showSearchFilter = true;
              if(this.eachSectionItems.section_items.length !=0){
                this.EachItemComments = this.eachSectionItems.section_items[this.showItem].comments;
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
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );
    }

  }

  updateScore(){
    // const pattern1 = /^[1-9]*\.?\d*$/;
    const pattern1 = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/;
    var itemscore = this.updateItemScore.score.toString();
    if(this.updateItemScore.score != 0 && pattern1.test(itemscore)){
      this.modalRef.hide();
      this.updateItemScore.org_id = parseInt(this.cookieService.get('_PAOID'));
      this.showLoad = true;
      var body = this.updateItemScore;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + '/itemset_item_score_update', body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {
            this.showLoad = false;

            if(data.success == true){
              this._notifications.create('',data.message, 'info')
                  setTimeout(()=>{
                    this.saveMsg = false;

                    },4000);
                    this.getItemsAfterScoreUpdate(this.choosenItemSetId,this.choosenItemSetSection);
            } else{
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
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );
    }

  }

  // item comments
  saveItemComments(comments){
      if(this.eachSectionItems.section_items[this.showItem].item_type != 6){
        this.getItemComments.org_id = parseInt(this.cookieService.get('_PAOID'));
        this.getItemComments.instance_id = this.eachSectionItems.section_items[this.showItem].instance_id;
        this.getItemComments.item_ref_id = this.eachSectionItems.section_items[this.showItem].item_ref_id;
        this.getItemComments.itemset_id = this.choosenItemSetId;
        this.getItemComments.itemset_item_id = this.eachSectionItems.section_items[this.showItem].itemset_item_id
        this.getItemComments.req_id = this.eachSectionItems.section_items[this.showItem].req_id;
        this.getItemComments.section_id = this.choosenItemSetSection;
        this.getItemComments.user_type = 'Author';
        this.getItemComments.directive_id = null;
        this.getItemComments.comment = comments;
      }else if(this.eachSectionItems.section_items[this.showItem].item_type == 6){
        this.getItemComments.org_id = parseInt(this.cookieService.get('_PAOID'));
        this.getItemComments.instance_id = this.eachSectionItems.instance_id;
        this.getItemComments.item_ref_id = "123";
        this.getItemComments.itemset_id = this.choosenItemSetId;
        this.getItemComments.itemset_item_id = "123";
        this.getItemComments.req_id = this.eachSectionItems.req_id;
        this.getItemComments.section_id = this.choosenItemSetSection;
        this.getItemComments.user_type = 'Author';
        this.getItemComments.directive_id = this.eachSectionItems.section_items[this.showItem].directive_id;
        this.getItemComments.comment = comments;
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
            this.getItemComments.comment = '';
            this.SaveCommentsLoader = false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href='https://accounts.scora.in';
              // window.location.href='https://accounts.scora.in';
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
    this.getItemComments.user_type = 'Author';

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
            window.location.href='https://accounts.scora.in';
            // window.location.href='https://accounts.scora.in';
          }
          else{
            this.router.navigateByUrl('pages/serverError');
          }

        }
    );

  }



  SumbitToReviewer(event){

    this.updateSectionStatus.org_id = parseInt(this.cookieService.get('_PAOID'));
    this.updateSectionStatus.itemset_id = this.choosenItemSetId;
    this.updateSectionStatus.section_id = this.choosenItemSetSection;
    this.updateSectionStatus.user_type = 'Author';
    this.updateSectionStatus.section_status = "submit_for_approval";

    this.showLoad = true;
    var body = this.updateSectionStatus;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.post(credentials.host + '/section_status_update', body,{headers: headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
        data => {
          this.showLoad = false;

          if(data.success == true){
            this._notifications.create('',data.message, 'info')
                setTimeout(()=>{
                  this.saveMsg = false;
                  this.router.navigate(['as-an-author/under-review',0,0,0])
                  },4000);

          } else{
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
            window.location.href='https://accounts.scora.in';
            // window.location.href='https://accounts.scora.in';
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
          window.location.href='https://accounts.scora.in';
          // window.location.href='https://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/serverError');
        }

      }
    );
  }


  onlyNumberKey(e) {

    const pattern = /^[0-9.-]*$/;

    let inputChar = String.fromCharCode(e.charCode);
    if (e.keyCode != 8 && !pattern.test(inputChar)) {
      e.preventDefault();
    }
  }

  openScheduleInstance(curItemsetId){

    if(curItemsetId == this.curItemsetDet){
      this.curItemsetDet = null
    }else{
      this.curItemsetDet = curItemsetId;
    }

  }

  saveStatusComments(val){





    if(val == 1){
      let body = new FormData();
      body.append('org_id',this.cookieService.get('_PAOID'));
      body.append('itemset_id', this.getOneItem.itemset_id);
      body.append('section_id', this.eachSectionItems.section_id);
      body.append('item_id', null);
      if(val == 1){
        body.append('action', this.curItemLevelStatus);
        body.append('note', null);
      }else{
        body.append('action', null);
        body.append('note', this.curItemLevelComment);
      }
      body.append('user_role', "1");

      // Status Update
      let headers = new Headers();
      this.showLoad = true;
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.post(credentials.host + '/status_update', body,{headers: headers})
      .map(res => res.json())
      .catch(error => Observable.throw(error))

          .subscribe(
              data => {
                this.showLoad = false;

                if(data.success == true){
                  this._notifications.create('',data.message, 'info');
                  this.curItemLevelStatus = "";
                  this.curItemLevelComment = "";
                  this.eachSectionItems.section_submit_approval = true;

                  var checkAllSubmitted;
                  checkAllSubmitted = false;

                  for(var a=0;a<this.getOneItem.itemset_sections.length;a++){
                    if(this.getOneItem.itemset_sections[a].section_submit_approval == false){
                      checkAllSubmitted = true;
                    }
                  }

                  if(checkAllSubmitted == false){
                    this.showALLItems = false;
                    this.showItemSetList = true;
                    this.showLoad = true;
                    this.ItemSetList();
                  }

                  // this.getItemsetDet(this.getOneItem.itemset_id,this.eachSectionItems.section_id)
                }else if(data.success == false){
                  this.showLoad = false;
                  this._notifications.create('',data.message, 'error');
                  // this.showErrorUpload =  data.message;

                }
              },
              error => {

                this.showLoad = false;
                if(error.status == 404){
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if(error.status == 401){
                  this.cookieService.deleteAll();
                  window.location.href='https://accounts.scora.in';
                  // window.location.href='https://accounts.scora.in';
                }
                else{
                  this.router.navigateByUrl('pages/serverError');
                }

              }
          )
    }else{
      // Comments Update

      let body = new FormData();
      body.append('org_id',this.cookieService.get('_PAOID'));
      body.append('itemset_id', this.getOneItem.itemset_id);
      body.append('section_id', this.eachSectionItems.section_id);
      body.append('item_id', this.eachSectionItems.section_items[this.showItem].item_id);
      if(val == 1){
        body.append('action', this.curItemLevelStatus);
        body.append('note', null);
      }else{
        body.append('action', null);
        body.append('note', this.curItemLevelComment);
      }
      body.append('user_role', "1");

      let headers = new Headers();
      this.showLoad = true;
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.post(credentials.host + '/item_level_comments', body,{headers: headers})
      .map(res => res.json())
      .catch(error => Observable.throw(error))

          .subscribe(
              data => {
                this.showLoad = false;

                if(data.success == true){
                  this.curItemLevelStatus = "";
                  this.curItemLevelComment = "";
                  this.getItemsetDet(this.getOneItem.itemset_id,this.eachSectionItems.section_id)
                }else if(data.success == false){
                  this.showLoad = false;
                  this._notifications.create('',data.message, 'error');
                  // this.showErrorUpload =  data.message;

                }
              },
              error => {

                this.showLoad = false;
                if(error.status == 404){
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if(error.status == 401){
                  this.cookieService.deleteAll();
                  window.location.href='https://accounts.scora.in';
                  // window.location.href='https://accounts.scora.in';
                }
                else{
                  this.router.navigateByUrl('pages/serverError');
                }

              }
          )
    }


  }

  CommentListAPI(itemsetId, secId, ItemId){

    if(ItemId != undefined) {
      if(this.curComItemId != ItemId){
        this.curItemCommentsArr = [];
      }
      this.curComItemsetId = itemsetId;
      this.curComSectionId = secId;
      this.curComItemId = ItemId;



      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/comments_list/" + this.cookieService.get('_PAOID') +'/' + itemsetId + '/' + secId + '/' + ItemId,{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.commentLoad = false;

          this.curItemCommentsArr = data;
          if(this.curItemCommentsArr.length != 0){
            this.commentLoad = false;
          }
          // setTimeout(()=>{
          //   this.CommentListAPI(this.getOneItem.itemset_id ,this.eachSectionItems.section_id, this.eachSectionItems.section_items[this.showItem].item_id);
          // },30000);

          },
          error => {

            this.commentLoad = false;
            // setTimeout(()=>{
            //   this.CommentListAPI(this.getOneItem.itemset_id ,this.eachSectionItems.section_id, this.eachSectionItems.section_items[this.showItem].item_id);
            // },30000);

          }
      );
    }

  }

  refreshComments(){
    if(this.eachSectionItems.section_items.length != 0){
      this.commentLoad = true;
      this.CommentListAPI(this.getOneItem.itemset_id ,this.eachSectionItems.section_id, this.eachSectionItems.section_items[this.showItem].item_id);
    }
  }

}
