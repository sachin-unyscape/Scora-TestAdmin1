import { Component, OnInit, TemplateRef, Pipe } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { itemsetSearch } from './itemset-search';
import { IMyDrpOptions } from 'mydaterangepicker';
import { TagInputModule } from 'ngx-chips';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { credentials } from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { GetItemService } from '../../get-item.service';
import { NotificationsService } from 'angular2-notifications';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafePipePipe } from '../../safe-pipe.pipe';

import { testCreation } from './test-creation';
import { Section } from "./Section";
import { Scorers } from "./Scorers";
import { scoringItemsets } from "./scoringItemsets";

import { itemsetWise } from "./itemsetWise";
import { sectionWise } from "./sectionWise";
import { secScorers } from "./secScorers";
import { nonSectionItemsets } from "./nonSection-itemsets";
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss'],
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
  providers: [SafePipePipe]
})
export class CreateTestComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  startTimeHours: string;
  startTimeMinutes: string;
  start_time: string;
  constructor(private http: Http, private router: Router, public getItemService: GetItemService, public route: ActivatedRoute, private cookieService: CookieService, private authService: AuthServiceService, private _notifications: NotificationsService, private modalService: BsModalService, public sanitizer: DomSanitizer, private safepipe: SafePipePipe) {
    this.testCreation = new testCreation();
    this.itemsetSearch = new itemsetSearch();
    TagInputModule.withDefaults({
      tagInput: {
        placeholder: '',
        // add here other default values for tag-input
      },

    });
  }



  public testCreation: testCreation;
  public itemsetSearch: itemsetSearch;

  public itemsetWiseClass: itemsetWise;
  public sectionWiseClass: sectionWise;
  public secScorersClass: secScorers;

  public summativeformative: any;
  public testInfo;
  public expiry_date;
  public expiry_time;
  public showLoad;
  public testTypes;
  public testAttempts;
  public resultTypes;
  public evaluationTypes;
  public alertTime;
  public showPreviewBtn = true;
  public showMarkforReview = true;
  public ClearResponse = true;
  //toggle
  public scorersToggle = false;
  public anonymityToggle = false;
  public keywordsToggle = false;
  public completedToggle = false;
  public sectionOrderToggle = false;
  public timerToggle = false;
  public navigationToggle = false;
  public timeEndsToggle = false;
  public canUserPrintCertificate = true;
  public randomQuesToggle = false;
  public answerShufflingToggle = true;
  public pauseExamToggle = true;
  public displayHintToggle = true;
  public displayCorrtAnsToggle = true;
  public QuestPaletteToggle = true;
  public filtersToggle = true;
  public quePaperToggle = true;

  public itemsets;
  public saveMsg;
  public showMsg;
  public saveMsgError;
  public showMsgError;
  public timeZoneName;
  //Evaluation
  public evaluators1 = {};
  public timezoneValue;
  public scoring_required = false;
  public colId: number;
  public fourthRowFlag = false;
  public scorers = [];
  public scoringType;
  public noOfScorers;
  public sectionClass: Section;
  public scorersClass: Scorers;
  public scoringItemsetsClass: scoringItemsets;
  public nonSecWiseClass: nonSectionItemsets;
  public selected_Scorers = [];
  public evaluationItemSets = [];
  public scoringTypeArr;
  public selectedScorers = [];
  public scoringTypeArray = [];
  public noOfScorersArray = [];
  public evaluationLevelErr;
  public noOfScorersError;
  public scorersError;
  public checkOrgToDisable;


  //itemsetmap
  public showitemset = false;
  public activeTab = 1;
  public settings1 = {};
  public settings2 = {};
  public settings3 = {};

  public subjectList = [];
  public topicsList = [];

  public selectedSub = [];
  public selectedTopic = [];
  public itemSetDetails;
  public showSearchBlk = false;
  public authorSearchData;
  public itemSetSearchData;
  public selectedItemSets = [];
  public userSelectedDate;
  public timeZoneCurreentDate;
  public testNameError;
  public testtypeErr;
  public testAttemptErr;
  public resultErr;
  public evaluationErr;
  public itemsetErr;
  public durationErr;
  public maxScoreErr;
  public passScoreErr;
  public passScoreMin;
  public AlertErr;
  public rulesErr;
  public prevbtnErr;
  public markRevErr;
  public clearResErr;
  public path;
  public sectionWiseTimerFlag;
  public crossSectionNavFlag;
  public markForRevFlag = false;
  public sectionOrderFlag;
  public filterReqFlag = false;
  public subLabelName;
  public topLabelName;
  public ItemsetSearchErr = false;
  public showTestAttempts = false;
  public pattern1 = /^[^\s].*/;
  public sectionWiseAllocationArray;
  public showErrorForDateTime;
  public showErrorForTime;
  public convertTime;
  public ConvertTimeHour;
  public ConvertTimeMinute;
  public startTimeErrShow;
  public endTimeErrShow = false;
  public convertMonthName;
  public monthValue;
  public myDatePickerOptions: IMyDpOptions = {

    dateFormat: 'dd-mmm-yyyy',
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()-1 },
    inline: false,
    alignSelectorRight:true,
    selectionTxtFontSize:'12px',
    openSelectorOnInputClick:true,
    editableDateField:false,
    height:'28px'

  };

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
  }


  public myDatePickerOptionsEnd: IMyDpOptions = {

    dateFormat: 'dd-mmm-yyyy',
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()-1 },
    inline: false,
    alignSelectorRight:true,
    selectionTxtFontSize:'12px',
    openSelectorOnInputClick:true,
    editableDateField:false,
    height:'28px'

  };

  // RTE
  public editorOptions = {
    placeholder: "Enter Test Rules",
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }]
      ]
    },
    theme: 'snow',
    maxLength: 3000
  };


  myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd-mmm-yyyy',
    // disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },
    inline: false,
    alignSelectorRight: false,
    selectionTxtFontSize: '12px',
    openSelectorOnInputClick: true,
    editableDateRangeField: false,
    height: '28px',

  };
  public testCreationEdit;

  public placeholder: string = 'Select Date Range';

  isValid(event: boolean): void {

  }

  ngOnInit() {
    this.startTimeErrShow = false;
    this.endTimeErrShow = false;
    this.timeZoneName = localStorage.getItem('TZNM');
    // this.expiry_date = '13-Feb-2020';
    this.showErrorForDateTime = false;
    this.showErrorForTime = false;
    this.summativeformative = 'Summative';
    this.checkOrgToDisable = false;
    var tempOrg;
    tempOrg = this.cookieService.get('_TON');
    var checkIt = tempOrg.includes('Yokogawa');
    if(checkIt){
      this.checkOrgToDisable = true;
      this.canUserPrintCertificate = false;
      this.testCreation.can_participant_print_certificate = 'n';
    } else {
      this.checkOrgToDisable = false;
      this.testCreation.can_participant_print_certificate = 'y';
    }

    this.sectionWiseAllocationArray = Array();
    this.colId = 4;
    this.getMetaData();
    this.testInfo = 1;
    this.testCreation.test_result_type = 'Immediate';
    this.testCreation.test_evaluation = 'System';

    this.evaluators1 = {
      singleSelection: false,
      text: "Select Scorers",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "myclass custom-class-example"
    };

    this.settings1 = {
      singleSelection: false,
      text: "Select Subjects",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,

    };

    this.settings2 = {
      singleSelection: false,
      text: "Select Topics",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "subject",

    };
    this.settings3 = {
      singleSelection: false,
      text: "Select Author",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      // groupBy: "subject",

    };
    this.SearchAuthor();

    this.route.params.subscribe(
      (params) => {

        this.path = params.edit;
        if (params.edit == 'edit') {              // functioanlity needs to be done in case of edit test
          this.testCreation = this.getItemService.sendTestDetail();
          this.testCreationEdit = this.testCreation;

          if (this.testCreation.dynamic_section_order_choose == 'y') {
            this.sectionOrderToggle = true;
          } else {
            this.sectionOrderToggle = false;
          }
          if (this.testCreation.sectionwise_timer == 'y') {
            this.timerToggle = true;
          } else {
            this.timerToggle = false;
          }
          if (this.testCreation.cross_section_navication == 'y') {
            this.navigationToggle = true;
          } else {
            this.navigationToggle = false;
          }
          if (this.testCreation.submit_before_timer_ends == 'y') {
            this.timeEndsToggle = true;
          } else {
            this.timeEndsToggle = false;
          } if (this.testCreation.randomise_items == 'y') {
            this.randomQuesToggle = true;
          } else {
            this.randomQuesToggle = false;
          }
          if (this.testCreation.can_participant_print_certificate == 'y') {
            this.canUserPrintCertificate = true;
          } else {
            this.canUserPrintCertificate = false;
          }
          if (this.testCreation.randomise_answers == 'y') {
            this.answerShufflingToggle = true;
          } else {
            this.answerShufflingToggle = true;
          }
          if (this.testCreation.test_pause_option == 'y') {
            this.pauseExamToggle = true;
          } else {
            this.pauseExamToggle = false;
          }
          if (this.testCreation.hints == 'y') {
            this.displayHintToggle = true;
          } else {
            this.displayHintToggle = false;
          }
          if (this.testCreation.correct_answer_display == 'y') {
            this.displayCorrtAnsToggle = true;
          } else {
            this.displayCorrtAnsToggle = false;
          }
          if (this.testCreation.item_palette == 'y') {
            this.QuestPaletteToggle = true;
            this.markForRevFlag = false;
          } else {
            this.QuestPaletteToggle = false;
            this.markForRevFlag = true;
            this.showMarkforReview = false;
          }
          if (this.testCreation.filter == 'y') {
            this.filtersToggle = true;
          } else {
            this.filtersToggle = false;
          }
          if (this.testCreation.item_paper_view == 'y') {
            this.quePaperToggle = true;
          }
          else {
            this.quePaperToggle = false;
          }
          if (this.testCreation.mark_for_review_button == "y") {
            this.showMarkforReview = true;
          } else {
            this.showMarkforReview = false;
          }

          if (this.testCreation.previous_button == "y") {
            this.showPreviewBtn = true;
          } else {
            this.showPreviewBtn = false;
          }


          if (this.testCreation.clear_response_button == "y") {
            this.ClearResponse = true;
          } else {
            this.ClearResponse = false;
          }

          if(this.testCreation.scoring_required == true) {
            this.scoring_required = true;
            this.colId = 3;
            this.fourthRowFlag = true;

            if(this.testCreation.Anonymity == 'y'){
              this.anonymityToggle = true;
            }

            if(this.testCreation.Keywords_Show == 'y') {
              this.keywordsToggle = true;
            }

            if(this.testCreation.Score_After_Test_Completed == 'y') {
              this.completedToggle = true;
            }


            if (this.testCreation.Allocated_Sections_Scorers == 'y') {
              this.testCreation.Allocated_Sections_Scorers = 'y';
              this.scorersToggle = true;

            } else {
              this.testCreation.Allocated_Sections_Scorers = 'n';
              this.scorersToggle = false;
              for(var i=0;i<this.testCreationEdit.Scorer_Details.length;i++) {
                if(this.testCreationEdit.Scorer_Details[i].Scoring_Type == "single level") {
                  this.scoringType = "Single Level";
                }else if(this.testCreationEdit.Scorer_Details[i].Scoring_Type == "multiple level") {
                  this.scoringType = "Multiple Level";
                }

                this.selected_Scorers = this.testCreationEdit.Scorer_Details[i].Scorers;

                break;
              }
              this.noOfScorers = this.testCreationEdit.Scorer_Details[0].Scorers.length;

            }

          }

          // GET ITEMSET DETAILS FOR EDIT TEST START //
            if (this.authService.canActivate()) {
              // this.showLoad = true;
              var headers = new Headers();
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.get(credentials.host + "/all_itemsets/" + this.cookieService.get('_PAOID'), { headers: headers })
                .map(res => res.json())
                .catch((e: any) => {
                  return Observable.throw(e)
                })

                .subscribe(
                  data => {
                    // this.showLoad = false;
                    this.itemSetDetails = data;
                    if(this.itemSetDetails != undefined){
                      this.getItemService.getAllItemSets(data);
                      this.setAllEditWorks();
                    }
                  },
                  error => {

                    // this.showLoad = false;
                    if (error.status == 404) {
                      this.router.navigateByUrl('pages/NotFound');
                    }
                    else if (error.status == 401) {
                      this.cookieService.deleteAll();
                      window.location.href = credentials.accountUrl;
                      // window.location.href='http://accounts.scora.in';
                    }
                    else {
                      this.router.navigateByUrl('pages/serverError');
                    }

                  }
                );
            }
            // GET ITEMSET DETAILS FOR EDIT TEST END //

        }
      }


    );



  }
  // getScorers(){
  //   if(this.authService.canActivate()){
  //     this.showLoad = true;
  //     var headers = new Headers();
  //     headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
  //     this.http.get(credentials.host +"/get_metadatas/"+this.cookieService.get('_PAOID'),{headers:headers})
  //     .map(res => res.json())
  //     .catch((e: any) =>{
  //       return Observable.throw(e)
  //     } )

  //     .subscribe(
  //       data => {
  //         this.scorers = data.reviewers;

  //       },
  //       error => {
  //         this.showLoad = false;

  //         if(error.status == 404){
  //           this.router.navigateByUrl('pages/NotFound');
  //         }
  //         else if(error.status == 401){
  //           this.cookieService.deleteAll();
  //          window.location.href='http://accounts.scora.in';
  //         // window.location.href='http://accounts.scora.in';
  //         }
  //         else{
  //           this.router.navigateByUrl('pages/serverError');
  //         }
  //       },
  //     );


  //   }
  // }


  getTime() {
    var getTodayDate = new Date().toLocaleString("en-US", {
      timeZone: this.timezoneValue
    });
    var splitDate = getTodayDate.split(',');
    var dateOfZone = splitDate[0];
    
    var splitZoneDate = dateOfZone.split('/');
    var splitedMonth = splitZoneDate[0];
    var splitedDate = splitZoneDate[1];
    var splitedYear = splitZoneDate[2];
    var splitedMonths = Number(splitedMonth);
    
        
    if(splitedMonths === 1){
      this.monthValue = 'Jan';
    }
    if(splitedMonths === 2){
      this.monthValue = 'Feb';
    }
    if(splitedMonths === 3){
      this.monthValue = 'Mar';
    }
    if(splitedMonths === 4){
      this.monthValue = 'Apr';
    }
    if(splitedMonths === 5){
      this.monthValue = 'May';
    }
    if(splitedMonths === 6){
      this.monthValue = 'Jun';
    }
    if(splitedMonths === 7){
      this.monthValue = 'Jul';
    }
    if(splitedMonths === 8){
      this.monthValue = 'Aug';
    }
    if(splitedMonths === 9){
      this.monthValue = 'Sep';
    }
    if(splitedMonths === 10){
      this.monthValue = 'Oct';
    }
    if(splitedMonths === 11){
      this.monthValue = 'Nov';
    }
    if(splitedMonths === 12){
      this.monthValue = 'Dec';
    }
    var convertedDate = splitedDate + "-" + this.monthValue + "-" + splitedYear;
    var zoneDate = convertedDate.toString();
    this.timeZoneCurreentDate = zoneDate;
        
    if(this.userSelectedDate === this.timeZoneCurreentDate){
      var dynamicTimeZone = new Date().toLocaleString("en-US", {
        timeZone: this.timezoneValue
      });
      
      var time = Number(dynamicTimeZone);
      var times = new Date(new Date(dynamicTimeZone).getTime() + 60 * 60 * 24 * 1000);
      this.convertTime = times.toString();
      let splittedUserTime = this.start_time.split(':');
      this.dateTime(splittedUserTime[0], splittedUserTime[1]);
    }  
  }
  dateTime(hourValue, minuteValue) {
   this.startTimeErrShow = false;
    this.endTimeErrShow = false;
    var dynamicTime = this.convertTime;
    var splitTimes = dynamicTime.split(" ");
    var getSplittedTimes = splitTimes[4];
    var splitTimeByIndex = getSplittedTimes.split(":");
    var hours = splitTimeByIndex[0];
    var minutes = splitTimeByIndex[1];
    let minutesVal = Number(minutes);
   

    this.ConvertTimeHour = hours;
    this.ConvertTimeMinute = minutesVal;


    if (this.ConvertTimeHour < 9) {
      var convHours = "0" + this.ConvertTimeHour.toString();
      this.ConvertTimeHour = convHours;

    } else {
      convHours = this.ConvertTimeHour.toString();
      this.ConvertTimeHour = convHours;
    }

    if (this.ConvertTimeMinute < 9) {
      var convHours = "0" + this.ConvertTimeMinute.toString();
      this.ConvertTimeMinute = convHours;

    } else {
      convHours = this.ConvertTimeMinute.toString();
      this.ConvertTimeMinute = convHours;
    }     

    //start time

    if(hourValue < this.ConvertTimeHour && (minuteValue <= this.ConvertTimeMinute || minuteValue > this.ConvertTimeMinute)){
      this.startTimeErrShow = true;
    }
    if(hourValue === this.ConvertTimeHour && (minuteValue === this.ConvertTimeMinute || minuteValue <= this.ConvertTimeMinute)){
      this.startTimeErrShow = true;
    }

 
    // if (minutesVal > 59) {
    //   minutesVal = 0 + minutesVal - 60;
    //   if (minutesVal < 10) {
    //     var convMins = "0" + minutesVal.toString(); 
    //     this.ConvertTimeMinute = convMins;


    //   } else {
    //     convMins = minutesVal.toString();
    //     this.ConvertTimeMinute = convMins;


    //   }

    //   let hoursVal = Number(hours);
    //   hoursVal = hoursVal + 1;

    //   if (hoursVal > 23) {
    //     hoursVal = hoursVal - 24;

    //     if (hoursVal < 10) {
    //       var convHours = "0" + hoursVal.toString();
    //       this.ConvertTimeHour = convHours;

    //     } else {
    //       convHours = hoursVal.toString();
    //       this.ConvertTimeHour = convHours;

    //     }
    //   }
    // }
  }

  // get test metedata
  getMetaData() {
        
    localStorage.removeItem('TZNM');
    localStorage.removeItem('TZNMVL');
    if (this.authService.canActivate()) {
      this.showLoad = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/test_metadata/" + this.cookieService.get('_PAOID'), { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
          data => {

            this.showLoad = false;
            this.testTypes = data.test_types;
            this.testAttempts = data.test_attempts;
            this.resultTypes = data.test_result_types;
            this.evaluationTypes = data.test_evaluation_types;
            this.alertTime = data.test_alert_timer;
          },

          error => {

            this.showLoad = false;
            if (error.status == 404) {
              this.router.navigateByUrl('pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }

          }
        );
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/get_metadatas/" + this.cookieService.get('_PAOID'), { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
          data => {
                
        localStorage.setItem('TZNM' , data.timezone_name);
        localStorage.setItem('TZNMVL' , data.timezone_value);
        this.timezoneValue = localStorage.getItem('TZNMVL');
            this.subLabelName = data.parameters.linked_attribute_1;
            this.topLabelName = data.parameters.linked_attribute_2;
            this.getItemService.getMetaDataDetails(data);
            if (this.path == 'edit') {
              if (this.authService.canActivate()) {
                this.showLoad = true;
                var headers = new Headers();
                headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
                this.http.get(credentials.host + "/all_itemsets/" + this.cookieService.get('_PAOID'), { headers: headers })
                  .map(res => res.json())
                  .subscribe(
                    data => {

                      this.showLoad = false;
                      this.itemSetDetails = data;
                      // this.subLabelName = data.subjects;
                      // this.topLabelName = data.topics;
                      for (var i = 0; i < this.itemSetDetails.length; i++) {
                        if (this.itemSetDetails[i].scoring_required == true) {
                          this.scoringTypeArr = this.itemSetDetails[i].scoring_type;

                          break;
                        }
                        this.itemSetDetails[i].checked = false;
                        this.itemSetDetails[i].color = this.safepipe.transform(this.itemSetDetails[i].color, 'style');
                        this.itemSetDetails[i].size = this.safepipe.transform(this.itemSetDetails[i].size, 'style');
                      }
                      // if(this.testCreation.itemsets.length !=0){
                      //   for(var i=0;i<this.itemSetDetails.length;i++){
                      //   if(this.testCreation.itemsets.includes(this.itemSetDetails[i].title_name)){
                      //     this.itemSetDetails[i].checked = true;
                      //   }
                      //   }
                      // }

                      if (this.path == 'edit') {
                        for (var i = 0; i < this.itemSetDetails.length; i++) {
                          if (this.testCreation.itemsets.includes(this.itemSetDetails[i].title_name)) {
                            this.selectedItemSets.push(this.itemSetDetails[i]);
                          }
                        }
                      }
                    },
                    error => {

                      this.showLoad = false;
                      if (error.status == 404) {
                        this.router.navigateByUrl('pages/NotFound');
                      }
                      else if (error.status == 401) {
                        this.cookieService.deleteAll();
                        window.location.href = credentials.accountUrl;
                        // window.location.href='http://accounts.scora.in';
                      }
                      else {
                        this.router.navigateByUrl('pages/serverError');
                      }

                    }
                  );
              }
            }
            this.subjectList = data.subjects;
          },
          error => {

            this.showLoad = false;
            if (error.status == 404) {
              this.router.navigateByUrl('pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }

          }
        );



    }
  }


  // test engine settings and customisation tab toggle functionalities
  sectionOrder(event) {

    if (event != true) {
      this.testCreation.dynamic_section_order_choose = 'y';
      this.sectionOrderToggle = true;
    } else {
      this.testCreation.dynamic_section_order_choose = 'n';
      this.sectionOrderToggle = false;
    }


  }
  timer(event) {
    if (event != true) {
      this.testCreation.sectionwise_timer = 'y';
      this.timerToggle = true;
      this.testCreation.cross_section_navication = 'y';
      this.navigationToggle = true;
      this.crossSectionNavFlag = false;


    } else {
      this.testCreation.sectionwise_timer = 'n';
      this.timerToggle = false;
      this.testCreation.cross_section_navication = 'y';
      this.navigationToggle = true;
      this.crossSectionNavFlag = true;
      this.testCreation.dynamic_section_order_choose = 'n';
      this.sectionOrderToggle = false;
      this.sectionOrderFlag = true;
      // this.sectionOrderFlag = true;
    }
  }
  navigation(event) {
    if (event != true) {
      this.testCreation.cross_section_navication = 'y';
      this.navigationToggle = true;
      this.testCreation.dynamic_section_order_choose = 'n';
      this.sectionOrderToggle = false;
      this.sectionOrderFlag = true;
    } else {
      this.testCreation.cross_section_navication = 'n';
      this.navigationToggle = false;
      this.sectionOrderFlag = false;
    }
  }
  timeEnds(event) {
    if (event != true) {
      this.testCreation.submit_before_timer_ends = 'y';
      this.timeEndsToggle = true;
    } else {
      this.testCreation.submit_before_timer_ends = 'n';
      this.timeEndsToggle = false;
    }
  }

  testExpiresDate(event){
    var selctedDate = event.formatted;
    this.userSelectedDate = selctedDate.toString(); 


    this.myDatePickerOptionsEnd = {

      dateFormat: 'dd-mmm-yyyy',
      disableUntil: { year: event.date.year, month: event.date.month, day: event.date.day-1 },
      inline: false,
      alignSelectorRight:true,
      selectionTxtFontSize:'12px',
      openSelectorOnInputClick:true,
      editableDateField:false,
      height:'28px'

    };
  }

  EndTimechanged(timeVal, time){
    // console.log(timeVal);

      var strDateTime = time;
      var myDate = new Date(strDateTime);
      var convertedTime = myDate.toLocaleString('en-GB');
      var splitStrtTimeDate = convertedTime.split(',');
      var splitstarttime = splitStrtTimeDate[1].split(':')
      this.startTimeHours = splitstarttime[0].trim();
      this.startTimeMinutes = splitstarttime[1];
      this.start_time =  splitstarttime[0].trim() + ':'+splitstarttime[1].trim();
  }

  printCertificateKey(event) {
    if (event != true) {
      this.testCreation.can_participant_print_certificate = 'y';
      this.canUserPrintCertificate = true;
    } else {
      this.testCreation.can_participant_print_certificate = 'n';
      this.canUserPrintCertificate = false;
    }
  }

  randomQues(event) {
    if (event != true) {
      this.testCreation.randomise_items = 'y';
      this.randomQuesToggle = true;
    } else {
      this.testCreation.randomise_items = 'n';
      this.randomQuesToggle = false;
    }
  }
  answerShuffling(event) {
    if (event != true) {
      this.testCreation.randomise_answers = 'y';
      this.answerShufflingToggle = true;
    } else {
      this.testCreation.randomise_answers = 'n';
      this.answerShufflingToggle = false;
    }
  }
  pauseExam(event) {
    if (event != true) {
      this.testCreation.test_pause_option = 'y';
      this.pauseExamToggle = true;
    } else {
      this.testCreation.test_pause_option = 'n';
      this.pauseExamToggle = true;
    }
  }
  displayHint(event) {
    if (event != true) {
      this.testCreation.hints = 'y';
      this.displayHintToggle = true;
    } else {
      this.testCreation.hints = 'n';
      this.displayHintToggle = false;
    }
  }
  displayCorrtAns(event) {
    if (event != true) {
      this.testCreation.correct_answer_display = 'y';
      this.displayCorrtAnsToggle = true;
    } else {
      this.testCreation.correct_answer_display = 'n';
      this.displayCorrtAnsToggle = false;
    }
  }
  QuestPalette(event) {
    if (event != true) {
      this.testCreation.item_palette = 'y';
      this.QuestPaletteToggle = true;
      this.testCreation.filter = 'y';
      this.filtersToggle = true;
      this.markForRevFlag = false;
      this.filterReqFlag = false;
      this.testCreation.mark_for_review_button = 'y';
      this.testCreation.mark_for_review_button_value = 'Mark for Review and Next';
      this.markForRevFlag = false;
      this.showMarkforReview = true;

    } else {
      this.testCreation.item_palette = 'n';
      this.QuestPaletteToggle = false;
      this.testCreation.filter = 'n';
      this.filtersToggle = false;
      this.testCreation.mark_for_review_button = 'n';
      this.testCreation.mark_for_review_button_value = '';
      this.markForRevFlag = true;
      this.showMarkforReview = false;
      this.testCreation.filter = 'n';
      this.filtersToggle = false;
      this.filterReqFlag = true;
    }
  }
  filters(event) {
    if (event != true) {
      this.testCreation.filter = 'y';
      this.filtersToggle = true;
    } else {
      this.testCreation.filter = 'n';
      this.filtersToggle = false;
    }
  }
  quePaper(event) {
    if (event != true) {
      this.testCreation.item_paper_view = 'y';
      this.quePaperToggle = true;
    } else {
      this.testCreation.item_paper_view = 'n';
      this.quePaperToggle = false;
    }
  }
  //Evaluation Toggle
  secLevelScorers(event) {
    if (event != true) {
      this.testCreation.Allocated_Sections_Scorers = 'y';
      this.scorersToggle = true;
    } else {
      this.testCreation.Allocated_Sections_Scorers = 'n';
      this.scorersToggle = false;
    }
  }
  anonymity(event) {
    if (event != true) {
      this.testCreation.Anonymity = 'y';
      this.anonymityToggle = true;
    } else {
      this.testCreation.Anonymity = 'n';
      this.anonymityToggle = false;
    }
  }
  keywords(event) {
    if (event != true) {
      this.testCreation.Keywords_Show = 'y';
      this.keywordsToggle = true;
    } else {
      this.testCreation.Keywords_Show = 'n';
      this.keywordsToggle = false;
    }
  }

  completed(event) {
    if (event != true) {
      this.testCreation.Score_After_Test_Completed = 'y';
      this.completedToggle = true;
    } else {
      this.testCreation.Score_After_Test_Completed = 'n';
      this.completedToggle = false;
    }
  }
  changePreviewBtn(data) {
    if (data == false) {
      this.showPreviewBtn = true;
      this.testCreation.previous_button = "y";
    } else if (data == true) {
      this.showPreviewBtn = false;
      this.testCreation.previous_button = "n";
    }
  }
  changeMArkforRev(data) {
    if (data == false) {
      this.showMarkforReview = true;
      this.testCreation.mark_for_review_button = "y";
    } else if (data == true) {
      this.showMarkforReview = false;
      this.testCreation.mark_for_review_button = "n";
    }
  }
  changeclearResponse(data) {
    if (data == false) {
      this.ClearResponse = true;
      this.testCreation.clear_response_button = "y";
    } else if (data == true) {
      this.ClearResponse = false;
      this.testCreation.clear_response_button = "n";
    }
  }

  // test engine settings and customisation tab toggle functionalities ends

  removeSpc(event, val) {
    if (val != undefined) {
      if (val.length <= 3000) {
        if (val == '' || val == null) {
          if (event.keyCode == 32) {
            event.preventDefault();
            event.returnValue = false;

          }
        } else if (val != null && val != '' && val != '<p>  </p>' && val != '<p> </p>') {
          this.testCreation.test_rule = val.replace(/\s\s+/g, '  ');

        } else if (val == '<p>  </p>' || val == '<p> </p>') {
          this.testCreation.test_rule = null;
        }
      } else {
        if (event.keyCode != 8 && event.keyCode != 13) {
          event.preventDefault();
          event.returnValue = false;
        } else if (event.keyCode == 13) {
          event.preventDefault();
          event.returnValue = false;
        }
      }
    } else if (val == null) {
      if (event.keyCode == 32) {
        event.preventDefault();
        event.returnValue = false;

      }
    }
  }

  // validation for 1st tab and redirect to second tab
  gotoSecondTab() {
    this.getTime();
    console.log(this.expiry_date);
    console.log(this.expiry_time);
    this.showErrorForDateTime = false;
    this.showErrorForTime = false;
    // var strDateTime = this.expiry_time;
    // var myDate = new Date(strDateTime);
    // var convertedTime = myDate.toLocaleString('en-GB');
    // var splitStrtTimeDate = convertedTime.split(',');
    // var splitstarttime = splitStrtTimeDate[1].split(':')
    // this.startTimeHours = splitstarttime[0].trim();
    // this.startTimeMinutes = splitstarttime[1];
    // this.start_time =  splitstarttime[0].trim() + ':'+splitstarttime[1].trim();
    // console.log(this.start_time);

    if (
      this.testCreation.test_name == "" ||
      // this.testCreation.test_attempts == "" ||
      this.testCreation.test_result_type == "" ||
      this.testCreation.test_evaluation == "" ||
      this.testCreation.itemsets.length == 0 ||
      this.testCreation.test_duration == "" ||
      this.testCreation.maximum_score == "" ||
      this.testCreation.passing_score == "" ||
      this.testCreation.Alert_Timer == "" ||
      this.testCreation.test_rule == "" ||
      this.expiry_date == undefined ||
      this.expiry_date == "" ||
      this.expiry_date == null ||
      this.expiry_time == undefined ||
      this.expiry_time == null ||
      this.expiry_time == ""

    ) {
      if (this.expiry_date == undefined ||
        this.expiry_date == "" ||
        this.expiry_date == null ||
        this.expiry_time == undefined ||
        this.expiry_time == null ||
        this.expiry_time == "") {
          this.showErrorForDateTime = true;
          this.showErrorForTime = true;
        }

      this._notifications.create(
        "",
        "Please complete all mandatory fields before moving to the next section.",
        "error"
      );
      setTimeout(() => {
        this.saveMsg = false;
      }, 2000);
    }

    const pattern1 = /^[^\s].*/;
    this.testNameError = 0;
    this.testtypeErr = 0;
    this.testAttemptErr = 0;
    this.resultErr = 0;
    this.evaluationErr = 0;
    this.itemsetErr = 0;
    this.durationErr = 0;
    this.maxScoreErr = 0;
    this.passScoreErr = 0;
    this.AlertErr = 0;
    this.rulesErr = 0;
    this.passScoreMin = false;

    if (this.testCreation.test_name == '' || this.testCreation.test_name == undefined || !pattern1.test(this.testCreation.test_name)) {
      this.testNameError = -1;
    }
    // if(this.testCreation.test_type == '' || this.testCreation.test_type == undefined){
    //   this.testtypeErr = -1;
    // }
    // if (this.testCreation.test_attempts == '' || this.testCreation.test_attempts == undefined) {
    //   this.testAttemptErr = -1;
    // }
    if (this.testCreation.test_result_type == '' || this.testCreation.test_result_type == undefined) {
      this.resultErr = -1;
    }
    if (this.testCreation.test_evaluation == '' || this.testCreation.test_evaluation == undefined) {
      this.evaluationErr = -1;
    }
    if (this.testCreation.itemsets.length == 0) {
      this.itemsetErr = -1;
    }
    if (this.testCreation.test_duration == '' || this.testCreation.test_duration == undefined) {
      this.durationErr = -1;
    }
    if (this.testCreation.maximum_score == '' || this.testCreation.maximum_score == undefined) {
      this.maxScoreErr = -1;
    }
    if (this.testCreation.passing_score == '' || this.testCreation.passing_score == undefined || this.testCreation.passing_score == 0 || !pattern1.test(this.testCreation.passing_score)) {
      this.passScoreErr = -1;
    }
    else if (this.testCreation.passing_score > this.testCreation.maximum_score) {
      this.passScoreMin = true;
    }
    if (this.testCreation.Alert_Timer == '' || this.testCreation.Alert_Timer == undefined) {
      this.AlertErr = -1;
    }
    if (this.testCreation.test_rule == '' || this.testCreation.test_rule == undefined || !pattern1.test(this.testCreation.passing_score) || this.testCreation.test_rule == null) {
      this.rulesErr = -1;
    }
    if (this.testNameError == 0 && this.testtypeErr == 0 && this.testAttemptErr == 0 && this.resultErr == 0 && this.evaluationErr == 0
      && this.itemsetErr == 0 && this.durationErr == 0 && this.maxScoreErr == 0 && this.passScoreErr == 0 && this.AlertErr == 0
      && this.rulesErr == 0 && this.passScoreMin == false && this.expiry_date != undefined && this.expiry_date != "" && this.expiry_date != null &&
      this.expiry_time != undefined && this.expiry_time != null && this.expiry_time != "" && this.showErrorForDateTime == false && this.startTimeErrShow !== true && this.endTimeErrShow !== true) {
      // validations based on itemset sections mapped to test

      if (this.selectedItemSets[0].no_of_sections == 1) {
        this.sectionWiseTimerFlag = true;
        this.crossSectionNavFlag = true;
        this.testCreation.sectionwise_timer = 'n';
        this.timerToggle = false;
        this.testCreation.cross_section_navication = 'n';
        this.navigationToggle = false;
        this.sectionOrderFlag = true;

      } else if (this.selectedItemSets[0].no_of_sections > 1) {
        // conditions to enble/disable toggle
        this.sectionWiseTimerFlag = false;
        if (this.testCreation.sectionwise_timer == 'y' && this.testCreation.dynamic_section_order_choose == 'n') {
          this.testCreation.cross_section_navication = this.testCreation.cross_section_navication;
          if (this.testCreation.cross_section_navication == 'n') {
            this.navigationToggle = false;
            this.sectionOrderFlag = false;
          }
        } else {
          this.testCreation.cross_section_navication = 'y';
          this.crossSectionNavFlag = false;
          this.navigationToggle = true;
          this.crossSectionNavFlag = true;
          this.sectionOrderFlag = true;
        }

        if (this.testCreation.sectionwise_timer == 'y' && this.testCreation.dynamic_section_order_choose == 'y') {
          this.testCreation.cross_section_navication = this.testCreation.cross_section_navication;
          this.testCreation.cross_section_navication == 'n';
          this.navigationToggle = false;
          this.sectionOrderFlag = false;

        }

      }

      this.testInfo = 2;
    }
  }

  selectnoOfattemptValue(sumForm){
    this.summativeformative = sumForm;
    if(sumForm === 'Formative'){
      this.showTestAttempts = true;
    }
    if(sumForm === 'Summative'){
      this.showTestAttempts = false;
    }

  }
  // redirect to 3rd tab
  goToThirdTab() {
    this.testInfo = 3;

  }
  gotoFourthTab() {
    this.testInfo = 4;
  }

  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  // create test functions
  createTest() {



    const pattern1 = /^[^\s].*/;

    if (this.authService.canActivate()) {
      this.prevbtnErr = 0;
      this.markRevErr = 0;
      this.clearResErr = 0;
      this.noOfScorersError = 0;
      this.evaluationLevelErr = 0;
      this.scorersError = 0;

      if (this.noOfScorers == '' || this.noOfScorers == undefined) {
        this.noOfScorersError = -1;
      }

      if (this.scoringType == '' || this.scoringType == undefined) {
        this.evaluationLevelErr = -1;
      }
      this.testCreation.test_type = this.summativeformative;
      this.testCreation.test_expiry = this.expiry_date.formatted + "T" + this.start_time;
      if(this.testCreation.scoring_required== true){
        if (this.noOfScorers == this.selected_Scorers.length) {
          this.scorersError = -1;
        }
      }

      var getTime = String(this.testCreation.test_duration).split(':');

      if (getTime[2] == undefined) {
        this.testCreation.test_duration = getTime[0] + ':' + getTime[1] + ':' + String('00');
      }
      if (getTime[1] == undefined) {
        this.testCreation.test_duration = getTime[0] + ':' + String('00') + ':' + getTime[2];
      }
      if (getTime[0] == undefined) {
        this.testCreation.test_duration = String('00') + ':' + getTime[1] + ':' + getTime[2];
      }
      if ((this.testCreation.previous_button_value == '' || this.testCreation.previous_button_value == undefined || !pattern1.test(this.testCreation.previous_button_value)) && this.testCreation.previous_button == "y") {
        this.prevbtnErr = -1;
      }

      if ((this.testCreation.mark_for_review_button_value == '' || this.testCreation.mark_for_review_button_value == undefined || !pattern1.test(this.testCreation.mark_for_review_button_value)) && this.testCreation.mark_for_review_button == "y") {
        this.markRevErr = -1;
      }
      if ((this.testCreation.clear_response_button_value == '' || this.testCreation.clear_response_button_value == undefined || !pattern1.test(this.testCreation.clear_response_button_value)) && this.testCreation.clear_response_button == "y") {
        this.clearResErr = -1;
      }

      if (this.testCreation.scoring_required == true) {
        if (this.scorersToggle == false) {
          var tempScorersArray1 = Array();
          var tempScorersArray2 = Array();
          this.testCreation.scoringItemsets = [];
          this.nonSecWiseClass = new nonSectionItemsets();

          for (var i = 0; i < this.sectionWiseAllocationArray.length; i++) {
            this.nonSecWiseClass.itemset_id.push(this.sectionWiseAllocationArray[i].itemSet_id);
          }
          this.nonSecWiseClass.No_of_Scorers = this.noOfScorers;
          this.nonSecWiseClass.Scoring_Type = this.scoringType;
          tempScorersArray1.push(this.nonSecWiseClass);

          for (var h = 0; h < this.selected_Scorers.length; h++) {

            for(var k=0;k<this.scorers.length;k++){
              if(this.scorers[k].id == this.selected_Scorers[h].id){
                this.scorersClass = new Scorers();
                this.scorersClass.scorer_id = this.selected_Scorers[h].id;
                this.scorersClass.Scorer_Status = 1;
                tempScorersArray2.push(this.scorersClass);
              }
            }


          }
          this.nonSecWiseClass.Scorers = tempScorersArray2;
          this.testCreation.nonSectionItemsets = tempScorersArray1;


        }
        else {
          var overAllItemSetArray = Array();
          var itemSetWiseArray = Array();
          this.testCreation.nonSectionItemsets = [];
          for (var i = 0; i < this.sectionWiseAllocationArray.length; i++) {
            this.scoringItemsetsClass = new scoringItemsets();
            this.scoringItemsetsClass.itemset_id = this.sectionWiseAllocationArray[i].itemSet_id;

            var sectionWiseArray = Array();
            var len = this.sectionWiseAllocationArray[i].sectionWise.length;
            for (var w = 0; w < len; w++) {
              this.sectionClass = new Section();
              this.sectionClass.sec_id = this.sectionWiseAllocationArray[i].sectionWise[w].sec_id;
              this.sectionClass.Scoring_Type = this.sectionWiseAllocationArray[i].sectionWise[w].scoring_type;
              this.sectionClass.No_of_Scorers = this.sectionWiseAllocationArray[i].sectionWise[w].no_of_scorers;
              var secScorersArray = Array();
              for (var x = 0; x < this.sectionClass.No_of_Scorers; x++) {
                this.scorersClass = new Scorers();
                this.scorersClass.scorer_id = this.sectionWiseAllocationArray[i].sectionWise[w].secScorers[x].id;
                this.scorersClass.Scorer_Status = 1;
                secScorersArray.push(this.scorersClass);
              }

              this.sectionClass.Scorers = secScorersArray;
              sectionWiseArray.push(this.sectionClass);

              this.scoringItemsetsClass.Section = sectionWiseArray;

            }
            itemSetWiseArray.push(this.scoringItemsetsClass);
          }
          overAllItemSetArray = itemSetWiseArray;
          this.testCreation.scoringItemsets = overAllItemSetArray;

        }
      }else if(this.testCreation.scoring_required == false){
        this.testCreation.nonSectionItemsets = [];
        this.testCreation.scoringItemsets = [];
      }


      // if (this.prevbtnErr == 0 && this.markRevErr == 0 && this.clearResErr == 0 && this.noOfScorersError == 0 && this.evaluationLevelErr == 0 && this.scorersError == 0) {
        this.showLoad = true;

        if (this.path == 0) {

          this.testCreation.org_id = this.cookieService.get('_PAOID');

          if (this.testCreation.scoring_required == false) {
            delete this.testCreation.scoringItemsets;
            delete this.testCreation.nonSectionItemsets;
            delete this.testCreation.Allocated_Sections_Scorers;
            delete this.testCreation.Anonymity;
            delete this.testCreation.Keywords_Show;
            delete this.testCreation.Score_After_Test_Completed;
            delete this.testCreation.Check_Plagianism;
            delete this.testCreation.Plagianism_Tool;
          }

          if(this.testCreation.scoring_required == true && this.testCreation.Allocated_Sections_Scorers == "y"){
            delete this.testCreation.nonSectionItemsets;
          }
          if(this.summativeformative === 'Summative'){
            this.testCreation.test_attempts = 1;
          }
          var body = this.testCreation;
          var headers = new Headers();
          headers.append('Content-Type', 'application/json');
          headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
          return this.http.post(credentials.host + '/create_tests', body, { headers: headers })
            .map(res => res.json())
            .catch((e: any) => {
              return Observable.throw(e)
            })

            .subscribe(
              data => {

                if (data.success == true) {
                  this.showLoad = false;
                  // this.saveMsg = true;
                  // this.showMsg = data.message;
                  this._notifications.create('', data.message, 'info')
                  setTimeout(() => {
                    this.saveMsg = false;
                    this.router.navigateByUrl('Tests/ManageTests')
                  }, 2000);
                } else {
                  this.showLoad = false;
                  // this.saveMsg = true;
                  // this.showMsg = data.message;
                  this._notifications.create('', data.message, 'error')
                  // this.saveMsgError = true;
                  // this.showMsgError = data.message;
                  setTimeout(() => {
                    this.saveMsg = false;
                    // this.saveMsgError = false;
                  }, 2000);
                }
              },

              error => {

                this.showLoad = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='http://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
            );
        } else if (this.path == 'edit') {



          this.testCreation.org_id = this.cookieService.get('_PAOID');
          if (this.testCreation.scoring_required == false) {
            delete this.testCreation.scoringItemsets;
            delete this.testCreation.nonSectionItemsets;
            delete this.testCreation.Allocated_Sections_Scorers;
            delete this.testCreation.Anonymity;
            delete this.testCreation.Keywords_Show;
            delete this.testCreation.Score_After_Test_Completed;
            delete this.testCreation.Check_Plagianism;
            delete this.testCreation.Plagianism_Tool;
          }

          if(this.testCreation.scoring_required == true && this.testCreation.Allocated_Sections_Scorers == "y"){
            delete this.testCreation.nonSectionItemsets;
          }


          var body = this.testCreation;
          var headers = new Headers();
          headers.append('Content-Type', 'application/json');
          headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
          return this.http.put(credentials.host + '/edit_tests', body, { headers: headers })
            .map(res => res.json())
            .catch((e: any) => {
              return Observable.throw(e)
            })

            .subscribe(
              data => {

                if (data.success == true) {
                  this.showLoad = false;
                  // this.saveMsg = true;
                  // this.showMsg = data.message;
                  this._notifications.create('', data.message, 'info')
                  setTimeout(() => {
                    this.saveMsg = false;
                    this.router.navigateByUrl('Tests/ManageTests')
                  }, 2000);
                } else {
                  this.showLoad = false;
                  // this.saveMsg = true;
                  // this.showMsg = data.message;
                  this._notifications.create('', data.message, 'error')
                  // this.saveMsgError = true;
                  // this.showMsgError = data.message;
                  setTimeout(() => {
                    this.saveMsg = false;
                    // this.saveMsgError = false;
                  }, 2000);
                }
              },

              error => {

                this.showLoad = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='http://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
            );
        }
      // }
    }
  }



  //itemset map

  getTopic(selectedSub) {
    if (this.authService.canActivate()) {
      if (selectedSub.length == 0) {
        this.topicsList = [];
      }
      this.itemsetSearch.topics = [];
      var body = selectedSub;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + '/get_topics/' + this.cookieService.get('_PAOID'), body, { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
          data => {
            this.topicsList = data;
            //
          },
          error => {

            this.showLoad = false;
            if (error.status == 404) {
              this.router.navigateByUrl('pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }

          }
        );
    }
  }

  // get all itemsets list
  itemsetMap() {
    if (this.authService.canActivate()) {
      this.showLoad = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/all_itemsets/" + this.cookieService.get('_PAOID'), { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
          data => {
            this.showLoad = false;
            this.itemSetDetails = data;
            for (var i = 0; i < this.itemSetDetails.length; i++) {
              if (this.itemSetDetails[i].scoring_required == true) {
                this.scoringTypeArr = this.itemSetDetails[i].scoring_type;

                break;
              }
            }

            for (var i = 0; i < this.itemSetDetails.length; i++) {
              this.itemSetDetails[i].checked = false;

              this.itemSetDetails[i].color = this.safepipe.transform(this.itemSetDetails[i].color, 'style');
              this.itemSetDetails[i].size = this.safepipe.transform(this.itemSetDetails[i].size, 'style');

            }

            if (this.testCreation.itemsets.length != 0) {
              for (var i = 0; i < this.itemSetDetails.length; i++) {
                if (this.testCreation.itemsets.includes(this.itemSetDetails[i].title_name)) {
                  this.itemSetDetails[i].checked = true;
                }
              }
            }

            if (this.path == 'edit') {
              this.selectedItemSets = [];
              for (var i = 0; i < this.itemSetDetails.length; i++) {
                if (this.testCreation.itemsets.includes(this.itemSetDetails[i].title_name)) {
                  this.selectedItemSets.push(this.itemSetDetails[i])
                }
              }

            }
            this.showitemset = true;

          },
          error => {

            this.showLoad = false;
            if (error.status == 404) {
              this.router.navigateByUrl('pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }

          }
        );
    }
  }

  //author auto suggestion

  SearchAuthor() {
    if (this.authService.canActivate()) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/authors/" + this.cookieService.get('_PAOID'), { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
          data => {


            this.authorSearchData = data;
            this.scorers = data;
          },
          error => {

            this.showLoad = false;
            if (error.status == 404) {
              this.router.navigateByUrl('pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }

          }
        );
    }
  }

  // itemset name suggesstion
  SearchItemSetName(itemsetName) {
    const pattern1 = /^[^\s].*/;
    if (this.authService.canActivate()) {
      if (itemsetName != '' && pattern1.test(itemsetName) && itemsetName != undefined) {
        this.itemsetSearch.org_id = this.cookieService.get('_PAOID')
        var body = this.itemsetSearch;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        return this.http.post(credentials.host + '/itemsets_suggestions', body, { headers: headers })
          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {

              this.itemSetSearchData = data;
            },
            error => {

              this.showLoad = false;
              if (error.status == 404) {
                this.router.navigateByUrl('pages/NotFound');
              }
              else if (error.status == 401) {
                this.cookieService.deleteAll();
                window.location.href = credentials.accountUrl;
                // window.location.href='http://accounts.scora.in';
              }
              else {
                this.router.navigateByUrl('pages/serverError');
              }

            }
          );
      }
    }
  }

  // search itemsets based on filter
  searchItemSet() {
    const pattern1 = /^[^\s].*/;
    if (this.authService.canActivate()) {

      if (this.itemsetSearch.date_range != '' && this.itemsetSearch.date_range != undefined) {
        if (this.itemsetSearch.date_range.formatted != undefined) {
          this.itemsetSearch.date_range = this.itemsetSearch.date_range.formatted;
        }
      }

      if ((this.itemsetSearch.itemset_name != '' && pattern1.test(this.itemsetSearch.itemset_name)) || this.itemsetSearch.subjects.length != 0 || this.itemsetSearch.topics.length != 0 || (this.itemsetSearch.date_range != '' && this.itemsetSearch.date_range != undefined && this.itemsetSearch.date_range != null) || this.itemsetSearch.authors.length != 0) {
        this.showLoad = true;
        this.itemsetSearch.org_id = this.cookieService.get('_PAOID');
        var body = this.itemsetSearch;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        return this.http.post(credentials.host + '/search_itemsets', body, { headers: headers })
          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
            data => {
              this.showLoad = false;

              this.itemSetDetails = data;
              for (var i = 0; i < this.itemSetDetails.length; i++) {
                this.itemSetDetails[i].checked = false;
              }
              this.selectedItemSets = [];
              // if(this.testCreation.itemsets.length !=0){
              //   for(var i=0;i<this.itemSetDetails.length;i++){
              //     if(this.testCreation.itemsets.includes(this.itemSetDetails[i].title_name)){
              //       this.itemSetDetails[i].checked = true;
              //     }
              //   }
              // }
            },
            error => {

              this.showLoad = false;
              if (error.status == 404) {
                this.router.navigateByUrl('pages/NotFound');
              }
              else if (error.status == 401) {
                this.cookieService.deleteAll();
                window.location.href = credentials.accountUrl;
                // window.location.href='http://accounts.scora.in';
              }
              else {
                this.router.navigateByUrl('pages/serverError');
              }

            }
          );
      } else {
        this.ItemsetSearchErr = true;
        setTimeout(() => {
          this.ItemsetSearchErr = false;
        }, 5000);
      }
    }

  }

  // make checkbox to checked by selecting each itemset
  selectItemSet(data) {

    if (this.selectedItemSets.length == 0) {
      if (data.checked == false) {
        data.checked = true;
        this.selectedItemSets.push(data);
      } else {
        data.checked = false;
        this.selectedItemSets.splice(0, 1);
      }

    } else {

      for (var i = 0; i < this.selectedItemSets.length; i++) {
        if (this.selectedItemSets[i].itemset_id != data.itemset_id) {
          if (data.checked == false) {
            data.checked = true;
            this.selectedItemSets.push(data);
            break;
          }
        } else if (this.selectedItemSets[i].itemset_id == data.itemset_id) {
          if (data.checked == true) {
            data.checked = false;
            this.selectedItemSets.splice(i, 1);
            break;
          }
        }
      }
    }

  }

  cancel() {
    this.itemsetSearch.authors = [];
    this.itemsetSearch.date_range = "";
    this.itemsetSearch.itemset_name = "";
    this.itemsetSearch.subjects = [];
    this.itemsetSearch.topics = [];
    this.selectedItemSets = [];
    this.testCreation.itemsets = [];
    this.itemsetMap();
  }

  backToTest() {
    this.itemsetSearch.authors = [];
    this.itemsetSearch.date_range = "";
    this.itemsetSearch.itemset_name = "";
    this.itemsetSearch.subjects = [];
    this.itemsetSearch.topics = [];
    this.showitemset = false;
    if (this.testCreation.itemsets.length == 0) {
      this.selectedItemSets = [];
    }
    if (this.selectedItemSets.length == 0) {
      this.testCreation.itemsets = [];
      this.testCreation.subject_name = '';
      this.testCreation.no_of_items = '';
      this.testCreation.maximum_score = '';
      this.testCreation.test_duration = '';
    }
  }

  // conditions to check while mapping itemset to test (subject,topic,no.of.sec,no.of.items,score,timer must be same)
  mapItemSet() {
    if (this.authService.canActivate()) {
      this.testCreation.itemsets = [];
      var a: number = 0;
      var checkScoringIsRequired;
      checkScoringIsRequired = false;
      if(this.selectedItemSets.length != 0) {
        for(var j = 0; j < this.selectedItemSets.length; j++) {
          if (this.selectedItemSets[j].scoring_required == true) {
            this.scoring_required = true;
            this.testCreation.scoring_required = true;
            this.colId = 3;
            checkScoringIsRequired = true;
            break;
          }
        }
      }

      if (this.selectedItemSets.length > 1) {
        for (var i = 0; i < this.selectedItemSets.length; i++) {

          if (this.selectedItemSets[0].subjects != this.selectedItemSets[i].subjects) {
            alert(this.selectedItemSets[0].title_name + " Subject Does Not Match With " + this.selectedItemSets[i].title_name);
            a = -1;
            break;

          }
          if (this.selectedItemSets[0].topics != this.selectedItemSets[i].topics) {
            alert(this.selectedItemSets[0].title_name + " Topics Does Not Match With " + this.selectedItemSets[i].title_name);
            a = -1;
            break;

          }
          if (this.selectedItemSets[0].no_of_sections != this.selectedItemSets[i].no_of_sections) {
            alert(this.selectedItemSets[0].title_name + " No of Sections Does Not Match With " + this.selectedItemSets[i].title_name);
            a = -1;
            break;

          }
          if (this.selectedItemSets[0].no_of_items != this.selectedItemSets[i].no_of_items) {
            alert(this.selectedItemSets[0].title_name + " No of Items Does Not Match With " + this.selectedItemSets[i].title_name);
            a = -1;
            break;

          }
          if (this.selectedItemSets[0].score != this.selectedItemSets[i].score) {
            alert("Maximum Score of " + this.selectedItemSets[0].title_name + " Does Not Match With " + this.selectedItemSets[i].title_name);
            a = -1;
            break;
          }
          if (this.selectedItemSets[0].timer != this.selectedItemSets[i].timer) {
            alert("Duration of " + this.selectedItemSets[0].title_name + " Does Not Match With " + this.selectedItemSets[i].title_name);
            a = -1;
            break;
          }
        }
      }
      for (var i = 0; i < this.selectedItemSets.length; i++) {
        if (this.selectedItemSets[i].no_of_sections > 1 && this.selectedItemSets[i].scoring_required == true) {
          this.fourthRowFlag = true;
          // this.getScorers();
          break;
        }
      }
      this.evaluationItemSets = [];
      for (var i = 0; i < this.selectedItemSets.length; i++) {
        if (this.selectedItemSets[i].scoring_required == true) {
          this.scoring_required = true;
          this.testCreation.scoring_required = true;
          this.colId = 3;
          this.evaluationItemSets.push(this.selectedItemSets[i]);
        }
      }

      if (this.evaluationItemSets.length != 0) {


        var overAllItemSetArray = Array();
        var itemSetWiseArray = Array();

        for (var q = 0; q < this.evaluationItemSets.length; q++) {
          this.itemsetWiseClass = new itemsetWise();
          if (this.evaluationItemSets[q].scoring_required == true) {
            this.itemsetWiseClass.itemset_name = this.evaluationItemSets[q].title_name;
            this.itemsetWiseClass.itemSet_id = this.evaluationItemSets[q].itemset_id;

            var sectionWiseArray = Array();
            for (var w = 0; w < this.evaluationItemSets[q].sections.length; w++) {
              if (this.evaluationItemSets[q].sections[w].scoring_required == true) {
                this.sectionWiseClass = new sectionWise();
                this.sectionWiseClass.sec_id = this.evaluationItemSets[q].sections[w].section_id;
                this.sectionWiseClass.section_name = this.evaluationItemSets[q].sections[w].section_name;
                this.sectionWiseClass.scoring_type = null;
                this.sectionWiseClass.no_of_scorers = 0;
                this.sectionWiseClass.scoring_type_arr = this.evaluationItemSets[q].scoring_type;
                var secScorersArray = Array();
                this.sectionWiseClass.secScorers = secScorersArray;
                sectionWiseArray.push(this.sectionWiseClass);
              }
            }

            this.itemsetWiseClass.sectionWise = sectionWiseArray;
            itemSetWiseArray.push(this.itemsetWiseClass);
          }
        }
        overAllItemSetArray = itemSetWiseArray;

        this.sectionWiseAllocationArray = overAllItemSetArray;

      }

      if (a == 0) {
        this.showitemset = false;
        for (var i = 0; i < this.selectedItemSets.length; i++) {
          this.testCreation.itemsets.push(this.selectedItemSets[i].title_name);
          this.testCreation.subject_name = this.selectedItemSets[i].subjects;
          this.testCreation.no_of_items = this.selectedItemSets[i].no_of_items;
          this.testCreation.maximum_score = this.selectedItemSets[i].score;
          this.testCreation.test_duration = this.selectedItemSets[i].timer;
        }
        this.itemsetSearch.authors = [];
        this.itemsetSearch.date_range = "";
        this.itemsetSearch.itemset_name = "";
        this.itemsetSearch.subjects = [];
        this.itemsetSearch.topics = [];
      }

      // this.selectedItemSets =[];

      if(checkScoringIsRequired == false) {
        this.scoring_required = false;
        this.testCreation.scoring_required = false;
        this.colId = 4;
      }

    }

  }

  //cancel test

  cancelTest() {
    this.modalRef.hide();
    this.router.navigateByUrl('Tests/ManageTests')
  }

  cancelTestPOPup(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-sm' }, this.config),

    );
  }

  setAllEditWorks(){
    this.itemSetDetails = this.getItemService.sendAllItemSets();

    for (var i = 0; i < this.itemSetDetails.length; i++) {
      if (this.itemSetDetails[i].scoring_required == true) {
        this.scoringTypeArr = this.itemSetDetails[i].scoring_type;

        break;
      }
    }

    if (this.path == 'edit') {
      this.selectedItemSets = [];
      for (var i = 0; i < this.itemSetDetails.length; i++) {
        if (this.testCreation.itemsets.includes(this.itemSetDetails[i].title_name)) {
          this.selectedItemSets.push(this.itemSetDetails[i])
        }
      }

    }

    if(this.selectedItemSets.length != 0) {
      this.mapItemSet();
    }

  }

}
