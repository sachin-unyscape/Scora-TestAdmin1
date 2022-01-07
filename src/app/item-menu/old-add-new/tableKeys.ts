import {tableValues} from './tablevalues';

export class tableKeys{
    public item_df_id :number;
    public item_df_sequence : number;
    public table_format : any;
    public table_color : any;
    public no_of_rows : number;
    public no_of_columns :number;
    public available_headers:any;
    public data_format_value: tableValues[] = new Array<tableValues>();
  
    constructor(){}

}