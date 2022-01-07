import { answerList } from './answerList';

export class ansType{

    public answer_type:string;
    public score_type:string;
    public score:number;
    public answer_choices : answerList[] = new Array<answerList>();
    constructor(){
        
    }

}