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
  selector: 'app-shipper',
  templateUrl: './shipper.component.html',
  styleUrls: ['./shipper.component.scss']
})
export class ShipperComponent implements OnInit {
	isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;

  shipperForm:any={}
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
    this.ViewShipperReport();
    this.getAllCountry();
    this.getAllState();
    this.getAllCity();
	this.getAllClient();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
          className: 'btn btn-danger',
          text:      '<i class="fa fa-file-text-o"></i>',
          titleAttr: 'Download as CSV',
          title: 'shipper Report' 
        },
        {
          extend: 'excel',
          text:      '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: 'shipper Report' 
        },
        {
          extend: 'pdf',
          text: '<i class="fa fa-file-pdf-o"></i>',
          titleAttr: 'Download as Pdf',
          title: 'shipper Report' 
        }
      ]
    };
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

  	cityDataObj=[];
	cityDataArr;
	async getAllCity(){
		try {
			const bcountry = {
				'cityId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_city/',bcountry);
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
	shipperViewDetails;
	async EditShipper(shipperId){
		try {
		this.isEditMode=true;
		const shipper = {
		'shipperId': shipperId,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_shipper',shipper);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.shipperViewDetails = dataObj[objKey1];
				} 
			}				
		}
		  this.shipperForm = this.shipperViewDetails;
		} catch (error) {}
	  }

  shipperDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewShipperReport(){
    try {
      this.isLoading = true;
      const shipper = {
        'shipperId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_shipper',shipper);
      this.shipperDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.shipperDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.shipperDetails;
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

  async UpdateShipperModalData(){	
	// this.isEditMode=false;
	// this.isViewMode=false;
	let status="",appointment="";
	try {
  if ($('#status').is(":checked"))
	{
		status="active";
	}else{
		status="inactive";
	}
	if ($('#appointment').is(":checked"))
	{
		appointment="active";
	}else{
		appointment="inactive";
	}
	const shipper = {
	"shipperId":Number(this.shipperForm.shipperId),
	"shipperName":$("#shipperName").val(),
	"shipperStartTime":$("#shipperStartTime").val(),
	"shipperEndTime":$("#shipperEndTime").val(),
	"physicalAddress":$("#physicalAddress").val(),
	"zipcode":Number($("#zipcode").val()),
	"contactNo":Number($("#contactNo").val()),
	"contactPerson":$("#contactPerson").val(),
	"countryId":Number(this.shipperForm.countryId),
	"stateId":Number(this.shipperForm.stateId),
	"cityId":Number(this.shipperForm.cityId),
	"status":status,
	"appointment":appointment,
	"remarks":$("#remarks").val(),
	"clientId":Number(this.shipperForm.clientId),
	};
	  // console.log(shipper);
	const save: any = await this.request.post('/master/update_shipper',shipper);
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
		this.ViewShipperReport();
		}
		window.location.reload();
		this.ViewShipperReport();
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
  async SaveShipperModalData(){	
		this.isEditMode=false;
		this.isViewMode=false;
		let status="",appointment="";
		try {
      if ($('#status').is(":checked"))
        {
			status="active";
        }else{
			status="inactive";
        }
		if ($('#appointment').is(":checked"))
        {
			appointment="active";
        }else{
			appointment="inactive";
        }
		const shipper = {
		"shipperName":$("#shipperName").val(),
        "shipperStartTime":$("#shipperStartTime").val(),
        "shipperEndTime":$("#shipperEndTime").val(),
        "physicalAddress":$("#physicalAddress").val(),
		"zipcode":Number($("#zipcode").val()),
        "contactNo":Number($("#contactNo").val()),
        "contactPerson":$("#contactPerson").val(),
        "countryId":Number(this.shipperForm.countryId),
        "stateId":Number(this.shipperForm.stateId),
        "cityId":Number(this.shipperForm.cityId),
        "status":status,
        "appointment":appointment,
        "remarks":$("#remarks").val(),
		"clientId":Number(this.shipperForm.clientId),
		};
      	// console.log(shipper);
		const save: any = await this.request.post('/master/add_shipper',shipper);
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
			this.ViewShipperReport();
			}
		    window.location.reload();
			this.ViewShipperReport();
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
    
	async DeleteShipperModalData() {
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
			const shipper = {
			'shipperId': Number(this.shipperForm.shipperId)
			};
			const allow: any = await this.request.post('/master/delete_shipper/',shipper);
			if (allow) {
			// Successfully Deleted
			Swal.fire(
			'Deleted!',
			'Shipper Information has been deleted.',
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
