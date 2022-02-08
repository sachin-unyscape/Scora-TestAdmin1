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
  selector: 'app-marking-schema',
  templateUrl: './marking-schema.component.html',
  styleUrls: ['./marking-schema.component.scss']
})
export class MarkingSchemaComponent implements OnInit {
  ItemSet_ID: string;
  test_bank_name: string;
  test_name = false;
  showload = false
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

  ngOnInit() {
    this.ItemSet_ID = this.route.snapshot.paramMap.get('itemset_id');
    console.log(this.ItemSet_ID);
    $("#test-bank").modal('show');
  }

  createTestBank() {
    this.test_name = false;
    if (this.test_bank_name == '' || this.test_bank_name == null || this.test_bank_name == undefined) {
      this.test_name = true;
    } else if (this.test_bank_name.length > 0 && this.test_bank_name != '' && this.test_bank_name != undefined) {
      this.showload = true;
      let body = {};
      var headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      body['org_id'] = parseInt(this.cookieService.get("_PAOID"));
      body['itemset_id'] = this.ItemSet_ID;
      body['test_bank_name'] = this.test_bank_name;
      return this.http
        .post(credentials.host + "/create_test_bank_name", body, {
          headers: headers,
        })
        .map((res) => res.json())
        .catch((e: any) => {
          return Observable.throw(e);
        })
        .subscribe(
          (data: any) => {
            console.log(data)
            if (data.success == true) {
              $("#test-bank").modal('hide');
            }
            setTimeout(() => {
              this.showload = false;
            }, 300);
          },
          (error) => {
            this.showload = false;
            if (error.status == 404) {
              this.router.navigateByUrl("pages/NotFound");
            } else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            } else {
              this.router.navigateByUrl("pages/serverError");
            }
          }
        );
    }
  }

}
