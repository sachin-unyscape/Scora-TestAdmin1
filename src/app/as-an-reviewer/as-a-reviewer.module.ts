import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShareModule } from './../share/share.module';  // shared module to toggle event
import { AsAReviewerRoutingModule } from './as-a-reviewer.routing';  // routin module for different child components
// import {PagesRoutingModule} from '../pages/pages-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';  // drop down module import from bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs'; // tab click function module
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap';
// import { BsDropdownModule } from 'ngx-bootstrap';


import { SharingComponent } from './../share/sharing/sharing.component';
import { LoaderComponent } from './../share/loader/loader.component';
import { GetItemService } from '../get-item.service';
import { TagInputModule } from 'ngx-chips';
//cookie service
import { CookieService } from 'ngx-cookie-service';

//auth service
import { AuthServiceService } from '../auth-service.service';

// chart
import { ChartsModule } from 'ng2-charts';
import 'chart.piecelabel.js';
import { SimpleNotificationsModule } from 'angular2-notifications';

// Rich text editor
import { QuillEditorModule } from 'ngx-quill-editor';

// Component Imports
import { ToReviewComponent } from "./to-review/to-review.component";
import { ChangeRequestedComponent } from "./change-requested/change-requested.component";
import { ApprovedComponent } from "./approved/approved.component";
import { RejectedComponent } from "./rejected/rejected.component";

@NgModule({
  imports: [
    // BrowserModule,
    CommonModule,
    AsAReviewerRoutingModule,
    // PagesRoutingModule,
    ShareModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    TimepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    // BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    TagInputModule,
    ChartsModule,
    QuillEditorModule,
    PaginationModule.forRoot()
  ],
  declarations: [
    // Component Declaration
    ToReviewComponent,
    ChangeRequestedComponent,
    ApprovedComponent,
    RejectedComponent
  ],
  providers: [GetItemService,CookieService,AuthServiceService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AsAReviewerModule { }
