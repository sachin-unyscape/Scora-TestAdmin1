import { Component, OnInit, ViewChild, TemplateRef, ElementRef,HostListener } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { FormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IMyDpOptions } from 'mydatepicker';

import { itemType } from './itemType';
import { ansType } from './answerType';
import { answerList } from './answerList';
import { statementList } from './statementList';
import { statementType } from './statementType';
import { attributes } from './attributes';
import { attributesEdit } from './attributesEdit';
import { attributevalue } from './saveItemSet';
import { answerChoice } from './answerChoice';
import { answerChoiceType } from './answerChoiceType';
import { itemList } from './itemList';
import { matchData } from './matchData';
import { matchItemType } from './matchItemType';
import { matchDataType } from './matchdataType';
import { SplitPaneModule } from 'ng2-split-pane/lib/ng2-split-pane';
// import { SplitModule } from 'ng2-split';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { fail } from 'assert';
import { validateConfig } from '@angular/router/src/config';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { GetItemService } from '../../get-item.service';
// import { ViewItemSetsComponent } from '../../item_sets/view-item-sets/view-item-sets.component';
import { credentials } from '../../credentials';

//cookie
import { CookieService } from 'ngx-cookie-service';
//authService
import { AuthServiceService } from '../../auth-service.service';
declare var $: any; 

//import * as ClassicEditor  from '@ckeditor/ckeditor5-build-classic';
//import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

//import * as $ from 'jquery';
//declare var ClassicEditors: any;

declare var quill: any;
import { matchArray } from './matchArray';
import { exactMatchType } from './exactMatchAnswerType';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';
import { NotificationsService } from 'angular2-notifications';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { listType } from './listType';
import { listTypeArray } from './listtypeArray';
import { tableKeys } from "./tableKeys";
import { tableValues } from "./tablevalues";
import { freeText_answerType } from "./freetext_answertype";
import { fileUploadAnsBlock } from "./fileuploadAnsBlock";
//import { type } from 'os';
import * as _ from 'lodash';


@Component({
  selector: 'app-answer-pool',
  templateUrl: './answer-pool.component.html',
  styleUrls: ['./add-new.component.scss'],
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
  ],
  viewProviders: [DragulaService]
})

export class AnswerPoolComponent implements OnInit {

  // @HostListener('document:keydown',['$event'])

  // DisbaleSpace(event:KeyboardEvent){

  // }

  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  ckeConfig: any;
 // @ViewChild("ckeditor") ckeditor: any;
  isModalShown: boolean = false;
  public attributesDet: attributevalue;
  public custom_attributes: attributevalue;
  public attributes: attributes;
  public attributesEdit: attributesEdit
  public itemtype: itemType;
  public answerChoices: answerChoice[] = new Array<answerChoice>();
  public choiceType: answerChoiceType;
  public matchList: matchData;
  public elemetTypeList: listType;
  public Insight_Value;
  public item_Description;
  public item_Insight_Value;
  public item_description_Value;
  public activeTab;
  currDiv: string = 'A';
  public lsshow;


  public css_class;

  title = 'angularckeditor';
  /*
  public Editor = ClassicEditor;
  public processDiv = "";
  public data = "<p>Hello, csharp corner!</p><br/><br/> <b>This is demo for ckeditor 5 with angular 8</br>";
  public ckeditorconfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'strikethrough',
        'underline',
        'superscript',
        'subscript',
        'bulletedList',
        'numberedList',
        'alignment',
        '|',
        'fontFamily',
        'fontColor',
        'fontSize',
        'highlight',
        '|',
        'horizontalLine',
        '|',
        'outdent',
        'indent',
        '|',
        'blockQuote',
        'undo',
        'redo',
        '|',
        'MathType',
        'ChemType',
        'specialCharacters',
        '|',
        'codeBlock',  
        '|'
      ],
      shouldNotGroupWhenFull: false
    },
    language: 'en',
    licenseKey: '',
    wproofreader: {
      serviceId: 'vhTwpH3ZJsWpFrv',
      srcUrl: 'https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js'
    }
  }
*/
  //public onChange({ editor }: ChangeEvent) {
    //this.data = editor.getData();
    //var html = $(".ck-content").html();
    //this.processDiv = html;
    //var find = this.isOverflown($(".ck-content")[0]);
    //alert(find);
  //}

  //isOverflown(element) {
    //return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  //}


  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  

  @ViewChild('openTableModal')
  openTableModalOnclick: ElementRef;

  constructor(private http: Http, private dragulaService: DragulaService, public router: Router, public route: ActivatedRoute, public getItemService: GetItemService, private cookieService: CookieService, private authService: AuthServiceService, private modalService: BsModalService, private _notifications: NotificationsService, public sanitizer: DomSanitizer) {
    let dragIndex: number, dropIndex: number;
    dragulaService.setOptions('bag', {
      invalid(el, handle) {
        return (el.className == "column");
      }



    });

    this.css_class = 'layout';
    dragulaService.setOptions('bag-one', {

      copy: function (el, source) {



        // To copy only elements in left container, the right container can still be sorted
        return source.id === 'left';


      },
      copySortSource: false,
      revertOnSpill: true,
      removeOnSpill: false,
      accepts: function (el, target, source, sibling) {



        // To avoid draggin from right to left container
        return target.id !== 'left';

      }

    })
    // dragulaService.setOptions('bag', {


    //   copySortSource: false,
    //   revertOnSpill: true,
    //   removeOnSpill: false,


    // })

    dragulaService.out.subscribe((value) => {

      this.onOut(value);

    });


    // dragulaService.setOptions('bag-one', {
    //   copy: true,
    //   copySortSource: true

    // });


    this.attributes = new attributes();
    this.attributesEdit = new attributesEdit();
    this.itemtype = new itemType();
    this.attributesDet = new attributevalue();
    this.answerChoices = [];
    this.choiceType = new answerChoiceType();
    this.matchList = new matchData();
    this.elemetTypeList = new listType();
    // this.attributes = new ansType();
    // this.saveData = new saveItemSet();
    // this.saveItemValues = new save();

  }

  dragCol = false;
  options1: any = {
    copy: true,
    copySortSource: true
  }



  private onOut(value) {
    let [el, target, source] = value;


    // let item = this.items[index];

    // if(this.attributes.item.length>=2){
    // this.dropfunction();
    // }

    if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type == 5 || this.item_type == 7) {
      if (this.attributes.item.length <= 25) {
        for (var i = 0; i < this.attributes.item.length; i++) {
          if (this.attributes.item[i].element == "Statement") {
            this.attributes.item.splice(i, 1);
            this.attributes.item.splice(i, 0, { item_df_id: 1, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
          } else if (this.attributes.item[i].element == "Image") {
            this.attributes.item.splice(i, 1);
            this.attributes.item.splice(i, 0, { item_df_id: 6, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
          } else if (this.attributes.item[i].element == "Audio") {
            this.attributes.item.splice(i, 1);
            this.attributes.item.splice(i, 0, { item_df_id: 10, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
          } else if (this.attributes.item[i].element == "Video") {
            this.attributes.item.splice(i, 1);
            this.attributes.item.splice(i, 0, { item_df_id: 11, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
          } else if (this.attributes.item[i].element == "List") {
            this.attributes.item.splice(i, 1);
            this.attributes.item.splice(i, 0, { item_df_id: 8, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
            this.attributes.item[i].data_format_value = [];
            this.attributes.item[i].data_format_value.push(new listTypeArray());
            this.attributes.item[i].data_format_value[0].list_elements.push(new listType());
            this.attributes.item[i].data_format_value[0].list_elements[0].list_label = "A";
            this.attributes.item[i].data_format_value[0].list_elements[0].list_sequence = 1;
            this.attributes.item[i].data_format_value[0].list_elements[0].list_value = "";
            this.attributes.item[i].data_format_value[0].list_elements[0].list_data_format_id = 1;
            this.attributes.item[i].data_format_value[0].list_elements[0].list_data_identifier = "";
            this.attributes.item[i].data_format_value[0].list_elements[0].previous_element_id = "";
            this.attributes.item[i].data_format_value[0].list_elements[0].data_id = null;

          } else if (this.attributes.item[i].element == "Table") {
            this.tableIndex = i;
            this.ShowTableModal = true;
          }
          if (this.attributes.item[i].list_data_identifier == '') {
            this.attributes.item.splice(i, 1);
          }
          else if(this.attributes.item[i].item_df_id == 8){
            for (var k = 0; k < this.attributes.item[i].data_format_value.length; k++) {
              if (this.attributes.item[i].item_df_id == 8) {
                for(var d1=0;d1<this.attributes.item[i].data_format_value.length;d1++){
                  if(this.attributes.item[i].data_format_value[d1].element == 'Statement' || this.attributes.item[i].data_format_value[d1].element == 'Image' || this.attributes.item[i].data_format_value[d1].element == 'Audio' || this.attributes.item[i].data_format_value[d1].element == 'Video' || this.attributes.item[i].data_format_value[d1].element == 'List' || this.attributes.item[i].data_format_value[d1].element == 'Table'){
                    this.attributes.item[i].data_format_value.splice(d1,1);
                  }
                }
                for (var m = 0; m < this.attributes.item[i].data_format_value[k].list_elements.length; m++) {

                  if (this.attributes.item[i].data_format_value[k].list_elements[m].element == 'Statement') {
                    this.attributes.item[i].data_format_value[k].list_elements.splice(m, 1);
                    this.attributes.item[i].data_format_value[k].list_elements[0].list_data_format_id = 1;
                    this.attributes.item[i].data_format_value[k].list_elements[0].list_value = "";
                    // this.attributes.item[i].data_format_value[k].list_elements.splice(m, 0, { list_label: 'A', list_sequence: k, list_value: '', list_data_format_id: 1, list_data_identifier: '', previous_element_id: '' });
                    // To set lables
                    // if (m == 0 && this.attributes.item[i].data_format_value[k].list_elements.length == 2) {
                    //   this.attributes.item[i].data_format_value[k].list_elements[m].list_label = this.attributes.item[i].data_format_value[k].list_elements[m + 1].list_label;
                    // } else if (m == 1 && this.attributes.item[i].data_format_value[k].list_elements.length == 2) {
                    //   this.attributes.item[i].data_format_value[k].list_elements[m].list_label = this.attributes.item[i].data_format_value[k].list_elements[m - 1].list_label;
                    // }
                  } else if (this.attributes.item[i].data_format_value[k].list_elements[m].element == 'Image') {
                    this.attributes.item[i].data_format_value[k].list_elements.splice(m, 1);

                    this.attributes.item[i].data_format_value[k].list_elements[0].list_data_format_id = 6;
                    this.attributes.item[i].data_format_value[k].list_elements[0].list_value = "";

                  } else if (this.attributes.item[i].data_format_value[k].list_elements[m].element == 'Audio') {
                    this.attributes.item[i].data_format_value[k].list_elements.splice(m, 1);

                    this.attributes.item[i].data_format_value[k].list_elements[0].list_data_format_id = 10;
                    this.attributes.item[i].data_format_value[k].list_elements[0].list_value = "";

                  } else if (this.attributes.item[i].data_format_value[k].list_elements[m].element == 'Video') {
                    this.attributes.item[i].data_format_value[k].list_elements.splice(m, 1);

                    this.attributes.item[i].data_format_value[k].list_elements[0].list_data_format_id = 11;
                    this.attributes.item[i].data_format_value[k].list_elements[0].list_value = "";

                  } else if (this.attributes.item[i].data_format_value[k].list_elements[m].element == 'List') {
                    this.attributes.item[i].data_format_value[k].list_elements.splice(m, 1);
                    this.alerts.push({
                      type: 'danger',
                      msg: `You cannot put list into list`,
                      timeout: 3000
                    });
                  }else if (this.attributes.item[i].data_format_value[k].list_elements[m].element == 'Table') {
                    this.attributes.item[i].data_format_value[k].list_elements.splice(m, 1);
                    this.alerts.push({
                      type: 'danger',
                      msg: `You cannot put table into list`,
                      timeout: 3000
                    });
                  }

                }
                if (this.attributes.item[i].data_format_value[k].list_elements.length == 3) {
                  this.attributes.item[i].data_format_value[k].list_elements.splice(this.attributes.item[i].data_format_value[k].list_elements.length - 1, 1);
                }
              }
            }
          }


        }
        // if (this.attributes.item.length == 25) {
        //   this.alerts.push({
        //     type: 'danger',
        //     msg: `You have reached the element limit (only 25 elements per Item are allowed)`,
        //     timeout: 4000
        //   });

        // }
      } else {
        for (var i = 0; i < this.attributes.item.length; i++) {
          if (this.attributes.item[i].element == "Statement") {
            this.attributes.item.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          } else if (this.attributes.item[i].element == "Image") {
            this.attributes.item.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          } else if (this.attributes.item[i].element == "Audio") {
            this.attributes.item.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          } else if (this.attributes.item[i].element == "Video") {
            this.attributes.item.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          } else if (this.attributes.item[i].element == "List") {
            this.attributes.item.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          }
        }
      }
    }

    // directives

    if (this.item_type == 6) {
      if (this.attributes.directive.length <= 25) {
        for (var i = 0; i < this.attributes.directive.length; i++) {
          if (this.attributes.directive[i].element == "Statement") {
            this.attributes.directive.splice(i, 1);
            this.attributes.directive.splice(i, 0, { item_df_id: 1, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
          } else if (this.attributes.directive[i].element == "Image") {
            this.attributes.directive.splice(i, 1);
            this.attributes.directive.splice(i, 0, { item_df_id: 6, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
          } else if (this.attributes.directive[i].element == "Audio") {
            this.attributes.directive.splice(i, 1);
            this.attributes.directive.splice(i, 0, { item_df_id: 10, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
          } else if (this.attributes.directive[i].element == "Video") {
            this.attributes.directive.splice(i, 1);
            this.attributes.directive.splice(i, 0, { item_df_id: 11, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
          } else if (this.attributes.directive[i].element == "List") {
            this.attributes.directive.splice(i, 1);
            this.attributes.directive.splice(i, 0, { item_df_id: 8, item_df_sequence: this.count + 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
            this.attributes.directive[i].data_format_value = [];
            this.attributes.directive[i].data_format_value.push(new listTypeArray());
            this.attributes.directive[i].data_format_value[0].list_elements.push(new listType());
            this.attributes.directive[i].data_format_value[0].list_elements[0].list_label = "A";
            this.attributes.directive[i].data_format_value[0].list_elements[0].list_sequence = 1;
            this.attributes.directive[i].data_format_value[0].list_elements[0].list_value = "";
            this.attributes.directive[i].data_format_value[0].list_elements[0].list_data_format_id = 1;
            this.attributes.directive[i].data_format_value[0].list_elements[0].list_data_identifier = "";
            this.attributes.directive[i].data_format_value[0].list_elements[0].previous_element_id = "";
            this.attributes.directive[i].data_format_value[0].list_elements[0].data_id = null;

          }else if (this.attributes.directive[i].element == "Table") {
            this.tableIndex = i;
            this.ShowTableModal = true;
          }
          if (this.attributes.directive[i].list_data_identifier == '') {
            this.attributes.directive.splice(i, 1);
          }
          else if(this.attributes.directive[i].item_df_id == 8){
            for (var k = 0; k < this.attributes.directive[i].data_format_value.length; k++) {
              if (this.attributes.directive[i].item_df_id == 8) {
                for(var d1=0;d1<this.attributes.directive[i].data_format_value.length;d1++){
                  if(this.attributes.directive[i].data_format_value[d1].element == 'Statement' || this.attributes.directive[i].data_format_value[d1].element == 'Image' || this.attributes.directive[i].data_format_value[d1].element == 'Audio' || this.attributes.directive[i].data_format_value[d1].element == 'Video' || this.attributes.directive[i].data_format_value[d1].element == 'List' || this.attributes.directive[i].data_format_value[d1].element == 'Table'){
                    this.attributes.directive[i].data_format_value.splice(d1,1);
                  }
                }
                for (var m = 0; m < this.attributes.directive[i].data_format_value[k].list_elements.length; m++) {

                  if (this.attributes.directive[i].data_format_value[k].list_elements[m].element == 'Statement') {
                    this.attributes.directive[i].data_format_value[k].list_elements.splice(m, 1);
                    this.attributes.directive[i].data_format_value[k].list_elements[0].list_data_format_id = 1;
                    this.attributes.directive[i].data_format_value[k].list_elements[0].list_value = "";

                  } else if (this.attributes.directive[i].data_format_value[k].list_elements[m].element == 'Image') {
                    this.attributes.directive[i].data_format_value[k].list_elements.splice(m, 1);

                    this.attributes.directive[i].data_format_value[k].list_elements[0].list_data_format_id = 6;
                    this.attributes.directive[i].data_format_value[k].list_elements[0].list_value = "";

                  } else if (this.attributes.directive[i].data_format_value[k].list_elements[m].element == 'Audio') {
                    this.attributes.directive[i].data_format_value[k].list_elements.splice(m, 1);

                    this.attributes.directive[i].data_format_value[k].list_elements[0].list_data_format_id = 10;
                    this.attributes.directive[i].data_format_value[k].list_elements[0].list_value = "";

                  } else if (this.attributes.directive[i].data_format_value[k].list_elements[m].element == 'Video') {
                    this.attributes.directive[i].data_format_value[k].list_elements.splice(m, 1);

                    this.attributes.directive[i].data_format_value[k].list_elements[0].list_data_format_id = 11;
                    this.attributes.directive[i].data_format_value[k].list_elements[0].list_value = "";

                  } else if (this.attributes.directive[i].data_format_value[k].list_elements[m].element == 'List') {
                    this.attributes.directive[i].data_format_value[k].list_elements.splice(m, 1);
                    this.alerts.push({
                      type: 'danger',
                      msg: `You cannot put list into list`,
                      timeout: 3000
                    });
                  } else if (this.attributes.directive[i].data_format_value[k].list_elements[m].element == 'Table') {
                    this.attributes.directive[i].data_format_value[k].list_elements.splice(m, 1);
                    this.alerts.push({
                      type: 'danger',
                      msg: `You cannot put table into list`,
                      timeout: 3000
                    });
                  }

                }
                if (this.attributes.directive[i].data_format_value[k].list_elements.length == 3) {
                  this.attributes.directive[i].data_format_value[k].list_elements.splice(this.attributes.directive[i].data_format_value[k].list_elements.length - 1, 1);
                }
              }
            }
          }
        }
        // if (this.attributes.directive.length == 25) {
        //   this.alerts.push({
        //     type: 'danger',
        //     msg: `You have reached the element limit (only 25 elements per Item are allowed)`,
        //     timeout: 4000
        //   });

        // }
      } else {
        for (var i = 0; i < this.attributes.directive.length; i++) {
          if (this.attributes.directive[i].element == "Statement") {
            this.attributes.directive.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          } else if (this.attributes.directive[i].element == "Image") {
            this.attributes.directive.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          } else if (this.attributes.directive[i].element == "Audio") {
            this.attributes.directive.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          } else if (this.attributes.directive[i].element == "Video") {
            this.attributes.directive.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          } else if (this.attributes.directive[i].element == "List") {
            this.attributes.directive.splice(i, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Maximum number of elements allowed per item is 25.`,
              timeout: 4000
            });

          }
        }
      }
    }

    //answer block mcq

    if (this.item_type == 1) {
      for (var i = 0; i < this.attributes.answer_choices.length; i++) {
        for (var j = 0; j < this.attributes.answer_choices[i].choice_elements.length; j++) {
          if (this.attributes.answer_choices[i].choice_elements[j].element == "Image") {
            this.attributes.answer_choices[i].choice_elements.splice(j, 1);
            this.attributes.answer_choices[i].choice_elements.splice(j, 0, { answer_df_id: 6, option_df_sequence: 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
            if(this.attributes.answer_choices[i].choice_elements.length >= 3){
              this.attributes.answer_choices[i].choice_elements.splice(j, 1);
              this.alerts.push({
                type: 'danger',
                msg: `Only two elements can be added for each answer option`,
                timeout: 3000
              });
            }
          }

          if (this.attributes.answer_choices[i].choice_elements[j].element == "Statement") {
            // if(this.attributes.answer_choices[i].choice_elements[j].length <=2){
            this.attributes.answer_choices[i].choice_elements.splice(j, 1);
            this.attributes.answer_choices[i].choice_elements.splice(j, 0, { answer_df_id: 1, option_df_sequence: 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });

            if(this.attributes.answer_choices[i].choice_elements.length >= 3){
              this.attributes.answer_choices[i].choice_elements.splice(j, 1);
              this.alerts.push({
                type: 'danger',
                msg: `Only two elements can be added for each answer option`,
                timeout: 3000
              });
            }
            // }
          }
          if (this.attributes.answer_choices[i].choice_elements[j].element == "Audio") {
            // if(this.attributes.answer_choices[i].choice_elements[j].length <=2){
            this.attributes.answer_choices[i].choice_elements.splice(j, 1);
            this.attributes.answer_choices[i].choice_elements.splice(j, 0, { answer_df_id: 10, option_df_sequence: 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
            if(this.attributes.answer_choices[i].choice_elements.length >= 3){
              this.attributes.answer_choices[i].choice_elements.splice(j, 1);
              this.alerts.push({
                type: 'danger',
                msg: `Only two elements can be added for each answer option`,
                timeout: 3000
              });
            }
            // }

          }
          if (this.attributes.answer_choices[i].choice_elements[j].element == "Video") {
            // if(this.attributes.answer_choices[i].choice_elements.length <=2){
            this.attributes.answer_choices[i].choice_elements.splice(j, 1);
            this.attributes.answer_choices[i].choice_elements.splice(j, 0, { answer_df_id: 11, option_df_sequence: 2, data_format_value: "", data_identifier: "", previous_df_id: "", data_id: null });
            if(this.attributes.answer_choices[i].choice_elements.length >= 3){
              this.attributes.answer_choices[i].choice_elements.splice(j, 1);
              this.alerts.push({
                type: 'danger',
                msg: `Only two elements can be added for each answer option`,
                timeout: 3000
              });
            }
            // }

          }
          if (this.attributes.answer_choices[i].choice_elements[j].element == "List") {
           this.attributes.answer_choices[i].choice_elements.splice(j, 1);
            this.alerts.push({
              type: 'danger',
              msg: `List are not allowed inside answer block`,
              timeout: 3000
            });
            break;
          }
          if (this.attributes.answer_choices[i].choice_elements[j].element == "Table") {
           this.attributes.answer_choices[i].choice_elements.splice(j, 1);
            this.alerts.push({
              type: 'danger',
              msg: `Table are not allowed inside answer block`,
              timeout: 3000
            });
            break;
          }
        }
      }
    }

    // match ans blk
    if (this.item_type == 3 && this.matchtypeSelected == 5) {
      for (var i = 0; i < this.attributes.answer_choices.length; i++) {
        for (var j = 0; j < this.attributes.answer_choices[i].choiceElement.length; j++) {

          if (this.attributes.answer_choices[i].choiceElement[j].element == "Image") {
            this.attributes.answer_choices[i].choiceElement.splice(j, 1);
            this.attributes.answer_choices[i].choiceElement[0].answer_df_id = 6;
            this.attributes.answer_choices[i].choiceElement[0].data_format_value = "";
            break;
          }
          if (this.attributes.answer_choices[i].choiceElement[j].element == "Statement") {
            this.attributes.answer_choices[i].choiceElement.splice(j, 1);
            this.attributes.answer_choices[i].choiceElement[0].answer_df_id = 1;
            this.attributes.answer_choices[i].choiceElement[0].data_format_value = "";
            break;
          }
          if (this.attributes.answer_choices[i].choiceElement[j].element == "Audio") {
            this.attributes.answer_choices[i].choiceElement.splice(j, 1);
            this.attributes.answer_choices[i].choiceElement[0].answer_df_id = 10;
            this.attributes.answer_choices[i].choiceElement[0].data_format_value = "";
            break;
          }
          if (this.attributes.answer_choices[i].choiceElement[j].element == "Video") {
            this.attributes.answer_choices[i].choiceElement.splice(j, 1);
            this.attributes.answer_choices[i].choiceElement[0].answer_df_id = 11;
            this.attributes.answer_choices[i].choiceElement[0].data_format_value = "";
            break;
          }
          if (this.attributes.answer_choices[i].choiceElement[j].element == "List") {
            this.attributes.answer_choices[i].choiceElement.splice(j, 1);
             this.alerts.push({
               type: 'danger',
               msg: `List are not allowed inside answer block`,
               timeout: 3000
             });
             break;
           }
           if (this.attributes.answer_choices[i].choiceElement[j].element == "Table") {
            this.attributes.answer_choices[i].choiceElement.splice(j, 1);
             this.alerts.push({
               type: 'danger',
               msg: `Table are not allowed inside answer block`,
               timeout: 3000
             });
             break;
           }
        }
      }
    }

    //match block
    if (this.item_type == 3 && (this.matchtypeSelected == 2 || this.matchtypeSelected == 3 || this.matchtypeSelected == 4 || this.matchtypeSelected == 5)) {

      for (var i = 0; i < this.attributes.item.length; i++) {
        if (this.attributes.item[i].item_df_id == 9) {
          for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {

            for (var k = 0; k < this.attributes.item[i].data_format_value[j].match_data.length; k++) {
              for (var l = 0; l < this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.length; l++) {
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Image") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0].match_data_format_id = 6;
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0].match_value = "";
                  break;
                }
                // this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].splice(l,0,{header: 0, previous_df_id: "", match_value: "", match_data_format_id: 6, data_identifier: "",label :data.label, hiddenObj:false,row_seq_id:null})
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Statement") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0].match_data_format_id = 1;
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0].match_value = "";
                  break;
                }
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Audio") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0].match_data_format_id = 10;
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0].match_value = "";
                  break;
                }
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Video") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0].match_data_format_id = 11;
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0].match_value = "";
                  break;
                }
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "List") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.alerts.push({
                    type: 'danger',
                    msg: `List is not allowed inside Match Block`,
                    timeout: 3000
                  });
                  break;
                }
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Table") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.alerts.push({
                    type: 'danger',
                    msg: `Table is not allowed inside Match Block`,
                    timeout: 3000
                  });
                  break;
                }
              }

            }
          }
        }
      }
    }

    if (this.item_type == 3 && (this.matchtypeSelected == 1)) {

      for (var i = 0; i < this.attributes.item.length; i++) {
        if (this.attributes.item[i].item_df_id == 9) {
          for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {

            for (var k = 0; k < this.attributes.item[i].data_format_value[j].match_data.length; k++) {
              for (var l = 0; l < this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.length; l++) {
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Image") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.alerts.push({
                    type: 'danger',
                    msg: `Only statement is allowed for dropdown match type`,
                    timeout: 3000
                  });
                  break;
                }
                // this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].splice(l,0,{header: 0, previous_df_id: "", match_value: "", match_data_format_id: 6, data_identifier: "",label :data.label, hiddenObj:false,row_seq_id:null})
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Statement") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.alerts.push({
                    type: 'danger',
                    msg: `Only statement is allowed for dropdown match type`,
                    timeout: 3000
                  });
                  break;
                }
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Audio") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.alerts.push({
                    type: 'danger',
                    msg: `Only statement is allowed for dropdown match type`,
                    timeout: 3000
                  });
                  break;
                }
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Video") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.alerts.push({
                    type: 'danger',
                    msg: `Only statement is allowed for dropdown match type`,
                    timeout: 3000
                  });
                  break;
                }
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "List") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.alerts.push({
                    type: 'danger',
                    msg: `Only statement is allowed for dropdown match type`,
                    timeout: 3000
                  });
                  break;
                }
                if (this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[l].element == "Table") {
                  this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray.splice(l, 1);
                  this.alerts.push({
                    type: 'danger',
                    msg: `Only statement is allowed for dropdown match type`,
                    timeout: 3000
                  });
                  break;
                }
              }

            }
          }
        }
      }

    }
  }


  // RTE
  public editorOptions = {
    placeholder: "Enter Statements here",
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        // ['formula']
      ]
    },
    theme: 'snow',
    maxLength : 3000
  };
   // RTE
   public ckeditorOptions = {
    placeholder: "Enter Statements here",
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        // ['formula']
      ]
    },
    theme: 'snow',
    maxLength : 3000
  };

  public editorOptionsAns = {
    placeholder: "Enter Answer Option",
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        // ['formula']
      ]
    },
    theme: 'snow',
    maxLength : 3000

  };


  options: FancyImageUploaderOptions = {
    thumbnailHeight: 210,
    thumbnailWidth: 290,
    authTokenPrefix: 'Bearer ',
    authToken: this.cookieService.get('_PTBA'),
    uploadUrl: credentials.host + '/images_upload/' + this.cookieService.get('_PAOID'),
    allowedImageTypes: ['image/png', 'image/jpeg'],
    maxImageSize: 5
  };

  ansoptions: FancyImageUploaderOptions = {
    thumbnailHeight: 167,
    thumbnailWidth: 288,
    authTokenPrefix: 'Bearer ',
    authToken: this.cookieService.get('_PTBA'),
    uploadUrl: credentials.host + '/images_upload/' + this.cookieService.get('_PAOID'),
    allowedImageTypes: ['image/png', 'image/jpeg'],
    maxImageSize: 5
  };
  match: FancyImageUploaderOptions = {
    thumbnailHeight: 134,
    thumbnailWidth: 172,
    authTokenPrefix: 'Bearer ',
    authToken: this.cookieService.get('_PTBA'),
    uploadUrl: credentials.host + '/images_upload/' + this.cookieService.get('_PAOID'),
    allowedImageTypes: ['image/png', 'image/jpeg'],
    maxImageSize: 5
  };

  imageoptionsList: FancyImageUploaderOptions = {
    thumbnailHeight: 150,

    authTokenPrefix: 'Bearer ',
    authToken: this.cookieService.get('_PTBA'),
    uploadUrl: credentials.host + '/images_upload/' + this.cookieService.get('_PAOID'),
    allowedImageTypes: ['image/png', 'image/jpeg'],
    maxImageSize: 5
  };

  fileChange(event, id) {
    this.spinAudioQB = true;
    if (this.authService.canActivate()) {
      let fileList: FileList = event.target.files;

      // this.showErrorAudio = "";
      this.uploadAudio = "";
      if (fileList[0].type == "audio/mp3" || fileList[0].type == "audio/mpeg") {
        if (fileList[0].size < 15000000) {
          if (fileList.length > 0) {
            let file: File = fileList[0];

            let body = new FormData();
            body.append('file', file, file.name);
            // body.append('org_id',this.cookieService.get('_PTBA'));

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
            this.http.post(credentials.host + '/audios_upload/' + this.cookieService.get('_PAOID'), body, { headers: headers })
              .map(res => res.json())
              .catch(error => Observable.throw(error))

              .subscribe(
              data => {
                if (data.success == true) {
                  this.spinAudioQB = false;

                  this.uploadAudio = data.path;

                  if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type == 5 || this.item_type == 7) {
                    this.attributes.item[id].data_format_value = data.path;

                  }
                  if (this.item_type == 6) {
                    this.attributes.directive[id].data_format_value = data.path;

                  }
                  this.audioTag = true;
                } else if (data.success == false) {
                  this.spinAudioQB = false;
                  this.showErrorAudio = data.message;
                }
              },
              error => {

                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              )
          }
        } else {
          this.spinAudioQB = false;
          this.alerts.push({
            type: 'danger',
            msg: "This File Size Exceeds the Maximum Limit of 15MB",
            timeout: 4000
          });
          // this.showErrorAudio="This File Size Exceeds the Maximum Limit of 15MB";
          this.checkIndex = id;
        }
      } else {
        this.spinAudioQB = false;
        this.alerts.push({
          type: 'danger',
          msg: "Invalid extension for file " + fileList[0].name + ". Only mp3 files are supported.",
          timeout: 4000
        });
        // this.showErrorAudio = "Invalid extension for file "+fileList[0].name+". Only mp3 files are supported.";
        this.checkIndex = id;
      }
      this.uploadAudio = "";
    }
  }

  fileChangeAudioMatch(event, i1, d1, m1) {
    if (this.authService.canActivate()) {
      this.spinAudioMatch = true;
      let fileList: FileList = event.target.files;

      // this.showErrorAudio = "";
      this.uploadAudioMatch = "";
      if (fileList[0].type == "audio/mp3" || fileList[0].type == "audio/mpeg") {
        if (fileList[0].size < 15000000) {
          if (fileList.length > 0) {
            this.audioNameMatch = fileList[0].name;
            let file: File = fileList[0];

            let body = new FormData();
            body.append('file', file, file.name);
            body.append('org_id', this.cookieService.get('_PAOID'));

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
            this.http.post(credentials.host + '/audios_upload/' + this.cookieService.get('_PAOID'), body, { headers: headers })
              .map(res => res.json())
              .catch(error => Observable.throw(error))

              .subscribe(
              data => {
                if (data.success == true) {
                  this.spinAudioMatch = false;

                  this.uploadAudioMatch = data.path;

                  this.attributes.item[i1].data_format_value[d1].match_data[m1].matchValueArray[0].match_value = data.path;
                  this.attributes.item[i1].data_format_value[d1].match_data[m1].matchValueArray[0].file_name = this.audioNameMatch;
                  this.checkIndexMatch = "";

                  this.audioTagMatch = true;
                } else if (data.success == false) {
                  this.spinAudioMatch = false;
                  this.showErrorAudioMatch = data.message;
                }
              },
              error => {
                this.spinAudioMatch = false;
                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              )
          }
        } else {
          this.spinAudioMatch = false;
          this.alerts.push({
            type: 'danger',
            msg: "This File Size Exceeds the Maximum Limit of 15MB",
            timeout: 4000
          });
          // this.showErrorAudioMatch="This File Size Exceeds the Maximum Limit of 15MB";
          setTimeout(() => {
            this.showErrorAudioMatch = "";
          }, 5000);
          this.checkIndexMatch = m1;
        }
      } else {
        this.spinAudioMatch = false;
        this.alerts.push({
          type: 'danger',
          msg: "Invalid extension for file " + fileList[0].name + ". Only mp3 files are supported.",
          timeout: 4000
        });
        // this.showErrorAudioMatch = "Invalid extension for file "+fileList[0].name+". Only mp3 files are supported.";
        setTimeout(() => {
          this.showErrorAudioMatch = "";
        }, 5000);
        this.checkIndexMatch = m1;
      }
      this.uploadAudioMatch = "";
    }
  }

  deleteAudio(i1, d1, m1) {
    this.attributes.item[i1].data_format_value[d1].match_data[m1].matchValueArray[0].match_value = '';
    this.checkIndexMatch = m1;
  }

  showAudioElement(data, name) {

    this.sourceNameMatch = data;
    this.audioNameMatch = name;
    this.showAudio = true;
    this.closable = true;
  }

  closeAudio() {
    this.showAudio = false;
  }

  deleteVideo(i1, d1, m1) {
    this.attributes.item[i1].data_format_value[d1].match_data[m1].matchValueArray[0].match_value = '';
    this.checkIndexMatch = m1;
  }

  showVideoElement(data, name) {
    this.sourceNameMatch = data;
    this.videoNameMatch = name
    this.showVideo = true;
    this.closable = true;
  }

  closeVideo() {
    this.showVideo = false;
  }

  fileChangeAns(event, choiceId, eltId) {
    if (this.authService.canActivate()) {
      this.spinAudioAB = true;

      let fileList: FileList = event.target.files;

      this.uploadAudioAns = "";
      if (fileList[0].type == "audio/mp3" || fileList[0].type == "audio/mpeg") {
        if (fileList[0].size < 15000000) {
          if (fileList.length > 0) {
            let file: File = fileList[0];

            let body = new FormData();
            body.append('file', file, file.name);
            body.append('org_id', this.cookieService.get('_PAOID'));

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
            this.http.post(credentials.host + '/audios_upload/' + this.cookieService.get('_PAOID'), body, { headers: headers })
              .map(res => res.json())
              .catch(error => Observable.throw(error))
              .subscribe(
              data => {

                if (data.success == true) {
                  this.spinAudioAB = false;
                  this.uploadAudioAns = data.path;
                  if (this.item_type == 1) {
                    this.attributes.answer_choices[choiceId].choice_elements[eltId].data_format_value = data.path;
                    this.showErrorAudioAns = "";
                  }
                  if (this.matchtypeSelected == 5) {
                    this.attributes.answer_choices[choiceId].choiceElement[0].data_format_value = data.path;

                    this.showErrorAudioAns = "";
                  }
                  this.audioTagAns = true;
                } else if (data.success == false) {
                  this.spinAudioAB = false;
                  this.showErrorAudioAns = data.message;
                }
              },
              error => {

                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              )
          }
        } else {
          this.spinAudioAB = false;
          this.alerts.push({
            type: 'danger',
            msg: 'This File Size Exceeds the Maximum Limit of 15M',
            timeout: 4000
          });
          // this.showErrorAudioAns="This File Size Exceeds the Maximum Limit of 15MB"
          setTimeout(() => {
            this.showErrorAudioAns = "";
          }, 5000);
          this.checkIndexAnsAudio = eltId;
          if (this.matchtypeSelected == 4) {
            this.checkIndexAnsAudio = choiceId;
          }
        }
      } else {
        this.spinAudioAB = false;
        this.alerts.push({
          type: 'danger',
          msg: "Invalid extension for file " + fileList[0].name + ". Only mp3 files are supported.",
          timeout: 4000
        });
        // this.showErrorAudioAns = "Invalid extension for file "+fileList[0].name+". Only mp3 files are supported."
        setTimeout(() => {
          this.showErrorAudioAns = "";
        }, 5000);
        this.checkIndexAnsAudio = eltId;
        if (this.matchtypeSelected == 4) {
          this.checkIndexAnsAudio = choiceId;
        }
      }
      this.uploadAudioAns = "";
    }
  }

  ShowDiv(divVal: string) {
    this.currDiv = divVal;
    console.log(divVal);
  }

  fileChangeVideo(event, id) {
    if (this.authService.canActivate()) {
      this.spinVideoQB = true;
      let fileList: FileList = event.target.files;

      this.uploadVideo = "";
      // this.showErrorVideo ="";
      if (fileList[0].type == "video/mp4") {
        if (fileList[0].size < 15000000) {
          if (fileList.length > 0) {
            let file: File = fileList[0];

            let body = new FormData();
            body.append('file', file, file.name);
            body.append('org_id', this.cookieService.get('_PAOID'));

            let headers = new Headers();            
			//headers.append('Content-Type', 'multipart/form-data');			
			//headers.set('Accept', 'application/json');
			
			headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
			
            this.http.post(credentials.host + '/videos_upload/' + this.cookieService.get('_PAOID'), body, { headers: headers })
              .map(res => res.json())
              .catch(error => Observable.throw(error))

              .subscribe(
              data => {

                if (data.success == true) {
                  this.spinVideoQB = false;
                  this.uploadVideo = data.path;

                  if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type == 5 || this.item_type == 7) {
                    this.attributes.item[id].data_format_value = data.path;

                  }
                  if (this.item_type == 6) {
                    this.attributes.directive[id].data_format_value = data.path;

                  }
                  this.videoTag = true;
                } else if (data.success == false) {
                  this.spinVideoQB = false;
                  //this.showErrorVideo = data.message;
                }
              },
              error => {
                this.spinVideoQB = false;
                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              )
          }
        } else {
          this.spinVideoQB = false;
          this.alerts.push({
            type: 'danger',
            msg: "This File Size Exceeds the Maximum Limit of 15MB",
            timeout: 4000
          });
          // this.showErrorVideo="This File Size Exceeds the Maximum Limit of 15MB";
          this.checkIndexAns1 = id;
        }
      } else {
        this.spinVideoQB = false;
        this.alerts.push({
          type: 'danger',
          msg: "Invalid extension for file " + fileList[0].name + ". Only mp4 and avi files are supported.",
          timeout: 4000
        });
        // this.showErrorVideo = "Invalid extension for file "+fileList[0].name+". Only mp4 and avi files are supported."
        this.checkIndexAns1 = id;
      }
      this.uploadVideo = ""
    }
  }


  fileChangeVideoMatch(event, i1, d1, m1) {
    if (this.authService.canActivate()) {
      this.spinVideoMatch = true;
      let fileList: FileList = event.target.files;
	
      // this.showErrorAudio = "";
      this.uploadAudioMatch = "";
      if (fileList[0].type == "video/mp4") {
        if (fileList[0].size < 15000000) {
          if (fileList.length > 0) {
            this.videoNameMatch = fileList[0].name;
            let file: File = fileList[0];

            let body = new FormData();
            body.append('file', file, file.name);
            body.append('org_id', this.cookieService.get('_PAOID'));

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
            this.http.post(credentials.host + '/videos_upload/' + this.cookieService.get('_PAOID'), body, { headers: headers })
              .map(res => res.json())
              .catch(error => Observable.throw(error))

              .subscribe(
              data => {
                if (data.success == true) {
                  this.spinVideoMatch = false;

                  this.uploadVideoMatch = data.path;

                  this.attributes.item[i1].data_format_value[d1].match_data[m1].matchValueArray[0].match_value = data.path;
                  this.attributes.item[i1].data_format_value[d1].match_data[m1].matchValueArray[0].file_name = this.videoNameMatch;
                  this.checkIndexMatchVideo = "";

                  this.videoTagMatch = true;
                } else if (data.success == false) {
                  this.spinVideoMatch = false;
                  this.showErrorVideoMatch = data.message;
                }
              },
              error => {

                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              )
          }
        } else {
          this.spinVideoMatch = false;
          this.alerts.push({
            type: 'danger',
            msg: "This File Size Exceeds the Maximum Limit of 15MB",
            timeout: 4000
          });
          // this.showErrorVideoMatch="This File Size Exceeds the Maximum Limit of 15MB";
          setTimeout(() => {
            this.showErrorVideoMatch = "";
          }, 5000);
          this.checkIndexMatchVideo = m1;
        }
      } else {
        this.spinVideoMatch = false;
        this.alerts.push({
          type: 'danger',
          msg: "Invalid extension for file " + fileList[0].name + ". Only mp3 files are supported.",
          timeout: 4000
        });
        // this.showErrorVideoMatch = "Invalid extension for file "+fileList[0].name+". Only mp3 files are supported.";
        setTimeout(() => {
          this.showErrorVideoMatch = "";
        }, 5000);
        this.checkIndexMatchVideo = m1;
      }
      this.uploadVideoMatch = "";
    }
  }

  fileChangeVideoAns(event, choiceId, eltId) {
    if (this.authService.canActivate()) {
      this.spinVideoAB = true;

      let fileList: FileList = event.target.files;

      this.uploadVideoAns = "";
      // this.showErrorVideoAns ="";
      if (fileList[0].type == "video/mp4") {
        if (fileList[0].size < 15000000) {
          if (fileList.length > 0) {
            let file: File = fileList[0];

            let body = new FormData();
            body.append('file', file, file.name);
            body.append('org_id', this.cookieService.get('_PAOID'));

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
            this.http.post(credentials.host + '/videos_upload/' + this.cookieService.get('_PAOID'), body, { headers: headers })
              .map(res => res.json())
              .catch(error => Observable.throw(error))

              .subscribe(
              data => {
                if (data.success == true) {
                  this.spinVideoAB = false;

                  this.uploadVideoAns = data.path;
                  if (this.item_type == 1) {
                    this.attributes.answer_choices[choiceId].choice_elements[eltId].data_format_value = data.path;
                    this.showErrorVideoAns = "";
                  }
                  if (this.matchtypeSelected == 5) {
                    this.attributes.answer_choices[choiceId].choiceElement[0].data_format_value = data.path;

                    this.showErrorVideoAns = "";
                  }
                  this.videoTagAns = true;
                } else if (data.success == false) {
                  this.spinVideoAB = false;
                  this.showErrorVideoAns = data.message;
                }
              },
              error => {
                this.spinVideoAB = false;
                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              )
          }
        } else {
          this.spinVideoAB = false;
          this.alerts.push({
            type: 'danger',
            msg: "This File Size Exceeds the Maximum Limit of 15MB",
            timeout: 4000
          });
          // this.showErrorVideoAns="This File Size Exceeds the Maximum Limit of 15MB";
          setTimeout(() => {
            this.showErrorVideoAns = "";
          }, 5000);
          this.checkIndexAns = eltId;
          if (this.matchtypeSelected == 4) {
            this.checkIndexAns = choiceId;
          }
        }
      } else {
        this.spinVideoAB = false;
        this.alerts.push({
          type: 'danger',
          msg: "Invalid extension for file " + fileList[0].name + ". Only mp4 and avi files are supported.",
          timeout: 4000
        });
        // this.showErrorVideoAns = "Invalid extension for file "+fileList[0].name+". Only mp4 and avi files are supported.";
        setTimeout(() => {
          this.showErrorVideoAns = "";
        }, 5000);
        this.checkIndexAns = eltId;
        if (this.matchtypeSelected == 4) {
          this.checkIndexAns = choiceId;
        }
      }
      this.uploadVideoAns = "";
      // this.checkIndexAns = "";
    }
  }


  UploadAudioList(event, i, d, l) {
    this.spinAudioQBList = true;
    if (this.authService.canActivate()) {
      let fileList: FileList = event.target.files;

      // this.showErrorAudio = "";
      this.uploadAudio = "";
      if (fileList[0].type == "audio/mp3" || fileList[0].type == "audio/mpeg") {
        if (fileList[0].size < 15000000) {
          if (fileList.length > 0) {
            let file: File = fileList[0];

            let body = new FormData();
            body.append('file', file, file.name);
            // body.append('org_id',this.cookieService.get('_PTBA'));

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
            this.http.post(credentials.host + '/audios_upload/' + this.cookieService.get('_PAOID'), body, { headers: headers })
              .map(res => res.json())
              .catch(error => Observable.throw(error))

              .subscribe(
              data => {
                if (data.success == true) {
                  this.spinAudioQBList = false;

                  this.uploadAudio = data.path;

                  if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type == 5) {
                    this.attributes.item[i].data_format_value[d].list_elements[l].list_value = data.path;

                  }
                  if (this.item_type == 6) {
                    this.attributes.directive[i].data_format_value[d].list_elements[l].list_value = data.path;

                  }
                  this.audioTag = true;
                } else if (data.success == false) {
                  this.spinAudioQBList = false;
                  // this.showErrorAudio = data.message;
                  this.alerts.push({
                    type: 'danger',
                    msg: data.message,
                    timeout: 4000
                  });
                }
              },
              error => {

                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              )
          }
        } else {
          this.spinAudioQBList = false;
          this.alerts.push({
            type: 'danger',
            msg: "This File Size Exceeds the Maximum Limit of 15MB",
            timeout: 4000
          });
          // this.showErrorAudio="This File Size Exceeds the Maximum Limit of 15MB";
          // this.checkIndex = id;
        }
      } else {
        this.spinAudioQB = false;
        this.alerts.push({
          type: 'danger',
          msg: "Invalid extension for file " + fileList[0].name + ". Only mp3 files are supported.",
          timeout: 4000
        });
        // this.showErrorAudio = "Invalid extension for file "+fileList[0].name+". Only mp3 files are supported.";
        // this.checkIndex = id;
      }
      this.uploadAudio = "";
    }
  }


  uploadVideoList(event, i, d, l) {
    if (this.authService.canActivate()) {
      this.spinVideoQBList = true;
      let fileList: FileList = event.target.files;

      this.uploadVideo = "";
      // this.showErrorVideo ="";
      if (fileList[0].type == "video/mp4") {
        if (fileList[0].size < 15000000) {
          if (fileList.length > 0) {
            let file: File = fileList[0];

            let body = new FormData();
            body.append('file', file, file.name);
            body.append('org_id', this.cookieService.get('_PAOID'));

            let headers = new Headers();
            headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
            this.http.post(credentials.host + '/videos_upload/' + this.cookieService.get('_PAOID'), body, { headers: headers })
              .map(res => res.json())
              .catch(error => Observable.throw(error))

              .subscribe(
              data => {

                if (data.success == true) {
                  this.spinVideoQBList = false;
                  this.uploadVideo = data.path;

                  if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type == 5) {
                    this.attributes.item[i].data_format_value[d].list_elements[l].list_value = data.path;
                  }
                  if (this.item_type == 6) {
                    this.attributes.directive[i].data_format_value[d].list_elements[l].list_value = data.path;

                  }
                  this.videoTag = true;
                } else if (data.success == false) {
                  this.spinVideoQBList = false;
                  this.alerts.push({
                    type: 'danger',
                    msg: data.message,
                    timeout: 4000
                  });
                }
              },
              error => {
                this.spinVideoQBList = false;
                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              )
          }
        } else {
          this.spinVideoQBList = false;
          this.alerts.push({
            type: 'danger',
            msg: "This File Size Exceeds the Maximum Limit of 15MB",
            timeout: 4000
          });
          // this.showErrorVideo="This File Size Exceeds the Maximum Limit of 15MB";
          // this.checkIndexAns1 = id;
        }
      } else {
        this.spinVideoQBList = false;
        this.alerts.push({
          type: 'danger',
          msg: "Invalid extension for file " + fileList[0].name + ". Only mp4 and avi files are supported.",
          timeout: 4000
        });
        // this.showErrorVideo = "Invalid extension for file "+fileList[0].name+". Only mp4 and avi files are supported."
        // this.checkIndexAns1 = id;
      }
      this.uploadVideo = ""
    }
  }




  public myDatePickerOptions: IMyDpOptions = {

    dateFormat: 'dd-mmm-yyyy',
    disableUntil: { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() },
    inline: false,
    alignSelectorRight: true,
    selectionTxtFontSize: '12px',
    openSelectorOnInputClick: true,
    editableDateField: false,
    height: '28px',
    showInputField: true,
    ariaLabelInputField: "Select",
    markCurrentDay: true

  };
  private placeholder: string = 'DD-MM-YYYY';

  public selectedFiles;
  public showItemDescription: any;
  public showMatchItemDescription: any;
  public showMatchDescription : boolean = false;
  public getDetails;
  public pathDirect;
  public difficulty_level: string;
  public taxonomy: string;
  public language: string;
  public content_type = [];
  public item_valid_till: any;
  public explanation: any;
  public hint: any;
  public search_keywords: any;
  public ref_link: any;
  public allUsersList;
  // public allUsersLists;
  public labelOfCF;
  public selectedSub = [];
  public selectedTopic = [];
  public subtopic = [];
  public selectedSubtopic = [];
  public sortItem = [];
  public copyItem = [];
  public item_type: number;
  public directive_id: any;
  public counter;
  public score: any = 0;
  public correct_answer = false;
  public selectType = "Single Correct Answer"
  public itemset_id;
  public section_id;

  public selectedSubjects = [];
  public difficultyLevel = [];
  public contentType = [];
  public taxonomyList = [];
  public subjectList = [];
  public topicsList = [];
  public subtopicList = [];
  public itemType = [];
  public elementType = [];
  public matchTypes = [];
  public save = {};
  public answer;
  public activeMatchState;
  public subLabelName;
  public topLabelName;
  public subTopLabelName;
  public diffLevelLabelName;
  public TaxonomyLabelName;
  public languageList = [];

  public sec_attr_0;
  public sec_attr_1;
  public sec_attr_2;
  public sec_attr_3;
  public sec_attr_4;
  public sec_attr_5;
  public sec_attr_6;
  public sec_attr_7;
  public sec_attr_8;
  public sec_attr_9;
  public sec_attr_10;
  public sec_attr_11;
  public sec_attr_12;
  public sec_attr_13;
  public sec_attr_14;
  public sec_attr_15;
  public sec_attr_16;
  public sec_attr_17;
  public sec_attr_18;
  public sec_attr_19;

  public ContentTypelabelName: string;
  public statementDroppedItems: any = [];
  public answerBlockArray: any = [];
  public imageDroppedItems: any = [];
  public trueorfalseBlk;
  public mcqBlk;
  public matchBlk;
  public isDisable: boolean;
  public activeIndex: number;
  public activeIcon: number;
  public count: number = 1;
  public showIcon: boolean;
  public modalPopup: boolean;
  public choiceAnswer = [];
  public selectedType: boolean;
  public showGradedScore: boolean;
  public showGradedScore1;
  public path;
  public tenantMetaData;

  public tenenat_attr_label: any = [];
  public tenenat_attr_label1: any = [];
  public tenenat_attr_label2: any = [];
  public tenenat_attr_label3: any = [];
  public tenenat_attr_label4: any = [];
  public tenenat_attr_label5: any = [];
  public tenenat_attr_label6: any = [];
  public tenenat_attr_label7: any = [];
  public tenenat_attr_label8: any = [];
  public tenenat_attr_label9: any = [];
  public tenenat_attr_label10: any = [];
  public tenenat_attr_label11: any = [];
  public tenenat_attr_label12: any = [];
  public tenenat_attr_label13: any = [];
  public tenenat_attr_label14: any = [];
  public tenenat_attr_label15: any = [];
  public tenenat_attr_label16: any = [];
  public tenenat_attr_label17: any = [];
  public tenenat_attr_label18: any = [];
  public tenenat_attr_label19: any = [];
  
  public subErr: boolean;
  public topErr: boolean;
  public diffErr: boolean;
  public taxErr: boolean;
  public langErr: boolean;
  public expErr: boolean;
  public keyErr: boolean;
  public content1 = [];
  public scoreIndex;
  public errIndex = -1;
  public ansIndex = -1;
  public matchIndex = -1;
  public matchGradedScore = -1;
  public Icon = [];
  settings1 = {};
  settings2 = {};
  settings3 = {};
  settings4 = {};
  fileTypesettings1 = {};
  fileTypesettings2 = {};
  fileTypesettings3 = {};
  public graded;
  public checkarray = [];
  public arrayItem = [];
  public saveload;
  public saveMSg;
  public uploadAudio;
  public uploadVideo;
  public uploadVideoAns;
  public audioTag;
  public videoTag;
  public videoTagAns;
  public showErrorAudio;
  public showErrorVideo;
  public showErrorVideoAns;
  public checkIndex;
  public checkIndexAns;
  public uploadAudioMatch;
  public audioTagMatch;
  public showErrorAudioMatch;
  public showAudio;
  public checkIndexMatch;
  public uploadVideoMatch;
  public videoTagMatch;
  public showErrorVideoMatch;
  public showVideo;
  public uploadAudioAns;
  public audioTagAns;
  public showErrorAudioAns;
  public checkIndexAnsAudio;
  public checkIndexMatchVideo;
  public checkIndexAns1;
  public audioNameMatch;
  public videoNameMatch;
  public sourceNameMatch;
  public fileName;
  public showMsg;
  public enableToggle = false;
  public enableToggleMatch = false;
  public itemLevelMultipleCrtAns;
  public gradedLevelSingleCrtAns;
  public totalGraderScoreErr;
  public totalGradedScoreCount;
  public cancelItemAlert;
  public itemsetDet;
  public bulkUploadId;
  public spinAudioQBList = false;
  public spinVideoQBList = false;

  public CF_Labels = [];

  //match
  public matchtypeSelected;
  public hideOption;
  public toggleMatchType;
  public matchAlert;
  public scoreIndexMatch;
  public rowIndex;
  public matrixAnsBlock = [];
  public matchLength = 4;
  public extraOptionLength = 0;
  public disableMatchSelect;

  //preview
  public showPreviewModal;
  public arrayToDrag = [];
  public getDirectiveQuestion;

  // directive
  public directiveBlk;
  public answer_Option_Index;
  public answer_Option_data;
  public disableDirective;
  public itemCount;
  public viewItemBlk;
  public viewItemQuestions;
  public showItem;
  public ansLabel;
  public previewArray;
  public questionCount;
  public directiveContent;
  public itemId;
  public item_type_view;
  public date1;
  public isDirective;
  public directiveErr;
  public showDirectiveInEdit = false;
  public selectedItemTypes;
  public showItemType;
  public alerts: any[] = [];
  public ImageLoader;
  public spinAudioQB;
  public spinVideoQB;
  public spinAudioMatch;
  public spinVideoMatch;
  public spinAudioAB;
  public spinVideoAB;
  public clickedItemType;
  public itemTypeIndex;
  public retainAttr;
  public TfOption = false;
  public pattern1 = /^[^\s].*/;

  public cf_Values;

  // list & table var
  public listDropdown = true;
  public listRowErr = -1;
  public listArrayErr = -1;
  public ShowTableModal = false;
  public choosedRowIndex;
  public choosedColIndex;
  public fixRC = false;
  public tableTypes;
  public keywordArray = [];
  public tblKeyword;
  public isColumnHeader = false;
  public isRowHeader = false;
  public tableIndex;
  public HoveredColIndex;
  public HoveredRowIndex;
  public hideTblColBtn;
  public activeTblType;
  public hightlightTblClr;
  public tblColumnDataErr;
  public allUsersLists = [];
  public allUsersLists_CF = [];
  public allUsersLists_CF_Values = [];

  // free text var

  public freeTextBlk:boolean;
  public freeTextGradedScoreErr:number;
  public freeTextGradedTotalScoreErr:number;
  public scorepattern = /^[1-9][0-9]+([,.][0-9]+)?$/;

  public negAnsArray = [];
  public NegAnsAlert = -1;

  // equations
  public openEquation = false;
  public openEquationAB = false;

  public cameFrom;
  public goToHere;

  public showSaveASBtnFlag = true;


  // file upload var
  public fileUploadBlk = false;
  public FileFormatListMetaData;
  public fileMetaDataTypeList;
  public fileTypeErr = false;
  public fileFormatErr = false;
  public FileFormatList = [];
  public fileChoosen;

  public open_Attribute_Tab;
  public open_Custom_Attribute_Tab;



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


  onImageUpload(file, ids) {

    this.ImageLoader = true;
    var path = JSON.parse(file.response)
    // if(this.item_type ==1 || this.item_type ==2){
    //   for(var i=0;i<this.statementDroppedItems.length;i++){
    //     if(this.statementDroppedItems[i].element == "Image" && this.statementDroppedItems[i].id == ids){
    //       this.statementDroppedItems[i].value = path.path;
    //     }
    //   }
    // }
    if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type == 5 || this.item_type == 7) {
      if (path.success == true) {
        this.ImageLoader = false;
        this.attributes.item[ids].data_format_value = path.path;
      } else {
        this.ImageLoader = false;
        this.alerts.push({
          type: 'danger',
          msg: path.message,
          timeout: 4000
        });
      }
    } else if (this.item_type == 6) {
      if (path.success == true) {
        this.ImageLoader = false;
        this.attributes.directive[ids].data_format_value = path.path;
      } else {
        this.ImageLoader = false;
        this.alerts.push({
          type: 'danger',
          msg: path.message,
          timeout: 4000
        });
      }
    }

  }

  onImageUploadAns(file, choiceId, eltId) {
    this.ImageLoader = true;
    var path = JSON.parse(file.response);
    if (this.item_type == 1) {
      if (path.success == true) {
        this.ImageLoader = false;
        this.attributes.answer_choices[choiceId].choice_elements[eltId].data_format_value = path.path;
      } else {
        this.ImageLoader = false;
        this.alerts.push({
          type: 'danger',
          msg: path.message,
          timeout: 4000
        });
      }
    }
    if (this.matchtypeSelected == 5) {
      if (path.success == true) {
        this.ImageLoader = false;
        this.attributes.answer_choices[choiceId].choiceElement[0].data_format_value = path.path;
      } else {
        this.ImageLoader = false;
        this.alerts.push({
          type: 'danger',
          msg: path.message,
          timeout: 4000
        });
      }
    }
  }

  onImageUploadmatch(file, i1, d1, m1) {
    this.ImageLoader = true;
    var path = JSON.parse(file.response)
    if (path.success == true) {
      this.ImageLoader = false;
      this.attributes.item[i1].data_format_value[d1].match_data[m1].matchValueArray[0].match_value = path.path;
    } else {
      this.ImageLoader = false;
      this.alerts.push({
        type: 'danger',
        msg: path.message,
        timeout: 4000
      });
    }

  }

  onImageUploadList(file, i1, d1, l1) {
    this.ImageLoader = true;
    var path = JSON.parse(file.response)
    if (path.success == true) {
      this.ImageLoader = false;
      if (this.item_type != 6) {
        this.attributes.item[i1].data_format_value[d1].list_elements[l1].list_value = path.path;
      }
      if (this.item_type == 6) {
        this.attributes.directive[i1].data_format_value[d1].list_elements[l1].list_value = path.path;
      }
    } else {
      this.ImageLoader = false;
      this.alerts.push({
        type: 'danger',
        msg: path.message,
        timeout: 4000
      });
    }
  }

  removeElement(index) {
    // if(this.item_type ==1 || this.item_type ==2){
    //   this.activeIcon = index;
    //   this.showIcon = true;
    //   // this.statementDroppedItems.splice(index,1);
    // }
    if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type == 5 || this.item_type == 7) {
      this.activeIcon = index;
      this.showIcon = true;
      this.attributes.item.splice(index, 1);
    }
    else if (this.item_type == 6) {

      this.attributes.directive.splice(index, 1);
    }

  }

  getSelectType(value) {
    if (value == "Multiple Correct Answers") {
      this.selectedType = true;
      this.attributes.answer_type = "Multiple Correct Answers";
    }
    else {
      this.selectedType = false;
      this.attributes.answer_type = "Single Answer";
    }
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }


  deleteImageQueBlk(index) {
    this.attributes.item[index].data_format_value = '';
  }

  deleteImageAnsBlk(eltId, choiceId) {
    this.attributes.answer_choices[eltId].choice_elements[choiceId].data_format_value = '';
  }

  deleteImageQueBlkDirective(index) {
    this.attributes.directive[index].data_format_value = '';
  }

  deleteImageMatchBlk(i, d, m) {
    this.attributes.item[i].data_format_value[d].match_data[m].matchValueArray[0].match_value = '';
  }

  deleteImageList(i, d, l) {
    this.attributes.item[i].data_format_value[d].list_elements[l].list_value = '';
  }

  matchTypeImage(index) {

    this.activeMatchState = index;
  }

  showMatchDesc(data){
    this.showMatchDescription = true;
    if(data === "Dropdown Answers"){
      this.showMatchItemDescription = "Dropdown Answers";
    }
    if(data === "Pool of Answer"){
      this.showMatchItemDescription = "Pool of Answers";
    }
    if(data === "Interchange Answers"){
      this.showMatchItemDescription = "Interchange Answers";
    }
    if(data === "Matrix"){
      this.showMatchItemDescription = "Matrix";
    }
    if(data === "Exact Match"){
      this.showMatchItemDescription = "Exact Match";
    }
  }
  // change item type and clear all values if value is entered in any item type  ---- when item type from menus is clicked

  itemTypes(item, index, template1: TemplateRef<any>, template2: TemplateRef<any>) {
      this.sec_attr_0 = null;
      this.sec_attr_1 = null;
      this.sec_attr_2 = null;
      this.sec_attr_3 = null;
      this.sec_attr_4 = null;
      this.sec_attr_5 = null;
      this.sec_attr_6 = null;
      this.sec_attr_7 = null;
      this.sec_attr_8 = null;
      this.sec_attr_9 = null;
      this.sec_attr_10 = null;
      this.sec_attr_11 = null;
      this.sec_attr_12 = null;
      this.sec_attr_13 = null;
      this.sec_attr_14 = null;
      this.sec_attr_15 = null;
      this.sec_attr_16 = null;
      this.sec_attr_17 = null;
      this.sec_attr_18 = null;
      this.sec_attr_19 = null;
    if (this.authService.canActivate()) {
      this.clickedItemType = item;
      this.itemTypeIndex = index;
      this.tblColumnDataErr = -1;
      // form JSON structure based on item type selected
      if (item == "Multiple Choice") {
        var alertflag = false;
        // show alert when any field is filled while change item type
        if (this.item_type == 2) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {

              if (this.attributes.answer_choices[i].correct_answer == true) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }

        if (this.item_type == 3) {
          for (var i = 0; i < this.attributes.item.length; i++) {

            if (this.attributes.item[i].item_df_id != 9) {
              if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
                alertflag = true;
                break;
              }
            } else {
              for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
                if (this.attributes.item[i].data_format_value[j].match_data[0].matchValueArray[0].match_value != '' || (this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0].match_value != '')) {
                  alertflag = true;
                  break;
                }
                if (j != 0) {
                  if (this.attributes.item[i].data_format_value[j].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
              if (this.attributes.item[i].score != 1) {
                alertflag = true;
                break;
              }
            }

            if (this.attributes.item[i].matchlist_type == 4) {
              for (var k = 0; k < this.matrixAnsBlock.length; k++) {
                for (var l = 0; l < this.matrixAnsBlock[k].answer_choices.length; l++) {
                  if (this.matrixAnsBlock[k].answer_choices[l].data_format_value != '' || this.matrixAnsBlock[k].answer_choices[l].correct_answer == true || this.matrixAnsBlock[k].answer_choices[l].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
            }
            if (alertflag == false) {
              if (this.attributes.item[i].matchlist_type == 4 || this.attributes.item[i].matchlist_type == 5)
                if (this.score != 1) {
                  alertflag = true;
                }
            }
          }


          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config))
          }

        }
        if (this.item_type == 5) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].answer_data != ''){
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        if (this.item_type == 6) {
          for (var i = 0; i < this.attributes.directive.length; i++) {
            if (this.attributes.directive[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        if (this.item_type == 7) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].description != ''){
                alertflag = true;
              }
              if (this.attributes.answer_choices[i].fileFormatLits.length !=0) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }



        if (alertflag == false) {
          this.activeIndex = index;
          this.selectedItemTypes = "Multiple Choice";
          this.trueorfalseBlk = false;
          this.mcqBlk = true;
          this.matchBlk = false;
          this.freeTextBlk = false;
          this.directiveBlk = false;
          this.fileUploadBlk = false;
          this.disableMatchSelect = false;
          this.topErr = false;
          this.subErr = false;
          this.diffErr = false;
          this.taxErr = false;
          this.langErr = false;
          this.expErr = false;
          this.keyErr = false;
          this.showGradedScore = true;
          this.enableToggle = false;
          this.graded = 0;
          this.matchGradedScore = -1;
          this.scoreIndex = 0;
          this.checkarray = [];
          this.arrayItem = [];
          this.itemLevelMultipleCrtAns = 0;
          this.gradedLevelSingleCrtAns = 0;
          this.totalGraderScoreErr = 0;
          this.totalGradedScoreCount = 0;
          this.errIndex = -1;
          this.ansIndex = -1;
          this.directiveErr = -1;
          this.matchIndex = -1;
          this.activeMatchState = 0;
          this.item_type = 1;
          this.attributes.answer_choices = [];
          this.attributes.directive = [];
          this.attributes.item = [];
          this.score = 1;
          this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });

          for (this.counter = 0; this.counter < 4; this.counter++) {
            this.attributes.answer_choices.push(new answerChoice());
            this.attributes.answer_choices[this.counter].choice_elements.push(new answerChoiceType());
            this.attributes.answer_choices[this.counter].choice_elements[0].option_df_sequence = 1;
            this.attributes.answer_choices[this.counter].choice_elements[0].data_format_value = "";
            this.attributes.answer_choices[this.counter].choice_elements[0].data_identifier = "";
            this.attributes.answer_choices[this.counter].choice_elements[0].previous_df_id = "";
            this.attributes.answer_choices[this.counter].score = 0;
            this.attributes.answer_choices[this.counter].answer_choice_insight = "";
            this.attributes.answer_choices[this.counter].data_insight = "";
            
            if(this.attributes.answer_choices[this.counter].answer_choice_insight === ""){
              this.attributes.answer_choices[this.counter].answer_choice_insight = null;
            }
            
            if(this.attributes.answer_choices[this.counter].data_insight === ""){
              this.attributes.answer_choices[this.counter].data_insight = null;
            }

          }
        }

      }
      else if (item == "True or False") {
        var alertflag = false;
        if (this.item_type == 1) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              for (var j = 0; j < this.attributes.answer_choices[i].choice_elements.length; j++) {
                if (this.attributes.answer_choices[i].correct_answer == true || this.attributes.answer_choices[i].choice_elements[j].data_format_value != '' || (this.attributes.answer_choices[i].score != 0)) {
                  alertflag = true;
                }
              }
            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }

        }
        else if (this.item_type == 3) {
          for (var i = 0; i < this.attributes.item.length; i++) {

            if (this.attributes.item[i].item_df_id != 9) {
              if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
                alertflag = true;
                break;
              }
            } else {
              for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
                if (this.attributes.item[i].data_format_value[j].match_data[0].matchValueArray[0].match_value != '' || (this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0].match_value != '')) {
                  alertflag = true;
                  break;
                }
                if (j != 0) {
                  if (this.attributes.item[i].data_format_value[j].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
              if (this.attributes.item[i].score != 1) {
                alertflag = true;
                break;
              }
            }

            if (this.attributes.item[i].matchlist_type == 4) {
              for (var k = 0; k < this.matrixAnsBlock.length; k++) {
                for (var l = 0; l < this.matrixAnsBlock[k].answer_choices.length; l++) {
                  if (this.matrixAnsBlock[k].answer_choices[l].data_format_value != '' || this.matrixAnsBlock[k].answer_choices[l].correct_answer == true || this.matrixAnsBlock[k].answer_choices[l].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
            }
            if (alertflag == false) {
              if (this.attributes.item[i].matchlist_type == 4 || this.attributes.item[i].matchlist_type == 5)
                if (this.score != 1) {
                  alertflag = true;
                }
            }
          }


          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config))
          }


        }
        if (this.item_type == 5) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].answer_data != ''){
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        if (this.item_type == 6) {
          for (var i = 0; i < this.attributes.directive.length; i++) {
            if (this.attributes.directive[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        if (this.item_type == 7) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].description != ''){
                alertflag = true;
              }
              if (this.attributes.answer_choices[i].fileFormatLits.length !=0) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }


        if (alertflag == false) {
          this.activeIndex = index;
          this.selectedItemTypes = "True or False";
          this.trueorfalseBlk = true;
          this.mcqBlk = false;
          this.matchBlk = false;
          this.freeTextBlk = false;
          this.isDisable = true;
          this.fileUploadBlk = false;
          this.directiveBlk = false;
          this.disableMatchSelect = false;
          this.showGradedScore = true;
          this.enableToggle = false;
          this.topErr = false;
          this.subErr = false;
          this.diffErr = false;
          this.taxErr = false;
          this.taxErr = false;
          this.expErr = false;
          this.keyErr = false;
          this.graded = 0;
          this.matchGradedScore = -1;
          this.scoreIndex = 0;
          this.checkarray = [];
          this.arrayItem = [];
          this.itemLevelMultipleCrtAns = 0;
          this.gradedLevelSingleCrtAns = 0;
          this.totalGraderScoreErr = 0;
          this.totalGradedScoreCount = 0;
          this.errIndex = -1;
          this.ansIndex = -1;
          this.directiveErr = -1;
          this.activeMatchState = 0;
          this.item_type = 2;
          this.matchIndex = -1;
          this.attributes.answer_choices = [];
          this.attributes.directive = [];
          this.attributes.item = [];
          this.score = 1;
          this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });
          for (this.counter = 0; this.counter < 2; this.counter++) {
            this.attributes.answer_choices.push(new answerList());
            this.attributes.answer_choices[this.counter].option_df_sequence = this.counter + 1;
            this.attributes.answer_choices[this.counter].answer_df_id = 1;
          }

          this.attributes.answer_choices[0].data_format_value = "True";
          this.attributes.answer_choices[1].data_format_value = "False";
          this.attributes.answer_type = "Single Answer";
          this.attributes.score_type = "Item Lvl Score";
        }

      }

      else if (item == "Match") {
        var alertflag = false;
        if (this.item_type == 1) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              for (var j = 0; j < this.attributes.answer_choices[i].choice_elements.length; j++) {
                if (this.attributes.answer_choices[i].correct_answer == true || this.attributes.answer_choices[i].choice_elements[j].data_format_value != '' || (this.attributes.answer_choices[i].score != 0)) {
                  alertflag = true;
                }
              }
            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }

        }

        else if (this.item_type == 2) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {

              if (this.attributes.answer_choices[i].correct_answer == true) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }

        }
        if (this.item_type == 5) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].answer_data != ''){
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        else if (this.item_type == 6) {
          for (var i = 0; i < this.attributes.directive.length; i++) {
            if (this.attributes.directive[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        if (this.item_type == 7) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].description != ''){
                alertflag = true;
              }
              if (this.attributes.answer_choices[i].fileFormatLits.length !=0) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }

        if (alertflag == false) {
          // this.item_type = 3;
          this.matchIndex = -1;
          // this.attributes.item_type = 3;
          // this.visible=true;
          this.modalRef = this.modalService.show(template1, this.config);
          this.toggleMatchType = false;
          this.closable = true;
        }

      }

      else if (item == "Directives") {

        var alertflag = false;
        if (this.item_type == 1) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              for (var j = 0; j < this.attributes.answer_choices[i].choice_elements.length; j++) {
                if (this.attributes.answer_choices[i].correct_answer == true || this.attributes.answer_choices[i].choice_elements[j].data_format_value != '' || (this.attributes.answer_choices[i].score != 0)) {
                  alertflag = true;
                }
              }
            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }

        }

        else if (this.item_type == 2) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {

              if (this.attributes.answer_choices[i].correct_answer == true) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }

        }

        else if (this.item_type == 3) {
          for (var i = 0; i < this.attributes.item.length; i++) {

            if (this.attributes.item[i].item_df_id != 9) {
              if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
                alertflag = true;
                break;
              }
            } else {
              for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
                if (this.attributes.item[i].data_format_value[j].match_data[0].matchValueArray[0].match_value != '' || (this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0].match_value != '')) {
                  alertflag = true;
                  break;
                }
                if (j != 0) {
                  if (this.attributes.item[i].data_format_value[j].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
              if (this.attributes.item[i].score != 1) {
                alertflag = true;
                break;
              }
            }

            if (this.attributes.item[i].matchlist_type == 4) {
              for (var k = 0; k < this.matrixAnsBlock.length; k++) {
                for (var l = 0; l < this.matrixAnsBlock[k].answer_choices.length; l++) {
                  if (this.matrixAnsBlock[k].answer_choices[l].data_format_value != '' || this.matrixAnsBlock[k].answer_choices[l].correct_answer == true || this.matrixAnsBlock[k].answer_choices[l].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
            }
            if (alertflag == false) {
              if (this.attributes.item[i].matchlist_type == 4 || this.attributes.item[i].matchlist_type == 5)
                if (this.score != 1) {
                  alertflag = true;
                }
            }
          }


          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config))
          }


        }
        if (this.item_type == 5) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].answer_data != ''){
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }

        if (this.item_type == 7) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].description != ''){
                alertflag = true;
              }
              if (this.attributes.answer_choices[i].fileFormatLits.length !=0) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }




        if (alertflag == false) {
          this.activeIndex = index;
          this.item_type = 6;
          this.selectedItemTypes = "Directives";
          this.trueorfalseBlk = false;
          this.mcqBlk = false;
          this.matchBlk = false;
          this.freeTextBlk = false;
          this.directiveBlk = true;
          this.viewItemBlk = false;
          this.fileUploadBlk = false;
          this.disableMatchSelect = false;
          this.showGradedScore = true;
          this.enableToggle = false;
          this.topErr = false;
          this.subErr = false;
          this.diffErr = false;
          this.taxErr = false;
          this.expErr = false;
          this.keyErr = false;
          this.graded = 0;
          this.matchGradedScore = -1;
          this.matchIndex = -1;
          this.scoreIndex = 0;
          this.checkarray = [];
          this.arrayItem = [];
          this.itemLevelMultipleCrtAns = 0;
          this.gradedLevelSingleCrtAns = 0;
          this.totalGraderScoreErr = 0;
          this.totalGradedScoreCount = 0;
          this.errIndex = -1;
          this.ansIndex = -1;
          this.directiveErr = -1;
          this.activeMatchState = 0;
          this.score = 0;
          this.attributes.item = [];
          this.attributes.directive = [];
          this.attributes.directive.push(new itemList);
          this.attributes.directive[0].item_df_id = 1;
          this.attributes.directive[0].item_df_sequence = 1;
          this.attributes.directive[0].data_format_value = "";
          this.attributes.directive[0].data_identifier = "";
          this.attributes.directive[0].previous_df_id = "";


        }
      }

      else if(item == 'Free Text'){
        var alertflag = false;
        if (this.item_type == 2) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {

              if (this.attributes.answer_choices[i].correct_answer == true) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        if (this.item_type == 1) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              for (var j = 0; j < this.attributes.answer_choices[i].choice_elements.length; j++) {
                if (this.attributes.answer_choices[i].correct_answer == true || this.attributes.answer_choices[i].choice_elements[j].data_format_value != '' || (this.attributes.answer_choices[i].score != 0)) {
                  alertflag = true;
                }
              }
            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }

        }

        if (this.item_type == 3) {
          for (var i = 0; i < this.attributes.item.length; i++) {

            if (this.attributes.item[i].item_df_id != 9) {
              if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
                alertflag = true;
                break;
              }
            } else {
              for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
                if (this.attributes.item[i].data_format_value[j].match_data[0].matchValueArray[0].match_value != '' || (this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0].match_value != '')) {
                  alertflag = true;
                  break;
                }
                if (j != 0) {
                  if (this.attributes.item[i].data_format_value[j].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
              if (this.attributes.item[i].score != 1) {
                alertflag = true;
                break;
              }
            }

            if (this.attributes.item[i].matchlist_type == 4) {
              for (var k = 0; k < this.matrixAnsBlock.length; k++) {
                for (var l = 0; l < this.matrixAnsBlock[k].answer_choices.length; l++) {
                  if (this.matrixAnsBlock[k].answer_choices[l].data_format_value != '' || this.matrixAnsBlock[k].answer_choices[l].correct_answer == true || this.matrixAnsBlock[k].answer_choices[l].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
            }
            if (alertflag == false) {
              if (this.attributes.item[i].matchlist_type == 4 || this.attributes.item[i].matchlist_type == 5)
                if (this.score != 1) {
                  alertflag = true;
                }
            }
          }


          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' ' }, this.config))
          }

        }
        else if (this.item_type == 6) {
          for (var i = 0; i < this.attributes.directive.length; i++) {
            if (this.attributes.directive[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        if (this.item_type == 7) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].description != ''){
                alertflag = true;
              }
              if (this.attributes.answer_choices[i].fileFormatLits.length !=0) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }

        if (alertflag == false) {
          this.activeIndex = index;
          this.selectedItemTypes = "Free Text";
          this.trueorfalseBlk = false;
          this.mcqBlk = false;
          this.matchBlk = false;
          this.isDisable = true;
          this.directiveBlk = false;
          this.freeTextBlk = true;
          this.fileUploadBlk = false;
          this.disableMatchSelect = false;
          this.showGradedScore = true;
          this.enableToggle = false;
          this.topErr = false;
          this.subErr = false;
          this.diffErr = false;
          this.taxErr = false;
          this.expErr = false;
          this.keyErr = false;
          this.graded = 0;
          this.matchGradedScore = -1;
          this.scoreIndex = 0;
          this.checkarray = [];
          this.arrayItem = [];
          this.itemLevelMultipleCrtAns = 0;
          this.gradedLevelSingleCrtAns = 0;
          this.totalGraderScoreErr = 0;
          this.totalGradedScoreCount = 0;
          this.errIndex = -1;
          this.ansIndex = -1;
          this.directiveErr = -1;
          this.activeMatchState = 0;
          this.item_type = 5;
          this.matchIndex = -1;
          this.attributes.answer_choices = [];
          this.attributes.directive = [];
          this.attributes.item = [];
          this.score = 1;
          this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });
          for (this.counter = 0; this.counter <= 2; this.counter++) {
            this.attributes.answer_choices.push(new freeText_answerType());

          }


          this.attributes.answer_type = "Single Answer";
          this.attributes.score_type = "Item Lvl Score";
        }
      }

      else if(item == 'File Upload'){
        var alertflag = false;
        if (this.item_type == 2) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {

              if (this.attributes.answer_choices[i].correct_answer == true) {
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        if (this.item_type == 1) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              for (var j = 0; j < this.attributes.answer_choices[i].choice_elements.length; j++) {
                if (this.attributes.answer_choices[i].correct_answer == true || this.attributes.answer_choices[i].choice_elements[j].data_format_value != '' || (this.attributes.answer_choices[i].score != 0)) {
                  alertflag = true;
                }
              }
            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }

        }

        if (this.item_type == 3) {
          for (var i = 0; i < this.attributes.item.length; i++) {

            if (this.attributes.item[i].item_df_id != 9) {
              if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
                alertflag = true;
                break;
              }
            } else {
              for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
                if (this.attributes.item[i].data_format_value[j].match_data[0].matchValueArray[0].match_value != '' || (this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0].match_value != '')) {
                  alertflag = true;
                  break;
                }
                if (j != 0) {
                  if (this.attributes.item[i].data_format_value[j].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
              if (this.attributes.item[i].score != 1) {
                alertflag = true;
                break;
              }
            }

            if (this.attributes.item[i].matchlist_type == 4) {
              for (var k = 0; k < this.matrixAnsBlock.length; k++) {
                for (var l = 0; l < this.matrixAnsBlock[k].answer_choices.length; l++) {
                  if (this.matrixAnsBlock[k].answer_choices[l].data_format_value != '' || this.matrixAnsBlock[k].answer_choices[l].correct_answer == true || this.matrixAnsBlock[k].answer_choices[l].score != 0) {
                    alertflag = true;
                    break;
                  }
                }
              }
            }
            if (alertflag == false) {
              if (this.attributes.item[i].matchlist_type == 4 || this.attributes.item[i].matchlist_type == 5)
                if (this.score != 1) {
                  alertflag = true;
                }
            }
          }


          if (alertflag == true) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config))
          }

        }
        else if (this.item_type == 5) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }
          if (alertflag == false) {
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              if(this.attributes.answer_choices[i].answer_data != ''){
                alertflag = true;
              }

            }
          }

          if (alertflag == false) {
            if (this.score != 1) {
              alertflag = true;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }
        else if (this.item_type == 6) {
          for (var i = 0; i < this.attributes.directive.length; i++) {
            if (this.attributes.directive[i].data_format_value != '' && this.attributes.item[i].data_format_value != null) {
              alertflag = true;
              break;
            }
          }

          if (alertflag) {
            this.modalRef = this.modalService.show(template2, Object.assign({}, { class: ' modal-sm' }, this.config));
          }
        }


        if(alertflag == false){
          this.activeIndex = index;
          this.selectedItemTypes = "File Upload";
          this.trueorfalseBlk = false;
          this.mcqBlk = false;
          this.matchBlk = false;
          this.isDisable = true;
          this.directiveBlk = false;
          this.freeTextBlk = false;
          this.fileUploadBlk = true;
          this.disableMatchSelect = false;
          this.showGradedScore = true;
          this.enableToggle = false;
          this.topErr = false;
          this.subErr = false;
          this.diffErr = false;
          this.taxErr = false;
          this.expErr = false;
          this.keyErr = false;
          this.graded = 0;
          this.matchGradedScore = -1;
          this.scoreIndex = 0;
          this.checkarray = [];
          this.arrayItem = [];
          this.itemLevelMultipleCrtAns = 0;
          this.gradedLevelSingleCrtAns = 0;
          this.totalGraderScoreErr = 0;
          this.totalGradedScoreCount = 0;
          this.errIndex = -1;
          this.ansIndex = -1;
          this.directiveErr = -1;
          this.activeMatchState = 0;
          this.item_type = 7;
          this.matchIndex = -1;
          this.attributes.answer_choices = [];
          this.attributes.directive = [];
          this.attributes.item = [];
          this.score = 1;
          this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });

            for(var ac=0;ac<2;ac++){
              this.attributes.answer_choices.push(new fileUploadAnsBlock());
              this.FileFormatList = this.fileMetaDataTypeList;

            }


        }
      }
    }
    alertflag = false;
  }
  showDescription(data,template: TemplateRef<any>){

   if(data === "Multiple Choice"){
    this.showItemDescription = "Multiple Choice"
    }
    if(data === "True or False"){
      this.showItemDescription = "True or False"
    }
    if(data === "Match"){
      this.showItemDescription = ""
    }
    if(data === "Fill in"){
      this.showItemDescription = "Fill in"
    }
    if(data === "Free Text"){
      this.showItemDescription = "Free Text"
    }
    if(data === "Directives"){
      this.showItemDescription = "Directives"
    }
    if(data === "File Upload"){
      this.showItemDescription = "File Upload"
    }
    if(this.showItemDescription !== '' ){
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-sm' }, this.config),

    );
    }
  }


  // change item type and clear all values if value is entered in any item type  ---- when cancel button is clicked
  changeItemType(retainAttr, template1: TemplateRef<any>) {


    if (retainAttr == undefined) {
      this.clearAttributes();

    }
    this.retainAttr = undefined;
    this.modalRef.hide();
    if (this.clickedItemType == "True or False") {
      this.activeIndex = this.itemTypeIndex;
      this.selectedItemTypes = "True or False";
      this.trueorfalseBlk = true;
      this.mcqBlk = false;
      this.freeTextBlk = false;
      this.matchBlk = false;
      this.isDisable = true;
      this.directiveBlk = false;
      this.disableMatchSelect = false;
      this.fileUploadBlk = false;
      this.topErr = false;
      this.subErr = false;
      this.diffErr = false;
      this.taxErr = false;
      this.expErr = false;
      this.keyErr = false;
      this.graded = 0;
      this.matchGradedScore = -1;
      this.scoreIndex = 0;
      this.checkarray = [];
      this.arrayItem = [];
      this.itemLevelMultipleCrtAns = 0;
      this.gradedLevelSingleCrtAns = 0;
      this.totalGraderScoreErr = 0;
      this.totalGradedScoreCount = 0;
      this.errIndex = -1;
      this.ansIndex = -1;
      this.directiveErr = -1;
      this.matchIndex = -1;
      this.activeMatchState = 0;
      this.item_type = 2;
      this.attributes.answer_choices = [];
      this.attributes.directive = [];
      this.attributes.item = [];
      this.score = 1;
      this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });
      for (this.counter = 0; this.counter < 2; this.counter++) {
        this.attributes.answer_choices.push(new answerList());
        this.attributes.answer_choices[this.counter].option_df_sequence = this.counter + 1;
        this.attributes.answer_choices[this.counter].answer_df_id = 1;
      }

      this.attributes.answer_choices[0].data_format_value = "True";
      this.attributes.answer_choices[1].data_format_value = "False";
      this.attributes.answer_type = "Single Answer";
      this.attributes.score_type = "Item Lvl Score";
    }

    else if (this.clickedItemType == 'Multiple Choice') {
      this.activeIndex = this.itemTypeIndex;
      this.selectedItemTypes = "Multiple Choice";
      this.trueorfalseBlk = false;
      this.mcqBlk = true;
      this.matchBlk = false;
      this.freeTextBlk = false;
      this.directiveBlk = false;
      this.fileUploadBlk = false;
      this.disableMatchSelect = false;
      this.topErr = false;
      this.subErr = false;
      this.diffErr = false;
      this.taxErr = false;
      this.expErr = false;
      this.keyErr = false;
      this.showGradedScore = true;
      this.enableToggle = false;
      this.graded = 0;
      this.matchGradedScore = -1;
      this.matchIndex = -1;
      this.scoreIndex = 0;
      this.checkarray = [];
      this.arrayItem = [];
      this.itemLevelMultipleCrtAns = 0;
      this.gradedLevelSingleCrtAns = 0;
      this.totalGraderScoreErr = 0;
      this.totalGradedScoreCount = 0;
      this.errIndex = -1;
      this.ansIndex = -1;
      this.directiveErr = -1;
      this.activeMatchState = 0;
      this.item_type = 1;
      this.attributes.answer_choices = [];
      this.attributes.directive = [];
      this.attributes.item = [];
      this.score = 1;
      this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });

      for (this.counter = 0; this.counter < 4; this.counter++) {
        this.attributes.answer_choices.push(new answerChoice());
        this.attributes.answer_choices[this.counter].choice_elements.push(new answerChoiceType());
        this.attributes.answer_choices[this.counter].choice_elements[0].option_df_sequence = 1;
        this.attributes.answer_choices[this.counter].choice_elements[0].data_format_value = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].data_identifier = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].previous_df_id = "";
        this.attributes.answer_choices[this.counter].score = 0;
        this.attributes.answer_choices[this.counter].answer_choice_insight = "";
        this.attributes.answer_choices[this.counter].data_insight = "";

        if(this.attributes.answer_choices[this.counter].answer_choice_insight === ""){
          this.attributes.answer_choices[this.counter].answer_choice_insight = null;
        }
        if(this.attributes.answer_choices[this.counter].data_insight === ""){
          this.attributes.answer_choices[this.counter].data_insight = null;
        }
      }
    }

    else if (this.clickedItemType == 'Match') {
      this.item_type = 3;
      this.matchIndex = -1;
      // this.attributes.item_type = 3;
      // this.visible=true;
      this.modalRef = this.modalService.show(template1, this.config);
      this.toggleMatchType = false;
      this.closable = true;
    }

    else if (this.clickedItemType == 'Directives') {
      this.activeIndex = this.itemTypeIndex;
      this.item_type = 6;
      this.selectedItemTypes = "Directives";
      this.trueorfalseBlk = false;
      this.mcqBlk = false;
      this.matchBlk = false;
      this.freeTextBlk = false;
      this.directiveBlk = true;
      this.viewItemBlk = false;
      this.fileUploadBlk = false;
      this.disableMatchSelect = false;
      this.topErr = false;
      this.subErr = false;
      this.diffErr = false;
      this.taxErr = false;
      this.expErr = false;
      this.keyErr = false;
      this.graded = 0;
      this.matchIndex = -1;
      this.matchGradedScore = -1;
      this.scoreIndex = 0;
      this.checkarray = [];
      this.arrayItem = [];
      this.itemLevelMultipleCrtAns = 0;
      this.gradedLevelSingleCrtAns = 0;
      this.totalGraderScoreErr = 0;
      this.totalGradedScoreCount = 0;
      this.errIndex = -1;
      this.ansIndex = -1;
      this.directiveErr = -1;
      this.activeMatchState = 0;
      this.score = 0;
      this.attributes.item = [];
      this.attributes.directive = [];
      this.attributes.directive.push(new itemList);
      this.attributes.directive[0].item_df_id = 1;
      this.attributes.directive[0].item_df_sequence = 1;
      this.attributes.directive[0].data_format_value = "";
      this.attributes.directive[0].data_identifier = "";
      this.attributes.directive[0].previous_df_id = "";
    }

    else if(this.clickedItemType == 'Free Text'){
      this.activeIndex = this.itemTypeIndex;
      this.selectedItemTypes = "Free Text";
      this.trueorfalseBlk = false;
      this.mcqBlk = false;
      this.matchBlk = false;
      this.isDisable = true;
      this.directiveBlk = false;
      this.freeTextBlk = true;
      this.fileUploadBlk = false;
      this.disableMatchSelect = false;
      this.topErr = false;
      this.subErr = false;
      this.diffErr = false;
      this.taxErr = false;
      this.expErr = false;
      this.keyErr = false;
      this.graded = 0;
      this.matchGradedScore = -1;
      this.scoreIndex = 0;
      this.checkarray = [];
      this.arrayItem = [];
      this.itemLevelMultipleCrtAns = 0;
      this.gradedLevelSingleCrtAns = 0;
      this.totalGraderScoreErr = 0;
      this.totalGradedScoreCount = 0;
      this.errIndex = -1;
      this.ansIndex = -1;
      this.directiveErr = -1;
      this.matchIndex = -1;
      this.activeMatchState = 0;
      this.item_type = 5;
      this.attributes.answer_choices = [];
      this.attributes.directive = [];
      this.attributes.item = [];
      this.score = 1;
      this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });
      for (this.counter = 0; this.counter <= 2; this.counter++) {
        this.attributes.answer_choices.push(new freeText_answerType());
      }


      this.attributes.answer_type = "Single Answer";
      this.attributes.score_type = "Item Lvl Score";
    }

    else if(this.clickedItemType == 'File Upload'){
      this.activeIndex = this.itemTypeIndex;
      this.selectedItemTypes = "File Upload";
      this.trueorfalseBlk = false;
      this.mcqBlk = false;
      this.matchBlk = false;
      this.isDisable = true;
      this.directiveBlk = false;
      this.freeTextBlk = false;
      this.fileUploadBlk = true;
      this.disableMatchSelect = false;
      this.topErr = false;
      this.subErr = false;
      this.diffErr = false;
      this.taxErr = false;
      this.expErr = false;
      this.keyErr = false;
      this.graded = 0;
      this.matchGradedScore = -1;
      this.scoreIndex = 0;
      this.checkarray = [];
      this.arrayItem = [];
      this.itemLevelMultipleCrtAns = 0;
      this.gradedLevelSingleCrtAns = 0;
      this.totalGraderScoreErr = 0;
      this.totalGradedScoreCount = 0;
      this.errIndex = -1;
      this.ansIndex = -1;
      this.directiveErr = -1;
      this.matchIndex = -1;
      this.activeMatchState = 0;
      this.item_type = 7;
      this.attributes.answer_choices = [];
      this.attributes.directive = [];
      this.attributes.item = [];
      this.score = 1;
      this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });

        for(var ac=0;ac<2;ac++){
          this.attributes.answer_choices.push(new fileUploadAnsBlock());
          this.FileFormatList = this.fileMetaDataTypeList;

        }
      this.attributes.answer_type = "Single Answer";
      this.attributes.score_type = "Item Lvl Score";
    }
  }




  displayItemTypeLabel(key) {
    this.showItemType = key;

  }


  // close match popup and set item type to 1
  closeMatchPopup(){
    // this.item_type = 1;
    this.modalRef.hide();
  }

  saveInsightsValues(Insight_Value,template: TemplateRef<any>, value){
    // console.log(value);
    this.modalRef.hide();
  }

  //cancel item alert

  cancelUnsavedItem() {
    this.attributes.item_id="";
    this.attributes.item = [];
    this.attributes.answer_choices = [];
    this.attributes.score = 0;
    this.attributes.answer_choice_insight = "";
    this.attributes.data_insight = "";
    this.activeMatchState = 0;
    this.trueorfalseBlk = false;
    this.disableMatchSelect = false;
    this.mcqBlk = true;
    this.matchtypeSelected = -1;
    this.matchBlk = false;
    this.freeTextBlk = false;
    this.fileUploadBlk = false;
    this.activeIndex = 3;
    this.isDirective = undefined;
    if (this.directiveBlk == true) {
      this.exitDirective();
      this.modalRef.hide();

      if(this.cameFrom == true) {
        localStorage.removeItem("_tmpURL");
        if(this.goToHere == '/ItemSets/viewitemsets'){
          // this.router.navigateByUrl(this.goToHere + '/0/0/0');
          this.router.navigate([this.goToHere,0,0,0]);

        }else if(this.goToHere == '/as-an-author/to-create') {
          // this.router.navigateByUrl(this.goToHere);
          this.router.navigate([this.goToHere]);
        }else if (this.goToHere == '/as-an-author/to-modify') {
          this.router.navigate([this.goToHere]);
        }else if (this.goToHere == '/as-a-reviewer/to-review') {
          this.router.navigate([this.goToHere]);
        }
      }else {
        if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 1 || this.pathDirect == 2) {
          this.router.navigate(['ItemSets/viewitemsets', this.itemset_id, this.section_id, this.pathDirect]);
        }
        else if (this.pathDirect == 7) {
          this.router.navigate(['Items/viewitems', this.bulkUploadId]);
        }
        else if (this.pathDirect == 8) {
          this.router.navigate(['Items/bulkuploadItems']);
        }else if(this.pathDirect == 14 || this.pathDirect == 13){
          this.router.navigate(['as-an-author/under-review', this.itemset_id, this.section_id, this.pathDirect])
        }else if(this.pathDirect == 11 || this.pathDirect == 12 || this.pathDirect == 20 || this.pathDirect == 19){
          this.router.navigate(['as-an-author/to-create', this.itemset_id, this.section_id, this.pathDirect])
        }
      }
    }else if(this.itemCount != 0 && this.itemCount != undefined){
      this.viewItemDirective(this.directive_id);
      this.modalRef.hide();
    }
     else {
      this.directiveBlk = false;
      this.item_type = 1;
      this.selectedItemTypes = "Multiple Choice";
      this.activeIndex = 0;
      this.attributes.answer_choices = [];
      this.attributes.directive = [];
      this.attributes.item = [];
      this.score = 1;
      this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });

      for (this.counter = 0; this.counter < 4; this.counter++) {
        this.attributes.answer_choices.push(new answerChoice());
        this.attributes.answer_choices[this.counter].choice_elements.push(new answerChoiceType());
        this.attributes.answer_choices[this.counter].choice_elements[0].option_df_sequence = 1;
        this.attributes.answer_choices[this.counter].choice_elements[0].data_format_value = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].data_identifier = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].previous_df_id = "";
        this.attributes.answer_choices[this.counter].score = 0;
        this.attributes.answer_choices[this.counter].answer_choice_insight = "";
        this.attributes.answer_choices[this.counter].data_insight = "";
        if(this.attributes.answer_choices[this.counter].answer_choice_insight === ""){
          this.attributes.answer_choices[this.counter].answer_choice_insight = null;
        }
        if(this.attributes.answer_choices[this.counter].data_insight === ""){
          this.attributes.answer_choices[this.counter].data_insight = null;
        }
      }

      //clear attributes
      this.selectedSub = [];
      this.selectedTopic = [];
      this.selectedSubtopic = [];
      this.topicsList = [];
      this.subtopicList = [];
      this.content1 = [];
      this.content_type = [];
      // for(var i=0;i<this.contentType.length;i++){
      //   this.contentType[i].checked = false;
      // }
      this.topErr = false;
      this.subErr = false;
      this.diffErr = false;
      this.langErr = false;
      this.taxErr = false;
      this.expErr = false;
      this.keyErr = false;
      this.ansIndex =-1;
      this.errIndex = -1;
      this.listRowErr = -1;
      this.fileFormatErr = false;

      this.difficulty_level = undefined;
      this.taxonomy = undefined;
      this.item_valid_till = null;
      this.explanation = "";
      this.hint = "";
      this.search_keywords = "";
      this.ref_link = "";
      this.modalRef.hide();

      if(this.cameFrom == true) {
        localStorage.removeItem("_tmpURL");
        if(this.goToHere == '/ItemSets/viewitemsets'){
          // this.router.navigateByUrl(this.goToHere + '/0/0/0');
          this.router.navigate([this.goToHere,0,0,0]);

        }else if(this.goToHere == '/as-an-author/to-create') {
          // this.router.navigateByUrl(this.goToHere);
          this.router.navigate([this.goToHere]);
        }else if (this.goToHere == '/as-an-author/to-modify') {
          this.router.navigate([this.goToHere]);
        }else if (this.goToHere == '/as-a-reviewer/to-review') {
          this.router.navigate([this.goToHere]);
        }
      }else {
        if (this.pathDirect == 3 || this.pathDirect==4 || this.pathDirect == 1 || this.pathDirect == 2) {
          this.router.navigate(['ItemSets/viewitemsets', this.itemset_id, this.section_id, this.pathDirect]);
        }
        else if(this.pathDirect == 20 || this.pathDirect == 19){
          this.router.navigate(['as-an-author/to-create', this.itemset_id, this.section_id, this.pathDirect])
        }
        else if (this.pathDirect == 7) {
          this.router.navigate(['Items/viewitems', this.bulkUploadId]);
        } else if (this.pathDirect == 8) {
          this.router.navigate(['Items/bulkuploadItems']);
        }else if(this.pathDirect == 14 || this.pathDirect == 13){
          this.router.navigate(['as-an-author/under-review', this.itemset_id, this.section_id, this.pathDirect])
        }else if(this.pathDirect == 11 || this.pathDirect == 12){
          this.router.navigate(['as-an-author/to-create', this.itemset_id, this.section_id, this.pathDirect])
        }
      }


    }
  }


  // clear attributes

  clearAttributes() {
    this.selectedSub = [];
    this.selectedTopic = [];
    this.selectedSubtopic = [];
    this.topicsList = [];
    this.subtopicList = [];
    this.content_type = []
    this.content1 = [];
    // for(var i=0;i<this.contentType.length;i++){
    //   this.contentType[i].checked = false;
    // }
    this.topErr = false;
    this.subErr = false;
    this.diffErr = false;
    this.taxErr = false;
    this.expErr = false;
    this.keyErr = false;

    this.difficulty_level = undefined;
    this.taxonomy = undefined;
    this.item_valid_till = null;
    this.explanation = "";
    this.hint = "";
    this.search_keywords = "";
    this.ref_link = "";
  }

  //redirect to itemset
  goToItemset() {
    this.router.navigate(['ItemSets/viewitemsets', this.itemset_id, this.section_id, this.pathDirect]);
  }

  // to show popup when setting icon from match block is clicked
  changeMatchType(template: TemplateRef<any>) {
    this.visible = true;
    this.closable = true;
    // this.toggleMatchType =true;
    this.modalRef = this.modalService.show(template, this.config);
    for (var i = 0; i < this.attributes.item.length; i++) {
      if (this.attributes.item[i].item_df_id == 9) {
        this.activeMatchState = this.attributes.item[i].matchlist_type - 1;

      }
    }

  }


  // match type change alert and function

  yes(matchtypeSelected) {
    if (this.authService.canActivate()) {

      for (var i = 0; i < this.attributes.item.length; i++) {
        if (this.attributes.item[i].item_df_id == 9) {
          var prevMatchId = this.attributes.item[i].matchlist_type;
          this.attributes.item[i].matchlist_type = matchtypeSelected + 1;
          this.matchtypeSelected = matchtypeSelected + 1;

          if (prevMatchId == 1) {
            var prevMatchType = "Dropdown";
          } else if (prevMatchId == 2) {
            var prevMatchType = "Pool of Answers";
          } else if (prevMatchId == 3) {
            var prevMatchType = "Interchange";
          }

          if (this.matchtypeSelected == 1) {
            var changedMatchType = "Dropdown";
          } else if (this.matchtypeSelected == 2) {
            var changedMatchType = "Pool of Answers";
          } else if (this.matchtypeSelected == 3) {
            var changedMatchType = "Interchange";
          }
          this.matchAlert = false;
          this.alerts.push({
            type: 'info',
            msg: `Match Type Changed from ` + prevMatchType + ` to ` + changedMatchType,
            timeout: 4000
          });

        }
      }


    }
  }

  select() {
    this.modalRef.hide();
    this.visible = false;
    this.matchAlert = true;
  }
  exit(activeMatchState, template: TemplateRef<any>) {

    this.matchTypeImage(this.matchtypeSelected - 1);
    // this.visible=false;
    this.matchAlert = false;
    this.modalRef.hide();
  }


  public visible = false;
  public closable = false;

  close(matchtypeSelected, index) {
    this.activeIndex = index;
    this.trueorfalseBlk = false;
    this.mcqBlk = false;
    this.matchBlk = true;
    this.item_type = 3;
    this.freeTextBlk = false;
    this.directiveBlk = false;
    this.fileUploadBlk = false;
    this.topErr = false;
    this.subErr = false;
    this.diffErr = false;
    this.taxErr = false;
    this.expErr = false;
    this.keyErr = false;
    this.score = 1;
    this.showGradedScore = true;
    this.enableToggle = false;
    this.selectedItemTypes = "Match";
    if (this.authService.canActivate()) {
      this.attributes.answer_choices = [];
      // this.disableMatchSelect = true;
      this.matchtypeSelected = matchtypeSelected + 1;
      // this.visible = false;
      this.modalRef.hide();
      this.attributes.answer_choices = [];
      this.attributes.item = [];
      this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });
      this.attributes.item.push(new matchItemType());
      this.attributes.item[1].matchlist_type = this.matchtypeSelected;
      this.attributes.item[1].data_identifier = "";
      this.attributes.item[1].previous_df_id = "";

      for (this.counter = 0; this.counter <= 4; this.counter++) {

        this.attributes.item[1].data_format_value.push(new matchData());

        // for (var count=0;count < 2;count++){

        //   this.attributes.item[1].data_format_value[this.counter].match_data.push(new matchDataType());
        //   this.attributes.item[1].data_format_value[this.counter].match_data[count].previous_df_id="";
        //   this.attributes.item[1].data_format_value[this.counter].match_data[count].match_value="";
        //   this.attributes.item[1].data_format_value[this.counter].match_data[count].match_data_format_id=1;
        //   this.attributes.item[1].data_format_value[this.counter].match_data[count].data_identifier="";
        //   this.attributes.item[1].data_format_value[this.counter].match_data[count].hiddenObj=false;

        //   if(this.counter == 0){
        //     this.attributes.item[1].data_format_value[this.counter].match_data[count].header=1;
        //     this.attributes.item[1].data_format_value[this.counter].score = null;
        //   }
        // }

        // match data as array
        for (var count = 0; count < 2; count++) {

          this.attributes.item[1].data_format_value[this.counter].match_data.push(new matchArray());
          this.attributes.item[1].data_format_value[this.counter].match_data[count].matchValueArray.push(new matchDataType())
          this.attributes.item[1].data_format_value[this.counter].match_data[count].matchValueArray[0].previous_df_id = "";
          this.attributes.item[1].data_format_value[this.counter].match_data[count].matchValueArray[0].match_value = "";
          this.attributes.item[1].data_format_value[this.counter].match_data[count].matchValueArray[0].match_data_format_id = 1;
          this.attributes.item[1].data_format_value[this.counter].match_data[count].matchValueArray[0].data_identifier = "";
          this.attributes.item[1].data_format_value[this.counter].match_data[count].matchValueArray[0].hiddenObj = false;


        }

        if (this.counter == 0) {
          this.attributes.item[1].data_format_value[this.counter].match_data[0].matchValueArray[0].header = 1;
          this.attributes.item[1].data_format_value[this.counter].match_data[1].matchValueArray[0].header = 1;
          this.attributes.item[1].data_format_value[this.counter].score = null;
          
        }

        // this.attributes.item[1].data_format_value[this.counter].score = 0;
        if (this.counter > 0) {
          this.attributes.item[1].data_format_value[this.counter].match_data[0].matchValueArray[0].label = String.fromCharCode(65 + this.counter - 1);
          this.attributes.item[1].data_format_value[this.counter].match_data[1].matchValueArray[0].label = this.counter;
        }
        this.attributes.item[1].data_format_value[0].match_data[0].matchValueArray[0].label = "";
        this.attributes.item[1].data_format_value[0].match_data[1].matchValueArray[0].label = "";

      }

      // exact match
      if (this.matchtypeSelected == 5) {
        for (this.counter = 0; this.counter <= 3; this.counter++) {
          this.attributes.answer_choices.push(new exactMatchType());
          this.attributes.answer_choices[this.counter].choiceElement.push(new answerList());
          this.attributes.answer_choices[this.counter].choiceElement[0].option_df_sequence = this.counter + 1;
          this.attributes.answer_choices[this.counter].choiceElement[0].answer_df_id = 1;
          this.attributes.answer_choices[this.counter].choiceElement[0].data_identifier = "";
          this.attributes.answer_choices[this.counter].choiceElement[0].data_format_value = "";
          this.attributes.answer_choices[this.counter].choiceElement[0].score = 0;
          this.attributes.answer_choices[this.counter].choiceElement.answer_choice_insight = "";
          this.attributes.answer_choices[this.counter].choiceElement.data_insight = "";

        }
      }

      // match type 5 new json
      // for (this.counter=0; this.counter <4; this.counter++){
      //   this.attributes.answer_choices.push(new answerChoice());
      //   this.attributes.answer_choices[this.counter].choice_elements.push(new answerChoiceType());
      //   this.attributes.answer_choices[this.counter].choice_elements[0].option_df_sequence = 1;
      //   this.attributes.answer_choices[this.counter].choice_elements[0].data_format_value = "";
      //   this.attributes.answer_choices[this.counter].choice_elements[0].data_identifier = "";
      //   this.attributes.answer_choices[this.counter].choice_elements[0].previous_df_id = "";
      //   this.attributes.answer_choices[this.counter].score = 0;

      // }


      // matrix match

      if (this.matchtypeSelected == 4) {
        this.matrixAnsBlock = [];
        for (this.counter = 0; this.counter <= 3; this.counter++) {
          this.matrixAnsBlock.push(new ansType());
          for (var j = 0; j <= 3; j++) {
            this.matrixAnsBlock[this.counter].answer_choices.push(new answerList());
            this.matrixAnsBlock[this.counter].answer_choices[j].data_format_value = "";
            this.matrixAnsBlock[this.counter].answer_choices[j].option_df_sequence = this.counter + 1;
            this.matrixAnsBlock[this.counter].answer_choices[j].data_identifier = "";
            this.matrixAnsBlock[this.counter].answer_choices[j].score = 0;
            

            this.matrixAnsBlock[this.counter].answer_choices[j].label = String.fromCharCode(65 + j);

          }
          this.matrixAnsBlock[this.counter].correct_answer = false;
          this.matrixAnsBlock[this.counter].score = 0;
        }

      }

    }
  }

  closePopUp() {
    this.visible = false;
    this.toggleMatchType = false;
  }

  // copy element functions

  copyElement(index, value) {
    if (this.authService.canActivate()) {


      // if(this.item_type ==1 || this.item_type ==2){
      //   this.activeIcon = index;
      //   this.statementDroppedItems.splice(index+1,0,{element : value.element, icon:value.icon, value:value.value, id:value.id+1});
      // }else
      if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type == 5 || this.item_type == 7) {
        if (this.attributes.item.length <= 25) {
          this.activeIcon = index;
          if(value.item_df_id == 1 || value.item_df_id == 6 || value.item_df_id == 10 || value.item_df_id == 11){    //only for statement , image,audio,video
            this.attributes.item.splice(index + 1, 0, { item_df_id: value.item_df_id, item_df_sequence: value.item_df_sequence + 1, data_format_value: value.data_format_value, data_identifier: value.data_identifier, previous_df_id: value.previous_df_id ,data_id : null});
          }else if(value.item_df_id == 7){
            this.attributes.item.splice(index + 1, 0, new tableKeys());
            this.attributes.item[index + 1].item_df_id = 7;
            this.attributes.item[index + 1].item_df_sequence = value.item_df_sequence+1;
            this.attributes.item[index + 1].table_color = value.table_color;
            this.attributes.item[index + 1].no_of_rows = value.no_of_rows;
            this.attributes.item[index + 1].no_of_columns = value.no_of_columns;
            this.attributes.item[index + 1].data_identifier =  value.data_identifier;
            this.attributes.item[index + 1].previous_df_id = value.previous_df_id;
            this.attributes.item[index + 1].table_format = value.table_format;
            this.attributes.item[index + 1].available_headers = value.available_headers;
            this.attributes.item[index + 1].data_id = null;
            for(var t1 = 0;t1<this.attributes.item[index + 1].no_of_rows;t1++){
              this.attributes.item[index +1].data_format_value[t1]=[];
              for(var t2 = 0;t2<this.attributes.item[index + 1].no_of_columns;t2++){
                this.attributes.item[index + 1].data_format_value[t1].push(new tableValues());
                this.attributes.item[index + 1].data_format_value[t1][t2].header = value.data_format_value[t1][t2].header;
                this.attributes.item[index + 1].data_format_value[t1][t2].table_value = value.data_format_value[t1][t2].table_value ;
                this.attributes.item[index + 1].data_format_value[t1][t2].table_data_format_id = value.data_format_value[t1][t2].table_data_format_id;
                this.attributes.item[index + 1].data_format_value[t1][t2].table_sequence = value.data_format_value[t1][t2].table_sequence;
                this.attributes.item[index + 1].data_format_value[t1][t2].data_identifier = value.data_format_value[t1][t2].data_identifier;
                this.attributes.item[index + 1].data_format_value[t1][t2].previous_df_id = value.data_format_value[t1][t2].previous_df_id;
              }
            }
          }else if(value.item_df_id == 8){
            this.attributes.item.splice(index + 1, 0, {item_df_id: value.item_df_id, item_df_sequence: value.item_df_sequence + 1, data_format_value:'', data_identifier: value.data_identifier, previous_df_id: value.previous_df_id });
            this.attributes.item[index +1].data_format_value = [];
            this.attributes.item[index +1].data_id = null;
            for(var l1=0;l1<this.attributes.item[index].data_format_value.length;l1++){
              this.attributes.item[index+ 1].data_format_value.push(new listTypeArray());
              for(var l2=0;l2<this.attributes.item[index].data_format_value[l1].list_elements.length;l2++){
                this.attributes.item[index +1].data_format_value[l1].list_elements.push(new listType());
                this.attributes.item[index +1].data_format_value[l1].list_elements[l2].list_label = value.data_format_value[l1].list_elements[l2].list_label;
                this.attributes.item[index +1].data_format_value[l1].list_elements[l2].list_sequence = value.data_format_value[l1].list_elements[l2].list_sequence;
                this.attributes.item[index +1].data_format_value[l1].list_elements[l2].list_value = value.data_format_value[l1].list_elements[l2].list_value;
                this.attributes.item[index +1].data_format_value[l1].list_elements[l2].list_data_format_id = value.data_format_value[l1].list_elements[l2].list_data_format_id;
                this.attributes.item[index +1].data_format_value[l1].list_elements[l2].list_data_identifier = value.data_format_value[l1].list_elements[l2].list_data_identifier;
                this.attributes.item[index +1].data_format_value[l1].list_elements[l2].previous_element_id = value.data_format_value[l1].list_elements[l2].previous_element_id;
              }
            }
          }
        } else {
          this.alerts.push({
            type: 'danger',
            msg: `Only 25 Elements can be Added`,
            timeout: 4000
          });
        }
      }
      else if (this.item_type == 6) {
        if (this.attributes.directive.length <= 25) {
          if(value.item_df_id == 1 || value.item_df_id == 6 || value.item_df_id == 10 || value.item_df_id == 11){
            this.attributes.directive.splice(index + 1, 0, { item_df_id: value.item_df_id, item_df_sequence: value.item_df_sequence + 1, data_format_value: value.data_format_value, data_identifier: value.data_identifier, previous_df_id: value.previous_df_id ,data_id : null });
          }else if(value.item_df_id == 7){
            this.attributes.directive.splice(index + 1, 0, new tableKeys());
            this.attributes.directive[index + 1].item_df_id = 7;
            this.attributes.directive[index + 1].item_df_sequence = value.item_df_sequence+1;
            this.attributes.directive[index + 1].table_color = value.table_color;
            this.attributes.directive[index + 1].no_of_rows = value.no_of_rows;
            this.attributes.directive[index + 1].no_of_columns = value.no_of_columns;
            this.attributes.directive[index + 1].data_identifier =  value.data_identifier;
            this.attributes.directive[index + 1].previous_df_id = value.previous_df_id;
            this.attributes.directive[index + 1].table_format = value.table_format;
            this.attributes.directive[index + 1].available_headers = value.available_headers;
            this.attributes.directive[index + 1].data_id = null;
            for(var t1 = 0;t1<this.attributes.directive[index + 1].no_of_rows;t1++){
              this.attributes.directive[index +1].data_format_value[t1]=[];
              for(var t2 = 0;t2<this.attributes.directive[index + 1].no_of_columns;t2++){
                this.attributes.directive[index + 1].data_format_value[t1].push(new tableValues());
                this.attributes.directive[index + 1].data_format_value[t1][t2].header = value.data_format_value[t1][t2].header;
                this.attributes.directive[index + 1].data_format_value[t1][t2].table_value = value.data_format_value[t1][t2].table_value ;
                this.attributes.directive[index + 1].data_format_value[t1][t2].table_data_format_id = value.data_format_value[t1][t2].table_data_format_id;
                this.attributes.directive[index + 1].data_format_value[t1][t2].table_sequence = value.data_format_value[t1][t2].table_sequence;
                this.attributes.directive[index + 1].data_format_value[t1][t2].data_identifier = value.data_format_value[t1][t2].data_identifier;
                this.attributes.directive[index + 1].data_format_value[t1][t2].previous_df_id = value.data_format_value[t1][t2].previous_df_id;
              }
            }
          }else if(value.item_df_id == 8){
            this.attributes.directive.splice(index + 1, 0, {item_df_id: value.item_df_id, item_df_sequence: value.item_df_sequence + 1, data_format_value:'', data_identifier: value.data_identifier, previous_df_id: value.previous_df_id });
            this.attributes.directive[index +1].data_format_value = [];
            this.attributes.directive[index +1].data_id = null;
            for(var l1=0;l1<this.attributes.directive[index].data_format_value.length;l1++){
              this.attributes.directive[index+ 1].data_format_value.push(new listTypeArray());
              for(var l2=0;l2<this.attributes.directive[index].data_format_value[l1].list_elements.length;l2++){
                this.attributes.directive[index +1].data_format_value[l1].list_elements.push(new listType());
                this.attributes.directive[index +1].data_format_value[l1].list_elements[l2].list_label = value.data_format_value[l1].list_elements[l2].list_label;
                this.attributes.directive[index +1].data_format_value[l1].list_elements[l2].list_sequence = value.data_format_value[l1].list_elements[l2].list_sequence;
                this.attributes.directive[index +1].data_format_value[l1].list_elements[l2].list_value = value.data_format_value[l1].list_elements[l2].list_value;
                this.attributes.directive[index +1].data_format_value[l1].list_elements[l2].list_data_format_id = value.data_format_value[l1].list_elements[l2].list_data_format_id;
                this.attributes.directive[index +1].data_format_value[l1].list_elements[l2].list_data_identifier = value.data_format_value[l1].list_elements[l2].list_data_identifier;
                this.attributes.directive[index +1].data_format_value[l1].list_elements[l2].previous_element_id = value.data_format_value[l1].list_elements[l2].previous_element_id;
              }
            }
          }

        } else {
          this.alerts.push({
            type: 'danger',
            msg: `Only 25 Elements can be Added`,
            timeout: 4000
          });
        }

      }


    }
  }


  displayRightIcon(index) {

    this.activeIcon = index;
  }
  displayLeftIcon(index) {
    this.activeIcon = index;

  }
  // getcontentType(data){

  //   if(data.checked == false){
  //     data.checked = true;
  //     this.content_type.push(data);
  //   }else if(data.checked == true){
  //     data.checked = false;
  //     for(var i=0;i<this.content_type.length;i++){
  //       if(data.UDF_Tag_ID == this.content_type[i].UDF_Tag_ID){
  //         this.content_type.splice(i,1)
  //       }
  //     }
  //   }
  //
  // }


  //ans block true or false

  correct_answer_function1(index, value: boolean, id) {
    if (this.authService.canActivate()) {

      // var assing_correctoption;
      // assing_correctoption = this.attributes.answer_choices.forEach(correctoption =>{
      // if(correctoption.option_df_sequence==id){
      //     correctoption.correct_answer = true;
      // }
      // else{
      //     correctoption.correct_answer = false;
      // }
      // })

      for (var i = 0; i < this.attributes.answer_choices.length; i++) {
        if (i == index) {
          this.attributes.answer_choices[i].correct_answer = true;
          this.TfOption = true;
        }
        else {
          this.attributes.answer_choices[i].correct_answer = false;

        }
      }
    }

  }

  indexadding1(index: any) {
    for (var counter = 0; counter < this.attributes.answer_choices.length; counter++) {
      // this.attributes.answer_choices[counter].choice_elements[0].option_df_sequence = counter+1;
    }

  }

//  add additional options for mcq,match type 4,5

  addLocation1(index) {
    
    if (this.authService.canActivate()) {
      var splice = 1;
      index = index + 1
      var counter = index;
      if (this.item_type != 3) {
        this.answer = new answerChoice();
        this.answer.choice_elements.push(new answerChoiceType())
        this.attributes.answer_choices.splice(index, 0, this.answer);

        this.attributes.answer_choices[index].choice_elements[0].option_df_sequence = index;
        this.attributes.answer_choices[index].choice_elements[0].data_format_value = "";
        this.attributes.answer_choices[index].choice_elements[0].data_identifier = "";
        this.attributes.answer_choices[index].choice_elements[0].previous_df_id = "";
        this.attributes.answer_choices[index].choice_elements[0].data_id = null;
        this.attributes.answer_choices[index].score = 0.00;
        this.attributes.answer_choices[index].answer_choice_insight = "";
        this.attributes.answer_choices[index].data_insight = "";
        if(this.attributes.answer_choices[index].answer_choice_insight === ""){
          this.attributes.answer_choices[index].answer_choice_insight = null;
        }
        if(this.attributes.answer_choices[index].data_insight === ""){
          this.attributes.answer_choices[index].data_insight = null;
        }
        var array_index = 0;
        this.indexadding1(index);
      } else if (this.item_type == 3 && this.matchtypeSelected == 5) {
        var ans = new exactMatchType();
        this.attributes.answer_choices.splice(index, 0, ans);
        this.attributes.answer_choices[index].choiceElement.push(new answerList());
        this.attributes.answer_choices[index].choiceElement[0].option_df_sequence = index + 1;
        this.attributes.answer_choices[index].choiceElement[0].answer_df_id = 1;
        this.attributes.answer_choices[index].choiceElement[0].data_identifier = "";
        this.attributes.answer_choices[index].choiceElement[0].data_format_value = "";
        this.attributes.answer_choices[index].choiceElement[0].score = 0.00;
        this.attributes.answer_choices[index].choiceElement[0].data_id = null;
        this.attributes.answer_choices[index].answer_choice_insight = "";
        this.attributes.answer_choices[index].data_insight = "";

        if(this.attributes.answer_choices[index].answer_choice_insight === ""){
          this.attributes.answer_choices[index].answer_choice_insight = null;
        }
        if(this.attributes.answer_choices[index].data_insight === ""){
          this.attributes.answer_choices[index].data_insight = null;
        }

      }
      if (this.matchtypeSelected == 4) {
        this.attributes.answer_choices.push(new answerList());
        // this.matrixAnsBlock.push(new ansType());
        this.matrixAnsBlock.splice(index, 0, new ansType())
        var answerchoiceLength = this.matrixAnsBlock[0].answer_choices.length;
        for (var j = 0; j < answerchoiceLength; j++) {
          this.matrixAnsBlock[index].answer_choices.push(new answerList());
          this.matrixAnsBlock[index].answer_choices[j].data_format_value = "";
          this.matrixAnsBlock[index].answer_choices[j].option_df_sequence = this.counter + 1;
          this.matrixAnsBlock[index].answer_choices[j].data_identifier = "";
          this.matrixAnsBlock[index].answer_choices[j].score = 0;
          this.matrixAnsBlock[index].answer_choices[j].answer_choice_insight = '';
          this.matrixAnsBlock[index].answer_choices[j].data_insight = '';
          this.matrixAnsBlock[index].answer_choices[j].label = String.fromCharCode(65 + j);
          this.matrixAnsBlock[index].answer_choices[j].data_id = null;
        }
        this.matrixAnsBlock[index].correct_answer = false;
        this.matrixAnsBlock[index].score = 0;

      }
    }

  }
 // match functions starts
  // add additional options for match block
  addLocationMatch(index) {
    if (this.authService.canActivate()) {
      this.matchLength = this.matchLength + 1;

      var inc = 0;
      var rowlength;
      index = index + 1;
      var matchdata = new matchData();

      // for (var count=0;count < 2;count++){
      //   matchdata.match_data.push(new matchDataType());
      // }
      this.attributes.item.forEach(addLocation => {
        if (addLocation.item_df_id == 9) {

          // addLocation.data_format_value[index].match_data.push(new matchArray());
          addLocation.data_format_value.splice(index, 0, matchdata);
          rowlength = addLocation.data_format_value.length;

          addLocation.data_format_value[index].match_row_seq_id = null;
          for (var count = 0; count < 2; count++) {
            addLocation.data_format_value[index].match_data.push(new matchArray());
            addLocation.data_format_value[index].match_data[count].matchValueArray.push(new matchDataType())
            addLocation.data_format_value[index].match_data[count].matchValueArray[0].previous_df_id = "";
            addLocation.data_format_value[index].match_data[count].matchValueArray[0].match_value = "";
            addLocation.data_format_value[index].match_data[count].matchValueArray[0].match_data_format_id = 1;
            addLocation.data_format_value[index].match_data[count].matchValueArray[0].data_identifier = "";
            addLocation.data_format_value[index].match_data[count].matchValueArray[0].hiddenObj = false;
            addLocation.data_format_value[index].match_data[count].score = 0;
          }
          addLocation.data_format_value.forEach(value => {
            if (value.match_data[0].matchValueArray[0].label != "" && value.match_data[1].matchValueArray[0].label != "") {
              value.match_data[0].matchValueArray[0].label = String.fromCharCode(65 + inc);
              value.match_data[1].matchValueArray[0].label = inc + 1;
              if (value.score == "" || value.score == undefined) {
                value.score = 0;
              }
              inc++;
            }
          })
        }
      })



      // add column in answer block
      if (this.matchtypeSelected == 4) {
        var answerchoiceLength = this.matrixAnsBlock[0].answer_choices.length;
        for (this.counter = 0; this.counter < this.matrixAnsBlock.length; this.counter++) {


          var answerlist = new answerList();
          this.matrixAnsBlock[this.counter].answer_choices.splice(answerchoiceLength, 0, answerlist)
          this.matrixAnsBlock[this.counter].answer_choices[answerchoiceLength].data_format_value = "";
          this.matrixAnsBlock[this.counter].answer_choices[answerchoiceLength].option_df_sequence = this.counter + 1;
          this.matrixAnsBlock[this.counter].answer_choices[answerchoiceLength].data_identifier = "";
          this.matrixAnsBlock[this.counter].answer_choices[answerchoiceLength].score = 0;
          this.matrixAnsBlock[this.counter].answer_choices[answerchoiceLength].data_id = null;

          for (var j = 0; j <= answerchoiceLength; j++)
            this.matrixAnsBlock[this.counter].answer_choices[j].label = String.fromCharCode(65 + j);


        }

      }
    }
  }

  // add last options for match block
  addOptionLast(i1, d1, index, label) {
    if (this.authService.canActivate()) {
      this.extraOptionLength = this.extraOptionLength + 1;


      this.hideOption = true;
      var matchdata = new matchData();

      for (var count = 0; count < 2; count++) {
        // matchdata.match_data.push(new matchDataType());
        this.attributes.item[i1].data_format_value[d1 + 1] = matchdata;
        this.attributes.item[i1].data_format_value[d1 + 1].match_row_seq_id = null;
        this.attributes.item[i1].data_format_value[d1 + 1].match_data.push(new matchArray());
        this.attributes.item[i1].data_format_value[d1 + 1].match_data[count].matchValueArray.push(new matchDataType())
        this.attributes.item[i1].data_format_value[d1 + 1].match_data[count].matchValueArray[0].previous_df_id = "";
        this.attributes.item[i1].data_format_value[d1 + 1].match_data[count].matchValueArray[0].match_value = "";
        this.attributes.item[i1].data_format_value[d1 + 1].match_data[count].matchValueArray[0].match_value = "";
        this.attributes.item[i1].data_format_value[d1 + 1].match_data[count].matchValueArray[0].match_data_format_id = 1;
        this.attributes.item[i1].data_format_value[d1 + 1].match_data[count].matchValueArray[0].data_identifier = "";
        this.attributes.item[i1].data_format_value[d1 + 1].match_data[count].matchValueArray[0].label = parseInt(label) + 1;
        this.attributes.item[i1].data_format_value[d1 + 1].match_data[count].matchValueArray[0].hiddenObj = true;
      }
      this.attributes.item[i1].data_format_value[d1 + 1].match_data[0].matchValueArray[0].match_value = "abc";
      this.attributes.item[i1].data_format_value[d1 + 1].score = null;

    }
  }

  // delete last options for match block
  deleteOptionLast(i1, d1) {
    if (this.authService.canActivate()) {
      this.extraOptionLength = this.extraOptionLength - 1;

      this.attributes.item[i1].data_format_value.splice(d1, 1);
      this.hideOption = false;

    }
  }

  // delete options for match ans block
  deleteLocationMatch(index) {
    if (this.authService.canActivate()) {
      this.matchLength = this.matchLength - 1;

      var inc = 0;
      var deleteHeader;
      this.attributes.item.forEach(getLocation => {
        if (getLocation.item_df_id == 9) {
          if (getLocation.data_format_value[index].match_data[0].matchValueArray[0].header == 1) {
            deleteHeader = 1;
          }
          getLocation.data_format_value.splice(index, 1);
          getLocation.data_format_value.forEach(value => {
            if (value.match_data[0].matchValueArray[0].label != "" && value.match_data[1].matchValueArray[0].label != "") {
              value.match_data[0].matchValueArray[0].label = String.fromCharCode(65 + inc);
              value.match_data[1].matchValueArray[0].label = inc + 1;
              inc++;
            }
          })
        }
      })


      if (this.matchtypeSelected == 4 && deleteHeader != 1) {
        var answerchoiceLength = this.matrixAnsBlock[0].answer_choices.length - 1;
        for (this.counter = 0; this.counter < this.matrixAnsBlock.length; this.counter++) {
          var answerlist = new answerList();
          this.matrixAnsBlock[this.counter].answer_choices.splice(answerchoiceLength, 1)
        }

      }
    }

  }

  // delete options for maq,match 4,5

  deleteLocation1(index) {
    if (this.authService.canActivate()) {

      var deleteoption_current = this.attributes.answer_choices;
      deleteoption_current = deleteoption_current.splice(index, 1);


      if (this.matchtypeSelected == 4) {
        this.attributes.answer_choices.splice(index, 1);
        this.matrixAnsBlock.splice(index, 1);
      }
    }
  }
  // match functions ends



  // List functions
  addList(itemindex, listindex) {

    var listArray = new listTypeArray();
    var list_type = new listType();
    if (this.item_type != 6) {
      this.attributes.item[itemindex].data_format_value.splice(listindex + 1, 0, listArray);
      this.attributes.item[itemindex].data_format_value[listindex + 1].list_elements.push(list_type);
      // this.attributes.item[itemindex].data_format_value[listindex+1].list_elements[0].list_label = "A";
      this.attributes.item[itemindex].data_format_value[listindex + 1].list_elements[0].list_sequence = 1;
      this.attributes.item[itemindex].data_format_value[listindex + 1].list_elements[0].list_value = "";
      this.attributes.item[itemindex].data_format_value[listindex + 1].list_elements[0].list_data_format_id = 1;
      this.attributes.item[itemindex].data_format_value[listindex + 1].list_elements[0].list_data_identifier = "";
      this.attributes.item[itemindex].data_format_value[listindex + 1].list_elements[0].previous_element_id = "";
      this.attributes.item[itemindex].data_format_value[listindex + 1].list_elements[0].list_data_id = null;
      for (var i = 0; i < this.attributes.item[itemindex].data_format_value.length; i++) {
        if (this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label == 'A') {
          this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = String.fromCharCode(65 + i);
        } else if (this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label == 'a') {
          this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = String.fromCharCode(97 + i);
        } else if (this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label == '1') {
          this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = i + 1;
        } else if (this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label == 'I') {
          if (i == 1) {
            this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = 'II';
          } else if (i == 2) {
            this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = 'III';
          } else if (i == 3) {
            this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = 'IV';
          } else if (i == 4) {
            this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = 'V';
          }
        } else {
          this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label;
        }
      }
    } else if (this.item_type == 6) {
      this.attributes.directive[itemindex].data_format_value.splice(listindex + 1, 0, listArray);
      this.attributes.directive[itemindex].data_format_value[listindex + 1].list_elements.push(list_type);
      // this.attributes.item[itemindex].data_format_value[listindex+1].list_elements[0].list_label = "A";
      this.attributes.directive[itemindex].data_format_value[listindex + 1].list_elements[0].list_sequence = 1;
      this.attributes.directive[itemindex].data_format_value[listindex + 1].list_elements[0].list_value = "";
      this.attributes.directive[itemindex].data_format_value[listindex + 1].list_elements[0].list_data_format_id = 1;
      this.attributes.directive[itemindex].data_format_value[listindex + 1].list_elements[0].list_data_identifier = "";
      this.attributes.directive[itemindex].data_format_value[listindex + 1].list_elements[0].previous_element_id = "";
      this.attributes.directive[itemindex].data_format_value[listindex + 1].list_elements[0].list_data_id = null;
      for (var i = 0; i < this.attributes.directive[itemindex].data_format_value.length; i++) {
        if (this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label == 'A') {
          this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = String.fromCharCode(65 + i);
        } else if (this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label == 'a') {
          this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = String.fromCharCode(97 + i);
        } else if (this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label == '1') {
          this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = i + 1;
        } else if (this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label == 'I') {
          if (i == 1) {
            this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = 'II';
          } else if (i == 2) {
            this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = 'III';
          } else if (i == 3) {
            this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = 'IV';
          } else if (i == 4) {
            this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = 'V';
          }
        } else {
          this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label;
        }
      }
    }


  }

  deleteList(itemindex, listindex) {
    if (this.item_type != 6) {
      this.attributes.item[itemindex].data_format_value.splice(listindex, 1);

      for (var i = 0; i < this.attributes.item[itemindex].data_format_value.length; i++) {
        if (this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label == 'A') {
          this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = String.fromCharCode(65 + i);
        } else if (this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label == 'a') {
          this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = String.fromCharCode(97 + i);
        } else if (this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label == '1') {
          this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = i + 1;
        } else if (this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label == 'I') {
          if (i == 1) {
            this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = 'II';
          } else if (i == 2) {
            this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = 'III';
          } else if (i == 3) {
            this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = 'IV';
          } else if (i == 4) {
            this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = 'V';
          }
        } else {
          this.attributes.item[itemindex].data_format_value[i].list_elements[0].list_label = this.attributes.item[itemindex].data_format_value[0].list_elements[0].list_label;
        }
      }
    } else if (this.item_type == 6) {
      this.attributes.directive[itemindex].data_format_value.splice(listindex, 1);

      for (var i = 0; i < this.attributes.directive[itemindex].data_format_value.length; i++) {
        if (this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label == 'A') {
          this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = String.fromCharCode(65 + i);
        } else if (this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label == 'a') {
          this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = String.fromCharCode(97 + i);
        } else if (this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label == '1') {
          this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = i + 1;
        } else if (this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label == 'I') {
          if (i == 1) {
            this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = 'II';
          } else if (i == 2) {
            this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = 'III';
          } else if (i == 3) {
            this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = 'IV';
          } else if (i == 4) {
            this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = 'V';
          }
        } else {
          this.attributes.directive[itemindex].data_format_value[i].list_elements[0].list_label = this.attributes.directive[itemindex].data_format_value[0].list_elements[0].list_label;
        }
      }
    }

  }

  deleteListChoices(i, d, l) {
    if(this.item_type != 6){
      this.attributes.item[i].data_format_value[d].list_elements.splice(l, 1);
    }
    else if(this.item_type == 6){
      this.attributes.directive[i].data_format_value[d].list_elements.splice(l, 1);
    }
  }

  getListLabel(i, d, selectedlabel) {
    if (this.item_type != 6) {
      this.attributes.item[i].data_format_value[d].list_elements[0].list_label = selectedlabel;
      for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
        if (this.attributes.item[i].data_format_value[d].list_elements[0].list_label == 'A' && this.attributes.item[i].data_format_value.length > 1) {
          this.attributes.item[i].data_format_value[j].list_elements[0].list_label = String.fromCharCode(65 + j);
        } else if (this.attributes.item[i].data_format_value[d].list_elements[0].list_label == 'a' && this.attributes.item[i].data_format_value.length > 1) {
          this.attributes.item[i].data_format_value[j].list_elements[0].list_label = String.fromCharCode(97 + j);
        } else if (this.attributes.item[i].data_format_value[d].list_elements[0].list_label == '1' && this.attributes.item[i].data_format_value.length > 1) {
          this.attributes.item[i].data_format_value[j].list_elements[0].list_label = j + 1;
        } else if (this.attributes.item[i].data_format_value[d].list_elements[0].list_label == 'I' && this.attributes.item[i].data_format_value.length > 1) {
          if (j == 1) {
            this.attributes.item[i].data_format_value[j].list_elements[0].list_label = 'II';
          } else if (j == 2) {
            this.attributes.item[i].data_format_value[j].list_elements[0].list_label = 'III';
          } else if (j == 3) {
            this.attributes.item[i].data_format_value[j].list_elements[0].list_label = 'IV';
          } else if (j == 4) {
            this.attributes.item[i].data_format_value[j].list_elements[0].list_label = 'V';
          }
        } else {
          this.attributes.item[i].data_format_value[j].list_elements[0].list_label = selectedlabel;
        }
      }
    } else if (this.item_type == 6) {
      this.attributes.directive[i].data_format_value[d].list_elements[0].list_label = selectedlabel;
      for (var j = 0; j < this.attributes.directive[i].data_format_value.length; j++) {
        if (this.attributes.directive[i].data_format_value[d].list_elements[0].list_label == 'A' && this.attributes.directive[i].data_format_value.length > 1) {
          this.attributes.directive[i].data_format_value[j].list_elements[0].list_label = String.fromCharCode(65 + j);
        } else if (this.attributes.directive[i].data_format_value[d].list_elements[0].list_label == 'a' && this.attributes.directive[i].data_format_value.length > 1) {
          this.attributes.directive[i].data_format_value[j].list_elements[0].list_label = String.fromCharCode(97 + j);
        } else if (this.attributes.directive[i].data_format_value[d].list_elements[0].list_label == '1' && this.attributes.directive[i].data_format_value.length > 1) {
          this.attributes.directive[i].data_format_value[j].list_elements[0].list_label = j + 1;
        } else if (this.attributes.directive[i].data_format_value[d].list_elements[0].list_label == 'I' && this.attributes.directive[i].data_format_value.length > 1) {
          if (j == 1) {
            this.attributes.directive[i].data_format_value[j].list_elements[0].list_label = 'II';
          } else if (j == 2) {
            this.attributes.directive[i].data_format_value[j].list_elements[0].list_label = 'III';
          } else if (j == 3) {
            this.attributes.directive[i].data_format_value[j].list_elements[0].list_label = 'IV';
          } else if (j == 4) {
            this.attributes.directive[i].data_format_value[j].list_elements[0].list_label = 'V';
          }
        } else {
          this.attributes.directive[i].data_format_value[j].list_elements[0].list_label = selectedlabel;
        }
      }
    }

  }
  // List functions ends


  // Table functions

  gethoverRC(r,c){

    if(this.fixRC == false){
      this.choosedRowIndex = r+1;
      this.choosedColIndex = c+1;
    }
  }

  TableKeywords(key,event){
    if(event.keyCode == 13){
      if(this.pattern1.test(key) && key != undefined){
        this.keywordArray.push(key);
        this.tblKeyword = '';
      }
    }
  }

  RemoveTblKeyword(key){
    for(var i=0;i<this.keywordArray.length;i++){
      if(key == this.keywordArray[i]){
        this.keywordArray.splice(i,1);
      }
    }
  }

  closeTblPopup(){
    this.ShowTableModal = false;
    this.tblKeyword = '';
    this.keywordArray = [];
    this.choosedRowIndex = undefined;
    this.choosedColIndex = undefined;
    this.isColumnHeader = false;
    this.isRowHeader = false;
    this.attributes.item.splice(this.tableIndex,1);
    this.activeTblType = this.tableTypes[0].table_type;
    this.hightlightTblClr =  this.tableTypes[0].images[0].color;
  }



  getTableDatas(){
    var addcolumnHeader = 0;
    var addrowHeader = 0;
    if(this.isColumnHeader == true){
      addcolumnHeader = 1;
    }if(this.isRowHeader == true){
      addrowHeader = 1;
    }

    if(this.item_type != 6){
      this.attributes.item.splice(this.tableIndex,1);
      this.attributes.item.splice(this.tableIndex,0,new tableKeys());

      this.attributes.item[this.tableIndex].item_df_id = 7;
      this.attributes.item[this.tableIndex].item_df_sequence = this.tableIndex+1;
      // this.attributes.item[this.tableIndex].table_format = this.activeTblType+1;
      this.attributes.item[this.tableIndex].table_color = this.hightlightTblClr;
      this.attributes.item[this.tableIndex].no_of_rows =this.choosedRowIndex + addrowHeader;
      this.attributes.item[this.tableIndex].no_of_columns = this.choosedColIndex +addcolumnHeader;
      this.attributes.item[this.tableIndex].data_identifier =  this.keywordArray.map(value => value).join(",");
      this.attributes.item[this.tableIndex].previous_df_id = "";
      this.attributes.item[this.tableIndex].data_id = null;


      switch(this.activeTblType){
        case 'Small Table':
        this.attributes.item[this.tableIndex].table_format = 5;
        break;
        case 'Bordered Table':
        this.attributes.item[this.tableIndex].table_format = 4;
        break;
        case 'Default Table':
        this.attributes.item[this.tableIndex].table_format = 1;
        break;
        case 'Table Head':
        this.attributes.item[this.tableIndex].table_format = 2;
        break;
        case 'Stripped Rows':
        this.attributes.item[this.tableIndex].table_format = 3;
        break;
      }

      for(var i=0;i<this.choosedRowIndex + addrowHeader;i++){
       this.attributes.item[this.tableIndex].data_format_value[i]=[];
        for(var j=0;j<this.choosedColIndex+addcolumnHeader;j++){

          this.attributes.item[this.tableIndex].data_format_value[i].push(new tableValues());
          this.attributes.item[this.tableIndex].data_format_value[i][j].header = 0;
          this.attributes.item[this.tableIndex].data_format_value[i][j].table_value ='' ;
          this.attributes.item[this.tableIndex].data_format_value[i][j].table_data_format_id =1;
          this.attributes.item[this.tableIndex].data_format_value[i][j].table_sequence = j+1;
          this.attributes.item[this.tableIndex].data_format_value[i][j].data_identifier = '';
          this.attributes.item[this.tableIndex].data_format_value[i][j].previous_df_id = '';
          if(this.isColumnHeader == true && this.isRowHeader == true){
            this.attributes.item[this.tableIndex].available_headers ='all';
            if(i==0){
              this.attributes.item[this.tableIndex].data_format_value[i][j].header = 1;
              if(i==0 && j==0){
                this.attributes.item[this.tableIndex].data_format_value[i][j].table_value ='#' ;
              }
            }else if(i>0 && j==0){
              this.attributes.item[this.tableIndex].data_format_value[i][j].header = 1;
            }
          }else if(this.isColumnHeader == true && this.isRowHeader == false){
            this.attributes.item[this.tableIndex].available_headers ='column';
            if(i==0){
              this.attributes.item[this.tableIndex].data_format_value[i][j].header = 1;
            }
          }else if(this.isColumnHeader == false && this.isRowHeader == true){
            this.attributes.item[this.tableIndex].available_headers ='row';
            if(j==0){
              this.attributes.item[this.tableIndex].data_format_value[i][j].header = 1;
            }
          }else{
            this.attributes.item[this.tableIndex].available_headers ='none';
          }
        }
      }
    }
    else if(this.item_type == 6){
      this.attributes.directive.splice(this.tableIndex,1);
      this.attributes.directive.splice(this.tableIndex,0,new tableKeys());

      this.attributes.directive[this.tableIndex].item_df_id = 7;
      this.attributes.directive[this.tableIndex].item_df_sequence = this.tableIndex+1;
      // this.attributes.item[this.tableIndex].table_format = this.activeTblType+1;
      this.attributes.directive[this.tableIndex].table_color = this.hightlightTblClr;
      this.attributes.directive[this.tableIndex].no_of_rows =this.choosedRowIndex + addrowHeader;
      this.attributes.directive[this.tableIndex].no_of_columns = this.choosedColIndex +addcolumnHeader;
      this.attributes.directive[this.tableIndex].data_identifier =  this.keywordArray.map(value => value).join(",");
      this.attributes.directive[this.tableIndex].previous_df_id = "";
      this.attributes.directive[this.tableIndex].data_id = null;

      switch(this.activeTblType){
        case 'Small Table':
        this.attributes.directive[this.tableIndex].table_format = 5;
        break;
        case 'Bordered Table':
        this.attributes.directive[this.tableIndex].table_format = 4;
        break;
        case 'Default Table':
        this.attributes.directive[this.tableIndex].table_format = 1;
        break;
        case 'Table Head':
        this.attributes.directive[this.tableIndex].table_format = 2;
        break;
        case 'Stripped Rows':
        this.attributes.directive[this.tableIndex].table_format = 3;
        break;
      }

      for(var i=0;i<this.choosedRowIndex + addrowHeader;i++){
       this.attributes.directive[this.tableIndex].data_format_value[i]=[];
        for(var j=0;j<this.choosedColIndex+addcolumnHeader;j++){

          this.attributes.directive[this.tableIndex].data_format_value[i].push(new tableValues());
          this.attributes.directive[this.tableIndex].data_format_value[i][j].header = 0;
          this.attributes.directive[this.tableIndex].data_format_value[i][j].table_value ='' ;
          this.attributes.directive[this.tableIndex].data_format_value[i][j].table_data_format_id =1;
          this.attributes.directive[this.tableIndex].data_format_value[i][j].table_sequence = j+1;
          this.attributes.directive[this.tableIndex].data_format_value[i][j].data_identifier = '';
          this.attributes.directive[this.tableIndex].data_format_value[i][j].previous_df_id = '';
          if(this.isColumnHeader == true && this.isRowHeader == true){
            this.attributes.directive[this.tableIndex].available_headers ='all';
            if(i==0){
              this.attributes.directive[this.tableIndex].data_format_value[i][j].header = 1;
              if(i==0 && j==0){
                this.attributes.directive[this.tableIndex].data_format_value[i][j].table_value ='#' ;
              }
            }else if(i>0 && j==0){
              this.attributes.directive[this.tableIndex].data_format_value[i][j].header = 1;
            }
          }else if(this.isColumnHeader == true && this.isRowHeader == false){
            this.attributes.directive[this.tableIndex].available_headers ='column';
            if(i==0){
              this.attributes.directive[this.tableIndex].data_format_value[i][j].header = 1;
            }
          }else if(this.isColumnHeader == false && this.isRowHeader == true){
            this.attributes.directive[this.tableIndex].available_headers ='row';
            if(j==0){
              this.attributes.directive[this.tableIndex].data_format_value[i][j].header = 1;
            }
          }else{
            this.attributes.directive[this.tableIndex].available_headers ='none';
          }
        }
      }
    }



    this.ShowTableModal = false;
    this.tblKeyword = '';
    this.keywordArray = [];
    this.choosedRowIndex = undefined;
    this.choosedColIndex = undefined;
    this.isColumnHeader = false;
    this.isRowHeader = false;
    this.tableIndex = 0;
    this.activeTblType = 0;
    this.activeTblType = this.tableTypes[0].table_type;
    this.hightlightTblClr =  this.tableTypes[0].images[0].color;

  }

  addTableRow(itemIndex,rowIndex){
    if(this.item_type != 6){
      this.attributes.item[itemIndex].data_format_value.splice(rowIndex+1,0,new tableValues());
      this.attributes.item[itemIndex].data_format_value[rowIndex+1] =[];

      for(var j=0;j<this.attributes.item[itemIndex].no_of_columns;j++){
        this.attributes.item[itemIndex].data_format_value[rowIndex+1].push(new tableValues());
        this.attributes.item[itemIndex].data_format_value[rowIndex+1][j].header = this.attributes.item[itemIndex].data_format_value[rowIndex][j].header;
        this.attributes.item[itemIndex].data_format_value[rowIndex+1][j].table_value ='' ;
        this.attributes.item[itemIndex].data_format_value[rowIndex+1][j].table_data_format_id =1;
        this.attributes.item[itemIndex].data_format_value[rowIndex+1][j].table_sequence = j+1;
        this.attributes.item[itemIndex].data_format_value[rowIndex+1][j].data_identifier = '';
        this.attributes.item[itemIndex].data_format_value[rowIndex+1][j].previous_df_id = '';
        this.attributes.item[itemIndex].data_format_value[rowIndex+1][j].table_data_id = null;
      }
      this.attributes.item[itemIndex].no_of_rows = this.attributes.item[itemIndex].no_of_rows+1;
    }
    else if(this.item_type == 6){
      this.attributes.directive[itemIndex].data_format_value.splice(rowIndex+1,0,new tableValues());
      this.attributes.directive[itemIndex].data_format_value[rowIndex+1] =[];

      for(var j=0;j<this.attributes.directive[itemIndex].no_of_columns;j++){
        this.attributes.directive[itemIndex].data_format_value[rowIndex+1].push(new tableValues());
        this.attributes.directive[itemIndex].data_format_value[rowIndex+1][j].header = this.attributes.directive[itemIndex].data_format_value[rowIndex][j].header;
        this.attributes.directive[itemIndex].data_format_value[rowIndex+1][j].table_value ='' ;
        this.attributes.directive[itemIndex].data_format_value[rowIndex+1][j].table_data_format_id =1;
        this.attributes.directive[itemIndex].data_format_value[rowIndex+1][j].table_sequence = j+1;
        this.attributes.directive[itemIndex].data_format_value[rowIndex+1][j].data_identifier = '';
        this.attributes.directive[itemIndex].data_format_value[rowIndex+1][j].previous_df_id = '';
        this.attributes.directive[itemIndex].data_format_value[rowIndex+1][j].table_data_id = null;
      }
      this.attributes.directive[itemIndex].no_of_rows = this.attributes.directive[itemIndex].no_of_rows+1;
    }



  }

  deleteTableRow(itemIndex,rowIndex){
    if(this.item_type != 6){
      this.attributes.item[itemIndex].data_format_value.splice(rowIndex,1);
      this.attributes.item[itemIndex].no_of_rows = this.attributes.item[itemIndex].no_of_rows - 1;
    } else if(this.item_type == 6){
      this.attributes.directive[itemIndex].data_format_value.splice(rowIndex,1);
      this.attributes.directive[itemIndex].no_of_rows = this.attributes.directive[itemIndex].no_of_rows - 1;
    }
  }

  addTableColumn(itemindex,colindex){
    if(this.item_type != 6){
      for(var i=0;i<this.attributes.item[itemindex].data_format_value.length;i++){
        this.attributes.item[itemindex].data_format_value[i].splice(colindex+1,0,new tableValues());
        this.attributes.item[itemindex].data_format_value[i][colindex+1].header = this.attributes.item[itemindex].data_format_value[i][colindex].header;
            this.attributes.item[itemindex].data_format_value[i][colindex+1].table_value ='' ;
            this.attributes.item[itemindex].data_format_value[i][colindex+1].table_data_format_id =1;
            this.attributes.item[itemindex].data_format_value[i][colindex+1].table_sequence = colindex+1+1;
            this.attributes.item[itemindex].data_format_value[i][colindex+1].data_identifier = '';
            this.attributes.item[itemindex].data_format_value[i][colindex+1].previous_df_id = '';
            this.attributes.item[itemindex].data_format_value[i][colindex+1].table_data_id = null;
      }
      this.attributes.item[itemindex].no_of_columns = this.attributes.item[itemindex].no_of_columns+1;
    }
    else if(this.item_type == 6){
      for(var i=0;i<this.attributes.directive[itemindex].data_format_value.length;i++){
        this.attributes.directive[itemindex].data_format_value[i].splice(colindex+1,0,new tableValues());
        this.attributes.directive[itemindex].data_format_value[i][colindex+1].header = this.attributes.directive[itemindex].data_format_value[i][colindex].header;
        this.attributes.directive[itemindex].data_format_value[i][colindex+1].table_value ='' ;
        this.attributes.directive[itemindex].data_format_value[i][colindex+1].table_data_format_id =1;
        this.attributes.directive[itemindex].data_format_value[i][colindex+1].table_sequence = colindex+1+1;
        this.attributes.directive[itemindex].data_format_value[i][colindex+1].data_identifier = '';
        this.attributes.directive[itemindex].data_format_value[i][colindex+1].previous_df_id = '';
        this.attributes.directive[itemindex].data_format_value[i][colindex+1].table_data_id = null;
      }
      this.attributes.directive[itemindex].no_of_columns = this.attributes.directive[itemindex].no_of_columns+1;
    }
  }

  DeleteTableColumn(itemindex,colindex){
    if(this.item_type != 6){
      for(var i=0;i<this.attributes.item[itemindex].data_format_value.length;i++){
        this.attributes.item[itemindex].data_format_value[i].splice(colindex,1);
      }
      this.attributes.item[itemindex].no_of_columns = this.attributes.item[itemindex].no_of_columns-1;
    } else if(this.item_type == 6){
      for(var i=0;i<this.attributes.directive[itemindex].data_format_value.length;i++){
        this.attributes.directive[itemindex].data_format_value[i].splice(colindex,1);
      }
      this.attributes.directive[itemindex].no_of_columns = this.attributes.directive[itemindex].no_of_columns-1;
    }
  }


  ShowTableBtn(colindex,rowindex,itemindex){
    this.HoveredColIndex = colindex;
    this.HoveredRowIndex = rowindex;
    this.hideTblColBtn = itemindex;

  }

  hideTableBtn(){
    this.HoveredColIndex = -1;
    this.HoveredRowIndex = -1;
  }
  // Table functions ends


  //free text function

  AddFreeTextKey(){
    this.attributes.answer_choices.push(new freeText_answerType());
  }

  DeleteFreeTextKey(){
    this.attributes.answer_choices.splice(this.attributes.answer_choices.length-1,1);
  }

  // free text function ends


  // fileupload item type functions starts

  addfileUploadOption(index){
    this.attributes.answer_choices.splice(index+1,0,new fileUploadAnsBlock());
  }

  deletefileUploadOption(index){
    this.attributes.answer_choices.splice(index,1);
  }

  getFileFormat(selctedFormat,index){
    this.attributes.answer_choices[index].fileTypeList = [];
    this.attributes.answer_choices[index].data_format_type = [];

    var tempfileList =[];
      for(var i=0;i<selctedFormat.length;i++){
        switch(selctedFormat[i].itemName){
          case 'Document':
            tempfileList =  tempfileList.concat(this.FileFormatListMetaData.filter(
            file =>file.file_type === selctedFormat[i].itemName));
          break;
          case 'Image':
            tempfileList = tempfileList.concat(this.FileFormatListMetaData.filter(
            file => file.file_type === selctedFormat[i].itemName));
            break;
          case 'Audio':
            tempfileList = tempfileList.concat(this.FileFormatListMetaData.filter(
            file => file.file_type === selctedFormat[i].itemName));
            break;
          case 'Video':
            tempfileList = tempfileList.concat(this.FileFormatListMetaData.filter(
            file => file.file_type === selctedFormat[i].itemName));
            break;
        }

      }
    this.attributes.answer_choices[index].fileTypeList = tempfileList;



  }


  // fileupload item type functions ends


  correct_answer_function2(index, value: boolean, id, score) {
    if (this.authService.canActivate()) {


      var assing_correctoption;
      if (value == false) {
        if (this.item_type == 1) {
          this.attributes.answer_choices[index].correct_answer = !value;
          // this.attributes.answer_choices[index].score = 0;
        }
        if (this.matchtypeSelected == 5) {
          this.attributes.answer_choices[index].choiceElement[0].correct_answer = !value;
          // this.attributes.answer_choices[index].choiceElement[0].score = 0;
        }
        if (this.matchtypeSelected == 4) {
          this.matrixAnsBlock[index].correct_answer = !value;
          // this.matrixAnsBlock[index].score = 0;
        }
      }
      else {
        if (this.item_type == 1) {
          this.attributes.answer_choices[index].correct_answer = !value;
          this.attributes.answer_choices[index].score = 0;
        }
        if (this.matchtypeSelected == 5) {
          this.attributes.answer_choices[index].choiceElement[0].correct_answer = !value;
          this.attributes.answer_choices[index].choiceElement[0].score = 0;
        }
        if (this.matchtypeSelected == 4) {
          this.matrixAnsBlock[index].correct_answer = !value;
          this.matrixAnsBlock[index].score = 0;
        }
      }

    }
  }

  onChangeToggle(event) {

    if (this.authService.canActivate()) {
      if (event == false) {
        this.enableToggle = true;
        this.showGradedScore = false;
        this.scoreIndex = 0;
        this.attributes.score_type = "Graded Score";
        for(var f=0;f<this.attributes.answer_choices.length;f++){
          this.attributes.answer_choices[f].score = 0;
        }
        // this.score = 1;
        if (this.matchtypeSelected == 4) {
          for (var i = 0; i < this.matrixAnsBlock.length; i++) {
            this.matrixAnsBlock[i].score = 0;
          }

        }

      }
      else {
        this.enableToggle = false;
        this.showGradedScore = true;
        // this.score = 1;
        this.attributes.score_type = "Item Lvl Score";
        if(this.item_type == 5){
          for(var f=0;f<this.attributes.answer_choices.length;f++){
            this.attributes.answer_choices[f].score = 0;
          }
        }
      }
    }
  }

  onChangeToggle1(event) {
    if (this.authService.canActivate()) {
      if (event == false) {
        this.enableToggleMatch = true;
        this.showGradedScore1 = false;
        this.scoreIndex = 0;
        this.attributes.score_type = "Graded Score";
        this.score = 0.00;
        if (this.item_type == 3) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].item_df_id == 9) {
              this.attributes.item[i].score_type = "Graded Score";
              // this.attributes.item[i].score = 0;
            }
          }

        }
      }
      else {
        this.showGradedScore1 = true;
        this.enableToggleMatch = false
        this.attributes.score_type = "Item Lvl Score";
        if (this.item_type == 3) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].item_df_id == 9) {
              this.attributes.item[i].score_type = "Item Lvl Score";
              // this.attributes.item[i].score = 1;
            }
          }

        }
      }
    }
  }

  deleteChoices(ansChoiceIndex, choiceElementIndex) {
    if (this.authService.canActivate()) {

      this.attributes.answer_choices[ansChoiceIndex].choice_elements.splice(choiceElementIndex, 1);
    }
  }


  onlyNumberKey(e) {
    // var charCode;
    // if (e.keyCode > 0) {
    //     charCode = e.which || e.keyCode;
    // }
    // else if (typeof (e.charCode) != "undefined") {
    //     charCode = e.which || e.keyCode;
    // }
    // if (charCode == 46)
    //     return true
    // if (charCode > 31 && (charCode < 48 || charCode > 57) )
    //     return false;
    // return true;

    const pattern = /^[0-9.-]*$/;

    let inputChar = String.fromCharCode(e.charCode);
    if (e.keyCode != 8 && !pattern.test(inputChar)) {
      e.preventDefault();
    }
  }


  onlyNumber(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  numberValidation(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 49 && event.charCode <= 56;
  }

  showCancelAlert(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-sm' }, this.config),

    );
  }


  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  //preview functions

  showPreview() {
    if (this.authService.canActivate()) {
      this.showPreviewModal = true;
      this.arrayToDrag = [];
      this.fileChoosen = [];
      if(this.item_type == 7){
        for(var ac=0;ac<this.attributes.answer_choices.length;ac++){
          this.attributes.answer_choices[ac].sortedArray = [];
          if(this.attributes.answer_choices[ac].data_format_type.length != 0){
            var a =  _.orderBy(this.attributes.answer_choices[ac].data_format_type, ['file_type'],['asc']);
            this.attributes.answer_choices[ac].sortedArray = (_(a)
            .groupBy(x => x.file_type)
            .map((value, key) => ({format: key, value: value}))
            .value())
          }
        }


      }
      if (this.matchtypeSelected == 3) {
        for (var i = 0; i < this.attributes.item.length; i++) {
          if (this.attributes.item[i].item_df_id == 9) {
            for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
              if (this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0].header != 1) {
                this.arrayToDrag.push(this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0]);
              }
            }
          }
        }

      }
      if (this.matchtypeSelected == 2) {
        for (var i = 0; i < this.attributes.item.length; i++) {
          if (this.attributes.item[i].item_df_id == 9) {
            for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
              if (this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0].header != 1 && this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0].hiddenObj != true) {
                this.arrayToDrag.push(this.attributes.item[i].data_format_value[j].match_data[1].matchValueArray[0]);
              }
            }
          }
        }

      }
      if (this.viewItemBlk == true && this.directive_id != 0 && this.directive_id != undefined) {
        this.questionCount = 0;
        this.previewArray = this.viewItemQuestions[this.questionCount];

        this.directiveContent = this.previewArray.directive_content;
        if (this.previewArray.matchlist_type == 3) {
          for (var i = 0; i < this.previewArray.item.length; i++) {
            if (this.previewArray.item[i].item_df_id == 9) {
              for (var j = 0; j < this.previewArray.item[i].data_format_value.length; j++) {
                if (this.previewArray.item[i].data_format_value[j].match_data[1].header != 1) {
                  this.arrayToDrag.push(this.previewArray.item[i].data_format_value[j].match_data[1]);
                }
              }
            }
          }

        }
        if (this.previewArray.matchlist_type == 2) {
          for (var i = 0; i < this.previewArray.item.length; i++) {
            if (this.previewArray.item[i].item_df_id == 9) {
              for (var j = 0; j < this.previewArray.item[i].data_format_value.length; j++) {
                if (this.previewArray.item[i].data_format_value[j].match_data[1].header != 1 && this.previewArray.item[i].data_format_value[j].match_data[0].match_value != 'abc') {
                  this.arrayToDrag.push(this.previewArray.item[i].data_format_value[j].match_data[1]);
                }
              }
            }
          }

        }
        if(this.previewArray.item_type == 7){
          for(var ac=0;ac<this.previewArray.answer_choices.length;ac++){
            this.previewArray.answer_choices[ac].sortedArray = [];
            if(this.previewArray.answer_choices[ac].data_format_type.length != 0){
              var a =  _.orderBy(this.previewArray.answer_choices[ac].data_format_type, ['file_type'],['asc']);
              this.previewArray.answer_choices[ac].sortedArray = (_(a)
              .groupBy(x => x.file_type)
              .map((value, key) => ({format: key, value: value}))
              .value())
            }
          }


        }

      }
      if (this.getDirectiveQuestion == true && (this.directive_id != undefined && this.directive_id != 0)) {
        var headers = new Headers();
        this.saveload = true;
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.get(credentials.host + "/directive_items/" + this.cookieService.get('_PAOID') + "/" + this.directive_id + "-@", { headers: headers })
          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
          data => {

            this.saveload = false;
            this.isDirective = 1;
            if ((this.isDirective != 0 && this.isDirective != undefined)) {
              this.attributes.directive = data.content;

              this.isDirective = 0;
            }
            // for(var i=0;i<data.attributes.subject.length;i++){
            //   this.selectedSub.push( data.attributes.subject[i]);
            //   this.getTopic(this.selectedSub);
            //   }
            //   for(var i=0;i< data.attributes.topic.length;i++){
            //     this.selectedTopic.push( data.attributes.topic[i]);
            //     this.getSubtopic(this.selectedTopic)
            //   }
            //   for(var i=0;i< data.attributes.subtopic.length;i++){
            //     this.selectedSubtopic.push( data.attributes.subtopic[i]);
            //   }
            //   this.difficulty_level =  data.attributes.difficulty_level;
            //   this.taxonomy =  data.attributes.taxonomy;
            //   this.item_valid_till =  data.attributes.item_valid_till;

            //   for(var i=0;i< data.attributes.content_type.length;i++){
            //   this.content1.push( data.attributes.content_type[i]);
            //   }

            //   this.explanation =  data.attributes.explanation;
            //   this.ref_link =  data.attributes.ref_link;
            //   this.hint =  data.attributes.hint;
            //   this.search_keywords =  data.attributes.search_keywords;

            //   if( data.attributes.item_valid_till!=null){
            //     var a= data.attributes.item_valid_till;
            //   this.date1 = a.split('-');
            //   this.item_valid_till = { date: { year: +this.date1[0], month: +this.date1[1], day: +this.date1[2] } };

            //   }else{
            //     this.item_valid_till =  data.attributes.item_valid_till;
            //   }
          },
          error => {

            this.saveload = false;
            if (error.status == 404) {
              this.router.navigateByUrl('pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='https://accounts.scora.in';
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }

          }
          );
      }
    }
  }

  // this is to change next item in view directive item preview
  getNextQues() {
    if (this.authService.canActivate()) {
      this.arrayToDrag = [];
      if (this.questionCount < this.viewItemQuestions.length - 1) {
        this.questionCount = this.questionCount + 1;
        this.previewArray = this.viewItemQuestions[this.questionCount];
        if (this.previewArray.matchlist_type == 3) {
          for (var i = 0; i < this.previewArray.item.length; i++) {
            if (this.previewArray.item[i].item_df_id == 9) {
              for (var j = 0; j < this.previewArray.item[i].data_format_value.length; j++) {
                if (this.previewArray.item[i].data_format_value[j].match_data[1].header != 1) {
                  this.arrayToDrag.push(this.previewArray.item[i].data_format_value[j].match_data[1]);
                }
              }
            }
          }

        }
        if (this.previewArray.matchlist_type == 2) {
          for (var i = 0; i < this.previewArray.item.length; i++) {
            if (this.previewArray.item[i].item_df_id == 9) {
              for (var j = 0; j < this.previewArray.item[i].data_format_value.length; j++) {
                if (this.previewArray.item[i].data_format_value[j].match_data[1].header != 1 && this.previewArray.item[i].data_format_value[j].match_data[0].match_value != 'abc') {
                  this.arrayToDrag.push(this.previewArray.item[i].data_format_value[j].match_data[1]);
                }
              }
            }
          }

        }
      } else {
        this.questionCount = 0;
        this.previewArray = this.viewItemQuestions[this.questionCount];
        if (this.previewArray.match_type == 3) {
          for (var i = 0; i < this.previewArray.item.length; i++) {
            if (this.previewArray.item[i].item_df_id == 9) {
              for (var j = 0; j < this.previewArray.item[i].data_format_value.length; j++) {
                if (this.previewArray.item[i].data_format_value[j].match_data[1].header != 1) {
                  this.arrayToDrag.push(this.previewArray.item[i].data_format_value[j].match_data[1]);
                }
              }
            }
          }

        }
        if (this.previewArray.match_type == 2) {
          for (var i = 0; i < this.previewArray.item.length; i++) {
            if (this.previewArray.item[i].item_df_id == 9) {
              for (var j = 0; j < this.previewArray.item[i].data_format_value.length; j++) {
                if (this.previewArray.item[i].data_format_value[j].match_data[1].header != 1 && this.previewArray.item[i].data_format_value[j].match_data[0].match_value != 'abc') {
                  this.arrayToDrag.push(this.previewArray.item[i].data_format_value[j].match_data[1]);
                }
              }
            }
          }

        }
      }
    }
  }

  // push match value into seperate array for drag and drop only for match type 2 and 3
  getPreviousQues() {
    if (this.authService.canActivate()) {
      this.arrayToDrag = [];
      this.questionCount = this.questionCount - 1;
      if (this.questionCount >= 0) {
        this.previewArray = this.viewItemQuestions[this.questionCount];
        if (this.previewArray.matchlist_type == 3) {
          for (var i = 0; i < this.previewArray.item.length; i++) {
            if (this.previewArray.item[i].item_df_id == 9) {
              for (var j = 0; j < this.previewArray.item[i].data_format_value.length; j++) {
                if (this.previewArray.item[i].data_format_value[j].match_data[1].header != 1) {
                  this.arrayToDrag.push(this.previewArray.item[i].data_format_value[j].match_data[1]);
                }
              }
            }
          }

        }
        if (this.previewArray.matchlist_type == 2) {
          for (var i = 0; i < this.previewArray.item.length; i++) {
            if (this.previewArray.item[i].item_df_id == 9) {
              for (var j = 0; j < this.previewArray.item[i].data_format_value.length; j++) {
                if (this.previewArray.item[i].data_format_value[j].match_data[1].header != 1 && this.previewArray.item[i].data_format_value[j].match_data[0].match_value != 'abc') {
                  this.arrayToDrag.push(this.previewArray.item[i].data_format_value[j].match_data[1]);
                }
              }
            }
          }

        }
      }
    }
  }

  closePreview() {
    if (this.authService.canActivate()) {
      this.showPreviewModal = false;

      // if(this.item_type == 2){
      //   for(var i=0;i<this.attributes.answer_choices.length;i++){
      //     if(this.attributes.answer_choices[i].correct_answer == true){
      //       this.attributes.answer_choices[i].correct_answer = true;
      //       this.TfOption = true;
      //     }
      //   }
      // }
      // this.attributes.directive =[];
      // this.attributes.directive.push(new itemList);
      // this.attributes.directive[0].item_df_id = 1;
      // this.attributes.directive[0].item_df_sequence = 1;
      // this.attributes.directive[0].data_format_value = "";
      // this.attributes.directive[0].data_identifier = "";
      // this.attributes.directive[0].previous_df_id = "";
    }
  }
  addCss(event) {
    event.target.classList.add('class3');
  }
  removeCss(event) {
    event.target.classList.remove('class3');
  }

  // directives - add item
  addItemDirective() {
    if (this.authService.canActivate()) {
      this.showIcon = true;
      this.disableMatchSelect = false;
      this.getDirectiveQuestion = true;
      this.activeMatchState = 0;
      this.activeIndex = 0;
      this.mcqBlk = true;
      this.selectedItemTypes = 'Multiple Choice';
      this.directiveBlk = false;
      this.viewItemBlk = false;
      this.item_type = 1;
      this.disableDirective = 'Directives';
      this.topicsList = [];
      this.subtopicList = [];
      this.selectedSub = [];
      this.selectedTopic = [];
      this.selectedSubtopic = [];
      this.difficulty_level = undefined;
      this.taxonomy = undefined;
      this.content_type = [];
      this.item_valid_till = null;
      this.explanation = "";
      this.hint = "";
      this.search_keywords = "";
      this.ref_link = "";
      this.attributes.item_id = null;
      this.attributes.item = [];
      this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });
      this.attributes.answer_choices = [];
      this.score = 1;
      this.attributes.score = 0;
      this.attributes.answer_choice_insight = null;
      this.attributes.data_insight = "";
      for (this.counter = 0; this.counter < 4; this.counter++) {
        this.attributes.answer_choices.push(new answerChoice());
        this.attributes.answer_choices[this.counter].choice_elements.push(new answerChoiceType());
        this.attributes.answer_choices[this.counter].choice_elements[0].option_df_sequence = 1;
        this.attributes.answer_choices[this.counter].choice_elements[0].data_format_value = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].data_identifier = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].previous_df_id = "";
        this.attributes.answer_choices[this.counter].score = 0;
        this.attributes.answer_choices[this.counter].answer_choice_insight = "";
        this.attributes.answer_choices[this.counter].data_insight = "";

        if(this.attributes.answer_choices[this.counter].answer_choice_insight === ""){
          this.attributes.answer_choices[this.counter].answer_choice_insight = null;
        }
        if(this.attributes.answer_choices[this.counter].data_insight === ""){
          this.attributes.answer_choices[this.counter].data_insight = null;
        }

      }
      this.showGradedScore = true;
      this.showGradedScore1 = true;
      this.attributes.answer_type = "Single Answer";
      this.attributes.score_type = "Item Lvl Score";
    }
    if (this.directive_id != '0' && this.directive_id != null) {
      this.saveload = true;
      var headers = new Headers()
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/directive_items/" + this.cookieService.get('_PAOID') + "/" + this.directive_id + "-@", { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
        data => {

          this.saveload = false;
          this.attributes.directive = data.content;
          for (var i = 0; i < data.attributes.subject.length; i++) {
            this.selectedSub.push(data.attributes.subject[i]);
            // this.getTopic(this.selectedSub);
          }
          this.getTopic(data.attributes.subject);
          this.topicsList = data.attributes.topic;

          this.topicsList = data.attributes.topic;
          for (var i = 0; i < data.attributes.topic.length; i++) {
            this.selectedTopic.push(data.attributes.topic[i]);
            // this.getSubtopic(this.selectedTopic)
          }
          this.getSubtopic(data.attributes.topic);
          this.subtopicList = data.attributes.subtopic;

          for (var i = 0; i < data.attributes.subtopic.length; i++) {
            this.selectedSubtopic.push(data.attributes.subtopic[i]);
          }
          this.difficulty_level = data.attributes.difficulty_level;
          this.taxonomy = data.attributes.taxonomy;

          if (data.attributes.item_valid_till != null) {
            var a = data.attributes.item_valid_till;
            var date1 = a.split('-');
            this.item_valid_till = { date: { year: +date1[0], month: +date1[1], day: +date1[2] } };
          } else {
            this.item_valid_till = data.attributes.item_valid_till;
          }

          if (data.attributes.content_type.length != 0) {
            var availableContenttype = [];
            for (var i = 0; i < data.attributes.content_type.length; i++) {
              this.content_type = data.attributes.content_type;
              this.content_type[i].id = data.attributes.content_type[i].UDF_Tag_ID;
              this.content_type[i].itemName = data.attributes.content_type[i].UDF_Tag;
              // data.attributes.content_type[i].checked = true;
              // this.content_type.push(data.attributes.content_type[i]);
              // availableContenttype.push(data.attributes.content_type[i].UDF_Tag_ID)
            }
          }
          // for(var j=0;j<this.contentType.length;j++){
          //   if(availableContenttype.includes(this.contentType[j].UDF_Tag_ID)){
          //     this.contentType[j].checked = true;
          //   }
          // }

          // for(var i=0;i<data.attributes.content_type.length;i++){
          //   this.content_type.push(data.attributes.content_type[i]);
          // }

          this.explanation = data.attributes.explanation;
          this.ref_link = data.attributes.ref_link;
          this.hint = data.attributes.hint;
          this.search_keywords = data.attributes.search_keywords;


        },
        error => {

          this.saveload = false;
          if (error.status == 404) {
            this.router.navigateByUrl('pages/NotFound');
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='https://accounts.scora.in';
          }
          else {
            this.router.navigateByUrl('pages/serverError');
          }

        }
        );
    }
  }
  getTenantMetaData(){
    this.saveload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +"/tenant_metadatas/"+ this.cookieService.get('_PAOID'),{headers : headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {

        this.saveload = false;

        this.tenantMetaData = data;
        var temp =  [];
        var temp1 = [];
        var temp2 = [];
        var temp3 = [];
        var temp4 = [];
        var temp5 = [];
        var temp6 = [];
        var temp7 = [];
        var temp8 = [];
        var temp9 = [];
        var temp10 = [];
        var temp11 = [];
        var temp12 = [];
        var temp13 = [];
        var temp14 = [];
        var temp15 = [];
        var temp16 = [];
        var temp17 = [];
        var temp18 = [];
        var temp19 = [];
        this.tenantMetaData.normal_metadatas
          temp = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 5);
          temp1 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 6);
          temp2 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 7);
          temp3 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 8);
          temp4 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 9);
          temp5 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 10);
          temp6 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 11);
          temp7 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 12);
          temp8 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 13);
          temp9 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 14);
          temp10 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 15);
          temp11 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 16);
          temp12 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 17);
          temp13 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 18);
          temp14 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 19);
          temp15 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 20);
          temp16 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 21);
          temp17 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 22);
          temp18 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 23);
          temp19 = this.tenantMetaData.normal_metadatas.filter(obj => obj.parameter_identifier === 24);
        

            // obj.parameter_identifier === 6  ||
            // obj.parameter_identifier === 7  ||
            // obj.parameter_identifier === 8  ||
            // obj.parameter_identifier === 9  ||          
            // obj.parameter_identifier === 10 ||
            // obj.parameter_identifier === 11 ||
            // obj.parameter_identifier === 12 ||
            // obj.parameter_identifier === 13 ||
            // obj.parameter_identifier === 14 ||
            // obj.parameter_identifier === 15 ||
            // obj.parameter_identifier === 16 ||
            // obj.parameter_identifier === 17 ||
            // obj.parameter_identifier === 18 ||
            // obj.parameter_identifier === 19 ||
            // obj.parameter_identifier === 20 ||
            // obj.parameter_identifier === 21 ||
            // obj.parameter_identifier === 22 ||
            // obj.parameter_identifier === 23 ||
            // obj.parameter_identifier === 24 

        
        this.tenenat_attr_label = temp;

        this.tenenat_attr_label1 = temp1;
        this.tenenat_attr_label2 = temp2;
        this.tenenat_attr_label3 = temp3;
        this.tenenat_attr_label4 = temp4;
        this.tenenat_attr_label5 = temp5;
        this.tenenat_attr_label6 = temp6;
        this.tenenat_attr_label7 = temp7;
        this.tenenat_attr_label8 = temp8;
        this.tenenat_attr_label9 = temp9;
        this.tenenat_attr_label10 = temp10;
        this.tenenat_attr_label11 = temp11;
        this.tenenat_attr_label12 = temp12;
        this.tenenat_attr_label13 = temp13;
        this.tenenat_attr_label14 = temp14;
        this.tenenat_attr_label15 = temp15;
        this.tenenat_attr_label16 = temp16;
        this.tenenat_attr_label17 = temp17;
        this.tenenat_attr_label18 = temp18;
        this.tenenat_attr_label19 = temp19;
       
      },

        error => {

          this.saveload= false;
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

  // exit directive function and make  MCQ active
  exitDirective() {
    if (this.authService.canActivate()) {
      this.showIcon = true;
      this.getDirectiveQuestion = false;
      localStorage.setItem('directive_id', '0');
      localStorage.setItem('item_count', '0');

      // for(var i=0;i<this.contentType.length;i++){
      //   this.contentType[i].checked = false;
      // }
      this.topErr = false;
      this.subErr = false;
      this.diffErr = false;
      this.taxErr = false;
      this.langErr = false;
      this.expErr = false;
      this.keyErr = false;
      this.errIndex = -1;
      this.ansIndex = -1;

      this.difficulty_level = undefined;
      this.taxonomy = undefined;
      this.item_valid_till = null;
      this.explanation = "";
      this.hint = "";
      this.search_keywords = "";
      this.ref_link = "";
      this.topicsList = [];
      this.subtopicList = [];
      this.selectedSub = [];
      this.selectedTopic = [];
      this.selectedSubtopic = [];
      this.difficulty_level = undefined;
      this.taxonomy = undefined;
      this.content_type = [];
      // for(var i=0;i<this.contentType.length;i++){
      //   this.contentType[i].checked = false;
      // }
      this.content1 = [];
      this.item_valid_till = null;
      this.explanation = "";
      this.hint = "";
      this.search_keywords = "";
      this.ref_link = "";
      this.disableDirective = -1;
      this.directive_id = 0;
      this.itemCount = 0;
      this.activeIndex = 0;
      this.activeMatchState = 0;
      this.mcqBlk = true;
      this.directiveBlk = false;
      this.viewItemBlk = false;
      this.item_type = 1;
      this.selectedItemTypes = 'Multiple Choice';
      this.isDirective = undefined;
      this.attributes.item = [];
      this.attributes.answer_choices = [];
      this.score = 1;
      this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });
      delete this.attributes.item_id;
      for (this.counter = 0; this.counter < 4; this.counter++) {
        this.attributes.answer_choices.push(new answerChoice());
        this.attributes.answer_choices[this.counter].choice_elements.push(new answerChoiceType());
        this.attributes.answer_choices[this.counter].choice_elements[0].option_df_sequence = 1;
        this.attributes.answer_choices[this.counter].choice_elements[0].data_format_value = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].data_identifier = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].previous_df_id = "";
        this.attributes.answer_choices[this.counter].score = 0;
        this.attributes.answer_choices[this.counter].answer_choice_insight = "";
        this.attributes.answer_choices[this.counter].data_insight = "";

        if(this.attributes.answer_choices[this.counter].answer_choice_insight === ""){
           this.attributes.answer_choices[this.counter].answer_choice_insight = null;
        }
        if(this.attributes.answer_choices[this.counter].data_insight === ""){
           this.attributes.answer_choices[this.counter].data_insight = null;
        }

      }
      this.showGradedScore = true;
      this.showGradedScore1 = true;
      this.attributes.answer_type = "Single Answer";
      this.attributes.score_type = "Item Lvl Score";
      if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 1 || this.pathDirect == 2) {
        this.router.navigate(['ItemSets/viewitemsets', this.itemset_id, this.section_id, this.pathDirect]);
      } else if (this.pathDirect == 7) {
        this.router.navigate(['Items/viewitems', this.bulkUploadId]);
      } else if (this.pathDirect == 8) {
        this.router.navigate(['Items/bulkuploadItems']);
      }else if(this.pathDirect == 14 || this.pathDirect == 13){
        this.router.navigate(['as-an-author/under-review', this.itemset_id, this.section_id, this.pathDirect])
      }else if(this.pathDirect == 11 || this.pathDirect == 12 || this.pathDirect == 20 || this.pathDirect == 19){
        this.router.navigate(['as-an-author/to-create', this.itemset_id, this.section_id, this.pathDirect])
      }
    }
  }

    // get directive based item
  viewItemDirective(id) {
    if (this.authService.canActivate()) {
      this.showIcon = true;
      this.getDirectiveQuestion = false;

      this.saveload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/directive_items/" + this.cookieService.get('_PAOID') + "/" + id, { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
        data => {
          this.saveload = false;
          this.selectedSub = [];
          this.selectedTopic = [];
          this.selectedSubtopic = [];
          this.topicsList = [];
          this.subtopicList = [];
          this.content1 = [];
          this.content_type = [];
          this.topErr = false;
          this.subErr = false;
          this.diffErr = false;
          this.taxErr = false;
          this.expErr = false;
          this.keyErr = false;
          this.saveload = true;
          this.difficulty_level = undefined;
          this.taxonomy = undefined;
          this.content_type = [];
          this.item_valid_till = null;
          this.explanation = "";
          this.hint = "";
          this.search_keywords = "";
          this.ref_link = "";

          this.saveload = false;
          this.viewItemQuestions = data;
          this.viewItemBlk = true;
          this.directiveBlk = false;
          this.mcqBlk = false;
          this.trueorfalseBlk = false;
          this.matchBlk = false;
          this.freeTextBlk = false;
          this.fileUploadBlk = false;
          this.showItem = 0;
          this.item_type_view = this.viewItemQuestions[0].item_type;
          this.itemId = this.viewItemQuestions[0].item_id;
          this.directive_id = localStorage.getItem('directive_id');
          for (var i = 0; i < this.viewItemQuestions[0].attributes.subject.length; i++) {
            this.selectedSub.push(this.viewItemQuestions[0].attributes.subject[i]);
            // this.getTopic(this.selectedSub);
          }
          this.getTopic(this.viewItemQuestions[0].attributes.subject);
          this.topicsList = this.viewItemQuestions[0].attributes.topic;

          for (var i = 0; i < this.viewItemQuestions[0].attributes.topic.length; i++) {
            this.selectedTopic.push(this.viewItemQuestions[0].attributes.topic[i]);
            // this.getSubtopic(this.selectedTopic)
          }
          this.getSubtopic(this.viewItemQuestions[0].attributes.topic);
          this.subtopicList = this.viewItemQuestions[0].attributes.subtopic;

          for (var i = 0; i < this.viewItemQuestions[0].attributes.subtopic.length; i++) {
            this.selectedSubtopic.push(this.viewItemQuestions[0].attributes.subtopic[i]);
          }
          this.difficulty_level = this.viewItemQuestions[0].attributes.difficulty_level;
          this.taxonomy = this.viewItemQuestions[0].attributes.taxonomy;

          if (this.viewItemQuestions[0].attributes.item_valid_till != null) {
            var a = this.viewItemQuestions[0].attributes.item_valid_till;
            var date1 = a.split('-');
            this.item_valid_till = { date: { year: +date1[0], month: +date1[1], day: +date1[2] } };
          } else {
            this.item_valid_till = this.viewItemQuestions[0].attributes.item_valid_till;
          }



          if (this.viewItemQuestions[0].attributes.content_type.length != 0) {
            var availableContenttype = [];
            for (var i = 0; i < this.viewItemQuestions[0].attributes.content_type.length; i++) {
              this.content_type = this.viewItemQuestions[0].attributes.content_type;
              this.content_type[i].id = this.viewItemQuestions[0].attributes.content_type[i].UDF_Tag_ID;
              this.content_type[i].itemName = this.viewItemQuestions[0].attributes.content_type[i].UDF_Tag;
              // this.viewItemQuestions[0].attributes.content_type[i].checked = true;
              // this.content_type.push(this.viewItemQuestions[0].attributes.content_type[i]);
              // availableContenttype.push(this.viewItemQuestions[0].attributes.content_type[i].UDF_Tag_ID)
            }
          }
          // for(var j=0;j<this.contentType.length;j++){
          //   if(availableContenttype.includes(this.contentType[j].UDF_Tag_ID)){
          //     this.contentType[j].checked = true;
          //   }
          // }

          this.explanation = this.viewItemQuestions[0].attributes.explanation;
          this.ref_link = this.viewItemQuestions[0].attributes.ref_link;
          this.hint = this.viewItemQuestions[0].attributes.hint;
          this.search_keywords = this.viewItemQuestions[0].attributes.search_keywords;
          for (var i = 0; i < this.viewItemQuestions[0].answer_choices.length; i++) {
            this.viewItemQuestions[0].answer_choices[i].label = String.fromCharCode(97 + i);
          }

          // directive items render
          // ques block
          for(var v=0;v<this.viewItemQuestions.length;v++){
            if(this.viewItemQuestions[v].item_type !=6){
              for (var i1 = 0; i1 < this.viewItemQuestions[v].item.length; i1++) {
                if(this.viewItemQuestions[v].item[i1].item_df_id == 1){
                  var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.viewItemQuestions[v].item[i1].data_format_value);
                  this.viewItemQuestions[v].item[i1].data_format_value = changeRTEFormatAns;
                }
              }

              // answer block
              if(this.viewItemQuestions[v].item_type == 1){
                for(var a1=0;a1<this.viewItemQuestions[v].answer_choices.length;a1++){
                  for(var c=0;c<this.viewItemQuestions[v].answer_choices[a1].choice_elements.length;c++){
                    if(this.viewItemQuestions[v].answer_choices[a1].choice_elements[c].answer_df_id == 1){
                      var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.viewItemQuestions[v].answer_choices[a1].choice_elements[c].data_format_value);
                      this.viewItemQuestions[v].answer_choices[a1].choice_elements[c].data_format_value = changeRTEFormatAns;
                    }
                  }
                }
              }else if(this.viewItemQuestions[v].item_type == 3 && this.viewItemQuestions[v].matchlist_type == 5){
                for(var ma=0;ma<this.viewItemQuestions[v].answer_choices.length;ma++){
                if(this.viewItemQuestions[v].answer_choices[ma].answer_df_id == 1){
                    var changeRTEFormatAns = this.sanitizer.bypassSecurityTrustHtml(this.viewItemQuestions[v].answer_choices[ma].data_format_value);
                    this.viewItemQuestions[v].answer_choices[ma].data_format_value = changeRTEFormatAns;
                  }
                }
              }
            }
          }
        },
        error => {

          this.saveload = false;
          if (error.status == 404) {
            this.router.navigateByUrl('pages/NotFound');
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='https://accounts.scora.in';
          }
          else {
            this.router.navigateByUrl('pages/serverError');
          }

        }
        );
    }
  }

  add_description(index, template: TemplateRef<any>, data){
    this.answer_Option_data = data;
    this.answer_Option_Index = index + 1;

      //  alert(this.answer_Option_data)

      this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: ' modal-sm' }, this.config),

    );
  }

  // get directive block item
  goToDirective() {
    if (this.authService.canActivate()) {
      this.showIcon = true;
      this.attributes.directive = [];
      this.attributes.directive.push(new itemList);
      this.attributes.directive[0].item_df_id = 1;
      this.attributes.directive[0].item_df_sequence = 1;
      this.attributes.directive[0].data_format_value = "";
      this.attributes.directive[0].data_identifier = "";
      this.attributes.directive[0].previous_df_id = "";

      this.disableDirective = -1;
      this.getDirectiveQuestion = true;
      this.attributes.answer_choices = [];
      this.item_type = 6;
      this.activeIndex = 3;
      this.activeMatchState = 0;
      this.trueorfalseBlk = false;
      this.mcqBlk = false;
      this.matchBlk = false;
      this.freeTextBlk = false;
      this.directiveBlk = true;
      this.fileUploadBlk = false;
      this.viewItemBlk = false;
      this.topicsList = [];
      this.subtopicList = [];
      this.selectedSub = [];
      this.selectedTopic = [];
      this.selectedSubtopic = [];
      this.difficulty_level = undefined;
      this.taxonomy = undefined;
      this.content_type = [];
      this.content1 = [];
      // for(var i=0;i<this.contentType.length;i++){
      //   this.contentType[i].checked = false;
      // }
      this.item_valid_till = null;
      this.explanation = "";
      this.hint = "";
      this.search_keywords = "";
      this.ref_link = "";

      if (this.showDirectiveInEdit == true) {
        this.saveload = true;
        var headers = new Headers()
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        this.http.get(credentials.host + "/directive_items/" + this.cookieService.get('_PAOID') + "/" + this.directive_id + "-@", { headers: headers })
          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
          data => {

            this.saveload = false;
            this.attributes.directive = data.content;
            for (var i = 0; i < data.attributes.subject.length; i++) {
              this.selectedSub.push(data.attributes.subject[i]);
              // this.getTopic(this.selectedSub);
            }
              this.getTopic( data.attributes.subject);
              this.topicsList =  data.attributes.topic;

            for (var i = 0; i < data.attributes.topic.length; i++) {
              this.selectedTopic.push(data.attributes.topic[i]);
              // this.getSubtopic(this.selectedTopic)
            }
            this.getSubtopic(data.attributes.topic);
            this.subtopicList =  data.attributes.subtopic;

            for (var i = 0; i < data.attributes.subtopic.length; i++) {
              this.selectedSubtopic.push(data.attributes.subtopic[i]);
            }
            this.difficulty_level = data.attributes.difficulty_level;
            this.taxonomy = data.attributes.taxonomy;

            if (data.attributes.item_valid_till != null) {
              var a = data.attributes.item_valid_till;
              var date1 = a.split('-');
              this.item_valid_till = { date: { year: +date1[0], month: +date1[1], day: +date1[2] } };
            } else {
              this.item_valid_till = data.attributes.item_valid_till;
            }
            if (data.attributes.content_type.length != 0) {
              var availableContenttype = [];
              for (var i = 0; i < data.attributes.content_type.length; i++) {
                this.content_type = data.attributes.content_type;
                this.content_type[i].id = data.attributes.content_type[i].UDF_Tag_ID;
                this.content_type[i].itemName = data.attributes.content_type[i].UDF_Tag;
                // data.attributes.content_type[i].checked = true;
                // this.content_type.push(data.attributes.content_type[i]);
                // availableContenttype.push(data.attributes.content_type[i].UDF_Tag_ID)
              }
            }
            // for(var j=0;j<this.contentType.length;j++){
            //   if(availableContenttype.includes(this.contentType[j].UDF_Tag_ID)){
            //     this.contentType[j].checked = true;
            //   }
            // }

            // for(var i=0;i<data.attributes.content_type.length;i++){
            //   this.content_type.push(data.attributes.content_type[i]);
            // }

            this.explanation = data.attributes.explanation;
            this.ref_link = data.attributes.ref_link;
            this.hint = data.attributes.hint;
            this.search_keywords = data.attributes.search_keywords;


          },
          error => {

            this.saveload = false;
            if (error.status == 404) {
              this.router.navigateByUrl('pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='https://accounts.scora.in';
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }

          }
          );
      }
    }
  }

  // this is to change next item in view directive item preview
  showQues(index) {
    if (this.authService.canActivate()) {

      this.selectedSub = [];
      this.selectedTopic = [];
      this.selectedSubtopic = [];
      this.content_type = [];
      // for(var i=0;i<this.contentType.length;i++){
      //   this.contentType[i].checked = false;
      // }
      this.content1 = [];
      this.content_type = [];
      this.topErr = false;
      this.subErr = false;
      this.diffErr = false;
      this.taxErr = false;
      this.expErr = false;
      this.keyErr = false;

      this.item_type_view = this.viewItemQuestions[index].item_type;
      this.itemId = this.viewItemQuestions[index].item_id;
      for (var i = 0; i < this.viewItemQuestions[index].attributes.subject.length; i++) {
        this.selectedSub.push(this.viewItemQuestions[index].attributes.subject[i]);
        // this.getTopic(this.selectedSub);
      }
      this.getTopic(this.viewItemQuestions[index].attributes.subject);
      this.topicsList = this.viewItemQuestions[index].attributes.topic;

      for (var i = 0; i < this.viewItemQuestions[index].attributes.topic.length; i++) {
        this.selectedTopic.push(this.viewItemQuestions[index].attributes.topic[i]);
        // this.getSubtopic(this.selectedTopic);
      }
      this.getSubtopic(this.viewItemQuestions[index].attributes.topic);
      this.subtopicList = this.viewItemQuestions[index].attributes.subtopic;

      for (var i = 0; i < this.viewItemQuestions[index].attributes.subtopic.length; i++) {
        this.selectedSubtopic.push(this.viewItemQuestions[index].attributes.subtopic[i]);
      }
      this.difficulty_level = this.viewItemQuestions[index].attributes.difficulty_level;
      this.taxonomy = this.viewItemQuestions[index].attributes.taxonomy;
      this.item_valid_till = this.viewItemQuestions[index].attributes.item_valid_till;


      if (this.viewItemQuestions[index].attributes.content_type.length != 0) {
        var availableContenttype = [];
        for (var k = 0; k < this.viewItemQuestions[index].attributes.content_type.length; k++) {
          this.content_type = this.viewItemQuestions[index].attributes.content_type;
          this.content_type[k].id = this.viewItemQuestions[index].attributes.content_type[k].UDF_Tag_ID;
          this.content_type[k].itemName = this.viewItemQuestions[index].attributes.content_type[k].UDF_Tag;
          // this.viewItemQuestions[index].attributes.content_type[k].checked = true;
          // this.content_type.push(this.viewItemQuestions[index].attributes.content_type[k]);
          // availableContenttype.push(this.viewItemQuestions[index].attributes.content_type[k].UDF_Tag_ID)
        }
        // for(var j=0;j<this.contentType.length;j++){
        //   if(availableContenttype.includes(this.contentType[j].UDF_Tag_ID)){
        //     this.contentType[j].checked = true;
        //   }
        // }
      }

      this.explanation = this.viewItemQuestions[index].attributes.explanation;
      this.ref_link = this.viewItemQuestions[index].attributes.ref_link;
      this.hint = this.viewItemQuestions[index].attributes.hint;
      this.search_keywords = this.viewItemQuestions[index].attributes.search_keywords;

      for (var i = 0; i < this.viewItemQuestions[index].answer_choices.length; i++) {
        this.viewItemQuestions[index].answer_choices[i].label = String.fromCharCode(97 + i)
      }
      if (this.viewItemQuestions[index].attributes.item_valid_till != null) {
        var a = this.viewItemQuestions[index].attributes.item_valid_till;
        this.date1 = a.split('-');
        this.item_valid_till = { date: { year: +this.date1[0], month: +this.date1[1], day: +this.date1[2] } };

      } else {
        this.item_valid_till = this.viewItemQuestions[index].attributes.item_valid_till;
      }


    }
    this.showItem = index;
  }

  // edit each item
  editItemDirective(seq,key) {
    if (this.authService.canActivate()) {
      this.showIcon = true;

      this.topicsList = [];
      this.subtopicList = [];
      this.selectedSub = [];
      this.selectedTopic = [];
      this.selectedSubtopic = [];
      this.difficulty_level = undefined;
      this.taxonomy = undefined;
      this.content_type = [];
      this.content1 = [];
      this.item_valid_till = null;
      this.explanation = "";
      this.hint = "";
      this.search_keywords = "";
      this.ref_link = "";
      // this.attributes.directive = [];
      for (var i = 0; i < this.viewItemQuestions[seq].attributes.subject.length; i++) {
        this.selectedSub.push(this.viewItemQuestions[seq].attributes.subject[i]);
        // this.getTopic(this.selectedSub);
      }
      this.getTopic(this.viewItemQuestions[seq].attributes.subject);
      this.topicsList = this.viewItemQuestions[seq].attributes.topic;

      for (var i = 0; i < this.viewItemQuestions[seq].attributes.topic.length; i++) {
        this.selectedTopic.push(this.viewItemQuestions[seq].attributes.topic[i]);
        // this.getSubtopic(this.selectedTopic);
      }
      this.getSubtopic(this.viewItemQuestions[seq].attributes.topic);
      this.subtopicList = this.viewItemQuestions[seq].attributes.subtopic;

      for (var i = 0; i < this.viewItemQuestions[seq].attributes.subtopic.length; i++) {
        this.selectedSubtopic.push(this.viewItemQuestions[seq].attributes.subtopic[i]);
      }
      this.difficulty_level = this.viewItemQuestions[seq].attributes.difficulty_level;
      this.taxonomy = this.viewItemQuestions[seq].attributes.taxonomy;
      this.item_valid_till = this.viewItemQuestions[seq].attributes.item_valid_till;

      if (this.viewItemQuestions[seq].attributes.content_type.length != 0) {
        var availableContenttype = [];
        for (var i = 0; i < this.viewItemQuestions[seq].attributes.content_type.length; i++) {
          this.content_type = this.viewItemQuestions[seq].attributes.content_type;
          this.content_type[i].id = this.viewItemQuestions[seq].attributes.content_type[i].UDF_Tag_ID;
          this.content_type[i].itemName = this.viewItemQuestions[seq].attributes.content_type[i].UDF_Tag;
          // this.viewItemQuestions[seq].attributes.content_type[i].checked = true
          // this.content_type.push(this.viewItemQuestions[seq].attributes.content_type[i]);
          // availableContenttype.push(this.viewItemQuestions[seq].attributes.content_type[i].UDF_Tag_ID)
        }

        // for(j=0;j<this.contentType.length;j++){
        //   if(availableContenttype.includes(this.contentType[j].UDF_Tag_ID)){
        //     this.contentType[j].checked = true;
        //   }
        // }
      }

      if(this.viewItemQuestions[seq].item_edit == true){
        this.showSaveASBtnFlag = true;
      }else{
        this.showSaveASBtnFlag = false;
      }


      this.explanation = this.viewItemQuestions[seq].attributes.explanation;
      this.ref_link = this.viewItemQuestions[seq].attributes.ref_link;
      this.hint = this.viewItemQuestions[seq].attributes.hint;
      this.search_keywords = this.viewItemQuestions[seq].attributes.search_keywords;

      if (this.viewItemQuestions[seq].attributes.item_valid_till != null) {
        var a = this.viewItemQuestions[seq].attributes.item_valid_till;
        this.date1 = a.split('-');
        this.item_valid_till = { date: { year: +this.date1[0], month: +this.date1[1], day: +this.date1[2] } };
      } else {
        this.item_valid_till = this.viewItemQuestions[seq].attributes.item_valid_till;
      }

      // remove rendered element
      if(key == 'DirectiveRenderedItems'){
        for(var i=0;i<this.viewItemQuestions[seq].item.length;i++){
          if(this.viewItemQuestions[seq].item[i].item_df_id == 1){
            this.viewItemQuestions[seq].item[i].data_format_value = this.viewItemQuestions[seq].item[i].data_format_value.changingThisBreaksApplicationSecurity;
          }

        }
        if(this.viewItemQuestions[seq].item_type == 1){
          for(var a1=0;a1<this.viewItemQuestions[seq].answer_choices.length;a1++){
            for(var b=0;b<this.viewItemQuestions[seq].answer_choices[a1].choice_elements.length;b++){
              if(this.viewItemQuestions[seq].answer_choices[a1].choice_elements[b].answer_df_id == 1 ){
                this.viewItemQuestions[seq].answer_choices[a1].choice_elements[b].data_format_value = this.viewItemQuestions[seq].answer_choices[a1].choice_elements[b].data_format_value.changingThisBreaksApplicationSecurity;
              }
            }
          }
        }else if(this.viewItemQuestions[seq].item_type == 3 && this.viewItemQuestions[seq].matchlist_type == 5){
          for(var a1=0;a1<this.viewItemQuestions[seq].answer_choices.length;a1++){
            if(this.viewItemQuestions[seq].answer_choices[a1].answer_df_id == 1){
              this.viewItemQuestions[seq].answer_choices[a1].data_format_value = this.viewItemQuestions[seq].answer_choices[a1].data_format_value.changingThisBreaksApplicationSecurity;
            }
          }
        }
      }



      // mcq
      if (this.viewItemQuestions[seq].item_type == 1) {
        if (this.pathDirect == 3 || this.pathDirect == 4  || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
          this.attributes.item = [];
          this.attributes.answer_choices = [];
        }


        this.selectedItemTypes = "Multiple Choice";
        this.attributes.item = this.viewItemQuestions[seq].item;

        this.attributes.answer_choices = this.viewItemQuestions[seq].answer_choices;
        this.isDirective = this.viewItemQuestions[seq].is_directive;
        this.attributes.score_type = this.viewItemQuestions[seq].score_type;
        this.attributes.directive_id = this.viewItemQuestions[seq].directive_id;
        this.directive_id = this.viewItemQuestions[seq].directive_id;

        if (this.isDirective != 0) {
          this.disableDirective = 'Directives';
        }
        if (this.attributes.directive_id != 0) {
          this.getDirectiveQuestion = true;
        }
        this.attributes.item_id = this.viewItemQuestions[seq].item_id
        this.score = this.viewItemQuestions[seq].score;

        if (this.viewItemQuestions[seq].answer_type == "Single Answer") {
          this.selectType = "Single Correct Answer"
          this.selectedType = false;
        } else {
          this.selectType = this.viewItemQuestions[seq].answer_type;
          this.selectedType = true;
        }
        if (this.viewItemQuestions[seq].score_type == "Graded Score") {
          this.enableToggle = true;
          this.enableToggleMatch = true;
          this.showGradedScore = false;
          this.showGradedScore1 = false;
        } else {
          this.enableToggle = false;
          this.enableToggleMatch = false;
          this.showGradedScore = true;
          this.showGradedScore1 = true;
        }
        this.attributes.answer_type = this.viewItemQuestions[seq].answer_type;
        this.attributes.itemset_item_id = this.viewItemQuestions[seq].itemset_item_id;
        this.attributes.itemset_item_refer_id = this.viewItemQuestions[seq].item_ref_id;
        this.mcqBlk = true;
        this.item_type = 1;
        this.activeIndex = 0;
        this.matchBlk = false;
        this.freeTextBlk = false;
        this.directiveBlk = false;
        this.trueorfalseBlk = false;
        this.viewItemBlk = false;
        this.fileUploadBlk = false;
      }
      // true or false
      if (this.viewItemQuestions[seq].item_type == 2) {
        if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
          this.attributes.item = [];
          this.attributes.answer_choices = [];
        }
        this.selectedItemTypes = "True or False";
        this.attributes.item = this.viewItemQuestions[seq].item;
        this.attributes.answer_choices = this.viewItemQuestions[seq].answer_choices;
        if (this.viewItemQuestions[seq].score_type == "Graded Score") {
          this.enableToggle = true;
          this.enableToggleMatch = true;
          this.showGradedScore = false;
          this.showGradedScore1 = false;
        } else {
          this.enableToggle = true;
          this.enableToggleMatch = false;
          this.showGradedScore = true;
          this.showGradedScore1 = true;
        }
        this.attributes.score_type = this.viewItemQuestions[seq].score_type;
        this.attributes.directive_id = this.viewItemQuestions[seq].directive_id;
        this.directive_id = this.viewItemQuestions[seq].directive_id;
        this.isDirective = this.viewItemQuestions[seq].is_directive;

        if (this.isDirective != 0) {
          this.disableDirective = 'Directives';
        }
        if (this.attributes.directive_id != 0) {
          this.getDirectiveQuestion = true;
        }
        this.attributes.item_id = this.viewItemQuestions[seq].item_id
        this.score = this.viewItemQuestions[seq].score;

        this.attributes.answer_type = this.viewItemQuestions[seq].answer_type;
        this.attributes.itemset_item_id = this.viewItemQuestions[seq].itemset_item_id;
        this.attributes.itemset_item_refer_id = this.viewItemQuestions[seq].item_ref_id;
        this.mcqBlk = false;
        this.item_type = 2;
        this.activeIndex = 1;
        this.matchBlk = false;
        this.freeTextBlk = false;
        this.directiveBlk = false;
        this.trueorfalseBlk = true;
        this.viewItemBlk = false;
        this.fileUploadBlk = false;
      }
      // match
      if (this.viewItemQuestions[seq].item_type == 3) {
        if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
          this.attributes.item = [];
          this.attributes.answer_choices = [];
        }
        this.selectedItemTypes = "Match";
        var tempMatchdata = this.viewItemQuestions[seq].item;
        for (var i = 0; i < tempMatchdata.length; i++) {
          if (tempMatchdata[i].item_df_id == 9) {
            for (var j = 0; j < tempMatchdata[i].data_format_value.length; j++) {
              var firstObj = tempMatchdata[i].data_format_value[j].match_data[0];
              var secondObj = tempMatchdata[i].data_format_value[j].match_data[1];
              var firstArrayObj = Array();
              var secondArrayObj = Array();
              firstArrayObj.push(firstObj);
              secondArrayObj.push(secondObj);
              tempMatchdata[i].data_format_value[j].match_data = [];

              tempMatchdata[i].data_format_value[j].match_data.push(new matchArray());
              tempMatchdata[i].data_format_value[j].match_data.push(new matchArray());
              tempMatchdata[i].data_format_value[j].match_data[0].matchValueArray = firstArrayObj;
              tempMatchdata[i].data_format_value[j].match_data[1].matchValueArray = secondArrayObj;
              if (tempMatchdata[i].data_format_value[j].match_data[0].matchValueArray[0].match_value == 'abc') {
                tempMatchdata[i].data_format_value[j].match_data[1].matchValueArray[0].hiddenObj = true;
              }
            }
          }
        }

        this.attributes.item = tempMatchdata;

        this.attributes.answer_choices = this.viewItemQuestions[seq].answer_choices;
        this.attributes.itemset_item_id = this.viewItemQuestions[seq].itemset_item_id;
        this.attributes.itemset_item_refer_id = this.viewItemQuestions[seq].item_ref_id;

        this.attributes.score_type = this.viewItemQuestions[seq].score_type;
        this.attributes.directive_id = this.viewItemQuestions[seq].directive_id;
        this.directive_id = this.viewItemQuestions[seq].directive_id;
        this.isDirective = this.viewItemQuestions[seq].is_directive;

        if (this.isDirective != 0) {
          this.disableDirective = 'Directives';
        }
        if (this.attributes.directive_id != 0) {
          this.getDirectiveQuestion = true;
        }
        this.attributes.item_id = this.viewItemQuestions[seq].item_id
        this.score = this.viewItemQuestions[seq].score;

        if (this.viewItemQuestions[seq].answer_type == "Single Answer") {
          this.selectType = "Single Correct Answer"
          this.selectedType = false;
        } else {
          this.selectType = this.viewItemQuestions[seq].answer_type;
          this.selectedType = true;
        }

        this.attributes.answer_type = this.viewItemQuestions[seq].answer_type;
        this.mcqBlk = false;
        this.item_type = 3;
        for (var i = 0; i < this.viewItemQuestions[seq].item.length; i++) {
          if (this.viewItemQuestions[seq].item[i].item_df_id == 9) {
            this.matchtypeSelected = this.viewItemQuestions[seq].item[i].matchlist_type;


          }
        }
        if (this.viewItemQuestions[seq].score_type == "Graded Score") {
          this.enableToggle = true;
          this.enableToggleMatch = true;
          this.showGradedScore = false;
          if (this.matchtypeSelected <= 3) {
            this.showGradedScore1 = false;
          } else {
            this.showGradedScore1 = true;
          }
        } else {
          this.enableToggle = false;
          this.enableToggleMatch = false;
          this.showGradedScore = true;

          this.showGradedScore1 = true;

        }
        //matrix type
        if (this.matchtypeSelected == 4) {
          this.matrixAnsBlock = [];
          for (this.counter = 0; this.counter < this.viewItemQuestions[seq].answer_choices.length; this.counter++) {
            var dataSplit = this.viewItemQuestions[seq].answer_choices[this.counter].data_format_value.split(',');
            this.matrixAnsBlock.push(new ansType());
            for (var j = 0; j < dataSplit.length; j++) {
              this.matrixAnsBlock[this.counter].answer_choices.push(new answerList());
              this.matrixAnsBlock[this.counter].answer_choices[j].data_format_value = dataSplit[j];
              this.matrixAnsBlock[this.counter].answer_choices[j].option_df_sequence = this.viewItemQuestions[seq].answer_choices[this.counter].option_df_sequence;
              this.matrixAnsBlock[this.counter].answer_choices[j].data_identifier = this.viewItemQuestions[seq].answer_choices[this.counter].data_identifier;
              this.matrixAnsBlock[this.counter].score = this.viewItemQuestions[seq].answer_choices[this.counter].score ? this.viewItemQuestions[seq].answer_choices[this.counter].score : 0;

              this.matrixAnsBlock[this.counter].answer_choices[j].label = String.fromCharCode(65 + j);
              this.matrixAnsBlock[this.counter].answer_choices[j].previous_df_id = this.viewItemQuestions[seq].answer_choices[this.counter].previous_df_id;
              this.matrixAnsBlock[this.counter].answer_choices[j].answer_choice_id = this.viewItemQuestions[seq].answer_choices[this.counter].answer_choice_id;
              this.matrixAnsBlock[this.counter].answer_choices[j].answer_df_id = this.viewItemQuestions[seq].answer_choices[this.counter].answer_df_id;
              this.matrixAnsBlock[this.counter].answer_choices[j].data_id = this.viewItemQuestions[seq].answer_choices[this.counter].data_id;
            }
            this.matrixAnsBlock[this.counter].correct_answer = this.viewItemQuestions[seq].answer_choices[this.counter].correct_answer;
            // this.matrixAnsBlock[this.counter].score = 0;
          }

        }

        if (this.matchtypeSelected == 5) {
          var exactMatchArray = [];
          this.attributes.answer_choices = [];
          for (var i = 0; i < this.viewItemQuestions[seq].answer_choices.length; i++) {

            this.attributes.answer_choices.push(new exactMatchType());
            var singleChoiceArray = Array();
            singleChoiceArray.push(this.viewItemQuestions[seq].answer_choices[i]);

            this.attributes.answer_choices[i].choiceElement = singleChoiceArray;

          }

        }

        this.activeIndex = 2;
        this.matchBlk = true;
        this.freeTextBlk = false;
        this.directiveBlk = false;
        this.trueorfalseBlk = false;
        this.viewItemBlk = false;
        this.fileUploadBlk = false;
      }
      // directive
      if (this.viewItemQuestions[seq].item_type == 6) {
        if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 14) {
          this.attributes.item = [];
          this.attributes.answer_choices = [];
        }
        this.selectedItemTypes = "Directives";
        this.showDirectiveInEdit = true;
        this.mcqBlk = false;
        this.item_type = 6;
        this.activeIndex = 3;
        this.matchBlk = false;
        this.freeTextBlk = false;
        this.directiveBlk = true;
        this.fileUploadBlk = false;
        this.trueorfalseBlk = false;
        this.viewItemBlk = false;
        this.getDirectiveQuestion = false;
        this.attributes.item_id = '';
        this.attributes.directive = this.viewItemQuestions[seq].directive_content;
        this.directive_id = this.viewItemQuestions[seq].directive_id;
        this.attributes.directive_id = this.viewItemQuestions[seq].directive_id;
        // localStorage.setItem('directive_id',this.viewItemQuestions[seq].directive_id);
        this.itemCount = this.viewItemQuestions[seq].directive_items_count;
        // localStorage.setItem('item_count', this.viewItemQuestions[seq].directive_items_count);
        this.attributes.itemset_item_id = this.viewItemQuestions[seq].itemset_item_id;
        this.attributes.itemset_item_refer_id = this.viewItemQuestions[seq].item_ref_id;
      }
      // free text
      if(this.viewItemQuestions[seq].item_type == 5){
        if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
          this.attributes.item = [];
          this.attributes.answer_choices = [];
        }


        this.selectedItemTypes = "Free Text";
        this.attributes.item = this.viewItemQuestions[seq].item;

        this.attributes.answer_choices = this.viewItemQuestions[seq].answer_choices;
        if(this.attributes.answer_choices.length == 2){
          this.attributes.answer_choices.push({answer_data: '', answer_choice_id: this.attributes.item.length+1, score: 0})
        }
        this.isDirective = this.viewItemQuestions[seq].is_directive;
        this.attributes.score_type = this.viewItemQuestions[seq].score_type;
        this.attributes.directive_id = this.viewItemQuestions[seq].directive_id;
        this.directive_id = this.viewItemQuestions[seq].directive_id;

        if (this.isDirective != 0) {
          this.disableDirective = 'Directives';
        }
        if (this.attributes.directive_id != 0) {
          this.getDirectiveQuestion = true;
        }
        this.attributes.item_id = this.viewItemQuestions[seq].item_id
        this.score = this.viewItemQuestions[seq].score;

        if (this.viewItemQuestions[seq].answer_type == "Single Answer") {
          this.selectType = "Single Correct Answer"
          this.selectedType = false;
        } else {
          this.selectType = this.viewItemQuestions[seq].answer_type;
          this.selectedType = true;
        }
        if (this.viewItemQuestions[seq].score_type == "Graded Score") {
          this.enableToggle = true;
          this.enableToggleMatch = true;
          this.showGradedScore = false;
          this.showGradedScore1 = false;
        } else {
          this.enableToggle = false;
          this.enableToggleMatch = false;
          this.showGradedScore = true;
          this.showGradedScore1 = true;
        }
        this.attributes.answer_type = this.viewItemQuestions[seq].answer_type;
        this.attributes.itemset_item_id = this.viewItemQuestions[seq].itemset_item_id;
        this.attributes.itemset_item_refer_id = this.viewItemQuestions[seq].item_ref_id;
        this.mcqBlk = false;
        this.item_type = 5;
        this.activeIndex = 4;
        this.matchBlk = false;
        this.directiveBlk = false;
        this.trueorfalseBlk = false;
        this.viewItemBlk = false;
        this.freeTextBlk = true;
        this.fileUploadBlk = false;
      }
      // file upload
      if(this.viewItemQuestions[seq].item_type == 7){
        if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
          this.attributes.item = [];
          this.attributes.answer_choices = [];
        }


        this.selectedItemTypes = "File Upload";
        this.attributes.item = this.viewItemQuestions[seq].item;

        this.attributes.answer_choices = this.viewItemQuestions[seq].answer_choices;


        this.FileFormatList = this.fileMetaDataTypeList;

        for(var i=0;i<this.attributes.answer_choices.length;i++){
          var tempfileList =[];
          var tempFormatList = [];
          for(var d=0;d<this.attributes.answer_choices[i].data_format_type.length;d++){


            switch(this.attributes.answer_choices[i].data_format_type[d].file_type){

              case 'Document':
                tempfileList =  tempfileList.concat(this.fileMetaDataTypeList.filter(
                file =>file.itemName === this.attributes.answer_choices[i].data_format_type[d].file_type));

                tempFormatList =  tempFormatList.concat(this.FileFormatListMetaData.filter(
                  file =>file.file_type === this.attributes.answer_choices[i].data_format_type[d].file_type));
                  this.attributes.answer_choices[i].fileFormatLits =_.uniq(tempfileList) ;
                  this.attributes.answer_choices[i].fileTypeList = _.uniq(tempFormatList);
              break;
              case 'Image':
                tempfileList = tempfileList.concat(this.fileMetaDataTypeList.filter(
                file => file.itemName === this.attributes.answer_choices[i].data_format_type[d].file_type));

                tempFormatList =  tempFormatList.concat(this.FileFormatListMetaData.filter(
                  file =>file.file_type === this.attributes.answer_choices[i].data_format_type[d].file_type));
                  this.attributes.answer_choices[i].fileFormatLits =_.uniq(tempfileList);
                  this.attributes.answer_choices[i].fileTypeList = _.uniq(tempFormatList);
                break;
              case 'Audio':
                tempfileList = tempfileList.concat(this.fileMetaDataTypeList.filter(
                file => file.itemName === this.attributes.answer_choices[i].data_format_type[d].file_type));

                tempFormatList =  tempFormatList.concat(this.FileFormatListMetaData.filter(
                  file =>file.file_type === this.attributes.answer_choices[i].data_format_type[d].file_type));
                  this.attributes.answer_choices[i].fileFormatLits =_.uniq(tempfileList);
                  this.attributes.answer_choices[i].fileTypeList = _.uniq(tempFormatList);
                break;
              case 'Video':
                tempfileList = tempfileList.concat(this.fileMetaDataTypeList.filter(
                file => file.itemName === this.attributes.answer_choices[i].data_format_type[d].file_type));

                tempFormatList =  tempFormatList.concat(this.FileFormatListMetaData.filter(
                  file =>file.file_type === this.attributes.answer_choices[i].data_format_type[d].file_type));
                  this.attributes.answer_choices[i].fileFormatLits =_.uniq(tempfileList);
                  this.attributes.answer_choices[i].fileTypeList = _.uniq(tempFormatList);
                break;
            }

          }



        }


        this.isDirective = this.viewItemQuestions[seq].is_directive;
        this.attributes.score_type = this.viewItemQuestions[seq].score_type;
        this.attributes.directive_id = this.viewItemQuestions[seq].directive_id;
        this.directive_id = this.viewItemQuestions[seq].directive_id;

        if (this.isDirective != 0) {
          this.disableDirective = 'Directives';
        }
        if (this.attributes.directive_id != 0) {
          this.getDirectiveQuestion = true;
        }
        this.attributes.item_id = this.viewItemQuestions[seq].item_id
        this.score = this.viewItemQuestions[seq].score;

        if (this.viewItemQuestions[seq].answer_type == "Single Answer") {
          this.selectType = "Single Correct Answer"
          this.selectedType = false;
        } else {
          this.selectType = this.viewItemQuestions[seq].answer_type;
          this.selectedType = true;
        }
        if (this.viewItemQuestions[seq].score_type == "Graded Score") {
          this.enableToggle = true;
          this.enableToggleMatch = true;
          this.showGradedScore = false;
          this.showGradedScore1 = false;
        } else {
          this.enableToggle = false;
          this.enableToggleMatch = false;
          this.showGradedScore = true;
          this.showGradedScore1 = true;
        }
        this.attributes.answer_type = this.viewItemQuestions[seq].answer_type;
        this.attributes.itemset_item_id = this.viewItemQuestions[seq].itemset_item_id;
        this.attributes.itemset_item_refer_id = this.viewItemQuestions[seq].item_ref_id;
        this.mcqBlk = false;
        this.item_type = 7;
        this.activeIndex = 5;
        this.matchBlk = false;
        this.directiveBlk = false;
        this.trueorfalseBlk = false;
        this.viewItemBlk = false;
        this.freeTextBlk = false;
        this.fileUploadBlk = true;
      }
    }
  }

  //save attribute in directive
  saveAttribute() {
    if (this.authService.canActivate()) {

      var array = [];
      this.subErr = false;
      this.topErr = false;

      if (this.selectedTopic.length != 0) {
        for (var j = 0; j < this.selectedTopic.length; j++) {
          array.push(this.selectedTopic[j].subject);
        }
      }
      else {
        this.topErr = true;
      }
      if (this.selectedSub.length != 0) {
        for (var i = 0; i < this.selectedSub.length; i++) {
          var a = array.includes(this.selectedSub[i].itemName);
          if (a == false) {
            this.topErr = true;
            break;
          }
        }
      } else {
        this.subErr = true;
      }

      if (this.difficulty_level == undefined || this.difficulty_level == "") {
        this.diffErr = true;
      }
      else {
        this.diffErr = false;
      }
      if (this.taxonomy == undefined || this.taxonomy == "") {
        this.taxErr = true;
      }
      else {
        this.taxErr = false;
      }
	  if (this.language == undefined || this.language == "") {
        this.langErr = true;
      }
      else {
        this.langErr = false;
      }
      if (this.explanation == undefined || this.explanation == "") {
        this.expErr = true;
      }
      else {
        this.expErr = false;
      }
      if (this.search_keywords == undefined || this.search_keywords == "") {
        this.keyErr = true;
      }
      else {
        this.keyErr = false;
      }
      if (this.subErr == false && this.topErr == false && this.diffErr == false
        && this.taxErr == false &&  this.keyErr == false) {
        this.attributesDet.subject = this.selectedSub;
        this.attributesDet.topic = this.selectedTopic;
        this.attributesDet.subtopic = this.selectedSubtopic;
        this.attributesDet.difficulty_level = this.difficulty_level;
        this.attributesDet.taxonomy = this.taxonomy;
        this.attributesDet.content_type = this.content_type;


        this.attributesDet.item_valid_till = this.item_valid_till ? this.item_valid_till.date : "";

        this.attributesDet.explanation = this.explanation;
        if(this.attributesDet.explanation == undefined){
          this.attributesDet.explanation = '';
        }
        this.attributesDet.hint = this.hint ? this.hint : "";
        this.attributesDet.search_keywords = this.search_keywords;
        this.attributesDet.ref_link = this.ref_link ? this.ref_link : "";



        this.attributesEdit.attributes = this.attributesDet;
        this.attributesEdit.item_type = this.item_type_view;
        this.attributesEdit.item_id = this.itemId;
        this.attributesEdit.itemset_item_id ='';
        this.attributesEdit.itemset_item_refer_id = '';
        this.attributesEdit.answer_type = this.viewItemQuestions[this.showItem].answer_type;
        this.attributesEdit.directive_id = this.viewItemQuestions[this.showItem].directive_id;
        this.attributesEdit.score = this.viewItemQuestions[this.showItem].score;
        this.attributesEdit.score_type = this.viewItemQuestions[this.showItem].score_type;
        this.attributesEdit.org_id = this.cookieService.get('_PAOID');
        var body = this.attributesEdit;
        this.saveload = true;
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
        return this.http.put(credentials.host + '/item_edit', body, { headers: headers })
          .map(res => res.json())
          .catch((e: any) => {
            return Observable.throw(e)
          })

          .subscribe(
          data => {
            if (data.success == true) {

              this.saveload = false;
              this._notifications.create('', data.message, 'info')
              // this.showMsg = "Attributes Updated Successfully";
              // this.saveMSg = true;
              this.selectedSub = [];
              this.selectedTopic = [];
              this.selectedSubtopic = [];
              this.content_type = [];
              // for(var i=0;i<this.contentType.length;i++){
              //   this.contentType[i].checked = true;
              // }
              this.content1 = [];
              this.content_type = [];
              this.topErr = false;
              this.subErr = false;
              this.diffErr = false;
              this.taxErr = false;
              this.expErr = false;
              this.keyErr = false;
              for (var i = 0; i < this.viewItemQuestions.length; i++) {
                if (this.viewItemQuestions[i].item_id == this.itemId) {
                  this.viewItemQuestions[i].attributes = data.attributes;
                }
              }

              for (var i = 0; i < data.attributes.subject.length; i++) {
                this.selectedSub.push(data.attributes.subject[i]);
                this.getTopic(this.selectedSub);
              }
              for (var i = 0; i < data.attributes.topic.length; i++) {
                this.selectedTopic.push(data.attributes.topic[i]);
                this.getSubtopic(this.selectedTopic)
              }
              for (var i = 0; i < data.attributes.subtopic.length; i++) {
                this.selectedSubtopic.push(data.attributes.subtopic[i]);
              }
              this.difficulty_level = data.attributes.difficulty_level;
              this.taxonomy = data.attributes.taxonomy;
              // this.item_valid_till = data.attributes.item_valid_till;


              if (data.attributes.content_type.length != 0) {
                var availableContenttype = [];
                for (var i = 0; i < data.attributes.content_type.length; i++) {
                  this.content_type = data.attributes.content_type;
                  this.content_type[i].id = data.attributes.content_type[i].UDF_Tag_ID;
                  this.content_type[i].itemName = data.attributes.content_type[i].UDF_Tag;
                  // data.attributes.content_type[i].checked = true;
                  // this.content_type.push(data.attributes.content_type[i]);
                  // availableContenttype.push(data.attributes.content_type[i].UDF_Tag_ID)
                }
              }
              // for(var j=0;j<this.contentType.length;j++){
              //   if(availableContenttype.includes(this.contentType[j].UDF_Tag_ID)){
              //     this.contentType[j].checked = true;
              //   }
              // }

              this.explanation = data.attributes.explanation;
              this.ref_link = data.attributes.ref_link;
              this.hint = data.attributes.hint;
              this.search_keywords = data.attributes.search_keywords;


              if (data.attributes.item_valid_till != null) {
                var a = data.attributes.item_valid_till;
                this.date1 = a.split('-');
                this.item_valid_till = { date: { year: +this.date1[0], month: +this.date1[1], day: +this.date1[2] } };

              } else {
                this.item_valid_till = data.attributes.item_valid_till;
              }

            } else {
              this.saveload = false;
              this._notifications.create('', data.message, 'error')
            }

          },
          error => {

            this.saveload = false;
            if (error.status == 404) {
              this.router.navigateByUrl('pages/NotFound');
            }
            else if (error.status == 401) {
              this.cookieService.deleteAll();
              window.location.href = credentials.accountUrl;
              // window.location.href='https://accounts.scora.in';
            }
            else {
              this.router.navigateByUrl('pages/serverError');
            }

          }
          );
      }
    }
  }


   
  removeSpcQue(event, val, index){

    if(val != undefined){
      if(val.length <= 20000){
        if(val == '' || val == null){
          if(event.keyCode == 32){
            event.preventDefault();
            event.returnValue = false;

          }
        }else if(val != null && val != '' && val != '<p>  </p>' && val != '<p> </p>'){
          this.attributes.item[index].data_format_value = val.replace(/\s\s+/g, '  ');
		  this.attributes.item[index].data_format_value = val.replace(new RegExp('<p><br></p>', 'g'), '');
        }else if(val == '<p>  </p>' || val == '<p> </p>'){
          this.attributes.item[index].data_format_value = null;
        }
      }else{
        if(event.keyCode != 8){
          event.preventDefault();
          event.returnValue = false;
        }
      }
    }else if(val == null){
      if(event.keyCode == 32){
        event.preventDefault();
        event.returnValue = false;

      }
    }


  }

  onBlurMethod(event, val, index) {	
		this.removeSpcQue(event, val, index);
	}

  onPaste(event, val, index) {
		this.removeSpcQue(event, val, index);
	}	
 
  removeSpcQueDir(event, val, index){
    if(val != undefined){
      if(val.length <= 20000){
        if(val == '' || val == null){
          if(event.keyCode == 32){
            event.preventDefault();
            event.returnValue = false;

          }
        }else if(val != null && val != '' && val != '<p>  </p>' && val != '<p> </p>'){
          this.attributes.directive[index].data_format_value = val.replace(/\s\s+/g, '  ');
          this.attributes.directive[index].data_format_value = val.replace(new RegExp('<p><br></p>', 'g'), '');

        }else if(val == '<p>  </p>' || val == '<p> </p>'){
          this.attributes.directive[index].data_format_value = null;
        }
      }else{
        if(event.keyCode != 8){
          event.preventDefault();
          event.returnValue = false;
        }
      }
    }else if(val == null){
      if(event.keyCode == 32){
        event.preventDefault();
        event.returnValue = false;

      }
    }


  }

  removeSpcAnsMcq(event,val,index,chIndex){
    if(val != undefined){
      if(val.length <= 20000){
        if(val == '' || val == null){
          if(event.keyCode == 32){
            event.preventDefault();
            event.returnValue = false;

          }
        }else if(val != null && val != '' && val != '<p>  </p>' && val != '<p> </p>'){
          this.attributes.answer_choices[index].choice_elements[chIndex].data_format_value = val.replace(/\s\s+/g, '  ');
          this.attributes.answer_choices[index].choice_elements[chIndex].data_format_value = val.replace(new RegExp('<p><br></p>', 'g'), '');

        }else if(val == '<p>  </p>' || val == '<p> </p>'){
          this.attributes.answer_choices[index].choice_elements[chIndex].data_format_value = null;
        }
      }else{
        if(event.keyCode != 8){
          event.preventDefault();
          event.returnValue = false;
        }
      }
    }else if(val == null){
      if(event.keyCode == 32){
        event.preventDefault();
        event.returnValue = false;

      }
    }

  }

  removeSpcAnsMatch(event,val,index,chIndex){
    if(val != undefined){
      if(val.length <= 20000){
        if(val == '' || val == null){
          if(event.keyCode == 32){
            event.preventDefault();
            event.returnValue = false;

          }
        }else if(val != null && val != '' && val != '<p>  </p>' && val != '<p> </p>'){
          this.attributes.answer_choices[index].choiceElement[chIndex].data_format_value = val.replace(/\s\s+/g, '  ');
          this.attributes.answer_choices[index].choiceElement[chIndex].data_format_value = val.replace(new RegExp('<p><br></p>', 'g'), '');
		  

        }else if(val == '<p>  </p>' || val == '<p> </p>'){
          this.attributes.answer_choices[index].choiceElement[chIndex].data_format_value = null;
        }
      }else{
        if(event.keyCode != 8){
          event.preventDefault();
          event.returnValue = false;
        }
      }
    }else if(val == null){
      if(event.keyCode == 32){
        event.preventDefault();
        event.returnValue = false;

      }
    }

  }

  removeSpcExp(event, val){
    if(val != undefined){
      if(val.length <= 20000){
        if(val == '' || val == null){
          if(event.keyCode == 32){
            event.preventDefault();
            event.returnValue = false;

          }
        }else if(val != null && val != '' && val != '<p>  </p>' && val != '<p> </p>'){
          this.explanation = val.replace(/\s\s+/g, '  ');
          this.explanation = val.replace(new RegExp('<p><br></p>', 'g'), '');

        }else if(val == '<p>  </p>' || val == '<p> </p>'){
          this.explanation = null;
        }
      }else{
        if(event.keyCode != 8){
          event.preventDefault();
          event.returnValue = false;
        }
      }
    }else if(val == null){
      if(event.keyCode == 32){
        event.preventDefault();
        event.returnValue = false;

      }
    }
  }

  //validation
  checkvalidation() {
    if (this.authService.canActivate()) {
      var array = [];
      var fileUploadArray = [];
      this.subErr = false;
      this.topErr = false;
      this.graded = 0;
      this.matchGradedScore = -1;
      this.scoreIndex = 0;
      this.checkarray = [];
      this.arrayItem = [];
      this.itemLevelMultipleCrtAns = 0;
      this.gradedLevelSingleCrtAns = 0;
      this.totalGraderScoreErr = 0;
      this.totalGradedScoreCount = 0;
      this.listRowErr = -1;
      this.listArrayErr = -1;
      this.tblColumnDataErr = -1;
      this.freeTextGradedScoreErr = -1;
      this.freeTextGradedTotalScoreErr = -1
      this. negAnsArray = [];
      this. NegAnsAlert = 0;
      this.directiveErr = -1;
      this.fileTypeErr = false;
      this.fileFormatErr = false;
      const pattern1 = /^[^\s].*/;
      const scorepattern = /^[1-9][0-9]+([,.][0-9]+)?$/;

      // attributes validation starts
      // if (
      //   this.selectedSub.length === 0 ||
      //   this.selectedTopic.length === 0 ||
      //   this.difficulty_level == "" ||
      //   this.taxonomy == "" ||
      //   this.explanation == "" ||
      //   this.search_keywords == ""
      // ) {
      //   this._notifications.create(
      //     "",
      //     'All fields marked "*" are mandatory. Please complete to proceed.',
      //     "error"
      //   );
      //   setTimeout(() => {}, 2000);
      // }

      if (this.selectedTopic.length != 0) {
        for (var j = 0; j < this.selectedTopic.length; j++) {
          array.push(this.selectedTopic[j].subject);
        }
      }
      else {
        this.topErr = true;
      }
      if (this.selectedSub.length != 0) {
        for (var i = 0; i < this.selectedSub.length; i++) {
          var a = array.includes(this.selectedSub[i].itemName);
          if (a == false) {
            this.topErr = true;
            break;
          }
        }
      } else {
        this.subErr = true;
      }


      if (this.difficulty_level == undefined || this.difficulty_level == "") {
        this.diffErr = true;
      }
      else {
        this.diffErr = false;
      }
      if ((this.taxonomy == undefined || this.taxonomy == "") && this.item_type != 6) {
        this.taxErr = true;
      }
      else {
        this.taxErr = false;
      }
	  if ((this.language == undefined || this.language == "")) {
        this.langErr = true;
      }
      else {
        this.langErr = false;
      }
      if ((this.explanation == undefined || !pattern1.test(this.explanation)) && this.item_type != 6) {
        this.expErr = true;
      }
      else {
        this.expErr = false;
      }
      if (this.search_keywords == undefined || !pattern1.test(this.search_keywords)) {
        this.keyErr = true;
      }
      else {
        this.keyErr = false;
      }
      // attributes validation ends


      // question block
      if (this.item_type == 1 || this.item_type == 2 || this.item_type == 5 || this.item_type == 7) {
        if (this.attributes.item.length != 0) {
          for (var i = 0; i < this.attributes.item.length; i++) {
            if (this.attributes.item[i].item_df_id != 8 && this.attributes.item[i].item_df_id != 7) {
              if ((!pattern1.test(this.attributes.item[i].data_format_value) || this.attributes.item[i].data_format_value == null) && this.attributes.item[i].item_df_id == 1) {
                this.errIndex = i;

                break;
              }else if(this.attributes.item[i].data_format_value == null || this.attributes.item[i].data_format_value == '' || (this.attributes.item[i].item_df_id == 6 && this.attributes.item[i].data_format_value == 'Image_Path')){
                this.errIndex = i;
                break;
              }
              else if(this.attributes.item[i].data_format_value == null || this.attributes.item[i].data_format_value == '' || (this.attributes.item[i].item_df_id == 10 && this.attributes.item[i].data_format_value == 'Audio Path')){
                this.errIndex = i;
                break;
              }else if(this.attributes.item[i].data_format_value == null || this.attributes.item[i].data_format_value == '' || (this.attributes.item[i].item_df_id == 11 && this.attributes.item[i].data_format_value == 'Video Path')){
                this.errIndex = i;
                break;
              }
            }
            // list
            else if (this.attributes.item[i].item_df_id == 8) {
              for (var m = 0; m < this.attributes.item[i].data_format_value.length; m++) {
                for (var n = 0; n < this.attributes.item[i].data_format_value[m].list_elements.length; n++) {
                  if (!pattern1.test(this.attributes.item[i].data_format_value[m].list_elements[n].list_value) || this.attributes.item[i].data_format_value[m].list_elements[n].list_value == null) {
                    this.listRowErr = m;
                    this.listArrayErr = n;
                    break;
                  }
                }
              }
            }
            //table
            else if(this.attributes.item[i].item_df_id == 7){
              for(var t1 = 0;t1<this.attributes.item[i].data_format_value.length;t1++){
                for(var t2=0;t2<this.attributes.item[i].data_format_value[t1].length;t2++){
                  if(!pattern1.test(this.attributes.item[i].data_format_value[t1][t2].table_value) || this.attributes.item[i].data_format_value[t1][t2].table_value == null){
                    this.tblColumnDataErr = t2;
                    break;
                  }
                }
              }
            }
            this.errIndex = -1;
          }
        } else {
          // alert("Question Block Should not be Empty");
          this.alerts.push({
            type: 'danger',
            msg: `Question Block Should not be Empty`,
            timeout: 4000
          });
          this.errIndex = 0;
        }
      } else {
        this.errIndex = -1;
      }
      // ans blk for item type 1
      if (this.item_type == 1) {

        for (var i = 0; i < this.attributes.answer_choices.length; i++) {
          for(var c=0; c<this.attributes.answer_choices[i].choice_elements.length; c++){
            if ((!pattern1.test(this.attributes.answer_choices[i].choice_elements[c].data_format_value) || this.attributes.answer_choices[i].choice_elements[c].data_format_value == null) && this.attributes.answer_choices[i].choice_elements[c].answer_df_id == 1) {
              this.ansIndex = c;
            }else if (this.attributes.answer_choices[i].choice_elements[c].data_format_value == null || this.attributes.answer_choices[i].choice_elements[c].data_format_value == '' || (this.attributes.answer_choices[i].choice_elements[c].answer_df_id == 6 && this.attributes.answer_choices[i].choice_elements[c].data_format_value == 'Image_Path')) {
              this.ansIndex = c;
            }else if (this.attributes.answer_choices[i].choice_elements[c].data_format_value == null || this.attributes.answer_choices[i].choice_elements[c].data_format_value == '' || (this.attributes.answer_choices[i].choice_elements[c].answer_df_id == 10 && this.attributes.answer_choices[i].choice_elements[c].data_format_value == 'Audio Path')) {
              this.ansIndex = c;
            }else if (this.attributes.answer_choices[i].choice_elements[c].data_format_value == null || this.attributes.answer_choices[i].choice_elements[c].data_format_value == '' || (this.attributes.answer_choices[i].choice_elements[c].answer_df_id == 11 && this.attributes.answer_choices[i].choice_elements[c].data_format_value == 'Video Path')) {
              this.ansIndex = c;
            }
            else {
              this.ansIndex = -1;
            }
          }
          if(this.ansIndex != -1){

            break;
          }

        }
      }
      // ans blk item type 2
      if (this.item_type == 2) {
        for (var i = 0; i < this.attributes.answer_choices.length; i++) {
          if (!pattern1.test(this.attributes.answer_choices[i].data_format_value)) {
            this.ansIndex = i;

            break;
          }
          else {
            this.ansIndex = -1;
          }
        }
      }


      // exact match answer blk

      if (this.matchtypeSelected == 5) {
        for (var i = 0; i < this.attributes.answer_choices.length; i++) {
          if (!pattern1.test(this.attributes.answer_choices[i].choiceElement[0].data_format_value) || this.attributes.answer_choices[i].choiceElement[0].data_format_value == null) {
            this.ansIndex = i;

            break;
          }
          else {
            this.ansIndex = -1;
          }
        }
      }

      // matrix match ans blk
      if (this.matchtypeSelected == 4) {
        for (var i = 0; i < this.matrixAnsBlock.length; i++) {
          for (var j = 0; j < this.matrixAnsBlock[i].answer_choices.length; j++) {
            if (!pattern1.test(this.matrixAnsBlock[i].answer_choices[j].data_format_value)) {
              this.rowIndex = i;
              this.ansIndex = j;

              break;
            } else {
              this.ansIndex = -1;
            }
          } if (this.ansIndex != -1) {
            break;
          }
        }
      }

      // item type 3 match
      if (this.item_type == 3) {

        for (var i = 0; i < this.attributes.item.length; i++) {

          if (this.attributes.item[i].item_df_id != 9 && this.attributes.item[i].item_df_id != 8 && this.attributes.item[i].item_df_id != 7) {
            if (!pattern1.test(this.attributes.item[i].data_format_value) || this.attributes.item[i].data_format_value == null) {
              this.errIndex = i;

              break;
            } else {
              this.errIndex = -1;
            }
          }
          else if (this.attributes.item[i].item_df_id == 9) {
            for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
              for (var k = 0; k < this.attributes.item[i].data_format_value[j].match_data.length; k++) {
                if (!pattern1.test(this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0].match_value)) {
                  this.matchIndex = k;

                  break;
                } else {
                  this.matchIndex = -1;
                }
              }
              if (this.matchIndex != -1) {
                break;
              }
            }
            if (this.attributes.item[i].score_type == "Item Lvl Score" && this.matchtypeSelected <= 3) {
              if (this.attributes.item[i].score == 0 || this.attributes.item[i].score == 0.00 || this.attributes.item[i].score == '' || this.attributes.item[i].score == null) {
                this.scoreIndex = 1;
              }
              else {
                this.scoreIndex = 0;
              }
            } else if (this.attributes.item[i].score_type == "Graded Score" && this.matchtypeSelected <= 3) {
              for (var l = 1; l < this.attributes.item[i].data_format_value.length; l++) {
                if (this.attributes.item[i].data_format_value[l].score == 0 || this.attributes.item[i].data_format_value[l].score == 0.00 || this.attributes.item[i].data_format_value[l].score == '' || this.attributes.item[i].data_format_value[l].score == null) {
                  if (this.attributes.item[i].data_format_value[l].match_data[0].matchValueArray[0].hiddenObj == false) {
                    this.matchGradedScore = l;
                    break;
                  } else {
                    this.matchGradedScore = -1;
                  }

                }
                else if (this.attributes.item[i].data_format_value[l].score < 0) {
                  this.matchGradedScore = l;
                  // alert("Only Positive Values Are Allowed For Score");
                  this.alerts.push({
                    type: 'danger',
                    msg: `Only Positive Values Are Allowed For Score`,
                    timeout: 4000
                  });
                  break;
                }
                else {
                  this.matchGradedScore = -1;
                }
              }
              var totalScoreCountMatch = 0;
              for (var l = 0; l < this.attributes.item[i].data_format_value.length; l++) {
                if (this.attributes.item[i].data_format_value[l].score != null) {
                  totalScoreCountMatch = parseInt(this.attributes.item[i].data_format_value[l].score) + totalScoreCountMatch;
                }
              }
              if (totalScoreCountMatch > 100) {
                // alert("Total Percentage For Correct Answers Should Not Exceed 100");
                this.alerts.push({
                  type: 'danger',
                  msg: `Total Percentage For Correct Answers Should Not Exceed 100`,
                  timeout: 4000
                });
                this.totalGraderScoreErr = -1;
              } else {
                this.totalGraderScoreErr = 0;
              }
            }
          }

          // list
          else if (this.attributes.item[i].item_df_id == 8) {
            for (var m = 0; m < this.attributes.item[i].data_format_value.length; m++) {
              for (var n = 0; n < this.attributes.item[i].data_format_value[m].list_elements.length; n++) {
                if (!pattern1.test(this.attributes.item[i].data_format_value[m].list_elements[n].list_value)) {
                  this.listRowErr = m;
                  this.listArrayErr = n;
                  break;
                }
              }
            }
          }

          // table
          else if(this.attributes.item[i].item_df_id == 7){
            for(var t1 = 0;t1<this.attributes.item[i].data_format_value.length;t1++){
              for(var t2=0;t2<this.attributes.item[i].data_format_value[t1].length;t2++){
                if(!pattern1.test(this.attributes.item[i].data_format_value[t1][t2].table_value)){
                  this.tblColumnDataErr = t2;
                  break;
                }
              }
            }
          }
        }
      }

        // score validation
      if (this.item_type == 1 || this.item_type == 2) {
        for (var i = 0; i < this.attributes.answer_choices.length; i++) {
          if (this.attributes.score_type == "Item Lvl Score" && this.attributes.answer_type == "Single Answer") {
            if (this.attributes.answer_choices[i].correct_answer == true) {
              this.arrayItem.push(this.attributes.answer_choices[i]);
            }

          }
          if (this.attributes.score_type == "Item Lvl Score" && this.attributes.answer_type == "Multiple Correct Answers") {
            if (this.attributes.answer_choices[i].correct_answer == true) {
              this.arrayItem.push(this.attributes.answer_choices[i]);
            }
          }

          if (this.attributes.score_type == "Graded Score" && this.attributes.answer_type == "Multiple Correct Answers") {

            if (this.attributes.answer_choices[i].correct_answer == true) {
              this.checkarray.push(this.attributes.answer_choices[i]);
            }
            else if(this.attributes.answer_choices[i].correct_answer == false){
              this.negAnsArray.push(this.attributes.answer_choices[i]);
              if(this.attributes.answer_choices[i].score == ''){
                this.attributes.answer_choices[i].score = 0;
              }
            }
            // else {
            //   this.attributes.answer_choices[i].score = 0;
            //   this.graded = 0;
            // }
          } else {
            this.graded = 0;
          }

          if (this.attributes.score_type == "Graded Score" && this.attributes.answer_type == "Single Answer") {

            if (this.attributes.answer_choices[i].correct_answer == true) {
              this.checkarray.push(this.attributes.answer_choices[i]);


            }else if(this.attributes.answer_choices[i].correct_answer == false){
              this.negAnsArray.push(this.attributes.answer_choices[i]);
              if(this.attributes.answer_choices[i].score == ''){
                this.attributes.answer_choices[i].score = 0;
              }
            }
            // else {
            //   this.attributes.answer_choices[i].score = 0;
            //   this.graded = 0;
            // }
          } else {
            this.graded = 0;
          }
        }
      } else if (this.matchtypeSelected == 5) {
        for (var i = 0; i < this.attributes.answer_choices.length; i++) {
          if (this.attributes.score_type == "Item Lvl Score" && this.attributes.answer_type == "Single Answer") {
            if (this.attributes.answer_choices[i].choiceElement[0].correct_answer == true) {
              this.arrayItem.push(this.attributes.answer_choices[i].choiceElement[0]);
            }

          }
          if (this.attributes.score_type == "Item Lvl Score" && this.attributes.answer_type == "Multiple Correct Answers") {
            if (this.attributes.answer_choices[i].choiceElement[0].correct_answer == true) {
              this.arrayItem.push(this.attributes.answer_choices[i].choiceElement[0]);
            }
          }

          if (this.attributes.score_type == "Graded Score" && this.attributes.answer_type == "Multiple Correct Answers") {

            if (this.attributes.answer_choices[i].choiceElement[0].correct_answer == true) {
              this.checkarray.push(this.attributes.answer_choices[i].choiceElement[0]);
             }
              else if(this.attributes.answer_choices[i].choiceElement[0].correct_answer == false){
              this.negAnsArray.push(this.attributes.answer_choices[i].choiceElement[0]);
              if(this.attributes.answer_choices[i].choiceElement[0].score == ''){
                this.attributes.answer_choices[i].choiceElement[0].score = 0;
              }
            }
            //  else {
            //   this.attributes.answer_choices[i].choiceElement[0].score = 0;
            //   this.graded = 0;
            // }
          } else {
            this.graded = 0;
          }

          if (this.attributes.score_type == "Graded Score" && this.attributes.answer_type == "Single Answer") {

            if (this.attributes.answer_choices[i].choiceElement[0].correct_answer == true) {
              this.checkarray.push(this.attributes.answer_choices[i].choiceElement[0]);


            }
            else if(this.attributes.answer_choices[i].choiceElement[0].correct_answer == false){
              this.negAnsArray.push(this.attributes.answer_choices[i].choiceElement[0]);
              if(this.attributes.answer_choices[i].choiceElement[0].score == ''){
                this.attributes.answer_choices[i].choiceElement[0].score = 0;
              }
            }
            // else {
            //   this.attributes.answer_choices[i].choiceElement[0].score = 0;
            //   this.graded = 0;
            // }
          } else {
            this.graded = 0;
          }
        }
      }
      else if (this.matchtypeSelected == 4) {
        for (var i = 0; i < this.matrixAnsBlock.length; i++) {
          if (this.attributes.score_type == "Item Lvl Score" && this.attributes.answer_type == "Single Answer") {
            if (this.matrixAnsBlock[i].correct_answer == true) {
              this.arrayItem.push(this.matrixAnsBlock[i]);
            }

          }
          if (this.attributes.score_type == "Item Lvl Score" && this.attributes.answer_type == "Multiple Correct Answers") {
            if (this.matrixAnsBlock[i].correct_answer == true) {
              this.arrayItem.push(this.matrixAnsBlock[i]);
            }

          }

          if (this.attributes.score_type == "Graded Score" && this.attributes.answer_type == "Multiple Correct Answers") {

            if (this.matrixAnsBlock[i].correct_answer == true) {
              this.checkarray.push(this.matrixAnsBlock[i]);


            }
            else if(this.matrixAnsBlock[i].correct_answer== false){
              this.negAnsArray.push(this.matrixAnsBlock[i]);
              if(this.matrixAnsBlock[i].score == ''){
                this.matrixAnsBlock[i].score = 0;
              }
            }
            // else {
            //   this.matrixAnsBlock[i].score = 0;
            //   this.graded = 0;
            // }
          } else {
            this.graded = 0;
          }
          if (this.attributes.score_type == "Graded Score" && this.attributes.answer_type == "Single Answer") {

            if (this.matrixAnsBlock[i].correct_answer == true) {
              this.checkarray.push(this.matrixAnsBlock[i]);


            }
            else if(this.matrixAnsBlock[i].correct_answer== false){
              this.negAnsArray.push(this.matrixAnsBlock[i]);
              if(this.matrixAnsBlock[i].score == ''){
                this.matrixAnsBlock[i].score = 0;
              }
            }
            // else {
            //   this.matrixAnsBlock[i].score = 0;
            //   this.graded = 0;
            // }
          } else {
            this.graded = 0;
          }
        }
      }

      if (this.item_type == 1 || this.item_type == 2 || this.matchtypeSelected == 5 || this.matchtypeSelected == 4) {
        for (var i = 0; i < this.checkarray.length; i++) {
          if (this.checkarray[i].score == 0) {
            this.graded = 1;
            // alert("Please Enter Graded Score for Correct Answers");
            this.alerts.push({
              type: 'danger',
              msg: `Please complete Graded Scores for the correct answers.`,
              timeout: 4000
            });
            break;
          }
          else if (this.checkarray[i].score == "") {
            this.graded = 1;
            // alert("Please Enter Graded Score for Correct Answers");
            this.alerts.push({
              type: 'danger',
              msg: `Please complete Graded Scores for the correct answers.`,
              timeout: 4000
            });
            break;
          }
          else if (this.checkarray[i].score == null) {
            this.graded = 1;
            // alert("Please Enter Graded Score for Correct Answers");
            this.alerts.push({
              type: 'danger',
              msg: `Please complete Graded Scores for the correct answers.`,
              timeout: 4000
            });
            break;
          }
          else if (this.checkarray[i].score == 0.00) {
            this.graded = 1;
            // alert("Please Enter Graded Score for Correct Answers");
            this.alerts.push({
              type: 'danger',
              msg: `Please complete Graded Scores for the correct answers.`,
              timeout: 4000
            });
            break;
          }
          else if (this.checkarray[i].score < 0) {
            this.graded = 1;
            // alert("Only Positive Values Are Allowed For Score");
            this.alerts.push({
              type: 'danger',
              msg: `Only Positive Values Are Allowed For Correct Answer Score`,
              timeout: 4000
            });
            break;
          }
          else {
            this.graded = 0;

          }
        }

        if (this.checkarray.length < 2 && this.attributes.score_type == "Graded Score" && this.attributes.answer_type == "Multiple Correct Answers") {
          // alert("Please Select Atleast 2 Correct Answers");
          this.alerts.push({
            type: 'danger',
            msg: `Please Select Atleast 2 Correct Answers`,
            timeout: 4000
          });
          this.gradedLevelSingleCrtAns = -1;
        } else if (this.checkarray.length == 0 && this.attributes.score_type == "Graded Score" && this.attributes.answer_type == "Single Answer") {
          // alert("Please Select  Correct Answer");
          this.alerts.push({
            type: 'danger',
            msg: `Please Select  Correct Answer`,
            timeout: 4000
          });
          this.gradedLevelSingleCrtAns = -1;
        }
        else {
          this.gradedLevelSingleCrtAns = 0;
        }

        if (this.arrayItem.length == 0 && this.attributes.score_type == "Item Lvl Score" && this.attributes.answer_type == "Single Answer") {
          // alert("Please Select Correct Answer");
          this.alerts.push({
            type: 'danger',
            msg: `Please Select Correct Answer`,
            timeout: 4000
          });

          this.itemLevelMultipleCrtAns = -1;
        } else if (this.arrayItem.length < 2 && this.attributes.score_type == "Item Lvl Score" && this.attributes.answer_type == "Multiple Correct Answers") {
          // alert("Please Select Atleast 2 Correct Answers");
          this.alerts.push({
            type: 'danger',
            msg: `Please Select Atleast 2 Correct Answers`,
            timeout: 4000
          });
          this.itemLevelMultipleCrtAns = -1;
        }
        else {
          this.itemLevelMultipleCrtAns = 0;
        }

        var correctAnsScoreCount = 0;
        for (var j = 0; j < this.checkarray.length; j++) {
          correctAnsScoreCount = parseInt(this.checkarray[j].score) + correctAnsScoreCount;
        }
        if (correctAnsScoreCount > 100) {
          // alert("Total Percentage For Correct Answers Should Not Exceed 100");
          this.alerts.push({
            type: 'danger',
            msg: `Total Percentage For Correct Answers Should Not Exceed 100`,
            timeout: 4000
          });
          this.totalGradedScoreCount = -1;
        } else {
          this.totalGradedScoreCount = 0;
        }
        var wrongAnsScoreCount = 0;
            for(var n=0;n<this.negAnsArray.length;n++){
              wrongAnsScoreCount = parseInt(this.negAnsArray[n].score) + wrongAnsScoreCount;
            }

            if(wrongAnsScoreCount > 0)
            {
              if(wrongAnsScoreCount > 100 ){
                this.alerts.push({
                  type: 'danger',
                  msg: `Total Percentage of Negative Score Should Not Exceed 100`,
                  timeout:4000
                });
                this.NegAnsAlert = -1;
              }else {
                this.NegAnsAlert = 0;
              }
            }
            else
            {
              if(wrongAnsScoreCount < -100 ){
                this.alerts.push({
                  type: 'danger',
                  msg: `Total Percentage of Negative Score Should Not Exceed 100`,
                  timeout:4000
                });
                this.NegAnsAlert = -1;
              }else {
                this.NegAnsAlert = 0;
              }
            }
      }



      if ((this.attributes.score_type == "Item Lvl Score" || this.attributes.score_type == "Graded Score") && (this.item_type == 1 || this.item_type == 2 || this.matchtypeSelected == 5 || this.matchtypeSelected == 4 || this.item_type == 5 || this.item_type ==7)) {
        if (this.score == 0) {
          this.scoreIndex = 1;
        }
        // else{
        //   this.scoreIndex = 0;
        // }
        else if (this.score == "") {
          this.scoreIndex = 1;
        } else if (this.score == undefined) {
          this.scoreIndex = 1;
        }
        else if (this.score == null) {
          this.scoreIndex = 1;
        }
        else if (this.score == 0.00) {
          this.scoreIndex = 1;
        }
        else if (this.score < 0) {
          // alert("Only Positive Values Are Allowed For Score");
          this.alerts.push({
            type: 'danger',
            msg: `Only Positive Values Are Allowed For Score`,
            timeout: 4000
          });
          this.scoreIndex = 1;
        }
        else {
          this.scoreIndex = 0;
        }

      } else {
        this.scoreIndex = 0;
      }

      // score validation for match type 1,2,3

      if (this.matchtypeSelected <= 3) {
        for (var i = 0; i < this.attributes.item.length; i++) {
          if (this.attributes.item[i].item_df_id == 9 && (this.attributes.item[i].score_type == "Item Lvl Score" || this.attributes.item[i].score_type == "Graded Score")) {
            if (this.attributes.item[i].score == "" || this.attributes.item[i].score == 0 || this.attributes.item[i].score == null) {
              this.scoreIndexMatch = 1;
              break;
            } else if (this.attributes.item[i].score < 0) {

              // alert("Only Positive Values Are Allowed For Score");
              this.alerts.push({
                type: 'danger',
                msg: `Only Positive Values Are Allowed For Score`,
                timeout: 4000
              });
              this.scoreIndexMatch = 1;
              break;
            }
            else {
              this.scoreIndexMatch = 0;
            }
          }
          else {
            this.scoreIndexMatch = 0;
          }
        }
      } else {
        this.scoreIndexMatch = 0;
      }

      // free text answer blk

      if(this.item_type == 5){

        for(var f=0;f<2;f++){
          if(!pattern1.test(this.attributes.answer_choices[f].answer_data) || this.attributes.answer_choices[f].answer_data == null){
            this.ansIndex = f;
            break;
          }else {
            this.ansIndex = -1;
          }
        }
        if(this.attributes.score_type == 'Graded Score'){
          for(var f=0;f<this.attributes.answer_choices.length;f++){
              if(!pattern1.test(this.attributes.answer_choices[f].answer_data) || this.attributes.answer_choices[f].answer_data == null){
                if(scorepattern.test(this.attributes.answer_choices[f].score) && this.attributes.answer_choices[f].score != null){
                  this.ansIndex = f;
                  break;
                }
              }else  if(scorepattern.test(this.attributes.answer_choices[f].score) && this.attributes.answer_choices[f].score != null){
                if(!pattern1.test(this.attributes.answer_choices[f].answer_data) || this.attributes.answer_choices[f].answer_data == null){
                  this.freeTextGradedScoreErr = f;
                  break;
                }
              }else if(pattern1.test(this.attributes.answer_choices[f].answer_data) || this.attributes.answer_choices[f].score == null){
                if(!scorepattern.test(this.attributes.answer_choices[f].score)){
                  this.freeTextGradedScoreErr = f;
                  break;
                }
              }
          }
          var correctAnsScoreCount = 0;

          for (var j = 0; j < this.attributes.answer_choices.length; j++) {
            if(scorepattern.test(this.attributes.answer_choices[j].score)){
              correctAnsScoreCount = parseInt(this.attributes.answer_choices[j].score) + correctAnsScoreCount;
            }
          }
          if(correctAnsScoreCount > 100){
            this.alerts.push({
              type: 'danger',
              msg: `Total Percentage For Correct Answers Should Not Exceed 100`,
              timeout: 4000
            });
            this.freeTextGradedTotalScoreErr = 0;
          }else{
            this.freeTextGradedTotalScoreErr = -1;
          }
        }
      }


      // item tpye 6 - directive
      if (this.item_type == 6) {
        if (this.attributes.directive.length != 0) {
          for (var i = 0; i < this.attributes.directive.length; i++) {
            if (this.attributes.directive[i].item_df_id != 8 && this.attributes.directive[i].item_df_id != 7) {
              if (!pattern1.test(this.attributes.directive[i].data_format_value)) {
                this.directiveErr = i;
                break;
              }
            } else if (this.attributes.directive[i].item_df_id == 8) {
              for (var m = 0; m < this.attributes.directive[i].data_format_value.length; m++) {
                for (var n = 0; n < this.attributes.directive[i].data_format_value[m].list_elements.length; n++) {
                  if (!pattern1.test(this.attributes.directive[i].data_format_value[m].list_elements[n].list_value)) {
                    this.listRowErr = m;
                    this.listArrayErr = n;
                    break;
                  }
                }
              }
            }
            else if(this.attributes.directive[i].item_df_id == 7){
              for(var t1 = 0;t1<this.attributes.directive[i].data_format_value.length;t1++){
                for(var t2=0;t2<this.attributes.directive[i].data_format_value[t1].length;t2++){
                  if(!pattern1.test(this.attributes.directive[i].data_format_value[t1][t2].table_value)){
                    this.tblColumnDataErr = t2;
                    break;
                  }
                }
              }
            }

            else {
              this.directiveErr = -1;
            }

          }
        } else {
          this.alerts.push({
            type: 'danger',
            msg: `Question Block Should not be Empty`,
            timeout: 4000
          });
          this.directiveErr = 0;
        }
      }


      // item type 7 file upload answer blk
      if(this.item_type == 7){
        //for item level score by default 1st row all fields is mandatory
        if(!pattern1.test(this.attributes.answer_choices[0].description) || this.attributes.answer_choices[0].description == null){
          this.ansIndex = 0;
        }else {
          this.ansIndex = -1;
        }
        if(this.attributes.score_type== "Item Lvl Score"){
          var index=1; // for item level score to check only first row for mandatory
        }else {
          index = 2; // for graded level score to check both row for mandatory
        }
          // to check file format and file type
          for(var ans=0;ans<index;ans++){
            if (this.attributes.answer_choices[ans].data_format_type.length != 0) {
            for(var d =0;d<this.attributes.answer_choices[ans].data_format_type.length;d++){
                  fileUploadArray.push(this.attributes.answer_choices[ans].data_format_type[d].file_type);
                }
              }
              else {
                this.fileTypeErr = true;
                this.listRowErr = ans;
              }
              if (this.attributes.answer_choices[ans].fileFormatLits.length != 0) {
                for(var d =0;d<this.attributes.answer_choices[ans].fileFormatLits.length;d++){
                    if(fileUploadArray.length != 0){
                      var a = fileUploadArray.includes(this.attributes.answer_choices[ans].fileFormatLits[d].itemName);
                        if (a == false) {
                          this.fileTypeErr = true;
                          this.listRowErr = ans;
                          break;
                        }
                    }
                }
            } else {
                    this.fileFormatErr = true;
                    this.listRowErr = ans;
                  }
                  if(this.fileTypeErr == true || this.fileFormatErr == true)
                  {
                    this.listRowErr = ans;
                    break;
                  }
          }

          //for graded level score by default 2 rows description shold be mandatory
          if(this.attributes.score_type == "Graded Score"){

            for(var f=0;f<2;f++){
              if(!pattern1.test(this.attributes.answer_choices[f].description) || this.attributes.answer_choices[f].description == null){
                this.ansIndex = f;
              }else {
                this.ansIndex = -1;
              }
            }
          }

          // for graded score
          if(this.attributes.score_type == "Graded Score"){

            for(var f=0;f<this.attributes.answer_choices.length;f++){
                if(!pattern1.test(this.attributes.answer_choices[f].description) || this.attributes.answer_choices[f].description == null){
                  if(scorepattern.test(this.attributes.answer_choices[f].score) && this.attributes.answer_choices[f].score != null){
                    this.ansIndex = f;
                    break;
                  }
                }else  if(scorepattern.test(this.attributes.answer_choices[f].score) && this.attributes.answer_choices[f].score != null){
                  if(!pattern1.test(this.attributes.answer_choices[f].description) || this.attributes.answer_choices[f].description == null){
                    this.freeTextGradedScoreErr = f;
                    break;
                  }
                }else if(pattern1.test(this.attributes.answer_choices[f].description) || this.attributes.answer_choices[f].score == null){
                  if(!scorepattern.test(this.attributes.answer_choices[f].score)){
                    this.freeTextGradedScoreErr = f;
                    break;
                  }
                }
            }
            var correctAnsScoreCount = 0;

            for (var j = 0; j < this.attributes.answer_choices.length; j++) {
              if(scorepattern.test(this.attributes.answer_choices[j].score)){
                correctAnsScoreCount = parseInt(this.attributes.answer_choices[j].score) + correctAnsScoreCount;
              }
            }
            if(correctAnsScoreCount > 100){
              this.alerts.push({
                type: 'danger',
                msg: `Total Percentage For Correct Answers Should Not Exceed 100`,
                timeout: 4000
              });
              this.freeTextGradedTotalScoreErr = 0;
            }else{
              this.freeTextGradedTotalScoreErr = -1;
            }
          }

          // to check other fields if any data is entered
          if(this.attributes.answer_choices.length>=1 && this.listRowErr == -1){
            for(var i=0;i<this.attributes.answer_choices.length;i++){
              fileUploadArray = [];
              if(pattern1.test(this.attributes.answer_choices[i].description) && this.attributes.answer_choices[i].description != null){
                  if (this.attributes.answer_choices[i].data_format_type.length != 0) {
                    for(var d =0;d<this.attributes.answer_choices[i].data_format_type.length;d++){
                        fileUploadArray.push(this.attributes.answer_choices[i].data_format_type[d].file_type);
                      }
                  }
                  else {
                    this.fileTypeErr = true;
                    this.listRowErr = i;
                  }
                  if (this.attributes.answer_choices[i].fileFormatLits.length != 0) {
                    for(var d =0;d<this.attributes.answer_choices[i].fileFormatLits.length;d++){
                      if(fileUploadArray.length != 0){
                        var a = fileUploadArray.includes(this.attributes.answer_choices[i].fileFormatLits[d].itemName);
                          if (a == false) {
                            this.fileTypeErr = true;
                            this.listRowErr = i;
                            break;
                          }
                      }
                    }
                  } else {
                          this.fileFormatErr = true;
                          this.listRowErr = i;
                        }
                        if(this.fileTypeErr == true || this.fileFormatErr == true)
                        {
                          this.listRowErr = i;
                          break;
                        }
              }else if(!pattern1.test(this.attributes.answer_choices[i].description) || this.attributes.answer_choices[i].description == null){
                if(this.attributes.answer_choices[i].fileFormatLits.length != 0){
                  this.ansIndex = i;
                  break;
                }
              }
            }
          }
      }

    }
  }

  //save item
  saveItem(one,two,three,four,five,six,seven,eight,nine,ten,eleven,twelve,thirteen,fourteen,fifteen,sixteen,seventeen,eighteen,ninteen,twenty) {

    
    this.checkvalidation();
    var flag;
    if (this.authService.canActivate()) {
      if (this.subErr == false && this.topErr == false && this.diffErr == false
        && this.taxErr == false &&  this.keyErr == false && this.errIndex == -1
        && this.ansIndex == -1 && this.graded == 0 && this.listArrayErr == -1 && this.listRowErr == -1 && this.tblColumnDataErr == -1 &&
        this.scoreIndex == 0 && this.fileTypeErr == false && this.fileFormatErr == false) {
        if (this.item_type == 1 || this.item_type == 2 || this.matchtypeSelected == 4 || this.matchtypeSelected == 5) {

          if (this.attributes.score_type == "Item Lvl Score") {
            if (this.arrayItem.length > 0 && this.itemLevelMultipleCrtAns == 0) {
              flag = true;
              if (this.item_type == 3) {
                if (this.matchIndex == -1 && this.matchGradedScore == -1 && this.scoreIndexMatch == 0 && this.totalGraderScoreErr == 0) {
                  flag = true;
                } else {
                  flag = false;
                }
              }
            }
          }
          else if (this.attributes.score_type == "Graded Score") {
            if (this.checkarray.length > 0 && this.gradedLevelSingleCrtAns == 0 && this.totalGradedScoreCount == 0 && this.NegAnsAlert == 0) {
              flag = true;
              if (this.item_type == 3) {
                if (this.matchIndex == -1 && this.matchGradedScore == -1 && this.scoreIndexMatch == 0 && this.totalGraderScoreErr == 0) {
                  flag = true;
                } else {
                  flag = false;
                }
              }
            }
          }
        } else if (this.item_type == 3 && (this.matchtypeSelected == 1 || this.matchtypeSelected == 2 || this.matchtypeSelected == 3)) {
          if (this.matchIndex == -1 && this.matchGradedScore == -1 && this.scoreIndexMatch == 0 && this.totalGraderScoreErr == 0) {
            flag = true;
          } else {
            flag = false;
          }
        }
        if (this.item_type == 6) {
          if (this.directiveErr == -1) {
            flag = true;
          } else {
            flag = false;
          }
        }

        if(this.item_type == 5 || this.item_type == 7){
          if(this.freeTextGradedScoreErr == -1 && this.freeTextGradedTotalScoreErr == -1){
            flag= true;
          }else {
            flag= false;
          }
        }

        if (flag == true) {

          this.attributesDet.subject = this.selectedSub;
          this.attributesDet.topic = this.selectedTopic;
          this.attributesDet.subtopic = this.selectedSubtopic;
          this.attributesDet.difficulty_level = this.difficulty_level;
          this.attributesDet.taxonomy = this.taxonomy;
          this.attributesDet.language = this.language;
          this.attributesDet.content_type = this.content_type;
          this.attributesDet.item_valid_till = this.item_valid_till ? this.item_valid_till.date : "";
          this.attributesDet.explanation = this.explanation;
          if(this.attributesDet.explanation == undefined){
            this.attributesDet.explanation = '';
          }
          this.attributesDet.hint = this.hint ? this.hint : "";
          this.attributesDet.search_keywords = this.search_keywords;
          this.attributesDet.ref_link = this.ref_link ? this.ref_link : "";

            if(one == ''){
              this.attributesDet.sec_attr_01 = null;              
            }else{
              this.attributesDet.sec_attr_01 = one ;
            }
            if(two == ''){
              this.attributesDet.sec_attr_02 = null;
            }else{
              this.attributesDet.sec_attr_02 =two ;
            }
            if(three == ''){
              this.attributesDet.sec_attr_03 = null;
            }else{
              this.attributesDet.sec_attr_03 = three ;
            }
            if(four == ''){
              this.attributesDet.sec_attr_04 = null;
            }else{
              this.attributesDet.sec_attr_04 =four ;
            }
            if(five == ''){
              this.attributesDet.sec_attr_05 = null;
            }else{
              this.attributesDet.sec_attr_05 =  five;
            }            
            if(six == ''){
              this.attributesDet.sec_attr_06 = null;              
            }else{
              this.attributesDet.sec_attr_06 = six;
            }
            if(seven == ''){
              this.attributesDet.sec_attr_07 = null;
            }else{
              this.attributesDet.sec_attr_07 =  seven;
            }
            if(eight == ''){
              this.attributesDet.sec_attr_08 = null;
            }else{
              this.attributesDet.sec_attr_08 = eight;
            }
            if(nine == ''){
              this.attributesDet.sec_attr_09 = null;
            }else{
              this.attributesDet.sec_attr_09 =  nine;
            }
            if(ten == ''){
              this.attributesDet.sec_attr_10 = null;
            }else{
              this.attributesDet.sec_attr_10 = ten;
            }
            if(eleven == ''){
              this.attributesDet.sec_attr_11 = null;              
            }else{
              this.attributesDet.sec_attr_11 =  eleven;
            }
            if(twelve == ''){
              this.attributesDet.sec_attr_12 = null;
            }else{
              this.attributesDet.sec_attr_12 = twelve;
            }
            if(thirteen == ''){
              this.attributesDet.sec_attr_13 = null;
            }else{
              this.attributesDet.sec_attr_13 =  thirteen;
            }
            if(fourteen == ''){
              this.attributesDet.sec_attr_14 = null;
            }else{
              this.attributesDet.sec_attr_14 = fourteen;
            }
            if(fifteen == ''){
              this.attributesDet.sec_attr_15 = null;
            }else{
              this.attributesDet.sec_attr_15 =  fifteen;
            }
            if(sixteen == ''){
              this.attributesDet.sec_attr_16 = null;              
            }else{
              this.attributesDet.sec_attr_16 = sixteen;
            }

            if(seventeen == ''){
              this.attributesDet.sec_attr_17 = null;
            }else{
              this.attributesDet.sec_attr_17 =  seventeen;
            }
            if(eighteen == ''){
              this.attributesDet.sec_attr_18 = null;
            }else{
              this.attributesDet.sec_attr_18 = eighteen;
            }
            if(ninteen == ''){
              this.attributesDet.sec_attr_19 = null;
            }else{
              this.attributesDet.sec_attr_19 =  ninteen;
            }
            if(twenty == ''){
              this.attributesDet.sec_attr_20 = null;
            }else{
              this.attributesDet.sec_attr_20 = twenty;
            }   
            
          this.attributes.attributes = this.attributesDet;
          this.attributes.item_type = this.item_type;
          this.attributes.itemset_id = this.itemset_id != 0 ? this.itemset_id : null;
          this.attributes.section_id = this.section_id != 0 ? this.section_id : null;
          if(this.pathDirect == 13){
            this.attributes.itemset_item_id = this.getItemService.sendReplaceItemsetId();
            this.attributes.itemset_item_refer_id = this.getItemService.sendReplaceREfId();
          }
          else if(this.pathDirect != 14){
            this.attributes.itemset_item_id = '';
            this.attributes.itemset_item_refer_id = '';
          }
          if (this.pathDirect != 3 && this.pathDirect != 4 && this.pathDirect != 20 && this.pathDirect != 7 && this.pathDirect != 8 && this.pathDirect != 14 && this.item_type != 6) {
            this.attributes.directive_id = localStorage.getItem('directive_id') != '0' && localStorage.getItem('directive_id') != null ? localStorage.getItem('directive_id') : "";
          }
          if (this.item_type == 1 || this.item_type == 2 || this.item_type == 5 || this.item_type == 7) {
            this.attributes.score = this.score;
            
          }

          // MCQ ans blk seq
          if (this.item_type == 1) {
            for (i = 0; i < this.attributes.answer_choices.length; i++) {
              for (var j = 0; j < this.attributes.answer_choices[i].choice_elements.length; j++) {
                this.attributes.answer_choices[i].choice_elements[j].option_df_sequence = j + 1;
                if (this.attributes.answer_choices[i].choice_elements[j].data_format_value == "" || this.attributes.answer_choices[i].choice_elements[j].data_format_value == undefined) {
                  this.attributes.answer_choices[i].choice_elements.splice(j, 1);
                }
              }
            }
          }

          // True or false answer blk seq
          if (this.item_type == 2) {
            for (i = 0; i < this.attributes.answer_choices.length; i++) {
              this.attributes.answer_choices[i].option_df_sequence = 1;
            }
          }

          // question block sequence
          if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type ==5 || this.item_type == 7) {
            for (var i = 0; i < this.attributes.item.length; i++) {
              this.attributes.item[i].item_df_sequence = i + 1;
              this.attributes.score = this.score;




              if(this.attributes.item[i].item_df_id == 7){
                var tblSeq = 1;
                for(var t1=0;t1<this.attributes.item[i].data_format_value.length;t1++){
                  for(var t2=0;t2<this.attributes.item[i].data_format_value[t1].length;t2++){
                    this.attributes.item[i].data_format_value[t1][t2].table_sequence = tblSeq;
                    tblSeq = tblSeq + 1;
                  }
                }
              }if(this.attributes.item[i].item_df_id == 8){
                for(var l1=0;l1<this.attributes.item[i].data_format_value.length;l1++){
                  this.attributes.item[i].data_format_value[l1].list_elements[0].list_sequence = l1+1;
                }
              }
            }
          }

          // exact match match seq
          if (this.matchtypeSelected == 5) {
            var answerchoicesArray = [];
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {

              answerchoicesArray.push(this.attributes.answer_choices[i].choiceElement[0]);

              this.attributes.answer_choices[i].option_df_sequence = 1;
            }
            this.attributes.answer_choices = answerchoicesArray;
          }

          // Matrix match seq
          if (this.matchtypeSelected == 4) {

            // for(var i=0;i<this.matrixAnsBlock.length-4;i++){
            // this.attributes.answer_choices.push(new answerList());
            // }

            for (i = 0; i < this.matrixAnsBlock.length; i++) {
              this.attributes.answer_choices.push(new answerList());
              this.attributes.answer_choices[i].correct_answer = this.matrixAnsBlock[i].correct_answer;
              this.attributes.answer_choices[i].score = this.matrixAnsBlock[i].score;
              this.attributes.answer_choices[i].answer_df_id = 1;
              this.attributes.answer_choices[i].data_identifier = "";
              this.attributes.answer_choices[i].previous_df_id = "";
              this.attributes.answer_choices[i].option_df_sequence = 1;
              this.attributes.answer_choices[i].data_format_value = this.matrixAnsBlock[i].answer_choices.map(value => value.data_format_value).join(",");
              if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
                this.attributes.answer_choices[i].data_id = this.matrixAnsBlock[i].answer_choices[0].data_id;
              }
            }
          }

          // Directive seq
          if (this.item_type == 6) {
            for (var i = 0; i < this.attributes.directive.length; i++) {
              this.attributes.directive[i].item_df_sequence = i + 1;
              if(this.attributes.directive[i].item_df_id == 7){
                var tblSeq = 1;
                for(var t1=0;t1<this.attributes.directive[i].data_format_value.length;t1++){
                  for(var t2=0;t2<this.attributes.directive[i].data_format_value[t1].length;t2++){
                    this.attributes.directive[i].data_format_value[t1][t2].table_sequence = tblSeq;
                    tblSeq = tblSeq + 1;
                  }
                }
              }if(this.attributes.directive[i].item_df_id == 8){
                for(var l1=0;l1<this.attributes.directive[i].data_format_value.length;l1++){
                  this.attributes.directive[i].data_format_value[l1].list_elements[0].list_sequence = l1+1;
                }
              }
            }
          }

          if(this.item_type == 5){
            const pattern1 = /^[^\s].*/;
            for(var t=0;t<this.attributes.answer_choices.length;t++){
              if(!pattern1.test(this.attributes.answer_choices[t].answer_data) || this.attributes.answer_choices[t].answer_data == null){
                this.attributes.answer_choices.splice(t,1)
              }
            }
          }

          if (this.item_type == 3) {
            for (var i = 0; i < this.attributes.item.length; i++) {
              if (this.attributes.item[i].item_df_id == 9) {
                for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
                  var temp = [];
                  for (var k = 0; k < this.attributes.item[i].data_format_value[j].match_data.length; k++) {
                    temp.push(this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0]);

                  }
                  this.attributes.item[i].data_format_value[j].match_data = temp;
                }
              }
            }
          }

          // for file upload item type answer block sequence

          if(this.item_type == 7){
            for(var i=0;i<this.attributes.answer_choices.length;i++){
              this.attributes.answer_choices[i].answer_df_sequence = i+1;
              if(this.attributes.answer_choices[i].description == '' && this.attributes.answer_choices[i].description == null && this.attributes.answer_choices[i].data_format_type.length == 0 && this.attributes.answer_choices[i].fileFormatLits.length == 0){
                this.attributes.answer_choices.splice(i,1);
              }
            }
          }

          this.attributes.org_id = this.cookieService.get('_PAOID');
          
          delete this.attributes.answer_choice_insight;
          delete this.attributes.data_insight;
          this.saveload = true;
          var body = this.attributes;
          var headers = new Headers();
          headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
          headers.append('Content-Type', 'application/json');
          if ((this.attributes.item_id != undefined && this.attributes.item_id != null && this.attributes.item_id != '') || (this.attributes.directive_id != undefined && this.attributes.directive_id != 0 && this.attributes.item_type == 6)) {

            for(var i=0;i<this.attributes.answer_choices.length;i++){
            }

            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              delete this.attributes.answer_choices[i].answer_choice_insight;

              if (this.attributes.answer_choices[i].data_insight === "" || this.attributes.answer_choices[i].data_insight === null ||
                this.attributes.answer_choices[i].answer_choice_insight === undefined) {
                this.attributes.answer_choices[i].data_insight === null;
              }
            }

            delete this.attributesDet.sec_attr_01;
            delete this.attributesDet.sec_attr_02;
            delete this.attributesDet.sec_attr_03;
            delete this.attributesDet.sec_attr_04;
            delete this.attributesDet.sec_attr_05;
            delete this.attributesDet.sec_attr_06;
            delete this.attributesDet.sec_attr_07;
            delete this.attributesDet.sec_attr_08;
            delete this.attributesDet.sec_attr_09;
            delete this.attributesDet.sec_attr_10;
            delete this.attributesDet.sec_attr_11;
            delete this.attributesDet.sec_attr_12;
            delete this.attributesDet.sec_attr_13;
            delete this.attributesDet.sec_attr_14;
            delete this.attributesDet.sec_attr_15;
            delete this.attributesDet.sec_attr_16;
            delete this.attributesDet.sec_attr_17;
            delete this.attributesDet.sec_attr_18;
            delete this.attributesDet.sec_attr_19;
            delete this.attributesDet.sec_attr_20;

            if(one == ''){
              this.attributesDet.sec_attribute_1 = null;              
            }else{
              this.attributesDet.sec_attribute_1 = one ;
            }
            if(two == ''){
              this.attributesDet.sec_attribute_2 = null;
            }else{
              this.attributesDet.sec_attribute_2 =two ;
            }
            if(three == ''){
              this.attributesDet.sec_attribute_3 = null;
            }else{
              this.attributesDet.sec_attribute_3 = three ;
            }
            if(four == ''){
              this.attributesDet.sec_attribute_4 = null;
            }else{
              this.attributesDet.sec_attribute_4 =four ;
            }
            if(five == ''){
              this.attributesDet.sec_attribute_5 = null;
            }else{
              this.attributesDet.sec_attribute_5 =  five;
            }            
            if(six == ''){
              this.attributesDet.sec_attribute_6 = null;              
            }else{
              this.attributesDet.sec_attribute_6 = six;
            }
            if(seven == ''){
              this.attributesDet.sec_attribute_7 = null;
            }else{
              this.attributesDet.sec_attribute_7 =  seven;
            }
            if(eight == ''){
              this.attributesDet.sec_attribute_8 = null;
            }else{
              this.attributesDet.sec_attribute_8 = eight;
            }
            if(nine == ''){
              this.attributesDet.sec_attribute_9 = null;
            }else{
              this.attributesDet.sec_attribute_9 =  nine;
            }
            if(ten == ''){
              this.attributesDet.sec_attribute_10 = null;
            }else{
              this.attributesDet.sec_attribute_10 = ten;
            }
            if(eleven == ''){
              this.attributesDet.sec_attribute_11 = null;              
            }else{
              this.attributesDet.sec_attribute_11 =  eleven;
            }
            if(twelve == ''){
              this.attributesDet.sec_attribute_12 = null;
            }else{
              this.attributesDet.sec_attribute_12 = twelve;
            }
            if(thirteen == ''){
              this.attributesDet.sec_attribute_13 = null;
            }else{
              this.attributesDet.sec_attribute_13 =  thirteen;
            }
            if(fourteen == ''){
              this.attributesDet.sec_attribute_14 = null;
            }else{
              this.attributesDet.sec_attribute_14 = fourteen;
            }
            if(fifteen == ''){
              this.attributesDet.sec_attribute_15 = null;
            }else{
              this.attributesDet.sec_attribute_15 =  fifteen;
            }
            if(sixteen == ''){
              this.attributesDet.sec_attribute_16 = null;              
            }else{
              this.attributesDet.sec_attribute_16 = sixteen;
            }

            if(seventeen == ''){
              this.attributesDet.sec_attribute_17 = null;
            }else{
              this.attributesDet.sec_attribute_17 =  seventeen;
            }
            if(eighteen == ''){
              this.attributesDet.sec_attribute_18 = null;
            }else{
              this.attributesDet.sec_attribute_18 = eighteen;
            }
            if(ninteen == ''){
              this.attributesDet.sec_attribute_19 = null;
            }else{
              this.attributesDet.sec_attribute_19 =  ninteen;
            }
            if(twenty == ''){
              this.attributesDet.sec_attribute_20 = null;
            }else{
              this.attributesDet.sec_attribute_20 = twenty;
            }   

            return this.http.put(credentials.host + '/item_edit', body, { headers: headers })
              .map(res => res.json())
              .catch((e: any) => {
                return Observable.throw(e)
              })

              .subscribe(
              data => {
                this.sec_attr_0 = null;
                this.sec_attr_1 = null;
                this.sec_attr_2 = null;
                this.sec_attr_3 = null;
                this.sec_attr_4 = null;
                this.sec_attr_5 = null;
                this.sec_attr_6 = null;
                this.sec_attr_7 = null;
                this.sec_attr_8 = null;
                this.sec_attr_9 = null;
                this.sec_attr_10 = null;
                this.sec_attr_11 = null;
                this.sec_attr_12 = null;
                this.sec_attr_13 = null;
                this.sec_attr_14 = null;
                this.sec_attr_15 = null;
                this.sec_attr_16 = null;
                this.sec_attr_17 = null;
                this.sec_attr_18 = null;
                this.sec_attr_19 = null;
                if (data.success == true) {

                  this.isDirective = 0;
                  this.saveload = false;
                  this._notifications.create('', data.message, 'info')
                  // this.showMsg = "Item Updated Successfully";
                  // this.saveMSg = true;
                  if (this.attributes.item_type == 6 && (this.directive_id != 0 && this.directive_id != null && this.directive_id != "" && this.directive_id != undefined)) {
                    // this.exitDirective();
                    this.saveMSg = false;
                  }

                  if(this.cameFrom == true) {
                    localStorage.removeItem("_tmpURL");
                    if(this.goToHere == '/ItemSets/viewitemsets'){
                      // this.router.navigateByUrl(this.goToHere + '/0/0/0');
                      this.router.navigate([this.goToHere,0,0,0]);

                    }else if(this.goToHere == '/as-an-author/to-create') {
                      // this.router.navigateByUrl(this.goToHere);
                      this.router.navigate([this.goToHere]);
                    }else if (this.goToHere == '/as-an-author/to-modify') {
                      this.router.navigate([this.goToHere]);
                    }else if (this.goToHere == '/as-a-reviewer/to-review') {
                      this.router.navigate([this.goToHere]);
                    }
                  }else {
                    if (this.itemset_id != 0 && this.section_id != 0) {
                      if(this.pathDirect == 14){
                        setTimeout(() => {
                          this.router.navigate(['as-an-author/under-review', this.itemset_id, this.section_id, this.pathDirect]);
                        }, 3000);
                      }
                      else if(this.pathDirect == 20 || this.pathDirect == 19){
                        setTimeout(() => {
                          this.router.navigate(['as-an-author/to-create', this.itemset_id, this.section_id, this.pathDirect]);
                          localStorage.setItem('directive_id', '0');
                          localStorage.setItem('item_count', '0');
                        }, 3000);
                      }
                      else{
                        setTimeout(() => {
                          this.router.navigate(['ItemSets/viewitemsets', this.itemset_id, this.section_id, this.pathDirect]);
                        }, 3000);
                      }
                    }
                    else if (this.itemset_id == 0 && this.section_id == 0 && this.pathDirect == 7) {
                      setTimeout(() => {
                        this.router.navigate(['Items/viewitems', this.bulkUploadId]);
                      }, 3000);
                    }
                    else if (this.itemset_id == 0 && this.section_id == 0 && this.pathDirect == 8) {
                      setTimeout(() => {
                        this.router.navigate(['Items/bulkuploadItems']);
                      }, 3000);
                    }
                    else if (this.attributes.directive_id != '' && this.item_type != 6) {
                      this.viewItemDirective(this.attributes.directive_id);
                      setTimeout(() => {
                        this.saveMSg = false;
                      }, 3000);
                    }
                    else {
                      setTimeout(() => {
                        location.reload();
                      }, 3000);

                    }
                  }



                } else {
                  this._notifications.create('', data.message, 'error')
                  this.saveload = false;
                  // this.showMsg = data.message;
                  // this.saveMSg = true;
                  setTimeout(() => {
                    this.saveMSg = false;
                  }, 3000);
                }

              },
              error => {

                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              );
          }
          else {

            for (var i = 0; i < this.attributes.answer_choices.length; i++) {
              delete this.attributes.answer_choices[i].data_insight;

              if (this.attributes.answer_choices[i].answer_choice_insight === "" || this.attributes.answer_choices[i].answer_choice_insight === null ||
                this.attributes.answer_choices[i].answer_choice_insight === undefined) {
                this.attributes.answer_choices[i].answer_choice_insight = null;
              }
            }

            return this.http.post(credentials.host + '/item_create', body, { headers: headers })
              .map(res => res.json())
              .catch((e: any) => {
                return Observable.throw(e)
              })

              .subscribe(
              data => {

                this.sec_attr_0 = null;
                this.sec_attr_1 = null;
                this.sec_attr_2 = null;
                this.sec_attr_3 = null;
                this.sec_attr_4 = null;
                this.sec_attr_5 = null;
                this.sec_attr_6 = null;
                this.sec_attr_7 = null;
                this.sec_attr_8 = null;
                this.sec_attr_9 = null;
                this.sec_attr_10 = null;
                this.sec_attr_11 = null;
                this.sec_attr_12 = null;
                this.sec_attr_13 = null;
                this.sec_attr_14 = null;
                this.sec_attr_15 = null;
                this.sec_attr_16 = null;
                this.sec_attr_17 = null;
                this.sec_attr_18 = null;
                this.sec_attr_19 = null;

                if (data.success == true) {

                  if ((data.directive_id)) {
                    this.directive_id = data.directive_id;
                    localStorage.setItem('directive_id', data.directive_id);
                  }
                  if (data.item_count) {
                    this.itemCount = data.item_count;
                    localStorage.setItem('item_count', data.item_count);
                  }
                  this.saveload = false;
                  this._notifications.create('', data.message, 'info')
                  // this.showMsg = data.message;
                  // this.saveMSg = true;

                  if(this.cameFrom == true) {
                    localStorage.removeItem("_tmpURL");
                    if(this.goToHere == '/ItemSets/viewitemsets'){
                      // this.router.navigateByUrl(this.goToHere + '/0/0/0');
                      this.router.navigate([this.goToHere,0,0,0]);

                    }else if(this.goToHere == '/as-an-author/to-create') {
                      // this.router.navigateByUrl(this.goToHere);
                      this.router.navigate([this.goToHere]);
                    }else if (this.goToHere == '/as-an-author/to-modify') {
                      this.router.navigate([this.goToHere]);
                    }else if (this.goToHere == '/as-a-reviewer/to-review') {
                      this.router.navigate([this.goToHere]);
                    }
                  }else {
                    if (this.itemset_id != 0 && this.section_id != 0 && this.item_type != 6) {
                      if(this.pathDirect == 11 || this.pathDirect == 12 || this.pathDirect == 20 || this.pathDirect == 19){
                        setTimeout(() => {
                          this.router.navigate(['as-an-author/to-create', this.itemset_id, this.section_id, this.pathDirect]);
                          localStorage.setItem('directive_id', '0');
                          localStorage.setItem('item_count', '0');
                        }, 3000);
                      }else if(this.pathDirect == 13){
                        setTimeout(() => {
                          this.router.navigate(['as-an-author/under-review', this.itemset_id, this.section_id, this.pathDirect]);
                          localStorage.setItem('directive_id', '0');
                          localStorage.setItem('item_count', '0');
                        }, 3000);
                      }
                      else{
                        setTimeout(() => {
                          this.router.navigate(['ItemSets/viewitemsets', this.itemset_id, this.section_id, this.pathDirect]);
                          localStorage.setItem('directive_id', '0');
                          localStorage.setItem('item_count', '0');
                        }, 3000);
                      }

                    } else if (this.item_type != 6 && this.attributes.directive_id == '') {
                      setTimeout(() => {
                        // this.router.navigate(['Items/viewitems', 'allitem']);
                        this.cancelUnsavedItem();
                      }, 3000);
                    } else if (this.attributes.directive_id != '' && this.item_type != 6) {
                      this.viewItemDirective(this.directive_id);
                      setTimeout(() => {
                        this.saveMSg = false;
                      }, 3000);
                    }
                    else {
                      setTimeout(() => {
                        this.saveMSg = false;
                      }, 3000);
                      //clear attributes
                      this.topicsList = [];
                      this.subtopicList = [];
                      this.selectedSub = [];
                      this.selectedTopic = [];
                      this.selectedSubtopic = [];
                      this.difficulty_level = undefined;
                      this.taxonomy = undefined;
                      this.content_type = [];
                      this.item_valid_till = null;
                      this.explanation = "";
                      this.hint = "";
                      this.search_keywords = "";
                      this.ref_link = "";
                      this.score = 0;
                      //create directive block
                      if (localStorage.getItem('directive_id') != '0' && localStorage.getItem('directive_id') != null) {
                        this.directive_id = localStorage.getItem('directive_id');
                        this.itemCount = localStorage.getItem('item_count');
                        this.activeIndex = 3;
                        this.item_type = 6;
                        this.directiveBlk = true;
                        this.questionCount = 0;
                        this.mcqBlk = false;
                        this.attributes.item = [];
                        this.attributes.directive = [];
                        this.attributes.directive.push(new itemList);
                        this.attributes.directive[0].item_df_id = 1;
                        this.attributes.directive[0].item_df_sequence = 1;
                        this.attributes.directive[0].data_format_value = "";
                        this.attributes.directive[0].data_identifier = "";
                        this.attributes.directive[0].previous_df_id = "";
                      }
                    }
                  }

                } else {
                  this.saveload = false;
                  this._notifications.create('', data.message, 'error')
                  // this.showMsg = data.message;
                  // this.saveMSg = true;
                  setTimeout(() => {
                    this.saveMSg = false;
                  }, 3000);
                }

              },
              error => {

                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              );
          }
        }
      }
    }
  }

  on_CF_Value_Select(obj){
    // alert(JSON.stringify(obj))
  }
   //save As item
   saveAsItem() {

    this.checkvalidation();
    var flag;
    if (this.authService.canActivate()) {
      if (this.subErr == false && this.topErr == false && this.diffErr == false
        && this.taxErr == false &&  this.keyErr == false && this.errIndex == -1
        && this.ansIndex == -1 && this.graded == 0 && this.listArrayErr == -1 && this.listRowErr == -1 && this.tblColumnDataErr == -1 &&
        this.scoreIndex == 0 && this.fileTypeErr == false && this.fileFormatErr == false) {
        if (this.item_type == 1 || this.item_type == 2 || this.matchtypeSelected == 4 || this.matchtypeSelected == 5) {

          if (this.attributes.score_type == "Item Lvl Score") {
            if (this.arrayItem.length > 0 && this.itemLevelMultipleCrtAns == 0) {
              flag = true;
              if (this.item_type == 3) {
                if (this.matchIndex == -1 && this.matchGradedScore == -1 && this.scoreIndexMatch == 0 && this.totalGraderScoreErr == 0) {
                  flag = true;
                } else {
                  flag = false;
                }
              }
            }
          }
          else if (this.attributes.score_type == "Graded Score") {
            if (this.checkarray.length > 0 && this.gradedLevelSingleCrtAns == 0 && this.totalGradedScoreCount == 0 && this.NegAnsAlert == 0) {
              flag = true;
              if (this.item_type == 3) {
                if (this.matchIndex == -1 && this.matchGradedScore == -1 && this.scoreIndexMatch == 0 && this.totalGraderScoreErr == 0) {
                  flag = true;
                } else {
                  flag = false;
                }
              }
            }
          }
        } else if (this.item_type == 3 && (this.matchtypeSelected == 1 || this.matchtypeSelected == 2 || this.matchtypeSelected == 3)) {
          if (this.matchIndex == -1 && this.matchGradedScore == -1 && this.scoreIndexMatch == 0 && this.totalGraderScoreErr == 0) {
            flag = true;
          } else {
            flag = false;
          }
        }
        if (this.item_type == 6) {
          if (this.directiveErr == -1) {
            flag = true;
          } else {
            flag = false;
          }
        }

        if(this.item_type == 5 || this.item_type == 7){
          if(this.freeTextGradedScoreErr == -1 && this.freeTextGradedTotalScoreErr == -1){
            flag= true;
          }else {
            flag= false;
          }
        }

        if (flag == true) {

          this.attributesDet.subject = this.selectedSub;
          this.attributesDet.topic = this.selectedTopic;
          this.attributesDet.subtopic = this.selectedSubtopic;
          this.attributesDet.difficulty_level = this.difficulty_level;
          this.attributesDet.taxonomy = this.taxonomy;
          this.attributesDet.content_type = this.content_type;
          this.attributesDet.item_valid_till = this.item_valid_till ? this.item_valid_till.date : "";
          this.attributesDet.explanation = this.explanation;
          if(this.attributesDet.explanation == undefined){
            this.attributesDet.explanation = '';
          }
          this.attributesDet.hint = this.hint ? this.hint : "";
          this.attributesDet.search_keywords = this.search_keywords;
          this.attributesDet.ref_link = this.ref_link ? this.ref_link : "";
          this.attributes.save_as = true;
          this.attributes.attributes = this.attributesDet;
          this.attributes.item_type = this.item_type;
          this.attributes.itemset_id = this.itemset_id != 0 ? this.itemset_id : null;
          this.attributes.section_id = this.section_id != 0 ? this.section_id : null;

          if(this.pathDirect == 13){
            this.attributes.itemset_item_id = this.getItemService.sendReplaceItemsetId();
            this.attributes.itemset_item_refer_id = this.getItemService.sendReplaceREfId();
          }
          else if(this.pathDirect != 14){
            this.attributes.itemset_item_id = '';
            this.attributes.itemset_item_refer_id = '';
          }

          if (this.pathDirect != 3 && this.pathDirect != 4 && this.pathDirect != 20 && this.pathDirect != 7 && this.pathDirect != 8 && this.pathDirect != 14 && this.item_type != 6) {
            this.attributes.directive_id = localStorage.getItem('directive_id') != '0' && localStorage.getItem('directive_id') != null ? localStorage.getItem('directive_id') : "";
          }
          if (this.item_type == 1 || this.item_type == 2 || this.item_type == 5 || this.item_type == 7) {
            this.attributes.score = this.score;
            // this.attributes.answer_choice_insight = this.item_Insight_Value;
            // if(this.attributes.answer_choice_insight === '' || this.attributes.answer_choice_insight === null || this.attributes.answer_choice_insight === undefined){
            //   this.attributes.answer_choice_insight = null;
            // }
            // if(this.attributes.data_insight === '' || this.attributes.data_insight === null || this.attributes.data_insight === undefined){
            //   this.attributes.data_insight = null;
            // }
          }

          // MCQ ans blk seq
          if (this.item_type == 1) {
            for (i = 0; i < this.attributes.answer_choices.length; i++) {
              for (var j = 0; j < this.attributes.answer_choices[i].choice_elements.length; j++) {
                this.attributes.answer_choices[i].choice_elements[j].option_df_sequence = j + 1;
                if (this.attributes.answer_choices[i].choice_elements[j].data_format_value == "" || this.attributes.answer_choices[i].choice_elements[j].data_format_value == undefined) {
                  this.attributes.answer_choices[i].choice_elements.splice(j, 1);
                }
              }
            }
          }

          // True or false answer blk seq
          if (this.item_type == 2) {
            for (i = 0; i < this.attributes.answer_choices.length; i++) {
              this.attributes.answer_choices[i].option_df_sequence = 1;
            }
          }

          // question block sequence
          if (this.item_type == 1 || this.item_type == 2 || this.item_type == 3 || this.item_type == 5) {
            for (var i = 0; i < this.attributes.item.length; i++) {
              this.attributes.item[i].item_df_sequence = i + 1;
              this.attributes.score = this.score;
              // this.attributes.answer_choice_insight = this.item_Insight_Value;
            // if(this.attributes.answer_choice_insight === '' || this.attributes.answer_choice_insight === null || this.attributes.answer_choice_insight === undefined){
            //   this.attributes.answer_choice_insight = null;
            // }
            // if(this.attributes.data_insight === '' || this.attributes.data_insight === null || this.attributes.data_insight === undefined){
            //   this.attributes.data_insight = null;
            // }
              if(this.attributes.item[i].item_df_id == 7){
                var tblSeq = 1;
                for(var t1=0;t1<this.attributes.item[i].data_format_value.length;t1++){
                  for(var t2=0;t2<this.attributes.item[i].data_format_value[t1].length;t2++){
                    this.attributes.item[i].data_format_value[t1][t2].table_sequence = tblSeq;
                    tblSeq = tblSeq + 1;
                  }
                }
              }if(this.attributes.item[i].item_df_id == 8){
                for(var l1=0;l1<this.attributes.item[i].data_format_value.length;l1++){
                  this.attributes.item[i].data_format_value[l1].list_elements[0].list_sequence = l1+1;
                }
              }
            }
          }

          // exact match match seq
          if (this.matchtypeSelected == 5) {
            var answerchoicesArray = [];
            for (var i = 0; i < this.attributes.answer_choices.length; i++) {

              answerchoicesArray.push(this.attributes.answer_choices[i].choiceElement[0]);

              this.attributes.answer_choices[i].option_df_sequence = 1;
            }
            this.attributes.answer_choices = answerchoicesArray;
          }

          // Matrix match seq
          if (this.matchtypeSelected == 4) {

            // for(var i=0;i<this.matrixAnsBlock.length-4;i++){
            // this.attributes.answer_choices.push(new answerList());
            // }

            for (i = 0; i < this.matrixAnsBlock.length; i++) {
              this.attributes.answer_choices[i].correct_answer = this.matrixAnsBlock[i].correct_answer;
              this.attributes.answer_choices[i].score = this.matrixAnsBlock[i].score;
              this.attributes.answer_choices[i].answer_choice_insight = this.matrixAnsBlock[i].answer_choice_insight;
              this.attributes.answer_choices[i].data_insight = this.matrixAnsBlock[i].data_insight;
              this.attributes.answer_choices[i].answer_df_id = 1;
              this.attributes.answer_choices[i].data_identifier = "";
              this.attributes.answer_choices[i].previous_df_id = "";
              this.attributes.answer_choices[i].option_df_sequence = 1;
              this.attributes.answer_choices[i].data_format_value = this.matrixAnsBlock[i].answer_choices.map(value => value.data_format_value).join(",");
              if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
                this.attributes.answer_choices[i].data_id = this.matrixAnsBlock[i].answer_choices[0].data_id;
              }
            }
          }

          // Directive seq
          if (this.item_type == 6) {
            for (var i = 0; i < this.attributes.directive.length; i++) {
              this.attributes.directive[i].item_df_sequence = i + 1;
              if(this.attributes.directive[i].item_df_id == 7){
                var tblSeq = 1;
                for(var t1=0;t1<this.attributes.directive[i].data_format_value.length;t1++){
                  for(var t2=0;t2<this.attributes.directive[i].data_format_value[t1].length;t2++){
                    this.attributes.directive[i].data_format_value[t1][t2].table_sequence = tblSeq;
                    tblSeq = tblSeq + 1;
                  }
                }
              }if(this.attributes.directive[i].item_df_id == 8){
                for(var l1=0;l1<this.attributes.directive[i].data_format_value.length;l1++){
                  this.attributes.directive[i].data_format_value[l1].list_elements[0].list_sequence = l1+1;
                }
              }
            }
          }

          if(this.item_type == 5){
            const pattern1 = /^[^\s].*/;
            for(var t=0;t<this.attributes.answer_choices.length;t++){
              if(!pattern1.test(this.attributes.answer_choices[t].answer_data) || this.attributes.answer_choices[t].answer_data == null){
                this.attributes.answer_choices.splice(t,1)
              }
            }
          }


          if (this.item_type == 3) {
            for (var i = 0; i < this.attributes.item.length; i++) {
              if (this.attributes.item[i].item_df_id == 9) {
                for (var j = 0; j < this.attributes.item[i].data_format_value.length; j++) {
                  var temp = [];
                  for (var k = 0; k < this.attributes.item[i].data_format_value[j].match_data.length; k++) {
                    temp.push(this.attributes.item[i].data_format_value[j].match_data[k].matchValueArray[0]);

                  }
                  this.attributes.item[i].data_format_value[j].match_data = temp;
                }
              }
            }
          }

          this.attributes.org_id = this.cookieService.get('_PAOID');

          this.saveload = true;
          var body = this.attributes;
          var headers = new Headers();
          headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
          headers.append('Content-Type', 'application/json');

            return this.http.post(credentials.host + '/item_create', body, { headers: headers })
              .map(res => res.json())
              .catch((e: any) => {
                return Observable.throw(e)
              })

              .subscribe(
              data => {
                if (data.success == true) {

                  if ((data.directive_id)) {
                    this.directive_id = data.directive_id;
                    localStorage.setItem('directive_id', data.directive_id);
                  }
                  if (data.item_count) {
                    this.itemCount = data.item_count;
                    localStorage.setItem('item_count', data.item_count);
                  }
                  this.saveload = false;
                  this._notifications.create('', data.message, 'info')
                  // this.showMsg = data.message;
                  // this.saveMSg = true;

                  if(this.cameFrom == true) {
                    localStorage.removeItem("_tmpURL");
                    if(this.goToHere == '/ItemSets/viewitemsets'){
                      // this.router.navigateByUrl(this.goToHere + '/0/0/0');
                      this.router.navigate([this.goToHere,0,0,0]);

                    }else if(this.goToHere == '/as-an-author/to-create') {
                      // this.router.navigateByUrl(this.goToHere);
                      this.router.navigate([this.goToHere]);
                    }else if (this.goToHere == '/as-an-author/to-modify') {
                      this.router.navigate([this.goToHere]);
                    }else if (this.goToHere == '/as-a-reviewer/to-review') {
                      this.router.navigate([this.goToHere]);
                    }
                  } else {
                    if (this.itemset_id != 0 && this.section_id != 0 && this.item_type != 6) {
                      if(this.pathDirect == 11 || this.pathDirect == 12 || this.pathDirect == 20 || this.pathDirect == 19){
                        setTimeout(() => {
                          this.router.navigate(['as-an-author/to-create', this.itemset_id, this.section_id, this.pathDirect]);
                          localStorage.setItem('directive_id', '0');
                          localStorage.setItem('item_count', '0');
                        }, 3000);

                      }else if(this.pathDirect == 14){
                        setTimeout(() => {
                          this.router.navigate(['as-an-author/under-review', this.itemset_id, this.section_id, this.pathDirect]);
                          localStorage.setItem('directive_id', '0');
                          localStorage.setItem('item_count', '0');
                        }, 3000);

                      }else{
                        setTimeout(() => {
                          this.router.navigate(['ItemSets/viewitemsets', this.itemset_id, this.section_id, this.pathDirect]);
                          localStorage.setItem('directive_id', '0');
                          localStorage.setItem('item_count', '0');
                        }, 3000);
                      }

                    } else if (this.item_type != 6 && this.attributes.directive_id == '') {
                      setTimeout(() => {
                        // this.router.navigate(['author/Items/viewitems', 'allitem']);
                        this.cancelUnsavedItem();
                      }, 3000);
                    } else if (this.attributes.directive_id != '' && this.item_type != 6) {
                      this.viewItemDirective(this.directive_id);
                      setTimeout(() => {
                        this.saveMSg = false;
                      }, 3000);
                    }
                    else {
                      setTimeout(() => {
                        this.saveMSg = false;
                      }, 3000);
                      //clear attributes
                      this.topicsList = [];
                      this.subtopicList = [];
                      this.selectedSub = [];
                      this.selectedTopic = [];
                      this.selectedSubtopic = [];
                      this.difficulty_level = undefined;
                      this.taxonomy = undefined;
                      this.content_type = [];
                      this.item_valid_till = null;
                      this.explanation = "";
                      this.hint = "";
                      this.search_keywords = "";
                      this.ref_link = "";
                      this.score = 0;
                      //create directive block
                      if (localStorage.getItem('directive_id') != '0' && localStorage.getItem('directive_id') != null) {
                        this.directive_id = localStorage.getItem('directive_id');
                        this.itemCount = localStorage.getItem('item_count');
                        this.activeIndex = 3;
                        this.item_type = 6;
                        this.directiveBlk = true;
                        this.questionCount = 0;
                        this.mcqBlk = false;
                        this.attributes.item = [];
                        this.attributes.directive = [];
                        this.attributes.directive.push(new itemList);
                        this.attributes.directive[0].item_df_id = 1;
                        this.attributes.directive[0].item_df_sequence = 1;
                        this.attributes.directive[0].data_format_value = "";
                        this.attributes.directive[0].data_identifier = "";
                        this.attributes.directive[0].previous_df_id = "";
                      }
                    }
                  }

                } else {
                  this.saveload = false;
                  this._notifications.create('', data.message, 'error')
                  // this.showMsg = data.message;
                  // this.saveMSg = true;
                  setTimeout(() => {
                    this.saveMSg = false;
                  }, 3000);
                }

              },
              error => {

                this.saveload = false;
                if (error.status == 404) {
                  this.router.navigateByUrl('pages/NotFound');
                }
                else if (error.status == 401) {
                  this.cookieService.deleteAll();
                  window.location.href = credentials.accountUrl;
                  // window.location.href='https://accounts.scora.in';
                }
                else {
                  this.router.navigateByUrl('pages/serverError');
                }

              }
              );

        }
      }
    }
  }



  ngOnInit() {
  this.answer_Option_data = null;
  this.sec_attr_0 = null;
  this.sec_attr_1 = null;
  this.sec_attr_2 = null;
  this.sec_attr_3 = null;
  this.sec_attr_4 = null;
  this.sec_attr_5 = null;
  this.sec_attr_6 = null;
  this.sec_attr_7 = null;
  this.sec_attr_8 = null;
  this.sec_attr_9 = null;
  this.sec_attr_10 = null;
  this.sec_attr_11 = null;
  this.sec_attr_12 = null;
  this.sec_attr_13 = null;
  this.sec_attr_14 = null;
  this.sec_attr_15 = null;
  this.sec_attr_16 = null;
  this.sec_attr_17 = null;
  this.sec_attr_18 = null;
  this.sec_attr_19 = null;
    this.getTenantMetaData();
    this.activeTab = 0;
    this.getTenantAllUsers();
    this.open_Attribute_Tab = true;
    this.open_Custom_Attribute_Tab = false;
    this.cameFrom = false;
    this.goToHere = '';
    this.item_Description = '';
    this.Insight_Value = ''
    this.lsshow = false;

    const thisIsURL = localStorage.getItem("_tmpURL");

    if(thisIsURL != '' && thisIsURL != undefined && thisIsURL != null) {
      this.goToHere = thisIsURL;
      this.cameFrom = true;
    } else {
      this.goToHere = '';
      this.cameFrom = false;
    }


    // editor
    //   this.ckeConfig = {
    //     height: 500,
    //     language: "en",
    //     allowedContent: true,
    //     extraPlugins: "divarea",
    //     toolbar: [
    //         { name: "editing", items: ["Scayt", "Find", "Replace", "SelectAll"] },
    //         { name: "clipboard", items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "-", "Undo", "Redo"] },
    //         { name: "links", items: ["Link", "Unlink", "Anchor"] },
    //         { name: "tools", items: ["Maximize", "ShowBlocks", "Preview", "Print", "Templates"] },
    //         { name: "document", items: ["Source"] },
    //         { name: "insert", items: ["Image", "Table", "HorizontalRule", "SpecialChar", "Iframe", "imageExplorer"] },
    //         "/",
    //         { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "-", "RemoveFormat"] },
    //         { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "CreateDiv", "-", "Blockquote"] },
    //         { name: "justify", items: ["JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"] },
    //         { name: "styles", items: ["Styles", "Format", "FontSize", "-", "TextColor", "BGColor"] }
    //     ]
    // };











    this.getMetaData();

    // by default check for directive id in localStorage to make direcitve item by default or else it is MCQ

    if (localStorage.getItem('directive_id') != '0' && localStorage.getItem('directive_id') != null) {
      this.directive_id = localStorage.getItem('directive_id');
      this.itemCount = localStorage.getItem('item_count');
      this.activeIndex = 3;
      this.item_type = 6;
      this.directiveBlk = true;
      this.questionCount = 0;
      this.mcqBlk = false;
      this.attributes.directive.push(new itemList);
      this.attributes.directive[0].item_df_id = 1;
      this.attributes.directive[0].item_df_sequence = 1;
      this.attributes.directive[0].data_format_value = "";
      this.attributes.directive[0].data_identifier = "";
      this.attributes.directive[0].previous_df_id = "";


      this.route.params.subscribe(
        (params) => {

          this.itemset_id = params.itemSetId;
          this.section_id = params.sectionId;
          this.pathDirect = params.path;
          if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
            this.viewItemQuestions = [];
            this.viewItemQuestions.push(this.getItemService.sendResponse());
            // console.log(this.viewItemQuestions)
            this.itemsetDet = this.getItemService.sendItemsetDet();
            // this.editItemDirective(0);
            this.activeMatchState = 0;
            this.showIcon = true;
          }
        }
      );

      if (this.pathDirect != 3 && this.pathDirect != 4 && this.pathDirect != 20 && this.pathDirect != 7 && this.pathDirect != 8 && this.pathDirect != 14 && this.item_type != 6) {
        this.activeIndex = 0;
        this.mcqBlk = true;
        this.directiveBlk = false;
        this.item_type = 1;

        this.attributes.answer_type = "Single Answer";
        this.attributes.score_type = "Item Lvl Score";
        this.trueorfalseBlk = false;
        this.content_type = [];
        this.content1 = [];
        this.score = 0;
        this.showGradedScore = true;
        this.showGradedScore1 = true;
        this.selectedType = false;
        this.activeMatchState = 0;
        this.showIcon = true;
      }


    }
    else {

      for (this.counter = 0; this.counter < 4; this.counter++) {
        this.attributes.answer_choices.push(new answerChoice());
        this.attributes.answer_choices[this.counter].choice_elements.push(new answerChoiceType());
        this.attributes.answer_choices[this.counter].choice_elements[0].option_df_sequence = 1;
        this.attributes.answer_choices[this.counter].choice_elements[0].data_format_value = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].data_identifier = "";
        this.attributes.answer_choices[this.counter].choice_elements[0].previous_df_id = "";
        this.attributes.answer_choices[this.counter].score = 0;
        this.attributes.answer_choices[this.counter].answer_choice_insight = "";        
        this.attributes.answer_choices[this.counter].data_insight = "";

        if(this.attributes.answer_choices[this.counter].answer_choice_insight === ""){
           this.attributes.answer_choices[this.counter].answer_choice_insight = null;
        }
        if(this.attributes.answer_choices[this.counter].data_insight === ""){
           this.attributes.answer_choices[this.counter].data_insight = null;
        }

      }
      this.route.params.subscribe(
        (params) => {

          this.itemset_id = params.itemSetId;
          this.section_id = params.sectionId;
          this.pathDirect = params.path;

        }
      );
      if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
        this.viewItemQuestions = [];
        this.viewItemQuestions.push(this.getItemService.sendResponse()); //response for edit page
        //this is for edit
        var temp_var;
        var temp_arr = [];

              
                //bind item type mcq answer choice insight
                if(this.viewItemQuestions[0].item_type === 1){
                  for(let data of this.viewItemQuestions[0].answer_choices){
                    for(let datas of data.choice_elements){
                      data.answer_choice_insight = datas.data_insight;
                      break
                    }
                  }
                }

                //bind item type true or false answer choice insight
                if(this.viewItemQuestions[0].item_type === 2){
                  for(let data of this.viewItemQuestions[0].answer_choices){
                    data.answer_choice_insight = data.data_insight;
                  }
                }
                
                

                this.sec_attr_0 = this.viewItemQuestions[0].attributes.sec_attribute_1;
                this.sec_attr_1 = this.viewItemQuestions[0].attributes.sec_attribute_2;
                this.sec_attr_2 = this.viewItemQuestions[0].attributes.sec_attribute_3;
                this.sec_attr_3 = this.viewItemQuestions[0].attributes.sec_attribute_4;
                this.sec_attr_4 = this.viewItemQuestions[0].attributes.sec_attribute_5;
                this.sec_attr_5 = this.viewItemQuestions[0].attributes.sec_attribute_6;
                this.sec_attr_6 = this.viewItemQuestions[0].attributes.sec_attribute_7;
                this.sec_attr_7 = this.viewItemQuestions[0].attributes.sec_attribute_8;
                this.sec_attr_8 = this.viewItemQuestions[0].attributes.sec_attribute_9;
                this.sec_attr_9 = this.viewItemQuestions[0].attributes.sec_attribute_10;
                this.sec_attr_10 = this.viewItemQuestions[0].attributes.sec_attribute_11;
                this.sec_attr_11 = this.viewItemQuestions[0].attributes.sec_attribute_12;
                this.sec_attr_12 = this.viewItemQuestions[0].attributes.sec_attribute_13;
                this.sec_attr_13 = this.viewItemQuestions[0].attributes.sec_attribute_14;
                this.sec_attr_14 = this.viewItemQuestions[0].attributes.sec_attribute_15;
                this.sec_attr_15 = this.viewItemQuestions[0].attributes.sec_attribute_16;
                this.sec_attr_16 = this.viewItemQuestions[0].attributes.sec_attribute_17;
                this.sec_attr_17 = this.viewItemQuestions[0].attributes.sec_attribute_18;
                this.sec_attr_18 = this.viewItemQuestions[0].attributes.sec_attribute_19;
                this.sec_attr_19 = this.viewItemQuestions[0].attributes.sec_attribute_20;

        //         console.log(this.viewItemQuestions)
        // console.log(this.viewItemQuestions)
        this.itemsetDet = this.getItemService.sendItemsetDet();
        this.bulkUploadId = this.getItemService.sendUploadId();

        // this.editItemDirective(0);
        this.showIcon = true;
        this.activeMatchState = 0;
      }
      if (this.pathDirect != 3 && this.pathDirect != 4 && this.pathDirect != 20 && this.pathDirect != 7 && this.pathDirect != 8 && this.pathDirect != 14) {
        this.activeIndex = 0;
        this.mcqBlk = true;
        this.directiveBlk = false;
        this.item_type = 1;

        this.attributes.answer_type = "Single Answer";
        this.attributes.score_type = "Item Lvl Score";
        this.trueorfalseBlk = false;
        this.content_type = [];
        this.content1 = [];
        this.score = 1;
        this.showGradedScore = true;
        this.showGradedScore1 = true;
        this.selectedType = false;
        this.activeMatchState = 0;
        this.showIcon = true;
      }
    }

    this.showIcon = true;



    this.settings1 = {
      singleSelection: false,
      text: "Select Subjects",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      classes: "myclass custom-class-example"
    };

    this.settings2 = {
      singleSelection: false,
      text: "Select Topics",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "subject",
      classes: "myclass custom-class-example"
    };

    this.settings3 = {
      singleSelection: false,
      text: "Select Subtopics",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "topic",
      classes: "myclass custom-class-example"
    };
    this.settings4 = {
      singleSelection: false,
      text: "Select Content Type",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,

      classes: "myclass custom-class-example"
    };
    this.fileTypesettings1 = {
      singleSelection: false,
      text: "Select file Type",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,

      classes: "myclass custom-class-example"
    }
    this.fileTypesettings2 = {
      singleSelection: false,
      text: "Select file format",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "file_type",

      classes: "myclass custom-class-example"
    }

    
      this.fileTypesettings3 = {
        singleSelection: false,
        text: "Select Attribute",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        badgeShowLimit: 2,
        
        classes: "myclass custom-class-example"
    };

  }
  openSecondTab(){
                this.sec_attr_0 = '';
                this.sec_attr_1 = '';
                this.sec_attr_2 = '';
                this.sec_attr_3 = '';
                this.sec_attr_4 = '';
                this.sec_attr_5 = '';
                this.sec_attr_6 = '';
                this.sec_attr_7 = '';
                this.sec_attr_8 = '';
                this.sec_attr_9 = '';
                this.sec_attr_10 = '';
                this.sec_attr_11 = '';
                this.sec_attr_12 = '';
                this.sec_attr_13 = '';
                this.sec_attr_14 = '';
                this.sec_attr_15 = '';
                this.sec_attr_16 = '';
                this.sec_attr_17 = '';
                this.sec_attr_18 = '';
                this.sec_attr_19 = '';
  }
  openAttributesTab(value){
    if(value === 1){
      this.open_Attribute_Tab = true;
      this.open_Custom_Attribute_Tab = false;
    }
    if(value === 2){
      this.open_Attribute_Tab = false;
      this.open_Custom_Attribute_Tab = true;
    }
  }

  LSCheckbox(){
    if(this.lsshow == false){
      this.lsshow = true;
    }
    else if(this.lsshow == true){
      this.lsshow = false;
    }
  }

  LSHintCheckbox(){
    if(this.lsshow == false){
      this.lsshow = true;
    }
    else if(this.lsshow == true){
      this.lsshow = false;
    }
  }
  LSExplanationbox(){
    if(this.lsshow == false){
      this.lsshow = true;
    }
    else if(this.lsshow == true){
      this.lsshow = false;
    }
  }

  LSExmpleCheckbox(){
    if(this.lsshow == false){
      this.lsshow = true;
    }
    else if(this.lsshow == true){
      this.lsshow = false;
    }
  }

  LSRephraseCheckbox(){
    if(this.lsshow == false){
      this.lsshow = true;
    }
    else if(this.lsshow == true){
      this.lsshow = false;
    }
  }
  LSBIDCheckbox(){
    if(this.lsshow == false){
      this.lsshow = true;
    }
    else if(this.lsshow == true){
      this.lsshow = false;
    }
  }
  LSTMCheckbox(){
    if(this.lsshow == false){
      this.lsshow = true;
    }
    else if(this.lsshow == true){
      this.lsshow = false;
    }
  }

  
  getMetaData() {
      
    localStorage.removeItem('TZNM');
    localStorage.removeItem('TZNMVL');
    if (this.authService.canActivate()) {
      this.saveload = true;
      var headers = new Headers();
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      this.http.get(credentials.host + "/get_metadatas/" + this.cookieService.get('_PAOID'), { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
        data => {    
          localStorage.setItem('TZNM' , data.timezone_name);
          localStorage.setItem('TZNMVL' , data.timezone_value);

          this.saveload = false;
          this.difficultyLevel = data.difficulty_level;
          this.taxonomyList = data.taxonomy;
          this.languageList = data.languages;
          this.contentType = data.content_type;
          for (var i = 0; i < this.contentType.length; i++) {
            this.contentType[i].id = this.contentType[i].UDF_Tag_ID;
            this.contentType[i].itemName = this.contentType[i].UDF_Tag;
          }
          this.subjectList = data.subjects;
          this.ContentTypelabelName = data.parameters.content_type;
          this.subLabelName = data.parameters.linked_attribute_1;
          this.topLabelName = data.parameters.linked_attribute_2;
          this.subTopLabelName = data.parameters.linked_attribute_3;
          this.diffLevelLabelName = data.parameters.difficulty_level;
          this.TaxonomyLabelName = data.parameters.taxonomy;
          this.FileFormatListMetaData = data.file_metadata.file_metadata_formats;
          this.fileMetaDataTypeList = data.file_metadata.file_metadata_types;
          this.itemType = data.item_type;
          this.elementType = data.elements;
          this.matchTypes = data.match_types;
          this.tableTypes = data.table_types;
          this.getItemService.getMetaDataDetails(data);
          this.activeTblType = this.tableTypes[0].table_type;
          this.hightlightTblClr =  this.tableTypes[0].images[0].color;
          this.count = 0;
          for (var i = 0; i < this.elementType.length; i++) {
            if (this.elementType[i].element == 'Statement' && (this.pathDirect == 1 || this.pathDirect == 2 || this.pathDirect == 0 || this.pathDirect == 11 || this.pathDirect == 12 || this.pathDirect == 13)) {
              // this.statementDroppedItems.push({element : item.element, icon:item.icon, value:item.value?item.value:"", id:this.count});
              this.attributes.item.push({ item_df_id: 1, item_df_sequence: 1, data_format_value: "", data_identifier: "", previous_df_id: "" });
              this.selectedItemTypes = "Multiple Choice";

            }

          }
          if (this.pathDirect == 3 || this.pathDirect == 4 || this.pathDirect == 20 || this.pathDirect == 19 || this.pathDirect == 7 || this.pathDirect == 8 || this.pathDirect == 14) {
            this.editItemDirective(0,'');
          }


          // CKEDITOR.disableAutoInline = true;
          // CKEDITOR.inline('inline-editor1');
        },
        error => {

          this.saveload = false;
          if (error.status == 404) {
            this.router.navigateByUrl('pages/NotFound');
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='https://accounts.scora.in';
          }
          else {
            this.router.navigateByUrl('pages/serverError');
          }

        }
        );
    }
  }

  getTenantAllUsers(){

    this.saveload = true;
    var headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
    this.http.get(credentials.host +"/cf_list/" +this.cookieService.get('_PAOID') ,{headers : headers})
    .map(res => res.json())
    .catch((e: any) =>{
      return Observable.throw(e)
    } )

    .subscribe(
      data => {
        var tempArray = [];
        this.saveload = false;
        this.allUsersList = data;
        var temp = [];
        var trempArray = []; 
        for(let i=0; i<this.allUsersList.length;i++){         
          temp.push(this.allUsersList[i].label)
          var obj = new Object({
            itemName : this.allUsersList[i].label,
            id : i 
          });
          trempArray.push(obj)           
          
          
        }
        // console.log(trempArray)
        // console.log(temp)
        this.allUsersLists_CF_Values = trempArray;
        // console.log(this.allUsersLists_CF_Values)
                  
           
        // for(let data of this.allUsersList){
        // this.allUsersLists.push(data);
        // for(let datas of data.custom_fields){
        //   this.allUsersLists_CF.push(datas)
        // }
        // }
        // for(let value of this.allUsersLists_CF){
        //   temp.push(value.label)
        // }
        // this.allUsersLists_CF_Values = temp;
        // console.log(this.allUsersLists_CF_Values)
        // console.log("all---user list"+this.allUsersLists_CF_Values)
        // console.log("all---user listJSON"+JSON.stringify(this.allUsersLists_CF_Values))

        },
        error => {

          this.saveload= false;
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


  getTopic(selectedSub) {
    if (this.authService.canActivate()) {
      this.topicsList = [];
      this.subtopicList = [];
      if (selectedSub.length == 0) {
        this.topicsList = [];
        this.subtopicList = [];
        this.selectedTopic = [];
      }
      var body = selectedSub;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + "/get_topics/" + this.cookieService.get('_PAOID'), body, { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
        data => {
          this.topicsList = data;
          //  this.selectedTopic = [];
        },
        error => {

          this.saveload = false;
          if (error.status == 404) {
            this.router.navigateByUrl('pages/NotFound');
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='https://accounts.scora.in';
          }
          else {
            this.router.navigateByUrl('pages/serverError');
          }

        }
        );
    }
  }

  getSubtopic(selectedTopic) {
    if (this.authService.canActivate()) {
      var body = selectedTopic;
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'Bearer ' + this.cookieService.get('_PTBA'));
      return this.http.post(credentials.host + "/get_subtopics/" + this.cookieService.get('_PAOID'), body, { headers: headers })
        .map(res => res.json())
        .catch((e: any) => {
          return Observable.throw(e)
        })

        .subscribe(
        data => {
          this.subtopicList = data;
          // this.selectedSubtopic = [];
        },
        error => {

          this.saveload = false;
          if (error.status == 404) {
            this.router.navigateByUrl('pages/NotFound');
          }
          else if (error.status == 401) {
            this.cookieService.deleteAll();
            window.location.href = credentials.accountUrl;
            // window.location.href='https://accounts.scora.in';
          }
          else {
            this.router.navigateByUrl('pages/serverError');
          }

        }
        );
    }
  }

  goToPreURL() {
    localStorage.removeItem("_tmpURL");
    if(this.goToHere == '/ItemSets/viewitemsets'){
      // this.router.navigateByUrl(this.goToHere + '/0/0/0');
      this.router.navigate([this.goToHere,0,0,0]);

    }else if(this.goToHere == '/as-an-author/to-create') {
      // this.router.navigateByUrl(this.goToHere);
      this.router.navigate([this.goToHere]);
    }else if (this.goToHere == '/as-an-author/to-modify') {
      this.router.navigate([this.goToHere]);
    }else if (this.goToHere == '/as-a-reviewer/to-review') {
      this.router.navigate([this.goToHere]);
    }

  }

}
