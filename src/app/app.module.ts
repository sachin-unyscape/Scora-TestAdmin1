// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy,CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { TabsModule } from 'ng2-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap';
import { TypeaheadModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap';
// import { BsDropdownModule } from 'ngx-bootstrap';

import { HttpModule, JsonpModule } from '@angular/http';
// import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';


// import  * as ng2Bootstrap from 'ng2-bootstrap/ng2-bootstrap';

// Shared module import
import { ShareModule } from './share/share.module';
// import { AuthorModule } from './author/author.module';

// module import for external library
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { MyDatePickerModule } from 'mydatepicker';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { Ng2DragDropModule } from 'ng2-drag-drop';
import { ImageUploadModule } from "angular2-image-upload";
import { UiSwitchModule } from 'ngx-toggle-switch/src';
import { FancyImageUploaderModule } from 'ng2-fancy-image-uploader';
import { GetItemService } from './get-item.service';
import { TagInputModule } from 'ngx-chips';
import { AngularSplitModule } from 'angular-split';

//cookie service
import { CookieService } from 'ngx-cookie-service';

//auth service
import { AuthServiceService } from './auth-service.service';

// rich text editor
import { CKEditorModule } from 'ng2-ckeditor';

// chart
import { ChartsModule } from 'ng2-charts';
import 'chart.piecelabel.js';

import { SimpleNotificationsModule } from 'angular2-notifications';

// Rich text editor
import { QuillEditorModule } from 'ngx-quill-editor';
import { PlanExpiresComponent } from './plan-expires/plan-expires.component';
import { PricingComponent } from './pricing/pricing.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SafePipePipe } from './safe-pipe.pipe';
import { PageLoadComponent } from './page-load/page-load.component';
//export to excel format
import { ExcelService } from '../app/excel.service';
import { HttpClientModule } from '@angular/common/http';
import { RESTApiService } from './restapi-service.service';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { WelcomeComponent } from './author/welcome/welcome.component';
import { SelectThemeComponent } from './author/select-theme/select-theme.component';
import { TimezoneSetupComponent } from './author/timezone-setup/timezone-setup.component';



@NgModule({
  imports: [
    // BrowserModule,
    AppRoutingModule,
    CommonModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    SimpleNotificationsModule.forRoot({timeOut: 3000}),
    TimepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    // BsDropdownModule.forRoot(),
    ChartsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModule,
    BrowserAnimationsModule,

    Angular2FontawesomeModule,
    AngularMultiSelectModule,
    MyDatePickerModule,
    MyDateRangePickerModule,
    DragulaModule,
    Ng2DragDropModule.forRoot(),
    ImageUploadModule.forRoot(),
    UiSwitchModule,
    FancyImageUploaderModule,
    TagInputModule,
    AngularSplitModule,
    CKEditorModule,
    QuillEditorModule,
    PaginationModule.forRoot(),
    HttpClientModule

  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    WelcomeComponent,
    SelectThemeComponent,
    TimezoneSetupComponent,
    BreadcrumbsComponent,
    AsideToggleDirective,
    PlanExpiresComponent,
    PricingComponent,
    CheckoutComponent,
    ConfirmationComponent,
    SafePipePipe,
    PageLoadComponent,

    // LoaderComponent,
  ],


  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,

  },GetItemService,CookieService,AuthServiceService,ExcelService,RESTApiService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
