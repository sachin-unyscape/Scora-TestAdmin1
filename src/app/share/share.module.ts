import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './../share/sidebar.directive';
import { NAV_DROPDOWN_DIRECTIVES } from './../share/nav-dropdown.directive';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap';
// import { BsDropdownModule } from 'ngx-bootstrap';

import { SharingComponent } from './sharing/sharing.component';
import { LoaderComponent } from './loader/loader.component'
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
// import {PagesRoutingModule} from '../pages/pages-routing.module';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { MyDatePickerModule } from 'mydatepicker';
import { MyDateRangePickerModule } from 'mydaterangepicker';
// import { SplitPaneModule } from 'ng2-split-pane/lib/ng2-split-pane';
// import { SplitModule } from 'ng2-split'
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { ImageUploadModule } from "angular2-image-upload";
import { UiSwitchModule } from 'ngx-toggle-switch/src';
import { FancyImageUploaderModule  } from 'ng2-fancy-image-uploader';
import { GetItemService } from '../get-item.service';
import { TagInputModule } from 'ngx-chips';
import { AngularSplitModule } from 'angular-split';
import { P404Component } from '../pages/404.component';
import { P500Component } from '../pages/500.component';
import { LoginComponent } from '../pages/login.component';
// import { P401Component } from '../author/pages/p401.component';
//cookie service
import { CookieService } from 'ngx-cookie-service';

//auth service
import { AuthServiceService } from '../auth-service.service';

// rich text editor
import { CKEditorModule } from 'ng2-ckeditor';

// chart
import { ChartsModule } from 'ng2-charts';
import 'chart.piecelabel.js';

import { SimpleNotificationsModule } from 'angular2-notifications';
// Rich text editor
import { QuillEditorModule } from 'ngx-quill-editor';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    TimepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    // BsDropdownModule.forRoot(),
    FormsModule , ReactiveFormsModule,
    // PagesRoutingModule,

    Angular2FontawesomeModule,
    AngularMultiSelectModule,
    MyDatePickerModule,
    MyDateRangePickerModule,
    //  SplitPaneModule,
    //  SplitModule,
     DragulaModule,
     Ng2DragDropModule.forRoot(),
     ImageUploadModule.forRoot(),
     UiSwitchModule,
     FancyImageUploaderModule ,
     TagInputModule,
     AngularSplitModule,
     CKEditorModule,
     ChartsModule,
     QuillEditorModule,
     PaginationModule.forRoot()

  ],
  declarations: [
    NAV_DROPDOWN_DIRECTIVES,
    SIDEBAR_TOGGLE_DIRECTIVES,
    SharingComponent,
    LoaderComponent
  ],
   exports: [
    NAV_DROPDOWN_DIRECTIVES,
    SIDEBAR_TOGGLE_DIRECTIVES,
    SharingComponent,
    LoaderComponent,
    TooltipModule,
    // BsDropdownModule,
    Angular2FontawesomeModule,
    AngularMultiSelectModule,
    MyDatePickerModule,
    MyDateRangePickerModule,
    //  SplitPaneModule,
    //  SplitModule,
     DragulaModule,
     Ng2DragDropModule,
     ImageUploadModule,
     UiSwitchModule,
     FancyImageUploaderModule ,
     TagInputModule,
     AngularSplitModule,
     CKEditorModule,
     ChartsModule,
     QuillEditorModule,
     PaginationModule
     
  ],
  providers:[GetItemService,CookieService,AuthServiceService]
})
export class ShareModule { }
