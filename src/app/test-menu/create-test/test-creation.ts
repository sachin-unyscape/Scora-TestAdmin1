import { Section } from "./Section";
import { nonSectionItemsets } from "./nonSection-itemsets";
import { scoringItemsets } from "./scoringItemsets";

export class testCreation{
    public org_id;
    public test_name ='';
    public test_type;
    public test_attempts =undefined;
    public itemsets =[];
    public test_result_type ='';
    public test_evaluation ='';
    public subject_name ='';
    public no_of_items ='';
    public test_duration ='';
    public maximum_score ='';
    public passing_score:any ='';
    public Alert_Timer = undefined;
    public test_rule ='';
    public sectionwise_timer ="n";
    public cross_section_navication ="n";
    public submit_before_timer_ends ="n";
    public can_participant_print_certificate = 'y';
    public randomise_items  ="n";
    public randomise_answers="y";
    public test_pause_option ="y";
    public hints ="y";
    public correct_answer_display ="n";
    public dynamic_section_order_choose ="n";
    public item_palette = "y";
    public filter ="y";
    public item_paper_view ="y";
    public previous_button ="y";
    public mark_for_review_button ="y";
    public clear_response_button ="y";
    public save_next_buton_value ="Save & Next";
    public submit_button_value = "Submit";
    public previous_button_value = "Previous";
    public clear_response_button_value ="Clear Response";
    public mark_for_review_button_value = "Mark for Review and Next";
    public scoring_required = false;
    public Allocated_Sections_Scorers = "n";
    public Anonymity = "n";
    public Keywords_Show = "n";
    public Score_After_Test_Completed = "n";
    public Check_Plagianism = "n";
    public Plagianism_Tool = "n";
    public scoringItemsets : scoringItemsets[] = new Array<scoringItemsets>();
    public nonSectionItemsets : nonSectionItemsets[] = new Array<nonSectionItemsets>();
    public test_expiry;


    constructor(){}

}
