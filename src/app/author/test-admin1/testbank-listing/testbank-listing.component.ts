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
  selector: 'app-testbank-listing',
  templateUrl: './testbank-listing.component.html',
  styleUrls: ['./testbank-listing.component.scss']
})
export class TestbankListingComponent implements OnInit {
  ItemSet_ID: any;

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
  currentPage = 1;
  originalList: any = [];
  test_Bank_list: any = [];
  showload = false;
  roles: any;

  ngOnInit() {
    this.get_testbank_list();
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
    console.log('all items ', this.pagedItems);
  }

  filterUsers(val: string) {
    this.pagedItems = this.originalList.filter((data) => JSON.stringify(data).toLowerCase().indexOf(val.toLowerCase()) !== -1);
  }

  get_testbank_list() {
    this.showload = true;
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    let orgId = parseInt(this.cookieService.get("_PAOID"));
    return this.http
      .get(credentials.host + "/list_test_bank/" + orgId, {
        headers: headers,
      })
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })
      .subscribe(
        (data: any) => {
          console.log(data);
          this.roles = data[0].user_rolls;
          this.test_Bank_list = data[0].itemsetbank;
          console.log('test_Bank_list list', this.test_Bank_list);
          this.allItems = this.test_Bank_list;
          console.log(this.allItems);
          this.setPage(1);
          // this._notifications.create('',data.data.message, 'info', {timeOut: 3000});
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

  deleteTestBank() {
    this.showload = true;
    var headers = new Headers();
    headers.append(
      "Authorization",
      "Bearer " + this.cookieService.get("_PTBA")
    );
    let orgId = parseInt(this.cookieService.get("_PAOID"));
    return this.http
      .get(credentials.host + "/test_bank_delete/" + orgId + '/' + this.ItemSet_ID, {
        headers: headers,
      })
      .map((res) => res.json())
      .catch((e: any) => {
        return Observable.throw(e);
      })
      .subscribe(
        (data: any) => {
          console.log(data);
          this._notifications.create('',data.message, 'info', {timeOut: 3000});
          $('#delete').modal('hide');
          this.ItemSet_ID = '';
          this.get_testbank_list();
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



  notDeleteUserPopup() {
    $('#delete').modal('hide');
    this.ItemSet_ID = '';
  }

  onDelete(ItemSet_ID) {
    $('#delete').modal('show');
    this.ItemSet_ID = ItemSet_ID;
  }
  closeSucessDelete() {
    $('#multi-delete-succ').modal('hide');
  }


}
