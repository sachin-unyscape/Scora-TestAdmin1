import { Component } from '@angular/core';
import {Router} from '@angular/router';
import{AppRoutingModule } from './app.routing';
import { GetItemService} from './get-item.service';
@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: `
 
<router-outlet></router-outlet>

`,
providers: [GetItemService]
})
export class AppComponent {
  constructor(private router: Router) {
    this.dashboard = false;
    }
    public dashboard;
    public userName;
    public passWord;
  // submitLogin(){
  //   if(this.userName == "pika" && this.passWord == "pika@123"){
  //   this.dashboard = true;
  //   }
  //   else{
  //     alert("Incorrect Username or Password");
  //   }
  // }
 }
