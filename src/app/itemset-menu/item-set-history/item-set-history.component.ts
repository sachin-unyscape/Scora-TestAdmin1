import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';


@Component({
  selector: 'app-item-set-history',
  templateUrl: './item-set-history.component.html',
  styleUrls: ['./item-set-history.component.scss']
})
export class ItemSetHistoryComponent implements OnInit {

  constructor(private http:Http,private router: Router,public route:ActivatedRoute,private cookieService: CookieService,private authService :AuthServiceService) { }

  public showLoad;
  public itemSetLists;
  public showItemSetList;
  public showItemList;
  public choosenItemSetId;
  public showItem;
  public getOneItem;
  public eachSectionItems;

  ngOnInit() {
    this.ItemSetList();
  }

  ItemSetList(){
    if(this.authService.canActivate()){
      this.showLoad = true;
      var headers = new Headers()
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/itemsets_history/" + this.cookieService.get('_PAOID'),{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {

          this.showLoad = false;
          this.itemSetLists= data;
          this.showItemList = false;
          this.showItemSetList = true;

          },


          error => {

            this.showLoad = false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href=credentials.accountUrl;
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );
    }

  }

  getItemsetDet(id,sectionid){
    if(this.authService.canActivate()){
      this.showLoad = true;
      this.choosenItemSetId= id;
      this.showItem = -1;

      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/item_details/" +this.cookieService.get('_PAOID') +"/"+ id + "/all_sections/"+ 1,{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {


          this.showLoad = false;
          this.getOneItem = data;
            this.eachSectionItems = this.getOneItem.itemset_sections[0];
            // this.choosenItemSetSection = this.eachSectionItems.section_id;
            for(var i=0;i<this.eachSectionItems.section_items.length;i++){
              for(var j=0;j<this.eachSectionItems.section_items[i].answer_choices.length;j++){
                this.eachSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j)

              }
            }

          this.showItemList = true;
          this.showItemSetList = false;
          },
          error => {

            this.showLoad = false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href=credentials.authorUrl;
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );
    }
  }
  backToViewList(){
    this.showItemList = false;
    this.showItemSetList = true;
  }

  getNextSection(index){
    this.showItem = -1;

    this.eachSectionItems = this.getOneItem.itemset_sections[index];
    for(var i=0;i<this.eachSectionItems.section_items.length;i++){
      for(var j=0;j<this.eachSectionItems.section_items[i].answer_choices.length;j++){
        this.eachSectionItems.section_items[i].answer_choices[j].label = String.fromCharCode(97+j)

      }
    }

    // this.choosenItemSetSection = this.eachSectionItems.section_id;
  }

  showQues(index){
    this.showItem = index;
  }
}
