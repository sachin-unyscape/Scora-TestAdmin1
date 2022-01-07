import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import{credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { GetItemService } from '../../get-item.service';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { isEmpty } from 'rxjs/operator/isEmpty';
import { PagerService } from '../../_services/index';
import * as _ from 'underscore';

@Component({
  selector: 'app-data-templates',
  templateUrl: './data-templates.component.html',
  styleUrls: ['./data-templates.component.scss']
})
export class DataTemplatesComponent implements OnInit {
  constructor(private router: Router,private pagerService: PagerService, private activeroute: ActivatedRoute ,private http:Http,private cookieService: CookieService,private authService :AuthServiceService,private GetItemService:GetItemService) { }
  public Roles : any[] =[];

  ngOnInit() {
  }

setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
}
  // pager object
pager: any = {};
  // paged items
pagedItems: any[];
 // array of all items to be paged
private allItems: any[];

}
