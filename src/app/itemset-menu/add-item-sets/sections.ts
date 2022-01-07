import { Time } from "@angular/common/src/i18n/locale_data_api";

export class sections{
    public section_name ='';
    public time : Time;
    public score = '';
    public no_of_items = '';
    public no_of_items_in_pool = '';
    public subjects = [];
    public topics = [];
    public topicList =[];
    public author = null;
    public reviewer = null;
    public check_validations = false;


    constructor(){}

}
