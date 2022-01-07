import { Scorers } from "./Scorers";
export class Section{
    
    public sec_id :any;
    public Scoring_Type : any;
    public No_of_Scorers : any;
    public Scorers : Scorers[] = new Array<Scorers>();

constructor(){}

}