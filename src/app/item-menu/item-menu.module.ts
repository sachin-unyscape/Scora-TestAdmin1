import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShareModule } from './../share/share.module';  // shared module to toggle event
import { ItemsRoutingModule } from './itemMenu-routing';  // routin module for different child components
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
// import { SplitModule } from 'ng2-split';
import { AngularSplitModule } from 'angular-split';

//cookie service
import { CookieService } from 'ngx-cookie-service';

//auth service
import { AuthServiceService } from '../auth-service.service';

// chart
import { ChartsModule } from 'ng2-charts';
import 'chart.piecelabel.js';
import { SimpleNotificationsModule } from 'angular2-notifications';
// components
import { ViewItemsComponent } from './view-items/view-items.component';
import { AddNewComponent } from './add-new/add-new.component';
// import { ItemHistoryComponent } from './item-history/item-history.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { BulkUploadItemsListComponent } from './bulk-upload-items-list/bulk-upload-items-list.component';

// Rich text editor
import { QuillEditorModule } from 'ngx-quill-editor';

// infinite scroll
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  imports: [
    // BrowserModule,
    CommonModule,
    ItemsRoutingModule,
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
    // SplitModule,
    AngularSplitModule,
    ChartsModule,
    QuillEditorModule,
    PaginationModule.forRoot(),
    InfiniteScrollModule
  ],
  declarations: [
    ViewItemsComponent,
    AddNewComponent,
    // ItemHistoryComponent,
    BulkUploadComponent,
    BulkUploadItemsListComponent,
    // ItemsComponent
  ],
  providers: [GetItemService,CookieService,AuthServiceService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ItemMenuModule { 
 QuillConfiguration = {
  toolbar: [
	[{ 'size': [false, '10', '16', '22', '36', '48', '72', '144'] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    ['link'],
    ['clean'],
  ],
}
}
