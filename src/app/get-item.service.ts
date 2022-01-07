import { Injectable } from '@angular/core';
import { Observable } from 'ng2-fancy-image-uploader/node_modules/rxjs/Observable';
import { read } from 'fs';
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { BehaviorSubject } from "rxjs/BehaviorSubject";



function _window() : any {
  // return the global native browser window object
  return window;
}

@Injectable()
export class GetItemService {

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
      if(this.currentUrl != '/Tests/ManageTests' && this.currentUrl != '/Tests/TestTackingDetails'){
        localStorage.removeItem('testid');
      }
    });
   }

  public chunkLoader: boolean = false;
  public receivedData;
  public itemset_name;
  public testDetails;
  public uploadId;
  public orgRoles;
  public BulkUploadedId;
  public disableButtons;
  public itemset_item_id;
  public ref_id;
  public RWF_flag :boolean;
  public EditItemsetDetails:any;
  private previousUrl: string;
  private currentUrl: string;
  public getIndividualFileUploadDetails:any;
  public get_sched_id;
  public get_testid;
  public allItemSetsMain;
  public allMetadataDetails;
  public sidenavVsCommentsToggle;


  private update = new BehaviorSubject<any>({updateAPIkey:false,themevalue:null});
  cast = this.update.asObservable();


  UpdateUserDetails(key,choosedTheme){

    this.update.next({updateAPIkey:key,themevalue:choosedTheme});
  }



  getResponse(data,itemset_name,uploadId){
    this.receivedData = data;
    this.itemset_name = itemset_name;
    this.uploadId = uploadId;

  }



  sendResponse():Observable<any>{
    return this.receivedData;
  }

  sendItemsetDet():Observable<any>{
    return this.itemset_name;
  }

  sendUploadId():Observable<any>{
    return this.uploadId;
  }

  getTestDetails(data){
    this.testDetails = data;

  }
  sendTestDetail(){
    return this.testDetails;
  }

  getOrganisationRoles(data){
    this.orgRoles = data;

  }

  sendOrganisationRoles(){
    return this.orgRoles;
  }

  getBulkUploadedIds(data){
    this.BulkUploadedId = data
  }

  sendBulkUploadedIds(){
    return this.BulkUploadedId;
  }


  getPlanExpireKey(key){
    this.disableButtons = key;
  }


  sendPlanExpireKEy(){
    return this.disableButtons;
  }

  getReplaceItemDetails(itemsetItemid,refId){
    this.itemset_item_id = itemsetItemid;
    this.ref_id = refId;
  }

  sendReplaceItemsetId(){
    return this.itemset_item_id;
  }
  sendReplaceREfId(){
    return this.ref_id;
  }

  getReviewWrkFlwFlag(flag){
    this.RWF_flag = flag;
  }

  sendReviewWrkFlwFlag(){
    return this.RWF_flag;
  }

  getItemsetDetails(data){
    this.EditItemsetDetails = data;
  }

  sendItemsetDetail(){
    return this.EditItemsetDetails;
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }


  getFileUploadDetailsToView(fileDet){
    this.getIndividualFileUploadDetails = fileDet;
  }

  sendFileUploadDetailsToList(){
    return this.getIndividualFileUploadDetails;
  }

  getScheduleInstanceDetails(schedID,testID){
    this.get_sched_id = schedID;
    this.get_testid = testID;
  }

  sendScheduleId(){
    return this.get_sched_id;
  }
  sendTestId(){
    return  this.get_testid;
  }


  get nativeWindow() : any {
    return _window();
  }

  getAllItemSets(data){
    this.allItemSetsMain = data;

  }

  sendAllItemSets(){
    return this.allItemSetsMain;
  }

  getMetaDataDetails(data) {

    this.allMetadataDetails = data;
  }

  sendMetaDataDetails() {

    return this.allMetadataDetails;
  }

  sidenavVsComments(togVal){
    this.sidenavVsCommentsToggle = togVal;

  }

  sendSidenavVsComments(){
    return this.sidenavVsCommentsToggle;
  }

}
