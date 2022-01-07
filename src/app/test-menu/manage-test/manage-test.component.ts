import { Component, OnInit,TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import{credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import {IMyDpOptions} from 'mydatepicker';
import { testSchedule } from './test_schedule';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GetItemService } from '../../get-item.service';
import {userSuggestion} from './userSuggestion';
import { deleteObj } from './deleteTest';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService } from 'angular2-notifications';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FinalStructure } from './final-structure';

import * as jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

//drag and drop
import {AllCommunityModules, Column} from "@ag-grid-community/all-modules";
import { getMaxListeners } from 'cluster';
import { EmailValidator } from '@angular/forms';

//excel exporting
import {ExcelService} from '../../excel.service';

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
  selector: 'app-manage-test',
  templateUrl: './manage-test.component.html',
  styleUrls: ['./manage-test.component.scss'],
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
export class ManageTestComponent implements OnInit {

  @ViewChild('myTableElementId') myTableElementId: ElementRef;

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard : false
  };


modules = AllCommunityModules;

  constructor(private http:Http,private router: Router,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService,public getItemService :GetItemService,private modalService: BsModalService, private _notifications: NotificationsService,public sanitizer: DomSanitizer,private excelService:ExcelService) {
    this.test_Schedule = new testSchedule();
    this.userSuggestion = new userSuggestion();
    this.deleteTests = new deleteObj();
    this.showSpinners = false;
    this.minTime.setHours(0);
    this.minTime.setMinutes(0);
    this.maxTime.setHours(12);
    this.maxTime.setMinutes(59);
  }
  public columnDefs : any = [];
  public rowDataFilter : any = [];
  public rowValueObj: any;
  public rowData: any = [];
  public rowDataValue: any = [];
  public columnNames: any = [];
  public excelData: any = [];
  public columnNamesArray: any = [];
  public PFtestName : any;
  private gridApi;
  private gridColumnApi;
  public showSpinners;
  public showLoad;
  public showReports: Boolean = false;
  public testDetails;
  public showScheduleTest;
  public testName;
  public testGroupList;
  public timeZone;
  public test_Schedule:testSchedule;
  public selectedTestDet;
  public saveMsg;
  public showMsg;
  public meridian1 = 'AM';
  public meridian2 = 'AM';
  settings1 = {};
  public start_time;
  public end_time;
  public groupErr;
  // public timeZoneErr;
  public startDateErr;
  public endDateErr;
  public startTimeErr;
  public startTimeErrShow;
  public endTimeErrShow;
  public endTimeErr;
  public scheduledStartDate;
  public scheduledEndDate;
  public viewTestDetails;
  public activeTab = 1;
  public ViewTest;
  public userNameLists = [];
  public selected = [];
  public query;
  public searchUsers;
  public testInstance ;
  public getTestId;
  public instanceIndex =-1;
  public check_Org_Id;
  public userSuggestion : userSuggestion;
  public deleteTestPopup;
  public delete_testId;
  public deleteTests : deleteObj;
  public starttimeMeridian;
  public endtimeMeridian;
  public alertPopup;
  public scheduleType;
  public defaultSelectType;
  public startTimeChanged;
  public startTimeHours;
  public startTimeMinutes;
  public endTimeHours;
  public endTimeMinutes;
  public startTimeHMError;
  public endTimeHMError;
  public getEditstartDate;
  public getEditEndDate;
  public testEditButton;
  public planExpires;
  public testIns = true;
  public showReportTest;
  public getMetaForProfileSummary;
  public CurrentTestName;
  public getCurrentGrpDet;
  public getCurrentUserDet;
  public getCurrentCFDet;
  public activeTabDet;
  public attemptListArr;
  public sectionSelectListArr;
  public scoringCriteriaArr;
  public selectedAttemptInd;
  public selectScoreTypeInd;
  public selectScoringCriteriaInd;
  public finalResultData;
  public selectedColumns;
  public showSelectedData;
  public displayUserReports;
  public disableReporBtn: Boolean = false;
  public chunkLoader;
  public selectAllInstance: any;
  public selectAllCustomFields: Boolean = false;
  public selectAllUsers = false;
  public selectAllGroup = false;
  public convertTime: any;
  public userTimeHour;
  public userTimeMinute;
  public ConvertTimeMinute;
  public ConvertTimeHour;
  public timezoneValue;
  public  timeZoneName;
  public taxonomyList;
  public difficultyLevel;
  public difficulty_level;
  public subjectList=[];
  public topicsList = [];
  public subtopicList = [];
  public subLabelName;
  public topLabelName;
  public subTopLabelName;
  public diffLevelLabelName;
  public TaxonomyLabelName;
  public currentDownloadURl;
  public checkOrgToDisable;
  public checkOrgToShowReport;
  public timeConversion12to24;
  public enableSelectCF_Filed;
  public miniMumScore: boolean=false;
  public UserDefinedScore: boolean = false;
  public showTestResultOptional: boolean = false;
  public miniMumScore_Value;
  public scoreOrPercValue;
  public scoreValue;
  public scoreTypeValue;
  public screOrPercentage;
  public selectValue;
  public test_result_Value;
  public resul_type_label_1 = "Minimum Score";
  public resul_type_label_3 = "Raw Score";
  public resul_type_label_2 = "Percentage";
  public show_label;
  public show_labels;
  public showTest_Info_1: Boolean = false;
  public showError: Boolean = false;
  public showTest_Info_2: Boolean = false;
  public minimum_Score_Status: boolean = false;
  public minimum_Score_label: boolean = false;
  public timeStamp;
  public finalStructureForReport : FinalStructure;
  public currentDate;
  public current_Time_Hour;
  public current_Time_Minutes;
  public userSelectedDate;
  public timeZoneCurreentDate;
  public monthValue;
  public 

  myTime: Date = new Date();
  minTime: Date = new Date();
  maxTime: Date = new Date();

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


  ngOnInit() {
    this.currentDownloadURl = '';
    this.getMetadata();
    this.miniMumScore_Value = 1;
    this.scoreOrPercValue = null;
    this.selectValue = null;
  
    this.showTest_Info_1 = false;
    this.showTest_Info_2 = false;

    this.showError = false;
    this.checkOrgToDisable = false;
    this.checkOrgToShowReport = false;
    this.minimum_Score_Status = false;
    this.minimum_Score_label = false;

    this.checkOrgToShowReport = false;

    this.miniMumScore == false;
    this.showTestResultOptional = false;
    this.UserDefinedScore = false;

    var tempOrg;
    tempOrg = this.cookieService.get('_TON');
    var checkIt = tempOrg.includes('Yokogawa');
    if(checkIt){
      this.checkOrgToDisable = true;
    } else {
      this.checkOrgToDisable = false;
    }

    // this.check_Org_Id = this.cookieService.get('_PAOID');
    // if(this.check_Org_Id === '2' || this.check_Org_Id === 2 || this.check_Org_Id === 115 || this.check_Org_Id === '115' || this.check_Org_Id === '43' || this.check_Org_Id === 43){
    //   this.checkOrgToShowReport = true;
    // }else{
    //   this.checkOrgToShowReport = false;
    // }

  this.enableSelectCF_Filed = false;
    // this.chunkLoader = this.getItemService.chunkLoader;
    // localStorage.getItem('TZNM');
    this.showReports = false;
    this.showSelectedData = true;
    this.selectedColumns = [];
    this.selectedAttemptInd = 0;
    this.selectScoreTypeInd = 0;
    this.selectScoringCriteriaInd = 0;

    this.startTimeErrShow = false;
    this.endTimeErrShow = false;

    this.attemptListArr = [
      "First Attempt", "Last Attempt", "Average of All attempts", "Attempt on which Score is Maximum", "Attempt on which Scora is Minimum"
    ]

    this.sectionSelectListArr = [
      "Total score", "Section wise score"
    ];

    this.scoringCriteriaArr = [
      "SUM", "MAXIMUM", "MINIMUM", "AVERAGE"
    ];

  //   this.getMetaForProfileSummary = {
  //     "org_id": "48",
  //     "test": [
  //       {
  //         "Org_id": 48,
  //         "Test_ID": 2821,
  //         "Test_Name": "print certificate yes 1",
  //         "Test_Desc": "print certificate yes 1",
  //         "Test_Status": "Yet to be Scheduled",
  //         "Test_Cancellation_Reason": null,
  //         "Test_Admin_ID": 8683,
  //         "No_Of_ItemSets": 1,
  //         "Test_Type_ID": 1,
  //         "Test_Attempts": "5",
  //         "Test_Result_Type": "Immediate",
  //         "Subject_ID": null,
  //         "Test_Duration": 30,
  //         "Test_Evaluation_Type": "System",
  //         "No_Of_Items": 5,
  //         "No_Of_Items_In_Pool": 5,
  //         "Max_Score": 5,
  //         "Passing_Score": 4,
  //         "Negative_Score_Counter": null,
  //         "Negative_Score": null,
  //         "Sectionwise_Timer": "n",
  //         "Cross_Section_Navigation": "n",
  //         "Submit_before_Timer_Ends": "y",
  //         "Can_Participant_Print_Certificate": "y",
  //         "Test_Pause_Option": "y",
  //         "Display_Runing_Score": null,
  //         "Enable_Item_Shuffle": "n",
  //         "Enable_Ans_Choice_Shuffle": "y",
  //         "Display_Hints": "y",
  //         "Display_Item_Solution": "n",
  //         "Dynamic_Section_Selection": "n",
  //         "Previous_Button": "y",
  //         "Mark_for_Review_Button": "y",
  //         "Clear_Response_Button": "y",
  //         "Question_Palette_Button": "y",
  //         "Question_Paper_Button": "y",
  //         "Filter_Display": "y",
  //         "Previous_Button_Disp_ID": 1,
  //         "Mark_for_Review_Button_Disp_ID": 2,
  //         "Clear_Response_Button_Disp_ID": 3,
  //         "Question_Palette_Button_Disp_ID": null,
  //         "Save_and_Next_Button_Disp_ID": 5,
  //         "Submit_Button_Disp_ID": 6,
  //         "Alert_Timer": "Never",
  //         "Active_Ind": "y",
  //         "Created_by": 8683,
  //         "Created_DT": "2019-11-19 09:11:55",
  //         "Last_Updated_by": null,
  //         "Last_Updated_DT": null,
  //         "Allocated_Sections_Scorers": "y",
  //         "Anonymity": "y",
  //         "Keywords_Show": "y",
  //         "Score_After_Test_Completed": "y",
  //         "Check_Plagianism": "y",
  //         "Plagianism_Tool": "y",
  //         "schedules": [
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3056,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 10,
  //             "Test_Schedule_Type": "Users",
  //             "Grp_ID": null,
  //             "User_ID": 8692,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-19 06:00:00",
  //             "Scheduled_End_DT": "2019-11-20 06:00:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-19 09:55:31",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 8692,
  //                 "Tenant_user_nm": "varun",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "varunwiyr@gmail.com",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": null,
  //                 "Created_by": null,
  //                 "Created_DT": "2019-07-26 05:07:37",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3149,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 11,
  //             "Test_Schedule_Type": "Group",
  //             "Grp_ID": 1809,
  //             "User_ID": null,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-20 11:12:00",
  //             "Scheduled_End_DT": "2019-11-22 12:12:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-20 12:30:46",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 8692,
  //                 "Tenant_user_nm": "varun",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "varunwiyr@gmail.com",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": null,
  //                 "Created_by": null,
  //                 "Created_DT": "2019-07-26 05:07:37",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [
  //               {
  //                 "Org_id": 48,
  //                 "Grp_ID": 1809,
  //                 "Grp_Name": "Brigita grp",
  //                 "Grp_Desc": "Brigita grp",
  //                 "Grp_Count": null,
  //                 "Grp_Logo": null,
  //                 "Grp_Admin": null,
  //                 "DL_Email_ID": null,
  //                 "Active_Ind": 1,
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-20 12:29:46",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3150,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 12,
  //             "Test_Schedule_Type": "Users",
  //             "Grp_ID": null,
  //             "User_ID": 7,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-20 11:12:00",
  //             "Scheduled_End_DT": "2019-11-28 12:12:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-20 12:31:11",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 7,
  //                 "Tenant_user_nm": "Priya Shalini",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "priyashalini@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": null,
  //                 "Created_by": 4,
  //                 "Created_DT": "2018-06-16 15:40:31",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [
  //               {
  //                 "Org_id": 48,
  //                 "Grp_ID": 1809,
  //                 "Grp_Name": "Brigita grp",
  //                 "Grp_Desc": "Brigita grp",
  //                 "Grp_Count": null,
  //                 "Grp_Logo": null,
  //                 "Grp_Admin": null,
  //                 "DL_Email_ID": null,
  //                 "Active_Ind": 1,
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-20 12:29:46",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3151,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 13,
  //             "Test_Schedule_Type": "Users",
  //             "Grp_ID": null,
  //             "User_ID": 9,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-20 11:12:00",
  //             "Scheduled_End_DT": "2019-11-29 12:12:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-20 12:31:33",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 9,
  //                 "Tenant_user_nm": "Sakkeer",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "sakkeer@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": null,
  //                 "Created_by": 4,
  //                 "Created_DT": "2018-06-16 15:42:22",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [
  //               {
  //                 "Org_id": 48,
  //                 "Grp_ID": 1809,
  //                 "Grp_Name": "Brigita grp",
  //                 "Grp_Desc": "Brigita grp",
  //                 "Grp_Count": null,
  //                 "Grp_Logo": null,
  //                 "Grp_Admin": null,
  //                 "DL_Email_ID": null,
  //                 "Active_Ind": 1,
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-20 12:29:46",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3152,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 14,
  //             "Test_Schedule_Type": "Users",
  //             "Grp_ID": null,
  //             "User_ID": 8660,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-20 11:12:00",
  //             "Scheduled_End_DT": "2019-11-28 12:12:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-20 12:32:39",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 8660,
  //                 "Tenant_user_nm": "anand",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "anand@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "y",
  //                 "Tmp_Password": "e0e5a0e6",
  //                 "Created_by": null,
  //                 "Created_DT": "2019-04-15 06:04:13",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [
  //               {
  //                 "Org_id": 48,
  //                 "Grp_ID": 1809,
  //                 "Grp_Name": "Brigita grp",
  //                 "Grp_Desc": "Brigita grp",
  //                 "Grp_Count": null,
  //                 "Grp_Logo": null,
  //                 "Grp_Admin": null,
  //                 "DL_Email_ID": null,
  //                 "Active_Ind": 1,
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-20 12:29:46",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3153,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 15,
  //             "Test_Schedule_Type": "Users",
  //             "Grp_ID": null,
  //             "User_ID": 8690,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-20 12:12:00",
  //             "Scheduled_End_DT": "2019-11-28 12:12:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-20 12:38:11",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 8690,
  //                 "Tenant_user_nm": "ramesh",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "ramesh@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "y",
  //                 "Tmp_Password": null,
  //                 "Created_by": null,
  //                 "Created_DT": "2019-07-04 01:07:14",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [
  //               {
  //                 "Org_id": 48,
  //                 "Grp_ID": 1809,
  //                 "Grp_Name": "Brigita grp",
  //                 "Grp_Desc": "Brigita grp",
  //                 "Grp_Count": null,
  //                 "Grp_Logo": null,
  //                 "Grp_Admin": null,
  //                 "DL_Email_ID": null,
  //                 "Active_Ind": 1,
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-20 12:29:46",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3154,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 16,
  //             "Test_Schedule_Type": "Users",
  //             "Grp_ID": null,
  //             "User_ID": 8683,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-20 11:12:00",
  //             "Scheduled_End_DT": "2019-11-23 12:12:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-20 13:01:20",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 8683,
  //                 "Tenant_user_nm": "varun",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "varun@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": "",
  //                 "Created_by": null,
  //                 "Created_DT": "2019-06-20 05:06:43",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [
  //               {
  //                 "Org_id": 48,
  //                 "Grp_ID": 1809,
  //                 "Grp_Name": "Brigita grp",
  //                 "Grp_Desc": "Brigita grp",
  //                 "Grp_Count": null,
  //                 "Grp_Logo": null,
  //                 "Grp_Admin": null,
  //                 "DL_Email_ID": null,
  //                 "Active_Ind": 1,
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-20 12:29:46",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3155,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 17,
  //             "Test_Schedule_Type": "Users",
  //             "Grp_ID": null,
  //             "User_ID": 26444,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-20 12:12:00",
  //             "Scheduled_End_DT": "2019-11-30 12:12:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-20 13:26:27",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 26444,
  //                 "Tenant_user_nm": "Praveen",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "praveens@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": null,
  //                 "Created_by": null,
  //                 "Created_DT": "2019-11-16 10:11:31",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [
  //               {
  //                 "Org_id": 48,
  //                 "Grp_ID": 1809,
  //                 "Grp_Name": "Brigita grp",
  //                 "Grp_Desc": "Brigita grp",
  //                 "Grp_Count": null,
  //                 "Grp_Logo": null,
  //                 "Grp_Admin": null,
  //                 "DL_Email_ID": null,
  //                 "Active_Ind": 1,
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-20 12:29:46",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3161,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 18,
  //             "Test_Schedule_Type": "Users",
  //             "Grp_ID": null,
  //             "User_ID": 8683,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-25 12:12:00",
  //             "Scheduled_End_DT": "2019-11-27 12:12:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-25 19:18:49",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 8683,
  //                 "Tenant_user_nm": "varun",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "varun@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": "",
  //                 "Created_by": null,
  //                 "Created_DT": "2019-06-20 05:06:43",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [
  //               {
  //                 "Org_id": 48,
  //                 "Grp_ID": 1809,
  //                 "Grp_Name": "Brigita grp",
  //                 "Grp_Desc": "Brigita grp",
  //                 "Grp_Count": null,
  //                 "Grp_Logo": null,
  //                 "Grp_Admin": null,
  //                 "DL_Email_ID": null,
  //                 "Active_Ind": 1,
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-20 12:29:46",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "Schedule_ID": 3162,
  //             "Test_ID": 2821,
  //             "Schedule_Instance_Id": 19,
  //             "Test_Schedule_Type": "Users",
  //             "Grp_ID": null,
  //             "User_ID": 8683,
  //             "TimeZone_ID": 1,
  //             "Scheduled_Start_DT": "2019-11-25 14:16:00",
  //             "Scheduled_End_DT": "2019-12-28 12:13:00",
  //             "Status": "Scheduled",
  //             "Active_Ind": "y",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-25 19:19:14",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users": [
  //               {
  //                 "id": 8683,
  //                 "Tenant_user_nm": "varun",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "varun@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": "",
  //                 "Created_by": null,
  //                 "Created_DT": "2019-06-20 05:06:43",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "groups": [
  //               {
  //                 "Org_id": 48,
  //                 "Grp_ID": 1809,
  //                 "Grp_Name": "Brigita grp",
  //                 "Grp_Desc": "Brigita grp",
  //                 "Grp_Count": null,
  //                 "Grp_Logo": null,
  //                 "Grp_Admin": null,
  //                 "DL_Email_ID": null,
  //                 "Active_Ind": 1,
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-20 12:29:46",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null
  //               }
  //             ],
  //             "is_selected": false
  //           }
  //         ],
  //         "users": [
  //           {
  //             "id": 8692,
  //             "Tenant_user_nm": "varun",
  //             "First_Nm": null,
  //             "Last_Nm": null,
  //             "email": "varunwiyr@gmail.com",
  //             "user_status": "Active",
  //             "Pre_Approved": "n",
  //             "Tmp_Password": null,
  //             "Created_by": null,
  //             "Created_DT": "2019-07-26 05:07:37",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "is_selected": false
  //           },
  //           {
  //             "id": 7,
  //             "Tenant_user_nm": "Priya Shalini",
  //             "First_Nm": null,
  //             "Last_Nm": null,
  //             "email": "priyashalini@brigita.co",
  //             "user_status": "Active",
  //             "Pre_Approved": "n",
  //             "Tmp_Password": null,
  //             "Created_by": 4,
  //             "Created_DT": "2018-06-16 15:40:31",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "is_selected": false
  //           },
  //           {
  //             "id": 9,
  //             "Tenant_user_nm": "Sakkeer",
  //             "First_Nm": null,
  //             "Last_Nm": null,
  //             "email": "sakkeer@brigita.co",
  //             "user_status": "Active",
  //             "Pre_Approved": "n",
  //             "Tmp_Password": null,
  //             "Created_by": 4,
  //             "Created_DT": "2018-06-16 15:42:22",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "is_selected": false
  //           },
  //           {
  //             "id": 8660,
  //             "Tenant_user_nm": "anand",
  //             "First_Nm": null,
  //             "Last_Nm": null,
  //             "email": "anand@brigita.co",
  //             "user_status": "Active",
  //             "Pre_Approved": "y",
  //             "Tmp_Password": "e0e5a0e6",
  //             "Created_by": null,
  //             "Created_DT": "2019-04-15 06:04:13",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "is_selected": false
  //           },
  //           {
  //             "id": 8690,
  //             "Tenant_user_nm": "ramesh",
  //             "First_Nm": null,
  //             "Last_Nm": null,
  //             "email": "ramesh@brigita.co",
  //             "user_status": "Active",
  //             "Pre_Approved": "y",
  //             "Tmp_Password": null,
  //             "Created_by": null,
  //             "Created_DT": "2019-07-04 01:07:14",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "is_selected": false
  //           },
  //           {
  //             "id": 8683,
  //             "Tenant_user_nm": "varun",
  //             "First_Nm": null,
  //             "Last_Nm": null,
  //             "email": "varun@brigita.co",
  //             "user_status": "Active",
  //             "Pre_Approved": "n",
  //             "Tmp_Password": "",
  //             "Created_by": null,
  //             "Created_DT": "2019-06-20 05:06:43",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "is_selected": false
  //           }
  //         ],
  //         "custom_fields": [
  //           {
  //             "id": 2,
  //             "Org_id": 48,
  //             "label": "Phone Number",
  //             "datatype": "Text",
  //             "profile": "UserProfile",
  //             "Active_Ind": "y",
  //             "custom_field_values": [
  //               {
  //                 "id": 1,
  //                 "Org_id": 48,
  //                 "users_id": 8692,
  //                 "custom_fields_id": 2,
  //                 "profile": "UserProfile",
  //                 "value": "9320092105",
  //                 "is_selected": false
  //               },
  //               {
  //                 "id": 3,
  //                 "Org_id": 48,
  //                 "users_id": 8683,
  //                 "custom_fields_id": 2,
  //                 "profile": "UserProfile",
  //                 "value": "9320092105",
  //                 "is_selected": false
  //               },
  //               {
  //                 "id": 21,
  //                 "Org_id": 48,
  //                 "users_id": 8660,
  //                 "custom_fields_id": 2,
  //                 "profile": "UserProfile",
  //                 "value": "9320092109",
  //                 "is_selected": false
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "id": 3,
  //             "Org_id": 48,
  //             "label": "Country_Code",
  //             "datatype": "Text",
  //             "profile": "UserProfile",
  //             "Active_Ind": "y",
  //             "custom_field_values": [
  //               {
  //                 "id": 12,
  //                 "Org_id": 48,
  //                 "users_id": 8692,
  //                 "custom_fields_id": 3,
  //                 "profile": "UserProfile",
  //                 "value": "+91",
  //                 "is_selected": false
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "id": 15,
  //             "Org_id": 48,
  //             "label": "country1",
  //             "datatype": "Text",
  //             "profile": "UserProfile",
  //             "Active_Ind": "y",
  //             "custom_field_values": [],
  //             "is_selected": false
  //           },
  //           {
  //             "id": 16,
  //             "Org_id": 48,
  //             "label": "Date of Birth",
  //             "datatype": "Text",
  //             "profile": "UserProfile",
  //             "Active_Ind": "y",
  //             "custom_field_values": [
  //               {
  //                 "id": 49,
  //                 "Org_id": 48,
  //                 "users_id": 8683,
  //                 "custom_fields_id": 16,
  //                 "profile": "UserProfile",
  //                 "value": "14011988",
  //                 "is_selected": false
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "id": 18,
  //             "Org_id": 48,
  //             "label": "colors",
  //             "datatype": "Text",
  //             "profile": "UserProfile",
  //             "Active_Ind": "y",
  //             "custom_field_values": [
  //               {
  //                 "id": 48,
  //                 "Org_id": 48,
  //                 "users_id": 26461,
  //                 "custom_fields_id": 18,
  //                 "profile": "UserProfile",
  //                 "value": "green",
  //                 "is_selected": false
  //               }
  //             ],
  //             "is_selected": false
  //           }
  //         ],
  //         "itemset": [
  //           {
  //             "Org_id": 48,
  //             "ItemSet_ID": 3749,
  //             "ItemSet_Name": "to test score",
  //             "ItemSet_Desc": "to test score",
  //             "ItemSet_Comments": null,
  //             "No_Of_Sections": 1,
  //             "No_Of_Items": 5,
  //             "No_Of_Items_In_Pool": 5,
  //             "Max_Time": 30,
  //             "Max_Score": 5,
  //             "Retiral_Date": null,
  //             "Active_Ind": "y",
  //             "Approve_Flag": "y",
  //             "Test_Admin_ID": null,
  //             "keywords": "to test score",
  //             "Question_Bank": "n",
  //             "Review_Workflow": "n",
  //             "rw_status": "Approved",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-18 16:08:53",
  //             "Last_Updated_by": 8683,
  //             "Last_Updated_DT": "2019-11-18 16:08:53",
  //             "sections": [
  //               {
  //                 "Org_id": 48,
  //                 "ItemSet_ID": 3749,
  //                 "Section_ID": 1,
  //                 "Section_Nm": "S1",
  //                 "Section_Desc": null,
  //                 "Section_Comments": null,
  //                 "No_Of_Items": 5,
  //                 "No_Of_Items_In_Pool": 5,
  //                 "Max_Time": 30,
  //                 "Max_Score": 5,
  //                 "Approve_Flag": null,
  //                 "rw_status": "Open",
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-18 16:11:53",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               },
  //               {
  //                 "Org_id": 48,
  //                 "ItemSet_ID": 3749,
  //                 "Section_ID": 1,
  //                 "Section_Nm": "S1",
  //                 "Section_Desc": null,
  //                 "Section_Comments": null,
  //                 "No_Of_Items": 5,
  //                 "No_Of_Items_In_Pool": 5,
  //                 "Max_Time": 30,
  //                 "Max_Score": 5,
  //                 "Approve_Flag": null,
  //                 "rw_status": "Open",
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-18 16:11:53",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               }
  //             ],
  //             "is_selected": false
  //           },
  //           {
  //             "Org_id": 48,
  //             "ItemSet_ID": 3749,
  //             "ItemSet_Name": "to test score",
  //             "ItemSet_Desc": "to test score",
  //             "ItemSet_Comments": null,
  //             "No_Of_Sections": 1,
  //             "No_Of_Items": 5,
  //             "No_Of_Items_In_Pool": 5,
  //             "Max_Time": 30,
  //             "Max_Score": 5,
  //             "Retiral_Date": null,
  //             "Active_Ind": "y",
  //             "Approve_Flag": "y",
  //             "Test_Admin_ID": null,
  //             "keywords": "to test score",
  //             "Question_Bank": "n",
  //             "Review_Workflow": "n",
  //             "rw_status": "Approved",
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-18 16:08:53",
  //             "Last_Updated_by": 8683,
  //             "Last_Updated_DT": "2019-11-18 16:08:53",
  //             "sections": [
  //               {
  //                 "Org_id": 48,
  //                 "ItemSet_ID": 3749,
  //                 "Section_ID": 1,
  //                 "Section_Nm": "S1",
  //                 "Section_Desc": null,
  //                 "Section_Comments": null,
  //                 "No_Of_Items": 5,
  //                 "No_Of_Items_In_Pool": 5,
  //                 "Max_Time": 30,
  //                 "Max_Score": 5,
  //                 "Approve_Flag": null,
  //                 "rw_status": "Open",
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-18 16:11:53",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               },
  //               {
  //                 "Org_id": 48,
  //                 "ItemSet_ID": 3749,
  //                 "Section_ID": 1,
  //                 "Section_Nm": "S1",
  //                 "Section_Desc": null,
  //                 "Section_Comments": null,
  //                 "No_Of_Items": 5,
  //                 "No_Of_Items_In_Pool": 5,
  //                 "Max_Time": 30,
  //                 "Max_Score": 5,
  //                 "Approve_Flag": null,
  //                 "rw_status": "Open",
  //                 "Created_by": 8683,
  //                 "Created_DT": "2019-11-18 16:11:53",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               }
  //             ],
  //             "is_selected": false
  //           }
  //         ],
  //         "groups": [
  //           {
  //             "Org_id": 48,
  //             "Grp_ID": 1809,
  //             "Grp_Name": "Brigita grp",
  //             "Grp_Desc": "Brigita grp",
  //             "Grp_Count": null,
  //             "Grp_Logo": null,
  //             "Grp_Admin": null,
  //             "DL_Email_ID": null,
  //             "Active_Ind": 1,
  //             "Created_by": 8683,
  //             "Created_DT": "2019-11-20 12:29:46",
  //             "Last_Updated_by": null,
  //             "Last_Updated_DT": null,
  //             "users_in_group": [
  //               {
  //                 "id": 7,
  //                 "Tenant_user_nm": "Priya Shalini",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "priyashalini@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": null,
  //                 "Created_by": 4,
  //                 "Created_DT": "2018-06-16 15:40:31",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               },
  //               {
  //                 "id": 9,
  //                 "Tenant_user_nm": "Sakkeer",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "sakkeer@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": null,
  //                 "Created_by": 4,
  //                 "Created_DT": "2018-06-16 15:42:22",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               },
  //               {
  //                 "id": 8660,
  //                 "Tenant_user_nm": "anand",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "anand@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "y",
  //                 "Tmp_Password": "e0e5a0e6",
  //                 "Created_by": null,
  //                 "Created_DT": "2019-04-15 06:04:13",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               },
  //               {
  //                 "id": 8683,
  //                 "Tenant_user_nm": "varun",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "varun@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": "",
  //                 "Created_by": null,
  //                 "Created_DT": "2019-06-20 05:06:43",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               },
  //               {
  //                 "id": 8690,
  //                 "Tenant_user_nm": "ramesh",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "ramesh@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "y",
  //                 "Tmp_Password": null,
  //                 "Created_by": null,
  //                 "Created_DT": "2019-07-04 01:07:14",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               },
  //               {
  //                 "id": 8694,
  //                 "Tenant_user_nm": "salman",
  //                 "First_Nm": null,
  //                 "Last_Nm": null,
  //                 "email": "salman@brigita.co",
  //                 "user_status": "Active",
  //                 "Pre_Approved": "n",
  //                 "Tmp_Password": null,
  //                 "Created_by": null,
  //                 "Created_DT": "2019-08-09 11:08:38",
  //                 "Last_Updated_by": null,
  //                 "Last_Updated_DT": null,
  //                 "is_selected": false
  //               }
  //             ],
  //             "is_selected": false
  //           }
  //         ],
  //         "column_names": [
  //           "Name",
  //           "Phone Number",
  //           "Email",
  //           "Phone Number",
  //           "Country_Code",
  //           "country1",
  //           "Date of Birth",
  //           "colors"
  //         ]
  //       }
  //     ]
  //   }

  // this.CurrentTestName = this.getMetaForProfileSummary.test[0].Test_Name;





    this.showReportTest = false;
    // this.planExpires = this.getItemService.sendPlanExpireKEy();
    this.defaultSelectType= true;
    this.start_time = String('00:00');
    this.end_time = String('00:00');
    this.createdTestDetails();
    this.getTestId = localStorage.getItem('testid');
    this.testInstance = this.getTestId;


    // this.start_time='00:00';
    this.settings1 = {
      singleSelection: false,
      text: "Select Test Group",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "myclass custom-class-example"
    };
  }

  // get test details list
  createdTestDetails(){
    if(this.authService.canActivate()){
      this.showLoad = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/created_tests/" + this.cookieService.get('_PAOID') + '/1',{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {
          this.showLoad = false;
          var tempOrg;
          tempOrg = this.cookieService.get('_TON');
          var checkIt = tempOrg.includes('Yokogawa');
          if(checkIt){
            this.checkOrgToDisable = true;
          } else {
            this.checkOrgToDisable = false;
          }

          this.check_Org_Id = this.cookieService.get('_PAOID');
           if(this.check_Org_Id === '2' || this.check_Org_Id === 2 || this.check_Org_Id === 115 || this.check_Org_Id === '115' || this.check_Org_Id === '43' || this.check_Org_Id === 43){
              this.checkOrgToShowReport = true;
            }else{
              this.checkOrgToShowReport = false;
            }
          
          this.testDetails= data;
          // this.currentDownloadURl = credentials.host + '/test_summary/' + this.cookieService.get('_PAOID');
          },

          error => {

            this.showLoad= false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
               window.location.href=credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );
    }
  }
