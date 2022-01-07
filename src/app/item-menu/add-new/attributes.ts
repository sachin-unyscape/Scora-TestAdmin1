import { topicType } from './topicType';
import { subtopicType } from './subtopicType';
import { subjectType } from './subjectType';
import { itemList } from './itemList';
import { answerList } from './answerList';
import { attributevalue } from './saveItemSet';

export class attributes{

    
    public attributes : attributevalue;
    public org_id;
    public item_type :number;
    public itemset_id = 17;
    public section_id =1;
    public itemset_item_id = '';
    public itemset_item_refer_id = '';
    public directive_id : any;
    public item_id ;
    public item =[];
    public directive =[];
    public answer_type:string;
    public score_type:string;
    public score;
    public answer_choice_insight;
    public data_insight;

    public answer_choices =[];
    public save_as : boolean = false;
    public attributes_edit = false;
    constructor(){}

}