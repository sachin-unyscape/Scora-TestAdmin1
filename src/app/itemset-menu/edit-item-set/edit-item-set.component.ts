import { Component, OnInit ,TemplateRef} from '@angular/core';
import { createItemSet } from '../add-item-sets/createItemSet';
import { sections } from '../add-item-sets/sections';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router,NavigationEnd} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import{credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { NotificationsService } from 'angular2-notifications';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { GetItemService } from '../../get-item.service';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import {userSuggestion} from '../../test-menu/manage-test/userSuggestion';
import * as EmailValidator from 'email-validator';
// Without RWF :: Add Authors And Previleges
import { WO_RWF_AddAuthorBase } from "../add-item-sets/wo-rwf-add-author-req";
import { WO_RWF_AddAuthoAccess } from "../add-item-sets/wo-rwf-add-author-access";


// With RWF :: Add Author And Reviewer Details
import { WithRWF_SeqAndRanSettings } from "../add-item-sets/w-rwf-seq-ran-settings-req";
import { WithRWF_SeqAndRanUserDetails } from "../add-item-sets/w-rwf-seq-ran-user-details";

export function getTimepickerConfig(): TimepickerConfig {
  return Object.assign(new TimepickerConfig(), {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: false,
    showSpinners : false,
    readonlyInput: false,
    mousewheel: true,
    showMinutes: true,
    showSeconds: false,

  });
}


@Component({
  selector: 'app-edit-item-set',
  templateUrl: './edit-item-set.component.html',
  styleUrls: ['./edit-item-set.component.scss'],
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
  providers: [{ provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class EditItemSetComponent implements OnInit {
  constructor(private http:Http,private router: Router,public getItemService: GetItemService,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,  private _notifications: NotificationsService,private modalService: BsModalService) {
    this.createItemSet = new createItemSet();
    this.sections = new sections();
  }

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  public createItemSet : createItemSet;
  public sections : sections;
  settings1 = {};
  settings2 = {};
  public selectedSub=[];
  public selectedTopic = [];
  public bindSubjects;
  public bindTopics;
  public subjectList =[] ;
  public topicsList = [];
  public reviewer;
  public author;
  public hours;
  public min;
  public sec;
  public uniqueSubjects = Array();
  public uniqueTopics = Array();
  public itemsetname;
  public Sectionauthorval = false;
  public SectionreviewerVal = false;
  public keyval;
  public descval;
  public secName;
  public topErr;
  public subErr;
  public timeErr;
  public scoreErr;
  public itemErr;
  public itemPoolerr;
  public rangeErr;
  public valIndex;
  public showLoad;
  public saveMsg;
  public showMsg;
  public subLabelName;
  public topLabelName;
  public metaDataDetails;
  public reviewWorkFlowFlag:boolean;
  public uncheckSameAsPrevious: Boolean = false;
  public previousUrl;
  public totalTimeErr = false;
  public showAddAuthorPopup = false;
  public questionBankToggle;
  public currentSectionIndex;
  public currentUserIndWoRWF;
  public enableRWFToggle;
  public userSuggestion : userSuggestion;
  public AuthorsNameList;
  public allErrorsInWRWF;
  public check_UnCheck_Primary;
  public viewitemSetDetails;
  
  public woRWF_Val_Username;
  public woRWF_Val_Primary;
  public woRWF_Val_Attributes;
  public woRWF_Val_Privileges;

  public reviewType;
  public levelOfReview;
  public levelOfReviewArray = [];
  public onTheGoReviewToggle;
  public reviewerCanEditItemsToggle;
  public showPreCommentsToggle;
  public showItemsItemsetForAuthorToggle;
  public defaultItemStatus;
  public addSectionDisableKey;
  public sameAsPreviousToggle;
  public sameAsPreviousCheck;

  public pattern1 = /^[^\s].*/;

  public wo_RWF_AddAuthorBase: WO_RWF_AddAuthorBase;
  public wo_RWF_AddAuthoAccess: WO_RWF_AddAuthoAccess;

  public withRWF_SeqAndRanSettings : WithRWF_SeqAndRanSettings;
  public withRWF_SeqAndRanUserDetails : WithRWF_SeqAndRanUserDetails;

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
public alerts: any[] =[];



  ngOnInit() {
    this.addSectionDisableKey = false;
    this.woRWF_Val_Username = false;
    this.woRWF_Val_Primary = false;
    this.woRWF_Val_Attributes = false;
    this.woRWF_Val_Privileges = false;

    this.sameAsPreviousToggle = false;
    this.sameAsPreviousCheck = null;

    this.AuthorsNameList = [];
    this.check_UnCheck_Primary = true;
    this.allErrorsInWRWF = [];
    this.enableRWFToggle = false;
    this.questionBankToggle = false;
    this.reviewType = "Sequential";
    this.levelOfReview = 2;
    this.levelOfReviewArray = [];
    for(var lr=0;lr<this.levelOfReview;lr++){
      var curLl;
      curLl = lr+1;
      this.levelOfReviewArray.push(curLl);
    }
    this.onTheGoReviewToggle = false;
    this.reviewerCanEditItemsToggle = false;
    this.showPreCommentsToggle = true;
    this.showItemsItemsetForAuthorToggle = true;
    this.defaultItemStatus = "Approved";
    localStorage.removeItem("_01Save");
    localStorage.removeItem("_11Save");
    localStorage.removeItem("_21Save");
    localStorage.removeItem("_31Save");
    localStorage.removeItem("_41Save");
    localStorage.removeItem("_51Save");
    localStorage.removeItem("_61Save");
    localStorage.removeItem("_71Save");
    localStorage.removeItem("_81Save");
    localStorage.removeItem("_91Save");


    //  WITHOUT REVIEW WORKFLOW STRUCTURE
    localStorage.removeItem("_def_WithoutRWFS");

    this.wo_RWF_AddAuthorBase = new WO_RWF_AddAuthorBase();
    this.wo_RWF_AddAuthoAccess = new WO_RWF_AddAuthoAccess();

    this.wo_RWF_AddAuthorBase.section_name = "";
    this.wo_RWF_AddAuthorBase.section_user_details = [];
    this.wo_RWF_AddAuthorBase.validation_process = false;

    this.wo_RWF_AddAuthoAccess.name_or_email = "";
    this.wo_RWF_AddAuthoAccess.is_primary = false;
    this.wo_RWF_AddAuthoAccess.author_attributes = null;
    this.wo_RWF_AddAuthoAccess.author_privileges = null;

    this.wo_RWF_AddAuthorBase.section_user_details.push(this.wo_RWF_AddAuthoAccess);
    localStorage.setItem("_def_WithoutRWFS", JSON.stringify(this.wo_RWF_AddAuthorBase));

    this.previousUrl = this.getItemService.getPreviousUrl();
    this.reviewWorkFlowFlag = this.getItemService.sendReviewWrkFlwFlag();
    // this.createItemSet = this.getItemService.sendItemsetDetail().itemset_details;
    this.settings1 = {
      singleSelection: false,
      text: "Select Subject(s)",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "myclass custom-class-example"
    };
    this.settings2 = {
      singleSelection: false,
      text: "Select Topic(s)",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "subject",
      classes: "myclass custom-class-example"
    };


    this.showLoad = true;
    if(this.authService.canActivate()){
          
      localStorage.removeItem('TZNM');
      localStorage.removeItem('TZNMVL');
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/get_metadatas/"+this.cookieService.get('_PAOID'),{headers:headers})
      .map(res => res.json())
      // .catch((e: any) =>{
      //   return Observable.throw(e)
      // } )

      .subscribe(
        data => {
              
        localStorage.setItem('TZNM' , data.timezone_name);
        localStorage.setItem('TZNMVL' , data.timezone_value);

          this.showLoad = false;
          this.metaDataDetails = data;
          this.getItemService.getMetaDataDetails(data);
          this.subjectList = data.subjects;
          this.reviewer = data.reviewers;


          // if(!this.reviewWorkFlowFlag){
          // this.createItemSet.author = data.author;
          // }else {
          //   this.createItemSet.author = '';
          // }
          this.loadItemSetData();
          this.subLabelName = data.parameters.linked_attribute_1;
          this.topLabelName = data.parameters.linked_attribute_2;

        

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
        },
      );


    }


    // this.createItemSet = this.getItemService.sendItemsetDetail().itemset_details;




  }

  loadItemSetData(){
    var itemsetId = localStorage.getItem("_IDVI-S");
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
        this.viewitemSetDetails = data;

        this.createItemSet = this.viewitemSetDetails.itemset_details;

        for(var d=0;d<this.createItemSet.sections.length; d++) {

          // pushRWFSecDet = JSON.parse(localStorage.getItem("_" + d + 1 + "Save"));

          this.wo_RWF_AddAuthorBase = new WO_RWF_AddAuthorBase();
      
          this.wo_RWF_AddAuthorBase.section_name = this.createItemSet.sections[d].section_name;
          this.wo_RWF_AddAuthorBase.section_user_details = this.createItemSet.sections[d].section_user_details;
          for (let val of this.wo_RWF_AddAuthorBase.section_user_details) {
            if (val.is_primary === 'n') {
              val.is_primary = false;
            } else if (val.is_primary == 'y') {
              val.is_primary = true;
            }
            if(val.is_primary === 'y'){
              this.check_UnCheck_Primary = true;
            }
            else if(val.is_primary === 'n'){
              this.check_UnCheck_Primary = false;
            }
          }
          this.wo_RWF_AddAuthorBase.validation_process = true;
          localStorage.setItem("_" + d + 1 + "Save", JSON.stringify(this.wo_RWF_AddAuthorBase));

        }

        for(var i=0;i<this.createItemSet.sections.length;i++){
          var seletedsub = [];
          this.createItemSet.sections[i].time = new Date('Thu Jun 21 2018'+' '+this.createItemSet.sections[i].time+' GMT+0530');
          // seletedsub.push(this.createItemSet.sections[i].subjects);
          this.getTopic(this.createItemSet.sections[i].subjects,i);
          this.bindTopic();
          if(this.createItemSet.sections[i].section_edit == false){
            this.settings1 = {

              disabled: !this.createItemSet.sections[i].section_edit
            };
            this.settings2 = {

              disabled: !this.createItemSet.sections[i].section_edit
            };
          }
        }
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

  chooseWoRWFPrivileges(userInd, curUserObj, usrPriValue, secUseDetArr) {

    // this.woRWF_Val_Username = false;
    // this.woRWF_Val_Primary = false;
    // this.woRWF_Val_Attributes = false;
    // this.woRWF_Val_Privileges = false;

      if(usrPriValue == 0){
        curUserObj.author_privileges = null;
      }else{
        curUserObj.author_privileges = usrPriValue;
      }

      // for(var u=0;u<this.wo_RWF_AddAuthorBase.section_user_details.length;u++){
      //   if(this.wo_RWF_AddAuthorBase.section_user_details[u].name_or_email == ''){
      //     this.woRWF_Val_Username = true;
      //   }

      //   if(this.wo_RWF_AddAuthorBase.section_user_details[u].author_attributes == null){
      //     this.woRWF_Val_Attributes = true;
      //   }

      //   if(this.wo_RWF_AddAuthorBase.section_user_details[u].author_privileges == null){
      //     this.woRWF_Val_Privileges = true;
      //   }
      // }


  }

  
  chooseWoRWFAttributes(userInd, curUserObj, usrAttrValue, secUseDetArr) {

    // this.woRWF_Val_Username = false;
    // this.woRWF_Val_Primary = false;
    // this.woRWF_Val_Attributes = false;
    // this.woRWF_Val_Privileges = false;

      if(usrAttrValue == 0){
        curUserObj.author_attributes = null;
      }else{
        curUserObj.author_attributes = usrAttrValue;
      }

      // for(var u=0;u<this.wo_RWF_AddAuthorBase.section_user_details.length;u++){
      //   if(this.wo_RWF_AddAuthorBase.section_user_details[u].name_or_email == ''){
      //     this.woRWF_Val_Username = true;
      //   }

      //   if(this.wo_RWF_AddAuthorBase.section_user_details[u].author_attributes == null){
      //     this.woRWF_Val_Attributes = true;
      //   }

      //   if(this.wo_RWF_AddAuthorBase.section_user_details[u].author_privileges == null){
      //     this.woRWF_Val_Privileges = true;
      //   }
      // }
  }

  toggleAuthorIsPrimary(userDet,userInd,usersArr){

    for(var i=0;i<usersArr.length;i++){
      if(i == userInd){
        usersArr[i].is_primary = true;
      }else{
        usersArr[i].is_primary = false;
      }
    }
    // userDet.is_primary = !userDet.is_primary;

    for(var t=0;t<usersArr.length;t++){
      if(usersArr[t].is_primary == true){
        usersArr[t].author_attributes = 'Assign';
        usersArr[t].author_privileges = 'Edit';
      }
    }
  }

  validationSections() {
    const pattern1 = /^[^\s].*/;
    var a = 0;
    var array = [];
    this.subErr = false;
    this.topErr = false;
    this.timeErr = false;
    this.valIndex = -1;
    this.totalTimeErr = false;

    for (var i = 0; i < this.createItemSet.sections.length; i++) {
      if (
        this.createItemSet.sections[i].section_name == undefined ||
        this.createItemSet.sections[i].section_name == "" ||
        !pattern1.test(this.createItemSet.sections[i].section_name)
      ) {
        this.secName = true;
        this.valIndex = i;
        a = -1;
      } else {
        this.secName = false;
        this.valIndex = -1;
      }
      if (a == -1) {
        break;
      }
      //topic validation
      if (this.createItemSet.sections[i].topics.length != 0) {
        for (var j = 0; j < this.createItemSet.sections[i].topics.length; j++) {
          array.push(this.createItemSet.sections[i].topics[j].subject);
        }
      } else {
        this.valIndex = i;
        this.topErr = true;
      }
      //sub validation
      if (this.createItemSet.sections[i].subjects.length != 0) {
        for (
          var j = 0;
          j < this.createItemSet.sections[i].subjects.length;
          j++
        ) {
          var b = array.includes(
            this.createItemSet.sections[i].subjects[j].itemName
          );
          if (b == false) {
            this.topErr = true;
            this.valIndex = i;
            break;
          }
        }
      } else {
        this.subErr = true;
        this.valIndex = i;
      }
      if (this.topErr == true || this.subErr == true) {
        this.valIndex = i;
        break;
      }

      if (this.questionBankToggle == false) {
        //time validation
        // var timeformat = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/ //24 hrs format
        var timeformat = /^(?:0[0-4]|[00][0-4]):[0-5][0-9]:[0-5][0-9]$/; //12 hrs format - (to check for 0 to 4 hrs only)

        if (
          this.createItemSet.sections[i].time == "" ||
          this.createItemSet.sections[i].time == null ||
          this.createItemSet.sections[i].time == "00:00" ||
          this.createItemSet.sections[i].time == "00:00:00"
        ) {
          this.timeErr = true;
          this.valIndex = i;
          a = -1;
        } else if (!timeformat.test(this.createItemSet.sections[i].time)) {
          if (this.createItemSet.sections[i].time != "05:00:00") {
            this.timeErr = true;
            this.valIndex = i;
            a = -1;
            this.alerts.push({
              type: "danger",
              msg: `Duration should not be greater than 5 hrs`,
              timeout: 3000
            });
          }
        } else {
          this.timeErr = false;
          this.valIndex = -1;
        }
        if (a == -1) {
          break;
        }
        //score validation
        if (
          this.createItemSet.sections[i].score == "" ||
          this.createItemSet.sections[i].score == undefined ||
          this.createItemSet.sections[i].score == 0
        ) {
          this.scoreErr = true;
          this.valIndex = i;
          a = -1;
        } else if (
          this.createItemSet.sections[i].score != "" ||
          this.createItemSet.sections[i].score != undefined ||
          this.createItemSet.sections[i].score != 0
        ) {
          const pattern = /^[0-9]*$/;
          if (pattern.test(this.createItemSet.sections[i].score)) {
            this.scoreErr = false;
            this.valIndex = -1;
          } else {
            this.scoreErr = true;
            this.valIndex = i;
            a = -1;
          }
        }
        if (a == -1) {
          break;
        }
        // no of item validation
        if (
          this.createItemSet.sections[i].no_of_items == "" ||
          this.createItemSet.sections[i].no_of_items == undefined ||
          this.createItemSet.sections[i].no_of_items == 0
        ) {
          this.itemErr = true;
          this.valIndex = i;
          a = -1;
        } else if (
          this.createItemSet.sections[i].no_of_items != "" ||
          this.createItemSet.sections[i].no_of_items != undefined ||
          this.createItemSet.sections[i].no_of_items != 0
        ) {
          const pattern = /^[0-9]*$/;
          if (pattern.test(this.createItemSet.sections[i].no_of_items)) {
            this.itemErr = false;
            this.valIndex = -1;
          } else {
            this.itemErr = true;
            this.valIndex = i;
            a = -1;
          }
        }
        if (a == -1) {
          break;
        }
        //no of item in pool validation
        if (
          this.createItemSet.sections[i].no_of_items_in_pool == "" ||
          this.createItemSet.sections[i].no_of_items_in_pool == undefined ||
          this.createItemSet.sections[i].no_of_items_in_pool == 0
        ) {
          this.itemPoolerr = true;
          this.valIndex = i;
          a = -1;
        } else if (
          this.createItemSet.sections[i].no_of_items_in_pool != "" ||
          this.createItemSet.sections[i].no_of_items_in_pool != undefined ||
          this.createItemSet.sections[i].no_of_items_in_pool != 0
        ) {
          const pattern = /^[0-9]*$/;
          if (
            pattern.test(this.createItemSet.sections[i].no_of_items_in_pool)
          ) {
            this.itemPoolerr = false;
            this.valIndex = -1;
          } else {
            this.itemPoolerr = true;
            this.valIndex = i;
            a = -1;
          }
        }
        if (a == -1) {
          break;
        }

        if (
          parseInt(this.createItemSet.sections[i].no_of_items) >
          parseInt(this.createItemSet.sections[i].no_of_items_in_pool)
        ) {
          this.rangeErr = true;
          this.valIndex = i;
          this.alerts.push({
            type: "danger",
            msg: `No of Items Must be Less than No of Items in Pool`,
            timeout: 3000
          });
          a = -1;
        } else {
          this.rangeErr = false;
          this.valIndex = -1;
        }
        if (a == -1) {
          break;
        }
      }

      if (this.reviewWorkFlowFlag) {
        if (this.createItemSet.sections[i].author == null) {
          this.Sectionauthorval = true;
          this.valIndex = i;
          break;
        } else {
          this.Sectionauthorval = false;
          this.valIndex = -1;
        }

        if (this.createItemSet.sections[i].reviewer == null) {
          this.SectionreviewerVal = true;
          this.valIndex = i;
          break;
        } else {
          this.SectionreviewerVal = false;
          this.valIndex = -1;
        }
      }
    }
  }

  saveWoRWFAddAuthors(){

    this.allErrorsInWRWF = [];

    this.woRWF_Val_Username = false;
    this.woRWF_Val_Primary = false;
    this.woRWF_Val_Attributes = false;
    this.woRWF_Val_Privileges = false;



    if(this.wo_RWF_AddAuthorBase.section_user_details.length == 0){
      var newOne;
      newOne = new WO_RWF_AddAuthoAccess();

      newOne.name_or_email = "";
      newOne.is_primary = false;
      newOne.author_attributes = null;
      newOne.author_privileges = null;

      this.wo_RWF_AddAuthorBase.section_user_details.push(newOne);
    }


    // Main Validations
    // this.woRWF_Val_Username = false;
    // this.woRWF_Val_Primary = false;
    // this.woRWF_Val_Attributes = false;
    // this.woRWF_Val_Privileges = false;

    for(var u=0;u<this.wo_RWF_AddAuthorBase.section_user_details.length;u++){
      if(this.wo_RWF_AddAuthorBase.section_user_details[u].name_or_email == ''){
        this.woRWF_Val_Username = true;
      }

      // if(this.wo_RWF_AddAuthorBase.section_user_details[u].is_primary == ''){
      //   this.woRWF_Val_Username = true;
      // }

      if(this.wo_RWF_AddAuthorBase.section_user_details[u].author_attributes == null){
        this.woRWF_Val_Attributes = true;
      }

      if(this.wo_RWF_AddAuthorBase.section_user_details[u].author_privileges == null){
        this.woRWF_Val_Privileges = true;
      }
    }

    if(this.woRWF_Val_Username == false && this.woRWF_Val_Attributes == false && this.woRWF_Val_Privileges == false){

      if(this.wo_RWF_AddAuthorBase.section_user_details.length != 0){
        var checkOneAuth;
        checkOneAuth;

        if(this.wo_RWF_AddAuthorBase.section_user_details[0].name_or_email != '' && this.wo_RWF_AddAuthorBase.section_user_details[0].author_attributes != null && this.wo_RWF_AddAuthorBase.section_user_details[0].author_privileges != null) {
          checkOneAuth = true;
        }

        if(checkOneAuth == false){
          this.allErrorsInWRWF.push('You should add atleast one author for this section.');
        }

      }else{
        this.allErrorsInWRWF.push('You should add atleast one author for this section.');
      }

      if(this.wo_RWF_AddAuthorBase.section_user_details.length != 0){
        var primaryCheck;
        primaryCheck = false;

        for(var p=0;p<this.wo_RWF_AddAuthorBase.section_user_details.length;p++){
          if(this.wo_RWF_AddAuthorBase.section_user_details[p].is_primary == true){
            primaryCheck = true;
          }
        }

        if(primaryCheck == false){
          this.allErrorsInWRWF.push('Atleast one author should be in primary');
        }
      }

      if(this.wo_RWF_AddAuthorBase.section_user_details.length != 0){
        var assignCheck;
        assignCheck = false;

        for(var q=0;q<this.wo_RWF_AddAuthorBase.section_user_details.length;q++){
          if(this.wo_RWF_AddAuthorBase.section_user_details[q].author_attributes == 'Assign'){
            assignCheck = true;
          }
        }

        if(assignCheck == false){
          this.allErrorsInWRWF.push('Atleast one author should be need the Write access');
        }
      }

      if(this.wo_RWF_AddAuthorBase.section_user_details.length != 0){
        var editCheck;
        editCheck = false;

        for(var r=0;r<this.wo_RWF_AddAuthorBase.section_user_details.length;r++){
          if(this.wo_RWF_AddAuthorBase.section_user_details[r].author_privileges == 'Edit'){
            editCheck = true;
          }
        }

        if(editCheck == false){
          this.allErrorsInWRWF.push('Atleast one author should be need the Edit access');
        }
      }

      if(this.wo_RWF_AddAuthorBase.section_user_details.length != 0){
        var primeObj;
        for(var s=0;s<this.wo_RWF_AddAuthorBase.section_user_details.length;s++){
          if(this.wo_RWF_AddAuthorBase.section_user_details[s].is_primary == true){
            primeObj = this.wo_RWF_AddAuthorBase.section_user_details[s];
          }
        }

        if(primeObj != null && primeObj != undefined){
          if(primeObj.author_attributes != 'Assign'){
            this.allErrorsInWRWF.push('Primary author should be have Write access in attributes');
          }
          if(primeObj.author_privileges != 'Edit'){
            this.allErrorsInWRWF.push('Primary author should be have Edit access in privileges');
          }
        }
      }

      if(this.wo_RWF_AddAuthorBase.section_user_details.length != 0){

          var curMails;
          curMails = [];
          for(var aa=0;aa<this.wo_RWF_AddAuthorBase.section_user_details.length;aa++){
            curMails.push(this.wo_RWF_AddAuthorBase.section_user_details[aa].name_or_email);
          }

          var uniqueAuthEmails = Array.from(new Set(curMails));

          if(uniqueAuthEmails.length != curMails.length) {
            this.allErrorsInWRWF.push('Please provide a unique email ID.');
          }


        // Email ID's Validations
        if(this.wo_RWF_AddAuthorBase.section_user_details.length != 0){
          for(var em=0;em<this.wo_RWF_AddAuthorBase.section_user_details.length;em++){
            if(this.wo_RWF_AddAuthorBase.section_user_details[em].name_or_email != ''){
              var checkedEm = EmailValidator.validate(this.wo_RWF_AddAuthorBase.section_user_details[em].name_or_email);

              if(checkedEm == false){
                this.allErrorsInWRWF.push('Please enter a valid email ID.');
                break;
              }
            }
          }
        }
      }

      if(this.allErrorsInWRWF.length == 0){
        this.wo_RWF_AddAuthorBase.validation_process = true;
        this.modalRef.hide();
        localStorage.setItem("_" + this.currentSectionIndex + 1 + "Save",JSON.stringify(this.wo_RWF_AddAuthorBase));
      }
    }

  }
  showAddAuthorsPopup(ind, template: TemplateRef<any>, status){

    if(status === false || status === true){
      this.uncheckSameAsPrevious = false;
    }


    this.currentSectionIndex = ind;
    var checkValidation;
    checkValidation = false;
    if(this.enableRWFToggle == false){
      if(this.questionBankToggle == false){
        if(this.createItemSet.sections[ind].section_name == "" || this.createItemSet.sections[ind].subjects.length == 0 || this.createItemSet.sections[ind].topics.length == 0 || this.createItemSet.sections[ind].time == "" || this.createItemSet.sections[ind].score == "" || this.createItemSet.sections[ind].no_of_items == "" || this.createItemSet.sections[ind].no_of_items_in_pool == ""){
          this.validationSections();
          checkValidation = true;
        }
      }else if(this.questionBankToggle == true){
        if(this.createItemSet.sections[ind].section_name == "" || this.createItemSet.sections[ind].subjects.length == 0 || this.createItemSet.sections[ind].topics.length == 0){
          this.validationSections();
          checkValidation = true;
        }
      }
    }

    if(checkValidation == false){
// Start ***********************************
      var getCurPopDet;
      getCurPopDet = JSON.parse(localStorage.getItem("_" + ind + 1 + "Save"));

      if (getCurPopDet != undefined) {
        this.wo_RWF_AddAuthorBase = getCurPopDet;
      } else {
        this.wo_RWF_AddAuthorBase = JSON.parse(localStorage.getItem("_def_WithoutRWFS"));
        this.wo_RWF_AddAuthorBase.section_name = this.createItemSet.sections[ind].section_name;

        localStorage.setItem(
          "_" + ind + 1 + "Save",
          JSON.stringify(this.wo_RWF_AddAuthorBase)
        );
      }



// END ***********************
    this.showAddAuthorPopup = true;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: " modal-lg" }, this.config)
    );
  }
}

enterAuthorWoRWF(curUsrDet, curUsrInd,secUseDetArr){




  this.currentUserIndWoRWF = curUsrInd;

  var checkAuthorIsPrimary;
  checkAuthorIsPrimary = false;

  for(var y=0;y<secUseDetArr.length;y++){
    if(secUseDetArr[y].is_primary == true){
      checkAuthorIsPrimary = true;
      break;
    }
  }

  if(checkAuthorIsPrimary == false){
    if(curUsrDet.name_or_email != ""){
      secUseDetArr[0].is_primary = true;
    }
  }

  for(var t=0;t<secUseDetArr.length;t++){
    if(secUseDetArr[t].is_primary == true){
      secUseDetArr[t].author_attributes = 'Assign';
      secUseDetArr[t].author_privileges = 'Edit';
    }
  }

  if(curUsrDet.name_or_email != ''){
    this.userSuggestion = new userSuggestion();
    this.userSuggestion.org_id = parseInt(this.cookieService.get('_PAOID'));
    this.userSuggestion.search_key = curUsrDet.name_or_email;

    var body = this.userSuggestion;

    var headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.post(credentials.host +"/search_authors", body,{headers: headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
          data => {
            this.showLoad= false;

            if(data != undefined){
              this.AuthorsNameList = data;
            }
          },
          error => {
            this.showLoad= false;
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

addNewAuthorWoRWF(curStrc){

  this.woRWF_Val_Username = false;
  this.woRWF_Val_Primary = false;
  this.woRWF_Val_Attributes = false;
  this.woRWF_Val_Privileges = false;

  var checkIsEmptyField;
  checkIsEmptyField = false;
  for(var i=0;i<curStrc.section_user_details.length;i++){
    if(curStrc.section_user_details[i].name_or_email != ""){
      if(curStrc.section_user_details[i].author_attributes != null && curStrc.section_user_details[i].author_privileges != null){
        // Successfully validated
      }else{
        checkIsEmptyField = true;
        break;
      }
    }else{
      checkIsEmptyField = true;
      break;
    }
  }

  for(var u=0;u<this.wo_RWF_AddAuthorBase.section_user_details.length;u++){
    if(this.wo_RWF_AddAuthorBase.section_user_details[u].name_or_email == ''){
      this.woRWF_Val_Username = true;
    }

    // if(this.wo_RWF_AddAuthorBase.section_user_details[u].is_primary == ''){
    //   this.woRWF_Val_Username = true;
    // }

    if(this.wo_RWF_AddAuthorBase.section_user_details[u].author_attributes == null){
      this.woRWF_Val_Attributes = true;
    }

    if(this.wo_RWF_AddAuthorBase.section_user_details[u].author_privileges == null){
      this.woRWF_Val_Privileges = true;
    }
  }

  if(checkIsEmptyField == false){

    // if(curStrc.section_user_details.length < 5){
      // Add New Section
      var newOne;
      newOne = new WO_RWF_AddAuthoAccess();
      newOne.name_or_email = "";
      newOne.author_attributes = null;
      newOne.is_primary = false;
      newOne.author_privileges = null;

      curStrc.section_user_details.push(newOne);
    // }

  }else{

  }
}

removeCurrentUserWoRWF(curSecUserDet, userInd){
  curSecUserDet.splice(userInd, 1);

  var checkAuthorIsPrimary;
  checkAuthorIsPrimary = false;

  for(var y=0;y<curSecUserDet.length;y++){
    if(curSecUserDet[y].is_primary == true){
      checkAuthorIsPrimary = true;
      break;
    }
  }

  if(checkAuthorIsPrimary == false){
    if(curSecUserDet[0].name_or_email != ""){
      curSecUserDet[0].is_primary = true;
    }
  }

  for(var t=0;t<curSecUserDet.length;t++){
    if(curSecUserDet[t].is_primary == true){
      curSecUserDet[t].author_attributes = 'Assign';
      curSecUserDet[t].author_privileges = 'Edit';
    }
  }

}

assignAuthorNameWoRWF(woRWFArr, userInd, curUser,selName){
  this.currentUserIndWoRWF = userInd;

  curUser.name_or_email = selName;

  this.AuthorsNameList = [];
}

  getTopic(selectedSub,i){
    if(this.authService.canActivate()){

      this.uniqueSubjects = [];
      // bind selected subjects with comma seperated in subject field
      for(var k=0;k < this.createItemSet.sections.length;k++){
        if(this.createItemSet.sections[k].subjects.length != 0){
          for(var j =0;j<this.createItemSet.sections[k].subjects.length;j++)
          {
            if(!this.uniqueSubjects.includes(this.createItemSet.sections[k].subjects[j].itemName)){
              this.uniqueSubjects.push(this.createItemSet.sections[k].subjects[j].itemName);
            }

          }
        }else if(this.createItemSet.sections[k].subjects.length == 0){
          for(var j =0;j<selectedSub.length;j++)
          {
            if(!this.uniqueSubjects.includes(selectedSub[j].itemName)){
              this.uniqueSubjects.push(selectedSub[j].itemName);
            }

          }
        }
      }

      this.createItemSet.subjects=  this.uniqueSubjects.map(function(elem){
        return elem;
      }).join(",");

      //get topics
      // if(selectedSub.length==0){
        this.createItemSet.sections[i].topicList =[];
        this.createItemSet.topics ='';
      // }
      var body = selectedSub;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host +"/get_topics/" + this.cookieService.get('_PAOID'), body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {
            this.createItemSet.sections[i].topicList=data;
          },
          // error => alert(error)
      );
    }
  }

 // bind selected topics with comma seperated in topic field
  bindTopic(){
    this.uniqueTopics = [];
    for(var k=0;k < this.createItemSet.sections.length;k++){
      for(var j =0;j<this.createItemSet.sections[k].topics.length;j++)
      {
        if(!this.uniqueTopics.includes(this.createItemSet.sections[k].topics[j].itemName)){
          this.uniqueTopics.push(this.createItemSet.sections[k].topics[j].itemName);
        }
        if(this.createItemSet.sections[k].topics.length == 0){
          this.createItemSet.topics ='';
        }
      }
    }
    this.createItemSet.topics = this.uniqueTopics.map(function(elem){
      return elem;
    }).join(",");

  }

  addSections() {
    if (this.createItemSet.no_of_sections <= 5)
      for (var u = 0; u < this.createItemSet.sections.length; u++) {
        if (this.questionBankToggle == false) {
          if (
            this.createItemSet.sections[u].section_name == "" ||
            this.createItemSet.sections[u].subjects.length == 0 ||
            this.createItemSet.sections[u].topics.length == 0 ||
            this.createItemSet.sections[u].time == "" ||
            this.createItemSet.sections[u].score == "" ||
            this.createItemSet.sections[u].no_of_items == "" ||
            this.createItemSet.sections[u].no_of_items_in_pool == ""
          ) {
            this.addSectionDisableKey = true;
            this._notifications.create(
              "",
              "Enter section & User details to add another section.",
              "error"
            );
            this.validationSections();
            break;
          } else {
            this.addSectionDisableKey = false;
          }
        } else {
          if (
            this.createItemSet.sections[u].section_name == "" ||
            this.createItemSet.sections[u].subjects.length == 0 ||
            this.createItemSet.sections[u].topics.length == 0
          ) {
            this.addSectionDisableKey = true;
            this._notifications.create(
              "",
              "Enter section & User details to add another section.",
              "error"
            );
            this.validationSections();
            break;
          } else {
            this.addSectionDisableKey = false;
          }
        }
      }

    if (this.addSectionDisableKey == false) {

      var validateAllSections;
      validateAllSections = false;
      for(var d=0;d<this.createItemSet.sections.length; d++) {
        var pushRWFSecDet;
        pushRWFSecDet = JSON.parse(localStorage.getItem("_" + d + 1 + "Save"));
        if (pushRWFSecDet != undefined && pushRWFSecDet != null) {
         if(pushRWFSecDet.validation_process == false) {
          validateAllSections = true;
          this.createItemSet.sections[d].check_validations = true;
         }
        }else{
          validateAllSections = true;
          this.createItemSet.sections[d].check_validations = true;
        }
      }

      if(validateAllSections == false){
        this.createItemSet.sections.push(new sections());
        this.createItemSet.no_of_sections = this.createItemSet.sections.length;
      }else{
        if(this.enableRWFToggle == true){
          this._notifications.create("", 'Enter section & User details to add another section.', "error");
        }else{
          this._notifications.create("", 'Enter section & User details to add another section.', "error");
        }
      }

    }

    setTimeout(() => {
      if (this.addSectionDisableKey == true) {
        this.addSectionDisableKey = false;
      }
    }, 3000);


}


  calculateTime(time,index){

    this.createItemSet.total_time = parseInt('00:00:00');

    var sectionTime = new Date(time);
    var year = sectionTime.getFullYear();

   if(year != 1970){
     var convertedTime = time.toLocaleString('en-GB');

     var splitTime = convertedTime.split(',');
     var RemoveMerdian = splitTime[1].split(' ');

     var splitedTime = RemoveMerdian[1];



     this.createItemSet.sections[index].time = splitedTime;
     this.hours ="00";
     this.min = "00";
    //  this.sec = "00";
     var calmin;
    //  var calSec

       for(var i=0;i<this.createItemSet.sections.length;i++){
         if(this.createItemSet.sections[i].time !='' && this.createItemSet.sections[i].time != null){

           var getTime = String(this.createItemSet.sections[i].time).split(':');

          //  if(this.sec < 10){
          //    this.sec = 0+String(this.sec);
          //  }
           if(this.min < 10){
             this.min = 0+String(this.min);
           }
           if(this.hours < 10){
             this.hours = 0+String(this.hours);
           }

          //  if(getTime[2] == undefined){
          //    this.createItemSet.sections[i].time = getTime[0] + ':'+getTime[1] + ':'+ String('00');
          //    getTime[2] = String('00');
          //  }
           if(getTime[1] == undefined){
             this.createItemSet.sections[i].time = getTime[0] + ':'+String('00') + ':'+ getTime[2] ;
             getTime[1] = String('00');
           }
           if(getTime[0] == undefined){
             this.createItemSet.sections[i].time =String('00')+ ':'+getTime[1] + ':'+ getTime[2] ;
             getTime[0] = String('00');
           }

           this.hours = parseInt(getTime[0]) +parseInt(this.hours);
           this.min = parseInt(getTime[1]) + parseInt(this.min);
          //  this.sec = parseInt(getTime[2]) + parseInt(this.sec);

         }
       }
      //  if(this.sec > 60){
      //    calSec = Math.floor(this.sec/60);
      //    this.min = this.min+calSec;
      //    this.sec = this.sec % 60;

      //  }
       if(this.min >= 60){
         calmin = Math.floor(this.min/60);

         this.hours = this.hours+calmin;
         this.min = this.min % 60;
       }
      //  if(this.sec < 10){
      //    this.sec = 0+String(this.sec);
      //  }
       if(this.min < 10){
         this.min = 0+String(this.min);
       }
       if(this.hours < 10){
         this.hours = 0+String(this.hours);
       }
      //  if(isNaN(this.sec)){
      //    this.sec = String('00');
      //  }
       if(isNaN(this.min)){
         this.min = String('00');
       }
       if(isNaN(this.hours)){
         this.hours = String('00');
       }




      //  if(this.sec < 10){
      //    this.sec = Math.floor(this.sec);
      //    this.sec = 0+String(this.sec);
      //  }
       if(this.min < 10){
         this.min = Math.floor(this.min);
         this.min = 0+String(this.min);
       }
       if(this.hours < 10){
         this.hours = Math.floor(this.hours);
         this.hours = 0+String(this.hours);
       }
       this.createItemSet.total_time = this.hours + ':'+this.min;

   }

 }
  calculateScore(){
    this.createItemSet.total_score = parseInt('0');
    var score = parseInt('0');
    // if(this.createItemSet.sections.length >= 2){
      for(var i=0;i<this.createItemSet.sections.length;i++){
        if(this.createItemSet.sections[i].score !='' && this.createItemSet.sections[i].score !=undefined){
        score = parseInt(this.createItemSet.sections[i].score) + score;
        if(isNaN(score)){
          this.createItemSet.total_score = 0;
        }else{
          this.createItemSet.total_score = score;
        }
      }
      }
    // }
  }
  calculateItems(){
    this.createItemSet.no_of_items_count = parseInt('0');
    var noofItem  = parseInt('0');

      for(var i=0;i<this.createItemSet.sections.length;i++){
        if(this.createItemSet.sections[i].no_of_items !='' && this.createItemSet.sections[i].no_of_items!= undefined){
         noofItem= parseInt(this.createItemSet.sections[i].no_of_items) + noofItem;
        if(isNaN(noofItem)){
          this.createItemSet.no_of_items_count = 0;
        }else{
          this.createItemSet.no_of_items_count = noofItem;
        }
      }
      }


  }
  calculatePool(){
    this.createItemSet.no_of_items_in_pool_count = parseInt('0');
    var pool =  parseInt('0');
      for(var i=0;i<this.createItemSet.sections.length;i++){
        if(this.createItemSet.sections[i].no_of_items_in_pool !='' && this.createItemSet.sections[i].no_of_items_in_pool!=undefined){
         pool = parseInt(this.createItemSet.sections[i].no_of_items_in_pool) + pool;
        if(isNaN(pool)){
          this.createItemSet.no_of_items_in_pool_count = 0;
        }else{
          this.createItemSet.no_of_items_in_pool_count = pool;
        }
      }
      }
  }

  CalculateTimeAfterDelete(){
    this.hours ="00";
     this.min = "00";
     this.sec = "00";
     var calmin;
     var calSec

       for(var i=0;i<this.createItemSet.sections.length;i++){
         if(this.createItemSet.sections[i].time !='' && this.createItemSet.sections[i].time != null){

           var getTime = String(this.createItemSet.sections[i].time).split(':');

           if(this.sec < 10){
             this.sec = 0+String(this.sec);
           }
           if(this.min < 10){
             this.min = 0+String(this.min);
           }
           if(this.hours < 10){
             this.hours = 0+String(this.hours);
           }

           if(getTime[2] == undefined){
             this.createItemSet.sections[i].time = getTime[0] + ':'+getTime[1] + ':'+ String('00');
             getTime[2] = String('00');
           }
           if(getTime[1] == undefined){
             this.createItemSet.sections[i].time = getTime[0] + ':'+String('00') + ':'+ getTime[2] ;
             getTime[1] = String('00');
           }
           if(getTime[0] == undefined){
             this.createItemSet.sections[i].time =String('00')+ ':'+getTime[1] + ':'+ getTime[2] ;
             getTime[0] = String('00');
           }

           this.hours = parseInt(getTime[0]) +parseInt(this.hours);
           this.min = parseInt(getTime[1]) + parseInt(this.min);
           this.sec = parseInt(getTime[2]) + parseInt(this.sec);

         }
       }
       if(this.sec > 60){
         calSec = Math.floor(this.sec/60);
         this.min = this.min+calSec;
         this.sec = this.sec % 60;

       }
       if(this.min >= 60){
         calmin = Math.floor(this.min/60);

         this.hours = this.hours+calmin;
         this.min = this.min % 60;
       }
       if(this.sec < 10){
         this.sec = 0+String(this.sec);
       }
       if(this.min < 10){
         this.min = 0+String(this.min);
       }
       if(this.hours < 10){
         this.hours = 0+String(this.hours);
       }
       if(isNaN(this.sec)){
         this.sec = String('00');
       }
       if(isNaN(this.min)){
         this.min = String('00');
       }
       if(isNaN(this.hours)){
         this.hours = String('00');
       }




       if(this.sec < 10){
         this.sec = Math.floor(this.sec);
         this.sec = 0+String(this.sec);
       }
       if(this.min < 10){
         this.min = Math.floor(this.min);
         this.min = 0+String(this.min);
       }
       if(this.hours < 10){
         this.hours = Math.floor(this.hours);
         this.hours = 0+String(this.hours);
       }
       this.createItemSet.total_time = this.hours + ':'+this.min;
  }

  deleteSection(index) {
    console.log(index)
    this.currentSectionIndex = index;

    this.createItemSet.sections.splice(index, 1);
    this.createItemSet.no_of_sections = this.createItemSet.sections.length;
    this.CalculateTimeAfterDelete();
    this.calculateItems();
    this.calculateScore();
    this.calculatePool();

    // Remove Localstorage details and change the name for current section details.
    localStorage.removeItem("_" + index + 1 + "Save");

    for(var g=0;g<this.createItemSet.sections.length;g++){
      if(g >= index){
        var lsNextInd;
        lsNextInd = g+1;
        var curNextToPreData;
        curNextToPreData = JSON.parse(localStorage.getItem("_" + lsNextInd + 1 + "Save"));

        if(curNextToPreData != undefined && curNextToPreData != null){
          localStorage.setItem("_" + g + 1 + "Save", JSON.stringify(curNextToPreData));
          localStorage.removeItem("_" + lsNextInd + 1 + "Save");
        }
      }
    }

  }
  sameAsPrevious(checkWho, value){

    this.sameAsPreviousToggle = !value;

    if(this.sameAsPreviousToggle == true){
      this.sameAsPreviousCheck = this.currentSectionIndex;
      if(checkWho == 1){
        // Authors Only //// this.wo_RWF_AddAuthorBase
        var prevSecDet;
        var prevSecInd;
        prevSecInd = this.currentSectionIndex-1;
        prevSecDet = JSON.parse(localStorage.getItem("_" + prevSecInd + 1 + "Save"));

        if(prevSecDet != undefined && prevSecDet != null){
          this.wo_RWF_AddAuthorBase.section_user_details = prevSecDet.section_user_details;
          this.wo_RWF_AddAuthorBase.validation_process = prevSecDet.validation_process;
        }

      }else if(checkWho == 2){
        // Authors and Reviewers //// this.withRWF_SeqAndRanSettings
        this.sameAsPreviousCheck = this.currentSectionIndex;
        if(checkWho == 2){
          // Authors Only //// this.wo_RWF_AddAuthorBase
          var prevSecDet;
          var prevSecInd;
          prevSecInd = this.currentSectionIndex-1;
          prevSecDet = JSON.parse(localStorage.getItem("_" + prevSecInd + 1 + "Save"));

          if(prevSecDet != undefined && prevSecDet != null){
            this.withRWF_SeqAndRanSettings.section_user_details = prevSecDet.section_user_details;
            this.withRWF_SeqAndRanSettings.validation_process = prevSecDet.validation_process;
          }
      }
    }
    }else{
      this.sameAsPreviousCheck = null;
    }
  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0 ) ? null : event.charCode >= 48 && event.charCode <= 57;
  }


  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  validation(){
    const pattern1 = /^[^\s].*/;
    var a =0;
    var array=[];
    this.subErr =false;
    this.topErr = false;
    this.valIndex = -1;
    this.timeErr = false;
    this.totalTimeErr = false;
    if(this.createItemSet.itemset_name == '' || this.createItemSet.itemset_name == undefined || !pattern1.test(this.createItemSet.itemset_name)){
      this.itemsetname = true;
    }else{
      this.itemsetname = false;
    }

    if(this.createItemSet.keywords == '' || this.createItemSet.keywords == undefined || !pattern1.test(this.createItemSet.keywords)){
      this.keyval = true;
    }else{
      this.keyval = false;
    }
    if(this.createItemSet.description == '' || this.createItemSet.description == undefined || !pattern1.test(this.createItemSet.description)){
      this.descval = true;
    }else{
      this.descval = false;
    }

    for(var i=0;i<this.createItemSet.sections.length;i++){

      if(this.createItemSet.sections[i].section_name == undefined || this.createItemSet.sections[i].section_name == ''  || !pattern1.test(this.createItemSet.sections[i].section_name)){
        this.secName = true;
        this.valIndex = i;
        a=-1;
      }else{
        this.secName = false;
        this.valIndex = -1;
      }
      if(a==-1){
      break;
      }
      //topic validation
      if(this.createItemSet.sections[i].topics.length !=0){
        for(var j=0;j<this.createItemSet.sections[i].topics.length; j++){
          array.push(this.createItemSet.sections[i].topics[j].subject);
        }

      }
      else{
        this.valIndex = i;
        this.topErr =true;
      }
      //sub validation
      if(this.createItemSet.sections[i].subjects.length != 0){
        for (var j=0;j<this.createItemSet.sections[i].subjects.length;j++){
         var b = array.includes(this.createItemSet.sections[i].subjects[j].itemName);
         if(b==false){
          this.topErr = true;
          this.valIndex = i;
          break;
         }
        }
      }else{
           this.subErr = true;
           this.valIndex = i;
      }
      if(this.topErr == true || this.subErr == true){
        this.valIndex = i;
        break;
      }
      //time validation
      var timeformat = /^(?:0[0-4]|[00][0-4]):[0-5][0-9]:[0-5][0-9]$/
      if(this.createItemSet.sections[i].time == '' || this.createItemSet.sections[i].time == null || this.createItemSet.sections[i].time == '00:00:00' || this.createItemSet.sections[i].time == '00:00'){
        this.timeErr = true;
        this.valIndex = i;
        a=-1;
      }
      else if(!timeformat.test(this.createItemSet.sections[i].time )){
        if(this.createItemSet.sections[i].time != '05:00:00'){
          this.timeErr = true;
          this.valIndex = i;
          a=-1;
          this.alerts.push({
            type: 'danger',
            msg: `Duration should not be greater than 5 hrs`,
            timeout:3000
          });
        }
      }
      else{
        this.timeErr = false;
        this.valIndex = -1;
      }
      if(a==-1){
        break;
        }
      //score validation
      if(this.createItemSet.sections[i].score == '' || this.createItemSet.sections[i].score == undefined || this.createItemSet.sections[i].score == 0){
        this.scoreErr = true;
        this.valIndex = i;
        a=-1;
      }else if(this.createItemSet.sections[i].score != '' || this.createItemSet.sections[i].score != undefined || this.createItemSet.sections[i].score != 0){
        const pattern = /^[0-9]*$/;
        if(pattern.test(this.createItemSet.sections[i].score)){
          this.scoreErr = false;
          this.valIndex = -1;
        }else {
          this.scoreErr = true;
          this.valIndex = i;
          a=-1;
        }
      }
      if(a==-1){
        break;
        }
      // no of item validation
      if(this.createItemSet.sections[i].no_of_items == '' || this.createItemSet.sections[i].no_of_items == undefined || this.createItemSet.sections[i].no_of_items == 0){
        this.itemErr = true;
        this.valIndex = i;
        a=-1;
      }else if(this.createItemSet.sections[i].no_of_items != '' || this.createItemSet.sections[i].no_of_items != undefined || this.createItemSet.sections[i].no_of_items != 0){
        const pattern = /^[0-9]*$/;
        if(pattern.test(this.createItemSet.sections[i].no_of_items)){
          this.itemErr = false;
          this.valIndex = -1;
        }else{
          this.itemErr = true;
          this.valIndex = i;
          a=-1;
        }
      }
      if(a==-1){
        break;
        }
      //no of item in pool validation
      if(this.createItemSet.sections[i].no_of_items_in_pool == '' || this.createItemSet.sections[i].no_of_items_in_pool == undefined || this.createItemSet.sections[i].no_of_items_in_pool == 0){
        this.itemPoolerr = true;
        this.valIndex = i;
        a=-1;
      }else if(this.createItemSet.sections[i].no_of_items_in_pool != '' || this.createItemSet.sections[i].no_of_items_in_pool != undefined || this.createItemSet.sections[i].no_of_items_in_pool != 0){
        const pattern = /^[0-9]*$/;
        if(pattern.test(this.createItemSet.sections[i].no_of_items_in_pool)){
          this.itemPoolerr = false;
          this.valIndex = -1;
        }else{
          this.itemPoolerr = true;
          this.valIndex = i;
          a=-1;
        }
      }if(a==-1){
        break;
        }

      if(parseInt(this.createItemSet.sections[i].no_of_items) > parseInt(this.createItemSet.sections[i].no_of_items_in_pool)){
        this.rangeErr = true;
        this.valIndex = i;
        this.alerts.push({
          type: 'danger',
          msg: `No of Items Must be Less than No of Items in Pool`,
          timeout:3000
        });
        a=-1;
      }else{
        this.rangeErr = false;
        this.valIndex = -1;
      }if(a==-1){
      break;
      }

      if(this.reviewWorkFlowFlag){
        if(this.createItemSet.sections[i].author == null){
          this.Sectionauthorval = true;
          this.valIndex =i;
          break;
        }else{
          this.Sectionauthorval = false;
          this.valIndex =-1;
        }

        if(this.createItemSet.sections[i].reviewer == null){
          this.SectionreviewerVal = true;
          this.valIndex =i;
          break;
        }else{
          this.SectionreviewerVal = false;
          this.valIndex =-1;
        }
      }
    }

    var totalTimeFormat = /^(?:0[0-4]|[00][0-4]):[0-5][0-9]$/;  // total time must not be greater than 5 hrs, this regex validate upto 04:59 hrs so i manually validated for 05:00 hrs
    if(!totalTimeFormat.test(this.createItemSet.total_time )){
      if(this.createItemSet.total_time != '05:00'){
        this.totalTimeErr = true;
      }
    }else{
      this.totalTimeErr = false;
    }
  }

  create_Item_Set(){

    if(this.authService.canActivate()){
      this.validation();
      if(this.itemsetname == false && this.Sectionauthorval == false && this.SectionreviewerVal == false && this.keyval == false && this.descval == false && this.secName == false &&
      this.subErr == false && this.topErr == false && this.scoreErr == false && this.itemErr == false && this.itemPoolerr == false && this.rangeErr == false && this.timeErr == false && this.totalTimeErr == false) {
      // for(var i=0;i<this.createItemSet.sections.length;i++){
      //   delete this.createItemSet.sections[i].topicList;
      // }
      this.createItemSet.org_id=this.cookieService.get('_PAOID');
       // New Structure For RWF
          // QUESTION BANK = FALSE and REVIEW WORKFLOW = FALSE
          if (
            this.enableRWFToggle == false &&
            this.questionBankToggle == false
          ) {
            this.createItemSet.review_workflow = this.enableRWFToggle;
            this.createItemSet.question_bank = this.questionBankToggle;

            for (var u = 0;u < this.createItemSet.sections.length;u++) {
              var pushRWFSecDet;
              pushRWFSecDet = JSON.parse(localStorage.getItem("_" + u + 1 + "Save"));

              if (pushRWFSecDet != undefined && pushRWFSecDet != null) {
                this.createItemSet.sections[u].section_user_details = pushRWFSecDet.section_user_details;
              }
            }

            delete this.createItemSet.review_type;
            delete this.createItemSet.on_the_go_review;
            delete this.createItemSet.reviewers_edit_items;
            delete this.createItemSet.authors_view;
            delete this.createItemSet.default_item_status;
            delete this.createItemSet.previous_comments;
            delete this.createItemSet.level_of_review;
          }

          // QUESTION BANK = TRUE and REVIEW WORKFLOW = FALSE
          if (
            this.enableRWFToggle == false &&
            this.questionBankToggle == true
          ) {
            this.createItemSet.review_workflow = this.enableRWFToggle;
            this.createItemSet.question_bank = this.questionBankToggle;

            delete this.createItemSet.review_type;
            delete this.createItemSet.on_the_go_review;
            delete this.createItemSet.reviewers_edit_items;
            delete this.createItemSet.authors_view;
            delete this.createItemSet.default_item_status;
            delete this.createItemSet.previous_comments;
            delete this.createItemSet.level_of_review;
            delete this.createItemSet.total_time;
            delete this.createItemSet.total_score;
            delete this.createItemSet.no_of_items_count;
            delete this.createItemSet.no_of_items_in_pool_count;

            for (
              var d = 0;
              d < this.createItemSet.sections.length;
              d++
            ) {
              delete this.createItemSet.sections[d].time;
              delete this.createItemSet.sections[d].score;
              delete this.createItemSet.sections[d].no_of_items;
              delete this.createItemSet.sections[d].no_of_items_in_pool;
            }

            for (var u = 0;u < this.createItemSet.sections.length;u++) {
              var pushRWFSecDet;
              pushRWFSecDet = JSON.parse(localStorage.getItem("_" + u + 1 + "Save"));

              if (pushRWFSecDet != undefined && pushRWFSecDet != null) {
                this.createItemSet.sections[u].section_user_details = pushRWFSecDet.section_user_details;
              }
            }
          }

          // QUESTION BANK = FALSE and REVIEW WORKFLOW = TRUE
          if (
            this.enableRWFToggle == true &&
            this.questionBankToggle == false
          ) {
            this.createItemSet.review_workflow = this.enableRWFToggle;
            this.createItemSet.question_bank = this.questionBankToggle;

            this.createItemSet.review_type = this.reviewType;
            this.createItemSet.level_of_review = this.levelOfReview;
            this.levelOfReviewArray = [];
            for(var lr=0;lr<this.levelOfReview;lr++){
              var curLl;
              curLl = lr+1;
              this.levelOfReviewArray.push(curLl);
            }
            this.createItemSet.on_the_go_review = this.onTheGoReviewToggle;
            this.createItemSet.reviewers_edit_items = this.reviewerCanEditItemsToggle;
            this.createItemSet.authors_view = this.showItemsItemsetForAuthorToggle;
            this.createItemSet.default_item_status = this.defaultItemStatus;

            this.createItemSet.previous_comments = this.showPreCommentsToggle;

            for (
              var u = 0;
              u < this.createItemSet.sections.length;
              u++
            ) {
              var pushRWFSecDet;
              pushRWFSecDet = JSON.parse(
                localStorage.getItem("_" + u + 1 + "Save")
              );

              if (pushRWFSecDet != undefined && pushRWFSecDet != null) {
                this.createItemSet.sections[u].section_user_details =
                  pushRWFSecDet.section_user_details;
              }
            }

            if (this.reviewType == "Sequential") {

            } else if (this.reviewType == "Concurrent") {
              delete this.createItemSet.level_of_review;
            }
          }

          // QUESTION BANK = FALSE and REVIEW WORKFLOW = TRUE
          if (this.enableRWFToggle == true && this.questionBankToggle == false ) {
            this.createItemSet.review_workflow = this.enableRWFToggle;
            this.createItemSet.question_bank = this.questionBankToggle;

            this.createItemSet.review_type = this.reviewType;
            this.createItemSet.level_of_review = this.levelOfReview;
            this.levelOfReviewArray = [];
            for(var lr=0;lr<this.levelOfReview;lr++){
              var curLl;
              curLl = lr+1;
              this.levelOfReviewArray.push(curLl);
            }

            this.createItemSet.on_the_go_review = this.onTheGoReviewToggle;
            this.createItemSet.reviewers_edit_items = this.reviewerCanEditItemsToggle;
            this.createItemSet.authors_view = this.showItemsItemsetForAuthorToggle;
            this.createItemSet.default_item_status = this.defaultItemStatus;

            this.createItemSet.previous_comments = this.showPreCommentsToggle;

            for (var u = 0;u < this.createItemSet.sections.length;u++) {
              var pushRWFSecDet;
              pushRWFSecDet = JSON.parse(
                localStorage.getItem("_" + u + 1 + "Save")
              );

              if (pushRWFSecDet != undefined && pushRWFSecDet != null) {
                this.createItemSet.sections[u].section_user_details = pushRWFSecDet.section_user_details;
              }
            }

            if (this.reviewType == "Sequential") {

            } else if (this.reviewType == "Concurrent") {
              delete this.createItemSet.level_of_review;
            }
          }

          // QUESTION BANK = TRUE and REVIEW WORKFLOW = TRUE
          if (this.enableRWFToggle == true && this.questionBankToggle == true) {
            this.createItemSet.review_workflow = this.enableRWFToggle;
            this.createItemSet.question_bank = this.questionBankToggle;

            this.createItemSet.review_type = this.reviewType;
            this.createItemSet.level_of_review = this.levelOfReview;
            this.levelOfReviewArray = [];
            for(var lr=0;lr<this.levelOfReview;lr++){
              var curLl;
              curLl = lr+1;
              this.levelOfReviewArray.push(curLl);
            }

            this.createItemSet.on_the_go_review = this.onTheGoReviewToggle;
            this.createItemSet.reviewers_edit_items = this.reviewerCanEditItemsToggle;
            this.createItemSet.authors_view = this.showItemsItemsetForAuthorToggle;
            this.createItemSet.default_item_status = this.defaultItemStatus;

            this.createItemSet.previous_comments = this.showPreCommentsToggle;

            for (var u = 0;u < this.createItemSet.sections.length;u++) {
              var pushRWFSecDet;
              pushRWFSecDet = JSON.parse(
                localStorage.getItem("_" + u + 1 + "Save")
              );

              if (pushRWFSecDet != undefined && pushRWFSecDet != null) {
                this.createItemSet.sections[u].section_user_details = pushRWFSecDet.section_user_details;
              }

              delete this.createItemSet.sections[u].time;
              delete this.createItemSet.sections[u].score;
              delete this.createItemSet.sections[u].no_of_items;
              delete this.createItemSet.sections[u].no_of_items_in_pool;
            }

            if (this.reviewType == "Sequential") {

            } else if (this.reviewType == "Concurrent") {
              delete this.createItemSet.level_of_review;
            }

            delete this.createItemSet.total_time;
            delete this.createItemSet.total_score;
            delete this.createItemSet.no_of_items_count;
            delete this.createItemSet.no_of_items_in_pool_count;
          }

      this.showLoad = true;

      var body = this.createItemSet;
      console.log(body)
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.put(credentials.host +'/itemset_edit', body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {

            if(data.success == true){
              this.showLoad = false;
              this._notifications.create('',data.message, 'info');
              // this.saveMsg = true;
              // this.showMsg = data.message;

                setTimeout(()=>{
                  this.saveMsg = false;
                  this.router.navigate([ this.previousUrl]);
                },3000);



            }else if(data.success == false){
              this.showLoad = false;
              this._notifications.create('',data.message, 'error')
              // this.saveMsg = true;
              // this.showMsg = data.message;
              setTimeout(()=>{
                this.saveMsg = false;
            },3000);
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



  // cancelitemset

  cancelItemset() {
    this.modalRef.hide();
    this.router.navigate(["ItemSets/viewitemsets", 0, 0, 0]);
  }


  cancelItemsetPopup(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-sm' },this.config),

    );
  }


  // bind selected author with comma seperated

  bindAuthor(){
    // var getAuthor = [];
    // for(var k=0;k < this.createItemSet.sections.length;k++){
    //   getAuthor.push(this.createItemSet.sections[k].author);
    // }
    // this.createItemSet.author = getAuthor.map(function(elem){
    //   return elem;
    // }).join(",");

  }

  // bind selected reviewer with comma seperated

  bindReviewer(){
    // var getReviewer = [];
    // for(var k=0;k < this.createItemSet.sections.length;k++){
    //   getReviewer.push(this.createItemSet.sections[k].reviewer);
    // }
    // this.createItemSet.reviewer = getReviewer.map(function(elem){
    //   return elem;
    // }).join(",");
  }

}
