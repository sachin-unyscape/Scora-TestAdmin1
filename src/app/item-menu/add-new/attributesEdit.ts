import { topicType } from './topicType';
import { subtopicType } from './subtopicType';
import { subjectType } from './subjectType';
import { itemList } from './itemList';
import { answerList } from './answerList';
import { attributevalue } from './saveItemSet';

export class attributesEdit{

    
    public attributes : attributevalue;
    public item_id : number;
    public item_type :number;
    public item =[];
    public answer_choices =[];
    public itemset_item_id;
    public itemset_item_refer_id;
    public itemset_id = '';
    public section_id ='';
    public org_id;
    public directive_id : any;
    public directive =[];
    public answer_type:string;
    public score_type:string;
    public score;
    public save_as : boolean = false;
    public attributes_edit = true;

    constructor(){}

}