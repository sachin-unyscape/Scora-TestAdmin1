import { Component, OnInit ,TemplateRef} from '@angular/core';
import { createItemSet } from './createItemSet';
import { sections } from './sections';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
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
import { parse } from 'querystring';
import { concat } from 'rxjs/observable/concat';


// Review WorkFlow Settings :: Sequential
import { RWFSettingsRequest } from "./rwf-settings-req";
import { RWFSectionDetails } from "./rwf-section-details";
import { RWFAuthorDetails } from "./rwf-author-details";
import { RWFLevels } from "./rwf-levels";
import { RWFReviewersInLevel } from "./rwf-reviewers-in-level";

// Without RWF :: Add Authors And Previleges
import { WO_RWF_AddAuthorBase } from "./wo-rwf-add-author-req";
import { WO_RWF_AddAuthoAccess } from "./wo-rwf-add-author-access";

// With RWF :: Add Author And Reviewer Details
import { WithRWF_SeqAndRanSettings } from "./w-rwf-seq-ran-settings-req";
import { WithRWF_SeqAndRanUserDetails } from "./w-rwf-seq-ran-user-details";

import * as EmailValidator from 'email-validator';

import {userSuggestion} from '../../test-menu/manage-test/userSuggestion';
export function getTimepickerConfig(): TimepickerConfig {

  return Object.assign(new TimepickerConfig(), {
    hourStep: 1,
    minuteStep: 1,
    showMeridian: false,
    showSpinners : false,
    readonlyInput: false,
    mousewheel: true,
    showMinutes: true,
    showSeconds: false
  });
}

