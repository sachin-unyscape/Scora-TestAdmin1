import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit,TemplateRef,HostListener, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { AuthServiceService } from 'app/auth-service.service';
import { CookieService } from 'ngx-cookie-service';
import {Location} from '@angular/common';
import { Options } from 'ng5-slider';




@Component({
  selector: 'app-create-rubric',
  templateUrl: './create-rubric.component.html',
  styleUrls: ['./create-rubric.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class CreateRubricComponent implements OnInit {
  @ViewChild('popOver') popOver:ElementRef;

  value: number = 40;
  highValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100
  };

  obj: any = {}
  showload = false;
  baseURL = 'http://15.207.209.163/new-scora/scoraauthor/public/api/';
  rubricData: any = [];
  show = false;
  totalPoints = 0;
  keywords = '';
  rubricItems = [
    {
      'performance_rating_name': 'Bad',
      'selected_value':0.00,
      'criteria': [
        {
          'criteria_name': 'Language',
          'description': 'Language Discription',
          'point': 0.00
        },
        {
          'criteria_name': 'Clarity',
          'description': 'Clarity Discription',
          'point': 0.00
        }
      ]
    },
    {
      'performance_rating_name': 'Good',
      'selected_value':0.00,
      'criteria': [
        {
          'criteria_name': 'Language',
          'description': 'Language Discription 1',
          'point': 0.00
        },
        {
          'criteria_name': 'Clarity',
          'description': 'Clarity Discription 1',
          'point': 0.00
        }
      ]
    },
    {
      'performance_rating_name': 'excellent',
      'selected_value':0.00,
      'criteria': [
        {
          'criteria_name': 'Language',
          'description': 'Language Discription 2',
          'point': 0.00
        },
        {
          'criteria_name': 'Clarity',
          'description': 'Clarity Discription 2',
          'point': 0.00
        }
      ]
    },
  ];
  check_keywords: boolean;

  getRange(start,end){
    return {
      floor: start,
      ceil: end
    };
  }

  keywordError: boolean;

  constructor(private activeRouter: ActivatedRoute, private authService: AuthServiceService, private cookieService: CookieService, private http: HttpClient, private _notifications: NotificationsService, private _location: Location, private router: Router,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.getData();
  }

  backClicked() {
    this._location.back();
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

  deleteMainItem(i:number) {
    // this.rubricItems.pop();
    this.rubricItems.splice(i,1);
    this.getTotalPoints();
  }

  addMainItem(i:number) {
    let no = this.rubricItems[0].criteria.length;
    let subItems = [];
    for (let i = 0; i < no; i++) {
      subItems.push({
        'criteria_name': this.rubricItems[0].criteria[i].criteria_name,
        'description': '',
        'point': 0.0
      })
    }
    let newArr= {
      'performance_rating_name': '',
      'selected_value':0.00,
      'criteria': subItems
    }
    this.rubricItems.splice(i+1, 0, newArr);
    this.getTotalPoints();
  }

  addSubItems(i:number) {
    this.rubricItems.forEach(x => {
      let newArr={
        'criteria_name': '',
        'description': '',
        'point': 0.0
      };
      // x.criteria.push({
      //   'criteria_name': '',
      //   'description': '',
      //   'point': 0.0
      // })
      x.criteria.splice(i+1,0,newArr);
    })
    this.getTotalPoints();
  }

  deleteSubItems(i:number) {
    this.rubricItems.forEach(x => {
      // x.criteria.pop();
      x.criteria.splice(i,1);
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
     this.check_keywords = false;
    if (
      this.keywords == "" || this.keywords.length == 0
    ) {
      this.check_keywords = true;
    }
    if(!this.checkIfValid()){
      return;
    }
    if(!this.checkIfValid2()){
      this._notifications.error('','Incorrect Value(s) entered. Please read instructions!');
      return;
    }
    if(!this.checkIfValid3()){//checks if numbers are in series
      this._notifications.error('','Incorrect Value(s) entered. Please read instructions!');
      return;
    }
    if(this.check_keywords == true){
      this._notifications.error('','Keywords are required!');
      return;
    }
    let formData = {
      performance: this.rubricItems,
      orgId: this.cookieService.get('_PAOID'),
      itemId: this.activeRouter.snapshot.params['itemID'],
      keywords: this.keywords
    };
    console.log("formData",formData);
    document.getElementById('showPreview').click();
  }

  checkIfValid(){
    let isValid=true;
    let prevHiherThanLast=false;
    let notValid=false;
    this.rubricItems.forEach((x,index1)=>{
      x.criteria.forEach((y,index2)=>{
        if(index1>0 && y.point<this.rubricItems[index1-1].criteria[index2].point){
          prevHiherThanLast=true;
          isValid=false;
        }
        if(y.point%0.25!=0 && (+(Math.floor( y.point ) - y.point).toFixed(2))%0.33!=0){
          notValid=true;
          isValid=false;
        }
      })
    })
    if(prevHiherThanLast)
      this._notifications.error('','Points value must be higher than previous Column!');
    else if(notValid)
      this._notifications.error('','Only whole numbers or multiples of 0.25 (1/4) or 0.33 (1/3) are accepted!');
    return isValid;
  }

  checkIfValid2(){
    let arr=[];
    for(let i=0;i<this.rubricItems[0].criteria.length;i++){
      let arr2=[];
      for(let j=0;j<this.rubricItems.length;j++){
        arr2.push(this.rubricItems[j].criteria[i].point)
      }
      arr.push(arr2);
      arr2=[];
    }
  let isValid=true;
   for(let i=0;i<arr.length;i++){
     let type=1;
     for(let j=0;j<arr[i].length;j++){

       if(j==0){
         if(arr[i][j]==0 || arr[i][j]%1==0)
          type=3;
         else if(arr[i][j]%0.25!=0 && (+(Math.floor( arr[i][j] ) - arr[i][j]).toFixed(2))%0.33==0){
          type=2;
         }
       }
       else{
        if(type==1 && arr[i][j]%0.25!=0)
           isValid=false;
         else if(type==2 && (+(Math.floor( arr[i][j] ) - arr[i][j]).toFixed(2))%0.33!=0)
           isValid=false;
          else if(type==3 && arr[i][j]%0.25!=0 && (+(Math.floor( arr[i][j] ) - arr[i][j]).toFixed(2))%0.33!=0)
            isValid=false;
      }

     }
   }
   return isValid;
  }

  checkIfValid3(){
    let arr=[];
    for(let i=0;i<this.rubricItems[0].criteria.length;i++){
      let arr2=[];
      for(let j=0;j<this.rubricItems.length;j++){
        arr2.push(this.rubricItems[j].criteria[i].point)
      }
      arr.push(arr2);
      arr2=[];
    }
  let isValid=true;
   for(let i=0;i<arr.length;i++){
     for(let j=0;j<arr[i].length;j++){
       if(j>0){
         let decVal=+(arr[i][j]-arr[i][j-1]).toFixed(2);
         if(decVal!= 1 && decVal!=0.25 && decVal!=0.33 && decVal!=0.34){
           console.log('problem',decVal)
          isValid=false;
        }
       }
     }
   }
   return isValid;
  }

  replaceSpace(){
    this.keywords=this.keywords.replace(/[ ,]+/g, ", ");
    return 1;
  }


  previous(){
    $("#rubicpreview").modal('hide');
  }

  
  createRubric(){
    if(!this.checkIfValid()){
      return;
    }
    if (this.authService.canActivate()) {
      this.showload = true;
      let formData = {
        performance: this.rubricItems,
        orgId: this.cookieService.get('_PAOID'),
        itemId: this.activeRouter.snapshot.params['itemID'],
        keywords: this.keywords
      };
      let headers = new HttpHeaders();
      headers.append(
        "Authorization",
        "Bearer " + this.cookieService.get("_PTBA")
      );
      this.http.post<any>(this.baseURL + 'create_rubric', formData, { headers: headers }).subscribe(data => {
        this.showload = false;
        console.log(data);
        if (!data.success) {
          return;
        }
        $("#rubicpreview").modal('hide');
        this.router.navigateByUrl("author/rubric")
        setTimeout(() => {
          this._notifications.create("", data.message, "info");  
        }, 300);
      },
        (error) => {
          this.showload = false;
          this._notifications.error(JSON.parse(error._body).message);
        })
    }
  }
}
