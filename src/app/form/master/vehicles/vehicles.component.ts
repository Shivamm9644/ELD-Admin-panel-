import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
import { MasterService } from 'src/services/master.service';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { RequestService } from 'src/services/request.service';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import { disable } from 'ol/rotationconstraint';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
	isEditMode: boolean=false;
  	@ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  	dtTrigger: Subject<any> = new Subject();
  	// post: any;
  	searchText:String;

  vehicleForm:any={}

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }

  ROLE_ID=0;
  ngOnInit(): void {
	this.ROLE_ID = Number(localStorage.getItem("userTypeId"));
	// alert(this.ROLE_ID);
	if (this.ROLE_ID > 2) {
		$("#vin").prop("disabled", true);   
	} else {
		$("#vin").prop("disabled", false); 
	}
	this.isEditMode=false;
    this.isViewMode=false;
	this.vehicleForm.status=true;
	$("#statusSection").text("(Active)");
    this.ViewVehicle();
    this.getCountry();
    // this.getState();
    this.getDevice();
    this.getVehicleType();
    this.getFuelType();
	this.getEldConnectionInterface();
    this.getPaymentSatatus();
	this.getAllClient();
	this.getUser();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      // pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      
        buttons: [
          // 'csv', 'excel', 'pdf',
        {
          extend: 'csv',
        //   text:'<i class="fa fa-file-text-o"></i>',
		text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Vehicle Report' 
        },
        {
          extend: 'excel',
        //   text:'<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Vehicle Report' 
        },
        {
          extend: 'pdf',
        //   text: '<i class="fa fa-file-pdf-o"></i>',
		text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Vehicle Report' 
        }
      ]
    };
  }

  ClearForm(){
	this.vehicleForm={};
  }

  RefreshPage(){
    window.location.reload();
  }

  inputValidator(event: any) {
    //console.log(event.target.value);
    const pattern = /^[A-HJ-NP-PR-Z0-9]*$/;   
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^A-HJ-NP-PR-Z0-9]/g, "");
      // invalid character, prevent input
    }
  }

  
  	countryDataObj=[];
	countryDataArr;
	async getCountry(){
		try {
			const country = {
			'countryId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_country/',country);
			this.countryDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
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
	async getState(countryId){
		try {
			const state = {
				'countryId': countryId,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_state_by_country/',state);
			this.stateDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
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

  deviceDataObj=[];
	deviceDataArr;
	async getDevice(){
		try {
			const device = {
				'deviceId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_device/',device);
			this.deviceDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].deviceId,
							deviceName:dataObj[objKey1].deviceNo,
						};
						this.deviceDataObj.push(arr);
					}
				}
			}
			this.deviceDataArr = this.deviceDataObj;
		} catch (error) {}
	}

  vehicleTypeNameDataObj=[];
	vehicleTypeNameDataArr;
	async getVehicleType(){
		try {
			const vehicleType = {
				'vehicleTypeId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_vehicle_type/',vehicleType);
			this.vehicleTypeNameDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].vehicleTypeId,
							vehicleTypeName:dataObj[objKey1].vehicleTypeName,
						};
						this.vehicleTypeNameDataObj.push(arr);
					}
				}
			}
			this.vehicleTypeNameDataArr = this.vehicleTypeNameDataObj;
		} catch (error) {}
	}

	eldConnectionInterfaceDataObj=[];
	eldConnectionInterfaceDataArr;
	async getEldConnectionInterface(){
		try {
			const fuelType = {
				'eldConnectionInterfaceId': 0,
				//'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_eld_connection_interface/',fuelType);
			this.eldConnectionInterfaceDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].eldConnectionInterfaceId,
							eldConnectionInterfaceName:dataObj[objKey1].eldConnectionInterfaceName,
						};
						this.eldConnectionInterfaceDataObj.push(arr);
					}
				}
			}
			this.eldConnectionInterfaceDataArr = this.eldConnectionInterfaceDataObj;
		} catch (error) {}
	}

  fuelTypeNameDataObj=[];
	fuelTypeNameDataArr;
	async getFuelType(){
		try {
			const fuelType = {
				'fuelTypeId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_fuel_type/',fuelType);
			this.fuelTypeNameDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].fuelTypeId,
							fuelTypeName:dataObj[objKey1].fuelTypeName,
						};
						this.fuelTypeNameDataObj.push(arr);
					}
				}
			}
			this.fuelTypeNameDataArr = this.fuelTypeNameDataObj;
		} catch (error) {}
	}

  	paymentStatusNameDataObj=[];
	paymentStatusNameDataArr;
	async getPaymentSatatus(){
		try {
			const device = {
				'paymentStatusId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_payment_status/',device);
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

	userDataObj=[];
	userDataArr;
	async getUser(){
		try {
			const user = {
				'userId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_user/',user);
			this.userDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].userId,
							userName:dataObj[objKey1].username,
						};
						this.userDataObj.push(arr);
					}
				}
			}
			this.userDataArr = this.userDataObj;
		} catch (error) {}
	}

	isViewMode;
	vehicleViewDetails;
	async EditVehicle(vehicleId){
		try {
		this.isEditMode=true;
		const vehicle = {
		'vehicleId': vehicleId,
		'clientId':Number(localStorage.getItem("clientId")),	
		};
		const data: any = await this.request.post('/master/view_vehicle',vehicle);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					this.vehicleViewDetails = dataObj[objKey1];
				} 
			}				
		}
		this.getState(this.vehicleViewDetails.countryId);
		if(this.vehicleViewDetails.status=="active"){
			this.vehicleViewDetails.status=true;
			$("#statusSection").text("(Active)");
		}else{
			this.vehicleViewDetails.status=false;
			$("#statusSection").text("(Inactive)");
		}
		this.vehicleForm = this.vehicleViewDetails;
		} catch (error) {}
	  }

	CheckStatus(){
		if($('#status').prop('checked')) {
			$("#statusSection").text("(Active)");
		}else{
			$("#statusSection").text("(Inactive)");
		}
	}

  vehicleDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewVehicle(){
    try {
      this.isLoading = true;
      const vehicle = {
        'vehicleId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_vehicle',vehicle);
      this.vehicleDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.vehicleDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.vehicleDetails;
      this.isLoading = false;
    } catch (error) {}
  }

  async DeleteDrivers() {
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
	  const vehicle = {
		'vehicleId': Number(this.vehicleForm.vehicleId)
	  };
	  const allow: any = await this.request.post('/master/delete_vehicle/',vehicle);
	  if (allow) {
		// Successfully Deleted
		Swal.fire(
		'Deleted!',
		'Vehicle Information has been deleted.',
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

  registartionDate;
  pollutionExpiryDate;
  fitnessExpiryDate;
  insuranceExpiryDate;
	isUpdatedRecord;
	message;
	async SaveVehicle(){	
	this.isEditMode=false;
	this.isViewMode=false;
	try {
		
	

		// const vehicle = {
		// "vehicleNo":$("#vehicleNo").val(),
		// "vehicleTypeId":Number(this.vehicleForm.vehicleTypeId),
		// "licensePlate":$("#licensePlate").val(),
		// "countryId":Number(this.vehicleForm.countryId),
		// "stateId":Number(this.vehicleForm.stateId),
		// "make":$("#make").val(),
		// "manufacturingYear":$("#manufacturingYear").val(),
		// "deviceId":Number(this.vehicleForm.deviceId),
		// "userId":Number(this.vehicleForm.userId),
		// "vin":$("#vin").val(),
		// "registartionDate":this.registartionDate,
		// "pollutionExpiryDate":this.pollutionExpiryDate,
		// "fitnessExpiryDate":this.fitnessExpiryDate,
		// "insuranceExpiryDate":this.insuranceExpiryDate,
		// "fuelTypeId":Number(this.vehicleForm.fuelTypeId),
		// "serviceDate":$("#serviceDate").val(),
		// "billingDate":$("#billingDate").val(),
		// "paymentStatusId":Number(this.vehicleForm.paymentStatusId),
		// // "clientId":Number(this.vehicleForm.clientId),
		// "clientId":Number(localStorage.getItem("clientId")),
		// };

		let status;
		if(this.vehicleForm.status==true) {
			status="active";
		}else{
			status="inactive";
		}

		const vehicle = {
			"vehicleNo":$("#vehicleNo").val(),
			"make":$("#make").val(),
			"model":$("#model").val(),
			"manufacturingYear":$("#manufacturingYear").val(),
			"licensePlate":$("#licensePlate").val(),
			"countryId":Number(this.vehicleForm.countryId),
			"stateId":Number(this.vehicleForm.stateId),
			"vin":$("#vin").val(),
			"fuelTypeId":Number(this.vehicleForm.fuelTypeId),
			"eldConnectionInterfaceId":Number(this.vehicleForm.eldConnectionInterfaceId),
			"status":status,
			"clientId":Number(localStorage.getItem("clientId")),
			};
		 //console.log(vehicle);
		const save: any = await this.request.post('/master/add_vehicle',vehicle);
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
			this.ViewVehicle();
			}
			window.location.reload();
		this.ViewVehicle();
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
  

	async UpdateVehicle(){	
		// this.isEditMode=false;
		// this.isViewMode=false;
		try {

		let status;
		if(this.vehicleForm.status==true) {
			status="active";
		}else{
			status="inactive";
		}
		const vehicle = {
			"vehicleId":Number(this.vehicleForm.vehicleId),
			"vehicleNo":$("#vehicleNo").val(),
			"make":$("#make").val(),
			"model":$("#model").val(),
			"manufacturingYear":$("#manufacturingYear").val(),
			"licensePlate":$("#licensePlate").val(),
			"countryId":Number(this.vehicleForm.countryId),
			"stateId":Number(this.vehicleForm.stateId),
			"vin":$("#vin").val(),
			"fuelTypeId":Number(this.vehicleForm.fuelTypeId),
			"eldConnectionInterfaceId":Number(this.vehicleForm.eldConnectionInterfaceId),
			"status":status,
			"clientId":Number(localStorage.getItem("clientId")),
		};
		// const vehicle = {
		// 	"vehicleId":Number(this.vehicleForm.vehicleId),
		// 	"vehicleNo":$("#vehicleNo").val(),
		// 	"vehicleTypeId":Number(this.vehicleForm.vehicleTypeId),
		// 	"licensePlate":$("#licensePlate").val(),
		// 	"countryId":Number(this.vehicleForm.countryId),
		// 	"stateId":Number(this.vehicleForm.stateId),
		// 	"make":$("#make").val(),
		// 	"manufacturingYear":$("#manufacturingYear").val(),
		// 	"deviceId":Number(this.vehicleForm.deviceId),
		// 	"userId":Number(this.vehicleForm.userId),
		// 	"vin":$("#vin").val(),
		// 	"registartionDate":$("#registartionDate").val(),
		// 	"pollutionExpiryDate":$("#pollutionExpiryDate").val(),
		// 	"fitnessExpiryDate":$("#fitnessExpiryDate").val(),
		// 	"insuranceExpiryDate":$("#insuranceExpiryDate").val(),
		// 	"fuelTypeId":Number(this.vehicleForm.fuelTypeId),
		// 	"serviceDate":$("#serviceDate").val(),
		// 	"billingDate":$("#billingDate").val(),
		// 	"paymentStatusId":Number(this.vehicleForm.paymentStatusId),
		// 	// "clientId":Number(this.vehicleForm.clientId),
		// 	"clientId":Number(localStorage.getItem("clientId")),
		// 	};
		// console.log(vehicle);
		const save: any = await this.request.post('/master/update_vehicle',vehicle);
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
			this.ViewVehicle();
			}
			window.location.reload();
			this.ViewVehicle();
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


async DeleteVehicle() {
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
		const vehicle = {
		'vehicleId': Number(this.vehicleForm.vehicleId)
		};
		const allow: any = await this.request.post('/master/delete_vehicle/',vehicle);
		if (allow) {
		// Successfully Deleted
		Swal.fire(
		'Deleted!',
		'Vehicle information has been deleted.',
		'success'
		);
		// Reload DataTable
		// this.ViewVehicle();
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