@Component({
  selector: "app-add-item-sets",
  templateUrl: "./add-item-sets.component.html",
  styleUrls: ["./add-item-sets.component.scss"],
  animations: [
    trigger("dialog1", [
      transition("void => *", [
        style({ transform: "scale3d(.3, .3, .3)" }),
        animate(100)
      ]),
      transition("* => void", [
        animate(100, style({ transform: "scale3d(.0, .0, .0)" }))
      ])
    ])
  ],
  providers: [{ provide: TimepickerConfig, useFactory: getTimepickerConfig }]
})
export class AddItemSetsComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard : false
  };
  minTime: Date = new Date();
  maxTime: Date = new Date();
  constructor(
    private http: Http,
    private router: Router,
    public getItemService: GetItemService,
    public route: ActivatedRoute,
    private cookieService: CookieService,
    private authService: AuthServiceService,
    private _notifications: NotificationsService,
    private modalService: BsModalService
  ) {
    this.createItemSet = new createItemSet();
    this.sections = new sections();
    this.minTime.setHours(0);
    this.maxTime.setHours(5);
  }

  public createItemSet: createItemSet;
  public sections: sections;
  settings1 = {};
  settings2 = {};
  public selectedSub = [];
  public selectedTopic = [];
  public bindSubjects;
  public bindTopics;
  public subjectList = [];
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
  public topErr = false;
  public subErr = false;
  public timeErr;
  public scoreErr;
  public itemErr;
  public itemPoolerr;
  public rangeErr;
  public valIndex = -1;
  public showLoad;
  public saveMsg;
  public showMsg;
  public subLabelName;
  public topLabelName;
  public metaDataDetails;
  public reviewWorkFlowFlag: boolean;
  public pattern1 = /^[^\s].*/;
  public totalTimeErr;
  public addSectionDisableKey;

  // Review Work Flow
  public reviewType;
  public levelOfReview;
  public noOfReviewers;
  public onTheGoReviewToggle;
  public reviewerCanEditItemsToggle;
  public showPreCommentsToggle;
  public showItemsItemsetForAuthorToggle;
  public defaultItemStatus;

  public tempReviewType;
  public tempLevelOfReview;
  public tempNoOfReviewers;
  public tempOnTheGoReviewToggle;
  public tempReviewerCanEditItemsToggle;
  public tempshowPreCommentsToggle;
  public tempShowItemsItemsetForAuthorToggle;
  public tempDefaultItemStatus;
  public tempMultipleAuthorPerSectionToggle;
  public currentSectionIndex;
  public questionBankToggle;

  public reviewWFSettings;

  public enableRWFToggle;
  public RWFTogglePair;
  public levelOfReviewArray = [];

  public woRWF_AddAuthors;

  public woRWF_Val_Username;
  public woRWF_Val_Primary;
  public woRWF_Val_Attributes;
  public woRWF_Val_Privileges;

  public wRWF_Val_Username;
  public wRWF_Val_UserRole;
  public wRWF_Val_Attributes;
  public wRWF_Val_Privileges;
  public wRWF_Val_LevelCheck;
  public AuthorsNameList;
  public currentUserIndWoRWF;
  public allErrorsInWRWF;

  public sameAsPreviousToggle;
  public sameAsPreviousCheck;
  public RWFToggleStatus = false;
  public uncheckSameAsPrevious: Boolean = false;
  public showToggleAlert = false;
  public rWFTooltip;
  public ABCD;

  public Notificationoptions = {
    position: ["center"],
    timeOut: 4000,
    lastOnBottom: true,
    showProgressBar: true,
    preventDuplicates: true,
    animate: "scale",
    pauseOnHover: false,
    clickToClose: false,
    clickIconToClose: false
  };
  public alerts: any[] = [];

  // Review Workflow Request Variables
  public rwfSettingsRequest: RWFSettingsRequest;
  public rwfSectionDetails: RWFSectionDetails;
  public rwfAuthorDetails: RWFAuthorDetails;
  public rwfLevels: RWFLevels;
  public rwfReviewersInLevel: RWFReviewersInLevel;


  public withRWF_SeqAndRanSettings : WithRWF_SeqAndRanSettings;
  public withRWF_SeqAndRanUserDetails : WithRWF_SeqAndRanUserDetails;

  public wo_RWF_AddAuthorBase: WO_RWF_AddAuthorBase;
  public wo_RWF_AddAuthoAccess: WO_RWF_AddAuthoAccess;

  public userSuggestion : userSuggestion;

  ngOnInit() {

    this.ABCD = false;
    this.rWFTooltip = "Click to enable.";
    this.sameAsPreviousToggle = false;
    this.sameAsPreviousCheck = null;
    this.allErrorsInWRWF = [];
    this.AuthorsNameList = [];

    this.woRWF_Val_Username = false;
    this.woRWF_Val_Primary = false;
    this.woRWF_Val_Attributes = false;
    this.woRWF_Val_Privileges = false;

    this.wRWF_Val_Username = false;
    this.wRWF_Val_UserRole = false;
    this.wRWF_Val_Attributes = false;
    this.wRWF_Val_Privileges = false;
    this.wRWF_Val_LevelCheck = false;

    this.enableRWFToggle = false;
    this.RWFTogglePair = false;

    this.questionBankToggle = false;
    this.currentSectionIndex = 0;

    localStorage.removeItem("_def_WithRWFS");
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


    this.reviewType = "Sequential";
    this.levelOfReview = 2;
    this.levelOfReviewArray = [];
    for(var lr=0;lr<this.levelOfReview;lr++){
      var curLl;
      curLl = lr+1;
      this.levelOfReviewArray.push(curLl);
    }

    this.noOfReviewers = 1;
    this.onTheGoReviewToggle = false;
    this.reviewerCanEditItemsToggle = false;
    this.showPreCommentsToggle = true;
    this.showItemsItemsetForAuthorToggle = true;
    this.defaultItemStatus = "Approved";

    this.tempReviewType = "Sequential";
    this.tempLevelOfReview = 1;
    this.tempNoOfReviewers = 1;
    this.tempOnTheGoReviewToggle = false;
    this.tempReviewerCanEditItemsToggle = false;
    this.tempshowPreCommentsToggle = true;
    this.tempShowItemsItemsetForAuthorToggle = true;
    this.tempDefaultItemStatus = "Approved";
    this.tempMultipleAuthorPerSectionToggle = false;


    this.withRWF_SeqAndRanSettings = new WithRWF_SeqAndRanSettings();
    this.withRWF_SeqAndRanUserDetails = new WithRWF_SeqAndRanUserDetails();

    this.withRWF_SeqAndRanSettings.section_name = "";
    this.withRWF_SeqAndRanSettings.validation_process = false;
    this.withRWF_SeqAndRanSettings.review_type = this.tempReviewType;
    this.withRWF_SeqAndRanSettings.section_user_details = [];

    this.withRWF_SeqAndRanUserDetails.name_or_email = "";
    this.withRWF_SeqAndRanUserDetails.user_role = null;
    this.withRWF_SeqAndRanUserDetails.key_authority = null;
    this.withRWF_SeqAndRanUserDetails.level = null;
    this.withRWF_SeqAndRanUserDetails.author_attributes = null;
    this.withRWF_SeqAndRanUserDetails.reviewer_attributes = null;
    this.withRWF_SeqAndRanUserDetails.author_privileges = null;
    this.withRWF_SeqAndRanUserDetails.reviewer_privileges = null;
    this.withRWF_SeqAndRanUserDetails.is_mandatory = false;

    this.withRWF_SeqAndRanSettings.section_user_details.push(this.withRWF_SeqAndRanUserDetails);



    localStorage.setItem("_def_WithRWFS", JSON.stringify(this.withRWF_SeqAndRanSettings));



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


    this.addSectionDisableKey = false;


    this.reviewWorkFlowFlag = this.getItemService.sendReviewWrkFlwFlag();

    this.settings1 = {
      singleSelection: false,
      text: "Select Subject(s)",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "myclass custom-class-example"
    };

    this.settings2 = {
      singleSelection: false,
      text: "Select Topic(s)",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "subject",
      classes: "myclass custom-class-example"
    };

    if (this.authService.canActivate()) {
      this.cookieService.delete('_TEM');
      this.cookieService.delete('_TON');
      var headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http
        .get(credentials.accountHost + "/user_details", { headers: headers })
        .map(res => res.json())

        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          data => {

            var tempOrgMail;
            tempOrgMail = data.user_login_details.profile_email;
            if(tempOrgMail != '' && tempOrgMail != null) {
              this.cookieService.set( '_TEM', tempOrgMail );
            }

            var tempOrgName;
            tempOrgName = data.user_login_details.profile_organization_text;
            if(tempOrgName != '' && tempOrgName != null) {
              this.cookieService.set( '_TON', tempOrgName );
            }

            if (data != undefined) {
              for (
                var p = 0;
                p < data.user_login_details.available_organization.length;
                p++
              ) {
                if (
                  data.user_login_details.available_organization[p].org_id ==
                  this.cookieService.get("_PAOID")
                ) {
                  this.reviewWorkFlowFlag =
                    data.user_login_details.available_organization[
                      p
                    ].review_work_flow;
                }
              }
            }
          },
          error => {
            if (error.status == 404) {
              this.router.navigateByUrl("author/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              // window.location.href=credentials.authorUrl;
              window.location.href = credentials.authorUrl;
            } else {
              this.router.navigateByUrl("author/serverError");
            }
          }
        );
    }

    if (this.authService.canActivate()) {
          
      localStorage.removeItem('TZNM');
      localStorage.removeItem('TZNMVL');
      var headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http
        .get(
          credentials.host +
            "/get_metadatas/" +
            this.cookieService.get("_PAOID"),
          { headers: headers }
        )
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          data => {
                
        localStorage.setItem('TZNM' , data.timezone_name);
        localStorage.setItem('TZNMVL' , data.timezone_value);
            this.metaDataDetails = data;
            this.getItemService.getMetaDataDetails(data);
            this.subjectList = data.subjects;
            this.reviewer = data.reviewers;
            // if (!this.reviewWorkFlowFlag) {
            //   this.createItemSet.author = data.author;
            // } else {
            //   this.createItemSet.author = "";
            // }
            this.subLabelName = data.parameters.linked_attribute_1;
            this.topLabelName = data.parameters.linked_attribute_2;
          },
          error => {
            this.showLoad = false;

            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.authorUrl;
              // window.location.href=credentials.authorUrl;
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    }

    this.createItemSet.sections.push(new sections());
    this.createItemSet.no_of_sections = this.createItemSet.sections.length;
  }

  getTopic(selectedSub, i) {
    if (this.authService.canActivate()) {
      this.uniqueSubjects = [];
      // bind selected subjects with comma seperated in subject field
      for (var k = 0; k < this.createItemSet.sections.length; k++) {
        if (this.createItemSet.sections[k].subjects.length != 0) {
          for (
            var j = 0;
            j < this.createItemSet.sections[k].subjects.length;
            j++
          ) {
            if (
              !this.uniqueSubjects.includes(
                this.createItemSet.sections[k].subjects[j].itemName
              )
            ) {
              this.uniqueSubjects.push(
                this.createItemSet.sections[k].subjects[j].itemName
              );
            }
          }
        } else if (this.createItemSet.sections[k].subjects.length == 0) {
          for (var j = 0; j < selectedSub.length; j++) {
            if (!this.uniqueSubjects.includes(selectedSub[j].itemName)) {
              this.uniqueSubjects.push(selectedSub[j].itemName);
            }
          }
        }
      }

      this.createItemSet.subjects = this.uniqueSubjects
        .map(function(elem) {
          return elem;
        })
        .join(",");

      //get topics
      // if(selectedSub.length==0){
      this.createItemSet.sections[i].topicList = [];
      this.createItemSet.topics = "";
      // }
      var body = selectedSub;
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      return this.http
        .post(
          credentials.host + "/get_topics/" + this.cookieService.get("_PAOID"),
          body,
          { headers: headers }
        )
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })

        .subscribe(
          data => {
            this.createItemSet.sections[i].topicList = data;
          }
          // error => alert(error)
        );
    }
  }

  // bind selected topics with comma seperated in topic field
  bindTopic(selectedTopic) {
    this.uniqueTopics = [];
    for (var k = 0; k < this.createItemSet.sections.length; k++) {
      for (var j = 0; j < this.createItemSet.sections[k].topics.length; j++) {
        if (
          !this.uniqueTopics.includes(
            this.createItemSet.sections[k].topics[j].itemName
          )
        ) {
          this.uniqueTopics.push(
            this.createItemSet.sections[k].topics[j].itemName
          );
        }
        if (this.createItemSet.sections[k].topics.length == 0) {
          this.createItemSet.topics = "";
        }
      }
    }
    this.createItemSet.topics = this.uniqueTopics
      .map(function(elem) {
        return elem;
      })
      .join(",");
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

  calculateTime(time, index) {
    this.createItemSet.total_time = parseInt("00:00");

    var sectionTime = new Date(time);
    var year = sectionTime.getFullYear();

    if (year != 1970) {
      var convertedTime = time.toLocaleString("en-GB");

      var splitTime = convertedTime.split(",");
      var RemoveMerdian = splitTime[1].split(" ");

      var splitedTime = RemoveMerdian[1];

      this.createItemSet.sections[index].time = splitedTime;
      this.hours = "00";
      this.min = "00";
      // this.sec = "00";
      var calmin;
      // var calSec

      for (var i = 0; i < this.createItemSet.sections.length; i++) {
        if (
          this.createItemSet.sections[i].time != "" &&
          this.createItemSet.sections[i].time != null
        ) {
          var getTime = String(this.createItemSet.sections[i].time).split(":");

          // if(this.sec < 10){
          //   this.sec = 0+String(this.sec);
          // }
          if (this.min < 10) {
            this.min = 0 + String(this.min);
          }
          if (this.hours < 10) {
            this.hours = 0 + String(this.hours);
          }

          // if(getTime[2] == undefined){
          //   this.createItemSet.sections[i].time = getTime[0] + ':'+getTime[1] + ':'+ String('00');
          //   getTime[2] = String('00');
          // }
          if (getTime[1] == undefined) {
            this.createItemSet.sections[i].time =
              getTime[0] + ":" + String("00") + ":" + getTime[2];
            getTime[1] = String("00");
          }
          if (getTime[0] == undefined) {
            this.createItemSet.sections[i].time =
              String("00") + ":" + getTime[1] + ":" + getTime[2];
            getTime[0] = String("00");
          }

          this.hours = parseInt(getTime[0]) + parseInt(this.hours);
          this.min = parseInt(getTime[1]) + parseInt(this.min);
          // this.sec = parseInt(getTime[2]) + parseInt(this.sec);
        }
      }
      // if(this.sec > 60){
      //   calSec = Math.floor(this.sec/60);
      //   this.min = this.min+calSec;
      //   this.sec = this.sec % 60;

      // }
      if (this.min >= 60) {
        calmin = Math.floor(this.min / 60);

        this.hours = this.hours + calmin;
        this.min = this.min % 60;
      }
      // if(this.sec < 10){
      //   this.sec = 0+String(this.sec);
      // }
      if (this.min < 10) {
        this.min = 0 + String(this.min);
      }
      if (this.hours < 10) {
        this.hours = 0 + String(this.hours);
      }
      // if(isNaN(this.sec)){
      //   this.sec = String('00');
      // }
      if (isNaN(this.min)) {
        this.min = String("00");
      }
      if (isNaN(this.hours)) {
        this.hours = String("00");
      }

      // if(this.sec < 10){
      //   this.sec = Math.floor(this.sec);
      //   this.sec = 0+String(this.sec);
      // }
      if (this.min < 10) {
        this.min = Math.floor(this.min);
        this.min = 0 + String(this.min);
      }
      if (this.hours < 10) {
        this.hours = Math.floor(this.hours);
        this.hours = 0 + String(this.hours);
      }
      this.createItemSet.total_time = this.hours + ":" + this.min;
    }
  }
  calculateScore() {
    this.createItemSet.total_score = parseInt("0");
    var score = parseInt("0");
    // if(this.createItemSet.sections.length >= 2){
    for (var i = 0; i < this.createItemSet.sections.length; i++) {
      if (
        this.createItemSet.sections[i].score != "" &&
        this.createItemSet.sections[i].score != undefined
      ) {
        score = parseInt(this.createItemSet.sections[i].score) + score;
        if (isNaN(score)) {
          this.createItemSet.total_score = 0;
        } else {
          this.createItemSet.total_score = score;
        }
      }
    }
    // }
  }
  calculateItems() {
    this.createItemSet.no_of_items_count = parseInt("0");
    var noofItem = parseInt("0");

    for (var i = 0; i < this.createItemSet.sections.length; i++) {
      if (
        this.createItemSet.sections[i].no_of_items != "" &&
        this.createItemSet.sections[i].no_of_items != undefined
      ) {
        noofItem =
          parseInt(this.createItemSet.sections[i].no_of_items) + noofItem;
        if (isNaN(noofItem)) {
          this.createItemSet.no_of_items_count = 0;
        } else {
          this.createItemSet.no_of_items_count = noofItem;
        }
      }
    }
  }
  calculatePool() {
    this.createItemSet.no_of_items_in_pool_count = parseInt("0");
    var pool = parseInt("0");
    for (var i = 0; i < this.createItemSet.sections.length; i++) {
      if (
        this.createItemSet.sections[i].no_of_items_in_pool != "" &&
        this.createItemSet.sections[i].no_of_items_in_pool != undefined
      ) {
        pool =
          parseInt(this.createItemSet.sections[i].no_of_items_in_pool) + pool;
        if (isNaN(pool)) {
          this.createItemSet.no_of_items_in_pool_count = 0;
        } else {
          this.createItemSet.no_of_items_in_pool_count = pool;
        }
      }
    }
  }

  CalculateTimeAfterDelete() {
    this.hours = "00";
    this.min = "00";
    this.sec = "00";
    var calmin;
    var calSec;

    for (var i = 0; i < this.createItemSet.sections.length; i++) {
      if (
        this.createItemSet.sections[i].time != "" &&
        this.createItemSet.sections[i].time != null
      ) {
        var getTime = String(this.createItemSet.sections[i].time).split(":");

        if (this.sec < 10) {
          this.sec = 0 + String(this.sec);
        }
        if (this.min < 10) {
          this.min = 0 + String(this.min);
        }
        if (this.hours < 10) {
          this.hours = 0 + String(this.hours);
        }

        if (getTime[2] == undefined) {
          this.createItemSet.sections[i].time =
            getTime[0] + ":" + getTime[1] + ":" + String("00");
          getTime[2] = String("00");
        }
        if (getTime[1] == undefined) {
          this.createItemSet.sections[i].time =
            getTime[0] + ":" + String("00") + ":" + getTime[2];
          getTime[1] = String("00");
        }
        if (getTime[0] == undefined) {
          this.createItemSet.sections[i].time =
            String("00") + ":" + getTime[1] + ":" + getTime[2];
          getTime[0] = String("00");
        }

        this.hours = parseInt(getTime[0]) + parseInt(this.hours);
        this.min = parseInt(getTime[1]) + parseInt(this.min);
        this.sec = parseInt(getTime[2]) + parseInt(this.sec);
      }
    }
    if (this.sec > 60) {
      calSec = Math.floor(this.sec / 60);
      this.min = this.min + calSec;
      this.sec = this.sec % 60;
    }
    if (this.min >= 60) {
      calmin = Math.floor(this.min / 60);

      this.hours = this.hours + calmin;
      this.min = this.min % 60;
    }
    if (this.sec < 10) {
      this.sec = 0 + String(this.sec);
    }
    if (this.min < 10) {
      this.min = 0 + String(this.min);
    }
    if (this.hours < 10) {
      this.hours = 0 + String(this.hours);
    }
    if (isNaN(this.sec)) {
      this.sec = String("00");
    }
    if (isNaN(this.min)) {
      this.min = String("00");
    }
    if (isNaN(this.hours)) {
      this.hours = String("00");
    }

    if (this.sec < 10) {
      this.sec = Math.floor(this.sec);
      this.sec = 0 + String(this.sec);
    }
    if (this.min < 10) {
      this.min = Math.floor(this.min);
      this.min = 0 + String(this.min);
    }
    if (this.hours < 10) {
      this.hours = Math.floor(this.hours);
      this.hours = 0 + String(this.hours);
    }
    this.createItemSet.total_time = this.hours + ":" + this.min;
  }

  deleteSection(index) {
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
  onlyNumberKey(event) {
    return event.charCode == 8 || event.charCode == 0
      ? null
      : event.charCode >= 48 && event.charCode <= 57;
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  validation() {
    const pattern1 = /^[^\s].*/;
    var a = 0;
    var array = [];
    this.subErr = false;
    this.topErr = false;
    this.timeErr = false;
    this.valIndex = -1;
    this.totalTimeErr = false;
    if (
      this.createItemSet.itemset_name == "" ||
      this.createItemSet.itemset_name == undefined ||
      !pattern1.test(this.createItemSet.itemset_name)
    ) {
      this.itemsetname = true;
    } else {
      this.itemsetname = false;
    }

    if (
      this.createItemSet.keywords == "" ||
      this.createItemSet.keywords == undefined ||
      !pattern1.test(this.createItemSet.keywords)
    ) {
      this.keyval = true;
    } else {
      this.keyval = false;
    }
    if (
      this.createItemSet.description == "" ||
      this.createItemSet.description == undefined ||
      !pattern1.test(this.createItemSet.description)
    ) {
      this.descval = true;
    } else {
      this.descval = false;
    }

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
      } else {
        this.scoreErr = false;
        this.itemErr = false;
        this.itemPoolerr = false;
        this.rangeErr = false;
        this.timeErr = false;
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

    if (this.questionBankToggle == false) {
      // validation for total time - it should not be more than 5 hrs
      var totalTimeFormat = /^(?:0[0-4]|[00][0-4]):[0-5][0-9]$/; // total time must not be greater than 5 hrs, this regex validate upto 04:59 hrs so i manually validated for 05:00 hrs
      if (!totalTimeFormat.test(this.createItemSet.total_time)) {
        if (this.createItemSet.total_time != "05:00") {
          this.totalTimeErr = true;
        }
      } else {
        this.totalTimeErr = false;
      }
    }

    this.createItemSet.review_workflow = this.enableRWFToggle;
    this.createItemSet.question_bank = this.questionBankToggle;

    if (this.enableRWFToggle == false) {
      this.createItemSet.review_type = "";
      this.createItemSet.on_the_go_review = "";
      this.createItemSet.reviewers_edit_items = "";
      this.createItemSet.authors_view = "";
      this.createItemSet.default_item_status = "";
      this.createItemSet.previous_comments = "";
      this.createItemSet.level_of_review = "";
    } else if (this.enableRWFToggle == true) {
      this.createItemSet.review_type = this.reviewType;
      this.createItemSet.on_the_go_review = this.onTheGoReviewToggle;
      this.createItemSet.reviewers_edit_items = this.reviewerCanEditItemsToggle;
      this.createItemSet.authors_view = this.showItemsItemsetForAuthorToggle;
      this.createItemSet.default_item_status = this.defaultItemStatus;
      this.createItemSet.previous_comments = this.showPreCommentsToggle;
      if (this.reviewType == "Sequential") {
        this.createItemSet.level_of_review = this.levelOfReview;
        this.levelOfReviewArray = [];
        for(var lr=0;lr<this.levelOfReview;lr++){
          var curLl;
          curLl = lr+1;
          this.levelOfReviewArray.push(curLl);
        }

      } else if (this.reviewType == "Concurrent") {

        this.createItemSet.level_of_review = "";
      }
    }

    if (this.questionBankToggle == true) {
      this.createItemSet.total_time = "";
      this.createItemSet.total_score = "";
      this.createItemSet.no_of_items_count = "";
      this.createItemSet.no_of_items_in_pool_count = "";
    }
  }

  enableQuesBankToggle(val) {
    this.questionBankToggle = !val;

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

  create_Item_Set() {

    if (this.authService.canActivate()) {
      this.validation();
      if (
        this.itemsetname == false &&
        this.Sectionauthorval == false &&
        this.SectionreviewerVal == false &&
        this.keyval == false &&
        this.descval == false &&
        this.secName == false &&
        this.subErr == false &&
        this.topErr == false &&
        this.scoreErr == false &&
        this.itemErr == false &&
        this.itemPoolerr == false &&
        this.rangeErr == false &&
        this.timeErr == false &&
        this.totalTimeErr == false
      ) {

        // this.showLoad = true;
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

        if(validateAllSections == false) {
          for (var i = 0; i < this.createItemSet.sections.length; i++) {
            delete this.createItemSet.sections[i].topicList;
          }
          this.createItemSet.org_id = this.cookieService.get("_PAOID");

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

          var headers = new Headers();
          headers.append("Content-Type", "application/json");
          headers.append(
            "Authorization",
            "Bearer " + this.cookieService.get("_PTBA")
          );
          return this.http
            .post(credentials.host + "/create_itemsets", body, {
              headers: headers
            })
            .map(res => res.json())
            .catch((e: any) => {
              return Observable.throw(e);
            })

            .subscribe(
              data => {
                if (data.success == true) {
                  this.showLoad = false;
                  this._notifications.create("", data.message, "info");
                  // this.saveMsg = true;
                  // this.showMsg = data.message;
                  // if(this.reviewWorkFlowFlag == false){
                  setTimeout(() => {
                    this.saveMsg = false;
                    this.router.navigate(["ItemSets/viewitemsets",0,0,0]);
                  }, 3000);
                  // }
                } else if (data.success == false) {
                  this.showLoad = false;
                  this._notifications.create("", data.message, "error");
                  // this.saveMsg = true;
                  // this.showMsg = data.message;
                  setTimeout(() => {
                    this.saveMsg = false;
                  }, 3000);
                }
              },
              error => {
                this.showLoad = false;
                if (error.status == 404) {
                  this.router.navigateByUrl("pages/NotFound");
                } else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href =
                    credentials.authorUrl;
                  // window.location.href=credentials.authorUrl;
                } else {
                  this.router.navigateByUrl("pages/serverError");
                }
              }
            );

        }else{
          if(this.enableRWFToggle == true){
            this._notifications.create("", 'You should add Author(s) and Reviewer(s) for all section(s).', "error");
          }else{
            this._notifications.create("", 'You should add Author(s) for all section(s).', "error");
          }
        }


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
      Object.assign({}, { class: " modal-sm" }, this.config)
    );
  }

  showRWFPopup(template: TemplateRef<any>, status) {
    if(status === true) {
    this.showToggleAlert = true;
    }
    else if(status === false) {
    this.showToggleAlert = false;
    }
    this.modalRef = this.modalService.show(
    template,
    Object.assign({}, { class: " modal-sm" }, this.config)
    );
  }

  showSettings(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: " modal-lg _setWidth" }, this.config)
    );
  }

  showUserRolePopup(ind, template: TemplateRef<any>,status){

    if(status === false || status === true){
      this.uncheckSameAsPrevious = false;
    }

    this.allErrorsInWRWF = [];
    this.currentSectionIndex = ind;

    var ARSeq;
    ARSeq = false;


    if (this.questionBankToggle == false) {
      if (
        this.createItemSet.sections[ind].section_name == "" ||
        this.createItemSet.sections[ind].subjects.length == 0 ||
        this.createItemSet.sections[ind].topics.length == 0 ||
        this.createItemSet.sections[ind].time == "" ||
        this.createItemSet.sections[ind].score == "" ||
        this.createItemSet.sections[ind].no_of_items == "" ||
        this.createItemSet.sections[ind].no_of_items_in_pool == ""
      ) {
        this.addSectionDisableKey = true;
        this._notifications.create(
          "",
          "Please fill the previous section(s) data to create the new section.",
          "error"
        );
        this.validationSections();
        ARSeq = true;
      }
    } else {
      if (
        this.createItemSet.sections[ind].section_name == "" ||
        this.createItemSet.sections[ind].subjects.length == 0 ||
        this.createItemSet.sections[ind].topics.length == 0
      ) {
        this.addSectionDisableKey = true;
        this._notifications.create(
          "",
          "Please fill the previous section(s) data to create the new section.",
          "error"
        );
        this.validationSections();
        ARSeq = true;
      }
    }

    if (ARSeq == false) {
      var getCurPopDet;
      getCurPopDet = JSON.parse(localStorage.getItem("_" + ind + 1 + "Save"));

      if (getCurPopDet != undefined) {
        this.withRWF_SeqAndRanSettings = getCurPopDet;
      } else {
        this.withRWF_SeqAndRanSettings = JSON.parse(localStorage.getItem("_def_WithRWFS"));
        this.withRWF_SeqAndRanSettings.section_name = this.createItemSet.sections[ind].section_name;

        localStorage.setItem(
          "_" + ind + 1 + "Save",
          JSON.stringify(this.withRWF_SeqAndRanSettings)
        );
      }



      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: " modal-lg _rwfSeqRan" }, this.config)
      );
    }


  }

  showAddAuthorsReviewersRan(ind, template: TemplateRef<any>) {
    this.currentSectionIndex = ind;
    var ARSeq;
    ARSeq = false;


    if (this.questionBankToggle == false) {
      if (
        this.createItemSet.sections[ind].section_name == "" ||
        this.createItemSet.sections[ind].subjects.length == 0 ||
        this.createItemSet.sections[ind].topics.length == 0 ||
        this.createItemSet.sections[ind].time == "" ||
        this.createItemSet.sections[ind].score == "" ||
        this.createItemSet.sections[ind].no_of_items == "" ||
        this.createItemSet.sections[ind].no_of_items_in_pool == ""
      ) {
        this.addSectionDisableKey = true;
        this._notifications.create(
          "",
          "Please fill the previous section(s) data to create the new section.",
          "error"
        );
        this.validationSections();
        ARSeq = true;
      }
    } else {
      if (
        this.createItemSet.sections[ind].section_name == "" ||
        this.createItemSet.sections[ind].subjects.length == 0 ||
        this.createItemSet.sections[ind].topics.length == 0
      ) {
        this.addSectionDisableKey = true;
        this._notifications.create(
          "",
          "Please fill the previous section(s) data to create the new section.",
          "error"
        );
        this.validationSections();
        ARSeq = true;
      }
    }

    if (ARSeq == false) {
      var getCurPopDet;
      getCurPopDet = JSON.parse(localStorage.getItem("_" + ind + 1 + "Save"));

      if (getCurPopDet != undefined) {
        this.rwfSettingsRequest = getCurPopDet;
      } else {
        this.rwfSettingsRequest = JSON.parse(localStorage.getItem("_def_WithRWFS"));

        localStorage.setItem(
          "_" + ind + 1 + "Save",
          JSON.stringify(this.rwfSettingsRequest)
        );
      }

      for (var j = 0; j < this.rwfSettingsRequest.section_details.length; j++) {
        this.rwfSettingsRequest.section_details[
          j
        ].section_name = this.createItemSet.sections[ind].section_name;
      }

      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: " modal-lg _addAR" }, this.config)
      );
    }

    setTimeout(() => {
      if (this.addSectionDisableKey == true) {
        this.addSectionDisableKey = false;
      }
    }, 3000);

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



