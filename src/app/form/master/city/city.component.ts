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
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
	isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();
	searchText: String;

  cityForm:any={}
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
    this.ViewCity();
    this.getAllCountry();
    this.getAllState();
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
          title: 'City Report' 
        },
        {
          extend: 'excel',
        //   text:  '<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'City Report' 
        },
		{
			extend: 'pdf',
			// text: '<i class="fa fa-file-pdf-o"></i>',
			text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
			titleAttr: 'Download as Pdf',
			title: 'City Report' 
		},
      ]
    };
  }

  ClearForm(){
	this.cityForm={};
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
	cityviewDetails;
	async EditCity(cityId){
		try {
		this.isEditMode=true;
		const city = {
		'cityId': cityId,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_city/',city);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.cityviewDetails = dataObj[objKey1];
				} 
			}				
		}
			this.cityForm = this.cityviewDetails;
		} catch (error) {}
	}

	cityDetails=[];
	rowData;
	actionAssign;
	isSuperAdmin:boolean=false;
	isLoading : boolean=false;
	isDeleteAction: boolean=false;
	isEditAction: boolean=false;
	async ViewCity(){
		try {
		this.isLoading = true;
		const city = {
		'cityId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		this.dtTrigger=new Subject<any>();
		const data: any = await this.request.post('/master/view_city',city);
		this.cityDetails=[];
		//alert(data);
		this.dtTrigger.next();
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
			for (let objKey1 of Object.keys(dataObj)) {
				this.cityDetails.push(dataObj[objKey1]);
			} 
			}				
		}
		this.rowData = this.cityDetails;
		// this.rerender();
		// if(this.isSuperAdmin==false){
		//   if(this.actionAssign.get("delete")=="delete"){
		//     this.isDeleteAction = true;
		//   }
		//   if(this.actionAssign.get("update")=="update"){
		//   this.isEditAction = true;
		//   }
		// }
		// console.log(this.qualificationDetails);
		this.isLoading = false;
		} catch (error) {}
	}

	async UpdateCity(){	
		// this.isEditMode=true;
		// this.isViewMode=true;
		try{
		const city = {
		"cityId":Number(this.cityForm.cityId),
		"countryId":Number(this.cityForm.countryId),
		"stateId":Number(this.cityForm.stateId),
		"cityName":$("#cityName").val(),
		"clientId":Number(this.cityForm.clientId),
		};
		console.log(city);
		const save: any = await this.request.post('/master/update_city',city);
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
			this.ViewCity();
			}
			window.location.reload();
			this.ViewCity();
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
	async SaveCity(){	
		this.isEditMode=false;
		this.isViewMode=false;
		try{
		const city = {
		"countryId":Number(this.cityForm.countryId),
		"stateId":Number(this.cityForm.stateId),
		"cityName":$("#cityName").val(),
		"clientId":Number(this.cityForm.clientId),
		};
		console.log(city);
		const save: any = await this.request.post('/master/add_city',city);
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
			this.ViewCity();
			}
			window.location.reload();
			this.ViewCity();
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

	async DeleteCity() {
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
			const city = {
			'cityId': Number(this.cityForm.cityId)
			};
			const allow: any = await this.request.post('/master/delete_city/',city);
			if (allow) {
			// Successfully Deleted
			Swal.fire(
			'Deleted!',
			'City Information has been deleted.',
			'success'
			);
			// Reload DataTable
			// this.ViewCity();
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
