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
import jsPDF from 'jspdf';


@Component({
  selector: 'app-cycle-usa',
  templateUrl: './cycle-usa.component.html',
  styleUrls: ['./cycle-usa.component.scss']
})
export class CycleUsaComponent implements OnInit {
  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  cycleUsaForm:any={}
  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    // private datePipe : DatePipe
  ) { }

  ClearForm(){
	this.cycleUsaForm={};
	this.SetDefaultData();
  }

  SetDefaultData(){
	this.getAllState(2);
	this.cycleUsaForm.countryId=2;
	this.cycleUsaForm.stateId=6;
	this.cycleUsaForm.cycleUsaName="70 hrs/8 days";
	this.cycleUsaForm.cycleHour=70;
	this.cycleUsaForm.cycleDays=8;
	this.cycleUsaForm.onDutyTime=14;
	this.cycleUsaForm.onDriveTime=11;
	this.cycleUsaForm.onSleepTime=10;
	this.cycleUsaForm.continueDriveTime=8;
	this.cycleUsaForm.breakTime=30;
	this.cycleUsaForm.cycleRestartTime=34;
	this.cycleUsaForm.warningTime1=0;
	this.cycleUsaForm.warningTime2=0;
	this.cycleUsaForm.cycleWarningTime1=0;
	this.cycleUsaForm.cycleWarningTime2=0;
  }

  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
	this.getAllCountry();
    // this.getAllState();
    this.ViewCycleUsa();
    this.getAllClient();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
        //   text:  '<i class="fa fa-file-text-o"></i>',
		text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Cycle Usa Report' 
        },
        {
          extend: 'excel',
        //   text:  '<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Cycle Usa Report' 
        },
        {
          extend: 'pdf',
        //   text: '<i class="fa fa-file-pdf-o"></i>',
		text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Cycle Usa Report' 
        }
      ]
    };
  }

  countryDataObj=[];
  countryDataArr:any;
  async getAllCountry(){
  try {
	  const bcountry = {
	  'countryId': 0,
	  'clientId':Number(localStorage.getItem("clientId")),
	  };
	  const bcountryData: any = await this.request.post('/master/view_country/',bcountry);
	  this.countryDataObj=[];	
	  for (let objKey of Object.keys(bcountryData)) {
		  let dataObj = bcountryData[objKey];
		  if(objKey=="result"){
			  for (let objKey1 of Object.keys(dataObj)) {
			  // this.designationDataObj.push(dataObj[objKey1]);
			  let arr = {
				  id:dataObj[objKey1].countryId,
				  countryName:dataObj[objKey1].countryName,
			  };
			  this.countryDataObj.push(arr);
			  }
		  }
	  }
	  this.countryDataArr = this.countryDataObj;
  } catch (error) {}
}

  stateDataObj=[];
  stateDataArr;
  async getAllState(countryId){
  try {
	  const bstate = {
	  'countryId': countryId,
	  'clientId':Number(localStorage.getItem("clientId")),
	  };
	  const bcountryData: any = await this.request.post('/master/view_state_by_country/',bstate);
	  this.stateDataObj=[];	
	  for (let objKey of Object.keys(bcountryData)) {
		  let dataObj = bcountryData[objKey];
		  if(objKey=="result"){
			  for (let objKey1 of Object.keys(dataObj)) {
			  // this.designationDataObj.push(dataObj[objKey1]);
			  let arr = {
				  id:dataObj[objKey1].stateId,
				  stateName:dataObj[objKey1].stateName,
			  };
			  this.stateDataObj.push(arr);
			  }
		  }
	  }
	  this.stateDataArr = this.stateDataObj;
  } catch (error) {}
}

  clientDataObj=[];
	clientDataArr;
	  async getAllClient(){
	  try {
		  const client = {
			  'clientId': 0
		  };
		  const clientData: any = await this.request.post('/master/view_client/',client);
		  this.clientDataObj=[];	
		  for (let objKey of Object.keys(clientData)) {
			  let dataObj = clientData[objKey];
			  if(objKey=="result"){
				  for (let objKey1 of Object.keys(dataObj)) {
					  // this.designationDataObj.push(dataObj[objKey1]);
					  let arr = {
						  id:dataObj[objKey1].clientId,
						  clientName:dataObj[objKey1].clientName,
					  };
					  this.clientDataObj.push(arr);
				  }
			  }
		  }
		  this.clientDataArr = this.clientDataObj;
	  } catch (error) {}
  }

	isViewMode;
	cycleusaDetails;
	async EditCycleUsa(cycleUsaId){
		try {
		this.isEditMode=true;
		const cycle = {
		'cycleUsaId': cycleUsaId,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_cycle_usa/',cycle);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.cycleusaDetails = dataObj[objKey1];
				} 
			}				
		}
		this.getAllState(this.cycleusaDetails.countryId);
		this.cycleUsaForm = this.cycleusaDetails;
		} catch (error) {}
	}

  cycleUsaDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewCycleUsa(){
    try {
      this.isLoading = true;
      const cycle = {
        'cycleUsaId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_cycle_usa',cycle);
      this.cycleUsaDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.cycleUsaDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.cycleUsaDetails;
      // console.log(this.cycleUsaDetails);
      this.isLoading = false;
    } catch (error) {}
  }
  
  isUpdatedRecord;
  message;
  async SaveCycleUsa(){	
        this.isEditMode=false;
		this.isViewMode=false;
		try{
		const cycle = {
		"countryId":Number(this.cycleUsaForm.countryId),
		"stateId":Number(this.cycleUsaForm.stateId),
        "cycleUsaName":$("#cycleUsaName").val(),
        "clientId":Number(this.cycleUsaForm.clientId),
		"cycleHour":Number(this.cycleUsaForm.cycleHour),
		"cycleDays":Number(this.cycleUsaForm.cycleDays),
		"onDutyTime":Number(this.cycleUsaForm.onDutyTime),
		"onDriveTime":Number(this.cycleUsaForm.onDriveTime),
		"onSleepTime":Number(this.cycleUsaForm.onSleepTime),
		"continueDriveTime":Number(this.cycleUsaForm.continueDriveTime),
		"breakTime":Number(this.cycleUsaForm.breakTime),
		"cycleRestartTime":Number(this.cycleUsaForm.cycleRestartTime),
		"warningTime1":Number(this.cycleUsaForm.warningTime1),
		"warningTime2":Number(this.cycleUsaForm.warningTime2),
		"cycleWarningTime1":Number(this.cycleUsaForm.cycleWarningTime1),
		"cycleWarningTime2":Number(this.cycleUsaForm.cycleWarningTime2),
		};
      // console.log(cycle);
		const save: any = await this.request.post('/master/add_cycle_usa',cycle);
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
			  // alert("Save Successfully");
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
				this.ViewCycleUsa();
			  }
			  window.location.reload();
			 this.ViewCycleUsa();
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

	async UpdateCycleUsa(){	
        // this.isEditMode=false;
		// this.isViewMode=false;
		try{
		const cycle = {
		"cycleUsaId":Number(this.cycleUsaForm.cycleUsaId),
		"countryId":Number(this.cycleUsaForm.countryId),
		"stateId":Number(this.cycleUsaForm.stateId),
        "cycleUsaName":$("#cycleUsaName").val(),
        "clientId":Number(this.cycleUsaForm.clientId),
		"cycleHour":Number(this.cycleUsaForm.cycleHour),
		"cycleDays":Number(this.cycleUsaForm.cycleDays),
		"onDutyTime":Number(this.cycleUsaForm.onDutyTime),
		"onDriveTime":Number(this.cycleUsaForm.onDriveTime),
		"onSleepTime":Number(this.cycleUsaForm.onSleepTime),
		"continueDriveTime":Number(this.cycleUsaForm.continueDriveTime),
		"breakTime":Number(this.cycleUsaForm.breakTime),
		"cycleRestartTime":Number(this.cycleUsaForm.cycleRestartTime),
		"warningTime1":Number(this.cycleUsaForm.warningTime1),
		"warningTime2":Number(this.cycleUsaForm.warningTime2),
		"cycleWarningTime1":Number(this.cycleUsaForm.cycleWarningTime1),
		"cycleWarningTime2":Number(this.cycleUsaForm.cycleWarningTime2),
		};
      // console.log(cycle);
		const save: any = await this.request.post('/master/update_cycle_usa',cycle);
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
			  // alert("Save Successfully");
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
				this.ViewCycleUsa();
			  }
			  window.location.reload();
			 this.ViewCycleUsa();
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

	async DeleteCycleUsa() {
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
			const cycle = {
			'cycleUsaId': Number(this.cycleUsaForm.cycleUsaId)
			};
			const allow: any = await this.request.post('/master/delete_cycle_usa/',cycle);
			if (allow) {
			// Successfully Deleted
			Swal.fire(
			'Deleted!',
			'Cycle Usa Information has been deleted.',
			'success'
			);
			// Reload DataTable
			// this.ViewDrivers();
			window.location.reload();
			// this.ngOnInit();
			} else {
			Swal.fire(
			'Error!'
			);
			}
		}
	}

}
