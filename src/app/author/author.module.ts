import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ShareModule } from './../share/share.module';  // shared module to toggle event

import { AuthorRoutingModule } from './author-routing.module';  // routin module for different child components

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';  // drop down module import from bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs'; // tab click function module
import { TooltipModule } from 'ngx-bootstrap/tooltip'; // show tooltip
import { ModalModule, PopoverModule } from 'ngx-bootstrap'; // show modal popup
import { AlertModule } from 'ngx-bootstrap'; // show alert
import { TimepickerModule } from 'ngx-bootstrap'; // timepicker
import { TypeaheadModule } from 'ngx-bootstrap'; // auto suggesstion
import { PaginationModule } from 'ngx-bootstrap'; // pagination


import { SharingComponent } from './../share/sharing/sharing.component';
import { LoaderComponent } from './../share/loader/loader.component';
import { GetItemService } from '../get-item.service';

import { TagInputModule } from 'ngx-chips';

import { AngularSplitModule } from 'angular-split';

//cookie service
import { CookieService } from 'ngx-cookie-service';

//auth service
import { AuthServiceService } from '../auth-service.service';


// chart
import { ChartsModule } from 'ng2-charts';
import 'chart.piecelabel.js';

// for notification
import { SimpleNotificationsModule } from 'angular2-notifications';

// Rich text editor
import { QuillEditorModule } from 'ngx-quill-editor';

// components in author module
//import { DashboardComponent } from './dashboard/dashboard.component'; // dashboard
import { ProfileComponent } from './profile/profile.component';
import { MetaDataComponent } from './meta-data/meta-data.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { UserGroupsComponent } from './user-groups/user-groups.component';
import { ScoringComponent } from './scoring/scoring.component';
import { DefaultComponent } from './default/default.component';
import { TrashItemsComponent } from './trash-items/trash-items.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PrintCertificatesComponent } from './print-certificates/print-certificates.component';
import { ReportsComponent } from './reports/reports.component';

import { AuthorNavbarComponent } from "./author-navbar/author-navbar.component";
import { DataTemplatesComponent } from './data-templates/data-templates.component';
import { PagerService } from '../_services/index';
import { AddUserGroupComponent } from './add-user-group/add-user-group.component';
import { ViewUserGroupComponent } from './view-user-group/view-user-group.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SelectThemeComponent } from './select-theme/select-theme.component';
import { TimezoneSetupComponent } from './timezone-setup/timezone-setup.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import { DatatemplatesComponent } from './datatemplates/datatemplates.component';
import { AnswerPoolComponent } from '../item-menu/add-new/answer-pool.component';
import { ComprehensionComponent } from '../item-menu/add-new/comprehension.component';
import { DRODPOWNComponent } from '../item-menu/add-new/drop-down.component';
import { FileUploadComponent } from '../item-menu/add-new/file-upload.component';
import { FreeTextComponent } from '../item-menu/add-new/free-text.component';
import { InterchangeComponent } from '../item-menu/add-new/interchange.component';
import { MatrixComponent } from '../item-menu/add-new/matrix.component';
import { MCQComponent } from '../item-menu/add-new/mcq.component';
import { SelectionComponent } from '../item-menu/add-new/selection.component';
import { TRUEFALSEComponent } from '../item-menu/add-new/true-false.component';
import { RubricListingComponent } from './test-admin1/rubric-listing/rubric-listing.component';
import { ViewRubricComponent } from './test-admin1/view-rubric/view-rubric.component';
import { CreateRubricComponent } from './test-admin1/create-rubric/create-rubric.component';
import { EditorModule } from "@tinymce/tinymce-angular";
import { ScoraInsightsComponent } from './test-admin1/scora-insights/scora-insights.component';
import { Ng5SliderModule } from 'ng5-slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { TestbankListingComponent } from './test-admin1/testbank-listing/testbank-listing.component';
import { ViewItemsComponent } from './test-admin1/view-items/view-items.component';
import { ViewItemsEditComponent } from './test-admin1/view-items-edit/view-items-edit.component';
import { CreateTestSchemaComponent } from './test-admin1/create-test-schema/create-test-schema.component';
import { MarkingSchemaComponent } from './test-admin1/marking-schema/marking-schema.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';


@NgModule({
  imports: [
    // BrowserModule,
    CommonModule,
    AuthorRoutingModule,
    // PagesRoutingModule,
    ShareModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    SimpleNotificationsModule.forRoot({timeOut:3000}),
    TimepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    // BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    TagInputModule,
    // SplitModule,
    AngularSplitModule,
    ChartsModule,
    QuillEditorModule,
    InfiniteScrollModule,
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    EditorModule,
    Ng5SliderModule,
    NgxSliderModule,
    MyDateRangePickerModule,
    AngularMultiSelectModule
  ],
  declarations: [
   // DashboardComponent,
    ProfileComponent,
    MetaDataComponent,
    ManageUsersComponent,
    UserGroupsComponent,
    ScoringComponent,
    DefaultComponent,
    TrashItemsComponent,
    PrintCertificatesComponent,
    ReportsComponent,
    AuthorNavbarComponent,
    DataTemplatesComponent,
    AddUserGroupComponent,
    ViewUserGroupComponent,
    // WelcomeComponent,
    // SelectThemeComponent,
    // TimezoneSetupComponent,
	AdminDashboardComponent,
	 MCQComponent,
    AnswerPoolComponent,
    ComprehensionComponent,
    DRODPOWNComponent,
    FileUploadComponent,
    FreeTextComponent,
    InterchangeComponent,
    MatrixComponent,
    SelectionComponent,
    TRUEFALSEComponent,
    DatatemplatesComponent,
    RubricListingComponent,
    ViewRubricComponent,
    CreateRubricComponent,
    ScoraInsightsComponent,
    TestbankListingComponent,
    ViewItemsComponent,
    ViewItemsEditComponent,
    CreateTestSchemaComponent,
    MarkingSchemaComponent,
  ],
  providers: [GetItemService,CookieService,PagerService,AuthServiceService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AuthorModule { }
