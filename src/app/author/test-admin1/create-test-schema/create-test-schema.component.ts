import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IMyDrpOptions } from 'mydaterangepicker';
import { TagInputModule } from 'ngx-chips';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { credentials } from '../../../credentials';
import { CookieService } from 'ngx-cookie-service';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
//authService
import { AuthServiceService } from '../../../auth-service.service';
import { LoaderComponent } from '../../../loader/loader.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService } from 'angular2-notifications';
import { Injector } from '@angular/core';
import { AuthorNavbarComponent } from '../../author-navbar/author-navbar.component';
import { GetItemService } from '../../../get-item.service';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { PagerService } from '../../../_services/index';
import * as _ from 'underscore';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-create-test-schema',
  templateUrl: './create-test-schema.component.html',
  styleUrls: ['./create-test-schema.component.scss']
})
export class CreateTestSchemaComponent implements OnInit {

  constructor(
    private http: Http,
    private router: Router,
    public route: ActivatedRoute,
    private cookieService: CookieService,
    private authService: AuthServiceService,
    private modalService: BsModalService,
    private _notifications: NotificationsService,
    private injector: Injector,
    public GetItemService: GetItemService,
    private pagerService: PagerService,
    private _location: Location,
    public sanitizer: DomSanitizer
  ) { }
  showload = false;
  ngOnInit() {
  }



}
