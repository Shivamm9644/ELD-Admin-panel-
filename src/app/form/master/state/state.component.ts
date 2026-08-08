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
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;

  stateForm:any={}
  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    // private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
    this.getAllCountry();
    this.ViewState();
    this.getAllClient();
	this.getAllGeofances();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
        //   text:'<i class="fa fa-file-text-o"></i>',
		text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'State Report' 
        },
        {
          extend: 'excel',
        //   text:'<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'State Report' 
        },
		{
			extend: 'pdf',
			// text: '<i class="fa fa-file-pdf-o"></i>',
			text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
			titleAttr: 'Download as Pdf',
			title: 'State Report' 
		}
      ]
    };
  }

  ClearForm(){
	this.stateForm={};
  }
  
  		countryDataObj=[];
		countryDataArr;
		async getAllCountry(){
		try {
			const bcountry = {
			'countryId': 0,
			'clientId':Number(localStorage.getItem("clientId"))
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

	isViewMode;
	stateviewDetails;
	async EditState(stateId){
		try {
			this.isEditMode=true;
			const state = {
			'stateId': stateId,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const data: any = await this.request.post('/master/view_state/',state);
			for (let objKey of Object.keys(data)) {
				let dataObj = data[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						this.stateviewDetails = dataObj[objKey1];
					} 
				}				
			}
			console.log(this.stateviewDetails);
			this.stateForm = this.stateviewDetails;
			} catch (error) {}
	}

  stateDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewState(){
    try {
      this.isLoading = true;
      const state = {
        'stateId': 0,
		'clientId':Number(localStorage.getItem("clientId"))
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_state',state);
      this.stateDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.stateDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.stateDetails;
      
      // console.log(this.qualificationDetails);
      this.isLoading = false;
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

  	geofanceDataObj=[];
	geofanceDataArr;
	  async getAllGeofances(){
	  try {
		  const geofances = {
			  'geoId': 0
		  };
		  const data: any = await this.request.post('/master/view_geofance_master/',geofances);
		  this.geofanceDataObj=[];	
		  for (let objKey of Object.keys(data)) {
			  let dataObj = data[objKey];
			  if(objKey=="result"){
				  for (let objKey1 of Object.keys(dataObj)) {
					  let arr = {
						id:dataObj[objKey1].geoId,
						geofanceName:dataObj[objKey1].stateName,
						// geofanceName:dataObj[objKey1].stateName+"("+dataObj[objKey1].geofanceId+")",
					  };
					  this.geofanceDataObj.push(arr);
				  }
			  }
		  }
		  this.geofanceDataArr = this.geofanceDataObj;
	  } catch (error) {}
  }

  async UpdateState(){	
	// this.isEditMode=false;
	// this.isViewMode=false;
	try{
	const state = {
	"stateId":Number(this.stateForm.stateId),
	"countryId":Number(this.stateForm.countryId),
	"stateCode":$("#stateCode").val(),
	"stateName":$("#stateName").val(),
	"timeZone":$("#timeZone").val(),
	"timezoneOffSet":$("#timezoneOffSet").val(),
	"clientId":Number(this.stateForm.clientId),
	"geofanceId":Number(this.stateForm.geofanceId),
	};
	console.log(state);
	const save: any = await this.request.post('/master/update_state',state);
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
		this.ViewState();
		}
		window.location.reload();
		this.ViewState();
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

	isUpdatedRecord;
	message;
	async SaveState(){	
		this.isEditMode=false;
		this.isViewMode=false;
		try{
		const state = {
		"countryId":Number(this.stateForm.countryId),
		"stateCode":$("#stateCode").val(),
        "stateName":$("#stateName").val(),
        "timeZone":$("#timeZone").val(),
		"timezoneOffSet":$("#timezoneOffSet").val(),
        "clientId":Number(this.stateForm.clientId),
		"geofanceId":Number(this.stateForm.geofanceId),
		};
      	console.log(state);
		const save: any = await this.request.post('/master/add_state',state);
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
				this.ViewState();
			  }
			  window.location.reload();
			this.ViewState();
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

		async DeleteState() {
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
			const state = {
			'stateId': Number(this.stateForm.stateId)
			};
			const allow: any = await this.request.post('/master/delete_state/',state);
			if (allow) {
			// Successfully Deleted
			Swal.fire(
			'Deleted!',
			'State Information has been deleted.',
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
