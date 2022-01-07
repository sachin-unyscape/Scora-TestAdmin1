import { answerChoiceType } from './answerChoiceType';

export class answerChoice{

    public correct_answer : boolean = false;
    public choice_elements: answerChoiceType[] = new Array<answerChoiceType>();
    constructor(){}

}