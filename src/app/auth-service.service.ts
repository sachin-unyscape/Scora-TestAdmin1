import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';

@Injectable()
export class AuthServiceService {
  public tokenExists :boolean;
  constructor(private cookieService: CookieService) {
    this.tokenExists = cookieService.check('_PTBA');
   }

  // authenticate all functions by this method
  canActivate(): boolean {
    this.tokenExists = this.cookieService.check('_PTBA');
    if (this.tokenExists) {

      return true;
    }else{
      this.cookieService.deleteAll();
      //Local
     window.location.href='http://localhost:5200?serviceurl='+ 'http://localhost:5000'
	  //Server
	  // window.location.href='http://15.207.209.163:5200?serviceurl='+ 'http://15.207.209.163:5300'
    }

  }

}
