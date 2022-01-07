import { Component, OnInit,TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import {IMyDrpOptions} from 'mydaterangepicker';
import { TagInputModule } from 'ngx-chips';
import { trigger, state, style, animate, transition } from '@angular/animations';
import{credentials} from '../../credentials';
import { CookieService } from 'ngx-cookie-service';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
//authService
import { AuthServiceService } from '../../auth-service.service';
import { LoaderComponent } from '../../loader/loader.component';
import { addSubAttribute } from './addSubAttribute';
import { editSubAttribute } from './editSubAttribute';
import { autoSuggestion } from './subjectTopicSuggestion';
import { editmetaData } from './editmetaData';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService } from 'angular2-notifications';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { GetItemService } from '../../get-item.service';
import { concat } from 'rxjs/observable/concat';
// import { editParameterValue } from './editParameterValue';

@Component({
  selector: 'app-meta-data',
  templateUrl: './meta-data.component.html',
  styleUrls: ['./meta-data.component.scss'],
  animations: [
    trigger('dialog1', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class MetaDataComponent implements OnInit  {
  modalRef: BsModalRef;
    config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
  constructor(private http:Http,private router: Router,public route:ActivatedRoute,public GetItemService:GetItemService,private cookieService: CookieService,private authService :AuthServiceService,private modalService: BsModalService,private _notifications: NotificationsService) {
    this.addnewSubAttribute = new addSubAttribute();
    this.editSubAttribute = new editSubAttribute();
    this.autoSuggestion = new autoSuggestion();
    this.saveMetaData = new editmetaData();

  }
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    public addnewSubAttribute:addSubAttribute;
    public editSubAttribute:editSubAttribute;
    public autoSuggestion:autoSuggestion;
    public saveMetaData:editmetaData;
    public tenantMetaData;
    public tenantMetaDataValue =[];
    public showload;
    public editParams;
    public editableParams;
    public parameterName;
    public subeditParams;
    public EditTitle;
    public editableValue;
    public showEditIcon = false;
    public editSubIndex;
    public editTopicIndex;
    public editSubTopIndex;
    public showMsg;
    public saveMsg;
    public MetaData;
    public parameterLabelErr;
    public planExpires;
    public editLinkedAttrErr = false;

    public subjectSearch: Array<string> = [];
// private subjectSearch: string='';
    // public subjectSearch;
    public topicSearch: Array<string> = [];
    public parameterErr = false;
    public addnewParamsErr = false;
    public subjectErr = false;
    public topicErr = false;
    public activeTab =1;
    public errIndex;
    public showBulkUploadDiv = false;
    public hideCustom_Attr_Values = false;
    public hide_CA_Fields;
    public alerts: any[] =[];

    public Notificationoptions = {
      position: ["center"],
      timeOut: 4000,
      lastOnBottom: true,
      showProgressBar:true,
      preventDuplicates : true,
      animate : "scale",
      pauseOnHover :false,
      clickToClose :false,
      clickIconToClose:false


  }



  ngOnInit() {
    this.hide_CA_Fields = false;
    this.hideCustom_Attr_Values = false;
    this.getTenantMetaData();
    // this.planExpires = this.GetItemService.sendPlanExpireKEy();
    // if(this.planExpires == undefined){
    //   this.planExpires = localStorage.getItem('hideButton');
    //   if(this.planExpires == 'false'){
    //     this.planExpires = false;
    //   }else if(this.planExpires == 'true'){
    //     this.planExpires = true;
    //   }
    //
    // }
  }

  getTenantMetaData(){
    this.showload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +"/tenant_metadatas/"+ this.cookieService.get('_PAOID'),{headers : headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {

        this.showload = false;

        this.tenantMetaData = data;
       
       
      },

        error => {

          this.showload= false;
          if(error.status == 404){
            this.router.navigateByUrl('pages/NotFound');
          }
          else if(error.status == 401){
            this.cookieService.deleteAll();
            window.location.href=credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else{
            this.router.navigateByUrl('pages/serverError');
          }

        }
    );
  }


  addCssSub(index){
    this.showEditIcon = true;
    this.editSubIndex = index;
    this.editTopicIndex = -1;
    this.editSubTopIndex = -1;
  }
  removeCssSub(index){
   this.showEditIcon = false;
   this.editSubIndex = -1;
   this.editTopicIndex = -1;
    this.editSubTopIndex = -1;
  }

  addCssTop(index,subindex){
    this.showEditIcon = true;
    this.editTopicIndex = index;
    this.editSubIndex = subindex;
    this.editSubTopIndex = -1;
  }
  removeCssTop(index){
    this.showEditIcon = false;
   this.editTopicIndex = -1;
   this.editSubIndex = -1;
   this.editSubTopIndex = -1;
  }

  addCssSubTop(index,topindex,subindex){
    this.showEditIcon = true;
    this.editSubTopIndex = index;
    this.editSubIndex = subindex;
    this.editTopicIndex = topindex;
  }

  removeCssSubTop(index){
    this.showEditIcon = false;
   this.editSubTopIndex = -1;
   this.editSubIndex = -1;
   this.editTopicIndex = -1;
  }
  //parameter edit

  editableParameterValue(paramsValue,paramsName,params_identifier,template: TemplateRef<any>,index){
   this.hideCustom_Attr_Values = false;
   if(this.tenantMetaData.normal_metadatas[index].parameter_identifier > 4 && this.tenantMetaData.normal_metadatas[index].parameter_identifier < 25){
    this.hideCustom_Attr_Values = true;
  }
    // if(this.planExpires == false){

        this.editableParams = paramsValue;
        this.parameterName= paramsName;
        this.saveMetaData.parameter_name = params_identifier;
        this.saveMetaData.parameter_label = paramsName;
        this.modalRef = this.modalService.show(template,this.config);

    // }
  }
  addNewParams(el){
    // this.editableParams =[];
    if(this.editableParams.length <= 500){
      this.editableParams.push({parameter_id:'',parameter:"",delete:true});
    }else{
      this.alerts.push({
        type: 'danger',
        msg: "You have reached the limit of adding attribute values",
        timeout:4000
      });
    }


  }

  //delete meta data
  deleteMetaData(index,deleteFlag){
    if(deleteFlag.delete){

      this.editableParams.splice(index,1);
    }
  }




  save(data){

    this.parameterErr = false;
    this.parameterLabelErr = false;
    const pattern1 = /^[^\s].*/;
    if(this.parameterName != 'Linked Attributes'){
      if(!pattern1.test(this.saveMetaData.parameter_label)){
        this.parameterLabelErr = true;
      }
    }

    if(data.length !=0){
      for(var i=0;i<data.length;i++){
        // var a=data[i].parameter.indexOf(' ')>=0;
        // if(a == true){
        //   this.parameterErr = true;
        // }
        // var regexp = new RegExp('^[^-\s][a-zA-Z0-9_\s+]+$'),
        // test = regexp.test(data[i].parameter);

        if((!pattern1.test(data[i].parameter) && this.hideCustom_Attr_Values !== true) || (data[i].parameter == null && this.hideCustom_Attr_Values !== true)){
          this.parameterErr = true;
          this.errIndex = i;
          break;
        }
      }
    }
    else if(data.length == 0){
      this.parameterErr = true;
      this.alerts.push({
            type: 'danger',
            msg: "At least one attribute must be entered",
            timeout:4000
          });
    }

    if(this.parameterErr == false && this.parameterLabelErr == false){
      this.modalRef.hide();

      this.showload = true;
    this.saveMetaData.parameter_values = data;

    this.saveMetaData.org_id = parseInt(this.cookieService.get('_PAOID'));

    var body = this.saveMetaData;
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    return this.http.put(credentials.host +"/edit_tenant_metadata", body,{headers: headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
          data => {

           if(data.success == true){

            this.showload = false;
            //  this.showMsg = data.message;
            // this.saveMsg = true;
            this._notifications.create('',data.message, 'info');
            setTimeout(()=>{
              this.getTenantMetaData();
              this.saveMsg = false;

              },3000);

           }else{

            this.showload = false;
          //   this.showMsg = data.message;
          //  this.saveMsg = true;
          this._notifications.create('',data.message, 'error');
          this.getTenantMetaData();
           setTimeout(()=>{
             this.saveMsg = false;

             },3000);
           }
          },
          error => {
            this.modalRef.hide();
            this.showload= false;
            if(error.status == 404){
              this.router.navigateByUrl('pages/NotFound');
            }
            else if(error.status == 401){
              this.cookieService.deleteAll();
              window.location.href=credentials.accountUrl;
              // window.location.href='http://accounts.scora.in';
            }
            else{
              this.router.navigateByUrl('pages/serverError');
            }

          }
    );
    }
  }

  editSubject(editValue,id,template: TemplateRef<any>){
    // if(this.planExpires == false){

      if(id==1){
        this.editSubAttribute.parameter_value = editValue.subject;
        this.editSubAttribute.parameter_name="subject";
        this.editSubAttribute.parameter_id = editValue.subject_id;
        this.EditTitle = "Subject Edit";
      }else if(id==2){
        this.editSubAttribute.parameter_value = editValue.topic;
        this.editSubAttribute.parameter_name="topic";
        this.editSubAttribute.parameter_id = editValue.topic_id;
        this.EditTitle = "Topic Edit";
      }
      else if(id==3){
        this.editSubAttribute.parameter_value = editValue.subtopic;
        this.editSubAttribute.parameter_name="subtopic";
        this.editSubAttribute.parameter_id = editValue.subtopic_id;
        this.EditTitle = "SubTopic Edit";
      }

      this.modalRef = this.modalService.show(template,this.config);
    // }

  }

  editAdditionalMetaData(){
    this.editLinkedAttrErr = false;
    // var a= false;
    // a=this.editSubAttribute.parameter_value.indexOf(' ')>=0;
    const pattern1 = /^[^\s].*/;
    if(pattern1.test(this.editSubAttribute.parameter_value)){
      this.modalRef.hide();
      this.showload = true;

      this.editSubAttribute.org_id = parseInt(this.cookieService.get('_PAOID'));
      var body = this.editSubAttribute;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.put(credentials.host +"/edit_subject_attributes", body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
            data => {

            if(data.success == true){

              this.showload = false;
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info');
              setTimeout(()=>{
                this.getTenantMetaData();
                this.saveMsg = false;
                this.editSubAttribute.parameter_value="";
                this.editSubAttribute.parameter_value="";
                this.editSubAttribute.parameter_value="";
                },3000);

            }else{
            //  this.modalRef.hide();
              this.showload = false;
              this.editSubAttribute.parameter_value="";
              this.editSubAttribute.parameter_value="";
              this.editSubAttribute.parameter_value="";
            //   this.showMsg = data.message;
            // this.saveMsg = true;
            this._notifications.create('',data.message, 'error');
            setTimeout(()=>{
              this.saveMsg = false;
              this.editSubAttribute.parameter_value="";
              this.editSubAttribute.parameter_value="";
              this.editSubAttribute.parameter_value="";
              },3000);
            }
            },
            error => {
              this.modalRef.hide();
              this.showload= false;
              if(error.status == 404){
                this.router.navigateByUrl('pages/NotFound');
              }
              else if(error.status == 401){
                this.cookieService.deleteAll();
                window.location.href=credentials.accountUrl;
                // window.location.href='http://accounts.scora.in';
              }
              else{
                this.router.navigateByUrl('pages/serverError');
              }

            }
      );
    }else {
      this.editLinkedAttrErr = true;
    }
  }

  saveAdditionalMetadata(){
    const pattern1 = /^[^\s].*/;
    this.addnewParamsErr = false;
    this.subjectErr = false;
    this.topicErr = false;
    if(!pattern1.test(this.addnewSubAttribute.subject)){
      this.subjectErr = true;
    }
    if(!pattern1.test(this.addnewSubAttribute.topic)){
      this.topicErr = true;
    }
    // var a=this.addnewSubAttribute.subject.indexOf(' ')>=0 && this.addnewSubAttribute.topic.indexOf(' ')>=0;
    // if(a == true){
    //   this.addnewParamsErr = true;
    // }
    if(this.subjectErr == false && this.topicErr == false){
      this.modalRef.hide();
      this.showload = true;
      this.addnewSubAttribute.org_id = parseInt(this.cookieService.get('_PAOID'));
      var body = this.addnewSubAttribute;
      var headers = new Headers();

      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host +"/add_subject_attributes", body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
            data => {

            if(data.success == true){

              this.showload = false;
              // this.showMsg = data.message;
              // this.saveMsg = true;
              this._notifications.create('',data.message, 'info');
              setTimeout(()=>{
                this.getTenantMetaData();
                this.saveMsg = false;
                this.addnewSubAttribute.subject="";
                this.addnewSubAttribute.topic="";
                this.addnewSubAttribute.subtopic="";
                },3000);

            }else{
              // this.modalRef.hide();
              this.showload = false;
              this.addnewSubAttribute.subject="";
                this.addnewSubAttribute.topic="";
                this.addnewSubAttribute.subtopic="";
            //   this.showMsg = data.message;
            // this.saveMsg = true;
            this._notifications.create('',data.message, 'error');
            setTimeout(()=>{
              this.saveMsg = false;
              },3000);
            }
            },
            error => {
              this.modalRef.hide();
              this.showload= false;
              if(error.status == 404){
                this.router.navigateByUrl('pages/NotFound');
              }
              else if(error.status == 401){
                this.cookieService.deleteAll();
                window.location.href=credentials.accountUrl;
                // window.location.href='http://accounts.scora.in';
              }
              else{
                this.router.navigateByUrl('pages/serverError');
              }

            }
      );
    }
  }


  cancelAddtionalMetaData(){
    this.editLinkedAttrErr = false;
    this.modalRef.hide();
  }


  SearchAttributes(key,attributeType){
    const pattern1 = /^[^\s].*/;
    this.autoSuggestion.org_id = parseInt(this.cookieService.get('_PAOID'));
    this.autoSuggestion.parameter_name = attributeType;
    this.autoSuggestion.search_keyword = key;
    if(pattern1.test(this.autoSuggestion.search_keyword)){
      var body = this.autoSuggestion;
      var headers = new Headers();

      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host +"/metadata_suggestions", body,{headers: headers})
      .map(res => res.json())
      .catch((e: any) =>{
        return Observable.throw(e)
      } )

      .subscribe(
            data => {

              if(attributeType == "subject"){
                if(data.length > 0){
                  this.subjectSearch = data;
                }

              }else if(attributeType == "topic"){
                this.topicSearch = data;


              }

            },
            error => {
            this.modalRef.hide();
              this.showload= false;
              if(error.status == 404){
                this.router.navigateByUrl('pages/NotFound');
              }
              else if(error.status == 401){
                this.cookieService.deleteAll();
                window.location.href=credentials.accountUrl;
                // window.location.href='http://accounts.scora.in';
              }
              else{
                this.router.navigateByUrl('pages/serverError');
              }

            }
      );
    }
  }


  cancelMetaData(){
    this.modalRef.hide();
    this.addnewSubAttribute.subject="";
    this.addnewSubAttribute.topic="";
    this.addnewSubAttribute.subtopic="";
    this.subjectErr = false;
    this.topicErr = false;
  }

  cancelAdditionalParameter(){
    this.showload = true;
    this.modalRef.hide();
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +"/tenant_metadatas/"+ this.cookieService.get('_PAOID'),{headers : headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {

        this.showload = false;

        this.tenantMetaData = data;

        },
        error => {

          this.showload= false;
          if(error.status == 404){
            this.router.navigateByUrl('pages/NotFound');
          }
          else if(error.status == 401){
            this.cookieService.deleteAll();
            window.location.href=credentials.accountUrl;
            // window.location.href='http://accounts.scora.in';
          }
          else{
            this.router.navigateByUrl('pages/serverError');
          }

        }
    );
    // for(var i=0;i<this.saveMetaData.parameter_values.length;i++){
    //   if(this.saveMetaData.parameter_values[i].parameter==""){

    //   }
    // }
  }

  openAddMetaData2(template: TemplateRef<any>) {
    // if(this.planExpires == false){
      this.modalRef = this.modalService.show(template,this.config);
    // }else if(this.planExpires == true){
    //   this.alerts.push({
    //     type: 'danger',
    //     msg: "Looks like your plan is expired.. Please contact your Super Admin",
    //     timeout:4000
    //   });
    // }
  }


  BulkUploadBtn(){
    // if(this.planExpires == false){
      this.showBulkUploadDiv == false ? this.showBulkUploadDiv = true:this.showBulkUploadDiv = false;
    // }else if(this.planExpires == true){
    //   this.alerts.push({
    //     type: 'danger',
    //     msg: "Looks like your plan is expired.. Please contact your Super Admin",
    //     timeout:4000
    //   });
    // }
  }


  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  uploadUsers(event) {
    this.showBulkUploadDiv = false;

    if(this.authService.canActivate()){

      let fileList: FileList = event.target.files;

      // this.showErrorUpload = '';
      // $(this).fileList[0].name.split('.').pop();
      if(fileList[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

          if(fileList.length > 0) {
              let file: File = fileList[0];

              let body = new FormData();
              body.append('file', file, file.name);
              body.append('org_id',this.cookieService.get('_PAOID'));

              let headers = new Headers();
              this.showload = true;
              headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
              this.http.post(credentials.host +'/bulk_attributes_import', body,{headers:headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))

                  .subscribe(
                      data => {
                        this.showload = false;

                        if(data.success == true){
                          this.getTenantMetaData();

                        // this.saveMSg = true;
                        // this.showMsg = data.message;
                        this._notifications.create('',data.message, 'info');
                        setTimeout(()=>{
                          // this.saveMSg = false;
                          // this.router.navigate(['author/Items/viewitems', data.upload_id]);
                      },3000);
                        }else if(data.success == false){
                          this.showload = false;
                          this._notifications.create('',data.message, 'error');
                          // this.showErrorUpload =  data.message;

                        }
                      },
                      error => {

                        this.showload = false;
                        if(error.status == 404){
                          this.router.navigateByUrl('pages/NotFound');
                        }
                        else if(error.status == 401){
                          this.cookieService.deleteAll();
                          window.location.href=credentials.accountUrl;
                          // window.location.href='http://accounts.scora.in';
                        }
                        else{
                          this.router.navigateByUrl('pages/serverError');
                        }

                      }
                  )

      }

    }else{
      // this.showErrorUpload = "Invalid extension for file "+fileList[0].name+". Only .xlsx files are supported.";
      this.alerts.push({
        type: 'danger',
        msg: "Invalid extension for file "+fileList[0].name+". Only .xlsx files are supported.",
        timeout:4000
      });
      setTimeout(()=>{
        // this.showErrorUpload = '';
    },10000);
    }
    }
  }


  // scroll to bottom function
  onActivate(event) {

    let scrollToBottom = window.setInterval(() => {
    let pos = window.pageYOffset;
    if (pos > 0 || pos == 0) {
    window.scrollTo(0, pos - 20); // how far to scroll on each step
    } else {
     window.clearInterval(scrollToBottom);
    }
    }, 2);
    }

}
