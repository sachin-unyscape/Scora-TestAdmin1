import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShareModule } from './../share/share.module';  // shared module to toggle event
import { ItemsetRoutingModule } from './itemsetMenu.routing';  // routin module for different child components
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

// components
import { ViewItemSetsComponent } from './view-item-sets/view-item-sets.component';
import { AddItemSetsComponent } from './add-item-sets/add-item-sets.component';
// import { ItemSetHistoryComponent } from './item-set-history/item-set-history.component';
import { RequestedItemsetComponent } from './requested-itemset/requested-itemset.component';
import { EditItemSetComponent } from './edit-item-set/edit-item-set.component';


@NgModule({
  imports: [
    // BrowserModule,
    CommonModule,
    ItemsetRoutingModule,
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
    ViewItemSetsComponent,
    AddItemSetsComponent,
    // ItemSetHistoryComponent,
    RequestedItemsetComponent,
    EditItemSetComponent,
  ],
  providers: [GetItemService,CookieService,AuthServiceService],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ItemsetMenuModule { }
