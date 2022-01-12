import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { AuthServiceService } from 'app/auth-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-rubric',
  templateUrl: './create-rubric.component.html',
  styleUrls: ['./create-rubric.component.scss']
})
export class CreateRubricComponent implements OnInit {

  showload=false;
  baseURL='http://15.207.209.163/new-scora/scoraauthor/public/api/';
  rubricData:any=[];
  show = false;
  headingsList=['test1','test2'];
  subHeadingsList=['test-a','test-b'];

  constructor(private activeRouter: ActivatedRoute,private authService: AuthServiceService, private cookieService: CookieService,private http: HttpClient,private _notifications: NotificationsService) { }

  ngOnInit() {
    this.getData();
  }

  addHeading(){
    this.headingsList.push('new col');
  }

  addSub(){
    this.subHeadingsList.push('new row');
  }

  deleteHeading(){
    this.headingsList.pop();
  }

  deleteSub(){
    this.subHeadingsList.pop();
  }

  getData(){
    if (this.authService.canActivate()) {
      this.showload = true;
      let formData={
        itemId:this.activeRouter.snapshot.params['itemID'],
        orgId: this.cookieService.get('_PAOID')
      }
      let headers = new HttpHeaders();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http.post<any>(this.baseURL+'get_rubric_item',formData,{ headers: headers }).subscribe(data=>{
        this.showload = false;
        console.log(data);
        if(!data.success){
          return;
        }
        this.rubricData=data.data;
      },
      (error) => {
        this.showload = false;
        this._notifications.error(JSON.parse(error._body).message);
      })
    }
  }

  getValues(){
    var table = <HTMLTableElement>document.getElementById("hoursContainer");
    //iterate trough rows
     for (var i = 0, row; row = table.rows[i]; i++) {
    console.log(row);
         for (var j = 0, col; col = row.cells[j]; j++) {
            console.log(col);
            }
         }
     }

}
