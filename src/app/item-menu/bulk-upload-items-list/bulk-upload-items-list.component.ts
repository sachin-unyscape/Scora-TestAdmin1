import { Component, OnInit,TemplateRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GetItemService } from '../../get-item.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { searchFilter } from '../view-items/searchFilter';
import { attributeSearch } from '../../itemset-menu/view-item-sets/attributefilter';
import { deleteObj } from '../view-items/deleteTest';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-bulk-upload-items-list',
  templateUrl: './bulk-upload-items-list.component.html',
  styleUrls: ['./bulk-upload-items-list.component.scss']
})
export class BulkUploadItemsListComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  constructor(private http:Http,private router: Router,public route:ActivatedRoute,private getItemService :GetItemService,private cookieService: CookieService,private authService :AuthServiceService,private modalService: BsModalService,public sanitizer: DomSanitizer) {
    this.searchfilter = new searchFilter();
    this.deleteItems = new deleteObj();

   }
  public activeTab;
  public showLoad;
  public allItemsList;
  public showItem;
  public searchfilter : searchFilter;
  public searchedData;
  public searchItems;
  public showAttributeFilter;
  public searchError;
  public path;
  public deleteitemPopup;
  public deleteItemId;
  public showMsg;
  public saveMsg;
  public custom_Attributes = [];
  public deleteItems;
  public uploadId;


  ngOnInit() {
    this.activeTab = 0;
    var uploadId = this.getItemService.sendBulkUploadedIds();
    this.getAllItems(uploadId);
    this.showItem =0;
  }

  getAllItems(uploadid){
    if(this.authService.canActivate()){
     this.showLoad = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/upload_items/" + this.cookieService.get('_PAOID')+'/'+uploadid,{headers:headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
        data => {
          this.showLoad= false;
          var index;
          var item_count = 1;

          this.allItemsList = data;

          if(this.allItemsList[this.showItem].item_type === 2){
            for(let data of this.allItemsList[this.showItem].answer_choices){
              data.data_insight = data.data_insight;
            }
            this.custom_Attributes = this.allItemsList[this.showItem];
          console.log(this.custom_Attributes)
          }
      
          if(this.allItemsList[this.showItem].item_type === 1){
            for(let data of this.allItemsList[this.showItem].answer_choices){
              for(let datas of data.choice_elements){
                data.data_insight = datas.data_insight;
                break
              }
            }
            this.custom_Attributes = this.allItemsList[this.showItem];
          console.log(this.custom_Attributes)
          }
          // for(let datasof of data[this.showItem].answer_choices){
          //   for(let datas of datasof.choice_elements){
          //     datasof.data_insight = datas.data_insight;
          //     break
          //   }
          // }
          this.custom_Attributes = this.allItemsList[this.showItem];
          console.log(this.custom_Attributes)


          for(var i=0;i<this.allItemsList.length;i++){
            if(this.allItemsList[i].item_type != 6){

            if(this.allItemsList[i].answer_choices.length != '0'){
              for(var j=0;j<this.allItemsList[i].answer_choices.length;j++){
                this.allItemsList[i].answer_choices[j].label = String.fromCharCode(97+j);

                if(this.allItemsList[i].item_type == 1){
                  for(var c=0;c<this.allItemsList[i].answer_choices[j].choice_elements.length;c++){
                    if(this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 1){
                      var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value);
                      this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                    }else if(this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 6 || this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 10 || this.allItemsList[i].answer_choices[j].choice_elements[c].answer_df_id == 11){
                      var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value);
                      this.allItemsList[i].answer_choices[j].choice_elements[c].data_format_value = changeRTEFormatAns;
                    }
                  }
                }else if(this.allItemsList[i].item_type == 3 && this.allItemsList[i].matchlist_type == 5){
                  if(this.allItemsList[i].answer_choices[j].answer_df_id == 1){
                    var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].answer_choices[j].data_format_value);
                    this.allItemsList[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                  }else if(this.allItemsList[i].answer_choices[j].answer_df_id == 6 || this.allItemsList[i].answer_choices[j].answer_df_id == 10 || this.allItemsList[i].answer_choices[j].answer_df_id == 11){
                    var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].answer_choices[j].data_format_value);
                    this.allItemsList[i].answer_choices[j].data_format_value = changeRTEFormatAns;
                  }
                }
              }
            }
            this.allItemsList[i].index= item_count;
            item_count ++;
            for(var k=0;k<this.allItemsList[i].item.length;k++){
              if(this.allItemsList[i].item[k].item_df_id == 1){
                var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].item[k].data_format_value);

                this.allItemsList[i].item[k].data_format_value = changeRTEFormat;

              }if(this.allItemsList[i].item[k].item_df_id == 6 || this.allItemsList[i].item[k].item_df_id == 10 || this.allItemsList[i].item[k].item_df_id == 11){
                var changeRTEFormat = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].item[k].data_format_value);
                this.allItemsList[i].item[k].data_format_value = changeRTEFormat;
              }else if(this.allItemsList[i].item[k].item_df_id  == 9){
                for(var d=0;d<this.allItemsList[i].item[k].data_format_value.length;d++){
                 for(var m=0;m<this.allItemsList[i].item[k].data_format_value[d].match_data.length;m++){
                   if(this.allItemsList[i].item[k].data_format_value[d].match_data[m].header != 1){
                     if(this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 6 || this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 10 || this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_data_format_id == 11){
                      var sanitizeURLMatch = this.sanitizer.bypassSecurityTrustUrl(this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_value);
                      this.allItemsList[i].item[k].data_format_value[d].match_data[m].match_value = sanitizeURLMatch;
                     }
                   }
                 }
                }
              }
            }

            }else if(this.allItemsList[i].item_type == 6){
              // this.directive_items_count = this.allItemsList.section_items[i].directive_items_count;
              // this.directIdArray.push(this.allItemsList.section_items[i].directive_id);
              var directiveItemCount = item_count + this.allItemsList[i].directive_items_count -1;
              this.allItemsList[i].index = item_count +"-"+ directiveItemCount;

              for(var k=0;k<this.allItemsList[i].directive_content.length;k++){
                if(this.allItemsList[i].directive_content[k].item_df_id == 1){
                  var changeRTEFormat = this.sanitizer.bypassSecurityTrustHtml(this.allItemsList[i].directive_content[k].data_format_value);

                  this.allItemsList[i].directive_content[k].data_format_value = changeRTEFormat;

                }
              }
            }
          }

        },
        error => {

          this.showLoad  = false;
          if(error.status == 404){
            this.router.navigateByUrl('pages/NotFound');
          }
          else if(error.status == 401){
            this.cookieService.deleteAll();
           window.location.href=credentials.authorUrl;
            // window.location.href=credentials.authorUrl;
          }
          else{
            this.router.navigateByUrl('pages/serverError');
          }

        }
      );
    }
  }

  editItemList(editableItem){
    if(editableItem.item_edit){
      if(editableItem.item_type != 6){
        for(var i=0;i<editableItem.item.length;i++){
          if(editableItem.item[i].item_df_id == 1 || editableItem.item[i].item_df_id == 6 || editableItem.item[i].item_df_id == 10 || editableItem.item[i].item_df_id == 11){
            editableItem.item[i].data_format_value = editableItem.item[i].data_format_value.changingThisBreaksApplicationSecurity;
          }
          else if(editableItem.item[i].item_df_id == 9){
            for(var d=0;d<editableItem.item[i].data_format_value.length;d++){
            for(var m=0;m<editableItem.item[i].data_format_value[d].match_data.length;m++){
              if(editableItem.item[i].data_format_value[d].match_data[m].header != 1){
                if(editableItem.item[i].data_format_value[d].match_data[m].match_data_format_id == 6 || editableItem.item[i].data_format_value[d].match_data[m].match_data_format_id == 10 || editableItem.item[i].data_format_value[d].match_data[m].match_data_format_id == 11){
                  editableItem.item[i].data_format_value[d].match_data[m].match_value = editableItem.item[i].data_format_value[d].match_data[m].match_value.changingThisBreaksApplicationSecurity;
                }
              }
            }
            }
          }
        }

        if(editableItem.item_type == 1){
          for(var a=0;a<editableItem.answer_choices.length;a++){
            for(var b=0;b<editableItem.answer_choices[a].choice_elements.length;b++){
              if(editableItem.answer_choices[a].choice_elements[b].answer_df_id == 1 || editableItem.answer_choices[a].choice_elements[b].answer_df_id == 6 ||editableItem.answer_choices[a].choice_elements[b].answer_df_id == 10 || editableItem.answer_choices[a].choice_elements[b].answer_df_id == 11){
                editableItem.answer_choices[a].choice_elements[b].data_format_value = editableItem.answer_choices[a].choice_elements[b].data_format_value.changingThisBreaksApplicationSecurity;
              }
            }
          }
        }else if(editableItem.item_type == 3 && editableItem.matchlist_type == 5){
          for(var a=0;a<editableItem.answer_choices.length;a++){
            if(editableItem.answer_choices[a].answer_df_id == 1 || editableItem.answer_choices[a].answer_df_id == 6 || editableItem.answer_choices[a].answer_df_id == 10 || editableItem.answer_choices[a].answer_df_id == 11){
              editableItem.answer_choices[a].data_format_value = editableItem.answer_choices[a].data_format_value.changingThisBreaksApplicationSecurity;
            }
          }
        }
      }else if(editableItem.item_type == 6){
        for(var i=0;i<editableItem.directive_content.length;i++){
          if(editableItem.directive_content[i].item_df_id == 1){
            editableItem.directive_content[i].data_format_value = editableItem.directive_content[i].data_format_value.changingThisBreaksApplicationSecurity;
          }
        }
      }
      this.getItemService.getResponse(editableItem,'',this.path);
      this.router.navigate(['Items/additem',0,0,8]);
    }
  }

  showQues(index){
    this.showItem = index;
    // for(let datasof of this.allItemsList[this.showItem].answer_choices){
    //   for(let datas of datasof.choice_elements){
    //     datasof.data_insight = datas.data_insight;
    //     break
    //   }
    // }
    // this.custom_Attributes = this.allItemsList[this.showItem];
    
    if(this.allItemsList[this.showItem].item_type === 2){
      for(let data of this.allItemsList[this.showItem].answer_choices){
        data.data_insight = data.data_insight;
      }
      this.custom_Attributes = this.allItemsList[this.showItem];
    console.log(this.custom_Attributes)
    }

    if(this.allItemsList[this.showItem].item_type === 1){
      for(let data of this.allItemsList[this.showItem].answer_choices){
        for(let datas of data.choice_elements){
          data.data_insight = datas.data_insight;
          break
        }
      }
      this.custom_Attributes = this.allItemsList[this.showItem];
    console.log(this.custom_Attributes)
    }

  }




  //delete item
  deleteItem(itemid,template: TemplateRef<any>,deleteKey){
    if(deleteKey == true){
      this.modalRef = this.modalService.show(template, Object.assign({}, { class: ' modal-sm' },this.config));
      // this.deleteitemPopup = true;
      this.deleteItemId = itemid;
    }
  }

  deleteItemConfirm(){
    this.modalRef.hide();
    if(this.authService.canActivate()){
      this.deleteItems.category = 1;
      this.deleteItems.value.push(this.deleteItemId);
      this.deleteItems.org_id = this.cookieService.get('_PAOID');

      this.showLoad = true;
      var body = this.deleteItems;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      let options = new RequestOptions({
        headers : headers,
        body:body
      })
      return this.http.delete(credentials.host + '/remove_data', options)
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
          data => {
            this.showLoad = false;

            if(data.success == true){
              this.showMsg = data.message;
              this.saveMsg = true;

              setTimeout(()=>{
                this.saveMsg = false;
                this.getAllItems(this.uploadId);
                },4000);
            } else{
              this.showMsg = data.message;
              this.saveMsg = true;

              setTimeout(()=>{
                this.saveMsg = false;

              },4000);
            }
          },
          error => {

            this.showLoad = false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
             window.location.href=credentials.authorUrl;
              // window.location.href=credentials.authorUrl;
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
      );

    }
  }


  backTobulkupload(){
    this.router.navigate(['Upload/UploadedFiles']);
  }

}
