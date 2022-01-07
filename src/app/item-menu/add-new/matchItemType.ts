import {matchData} from './matchData'
export class matchItemType{

    public item_df_id = 9;
    public item_df_sequence : number=2;
    public matchlist_type :number;
    public answer_type ="Single Answer";
    public score_type ="Item Lvl Score";
    public score = 1;
    public data_format_value: matchData[] = new Array<matchData>();
    public data_identifier;
    public previous_df_id:number;
    constructor(){}

}