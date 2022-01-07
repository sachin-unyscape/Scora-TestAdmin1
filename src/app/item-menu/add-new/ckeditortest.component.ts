import { Component } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './ckeditortest.component.html',
  styleUrls: ['./ckeditortest.component.css']
})

export class CKEDITORTESTComponent {
  title = 'angularckeditor';
  //public Editor = ClassicEditor;
  public processDiv = "";
  public data = "<p>Hello, csharp corner!</p><br/><br/> <b>This is demo for ckeditor 5 with angular 8</br>";
  public config = {
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

  public onChange({ editor }: ChangeEvent) {
    this.data = editor.getData();
    var html = $(".ck-content").html();
    this.processDiv = html;
    var find = this.isOverflown($(".ck-content")[0]);
    //alert(find);
  }

  isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }
}
