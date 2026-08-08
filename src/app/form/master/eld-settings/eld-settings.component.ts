import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
// import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import { DatePipe } from '@angular/common';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from 'src/services/request.service';
import { MasterService } from 'src/services/master.service';
// import * as $ from 'jquery';
// import 'datatables.net';
import { from, Subject } from 'rxjs';
declare let $: any;
searchText: String;
import jsPDF from 'jspdf';

@Component({
  selector: 'app-eld-settings',
  templateUrl: './eld-settings.component.html',
  styleUrls: ['./eld-settings.component.scss']
})
export class EldSettingsComponent implements OnInit {

  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  settingForm:any={}
  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    // private datePipe : DatePipe
  ) { }

  ClearForm(){
	this.settingForm={};
  }

  ngOnInit() {
    this.isEditMode=false;
    this.isViewMode=false;
    this.ViewSettings();
  }

  isViewMode;
  async EditEldSettings(settings){
    this.isEditMode=true;
    this.settingForm = settings;
  }

  settingDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewSettings(){
    try {
      this.isLoading = true;
      const settings = {
			  'settingId': 0,
      };
      this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_eld_settings/',settings);
      this.settingDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.settingDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.settingDetails;
      
      this.isLoading = false;
    } catch (error) {}
  }

  isUpdatedRecord;
  message;
  async SaveEldSettings(){	
    this.isEditMode=false;
    this.isViewMode=false;
    try{
    
    const save: any = await this.request.post('/master/add_eld_settings',this.settingForm);
    // console.log(save);
    for (let objKey of Object.keys(save)) {
      let dataObj = save[objKey];
      if(objKey=="status"){
      this.isUpdatedRecord = save[objKey];
      }
      if(objKey=="message"){
      this.message = save[objKey];
      }
    }
    if (this.isUpdatedRecord=="SUCCESS") {
      const result = await Swal.fire({
      title: 'Successfully Save',
      text: 'Saved Changes.',
      type: 'success',
      showConfirmButton: false,  
      timer: 1500
      // confirmButtonText: 'Ok'
      });
      if (result.value) {
      // Form Reset
        window.location.reload();
      }
        window.location.reload();
    } else{
      const result = await Swal.fire({
        title: "Oops ?",
        text: this.message,   
        type: "warning",   
        showCancelButton: false,      
        confirmButtonColor: "#FF0000",   
        confirmButtonText: "Close",   
        closeOnConfirm: false,   
        closeOnCancel: false,
        customClass: "Custom_Cancel"
      });
    }		
    } catch (error) {}
  }

  async UpdateEldSettings(){	
    this.isEditMode=false;
    this.isViewMode=false;
    try{
    
    const save: any = await this.request.post('/master/update_eld_settings',this.settingForm);
    for (let objKey of Object.keys(save)) {
      let dataObj = save[objKey];
      if(objKey=="status"){
      this.isUpdatedRecord = save[objKey];
      }
      if(objKey=="message"){
      this.message = save[objKey];
      }
    }
    if (this.isUpdatedRecord=="SUCCESS") {
      const result = await Swal.fire({
      title: 'Successfully Updated',
      text: 'Saved Changes.',
      type: 'success',
      showConfirmButton: false,  
      timer: 1500
      // confirmButtonText: 'Ok'
      });
      if (result.value) {
      // Form Reset
        window.location.reload();
      }
        window.location.reload();
    } else{
      const result = await Swal.fire({
        title: "Oops ?",
        text: this.message,   
        type: "warning",   
        showCancelButton: false,      
        confirmButtonColor: "#FF0000",   
        confirmButtonText: "Close",   
        closeOnConfirm: false,   
        closeOnCancel: false,
        customClass: "Custom_Cancel"
      });
    }		
    } catch (error) {}
  }

  async DeleteEldSettings() {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
      });
      if (confirm.value) {
      const settingId = {
        "settingId":Number(this.settingForm.settingId), 
      };
      const allow: any = await this.request.post('/master/delete_eld_settings/',settingId);
      if (allow) {
      // Successfully Deleted
      Swal.fire(
        'Deleted!',
        'Setting Information has been deleted.',
        'success'
      );
      // Reload DataTable
      window.location.reload();
      } else {
      Swal.fire(
        'Error!'
      );
      }
    }
  }

}
