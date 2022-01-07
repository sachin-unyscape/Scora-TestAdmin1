import { Component, OnInit,TemplateRef } from '@angular/core';
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
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { isEmpty } from 'rxjs/operator/isEmpty';
import { NotificationsService } from 'angular2-notifications';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser'
import { EvaluationScoresUpdate } from "./evaluation.req";


@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.component.html',
  styleUrls: ['./scoring.component.scss']
})
export class ScoringComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };


  constructor( public sanitizer: DomSanitizer,private router: Router, private activeroute: ActivatedRoute ,private http:Http,private cookieService: CookieService,private authService :AuthServiceService,private GetItemService:GetItemService,private modalService: BsModalService) { }

  public StartFlag = false;
  public viewItemSetDetailsFlag = false;
  public ItemInstance;
  public evaluationScreenFlag = true;
  public startEvaluationFlag = false;
  public showLoad;
  public allItems;
  public testDetails;
  public itemSetDetails;
  public itemSetDetailsItems;
  public itemsDetails;
  public testIns = true;
  public itempPopup;
  public curItemNumber;

  public evaluationScoresUpdate : EvaluationScoresUpdate;

  public Notificationoptions = {
    position: ["center"],
    timeOut: 4000,
    lastOnBottom: true,
    showProgressBar: true,
    preventDuplicates: true,
    animate: "scale",
    pauseOnHover: false,
    clickToClose: false,
    clickIconToClose: false
  }

  ngOnInit() {
    this.getAllItems();
  }
  startScoring(){
    this.StartFlag = true;
    this.viewItemSetDetailsFlag = false;
  }
  viewItemSetDetails(index,testId){
    this.viewItemSetDetailsFlag = true;
    this.evaluationScreenFlag = false;

    this.itemSetDetailsItems = this.testDetails[index].itemsets;

  }
  openItemInstance(itemsetId,ind){
    if(this.ItemInstance != itemsetId){
      this.ItemInstance = itemsetId;
      this.itemsDetails = this.itemSetDetailsItems[ind].items;

    }else{
      this.ItemInstance = -1;
    }

  }
  backToEvaluation(){
    this.viewItemSetDetailsFlag = false;
    this.ItemInstance = false;
    this.evaluationScreenFlag = true;
  }
  backToItemSetDetails(){
    this.viewItemSetDetailsFlag = true;
    this.evaluationScreenFlag = false;
    this.StartFlag = false;
  }
  startEvaluation(){
    this.startEvaluationFlag = true;
    this.StartFlag = false;
  }
  backToStartEvaluation(){
    this.StartFlag = true;
    this.startEvaluationFlag = false;
  }
  ItemDetailsPopUP(index,template: TemplateRef<any>){
    this.itempPopup = this.itemsDetails[index];
    this.curItemNumber = index+1;

    this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-lg' },this.config));
  }
  onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  getAllItems(){
      if(this.authService.canActivate()){
      this.showLoad = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host +"/all_items/"+ this.cookieService.get('_PAOID')+'/' +"null"+'/' +this.cookieService.get('_userID'),{headers : headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {
          this.showLoad= false;
          this.testDetails = data;

          },


          error => {

            this.showLoad= false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
             window.location.href=credentials.accountUrl;
             // window.location.href='https://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );
    }
  }

  updateEvaluationScores() {
    this.evaluationScoresUpdate = new EvaluationScoresUpdate();
    this.evaluationScoresUpdate.Org_id = 1;
    this.evaluationScoresUpdate.Test_Instance_id = 72;
    this.evaluationScoresUpdate.ItemSet_Item_Key = 89;
    this.evaluationScoresUpdate.Item_Id = 1;
    this.evaluationScoresUpdate.Section_Id = 1;
    this.evaluationScoresUpdate.Seq_No = 1;
    this.evaluationScoresUpdate.ItemSet_ID = 38;
    this.evaluationScoresUpdate.Answer_Choice_ID = 1;
    this.evaluationScoresUpdate.score_type = "Item Lvl Score";
    this.evaluationScoresUpdate.Scorer_Marks = "1";
    this.evaluationScoresUpdate.Scorer_Review = "score review";
    var tempArray = [
      {"key1": 1},
      {"key2": 1},
      {"key3": 1}
    ]
    this.evaluationScoresUpdate.Item_Lvl_Keyword = 2;
    this.evaluationScoresUpdate.Keywords = tempArray;


    let body = this.evaluationScoresUpdate;

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    headers.append('Content-Type', 'application/json');

    this.http.put(credentials.host +'/test_scoring', body,{headers:headers})
    .map(res => res.json())
    .catch(error => Observable.throw(error))

        .subscribe(
            data => {

            },
            error => {

            },
        )


  }

}
