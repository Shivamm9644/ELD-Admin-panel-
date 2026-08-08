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
  selector: 'app-cargo-type',
  templateUrl: './cargo-type.component.html',
  styleUrls: ['./cargo-type.component.scss']
})
export class CargoTypeComponent implements OnInit {
  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  cargoTypeForm:any={}
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
    this.ViewCargoType();
    this.getAllClient();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
          text: '<i class="fa fa-file-text-o"></i>',
          titleAttr: 'Download as CSV',
		  title: 'Cargotype Report' 
	 },
        {
          extend: 'excel',
          text: '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: 'Cargotype Report' 
        },
		{
			extend: 'pdf',
			text: '<i class="fa fa-file-pdf-o"></i>',
			titleAttr: 'Download as Pdf',
			title: 'Cargotype Report' 
		},
      ]
    };
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
	cargoTypeViewDetails;
	async EditCargoType(){
		try {
		this.isEditMode=true;
		const cargotype = {
		'cargoTypeId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_cargo_type/',cargotype);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.cargoTypeViewDetails = dataObj[objKey1];
				} 
			}				
		}
			this.cargoTypeForm = this.cargoTypeViewDetails;
		} catch (error) {}
	}
  
	cargoTypeDetails=[];
	rowData;
	actionAssign;
	isSuperAdmin:boolean=false;
	isLoading : boolean=false;
	isDeleteAction: boolean=false;
	isEditAction: boolean=false;
	async ViewCargoType(){
	try {
	this.isLoading = true;
	const cargotype = {
		'cargoTypeId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		this.dtTrigger=new Subject<any>();
		const data: any = await this.request.post('/master/view_cargo_type',cargotype);
		this.cargoTypeDetails=[];
		//alert(data);
		this.dtTrigger.next();
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
			for (let objKey1 of Object.keys(dataObj)) {
				this.cargoTypeDetails.push(dataObj[objKey1]);
			} 
			}				
		}
		this.rowData = this.cargoTypeDetails;
		// console.log(this.mainTerminalDetails);
		this.isLoading = false;
		} catch (error) {}
	}

	isUpdatedRecord;
	message;
	async SaveCargoType(){	
		this.isEditMode=false;
		this.isViewMode=false;
		try{
			const cargotype = {
			"cargoTypeName":$("#cargoTypeName").val(),
			"clientId":Number(this.cargoTypeForm.clientId),
			};
			// console.log(cargotype);
			const save: any = await this.request.post('/master/add_cargo_type',cargotype);
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
				this.ViewCargoType();
			  }
			   window.location.reload();
				this.ViewCargoType();
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

	async UpdateCargoType(){	
		// this.isEditMode=false;
		// this.isViewMode=false;
		try{
			const cargotype = {
			"cargoTypeId":Number(this.cargoTypeForm.cargoTypeId),
			"cargoTypeName":$("#cargoTypeName").val(),
			"clientId":Number(this.cargoTypeForm.clientId),
			};
			// console.log(cargotype);
			const save: any = await this.request.post('/master/update_cargo_type',cargotype);
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
				this.ViewCargoType();
			  }
			   window.location.reload();
				this.ViewCargoType();
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
		
	async DeleteCargoType() {
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
			const cargoType = {
			'cargoTypeId': Number(this.cargoTypeForm.cargoTypeId)
			};
			const allow: any = await this.request.post('/master/delete_cargo_type/',cargoType);
			if (allow) {
			// Successfully Deleted
			Swal.fire(
			'Deleted!',
			'Cargo Type Information has been deleted.',
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
