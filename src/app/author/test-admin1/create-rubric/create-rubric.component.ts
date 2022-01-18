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

  showload = false;
  baseURL = 'http://15.207.209.163/new-scora/scoraauthor/public/api/';
  rubricData: any = [];
  show = false;
  totalPoints = 0;
  keywords = '';
  rubricItems = [
    {
      'performance_rating_name': 'Title',
      'criteria': [
        {
          'criteria_name': 'Sub Title 1',
          'description': '',
          'point': 0.0
        },
        {
          'criteria_name': 'Sub Title 2',
          'description': '',
          'point': 0.0
        }
      ]
    }
  ];

  constructor(private activeRouter: ActivatedRoute, private authService: AuthServiceService, private cookieService: CookieService, private http: HttpClient, private _notifications: NotificationsService) { }

  ngOnInit() {
    this.getData();
  }

  getLastPoint(index1:number,index2:number){
    return this.rubricItems[index1-1].criteria[index2].point;
  }

  getTotalPoints() {
    let total = 0;
    // this.rubricItems.forEach(x => {
    //   x.criteria.forEach(y => {
    //     total += +y.point;
    //   })
    // })
    this.rubricItems[this.rubricItems.length-1].criteria.forEach(x=>{
      total += +x.point;
    })
    this.totalPoints = total;
  }

  deleteMainItem() {
    this.rubricItems.pop();
    this.getTotalPoints();
  }

  addMainItem() {
    let no = this.rubricItems[0].criteria.length;
    let subItems = [];
    for (let i = 0; i < no; i++) {
      subItems.push({
        'criteria_name': this.rubricItems[0].criteria[i].criteria_name,
        'description': '',
        'point': 0.0
      })
    }
    this.rubricItems.push({
      'performance_rating_name': '',
      'criteria': subItems
    })
    this.getTotalPoints();
  }

  addSubItems() {
    this.rubricItems.forEach(x => {
      x.criteria.push({
        'criteria_name': '',
        'description': '',
        'point': 0.0
      })
    })
    this.getTotalPoints();
  }

  deleteSubItems() {
    this.rubricItems.forEach(x => {
      x.criteria.pop();
    })
    this.getTotalPoints();
  }

  getData() {
    if (this.authService.canActivate()) {
      this.showload = true;
      let formData = {
        itemId: this.activeRouter.snapshot.params['itemID'],
        orgId: this.cookieService.get('_PAOID')
      }
      let headers = new HttpHeaders();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http.post<any>(this.baseURL + 'get_rubric_item', formData, { headers: headers }).subscribe(data => {
        this.showload = false;
        console.log(data);
        if (!data.success) {
          return;
        }
        this.rubricData = data.data;
      },
        (error) => {
          this.showload = false;
          this._notifications.error(JSON.parse(error._body).message);
        })
    }
  }

  getValues() {
    if(!this.checkIfValid()){
      return;
    }
    let formData = {
      performance: this.rubricItems,
      orgId: this.cookieService.get('_PAOID'),
      itemId: this.activeRouter.snapshot.params['itemID'],
      keywords: this.keywords
    };
    console.log(formData);
  }

  checkIfValid(){
    let isValid=true;
    this.rubricItems.forEach((x,index1)=>{
      x.criteria.forEach((y,index2)=>{
        if(index1>0 && y.point<this.rubricItems[index1-1].criteria[index2].point)
          isValid=false;
      })
    })
    return isValid;
  }

  replaceSpace(){
    this.keywords=this.keywords.replace(/ /g,",");
    return 1;
  }

}
