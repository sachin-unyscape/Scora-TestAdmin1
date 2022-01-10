import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {IMyDrpOptions} from 'mydaterangepicker';
import { TagInputModule } from 'ngx-chips';
import { trigger, state, style, animate, transition } from '@angular/animations';
import{credentials} from '../../../credentials';
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
import {Location} from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: "app-rubric-listing",
  templateUrl: "./rubric-listing.component.html",
  styleUrls: ["./rubric-listing.component.scss"],
})
export class RubricListingComponent implements OnInit {
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
  ) {}

  currentPage = 1;
  originalList:any=[];
  public showload = true;
  rubric_list: any[] = [];

  ngOnInit() {
    this.get_rubric_list();
  }


  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  // array of all items to be paged
  allItems: any[];

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.currentPage = page;
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.originalList = this.pagedItems;
    console.log(this.pagedItems);
  }


  get_rubric_list() {
    this.showload = true;
    var body = {};
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    body["orgId"] = parseInt(this.cookieService.get("_PAOID"));
    body["itemTypeId"] = null;
    console.log(credentials.host + "/list_rubric");
    return this.http
      .post(credentials.host + "/list_rubric", body, {
        headers: headers,
      })
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })

      .subscribe(
        (data) => {
          this.rubric_list = data.data;
          let modified_data = this.rubric_list.map((item)=>{
            const container = {};
            container['Subject_Nm'] = item.Subject_Nm
            container['Topic_Nm'] = item.Topic_Nm
            container['Created_DT'] = item.Created_DT
            container['author'] = item.author
            container['version'] = item.version
            container['status'] = item.status
            container['Stmt'] = item.Stmt;

            // container['Stmt'] = this.sanitizer.bypassSecurityTrustHtml(item.Stmt);
           return container;
          });
          this.allItems = modified_data;
          console.log(this.allItems);
          this.setPage(1);
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