getCurrentTime(){
  var current = this.timeStamp.split(' ');
  this.currentDate = current[0];
  var currentTime = current[1];
  var time = currentTime.split(':');
  var current_Time_Hour = time[0];
  var current_Time_Minutes = time[1];
}

  downloadMyFile(){
    const link = document.createElement('a');
    // link.setAttribute('target', '_blank');
    link.setAttribute('href', credentials.host + '/test_summary/' + this.cookieService.get('_PAOID'));
    // link.setAttribute('download', "Test Schedule Details_" +this.currentDate+ ","+ this.current_Time_Hour + ":" + this.current_Time_Minutes + ".xlsx");
    link.setAttribute('download', `Test Schedule Details_.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  downloadTestFile(){
    var test_id = 393;
    var org_id = 2;
    const link = document.createElement('a');
    // link.setAttribute('target', '_blank');
    link.setAttribute('href', credentials.host + '/lpu_report/' + org_id + '/' + test_id);
    // http://author.scora.in/scoraauthor/public/api/lpu_report/115/3296
    link.setAttribute('download', `Test Schedule Details_.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  scheduleTestMetaData(data){
    this.timeZoneName = localStorage.getItem('TZNM')
    this.startTimeErrShow = false;
    // if(this.planExpires == false){
      this.selectedTestDet = data;
      this.testName = data.test_name;

      this.showScheduleTest = true;
    // }
  }

  getMeridian1(data){

    this.meridian1 = data
  }
  getMeridian2(data){

    this.meridian2 = data
  }

  startDateChanged(event){
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
  endDateChanged(event){
    this.myDatePickerOptions = {
      dateFormat: 'dd-mmm-yyyy',
      disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },
      disableSince :{year: event.date.year, month: event.date.month, day: event.date.day},
      inline: false,
      alignSelectorRight:true,
      selectionTxtFontSize:'12px',
      openSelectorOnInputClick:true,
      editableDateField:false,
      height:'28px'

    };
    this.myDatePickerOptions = {
      dateFormat: 'dd-mmm-yyyy',
      disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()-1 },
      disableSince :{year: event.date.year, month: event.date.month, day: event.date.day+1},
      inline: false,
      alignSelectorRight:true,
      selectionTxtFontSize:'12px',
      openSelectorOnInputClick:true,
      editableDateField:false,
      height:'28px'

    };
  }

  //export to excel format
  exportAsXLSX():void {
   let result = [];
   let keys = this.columnDefs.map(x => x.field);
   this.rowData.forEach(item => {
    let obj = {}
    keys.forEach(key => {
      obj[key] = item[key]
    });
    result.push(obj)
  });
  this.excelData = result;
  // for(let data of this.testDetails){
  //   this.PFtestName = data.test_name
  // }
    this.excelService.exportAsExcelFile(this.excelData, this.getMetaForProfileSummary.test[0].Test_Name);
  }

  // not in use
  getstartTime(strtTime){

    this.start_time = strtTime;
    var getHours = this.start_time.split(':');
    if(getHours[0] > 12){
      this.start_time = String('00:00');

    }
  }
  getEndTime(endTime){

    this.end_time = endTime;
    var getHours = this.end_time.split(':');
    if(getHours[0] > 12){
      this.end_time = String('00:00');
    }
  }
  // not in use


  // validation for schedule test
  checkValidation(){
    var timePattern = /^(?:2[0-3]|[01][1-9]|[11][0-9]):[0-5][0-9]$/;

    if(this.test_Schedule.schedule_datas.length == 0){
      this.groupErr = true;
    }else{
      this.groupErr = false;
    }


    if(this.scheduledStartDate == undefined || this.scheduledStartDate == ''){
      this.startDateErr = true;
    }else{
      this.startDateErr = false;
    }
    if(this.scheduledEndDate == undefined || this.scheduledEndDate == ''){
      this.endDateErr = true;
    }else{
      this.endDateErr = false;
    }if(this.start_time == '00:00' || this.start_time == undefined || this.start_time === null){
      this.startTimeErr = true;
      this.startTimeErrShow = true;
    }else{
      this.startTimeErr = false;
      this.startTimeErrShow = false;
    }
    if(this.end_time == '00:00' || this.end_time == undefined || this.end_time === null){
      this.endTimeErr = true;
    }else{
      this.endTimeErr = false;
    }
  }


  // schedule test function
  scheduleTest(){
    this.timeZoneName = localStorage.getItem('TZNM')
    this.checkValidation();
    if(this.groupErr == false &&  this.startDateErr == false && this.startTimeErr == false && this.endDateErr == false && this.endTimeErr == false){
    // this.showLoad = true;
    this.getTime();

    if (this.startTimeErrShow === false && this.endTimeErrShow === false){
      this.test_Schedule.test_id = this.selectedTestDet.test_id;
      this.test_Schedule.org_id = this.cookieService.get('_PAOID');
  
  
      this.test_Schedule.schedule_start_date = this.scheduledStartDate.formatted?this.scheduledStartDate.formatted:this.getEditstartDate;
      this.test_Schedule.schedule_end_date = this.scheduledEndDate.formatted ? this.scheduledEndDate.formatted : this.getEditEndDate;
      //start time
        // var getTime = String(this.start_time).split(':');
        //
  
        // if(getTime[1] == undefined){
        //   this.start_time = getTime[0] + ':'+String('00');
        // }
        // if(getTime[0] == undefined){
        //   this.start_time =String('00')+ ':'+getTime[1] ;
        // }
        // // end time
        // var getEndTime = String(this.end_time).split(':');
        //
  
        // if(getEndTime[1] == undefined){
        //   this.end_time = getEndTime[0] + ':'+String('00');
        // }
        // if(getEndTime[0] == undefined){
        //   this.end_time =String('00')+ ':'+getEndTime[1] ;
        // }
        var startTimeMeridian = this.start_time;
        var endTimeMeridian = this.end_time;
        this.test_Schedule.schedule_start_date = this.test_Schedule.schedule_start_date +' '+startTimeMeridian;
        this.test_Schedule.schedule_end_date = this.test_Schedule.schedule_end_date +' '+endTimeMeridian;
        this.test_Schedule.sub_app_id = 1;
  
          this.showLoad = true;
          var body = this.test_Schedule;
          var headers = new Headers();
          headers.append('Content-Type', 'application/json');
          headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
          if(this.test_Schedule.instance_unique_id == undefined){
            return this.http.post(credentials.host +'/test_schedule', body,{headers: headers})
            .map(res => res.json())
            .catch((e: any) =>{
              return Observable.throw(e)
            } )
  
            .subscribe(
                data => {
  
                  if(data.success == true){
                    this.showLoad = false;
                    // this.saveMsg = true;
                    // this.showMsg = data.message;
                    this._notifications.create('',data.message, 'info');
                    setTimeout(()=>{
                      this.saveMsg = false;
  
                      },2000);
                      this.showScheduleTest = false;
                      this.createdTestDetails();
                      this.test_Schedule.org_id;
                      this.test_Schedule.test_id ='';
                      this.test_Schedule.schedule_datas = [];
  
                      this.test_Schedule.schedule_start_date = '';
                      this.test_Schedule.schedule_end_date = '';
                      this.scheduledStartDate = '';
                      this.scheduledEndDate = '';
                      this.test_Schedule.schedule_for = 1;
                      this.start_time = String('00:00');
                      this.end_time = String('00:00');
                      this.myDatePickerOptions= {
  
                        dateFormat: 'dd-mmm-yyyy',
                        disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()-1 },
                        inline: false,
                        alignSelectorRight:true,
                        selectionTxtFontSize:'12px',
                        openSelectorOnInputClick:true,
                        editableDateField:false,
                        height:'28px'
  
                      };
  
  
                      this.myDatePickerOptionsEnd = {
                        dateFormat: 'dd-mmm-yyyy',
                        disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()-1 },
                        inline: false,
                        alignSelectorRight:true,
                        selectionTxtFontSize:'12px',
                        openSelectorOnInputClick:true,
                        editableDateField:false,
                        height:'28px'
  
                      };
                  }else{
  
                    this.showLoad = false;
                    // this.saveMsg = true;
                    // this.showMsg = data.message;
                    this._notifications.create('',data.message, 'error');
                    setTimeout(()=>{
                      this.saveMsg = false;
                      },2000);
                  }
  
                },
  
                error => {
  
                  this.showLoad= false;
                  if(error.status == 404){
                    this.router.navigateByUrl('pages/NotFound');
                  }
                  else if(error.status == 401){
                    this.cookieService.deleteAll();
                     window.location.href=credentials.accountUrl;
                    // window.location.href='http://accounts.scora.in';
                  }
                  else{
                    this.router.navigateByUrl('pages/serverError');
                  }
  
                }
  
            );
          }else{
            return this.http.put(credentials.host +'/test_schedule_edit', body,{headers: headers})
            .map(res => res.json())
            .catch((e: any) =>{
              return Observable.throw(e)
            } )
  
            .subscribe(
                data => {
  
                  if(data.success == true){
                    this.showLoad = false;
                    // this.saveMsg = true;
                    // this.showMsg = data.message;
                    this._notifications.create('',data.message, 'info');
                    setTimeout(()=>{
                      this.saveMsg = false;
  
                      },2000);
                      this.showScheduleTest = false;
                      this.createdTestDetails();
                      this.test_Schedule.org_id;
                      this.test_Schedule.test_id ='';
                      this.test_Schedule.schedule_datas = [];
  
                      this.test_Schedule.schedule_start_date = '';
                      this.test_Schedule.schedule_end_date = '';
                      this.scheduledStartDate = '';
                      this.scheduledEndDate = '';
                      this.test_Schedule.schedule_for = 1;
                      this.start_time = String('00:00');
                      this.end_time = String('00:00');
                      this.test_Schedule.instance_unique_id = undefined;
                      this.myDatePickerOptions= {
  
                        dateFormat: 'dd-mmm-yyyy',
                        disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()-1 },
                        inline: false,
                        alignSelectorRight:true,
                        selectionTxtFontSize:'12px',
                        openSelectorOnInputClick:true,
                        editableDateField:false,
                        height:'28px'
  
                      };
  
  
                      this.myDatePickerOptionsEnd = {
                        dateFormat: 'dd-mmm-yyyy',
                        disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()-1 },
                        inline: false,
                        alignSelectorRight:true,
                        selectionTxtFontSize:'12px',
                        openSelectorOnInputClick:true,
                        editableDateField:false,
                        height:'28px'
  
                      };
                  }else{
  
                    this.showLoad = false;
                    // this.saveMsg = true;
                    // this.showMsg = data.message;
                    this._notifications.create('',data.message, 'error');
                    setTimeout(()=>{
                      this.saveMsg = false;
                      },2000);
                  }
  
                },
  
                error => {
  
                  this.showLoad= false;
                  if(error.status == 404){
                    this.router.navigateByUrl('pages/NotFound');
                  }
                  else if(error.status == 401){
                    this.cookieService.deleteAll();
                     window.location.href=credentials.accountUrl;
                    // window.location.href='http://accounts.scora.in';
                  }
                  else{
                    this.router.navigateByUrl('pages/serverError');
                  }
  
                }
  
            );
          }
    }
    else{
    }


    }

  }

  selectTestResultType(val) {
    this.miniMumScore_Value = val;

    if (val === 1) {
      this.scoreOrPercValue = null;
      this.selectValue = null;
    }

  }

 

  // reset all var while cancel
  CancelScheduleTest(){
    this.groupErr = false;
    // this.timeZoneErr = false;
    this.startDateErr = false;
    this.startTimeErr = false;
     this.endDateErr = false;
    this.endTimeErr = false
    this.showScheduleTest = false;
    this.test_Schedule.org_id;
    this.test_Schedule.test_id ='';
    this.test_Schedule.schedule_datas = [];
    // this.test_Schedule.timezone ='';
    this.test_Schedule.schedule_start_date = '';
    this.test_Schedule.schedule_end_date = '';
    this.scheduledStartDate = '';
    this.scheduledEndDate = '';
    this.test_Schedule.schedule_for = 1;
    this.start_time = String('00:00');
    this.end_time = String('00:00');
    this.test_Schedule.instance_unique_id = undefined;
    this.userNameLists = [];
    this.searchUsers = '';
  }

  //view test api

  viewTest(testId,template: TemplateRef<any>,editButtonEn_DS){
    this.testIns = false;
    this.testEditButton = editButtonEn_DS;
    if(this.authService.canActivate()){
      this.showLoad = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/view_test_details/" + this.cookieService.get('_PAOID') +'/' +testId ,{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {
         this.activeTab = 1;
          this.showLoad = false;
          this.viewTestDetails = data;

          delete this.viewTestDetails.nonSectionItemsets;
          delete this.viewTestDetails.scoringItemsets;

          this.viewTestDetails.mappedItemSets = this.viewTestDetails.itemsets.map(value => value).join(",");

          this.modalRef = this.modalService.show(
            template,
            Object.assign({}, { class: ' modal-lg' },this.config,this.testIns = false),

          );

        },

          error => {

            this.showLoad= false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
               window.location.href=credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );
    }
  }

  // edit test redirect
  editTest(){
    this.getItemService.getTestDetails(this.viewTestDetails);

    this.modalRef.hide();
    this.router.navigate(['Tests/createTest','edit']);

  }

  getScorePercentage(val){

    this.screOrPercentage = val;
      }

  select(item){
    if(!(this.test_Schedule.schedule_datas).includes(item)){
      this.test_Schedule.schedule_datas.push(item);
    }
    this.query = '';
    this.userNameLists = [];
    this.searchUsers = '';
  }

  remove(item){
    this.test_Schedule.schedule_datas.splice(this.test_Schedule.schedule_datas.indexOf(item),1);
  }

  // name suggesstions
  userNameSuggesstion(search_data){
    const pattern1 = /^[^\s].*/;

    if(search_data != '' && pattern1.test(search_data)){

      this.userSuggestion.org_id = parseInt(this.cookieService.get('_PAOID'));
      this.userSuggestion.search_type = this.test_Schedule.schedule_for;
      this.userSuggestion.search_key = search_data;

      var body = this.userSuggestion;
      var headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host +"/search_groups_users", body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
            data => {

            this.userNameLists = data;
            },
            error => {

              this.showLoad= false;
              if(error.status == 404){
                this.router.navigateByUrl('pages/NotFound');
              }
              else if(error.status == 401){
                this.cookieService.deleteAll();
                 window.location.href=credentials.accountUrl;
                // window.location.href='http://accounts.scora.in';
              }
              else{
                this.router.navigateByUrl('pages/serverError');
              }

            }
      );
    }
  }


  closeViewTest(){
    this.ViewTest = false;
    this.activeTab = 1;
  }


  testScheduleInstance(index){
    this.testInstance = index;
  }

  showReportDetails(obj)
  {
    this.showReports = ! this.showReports;
 }

  deleteTest(delete_testId,deleteFlag,template: TemplateRef<any>){
    if(deleteFlag){
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: ' modal-sm' },this.config,this.testIns = false),

      );
      this.delete_testId = delete_testId;
    }
  }


  deleteTestConfirm(){
    this.viewTestPopupClose();
    if(this.authService.canActivate()){
      this.deleteTests.category = 3;
      this.deleteTests.value.push(this.delete_testId);
      this.deleteTests.org_id = this.cookieService.get('_PAOID');

      this.showLoad = true;
      var body = this.deleteTests;
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
              this._notifications.create('',data.message, 'info');
              setTimeout(()=>{
                this.saveMsg = false;
                this.createdTestDetails();
                },4000);
            } else{
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'error');
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
               window.location.href=credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );

    }
  }

  // change time format function

   tConvert (newtime) {

    // Check correct time format and split into components
    var time = newtime;
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if(AMPM == "PM" && hours<12) hours = hours+12;
    if(AMPM == "AM" && hours==12) hours = hours-12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if(hours<10) sHours = "0" + sHours;
    if(minutes<10) sMinutes = "0" + sMinutes;
    var result = sHours + ":" + sMinutes;
    return result; // return adjusted time or original string
  }


  // edit schedule instance

  editScheduleInstance(instancedata,testdata){
    if(instancedata.schedule_instance_active){
      var editinstancedata = instancedata;
      // this.test_Schedule = editinstancedata;
      if(editinstancedata.schedule_for == 'Test Group'){
        this.test_Schedule.schedule_for = 1;
      }else if(editinstancedata.schedule_for == 'Test Users'){
        this.test_Schedule.schedule_for = 2;
      }
      // this.test_Schedule.timezone = editinstancedata.timezone;
      var scheduledata = editinstancedata.schedule_datas;
      this.test_Schedule.schedule_datas = String(scheduledata).split(',');
      var splitstartDate = editinstancedata.schedule_start_date.split(" ");

      this.getEditstartDate = splitstartDate[0];
      var date = new Date(splitstartDate[0]);
      var getmonth = date.toLocaleDateString();

      var date1 = getmonth.split('/');
      this.scheduledStartDate = { date: { year: +date1[2], month: +date1[0], day: +date1[1] } };

      var a = this.tConvert(splitstartDate[1]+' ' +splitstartDate[2]);

      this.start_time = new Date('Thu Jun 21 2018'+' '+splitstartDate[1]+':00 GMT+0530');

      this.starttimeMeridian = splitstartDate[2];

      var splitendDate = editinstancedata.schedule_end_date.split(" ");
      this.getEditEndDate = splitendDate[0]
      var date3 = new Date(splitendDate[0]);
      var getmonth2 = date3.toLocaleDateString();

      var date2 = getmonth2.split('/');
      this.scheduledEndDate = { date: { year: +date2[2], month: +date2[0], day: +date2[1] } };
      var b = this.tConvert(splitendDate[1]+' ' +splitendDate[2]);

      this.end_time = new Date('Thu Jun 21 2018'+' '+b+':00 GMT+0530');
      this.endtimeMeridian = splitendDate[2];
      this.test_Schedule.instance_unique_id = editinstancedata.instance_unique_id
      // delete this.test_Schedule.schedule_end_date;
      // delete this.test_Schedule.schedule_start_date;


      this.scheduleTestMetaData(testdata);
    }
  }

  selectscheduleType(type,template: TemplateRef<any>){
    this.scheduleType = type;
    this.searchUsers = '';
    this.test_Schedule.schedule_datas = [];
    this.userNameLists = [];
    if(this.test_Schedule.instance_unique_id == undefined){
      this.test_Schedule.schedule_for = type;
    }else{
      this.modalRef = this.modalService.show(
        template,
        Object.assign({}, { class: ' modal-sm' },this.config),

      );
      this.defaultSelectType= false;
    }


  }

  cancelChangeScheduleType(){

    this.modalRef.hide();
    this.test_Schedule.schedule_for = this.test_Schedule.schedule_for;

    this.defaultSelectType= true;
  }

  changeScheduleType(){
    this.test_Schedule.schedule_for = this.scheduleType;
    this.modalRef.hide();
    this.defaultSelectType= true;
    this.test_Schedule.schedule_datas = [];
  }

  isValid(event: boolean): void {

  }


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

    if(this.scheduledStartDate.formatted === this.timeZoneCurreentDate){ //checking wether the today date of the timezone and user selecting dates are equals.


      if(this.scheduledStartDate.formatted === this.scheduledEndDate.formatted){ //checking from UI end, wether the start date and the end  dates are equals.

        var dates = new Date();
        var dynamicTimeZone = new Date().toLocaleString("en-US", {
          timeZone: this.timezoneValue
        });
        this.timeStamp = dynamicTimeZone;      
        var time = Number(dynamicTimeZone);
        var times = new Date(new Date(dynamicTimeZone).getTime() + 60 * 60 * 24 * 1000);
       
        this.convertTime = times.toString();
        let splittedUserTime = this.start_time.split(':');
        this.dateTime(splittedUserTime[0], splittedUserTime[1]);
      } 
      else {
   
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
        if(this.scheduledStartDate.formatted === this.timeZoneCurreentDate){
          var dynamicTimeZone = new Date().toLocaleString("en-US", {
            timeZone: this.timezoneValue
          });
          
          var time = Number(dynamicTimeZone);
          var times = new Date(new Date(dynamicTimeZone).getTime() + 60 * 60 * 24 * 1000);
          this.convertTime = times.toString();
          let splittedUserTime = this.start_time.split(':');
          this.getCurrenDates(splittedUserTime[0], splittedUserTime[1]);
        }  
  
      }
    }

    
  }

  
  getCurrenDates(hourValue, minuteValue) {


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

    //end time
    var endTime = this.end_time.split(':');
    var endTime_Hour = endTime[0];
    var endTime_Minute = endTime[1];

    if(endTime_Hour < hourValue && (endTime_Minute <= minuteValue || endTime_Minute > minuteValue)){
      this.endTimeErrShow = true;
    }
    if(endTime_Hour === hourValue && (endTime_Minute === minuteValue || endTime_Minute <= minuteValue)){
      this.endTimeErrShow = true;
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

  // validation for start time
  StartTimechanged(event){
   this.startTimeErr = false;
   if(event != null){
      var strDateTime = event;
      var myDate = new Date(strDateTime);
      var convertedTime = myDate.toLocaleString('en-GB');
      var splitStrtTimeDate = convertedTime.split(',');
      var splitstarttime = splitStrtTimeDate[1].split(':')
      this.startTimeHours = splitstarttime[0].trim();
      // if((this.startTimeHours == '00' && splitstarttime[1] == '00') || this.startTimeHours == '00'){
      //   this.startTimeErr = true;
      // }
      this.startTimeMinutes = splitstarttime[1];
      this.start_time =  splitstarttime[0].trim() + ':'+splitstarttime[1].trim();
      this.getTime();
      
      // this.startTimeErr = false;
    }else{
      this.startTimeErr = true;
    }
  }

  // validation for end time
  EndTimechanged(event){

    this.endTimeErr = false;
    if(event != null){
       var strDateTime = event;
       var myDate = new Date(strDateTime);
       var convertedTime = myDate.toLocaleString('en-GB');
       var splitEndTimeDate = convertedTime.split(',');
       var splitendtime = splitEndTimeDate[1].split(':');
       this.endTimeHours = splitendtime[0].trim();
      //  if((this.endTimeHours == '00' && splitendtime[1] == '00')|| this.endTimeHours == '00'){
      //    this.endTimeErr = true;
      //  }
       this.endTimeMinutes = splitendtime[1];
       this.end_time =  splitendtime[0].trim() + ':'+splitendtime[1].trim();
       this.getTime();
    }else{
      this.endTimeErr = true;
    }
  }


  // openscheduleinstance function

  openScheduleInstance(testId){
    if(this.testInstance != testId){
      this.testInstance = testId;
      localStorage.setItem('testid',testId);
    }else{
      this.testInstance = -1;
    }


  }

  getInstanceId(schd_inst_id,test_iD){
    this.getItemService.getScheduleInstanceDetails(schd_inst_id,test_iD);
    this.router.navigateByUrl('Tests/TestTackingDetails');
  }

  SkipErrUser(value){
    this.test_Schedule.skip_error_user = !value;


  }

  viewTestPopupClose(){
    this.testIns = true;
    this.testInstance = -1;
    this.modalRef.hide();
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
        this.timeZoneName = localStorage.getItem('TZNM');
        this.timezoneValue = localStorage.getItem('TZNMVL');

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
          window.location.href=credentials.accountUrl;
          // window.location.href='http://accounts.scora.in';
        }
        else{
          this.router.navigateByUrl('pages/serverError');
        }

      }
    );
  }



  ShowReportsFun(testId, length) {
    // this.showReportTest = true;
    // this.activeTabDet = 1;
    this.miniMumScore_Value = 1;
    this.scoreOrPercValue = null;
    this.selectValue = null;

    if(this.authService.canActivate()){
      if(length !== 0) {
        this.selectAllInstance = false;
        this.selectAllGroup = false;
        this.selectAllUsers = false;
        this.finalResultData = undefined;
        this.disableReporBtn = false;
        this.showLoad = true;
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.get(credentials.host +"/get_test_details/" + this.cookieService.get('_PAOID') + '/' + testId,{headers : headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
          data => {
            this.showReportTest = true;
            this.activeTabDet = 1;
            this.showLoad = false;
            this.getMetaForProfileSummary = data;
            for(let i=0;i<this.getMetaForProfileSummary.test.length;i++) {
              if(this.getMetaForProfileSummary.test[i].schedules.length != 0) {
                for(let j=0;j<this.getMetaForProfileSummary.test[i].schedules.length;j++) {
                  this.getMetaForProfileSummary.test[i].schedules[j].is_selected = false;
                }
              }

              if(this.getMetaForProfileSummary.test[i].groups.length != 0) {
                for(let k=0;k<this.getMetaForProfileSummary.test[i].groups.length;k++) {
                  this.getMetaForProfileSummary.test[i].groups[k].is_selected = false;
                  if(this.getMetaForProfileSummary.test[i].groups[k].users_in_group.length != 0) {
                    for(let l=0;l<this.getMetaForProfileSummary.test[i].groups[k].users_in_group.length;l++) {
                      this.getMetaForProfileSummary.test[i].groups[k].users_in_group[l].is_selected = false;
                    }
                  }
                }
              }

              if(this.getMetaForProfileSummary.test[i].users.length != 0) {
                for(let m=0;m<this.getMetaForProfileSummary.test[i].users.length;m++) {
                  this.getMetaForProfileSummary.test[i].users[m].is_selected = false;
                }
              }

              if(this.getMetaForProfileSummary.test[i].custom_fields.length != 0) {
                for(let n=0;n<this.getMetaForProfileSummary.test[i].custom_fields.length;n++) {
                  this.getMetaForProfileSummary.test[i].custom_fields[n].is_selected = false;
                  if(this.getMetaForProfileSummary.test[i].custom_fields[n].custom_field_values.length != 0) {
                    for(let o=0;o<this.getMetaForProfileSummary.test[i].custom_fields[n].custom_field_values.length;o++) {
                      this.getMetaForProfileSummary.test[i].custom_fields[n].custom_field_values[o].is_selected = false;
                    }
                  }
                }
              }

              if(this.getMetaForProfileSummary.test[i].itemset.length != 0) {
                for(let p=0;p<this.getMetaForProfileSummary.test[i].itemset.length;p++) {
                  this.getMetaForProfileSummary.test[i].itemset[p].is_selected = false;
                  if(this.getMetaForProfileSummary.test[i].itemset[p].sections.length != 0) {
                    for(let q=0;q<this.getMetaForProfileSummary.test[i].itemset[p].sections.length;q++) {
                      this.getMetaForProfileSummary.test[i].itemset[p].sections[q].is_selected = false;
                    }
                  }
                }
              }

              // if(this.getMetaForProfileSummary.test[i].column_names.length != 0) {
              //   var tempArr = [];

              //   for(var s=0;s<this.getMetaForProfileSummary.test[i].column_names.length;s++) {

              //     if(s == 0 || s == 1 || s == 2) {
              //       var tempObj = new Object({
              //         field: this.getMetaForProfileSummary.test[i].column_names[s],
              //         is_selected: true
              //       });
              //     } else {
              //       var tempObj = new Object({
              //         field: this.getMetaForProfileSummary.test[i].column_names[s],
              //         is_selected: false
              //       });
              //     }

              //     tempArr.push(tempObj);
              //   }

              //   this.getMetaForProfileSummary.test[i].column_names = [];
              //   this.getMetaForProfileSummary.test[i].column_names = tempArr;
              //   this.columnDefs =  this.getMetaForProfileSummary.test[i].column_names;

              // }
              for(let data of this.getMetaForProfileSummary.test){
                for(let column of data.column_names){
                  if(column.field === "Name" || column.field === "Score" || column.field === "Rank" || column.field === "Email" || column.field === "Result"){
                    column.is_selected = true

                  }else{
                    column.is_selected = false
                  }
                }
              }
               //set the column checkbox value initially true in the filter by column popup
                let temp = [];
                for(let dataValue of this.getMetaForProfileSummary.test){
                temp = dataValue.column_names.filter(obj => obj.is_selected === true);
                }
                this.columnDefs.push(temp);
              for(let dataValue of this.getMetaForProfileSummary.test){
               this.columnNames = dataValue.column_names;
              }

            }


            this.CurrentTestName = this.getMetaForProfileSummary.test[0].Test_Name;

            },

            error => {
              this.showReportTest = false;
              this.showLoad= false;
              if(error.status == 404){
                this.router.navigateByUrl('pages/NotFound');
              }
              else if(error.status == 401){
                this.cookieService.deleteAll();
                 window.location.href=credentials.accountUrl;
                // window.location.href='http://accounts.scora.in';
              }
              else{
                this.router.navigateByUrl('pages/serverError');
              }

            }
        );
      } else {
        this.disableReporBtn = true;
      }
    }

  }

  showCurrentGroups(template: TemplateRef<any>, curGrp) {
    this.getCurrentGrpDet = curGrp;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-md' },this.config),

    );
  }

  showCurrentUser(template: TemplateRef<any>, curUsr) {
    this.getCurrentUserDet = curUsr;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-sm' },this.config),

    );
  }

  showCurrentCFValues(template: TemplateRef<any>, curUsr) {
    this.getCurrentCFDet = curUsr;
      let checkedCFValue = false;
      for(let data of this.getCurrentCFDet.custom_field_values){
        if(data.is_selected === false){
          checkedCFValue = true;
          break;
        }
      }
      if(checkedCFValue === true){
        this.selectAllCustomFields = false;
      }
      else{
        this.selectAllCustomFields = true;
      }
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-sm' },this.config),

    );
  }

  allTestInstacnce(obj){
    if(obj === true){
      for(let data of this.getMetaForProfileSummary.test[0].schedules){
          data.is_selected = true;
    }
    }else{
      for(let data of this.getMetaForProfileSummary.test[0].schedules){
        data.is_selected = false;
      }
    }
  }

  allTestGroup(obj){
    if(obj === true){
      for(let data of this.getMetaForProfileSummary.test[0].groups){
          data.is_selected = true;
    }
  }else{
    for(let data of this.getMetaForProfileSummary.test[0].groups){
      data.is_selected = false;
  }
  }
  }

  allTestUsers(obj){
    if(obj === true){
      for(let data of this.getMetaForProfileSummary.test[0].users){
          data.is_selected = true;
    }
  }else{
    for(let data of this.getMetaForProfileSummary.test[0].users){
      data.is_selected = false;
  }
  }
  }
  // allTestCustomFields(obj){
  //   if(obj === true){
  //     for(let data of this.getMetaForProfileSummary.test[0].custom_fields){
  //         data.is_selected = true;
  //   }
  // }else{
  //   for(let data of this.getMetaForProfileSummary.test[0].custom_fields){
  //     data.is_selected = false;
  // }
  // }
  // }

  selecAllCustomFieldValues(obj){

    if(obj === true){
      for(let data of this.getCurrentCFDet.custom_field_values){
          data.is_selected = true;
    }
  }else{
    for(let data of this.getCurrentCFDet.custom_field_values){
      data.is_selected = false;
   }
  }
  }

  showColumnSelect(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-md' },this.config),

    );
  }
  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
  hideGroupModel(){
    this.modalRef.hide();
  }


  hideUserModel(){
    this.modalRef.hide();
  }

  hideCFModel() {
    this.modalRef.hide();
 
    let checkedCF = false;
    for(let data of this.getCurrentCFDet.custom_field_values){
      if(data.is_selected === true)
      {
        checkedCF= true;
        break;
      }
      }
      if(checkedCF === true){
        this.getCurrentCFDet.is_selected = true;
      }
      else{
        this.getCurrentCFDet.is_selected = false;
      }

  }

  changeTestinstance(vals) {
    vals.is_selected = !vals.is_selected;

    var checkSchedule;
    checkSchedule = false;
    for(var i=0;i<this.getMetaForProfileSummary.test[0].schedules.length;i++) {
      if(this.getMetaForProfileSummary.test[0].schedules[i].is_selected ==  false) {
        checkSchedule = true;
        break;
      }
    }

    if(checkSchedule == true) {
      this.selectAllInstance = false;
    } else {
      this.selectAllInstance = true;
    }

  }

  changeUserGroups(vals) {
    vals.is_selected = !vals.is_selected;
  }

  changeUsersInGroup(vals) {
    vals.is_selected = !vals.is_selected;
  }

  changeUsers(vals) {

    vals.is_selected = !vals.is_selected;

    var checkUsers;
    checkUsers = false;
    for(var i=0;i<this.getMetaForProfileSummary.test[0].users.length;i++) {
      if(this.getMetaForProfileSummary.test[0].users[i].is_selected ==  false) {
        checkUsers = true;
        break;
      }
    }

    if(checkUsers == true) {
      this.selectAllUsers = false;
    } else {
      this.selectAllUsers = true;
    }

  }

  changeCF(vals) {
    vals.is_selected = !vals.is_selected;

    if(vals.is_selected === false) {
      for(var i=0;i<vals.custom_field_values.length;i++) {
        vals.custom_field_values[i].is_selected = false;
      }
    }
    if(vals.is_selected === true){
      for(let data of vals.custom_field_values){
        data.is_selected = true;
      }
    }
  }

  changeCFValues(vals) {
    vals.is_selected = !vals.is_selected;
    let checkedCF = false;
    for(let data of this.getCurrentCFDet.custom_field_values){
      if(data.is_selected === false)
      {
        checkedCF= true;
        break;
      }
    }
    if(checkedCF === true){
      this.selectAllCustomFields = false;
    }else{
      this.selectAllCustomFields = true;
    }
  }

  changeItemsets(vals) {
    vals.is_selected = !vals.is_selected;
  }

  changeItemsetSection(vals) {
    vals.is_selected = !vals.is_selected;
  }

  changeAttempts(ind) {
    this.selectedAttemptInd = ind;
  }

  changeScoringType(ind) {
    this.selectScoreTypeInd = ind;
  }

  changeScoringCriteria(ind) {
    this.selectScoringCriteriaInd = ind;
  }

  selectAllUsersInGroup(curGro) {

  }

  goToThree() {
    this.showError = false;
    this.finalStructureForReport = new FinalStructure();
    this.finalStructureForReport.org_id = this.getMetaForProfileSummary.org_id;
    this.finalStructureForReport.test_id = this.getMetaForProfileSummary.test[0].Test_ID;
    this.finalStructureForReport.schedules = [];
    this.finalStructureForReport.groups = [];
    this.finalStructureForReport.users = [];
    this.finalStructureForReport.custom_fields = [];


    if (this.miniMumScore_Value === 1) {
      this.minimum_Score_label = true;
      this.showTest_Info_1 = false;
      this.showTest_Info_2 = false;
      this.minimum_Score_Status = true;
      this.scoreOrPercValue = null;
      this.selectValue = null;
    }
    if (this.miniMumScore_Value === 2) {
      if(this.selectValue === "1"){
        this.showTest_Info_1 = true;
        this.showTest_Info_2 = false;
        this.show_label = 'Raw Score';
      }else if(this.selectValue === "2"){
        this.showTest_Info_2 = true;
        this.showTest_Info_1 = false;
        this.show_labels = 'Percentage';
      }
      if((this.scoreOrPercValue === null && this.scoreOrPercValue === '' && this.selectValue === null) || (this.scoreOrPercValue === null || this.scoreOrPercValue === '' || this.selectValue === null)){
        this.showError = true;
      }
      this.minimum_Score_label = false;
      this.minimum_Score_Status = false;
      this.scoreOrPercValue = this.scoreOrPercValue;
      this.selectValue = this.selectValue;
    }
   

    for(var i=0;i<this.getMetaForProfileSummary.test.length;i++){
      // Schedules
      for(var j=0;j<this.getMetaForProfileSummary.test[i].schedules.length;j++){
        if(this.getMetaForProfileSummary.test[i].schedules[j].is_selected == true) {
          this.finalStructureForReport.schedules.push(this.getMetaForProfileSummary.test[i].schedules[j]);
        }
      }

      // Groups
      for(var k=0;k<this.getMetaForProfileSummary.test[i].groups.length;k++){
        if(this.getMetaForProfileSummary.test[i].groups[k].is_selected == true) {
          this.finalStructureForReport.groups.push(this.getMetaForProfileSummary.test[i].groups[k]);
          var tempArr;
          tempArr = [];
          for(var l=0;l<this.getMetaForProfileSummary.test[i].groups[k].users_in_group.length;l++) {
            if(this.getMetaForProfileSummary.test[i].groups[k].users_in_group[l].is_selected == true) {
              tempArr.push(this.getMetaForProfileSummary.test[i].groups[k].users_in_group[l]);
            }
          }
          this.finalStructureForReport.users = tempArr;
        }
      }

      for(var m=0;m<this.getMetaForProfileSummary.test[i].users.length;m++){
        if(this.getMetaForProfileSummary.test[i].users[m].is_selected == true) {
          this.finalStructureForReport.users.push(this.getMetaForProfileSummary.test[i].users[m]);
        }
      }

      for(var n=0;n<this.getMetaForProfileSummary.test[i].custom_fields.length;n++){
        if(this.getMetaForProfileSummary.test[i].custom_fields[n].is_selected == true) {
          let copyCFObj = Object.assign({}, this.getMetaForProfileSummary.test[i].custom_fields[n]);
          this.finalStructureForReport.custom_fields.push(copyCFObj);
        }
      }

      if(this.finalStructureForReport.custom_fields.length != 0) {

        for(let data of this.finalStructureForReport.custom_fields){

            let copyObj = Object.assign({}, data);
            data.custom_field_values = copyObj.custom_field_values.filter(obj => obj.is_selected === true);

        }

      }

    }

    // min,max,avg,first,last
    if (this.selectedAttemptInd == 0) {
      this.finalStructureForReport.scoring_aggregate = "first";
    } else if (this.selectedAttemptInd == 1) {
      this.finalStructureForReport.scoring_aggregate = "last";
    } else if (this.selectedAttemptInd == 2) {
      this.finalStructureForReport.scoring_aggregate = "avg";
    } else if (this.selectedAttemptInd == 3) {
      this.finalStructureForReport.scoring_aggregate = "max";
    } else if (this.selectedAttemptInd == 4) {
      this.finalStructureForReport.scoring_aggregate = "min";
    }

    // total,sectionwise
    if (this.selectScoreTypeInd == 0) {
      this.finalStructureForReport.scoring_type = "total";
    } else if (this.selectScoreTypeInd == 1) {
      this.finalStructureForReport.scoring_type = "sectionwise";
    }

    // min,max,sum,avg
    if (this.selectScoringCriteriaInd == 0) {
      this.finalStructureForReport.section_scoring_aggregate = "sum";
    } else if (this.selectScoringCriteriaInd == 1) {
      this.finalStructureForReport.section_scoring_aggregate = "max";
    } else if (this.selectScoringCriteriaInd == 2) {
      this.finalStructureForReport.section_scoring_aggregate = "min";
    } else if (this.selectScoringCriteriaInd == 3) {
      this.finalStructureForReport.section_scoring_aggregate = "avg";
    }

    if(this.showError === false){
      this.activeTabDet = 3;
    }

  }
  downloadSummary(){
    if(this.authService.canActivate()){
      this.showLoad = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/test_summary/" + this.cookieService.get('_PAOID'),{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {
         
        },

          error => {

           }
            );
    }
  }
  generateReport() {
    this.showLoad = true;
    this.finalStructureForReport = new FinalStructure();
    this.finalStructureForReport.org_id = this.getMetaForProfileSummary.org_id;
    this.finalStructureForReport.test_id = this.getMetaForProfileSummary.test[0].Test_ID;
    this.finalStructureForReport.schedules = [];
    this.finalStructureForReport.groups = [];
    this.finalStructureForReport.users = [];
    this.finalStructureForReport.custom_fields = [];

    //filtering the column name which are all set to true by using the FILTER BY COLUMN popup in 3rd tab
    let trueColumn = this.columnNames.filter(obj => obj.is_selected === true);
    this.columnNamesArray = trueColumn;
    this.columnDefs = this.columnNamesArray;

    for(let data of this.columnDefs){
      if(data.field === "Result"){
        data.cellClass = function(params) {
              return params.value === "Pass" ? "rag-green" : "rag-amber";
            }
      break;
          }
    }

    delete this.columnDefs.is_selected;

    for(var i=0;i<this.getMetaForProfileSummary.test.length;i++){
      // Schedules
      for(var j=0;j<this.getMetaForProfileSummary.test[i].schedules.length;j++){
        if(this.getMetaForProfileSummary.test[i].schedules[j].is_selected == true) {
          this.finalStructureForReport.schedules.push(this.getMetaForProfileSummary.test[i].schedules[j]);
        }
      }

      // Groups
      for(var k=0;k<this.getMetaForProfileSummary.test[i].groups.length;k++){
        if(this.getMetaForProfileSummary.test[i].groups[k].is_selected == true) {
          this.finalStructureForReport.groups.push(this.getMetaForProfileSummary.test[i].groups[k]);
          var tempArr;
          tempArr = [];
          for(var l=0;l<this.getMetaForProfileSummary.test[i].groups[k].users_in_group.length;l++) {
            if(this.getMetaForProfileSummary.test[i].groups[k].users_in_group[l].is_selected == true) {
              tempArr.push(this.getMetaForProfileSummary.test[i].groups[k].users_in_group[l]);
            }
          }
          this.finalStructureForReport.users = tempArr;
        }
      }

      for(var m=0;m<this.getMetaForProfileSummary.test[i].users.length;m++){
        if(this.getMetaForProfileSummary.test[i].users[m].is_selected == true) {
          this.finalStructureForReport.users.push(this.getMetaForProfileSummary.test[i].users[m]);
        }
      }

      for(var n=0;n<this.getMetaForProfileSummary.test[i].custom_fields.length;n++){
        if(this.getMetaForProfileSummary.test[i].custom_fields[n].is_selected == true) {
          let copyCFObj = Object.assign({}, this.getMetaForProfileSummary.test[i].custom_fields[n]);
          this.finalStructureForReport.custom_fields.push(copyCFObj);
        }
      }

      if(this.finalStructureForReport.custom_fields.length != 0) {

        for(let data of this.finalStructureForReport.custom_fields){

            let copyObj = Object.assign({}, data);
            data.custom_field_values = copyObj.custom_field_values.filter(obj => obj.is_selected === true);

        }

      }

    }
    
    if (this.miniMumScore_Value === 1) {
    this.finalStructureForReport.minimum_score =  this.minimum_Score_Status = true;
    this.finalStructureForReport.mark =  this.scoreOrPercValue = null;
    this.finalStructureForReport.mark_type =   this.selectValue = null;
    }
    if (this.miniMumScore_Value === 2) {
      this.finalStructureForReport.minimum_score =   this.minimum_Score_Status = false;
      this.finalStructureForReport.mark =  this.scoreOrPercValue = this.scoreOrPercValue;
      this.finalStructureForReport.mark_type = this.selectValue = this.selectValue;
    }



    // min,max,avg,first,last
    if (this.selectedAttemptInd == 0) {
      this.finalStructureForReport.scoring_aggregate = "first";
    } else if (this.selectedAttemptInd == 1) {
      this.finalStructureForReport.scoring_aggregate = "last";
    } else if (this.selectedAttemptInd == 2) {
      this.finalStructureForReport.scoring_aggregate = "avg";
    } else if (this.selectedAttemptInd == 3) {
      this.finalStructureForReport.scoring_aggregate = "max";
    } else if (this.selectedAttemptInd == 4) {
      this.finalStructureForReport.scoring_aggregate = "min";
    }

    // total,sectionwise
    if (this.selectScoreTypeInd == 0) {
      this.finalStructureForReport.scoring_type = "total";
    } else if (this.selectScoreTypeInd == 1) {
      this.finalStructureForReport.scoring_type = "sectionwise";
    }

    // min,max,sum,avg
    if (this.selectScoringCriteriaInd == 0) {
      this.finalStructureForReport.section_scoring_aggregate = "sum";
    } else if (this.selectScoringCriteriaInd == 1) {
      this.finalStructureForReport.section_scoring_aggregate = "max";
    } else if (this.selectScoringCriteriaInd == 2) {
      this.finalStructureForReport.section_scoring_aggregate = "min";
    } else if (this.selectScoringCriteriaInd == 3) {
      this.finalStructureForReport.section_scoring_aggregate = "avg";
    }



    if(this.finalStructureForReport) {
      if(this.authService.canActivate()){
        var body = this.finalStructureForReport;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        return this.http.post(credentials.host + '/get_test_reports', body,{headers: headers})
        .map(res => res.json())
        .catch((e: any) =>{
          return Observable.throw(e)
        } )

        .subscribe(
            data => {
              this.showLoad = false;
              this.finalResultData = data;
              this.rowData = this.finalResultData;
                if(this.finalResultData != undefined) {
                this.showSelectedData = true;
                this.showReports = true;

                // if(this.finalResultData.length != 0) {
                //   for(var i=0;i<this.finalResultData.length;i++) {
                //     if(this.finalResultData[i].custom_fields.length != 0) {
                //       for(var j=0;j<this.finalResultData[i].custom_fields.length;j++) {
                //         this.finalResultData[i].custom_fields[j].is_selected = false;
                //       }
                //     }
                //   }
                // }


                // if(this.finalResultData.length != 0) {
                //   for(var u=0;u<this.finalResultData.length;u++) {
                //     if(this.finalResultData[u].custom_fields.length != 0) {
                //       for(var y=0;y<this.finalResultData[u].custom_fields.length;y++) {
                //         for(var j=0;j<this.getMetaForProfileSummary.test[0].column_names.length;j++) {
                //           if(this.getMetaForProfileSummary.test[0].column_names[j].col_name == this.finalResultData[u].custom_fields[y].label) {
                //             this.finalResultData[u].custom_fields[y].is_selected = this.getMetaForProfileSummary.test[0].column_names[j].is_selected;
                //           }
                //         }
                //       }
                //     }
                //   }
                // }
                }


            },
            error => {

              this.showLoad = false;
              if(error.status == 404){
                this.router.navigateByUrl('pages/NotFound');
              }
              else if(error.status == 401){
                this.cookieService.deleteAll();
                window.location.href=credentials.accountUrl;
                // window.location.href='http://accounts.scora.in';
              }
              else{
                this.router.navigateByUrl('pages/serverError');
              }

            }
        );
      }
    }

  }

  chooseColumns(data) {
    data.is_selected = !data.is_selected;
    //filtering the column name which are all set to true by using the FILTER BY COLUMN popup in 3rd tab
    let trueColumn = this.columnNames.filter(obj => obj.is_selected === true);
    this.columnNamesArray = trueColumn;
    this.columnDefs = this.columnNamesArray;
    delete this.columnDefs.isselected;
  }

  // downloadAsExcel() {
  //   const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.myTableElementId.nativeElement);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   /* save to file */
  //   XLSX.writeFile(wb, this.CurrentTestName + '.xlsx');
  // }

  //for downloading the table data in an excel format
  onBtnExportDataAsCsv() {
    this.gridApi.exportDataAsCsv(this.getParams());
  }

  onBtnExportDataAsExcel() {
    this.gridApi.exportDataAsExcel(this.getParams());
  }

   getBooleanValue(checkboxSelector) {
    return document.querySelector(checkboxSelector).checked === true;
  }


   getParams() {
    return {
      allColumns: this.getBooleanValue("#allColumns"),
      columnGroups: this.getBooleanValue("#columnGroups"),
      // columnKeys: this.getBooleanValue("#columnKeys") && ["country", "bronze"],
      // onlySelected: this.getBooleanValue("#onlySelected"),
      // onlySelectedAllPages: this.getBooleanValue("#onlySelectedAllPages"),
      // skipFooters: this.getBooleanValue("#skipFooters"),
      // skipGroups: this.getBooleanValue("#skipGroups"),
      // skipHeader: this.getBooleanValue("#skipHeader"),
      // skipPinnedTop: this.getBooleanValue("#skipPinnedTop"),
      // skipPinnedBottom: this.getBooleanValue("#skipPinnedBottom")
    };

  }
  //end of download table adta as an excel format

}
