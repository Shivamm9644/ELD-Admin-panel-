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
  selector: 'app-cycle-canada',
  templateUrl: './cycle-canada.component.html',
  styleUrls: ['./cycle-canada.component.scss']
})
export class CycleCanadaComponent implements OnInit {
  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  cycleCanadaForm:any={}
//   masterCyclecanadaForm:any={}
  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    // private datePipe : DatePipe
  ) { }

  ClearForm(){
	this.cycleCanadaForm={};
  }

  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
	this.getAllCountry();
    this.getAllState();
    this.ViewCycleCanada();
    this.getAllClient();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
        //   text:      '<i class="fa fa-file-text-o"></i>',
		text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Cycle Canada Report' 
        },
        {
          extend: 'excel',
        //   text:      '<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Cycle Canada Report' 
        },
        {
          extend: 'pdf',
        //   text: '<i class="fa fa-file-pdf-o"></i>',
		text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Cycle Canada Report' 
        }
      ]
    };
  }

//   showcycle(){
//     $('#cycle_canada_modal').modal('show');
//   }
//   close() {
//     $("#cycle_canada_modal").modal("hide");
// }

// ClearFields(){
// 	this.cycleCanadaForm.countryId = '';
// 	this.cycleCanadaForm.stateId = '';
// 	this.cycleCanadaForm.clientId = '';
// 	$("#cycleCanadaName").val("");
// }

// ClearFields(){
// this.masterCyclecanadaForm='';
// }

countryDataObj=[];
  countryDataArr;
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
  async getAllState(){
  try {
	  const bstate = {
	  'stateId': 0,
	  'clientId':Number(localStorage.getItem("clientId")),
	  };
	  const bcountryData: any = await this.request.post('/master/view_state/',bstate);
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
	cyclecanadaDetails;
	async EditCycleCanada(cycleCanadaId){
		try {
		this.isEditMode=true;
		const cycle = {
		'cycleCanadaId': cycleCanadaId,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_cycle_canada/',cycle);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
		this.cyclecanadaDetails = dataObj[objKey1];
				} 
			}				
		}
			this.cycleCanadaForm = this.cyclecanadaDetails;
		} catch (error) {}
	}
  
  cycleCanadaDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewCycleCanada(){
    try {
      this.isLoading = true;
      const cycle = {
        'cycleCanadaId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_cycle_canada',cycle);
      this.cycleCanadaDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
          this.cycleCanadaDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.cycleCanadaDetails;
      
      // console.log(this.cycleUsaDetails);
      this.isLoading = false;
    } catch (error) {}
  }

  isUpdatedRecord;
  message;
  async SaveCycleCanada(){	
    this.isEditMode=false;
    this.isViewMode=false;
	try{
		const cycle = {
		"countryId":Number(this.cycleCanadaForm.countryId),
		"stateId":Number(this.cycleCanadaForm.stateId),
        "cycleCanadaName":$("#cycleCanadaName").val(),
        "clientId":Number(this.cycleCanadaForm.clientId),
		};
      	// console.log(cycle);
		const save: any = await this.request.post('/master/add_cycle_canada',cycle);
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
				this.ViewCycleCanada();
			  }
			   window.location.reload();
			  this.ViewCycleCanada();
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

	async UpdateCycleCanada(){	
		// this.isEditMode=false;
		// this.isViewMode=false;
		try{
			const cycle = {
			"cycleCanadaId":Number(this.cycleCanadaForm.cycleCanadaId),	
			"countryId":Number(this.cycleCanadaForm.countryId),
			"stateId":Number(this.cycleCanadaForm.stateId),
			"cycleCanadaName":$("#cycleCanadaName").val(),
			"clientId":Number(this.cycleCanadaForm.clientId),
			};
			  // console.log(cycle);
			const save: any = await this.request.post('/master/update_cycle_canada',cycle);
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
					this.ViewCycleCanada();
				  }
				   window.location.reload();
				  this.ViewCycleCanada();
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

	async DeleteCycleCanada() {
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
			'cycleCanadaId': Number(this.cycleCanadaForm.cycleCanadaId)
			};
			const allow: any = await this.request.post('/master/delete_cycle_canada/',cycle);
			if (allow) {
			// Successfully Deleted
			Swal.fire(
			'Deleted!',
			'Cycle Canada Information has been deleted.',
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