// END ***************************************

      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: " modal-lg" }, this.config)
      );
    }
  }

  chooseWOAuthorPre(val){

  }

  showAddAuthorsReviewersSeq(ind, template: TemplateRef<any>) {
    this.currentSectionIndex = ind;
    var ARRan;
    ARRan = false;


    if (this.questionBankToggle == false) {
      if (
        this.createItemSet.sections[ind].section_name == "" ||
        this.createItemSet.sections[ind].subjects.length == 0 ||
        this.createItemSet.sections[ind].topics.length == 0 ||
        this.createItemSet.sections[ind].time == "" ||
        this.createItemSet.sections[ind].score == "" ||
        this.createItemSet.sections[ind].no_of_items == "" ||
        this.createItemSet.sections[ind].no_of_items_in_pool == ""
      ) {
        this.addSectionDisableKey = true;
        this._notifications.create(
          "",
          "Please fill the previous section(s) data to create the new section.",
          "error"
        );
        this.validationSections();
        ARRan = true;
      }
    } else {
      if (
        this.createItemSet.sections[ind].section_name == "" ||
        this.createItemSet.sections[ind].subjects.length == 0 ||
        this.createItemSet.sections[ind].topics.length == 0
      ) {
        this.addSectionDisableKey = true;
        this._notifications.create(
          "",
          "Please fill the previous section(s) data to create the new section.",
          "error"
        );
        this.validationSections();
        ARRan = true;
      }
    }

    if (ARRan == false) {
      var getCurPopDet;
      getCurPopDet = JSON.parse(localStorage.getItem("_" + ind + 1 + "Save"));

      if (getCurPopDet != undefined) {
        this.rwfSettingsRequest = getCurPopDet;
      } else {
        this.rwfSettingsRequest = JSON.parse(localStorage.getItem("_def_WithRWFS"));

        localStorage.setItem(
          "_" + ind + 1 + "Save",
          JSON.stringify(this.rwfSettingsRequest)
        );
      }

      for (var j = 0; j < this.rwfSettingsRequest.section_details.length; j++) {
        this.rwfSettingsRequest.section_details[
          j
        ].section_name = this.createItemSet.sections[ind].section_name;
      }

      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: " modal-lg _addAR" }, this.config)
      );
    }

    setTimeout(() => {
      if (this.addSectionDisableKey == true) {
        this.addSectionDisableKey = false;
      }
    }, 3000);

  }

  // bind selected author with comma seperated

  bindAuthor() {
    // var getAuthor = [];
    // for (var k = 0; k < this.createItemSet.sections.length; k++) {
    //   getAuthor.push(this.createItemSet.sections[k].author);
    // }
    // this.createItemSet.author = getAuthor
    //   .map(function(elem) {
    //     return elem;
    //   })
    //   .join(",");
  }

  // bind selected reviewer with comma seperated

  bindReviewer() {
    // var getReviewer = [];
    // for (var k = 0; k < this.createItemSet.sections.length; k++) {
    //   getReviewer.push(this.createItemSet.sections[k].reviewer);
    // }
    // this.createItemSet.reviewer = getReviewer
    //   .map(function(elem) {
    //     return elem;
    //   })
    //   .join(",");
  }

  setRWFSettings(Identity, Values) {
    if (Identity == 1) {
      this.reviewType = Values;
    } else if (Identity == 21) {
      this.levelOfReview = Values;
      // this.noOfReviewers = 1;
    } else if (Identity == 3) {
      if (this.onTheGoReviewToggle == true) {
        this.onTheGoReviewToggle = false;
      } else {
        this.onTheGoReviewToggle = true;
      }
    } else if (Identity == 4) {
      if (this.reviewerCanEditItemsToggle == true) {
        this.reviewerCanEditItemsToggle = false;
      } else {
        this.reviewerCanEditItemsToggle = true;
      }
    } else if (Identity == 5) {
      if (this.showPreCommentsToggle == true) {
        this.showPreCommentsToggle = false;
      } else {
        this.showPreCommentsToggle = true;
      }
    } else if (Identity == 6) {
      if (this.showItemsItemsetForAuthorToggle == true) {
        this.showItemsItemsetForAuthorToggle = false;
      } else {
        this.showItemsItemsetForAuthorToggle = true;
      }
    } else if (Identity == 7) {
      this.defaultItemStatus = Values;
    }
  }

  resetRWFSettings() {

    // localStorage.removeItem("_def_WithRWFS");
    // localStorage.removeItem("_01Save");
    // localStorage.removeItem("_11Save");
    // localStorage.removeItem("_21Save");
    // localStorage.removeItem("_31Save");
    // localStorage.removeItem("_41Save");
    // localStorage.removeItem("_51Save");
    // localStorage.removeItem("_61Save");
    // localStorage.removeItem("_71Save");
    // localStorage.removeItem("_81Save");
    // localStorage.removeItem("_91Save");

    this.reviewType = "Sequential";
    this.levelOfReview = 2;
    this.levelOfReviewArray = [];
    for(var lr=0;lr<this.levelOfReview;lr++){
      var curLl;
      curLl = lr+1;
      this.levelOfReviewArray.push(curLl);
    }
    this.noOfReviewers = 1;
    this.onTheGoReviewToggle = false;
    this.reviewerCanEditItemsToggle = false;
    this.showPreCommentsToggle = true;
    this.showItemsItemsetForAuthorToggle = true;
    this.defaultItemStatus = "Approved";

    // this.tempReviewType = "Sequential";
    // this.tempLevelOfReview = 1;
    // this.tempNoOfReviewers = 1;
    // this.tempOnTheGoReviewToggle = false;
    // this.tempReviewerCanEditItemsToggle = false;
    // this.tempshowPreCommentsToggle = true;
    // this.tempShowItemsItemsetForAuthorToggle = true;
    // this.tempDefaultItemStatus = "Approved";
    // this.tempMultipleAuthorPerSectionToggle = false;

    // this.withRWF_SeqAndRanSettings = new WithRWF_SeqAndRanSettings();
    // this.withRWF_SeqAndRanUserDetails = new WithRWF_SeqAndRanUserDetails();

    // this.withRWF_SeqAndRanSettings.section_name = "";
    // this.withRWF_SeqAndRanSettings.validation_process = false;
    // this.withRWF_SeqAndRanSettings.review_type = this.tempReviewType;
    // this.withRWF_SeqAndRanSettings.section_user_details = [];

    // this.withRWF_SeqAndRanUserDetails.name_or_email = "";
    // this.withRWF_SeqAndRanUserDetails.user_role = null;
    // this.withRWF_SeqAndRanUserDetails.key_authority = null;
    // this.withRWF_SeqAndRanUserDetails.level = null;
    // this.withRWF_SeqAndRanUserDetails.author_attributes = null;
    // this.withRWF_SeqAndRanUserDetails.reviewer_attributes = null;
    // this.withRWF_SeqAndRanUserDetails.author_privileges = null;
    // this.withRWF_SeqAndRanUserDetails.reviewer_privileges = null;
    // this.withRWF_SeqAndRanUserDetails.is_mandatory = false;

    // this.withRWF_SeqAndRanSettings.section_user_details.push(this.withRWF_SeqAndRanUserDetails);



    // localStorage.setItem("_def_WithRWFS", JSON.stringify(this.withRWF_SeqAndRanSettings));

    // this.modalRef.hide();

  }

  saveRWFSettings(templateSeq: TemplateRef<any>,templateRan: TemplateRef<any>) {
    var checkReviewTypeChanges;
    checkReviewTypeChanges = false;
    var checkNoofRev;
    var checkLevelRev;
    checkNoofRev = false;
    checkLevelRev = false;
    if(this.tempReviewType != this.reviewType){
      checkReviewTypeChanges = true;
    }

    if(this.tempLevelOfReview != this.levelOfReview){
      checkLevelRev = true;
    }

    if(this.tempNoOfReviewers != this.noOfReviewers){
      checkNoofRev = true;
    }

    this.tempReviewType = this.reviewType;
    this.tempLevelOfReview = this.levelOfReview;
    this.tempNoOfReviewers = this.noOfReviewers;
    this.tempOnTheGoReviewToggle = this.onTheGoReviewToggle;
    this.tempReviewerCanEditItemsToggle = this.reviewerCanEditItemsToggle;
    this.tempshowPreCommentsToggle = this.showPreCommentsToggle;
    this.tempShowItemsItemsetForAuthorToggle = this.showItemsItemsetForAuthorToggle;
    this.tempDefaultItemStatus = this.defaultItemStatus;
    this.modalRef.hide();




    var someKey;
    someKey = false;
    if(this.levelOfReviewArray.length != this.levelOfReview){
      for (var u = 0;u < this.createItemSet.sections.length;u++) {
        var pushRWFSecDet;
        pushRWFSecDet = JSON.parse(localStorage.getItem("_" + u + 1 + "Save"));

        if(pushRWFSecDet != undefined && pushRWFSecDet != null) {
          for(var z=0;z<pushRWFSecDet.section_user_details.length;z++){
            pushRWFSecDet.section_user_details[z].level = null;
            if(pushRWFSecDet.section_user_details[z].user_role == "Reviewer"){
              pushRWFSecDet.section_user_details[z].key_authority = null;
            }
            // pushRWFSecDet.section_user_details[z].key_authority = null;
          }

          someKey = true;
          localStorage.setItem("_" + u + 1 + "Save",JSON.stringify(pushRWFSecDet));
        }
      }
    }

    // Change the review type in localstorage while changing it.
    if(checkReviewTypeChanges == true){

      var changeRTDef;
      changeRTDef = JSON.parse(localStorage.getItem("_def_WithRWFS"));

      if(changeRTDef != undefined && changeRTDef != null) {
        changeRTDef.review_type = this.reviewType;
        localStorage.setItem("_def_WithRWFS",JSON.stringify(changeRTDef));
      }

      for (var u = 0;u < this.createItemSet.sections.length;u++) {
        var changeRT;
        changeRT = JSON.parse(localStorage.getItem("_" + u + 1 + "Save"));

        if(changeRT != undefined && changeRT != null) {

          changeRT.review_type = this.reviewType;

          localStorage.setItem("_" + u + 1 + "Save",JSON.stringify(changeRT));
        }
      }
    }

    this.levelOfReviewArray = [];
    for(var lr=0;lr<this.levelOfReview;lr++){
      var curLl;
      curLl = lr+1;
      this.levelOfReviewArray.push(curLl);
    }



    // if(this.reviewType == 'Sequential'){
    //   if(checkLevelRev == true){

    //     for (var u = 0;u < this.createItemSet.sections.length;u++) {
    //       var changeRT;
    //       changeRT = JSON.parse(localStorage.getItem("_" + u + 1 + "Save"));

    //       if(changeRT != undefined && changeRT != null) {
    //         this.modalRef = this.modalService.show(
    //           templateSeq,
    //           Object.assign({}, { class: " modal-lg _addAR" }, this.config)
    //         );
    //         break;
    //       }
    //     }



    //   }
    // }else if(this.reviewType == 'Concurrent'){
    //   if(checkNoofRev == true){

    //     for (var u = 0;u < this.createItemSet.sections.length;u++) {
    //       var changeRT;
    //       changeRT = JSON.parse(localStorage.getItem("_" + u + 1 + "Save"));

    //       if(changeRT != undefined && changeRT != null) {
    //         this.modalRef = this.modalService.show(
    //           templateRan,
    //           Object.assign({}, { class: " modal-lg _addAR" }, this.config)
    //         );
    //         break;
    //       }
    //     }



    //     // for(var t=0;t<this.createItemSet.sections.length;t++){
    //     //   var tempRevArr;
    //     //   tempRevArr = [];

    //     //   var curStrc;
    //     //   curStrc = JSON.parse(localStorage.getItem("_" + t + 1 + "Save"));

    //     //   if(curStrc != undefined && curStrc != null){
    //     //     var tempCount;
    //     //     tempCount = 0;
    //     //     for(var f=0;f<curStrc.section_user_details.length;f++){
    //     //       if(curStrc.section_user_details[f].user_role == "Author"){
    //     //         tempRevArr.push(curStrc.section_user_details[f]);
    //     //       }else if(curStrc.section_user_details[f].user_role == "Reviewer"){
    //     //         tempCount++;
    //     //         if(tempCount <= this.noOfReviewers){
    //     //           tempRevArr.push(curStrc.section_user_details[f]);
    //     //         }
    //     //       }
    //     //     }
    //     //     curStrc.section_user_details = tempRevArr;
    //     //     localStorage.setItem("_" + t + 1 + "Save",JSON.stringify(curStrc));
    //     //   }
    //     // }
    //   }
    // }

  }

  cancelRWFSettings() {
    this.modalRef.hide();
    this.reviewType = this.tempReviewType;
    this.levelOfReview = this.tempLevelOfReview;
    this.levelOfReviewArray = [];
    for(var lr=0;lr<this.levelOfReview;lr++){
      var curLl;
      curLl = lr+1;
      this.levelOfReviewArray.push(curLl);
    }
    this.noOfReviewers = this.tempNoOfReviewers;
    this.onTheGoReviewToggle = this.tempOnTheGoReviewToggle;
    this.reviewerCanEditItemsToggle = this.tempReviewerCanEditItemsToggle;
    this.showPreCommentsToggle = this.tempshowPreCommentsToggle;
    this.showItemsItemsetForAuthorToggle = this.tempShowItemsItemsetForAuthorToggle;
    this.defaultItemStatus = this.tempDefaultItemStatus;
  }

  saveRWFAddAuthorReviewers() {
    this.allErrorsInWRWF = [];
    this.wRWF_Val_Username = false;
    this.wRWF_Val_UserRole = false;
    this.wRWF_Val_Attributes = false;
    this.wRWF_Val_Privileges = false;
    this.wRWF_Val_LevelCheck = false;




    for(var t=0;t<this.withRWF_SeqAndRanSettings.section_user_details.length;t++){
      if(this.withRWF_SeqAndRanSettings.section_user_details[t].name_or_email == ''){
        this.wRWF_Val_Username = true;
      }
      if(this.withRWF_SeqAndRanSettings.section_user_details[t].user_role == null){
        this.wRWF_Val_UserRole = true;
      }

      if(this.withRWF_SeqAndRanSettings.section_user_details[t].user_role != null){
        if(this.withRWF_SeqAndRanSettings.section_user_details[t].user_role == 'Author') {
          if(this.withRWF_SeqAndRanSettings.section_user_details[t].author_attributes == null){
            this.wRWF_Val_Attributes = true;
          }
          if(this.withRWF_SeqAndRanSettings.section_user_details[t].author_privileges == null){
            this.wRWF_Val_Privileges = true;
          }
        }else if(this.withRWF_SeqAndRanSettings.section_user_details[t].user_role == 'Reviewer') {
          if(this.withRWF_SeqAndRanSettings.section_user_details[t].reviewer_attributes == null){
            this.wRWF_Val_Attributes = true;
          }
          if(this.withRWF_SeqAndRanSettings.section_user_details[t].reviewer_privileges == null){
            this.wRWF_Val_Privileges = true;
          }
          if(this.reviewType == 'Sequential') {
            if(this.withRWF_SeqAndRanSettings.section_user_details[t].level == null){
              this.wRWF_Val_LevelCheck = true;
            }
          }
        }
      }
    }

    if(this.wRWF_Val_Username == false && this.wRWF_Val_UserRole == false && this.wRWF_Val_Attributes == false && this.wRWF_Val_Privileges == false){

      var tempSplitAuthor;
      var tempSplitReviewer;

      tempSplitAuthor = [];
      tempSplitReviewer = [];

      for(var o=0;o<this.withRWF_SeqAndRanSettings.section_user_details.length;o++){
        if(this.withRWF_SeqAndRanSettings.section_user_details[o].user_role == 'Author'){
          tempSplitAuthor.push(this.withRWF_SeqAndRanSettings.section_user_details[o]);
        }else if(this.withRWF_SeqAndRanSettings.section_user_details[o].user_role == 'Reviewer'){
          tempSplitReviewer.push(this.withRWF_SeqAndRanSettings.section_user_details[o]);
        }
      }

      // Complete Author Validations
      if(tempSplitAuthor.length != 0){
        var primaryCheck;
        primaryCheck = false;
        for(var t=0;t<tempSplitAuthor.length;t++){
          if(tempSplitAuthor[t].key_authority == 'Primary'){
            primaryCheck = true;
          }
        }

        if(primaryCheck == false) {
          this.allErrorsInWRWF.push('Atleast one primary author should be need');
        }
      }else{
        this.allErrorsInWRWF.push('Atleast one primary author should be need');
      }

      // Complete Reviewer Validations
      if(tempSplitReviewer.length != 0){

        if (this.reviewType == "Sequential") {
          // Level Validations Start
            var defLevelsArry;
            var curLevelsArr;
            var notUsedArr;
            notUsedArr = [];
            defLevelsArry = [];
            curLevelsArr = [];
            for(var q=0;q<this.levelOfReview;q++){
              defLevelsArry.push(q+1);
            }

            for(var w=0;w<tempSplitReviewer.length;w++){
              if(tempSplitReviewer[w].level != null){
                curLevelsArr.push(tempSplitReviewer[w].level);
              }
            }

            var uniqueItems = Array.from(new Set(curLevelsArr));
            curLevelsArr = uniqueItems;

            var tempConverter;
            tempConverter = [];
            for(var h=0;h<curLevelsArr.length;h++){
              tempConverter.push(parseInt(curLevelsArr[h]));
            }

            curLevelsArr = tempConverter;

            for(var m=0;m<defLevelsArry.length;m++){
              if(!curLevelsArr.includes(defLevelsArry[m])){
                notUsedArr.push(defLevelsArry[m]);
              }
            }


            if(notUsedArr.length != 0){
              var AB = notUsedArr.toString();
              this.allErrorsInWRWF.push('Please add the reviewer(s) for level(s) '+ AB + '.');
            }
          // Level Validations End



          // Final Reviewer Validations Start
            var defLevelsArry;
            var curLevelsArr;
            var notUsedArr;
            notUsedArr = [];
            defLevelsArry = [];
            curLevelsArr = [];
            for(var q=0;q<this.levelOfReview;q++){
              defLevelsArry.push(q+1);
            }
            for(var w=0;w<tempSplitReviewer.length;w++){
              if(tempSplitReviewer[w].level != null){
                curLevelsArr.push(tempSplitReviewer[w].level);
              }
            }
            var uniqueItems = Array.from(new Set(curLevelsArr));
            curLevelsArr = uniqueItems;
            var tempConverter;
            tempConverter = [];
            for(var h=0;h<curLevelsArr.length;h++){
              tempConverter.push(parseInt(curLevelsArr[h]));
            }
            curLevelsArr = tempConverter;


            var tempStoreFinalValuesArr;
            tempStoreFinalValuesArr = [];

            for(var l=0;l<tempSplitReviewer.length;l++){
              if(tempSplitReviewer[l].key_authority != null){
                tempStoreFinalValuesArr.push(tempSplitReviewer[l].level);
              }
            }

            var uniqueItems1 = Array.from(new Set(tempStoreFinalValuesArr));
            tempStoreFinalValuesArr = uniqueItems1;
            var tempConverter1;
            tempConverter1 = [];
            for(var h=0;h<tempStoreFinalValuesArr.length;h++){
              tempConverter1.push(parseInt(tempStoreFinalValuesArr[h]));
            }
            tempStoreFinalValuesArr = tempConverter1;

            if(curLevelsArr.length != tempStoreFinalValuesArr.length){
              this.allErrorsInWRWF.push('You must give the final reviewer access to atleast one reviewer per level.');
            }

          // Final Reviewer Validations End

          // Mandatory Validations Start
            var defLevelsArry;
            var curLevelsArr;
            var notUsedArr;
            notUsedArr = [];
            defLevelsArry = [];
            curLevelsArr = [];
            for(var q=0;q<this.levelOfReview;q++){
              defLevelsArry.push(q+1);
            }
            for(var w=0;w<tempSplitReviewer.length;w++){
              if(tempSplitReviewer[w].level != null){
                curLevelsArr.push(tempSplitReviewer[w].level);
              }
            }
            var uniqueItems = Array.from(new Set(curLevelsArr));
            curLevelsArr = uniqueItems;
            var tempConverter;
            tempConverter = [];
            for(var h=0;h<curLevelsArr.length;h++){
              tempConverter.push(parseInt(curLevelsArr[h]));
            }
            curLevelsArr = tempConverter;


            var tempStoreFinalValuesArr;
            tempStoreFinalValuesArr = [];

            for(var l=0;l<tempSplitReviewer.length;l++){
              if(tempSplitReviewer[l].is_mandatory != false){
                tempStoreFinalValuesArr.push(tempSplitReviewer[l].level);
              }
            }

            var uniqueItems1 = Array.from(new Set(tempStoreFinalValuesArr));
            tempStoreFinalValuesArr = uniqueItems1;
            var tempConverter1;
            tempConverter1 = [];
            for(var h=0;h<tempStoreFinalValuesArr.length;h++){
              tempConverter1.push(parseInt(tempStoreFinalValuesArr[h]));
            }
            tempStoreFinalValuesArr = tempConverter1;

            if(curLevelsArr.length != tempStoreFinalValuesArr.length){
              this.allErrorsInWRWF.push('You must give the mandatory user to atleast one reviewer per level.');
            }
          // Mandatory Validations End

          // Check Final Review Has Edit Attributes and Reject Previlages Access Start.
          if(tempSplitReviewer.length != 0) {

            for(var u=0;u<curLevelsArr.length;u++){
              for(var y=0;y<tempSplitReviewer.length;y++){
                if(curLevelsArr[u] == tempSplitReviewer[y].level){
                  if(tempSplitReviewer[y].key_authority == 'Final') {
                    if(tempSplitReviewer[y].reviewer_attributes != 'Assign'){
                      this.allErrorsInWRWF.push('Level ' + curLevelsArr[u] + ' Final reviewer should be need Write access');
                    }
                    if(tempSplitReviewer[y].reviewer_privileges != 'Reject'){
                      this.allErrorsInWRWF.push('Level ' + curLevelsArr[u] + ' Final reviewer should be need Reject access');
                    }
                  }
                }
              }
            }


          }
          // Check Final Review Has Edit Attributes and Reject Previlages Access End.
        }else if(this.reviewType == "Concurrent"){
          // Final Reviewer Validation Start
          var checkFinalRevKey;
          checkFinalRevKey = false;

          for(var l=0;l<tempSplitReviewer.length;l++){
            if(tempSplitReviewer[l].key_authority == 'Final'){
              checkFinalRevKey = true;
            }
          }

          if(checkFinalRevKey == false){
            this.allErrorsInWRWF.push('You must add one final reviewer per section.');
          }
          // Final Reviewer Validation End

          // Mandatory Validation Start
          var checkManRevKey;
          checkManRevKey = false;

          for(var l=0;l<tempSplitReviewer.length;l++){
            if(tempSplitReviewer[l].is_mandatory == true){
              checkManRevKey = true;
            }
          }

          if(checkManRevKey == false){
            this.allErrorsInWRWF.push('You must add one mandatory reviewer per section.');
          }
          // Mandatory Validation End

          // Check Final Review Has Edit Attributes and Reject Previlages Access Start.
          if(tempSplitReviewer.length != 0) {
            for(var y=0;y<tempSplitReviewer.length;y++){
              if(tempSplitReviewer[y].key_authority == 'Final') {
                if(tempSplitReviewer[y].reviewer_attributes != 'Assign'){
                  this.allErrorsInWRWF.push('Final reviewer should be need Write access');
                }
                if(tempSplitReviewer[y].reviewer_privileges != 'Reject'){
                  this.allErrorsInWRWF.push('Final reviewer should be need Reject access');
                }
              }
            }
          }
          // Check Final Review Has Edit Attributes and Reject Previlages Access End.
        }
      }else{
        this.allErrorsInWRWF.push('You must add one reviewer per section.');
      }

      // Validate If Any Author Having Attributes Assign Access.
      if(tempSplitAuthor.length != 0 && tempSplitReviewer.length != 0) {
        var checkAuthorAssign
        checkAuthorAssign = false;
        for(var j=0;j<tempSplitAuthor.length;j++){
          if(tempSplitAuthor[j].author_attributes == "Assign") {
            checkAuthorAssign = true;
          }
        }

        if(checkAuthorAssign == false) {

          var checkReviewAssign
          checkReviewAssign = false;
          for(var j=0;j<tempSplitReviewer.length;j++){
            if(tempSplitReviewer[j].reviewer_attributes == "Assign") {
              checkReviewAssign = true;
            }
          }

          if(checkReviewAssign == false){
            this.allErrorsInWRWF.push('You must give the Write access for attributes section to atleast one author or reviewer.');
          }
        }

      }

      // Check Author Mail Unique
      if(tempSplitAuthor.length != 0 && tempSplitReviewer.length != 0) {
        var curAuthRevMails;
        curAuthRevMails = [];
        for(var aa=0;aa<tempSplitAuthor.length;aa++){
          curAuthRevMails.push(tempSplitAuthor[aa].name_or_email);
        }

        for(var ab=0;ab<tempSplitReviewer.length;ab++){
          curAuthRevMails.push(tempSplitReviewer[ab].name_or_email);
        }

        var uniqueAuthEmails = Array.from(new Set(curAuthRevMails));

        if(uniqueAuthEmails.length != curAuthRevMails.length) {
          this.allErrorsInWRWF.push('Please provide a unique email ID.');
        }
      }

      // Email ID's Validations
      if(this.withRWF_SeqAndRanSettings.section_user_details.length != 0){
        for(var em=0;em<this.withRWF_SeqAndRanSettings.section_user_details.length;em++){
          if(this.withRWF_SeqAndRanSettings.section_user_details[em].name_or_email != ''){
            var checkedEm = EmailValidator.validate(this.withRWF_SeqAndRanSettings.section_user_details[em].name_or_email);

            if(checkedEm == false){
              this.allErrorsInWRWF.push('Please enter a valid email ID.');
              break;
            }
          }
        }
      }

      if(this.allErrorsInWRWF.length == 0) {
        this.withRWF_SeqAndRanSettings.validation_process = true;
        this.createItemSet.sections[this.currentSectionIndex].check_validations = false;
        localStorage.setItem("_" + this.currentSectionIndex + 1 + "Save",JSON.stringify(this.withRWF_SeqAndRanSettings));
          setTimeout(() => {
            this.modalRef.hide();
          }, 300);
      }else{
        this.withRWF_SeqAndRanSettings.validation_process = false;
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

  togglePrimary(authInd) {
    for (var i = 0; i < this.rwfSettingsRequest.section_details.length; i++) {
      for (
        var j = 0;
        j < this.rwfSettingsRequest.section_details[i].authors.length;
        j++
      ) {
        if (j == authInd) {
          this.rwfSettingsRequest.section_details[i].authors[j].primary = !this
            .rwfSettingsRequest.section_details[i].authors[j].primary;
        } else {
          this.rwfSettingsRequest.section_details[i].authors[j].primary = false;
        }
      }
    }

  }

  toggleAddAttributes(authInd) {
    for (var i = 0; i < this.rwfSettingsRequest.section_details.length; i++) {
      for (
        var j = 0;
        j < this.rwfSettingsRequest.section_details[i].authors.length;
        j++
      ) {
        if (j == authInd) {
          this.rwfSettingsRequest.section_details[i].authors[
            j
          ].add_attribute = !this.rwfSettingsRequest.section_details[i].authors[
            j
          ].add_attribute;
        }
        // else{
        //   this.rwfSettingsRequest.section_details[i].authors[j].add_attribute = false;
        // }
      }
    }

  }

  toggleComment(val) {
    val.can_comment = !val.can_comment;
  }

  toggleEdit(val) {
    val.can_edit = !val.can_edit;
  }

  toggleReject(val) {
    val.can_reject = !val.can_reject;
  }

  toggleMandatory(val) {
    val.is_mandatory = !val.is_mandatory;
  }

  toggleViewAttributes(val) {
    val.view_attribute = !val.view_attribute;
  }

  toggleEditAttributes(val) {
    val.edit_attribute = !val.edit_attribute;
  }

  toggleFinalAttributes(val, getIndex) {



    // val.final_reviewer = !val.final_reviewer;

    for (var i = 0; i < val.length; i++) {
      if (i == getIndex) {
        val[i].final_reviewer = !val[i].final_reviewer;
      } else {
        val[i].final_reviewer = false;
      }
    }

  }

  addAuthorObject(authArr, authObj) {
    if (authObj.name_or_email != "") {
      var checkEmptyString;
      checkEmptyString = false;
      for (var i = 0; i < authArr.length; i++) {
        if (authArr[i].name_or_email == "") {
          checkEmptyString = true;
        }
      }

      if (checkEmptyString == false) {
        // if (authArr.length < 5) {
          var newOne = new RWFAuthorDetails();
          newOne.name_or_email = "";
          newOne.primary = false;
          newOne.add_attribute = false;
          authArr.push(newOne);
        // }
      }

      // for (var d = 0; d < authArr.length; d++) {
      //   if (d == 0) {
      //     if(authArr[d].name_or_email != ''){
      //       authArr[d].primary = true;
      //     }else{
      //       authArr[d].primary = false;
      //     }
      //   }
      // }

      var primeCheck;
      primeCheck = false;
      for (var h = 0; h < authArr.length; h++) {
        if (authArr[h].primary == true) {
          primeCheck = true;
        }
      }

      if (primeCheck == false) {
        for (var d = 0; d < authArr.length; d++) {
          if (d == 0) {
            authArr[d].primary = true;
          }
        }
      }


    }

    if (authObj.name_or_email == "") {
      for (var s = 0; s < authArr.length; s++) {
        if (authArr[s].name_or_email == "") {
          authArr.splice(s, 1);
          s = -1;
        }
      }

      // if (authArr.length < 5) {
        var newOne = new RWFAuthorDetails();
        newOne.name_or_email = "";
        newOne.primary = false;
        newOne.add_attribute = false;
        authArr.push(newOne);
      // }

      // for (var d = 0; d < authArr.length; d++) {
      //   if (d == 0) {
      //     if(authArr[d].name_or_email != ''){
      //       authArr[d].primary = true;
      //     }else{
      //       authArr[d].primary = false;
      //     }
      //   }
      // }

      var primeCheck;
      primeCheck = false;
      for (var h = 0; h < authArr.length; h++) {
        if (authArr[h].primary == true) {
          primeCheck = true;
        }
      }

      if (primeCheck == false) {
        for (var d = 0; d < authArr.length; d++) {
          if (d == 0) {
            authArr[d].primary = true;
          }
        }
      }

      if (authArr.length == 1) {
        if (authArr[0].name_or_email == "") {
          authArr[0].primary = false;
        }
      }
    }
  }

  addReviewersObject(reviewArr, reviewObj, rowI) {



    if (reviewObj.name_or_email != "") {
      if (reviewObj.name_or_email != "") {
        reviewObj.can_comment = true;
        reviewObj.can_edit = true;
        reviewObj.can_reject = true;
        reviewObj.view_attribute = true;
        reviewObj.edit_attribute = true;
        // if(reviewArr[0].name_or_email != ''){
        //   reviewArr[0].is_mandatory = true;
        //   reviewArr[0].final_reviewer = true;
        // }
      }

      var finalReviewKeyCheck;
      finalReviewKeyCheck = false;
      for (var h = 0; h < reviewArr.length; h++) {
        if (reviewArr[h].final_reviewer == true) {
          finalReviewKeyCheck = true;
        }
      }

      if (finalReviewKeyCheck == false) {
        for (var d = 0; d < reviewArr.length; d++) {
          if (d == 0) {
            reviewArr[d].is_mandatory = true;
            reviewArr[d].final_reviewer = true;
          }
        }
      }

      var checkEmptyString;
      checkEmptyString = false;
      for (var i = 0; i < reviewArr.length; i++) {
        if (reviewArr[i].name_or_email == "") {
          checkEmptyString = true;
        }
      }

      if (checkEmptyString == false) {
        // if (reviewArr.length < 5) {
          var newOne;
          newOne = new RWFReviewersInLevel();
          newOne.name_or_email = "";
          newOne.can_comment = false;
          newOne.can_edit = false;
          newOne.can_reject = false;
          newOne.is_mandatory = false;
          newOne.view_attribute = false;
          newOne.edit_attribute = false;
          newOne.final_reviewer = false;
          reviewArr.push(newOne);
        // }
      }

    }

    if (reviewObj.name_or_email == "") {
      for (var s = 0; s < reviewArr.length; s++) {
        if (reviewArr[s].name_or_email == "") {
          reviewArr.splice(s, 1);
          s = -1;
        }
      }

      // if (reviewArr.length < 5) {
        var newOne;
        newOne = new RWFReviewersInLevel();
        newOne.name_or_email = "";
        newOne.can_comment = false;
        newOne.can_edit = false;
        newOne.can_reject = false;
        newOne.is_mandatory = false;
        newOne.view_attribute = false;
        newOne.edit_attribute = false;
        newOne.final_reviewer = false;
        reviewArr.push(newOne);
      // }

      var finalReviewKeyCheck;
      finalReviewKeyCheck = false;
      for (var h = 0; h < reviewArr.length; h++) {
        if (reviewArr[h].final_reviewer == true) {
          finalReviewKeyCheck = true;
        }
      }

      if (finalReviewKeyCheck == false) {
        for (var d = 0; d < reviewArr.length; d++) {
          if (d == 0) {
            reviewArr[d].final_reviewer = true;
          }
        }
      }

      if (reviewArr.length == 1) {
        if (reviewArr[0].name_or_email == "") {
          reviewArr[0].final_reviewer = false;
        }
      }
    }
  }

  deleteAuthorObject(valArr, Ind) {



    valArr.splice(Ind, 1);

    for (var g = 0; g < valArr.length; g++) {
      if (valArr[g].name_or_email == "") {
        valArr.splice(g, 1);
        g = -1;
      }
    }

    // if (valArr.length < 5) {
      var newOne = new RWFAuthorDetails();
      newOne.name_or_email = "";
      newOne.primary = false;
      newOne.add_attribute = false;
      valArr.push(newOne);
    // }

    var primeCheck;
    primeCheck = false;
    for (var h = 0; h < valArr.length; h++) {
      if (valArr[h].primary == true) {
        primeCheck = true;
      }
    }

    if (primeCheck == false) {
      for (var d = 0; d < valArr.length; d++) {
        if (d == 0) {
          valArr[d].primary = true;
        }
      }
    }

    if (valArr.length == 1) {
      if (valArr[0].name_or_email == "") {
        valArr[0].primary = false;
      }
    }
  }

  deleteReviewersObject(valArr, Ind) {



    valArr.splice(Ind, 1);

    for (var g = 0; g < valArr.length; g++) {
      if (valArr[g].name_or_email == "") {
        valArr.splice(g, 1);
        g = -1;
      }
    }

    // if (valArr.length < 5) {
      var newOne;
      newOne = new RWFReviewersInLevel();
      newOne.name_or_email = "";
      newOne.can_comment = false;
      newOne.can_edit = false;
      newOne.can_reject = false;
      newOne.is_mandatory = false;
      newOne.view_attribute = false;
      newOne.edit_attribute = false;
      newOne.final_reviewer = false;
      valArr.push(newOne);
    // }

    var finalReviewKeyCheck;
    finalReviewKeyCheck = false;
    for (var h = 0; h < valArr.length; h++) {
      if (valArr[h].final_reviewer == true) {
        finalReviewKeyCheck = true;
      }
    }

    if (finalReviewKeyCheck == false) {
      for (var d = 0; d < valArr.length; d++) {
        if (d == 0) {
          if (valArr[d].name_or_email != "") {
            valArr[d].can_comment = true;
            valArr[d].can_edit = true;
            valArr[d].can_reject = true;
            valArr[d].is_mandatory = true;
            valArr[d].view_attribute = true;
            valArr[d].edit_attribute = true;
            valArr[d].final_reviewer = true;
          }
        }
      }
    }
  }

  reviewWorkFlowEnableToggle(toggle, template: TemplateRef<any>,status) {

    if (status === false) {
      this.RWFToggleStatus = false;
    } else if (status === true) {
      this.RWFToggleStatus = true;
    }

    this.modalRef.hide();
    // setTimeout(() => {
      this.enableRWFToggle = !toggle;
      if (this.enableRWFToggle == true) {
        this.rWFTooltip = "Click to disable.";
        this.enableRWFToggle = true;
        this.RWFTogglePair = true;

        this.currentSectionIndex = 0;

        localStorage.removeItem("_def_WithoutRWFS");
        localStorage.removeItem("_def_WithRWFS");
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



        this.reviewType = "Sequential";
        this.levelOfReview = 2;
        this.levelOfReviewArray = [];
        for(var lr=0;lr<this.levelOfReview;lr++){
          var curLl;
          curLl = lr+1;
          this.levelOfReviewArray.push(curLl);
        }
        this.noOfReviewers = 1;
        this.onTheGoReviewToggle = false;
        this.reviewerCanEditItemsToggle = false;
        this.showPreCommentsToggle = true;
        this.showItemsItemsetForAuthorToggle = true;
        this.defaultItemStatus = "Approved";

        this.tempReviewType = "Sequential";
        this.tempLevelOfReview = 1;
        this.tempNoOfReviewers = 1;
        this.tempOnTheGoReviewToggle = false;
        this.tempReviewerCanEditItemsToggle = false;
        this.tempshowPreCommentsToggle = true;
        this.tempShowItemsItemsetForAuthorToggle = true;
        this.tempDefaultItemStatus = "Approved";
        this.tempMultipleAuthorPerSectionToggle = false;


        this.withRWF_SeqAndRanSettings = new WithRWF_SeqAndRanSettings();
        this.withRWF_SeqAndRanUserDetails = new WithRWF_SeqAndRanUserDetails();

        this.withRWF_SeqAndRanSettings.section_name = "";
        this.withRWF_SeqAndRanSettings.validation_process = false;
        this.withRWF_SeqAndRanSettings.review_type = this.tempReviewType;
        this.withRWF_SeqAndRanSettings.section_user_details = [];

        this.withRWF_SeqAndRanUserDetails.name_or_email = "";
        this.withRWF_SeqAndRanUserDetails.user_role = null;
        this.withRWF_SeqAndRanUserDetails.key_authority = null;
        this.withRWF_SeqAndRanUserDetails.level = null;
        this.withRWF_SeqAndRanUserDetails.author_attributes = null;
        this.withRWF_SeqAndRanUserDetails.reviewer_attributes = null;
        this.withRWF_SeqAndRanUserDetails.author_privileges = null;
        this.withRWF_SeqAndRanUserDetails.reviewer_privileges = null;
        this.withRWF_SeqAndRanUserDetails.is_mandatory = false;

        this.withRWF_SeqAndRanSettings.section_user_details.push(this.withRWF_SeqAndRanUserDetails);

        localStorage.setItem("_def_WithRWFS",JSON.stringify(this.withRWF_SeqAndRanSettings));

        this.modalRef = this.modalService.show(
          template,
          Object.assign({}, { class: " modal-lg _setWidth" }, this.config)
        );

      } else {
        this.rWFTooltip = "Click to enable.";
        this.enableRWFToggle = false;
        this.RWFTogglePair = false;
        this.currentSectionIndex = 0;
        localStorage.removeItem("_def_WithoutRWFS");
        localStorage.removeItem("_def_WithRWFS");
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
      }

    // }, 500);
  }

  reviewWorkFlowCancelToggle(toggle, status) {
    this.modalRef.hide();
    if(status === true)
    {
    this.RWFToggleStatus = false;
    }
    if(status === false)
    {
    this.RWFToggleStatus = true;
    }
    // setTimeout(() => {
    // this.enableRWFToggle = toggle;
    if (this.enableRWFToggle == true) {
    this.RWFTogglePair = true;
    this.currentSectionIndex = 0;
    } else {
    this.RWFTogglePair = false;
    this.currentSectionIndex = 0;
    }
  }


  chooseUserRole(userInd, curUserObj, usrRoleValue, secUseDetArr) {
    if(usrRoleValue == 0){
      curUserObj.user_role = null;
    }else{
      curUserObj.user_role = usrRoleValue;
    }

    if(curUserObj.user_role == 'Author'){
      curUserObj.is_mandatory = false;
    }

    var tempPrimaryAssignArr;
    tempPrimaryAssignArr = [];

    for(var m=0;m<secUseDetArr.length;m++){
      if(secUseDetArr[m].user_role == "Author"){
        tempPrimaryAssignArr.push(secUseDetArr[m]);
      }
    }

    if(tempPrimaryAssignArr.length != 0){
      var primaryKeyCheck;
      primaryKeyCheck = false;
      for(var n=0;n<tempPrimaryAssignArr.length;n++){
        if(tempPrimaryAssignArr[n].key_authority == 'Primary') {
          primaryKeyCheck = true;
        }
      }

      if(primaryKeyCheck == false) {
        tempPrimaryAssignArr[0].key_authority = 'Primary';
        if(tempPrimaryAssignArr[0].user_role == 'Author'){
          tempPrimaryAssignArr[0].author_attributes = 'Assign';
          tempPrimaryAssignArr[0].author_privileges = 'Edit';
        }
      }
    }

    if(curUserObj.user_role == 'Author'){
      curUserObj.level = null;
    }

    if(curUserObj.user_role == 'Reviewer'){
      curUserObj.key_authority = null;
    }



    if(this.reviewType == "Concurrent") {
      var tempRevArr;
      tempRevArr = [];
      for(var f=0;f<secUseDetArr.length;f++){
        if(secUseDetArr[f].user_role == "Reviewer"){
          tempRevArr.push(secUseDetArr[f]);
        }
      }

      if(tempRevArr.length != 0) {
        var checkFinalKey;
        var checkMAnKey;
        checkFinalKey = false;
        checkMAnKey = false;

        for(var t=0;t<tempRevArr.length;t++){
          if(tempRevArr[t].key_authority == 'Final'){
            checkFinalKey = true;
          }
          if(tempRevArr[t].is_mandatory == true){
            checkMAnKey = true;
          }
        }
        if(checkFinalKey == false){
          tempRevArr[0].key_authority = 'Final';
          tempRevArr[0].reviewer_attributes = 'Assign';
          tempRevArr[0].reviewer_privileges = 'Reject';
        }
        if(checkMAnKey == false){
          tempRevArr[0].is_mandatory = true;
        }
      }
    }


  }

  chooseUserLevel(userInd, curUserObj, usrLevelValue, secUseDetArr) {
    if(usrLevelValue == 0){
      curUserObj.level = null;
    }else{
      curUserObj.level = Number(usrLevelValue);
    }

    curUserObj.key_authority = null;


    // Level Validations Start
    var tempAllLevelDetArr;
    tempAllLevelDetArr = [];

    for(var f=0;f<secUseDetArr.length;f++){
      if(secUseDetArr[f].level != null){
        tempAllLevelDetArr.push(secUseDetArr[f].level);
      }
    }


    if(tempAllLevelDetArr.length != 0){
      for(var g=0;g<tempAllLevelDetArr.length;g++){
        var curLevelFinalKeyCheck;
        var curLevelArr;

        curLevelArr = [];
        curLevelFinalKeyCheck = false;

        for(var h=0;h<secUseDetArr.length;h++){
          if(secUseDetArr[h].level == tempAllLevelDetArr[g]){
            curLevelArr.push(secUseDetArr[h]);
          }
        }

        if(curLevelArr.length != 0){
          for(var t=0;t<curLevelArr.length;t++){
            if(curLevelArr[t].key_authority == 'Final'){
              curLevelFinalKeyCheck = true;
            }
          }
          if(curLevelFinalKeyCheck == false){
            curLevelArr[0].key_authority = 'Final';
            curLevelArr[0].reviewer_attributes = 'Assign';
            curLevelArr[0].reviewer_privileges = 'Reject';
          }
        }

      }

    }
    // Level Validations End

    // Mandatory Validations Start
    var tempAllManDetArr;
    tempAllManDetArr = [];

    for(var f=0;f<secUseDetArr.length;f++){
      if(secUseDetArr[f].level != null){
        tempAllManDetArr.push(secUseDetArr[f].level);
      }
    }


    if(tempAllManDetArr.length != 0){
      for(var g=0;g<tempAllManDetArr.length;g++){
        var curManFinalKeyCheck;
        var curManArr;

        curManArr = [];
        curManFinalKeyCheck = false;

        for(var h=0;h<secUseDetArr.length;h++){
          if(secUseDetArr[h].level == tempAllManDetArr[g]){
            curManArr.push(secUseDetArr[h]);
          }
        }

        if(curManArr.length != 0){
          for(var t=0;t<curManArr.length;t++){
            if(curManArr[t].is_mandatory == true){
              curManFinalKeyCheck = true;
            }
          }
          if(curManFinalKeyCheck == false){
            curManArr[0].is_mandatory = true;
            curManArr[0].reviewer_attributes = 'Assign';
            curManArr[0].reviewer_privileges = 'Reject';
          }
        }

      }

    }
    // Mandatory Validations End

  }

  chooseAttributes(userInd, curUserObj, usrAttrValue, secUseDetArr) {
    if(curUserObj.user_role == 'Author'){
      if(usrAttrValue == 0){
        curUserObj.author_attributes = null;
      }else{
        curUserObj.author_attributes = usrAttrValue;
      }
    }else if(curUserObj.user_role == 'Reviewer'){
      if(usrAttrValue == 0){
        curUserObj.reviewer_attributes = null;
      }else{
        curUserObj.reviewer_attributes = usrAttrValue;
      }
    }

  }

  choosePrivileges(userInd, curUserObj, usrPriValue, secUseDetArr) {
    if(curUserObj.user_role == 'Author'){
      if(usrPriValue == 0){
        curUserObj.author_privileges = null;
      }else{
        curUserObj.author_privileges = usrPriValue;
      }
    }else if(curUserObj.user_role == 'Reviewer'){
      if(usrPriValue == 0){
        curUserObj.reviewer_privileges = null;
      }else{
        curUserObj.reviewer_privileges = usrPriValue;
      }
    }


  }

  enterAuthorReviewer(curUsrDet, curUsrInd,secUseDetArr){

    this.currentUserIndWoRWF = curUsrInd;

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
    }else{
      this.AuthorsNameList = [];
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

  addNewUserForNewRWF(curStrc){

    var checkIsEmptyField;
    checkIsEmptyField = false;
    for(var i=0;i<curStrc.section_user_details.length;i++){
      if(curStrc.section_user_details[i].name_or_email != ""){
        if(curStrc.section_user_details[i].user_role != null){
          if(curStrc.section_user_details[i].user_role == "Author"){
            if(curStrc.section_user_details[i].author_attributes != null && curStrc.section_user_details[i].author_privileges != null){

            }else{
              checkIsEmptyField = true;
              break;
            }
          }else if(curStrc.section_user_details[i].user_role == "Reviewer"){
            if(curStrc.section_user_details[i].reviewer_attributes != null && curStrc.section_user_details[i].reviewer_privileges != null){

            }else{
              checkIsEmptyField = true;
              break;
            }
          }
        }else{
          checkIsEmptyField = true;
          break;
        }
      }else{
        checkIsEmptyField = true;
        break;
      }
    }

    if(checkIsEmptyField == false){
      this.wRWF_Val_Username = false;
      this.wRWF_Val_UserRole = false;
      this.wRWF_Val_Attributes = false;
      this.wRWF_Val_Privileges = false;
      this.wRWF_Val_LevelCheck = false;

      // Add New Section
      var newOne;
      newOne = new WithRWF_SeqAndRanUserDetails();
      newOne.name_or_email = "";
      newOne.user_role = null;
      newOne.key_authority = null;
      newOne.level = null;
      newOne.author_attributes = null;
      newOne.reviewer_attributes = null;
      newOne.author_privileges = null;
      newOne.reviewer_privileges = null;
      newOne.is_mandatory = false;
      curStrc.section_user_details.push(newOne);


    }else{

      this.wRWF_Val_Username = false;
      this.wRWF_Val_UserRole = false;
      this.wRWF_Val_Attributes = false;
      this.wRWF_Val_Privileges = false;
      this.wRWF_Val_LevelCheck = false;



      for(var t=0;t<this.withRWF_SeqAndRanSettings.section_user_details.length;t++){
        if(this.withRWF_SeqAndRanSettings.section_user_details[t].name_or_email == ''){
          this.wRWF_Val_Username = true;
        }
        if(this.withRWF_SeqAndRanSettings.section_user_details[t].user_role == null){
          this.wRWF_Val_UserRole = true;
        }

        if(this.withRWF_SeqAndRanSettings.section_user_details[t].user_role != null){
          if(this.withRWF_SeqAndRanSettings.section_user_details[t].user_role == 'Author') {
            if(this.withRWF_SeqAndRanSettings.section_user_details[t].author_attributes == null){
              this.wRWF_Val_Attributes = true;
            }
            if(this.withRWF_SeqAndRanSettings.section_user_details[t].author_privileges == null){
              this.wRWF_Val_Privileges = true;
            }
          }else if(this.withRWF_SeqAndRanSettings.section_user_details[t].user_role == 'Reviewer') {
            if(this.withRWF_SeqAndRanSettings.section_user_details[t].reviewer_attributes == null){
              this.wRWF_Val_Attributes = true;
            }
            if(this.withRWF_SeqAndRanSettings.section_user_details[t].reviewer_privileges == null){
              this.wRWF_Val_Privileges = true;
            }
          }
        }
      }
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

  removeCurrentUser(curSecUserDet, userInd){
    curSecUserDet.splice(userInd, 1);

    // Author Validation Start
    var tempPrimaryAssignArr;
    tempPrimaryAssignArr = [];

    for(var m=0;m<curSecUserDet.length;m++){
      if(curSecUserDet[m].user_role == "Author"){
        tempPrimaryAssignArr.push(curSecUserDet[m]);
      }
    }

    if(tempPrimaryAssignArr.length != 0){
      var primaryKeyCheck;
      primaryKeyCheck = false;
      for(var n=0;n<tempPrimaryAssignArr.length;n++){
        if(tempPrimaryAssignArr[n].key_authority == 'Primary') {
          primaryKeyCheck = true;
        }
      }

      if(primaryKeyCheck == false) {
        tempPrimaryAssignArr[0].key_authority = 'Primary';
        if(tempPrimaryAssignArr[0].user_role == 'Author'){
          tempPrimaryAssignArr[0].author_attributes = 'Assign';
          tempPrimaryAssignArr[0].author_privileges = 'Edit';
        }
      }
    }
    // Author Validation End

    // Level Validations Start
      var tempAllLevelDetArr;
      tempAllLevelDetArr = [];

      for(var f=0;f<curSecUserDet.length;f++){
        if(curSecUserDet[f].level != null){
          tempAllLevelDetArr.push(curSecUserDet[f].level);
        }
      }


      if(tempAllLevelDetArr.length != 0){
        for(var g=0;g<tempAllLevelDetArr.length;g++){
          var curLevelFinalKeyCheck;
          var curLevelArr;

          curLevelArr = [];
          curLevelFinalKeyCheck = false;

          for(var h=0;h<curSecUserDet.length;h++){
            if(curSecUserDet[h].level == tempAllLevelDetArr[g]){
              curLevelArr.push(curSecUserDet[h]);
            }
          }

          if(curLevelArr.length != 0){
            for(var t=0;t<curLevelArr.length;t++){
              if(curLevelArr[t].key_authority == 'Final'){
                curLevelFinalKeyCheck = true;
              }
            }
            if(curLevelFinalKeyCheck == false){
              curLevelArr[0].key_authority = 'Final';
              curLevelArr[0].reviewer_attributes = 'Assign';
              curLevelArr[0].reviewer_privileges = 'Reject';
            }
          }

        }

      }
    // Level Validations End

    // Mandatory Validations Start
      var tempAllManDetArr;
      tempAllManDetArr = [];

      for(var f=0;f<curSecUserDet.length;f++){
        if(curSecUserDet[f].level != null){
          tempAllManDetArr.push(curSecUserDet[f].level);
        }
      }


      if(tempAllManDetArr.length != 0){
        for(var g=0;g<tempAllManDetArr.length;g++){
          var curManFinalKeyCheck;
          var curManArr;

          curManArr = [];
          curManFinalKeyCheck = false;

          for(var h=0;h<curSecUserDet.length;h++){
            if(curSecUserDet[h].level == tempAllManDetArr[g]){
              curManArr.push(curSecUserDet[h]);
            }
          }

          if(curManArr.length != 0){
            for(var t=0;t<curManArr.length;t++){
              if(curManArr[t].is_mandatory == true){
                curManFinalKeyCheck = true;
              }
            }
            if(curManFinalKeyCheck == false){
              curManArr[0].is_mandatory = true;
              curManArr[0].reviewer_attributes = 'Assign';
              curManArr[0].reviewer_privileges = 'Reject';
            }
          }

        }

      }
    // Mandatory Validations End

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

  toggleAuthorKeyAuthority(userDet, usrInd, secUseDetArr){

    for(var u=0;u<secUseDetArr.length;u++){
      if(u == usrInd){
        if(secUseDetArr[u].user_role == "Author"){
          secUseDetArr[u].key_authority = 'Primary';
          if(secUseDetArr[u].user_role == 'Author'){
            secUseDetArr[u].author_attributes = 'Assign';
            secUseDetArr[u].author_privileges = 'Edit';
          }
        }
      }else {
        if(secUseDetArr[u].user_role == "Author"){
          secUseDetArr[u].key_authority = null;
        }
      }
    }

  }

  toggleReviewerKeyAuthority(userDet, usrInd, secUseDetArr){

    for(var u=0;u<secUseDetArr.length;u++){
      if(secUseDetArr[u].level == userDet.level){
        if(u == usrInd) {
          secUseDetArr[u].key_authority = 'Final';
          secUseDetArr[u].reviewer_attributes = 'Assign';
          secUseDetArr[u].reviewer_privileges = 'Reject';
        }else{
          secUseDetArr[u].key_authority = null;
        }
      }
    }

    // for(var u=0;u<secUseDetArr.length;u++){
    //   if(u == usrInd){
    //     if(secUseDetArr[u].user_role == "Reviewer"){
    //       secUseDetArr[u].key_authority = 'Final';
    //     }
    //   }else {
    //     if(secUseDetArr[u].user_role == "Reviewer"){
    //       secUseDetArr[u].key_authority = null;
    //     }
    //   }
    // }

  }

  toggleReviewerMandatory(userDet){
    userDet.is_mandatory = !userDet.is_mandatory;
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

  assignAuthorNameWoRWF(woRWFArr, userInd, curUser,selName){
    this.currentUserIndWoRWF = userInd;

    curUser.name_or_email = selName;

    this.AuthorsNameList = [];
  }

  assignAuthorNameWRWF(woRWFArr, userInd, curUser,selName){
    this.currentUserIndWoRWF = userInd;

    curUser.name_or_email = selName;

    this.AuthorsNameList = [];
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

}
