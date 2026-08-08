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
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
	isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;

  clientForm:any={}
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
    this.ViewClients();
	this.getPaymentSatatus();
    this.getAllCountry();
    // this.getAllState(0);
    this.getAllCity();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      // pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      
        buttons: [
        {
          extend: 'csv',
        //   text:  '<i class="fa fa-file-text-o"></i>',
		text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Client Report' 
        },
        {
          extend: 'excel',
        //   text:  '<i class="fa fa-file-excel-o" aria-hidden="true"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Client Report' 
        },
		{
		  extend: 'pdf',
		//   text:  '<i class="fa fa-file-pdf-o"></i>',
		text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
		  titleAttr: 'Download as Pdf',
		  title: 'Client Report'  
		},
      ]
    };
  }

  async SelectClient(clientId,clientName){
   //  alert(clientId);
	const confirm = await Swal.fire({
		title: 'Are you sure want to change client?',
		//text: "You won't be able to revert this!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes'
	  });
	  if (confirm.value) {
		localStorage.setItem('clientId', clientId);
		localStorage.setItem('clientName', clientName);
		 //this.router.navigate(['/form/clients']);
		
		 this.router.navigate(['/form/driver-status']);
		// window.location.reload();

		//  if(clientId>0){ 
		// this.router.navigate(['/form/driver-status']);
		// // window.location.reload();
		// }else{
		// this.router.navigate(['/form/clients']);
		// }
		
		//this.ViewClients();
	  }
	//   else{
	// 	const confirm = await Swal.fire({
	// 		title: "Oops ?",
	// 		text: this.message,   
	// 		type: "warning",   
	// 		showCancelButton: false,      
	// 		confirmButtonColor: "#FF0000",   
	// 		confirmButtonText: "Close",   
	// 		closeOnConfirm: false,   
	// 		closeOnCancel: false,
	// 		customClass: "Custom_Cancel"
	// 	});
	// 	}
  }

  	paymentStatusNameDataObj=[];
	paymentStatusNameDataArr;
	async getPaymentSatatus(){
		try {
			const payment = {
			'paymentStatusId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_payment_status/',payment);
			this.paymentStatusNameDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].paymentStatusId,
							paymentStatusName:dataObj[objKey1].paymentStatusName,
						};
						this.paymentStatusNameDataObj.push(arr);
					}
				}
			}
			this.paymentStatusNameDataArr = this.paymentStatusNameDataObj;
		} catch (error) {}
	}

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
		async getAllState(countryId){
		try {
			const bstate = {
			'countryId': countryId,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			// const bcountryData: any = await this.request.post('/master/view_state/',bstate);
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

  	cityDataObj=[];
	cityDataArr;
	async getAllCity(){
		try {
			const bcity = {
			'cityId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_city/',bcity);
			this.cityDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].cityId,
							cityName:dataObj[objKey1].cityName,
						};
						this.cityDataObj.push(arr);
					}
				}
			}
			this.cityDataArr = this.cityDataObj;
		} catch (error) {}
	}

	isViewMode;
	clientViewDetails;
	async EditClient(clientId){
		try {
		this.isEditMode=true;
		const client = {
		 'clientId': clientId,
		//'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_client',client);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.clientViewDetails = dataObj[objKey1];
				} 
			}				
		}
			this.clientForm = this.clientViewDetails;
		} catch (error) {}
	}
  
	clientDetails=[];
	rowData;
	actionAssign;
	isSuperAdmin:boolean=false;
	isLoading : boolean=false;
	isDeleteAction: boolean=false;
	isEditAction: boolean=false;
	async ViewClients(){
		try {
		this.isLoading = true;
		const client = {
		'clientId': 0,
		};
		this.dtTrigger=new Subject<any>();
		const data: any = await this.request.post('/master/view_client',client);
		//alert(data);
		this.clientDetails=[];
		this.dtTrigger.next();
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
			for (let objKey1 of Object.keys(dataObj)) {
				this.clientDetails.push(dataObj[objKey1]);
			} 
			}				
		}
		this.rowData = this.clientDetails;
		
		this.isLoading = false;
		} catch (error) {}
	}
		
	isUpdatedRecord;
	message;
	async SaveClients(){	
		this.isEditMode=false;
		this.isViewMode=false;
		let status="";
		try {
		if ($('#status').is(":checked"))
			{
			status="active";
			}else{
			status="inactive";
			}
			const client = {
			"clientName":$("#clientName").val(),
			"currency":$("#currency").val(),
			"contactNo":Number($("#contactNo").val()),
			"contactEmail":$("#contactEmail").val(),
			"address":$("#address").val(),
			"zipcode":Number($("#zipcode").val()),
			"status":status,
			"countryId":Number(this.clientForm.countryId),
			"stateId":Number(this.clientForm.stateId),
			"cityId":Number(this.clientForm.cityId),
			"paymentStatusId":Number(this.clientForm.paymentStatusId),
			};
			console.log(client);
			const save: any = await this.request.post('/master/add_client',client);
			console.log(save);
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
				this.ViewClients();
			}
				window.location.reload();
				this.ViewClients();
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

	async UpdateClients(){	
		// this.isEditMode=false;
		// this.isViewMode=false;
		let status="";
		try {
		if ($('#status').is(":checked"))
			{
			status="active";
			}else{
			status="inactive";
			}
			const client = {
			"clientId":Number(this.clientForm.clientId),	
			"clientName":$("#clientName").val(),
			"currency":$("#currency").val(),
			"contactNo":Number($("#contactNo").val()),
			"contactEmail":$("#contactEmail").val(),
			"address":$("#address").val(),
			"zipcode":Number($("#zipcode").val()),
			"status":status,
			"countryId":Number(this.clientForm.countryId),
			"stateId":Number(this.clientForm.stateId),
			"cityId":Number(this.clientForm.cityId),
			"paymentStatusId":Number(this.clientForm.paymentStatusId),
			};
			console.log(client);
			const save: any = await this.request.post('/master/update_client',client);
			console.log(save);
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
				this.ViewClients();
			}
				window.location.reload();
				this.ViewClients();
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
	
	async DeleteClients() {
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
			const client = {
			'clientId': Number(this.clientForm.clientId)
			};
			const allow: any = await this.request.post('/master/delete_client/',client);
			if (allow) {
			// Successfully Deleted
			Swal.fire(
			'Deleted!',
			'Client Information has been deleted.',
			'success'
			);
			// Reload DataTable
			// this.ViewClients();
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
