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
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
declare let $: any;
import jsPDF from 'jspdf';


@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit {
	
	isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText:String;

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }

  receiverForm:any={}
  shipperForm:any={}
  carrierForm:any={}
  dispatchForm:any={}
  customerForm:any={}
  
  ngOnInit(): void {
	this.isEditMode=false;
    this.isViewMode=false;
	// $('#shipperDate').val(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
	this.getAllCustomerName();
    this.getAllProduct();
    this.getAllBillingCountry();
    this.getAllBillingState();
    this.getAllBillingCity();
    this.getAllPhysicalCountry();
    this.getAllPhysicalState();
    this.getAllPhysicalCity();
	this.getAllRoute();
	this.getAllCountry();
    this.getAllState();
    this.getAllCity();
	this.getAllReceiverCountry();
    this.getAllReceiverState();
    this.getAllReceiverCity();
	this.getAllShipperName();
	this.getAllReceiverName();
	this.getAllDriverName();
	this.getAllCoDriverName();
	this.getAllTruckNo();
	this.getAllTrailer();
	this.getAllCarrierName();
	this.ViewDispatch();
	this.getAllReferMode();
	this.getAllClient();
	this.dispatchForm.dispatchFlatRate = 0;
	this.dispatchForm.dispatchExtraPD = 0;
	this.dispatchForm.dispatchFuelFuelSurCharge = 0;
	this.dispatchForm.dispatchExtraCharge = 0;
	this.dispatchForm.dispatchTotal= 0;
	this.dispatchForm.driverRate= 0;
	this.dispatchForm.driverTotalMiles= 0;
	this.dispatchForm.dispatchAmount1=0;
	this.dispatchForm.dispatchOtherCharge=0;
	// this.dispatchForm.shipperOrder=1;
	// this.viewDate();
	
    this.dtOptions = {
      pagingType: 'full_numbers',
      // pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
          // 'csv', 'excel', 'pdf',
        {
          extend: 'csv',
          text:   '<i class="fa fa-file-text-o"></i>',
          titleAttr: 'Download as CSV',
          title: 'Dispatch Report' 
        },
        {
          extend: 'excel',
          text:   '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: 'Dispatch Report' 
        },
		{
		extend: 'pdf',
		className: 'btn btn-danger',
		text:      '<i class="fa fa-file-pdf-o"></i>',
		titleAttr: 'Download as Pdf',
		title: 'Dispatch Report',
		orientation: 'landscape',
		//pageSize: 'LEGAL',
		},
      ]
    };
	this.ChangeFields("driver");
	this.SelectFields("dudection");
	// for(let i=0;i<this.productMasterDetails["shipperData"].length;i++){
	// }
  }

  isDriverSection=true;
  isCarrierSection=false;
  radioValue;
  ChangeFields(type){
    this.radioValue = $("#"+type).val();
    // alert(this.radioValue);
    if(this.radioValue=="driver"){
      if($("#"+type).prop('checked') == false){
        this.isCarrierSection=true;
        this.isDriverSection=false;
        $("#carrier").prop('checked', true);
        $("#driver").prop('checked', false);
      }
      else{ 
        this.isDriverSection=true;
        this.isCarrierSection=false;
        $("#driver").prop('checked', true);
        $("#carrier").prop('checked', false);
      }
    }else{
      if($("#"+type).prop('checked') == false){
        this.isCarrierSection=false;
        this.isDriverSection=true;
        $("#driver").prop('checked', true);
        $("#carrier").prop('checked', false);
      }
      else{ 
        this.isDriverSection=false;
        this.isCarrierSection=true;
        $("#carrier").prop('checked', true);
        $("#driver").prop('checked', false);
      }
    }
  }
  
  otherChargeRadio;
  SelectFields(type){
    this.otherChargeRadio = $("#"+type).val();
    // alert(this.radioValue);
    if(this.otherChargeRadio=="dudection"){
      if($("#"+type).prop('checked') == false){
        $("#reimbursement").prop('checked', true);
        $("#dudection").prop('checked', false);
      }
      else{ 
        $("#dudection").prop('checked', true);
        $("#reimbursement").prop('checked', false);
      }
    }else{
      if($("#"+type).prop('checked') == false){
        $("#dudection").prop('checked', true);
        $("#reimbursement").prop('checked', false);
      }
      else{ 
        $("#reimbursement").prop('checked', true);
        $("#dudection").prop('checked', false);
      }
    }
  }

	dispatchOtherCharge=0;
	dispatchTotal=0;
	dispatchFlatRate=0;
	dispatchExtraPD=0;
	dispatchExtraCharge=0;
	dispatchFuelFuelSurCharge=0;
  	TotalDispatchCollectionData(val,typeId){
	if(this.otherChargeCount>0){
		if(typeId=="dispatchFlatRate"){
			// alert(this.dispatchFlatRate);
			this.dispatchTotal = this.dispatchTotal-this.dispatchFlatRate;
			this.dispatchTotal += Number($("#dispatchFlatRate").val());
			this.dispatchFlatRate = Number($("#dispatchFlatRate").val());
		}else if(typeId=="dispatchExtraPD"){
			this.dispatchTotal = this.dispatchTotal-this.dispatchExtraPD;
			this.dispatchTotal += Number($("#dispatchExtraPD").val());
			this.dispatchExtraPD = Number($("#dispatchExtraPD").val());
		}else if(typeId=="dispatchFuelFuelSurCharge"){
			this.dispatchTotal = this.dispatchTotal-this.dispatchFuelFuelSurCharge;
			this.dispatchTotal += Number($("#dispatchFuelFuelSurCharge").val());
			this.dispatchFuelFuelSurCharge = Number($("#dispatchFuelFuelSurCharge").val());
		}else if(typeId=="dispatchExtraCharge"){
			this.dispatchTotal = this.dispatchTotal-this.dispatchExtraCharge;
			this.dispatchTotal += Number($("#dispatchExtraCharge").val());
			this.dispatchExtraCharge = Number($("#dispatchExtraCharge").val());
		}
		// this.dispatchTotal += Number($("#dispatchFlatRate").val())+Number($("#dispatchExtraPD").val())+Number($("#dispatchFuelFuelSurCharge").val())+Number($("#dispatchExtraCharge").val())
		}else{
			this.dispatchFlatRate = Number($("#dispatchFlatRate").val());
			this.dispatchExtraPD = Number($("#dispatchExtraPD").val());
			this.dispatchFuelFuelSurCharge = Number($("#dispatchFuelFuelSurCharge").val());
			this.dispatchExtraCharge = Number($("#dispatchExtraCharge").val());
			this.dispatchTotal = Number($("#dispatchFlatRate").val())+Number($("#dispatchExtraPD").val())+Number($("#dispatchFuelFuelSurCharge").val())+Number($("#dispatchExtraCharge").val())
		}
		$("#dispatchTotal").val(this.dispatchTotal);
	}

	shipperOrder=0;
	ShipperOrderIncrementOnAdd(){
	this.shipperOrder = Number($("#shipperOrder").val())+1;
	$("#shipperOrder").val(this.shipperOrder);
	}

	// GetOrderValue(val){
	// this.shipperForm = $("#shipperOrder").val();
	// alert(" >> "+val);
	// $("#shipperOrder").val(this.shipperForm);
	// }

	// dispatchOtherCharge=0;
	// dispatchTotal=0;
	// TotalDispatchCollectionData(val){
	// // alert(" >> "+val);
	// this.dispatchTotal += Number($("#dispatchTotal").val())+(Number($("#dispatchFlatRate").val())+Number($("#dispatchExtraPD").val())+Number($("#dispatchFuelFuelSurCharge").val())+Number($("#dispatchExtraCharge").val()))
	// $("#dispatchTotal").val(this.dispatchTotal);
	// }

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
	dispatchViewDetails;
	async EditDispatch(){
		try {
		this.isEditMode=true;
		const dispatch = {
			'dispatchId': "",
		};
		const data: any = await this.request.post('/dispatch/view_dispatch_details',dispatch);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.dispatchViewDetails = dataObj[objKey1];
				} 
			}				
		}
			this.dispatchForm = this.dispatchViewDetails;
		} catch (error) {}
	}

		dispatchDetails=[];
		rowData;
		actionAssign;
		isSuperAdmin:boolean=false;
		isLoading : boolean=false;
		isDeleteAction: boolean=false;
		isEditAction: boolean=false;
		async ViewDispatch(){
		try {
			this.isLoading = true;
			const dispatch = {
			'dispatchId': "",
			'clientId':Number(localStorage.getItem("clientId")),
			};
			this.dtTrigger=new Subject<any>();
			const data: any = await this.request.post('/dispatch/view_dispatch_details',dispatch);
			this.dispatchDetails=[];
			//alert(data);
			this.dtTrigger.next();
			for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.dispatchDetails.push(dataObj[objKey1]);
				} 
			}				
			}
			this.rowData = this.dispatchDetails;
			// this.rerender();
			// if(this.isSuperAdmin==false){
			//   if(this.actionAssign.get("delete")=="delete"){
			//     this.isDeleteAction = true;
			//   }
			//   if(this.actionAssign.get("update")=="update"){
			//   this.isEditAction = true;
			//   }
			// }
			// console.log(this.vehicleDetails);
			this.isLoading = false;
		} catch (error) {}
		}
  
  	//for customer modal dropdown api & save
		customerDataObj=[];
		customerDataArr;
		async getAllCustomerName(){
		try {
		const product = {
		'customerId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const productData: any = await this.request.post('/master/view_customer/',product);
		this.customerDataObj=[];	
		for (let objKey of Object.keys(productData)) {
		let dataObj = productData[objKey];
		if(objKey=="result"){
		for (let objKey1 of Object.keys(dataObj)) {
			// this.designationDataObj.push(dataObj[objKey1]);
			let arr = {
				id:dataObj[objKey1].customerId,
				customerName:dataObj[objKey1].customerName,
			};
			this.customerDataObj.push(arr);
		}
		}
		}
		this.customerDataArr = this.customerDataObj;
	} catch (error) {}
	}

 	productDataObj=[];
	productDataArr;
	async getAllProduct(){
		try {
			const product = {
				'productId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const productData: any = await this.request.post('/master/view_product/',product);
			this.productDataObj=[];	
			for (let objKey of Object.keys(productData)) {
				let dataObj = productData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].productId,
							productName:dataObj[objKey1].productName,
						};
						this.productDataObj.push(arr);
					}
				}
			}
			this.productDataArr = this.productDataObj;
		} catch (error) {}
	}

  	billingcountryDataObj=[];
	billingcountryDataArr;
	async getAllBillingCountry(){
		try {
			const bcountry = {
				'countryId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_country/',bcountry);
			this.billingcountryDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].countryId,
							billingCountryName:dataObj[objKey1].countryName,
						};
						this.billingcountryDataObj.push(arr);
					}
				}
			}
			this.billingcountryDataArr = this.billingcountryDataObj;
		} catch (error) {}
	}

  	billingstateDataObj=[];
	billingstateDataArr;
	async getAllBillingState(){
		try {
			const bstate = {
				'stateId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_state/',bstate);
			this.billingstateDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].stateId,
							billingStateName:dataObj[objKey1].stateName,
						};
						this.billingstateDataObj.push(arr);
					}
				}
			}
			this.billingstateDataArr = this.billingstateDataObj;
		} catch (error) {}
	}

  	billingcityDataObj=[];
	billingcityDataArr;
	async getAllBillingCity(){
		try {
			const bcountry = {
				'cityId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_city/',bcountry);
			this.billingcityDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].cityId,
							billingCityName:dataObj[objKey1].cityName,
						};
						this.billingcityDataObj.push(arr);
					}
				}
			}
			this.billingcityDataArr = this.billingcityDataObj;
		} catch (error) {}
	}
  

	physicalcountryDataObj=[];
	physicalcountryDataArr;
	async getAllPhysicalCountry(){
		try {
			const bcountry = {
				'countryId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_country/',bcountry);
			this.physicalcountryDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].countryId,
							physicalCountryName:dataObj[objKey1].countryName,
						};
						this.physicalcountryDataObj.push(arr);
					}
				}
			}
			this.physicalcountryDataArr = this.physicalcountryDataObj;
		} catch (error) {}
	}

  	physicalstateDataObj=[];
	physicalstateDataArr;
	async getAllPhysicalState(){
		try {
			const bstate = {
				'stateId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_state/',bstate);
			this.physicalstateDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].stateId,
							physicalStateName:dataObj[objKey1].stateName,
						};
						this.physicalstateDataObj.push(arr);
					}
				}
			}
			this.physicalstateDataArr = this.physicalstateDataObj;
		} catch (error) {}
	}

  	physicalcityDataObj=[];
	physicalcityDataArr;
	async getAllPhysicalCity(){
		try {
			const bcountry = {
			'cityId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_city/',bcountry);
			this.physicalcityDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].cityId,
							physicalcityName:dataObj[objKey1].cityName,
						};
						this.physicalcityDataObj.push(arr);
					}
				}
			}
			this.physicalcityDataArr = this.physicalcityDataObj;
		} catch (error) {}
	}

	referModeDataObj=[];
	referModeDataArr;
	async getAllReferMode(){
		try {
			const refer = {
				'referModeId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_refer_mode/',refer);
			this.referModeDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].referModeId,
							referModeName:dataObj[objKey1].referModeName,
						};
						this.referModeDataObj.push(arr);
					}
				}
			}
			this.referModeDataArr = this.referModeDataObj;
		} catch (error) {}
	}

	isUpdatedRecord;
  	message;
  	async SaveCustomerModalData(){	
	let status="";
	try {
      if ($('#status').is(":checked"))
        {
          status="active";
        }else{
          status="inactive";
        }
			const customer = {
				"customerName":$("#customerName").val(),
				"billingAddress":$("#billingAddress").val(),
				"billingZipcode":Number($("#billingZipcode").val()),
				"contactEmail":$("#contactEmail").val(),
				"contactphone":Number($("#contactphone").val()),
				"physicalAddress":$("#physicalAddress").val(),
				"physicalZipCode":Number($("#physicalZipCode").val()),
				"dispatchEmail":$("#dispatchEmail").val(),
				"dispatchPhone":Number($("#dispatchPhone").val()),
				"afterHoursphone":Number($("#afterHoursphone").val()),
				"accountingEmail":$("#accountingEmail").val(),
				"clientId":Number(this.customerForm.clientId),
				"accountingPhone":Number($("#accountingPhone").val()),
				"remarks":$("#remarks").val(),
				"status":status,
				"productId":Number(this.customerForm.productId),
				"billingCountryId":Number(this.customerForm.billingCountryId),
				"billingStateId":Number(this.customerForm.billingStateId),
				"billingCityId":Number(this.customerForm.billingCityId),
				"physicalCountryId":Number(this.customerForm.physicalCountryId),
				"physicalStateId":Number(this.customerForm.physicalStateId),
				"physicalCityId":Number(this.customerForm.physicalCityId),
			};
      		// console.log(customer);
			const save: any = await this.request.post('/master/add_customer',customer);
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
				// window.location.reload();
				// this.ViewDevice();
			  }
			//   window.location.reload();
			// this.ViewDevice();
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
	}	//customer modal end here

	//driver radio tab start here
	driverDataObj=[];
	driverDataArr;
	async getAllDriverName(){
		try {
			const employee = {
				'employeeId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const employeeData: any = await this.request.post('/master/view_employee/',employee);
			this.driverDataObj=[];	
			for (let objKey of Object.keys(employeeData)) {
				let dataObj = employeeData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].employeeId,
							employeeName:dataObj[objKey1].firstName +" "+dataObj[objKey1].lastName,
							flatRate:dataObj[objKey1].flatRate,
						};
						this.driverDataObj.push(arr);
					}
				}
			}
			this.driverDataArr = this.driverDataObj;
		} catch (error) {}
	}

	codriverDataObj=[];
	codriverDataArr;
	async getAllCoDriverName(){
		try {
			const employee = {
			'employeeId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const employeeData: any = await this.request.post('/master/view_employee/',employee);
			this.codriverDataObj=[];	
			for (let objKey of Object.keys(employeeData)) {
				let dataObj = employeeData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
					// this.designationDataObj.push(dataObj[objKey1]);
					let arr = {
					id:dataObj[objKey1].employeeId,
					coDriverName:dataObj[objKey1].firstName +" "+dataObj[objKey1].lastName,
					};
					this.codriverDataObj.push(arr);
					}
				}
			}
			this.codriverDataArr = this.codriverDataObj;
		} catch (error) {}
	}		
	
	vehicleDataObj=[];
	vehicleDataArr;
	async getAllTruckNo(){
	try {
		const vehicle = {
		'vehicleId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const vehicleData: any = await this.request.post('/master/view_vehicle/',vehicle);
		this.vehicleDataObj=[];	
		for (let objKey of Object.keys(vehicleData)) {
			let dataObj = vehicleData[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					// this.designationDataObj.push(dataObj[objKey1]);
					let arr = {
						id:dataObj[objKey1].vehicleId,
						vehicleNo:dataObj[objKey1].vehicleNo,
					};
					this.vehicleDataObj.push(arr);
				}
			}
		}
		this.vehicleDataArr = this.vehicleDataObj;
	} catch (error) {}
	}

	trailerDataObj=[];
	trailerDataArr;
	async getAllTrailer(){
	try {
		const trailer = {
		'trailerId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const trailerData: any = await this.request.post('/master/view_trailer/',trailer);
		this.trailerDataObj=[];	
		for (let objKey of Object.keys(trailerData)) {
			let dataObj = trailerData[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					// this.designationDataObj.push(dataObj[objKey1]);
					let arr = {
						id:dataObj[objKey1].trailerId,
						trailerName:dataObj[objKey1].trailerName,
					};
					this.trailerDataObj.push(arr);
				}
			}
		}
		this.trailerDataArr = this.trailerDataObj;
	} catch (error) {}
	}

	VEHICLE_NO;
	getAllTruckNames(vehicleNo){
      this.VEHICLE_NO = vehicleNo;
    }

	TRAILER_NAME;
	getAllTrailerNames(trailerName){
      this.TRAILER_NAME = trailerName;
    }
	//driver radio tab end here

	GetDrivers(flatRate){
		$("#driverRate").val(flatRate);
	}

	//carrier modal start here
	carrierDataObj=[];
	carrierDataArr;
	async getAllCarrierName(){
	try {
		const carrier = {
		'carrierId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const carrierData: any = await this.request.post('/master/view_carrier/',carrier);
		this.carrierDataObj=[];	
		for (let objKey of Object.keys(carrierData)) {
			let dataObj = carrierData[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					// this.designationDataObj.push(dataObj[objKey1]);
					let arr = {
						id:dataObj[objKey1].carrierId,
						carrierName:dataObj[objKey1].carrierName,
					};
					this.carrierDataObj.push(arr);
				}
			}
		}
		this.carrierDataArr = this.carrierDataObj;
	} catch (error) {}
}
				
	routeDataObj=[];
	routeDataArr;
	async getAllRoute(){
	try {
		const route = {
		'routeId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const routeData: any = await this.request.post('/master/view_route/',route);
		this.routeDataObj=[];	
		for (let objKey of Object.keys(routeData)) {
			let dataObj = routeData[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					// this.designationDataObj.push(dataObj[objKey1]);
					let arr = {
						id:dataObj[objKey1].routeId,
						routeName:dataObj[objKey1].routeName,
					};
					this.routeDataObj.push(arr);
				}
			}
		}
		this.routeDataArr = this.routeDataObj;
	} catch (error) {}
}
  
  async SaveCarrierModalData(){	
	let carrierStatus="";
	try {
      if ($('#carrierStatus').is(":checked"))
        {
			carrierStatus="active";
        }else{
			carrierStatus="inactive";
        }
		const carrier = {
			"carrierName":$("#carrierName").val(),
			"dot":$("#dot").val(),
			"taxId":$("#taxId").val(),
			"billingAddress":$("#carrierBillingAddress").val(),
			"billingZipcode":Number($("#carrierBillingZipcode").val()),
			"contactEmail":$("#carrierContactEmail").val(),
			"contactPhone":Number($("#carrierContactPhone").val()),
			"physicalAddress":$("#carrierPhysicalAddress").val(),
			"physicalZipcode":Number($("#carrierPhysicalZipcode").val()),
			"mainEmail":$("#carrierMainEmail").val(),
			"mainPhone":Number($("#carrierMainPhone").val()),
			"mcNumber":$("#carrierMcNumber").val(),
			"afterHoursPhone":Number($("#carrierAfterHoursPhone").val()),
			"accountingEmail":$("#carrierAccountingEmail").val(),
			"accountingPhone":Number($("#carrierAccountingPhone").val()),
			"remarks":$("#carrierRemarks").val(),
			"status":carrierStatus,
			"routeId":Number(this.carrierForm.routeId),
			"billingCountryId":Number(this.carrierForm.billingCountryId),
			"billingStateId":Number(this.carrierForm.billingStateId),
			"billingCityId":Number(this.carrierForm.billingCityId),
			"physicalCountryId":Number(this.carrierForm.physicalCountryId),
			"physicalStateId":Number(this.carrierForm.physicalStateId),
			"physicalCityId":Number(this.carrierForm.physicalCityId),
			// "clientId":Number(this.carrierForm.clientId),
		};
      		// console.log(carrier);
			const save: any = await this.request.post('/master/add_carrier',carrier);
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
				// window.location.reload();
				// this.ViewDevice();
			  }
			//   window.location.reload();
			// this.ViewDevice();
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
	}	//carrier modal end here

	//other modal1 start here 
	RemoveOtherChargeRequiredClass( ){
		$('#dispatchAmount1').removeClass("borderalert");
		$('#dispatchReason1').removeClass("borderalert");
	}

	otherChargeCount:number=0;
	totalDeductionAmount=0;
	totalReimbursement=0;
    GenerateOtherChargeFields(){

	if(($('#dispatchAmount1').val()=="")||($('#dispatchAmount1').val()=="")){
	$('#dispatchAmount1').addClass("borderalert");
		return false;
	}

	if($('#dispatchReason1').val()==""){
	$('#dispatchReason1').addClass("borderalert");
		return false;
	}

      this.otherChargeCount++;
      let row = document.createElement('div'); 
      let formRow=""; 
      //row.className = 'row';
      
      formRow += `
		<div class="row col-lg-12" style="padding-top:5px;">
			<div class="col-lg-3" style="text-align:center;">
			<label id="type`+this.otherChargeCount+`" name="type`+this.otherChargeCount+`"></label>
			</div>
			<div class="col-lg-3" style="text-align:center;">
			<label id="dispatchAmount1`+this.otherChargeCount+`" name="dispatchAmount1`+this.otherChargeCount+`"></label>
			</div>
			<div class="col-lg-4" style="text-align:center;">
			<label id="dispatchReason1`+this.otherChargeCount+`" name="dispatchReason1`+this.otherChargeCount+`"></label>
			</div>
			<div class="col-lg-2" style="text-align:center;">
			<a name="removeRow`+this.otherChargeCount+`" id="removeRow`+this.otherChargeCount+`"><i class="fa fa-close" style="font-size:25px;color:red"></i></a>
			</div>
		</div>`;
				
		row.innerHTML = formRow;
		document.querySelector('.showOtherChargeField').appendChild(row);

		if(this.otherChargeRadio=="dudection"){
			this.totalDeductionAmount+=Number(this.dispatchForm.dispatchAmount1);
			this.dispatchTotal = this.dispatchTotal-this.dispatchForm.dispatchAmount1;
			$("#dispatchTotal").val(this.dispatchTotal);
		}else{
			this.totalReimbursement+=Number(this.dispatchForm.dispatchAmount1);
			this.dispatchTotal = this.dispatchTotal+Number(this.dispatchForm.dispatchAmount1);
			$("#dispatchTotal").val(this.dispatchTotal);
		}

		if(this.otherChargeRadio=="dudection"){
			this.dispatchOtherCharge =this.dispatchOtherCharge-this.dispatchForm.dispatchAmount1;
			$("#dispatchOtherCharge").val(this.dispatchOtherCharge);
		}else{
			this.dispatchOtherCharge = this.dispatchOtherCharge+Number(this.dispatchForm.dispatchAmount1);
			$("#dispatchOtherCharge").val(this.dispatchOtherCharge);
		}

		$("#type"+this.otherChargeCount).text(this.otherChargeRadio);
        $("#dispatchAmount1"+this.otherChargeCount).text(this.dispatchForm.dispatchAmount1);
        $("#dispatchReason1"+this.otherChargeCount).text(this.dispatchForm.dispatchReason1);

	 const selectElement = document.querySelector('#removeRow'+this.otherChargeCount);
      selectElement.addEventListener('click', (event) => {
        this.otherChargeCount--;
		console.log(row);
        document.querySelector('.showOtherChargeField').removeChild(row);
      });
	  this.clearOtherCharge();
    }

	clearOtherCharge(){
		$("#dispatchAmount1").val("");
		$("#dispatchReason1").val("");
		// $("#addButtonOtherCharge").val("");
	  }
		//other modal1 ends here 


		//  shipper modal start here
		// currentDate;
		// viewDate(){
		// this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
		// alert(" >> "+this.currentDate);
		// $("#shipperDate").val(this.currentDate);
		// }


		COUNTRY_NAME="";
		GetAllCountryInfo(shipperCountryId,countryName){
		this.COUNTRY_NAME = countryName;
		}

		SHIPPER_STATE_NAME="";
		GetAllStateInfo(shipperStateId,stateName){
		this.SHIPPER_STATE_NAME = stateName;
		}

		SHIPPER_CITY_NAME="";
		GetAllCityInfo(shipperCityId,cityName){
		this.SHIPPER_CITY_NAME = cityName;
		}

		SHIPPER_NAME="";
		GetShipperInfo(shipperId,shipperName){
		this.SHIPPER_NAME = shipperName;
		
		}

		// SHIPPER_NAME="";
		// GetShipperInfo(shipperId,shipperName,physicalAddress,contactNo,countryId,stateId){
		// this.SHIPPER_NAME = shipperName;
		// $("#shipperAddress").val(physicalAddress);
		// $("#dispatchShipperContactNo").val(contactNo);
		// $("#shipperCountry").val(countryId);
		// $("#shipperState").val(stateId);
		// }

		shipperDataObj=[];
		shipperDataArr;
		async getAllShipperName(){
		try {
			const shipper = {
			'shipperId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const productData: any = await this.request.post('/master/view_shipper/',shipper);
			this.shipperDataObj=[];	
			for (let objKey of Object.keys(productData)) {
				let dataObj = productData[objKey];
				if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				// this.shipperDataObj.push(dataObj[objKey1]);
				let arr = {
					id:dataObj[objKey1].shipperId,
					shipperName:dataObj[objKey1].shipperName,
					physicalAddress:dataObj[objKey1].physicalAddress,
					contactNo:dataObj[objKey1].contactNo,
				};
				this.shipperDataObj.push(arr);
				}
				}
			}
			this.shipperDataArr = this.shipperDataObj;
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
	
  async SaveShipperModalData(){	
	let shipperStatus="",shipperAppointment="";
	try {
      if ($('#shipperStatus').is(":checked"))
        {
			shipperStatus="active";
        }else{
			shipperStatus="inactive";
        }
		if ($('#shipperAppointment').is(":checked"))
        {
			shipperAppointment="active";
        }else{
			shipperAppointment="inactive";
        }
		const shipper = {
		"shipperName":$("#shipperName").val(),
        "shipperStartTime":$("#shipperStartTime").val(),
        "shipperEndTime":$("#shipperEndTime").val(),
        "physicalAddress":$("#shipperPhysicalAddress").val(),
		"zipcode":$("#shipperZipcode").val(),
        "contactNo":$("#shippercontactNo").val(),
		"contactPerson":$("#shipperContactPerson").val(),
		"countryId":Number(this.shipperForm.countryId),
		"stateId":Number(this.shipperForm.stateId),
		"cityId":Number(this.shipperForm.cityId),
        "status":shipperStatus,
		"appointment":shipperAppointment,
		"remarks":$("#ShipperRemarks").val(),
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
			// window.location.reload();
			// this.ViewDevice();
			}
			//   window.location.reload();
			// this.ViewDevice();
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

	RemoveShipperRequiredClass( ){
		$('#shipperbordercss').removeClass("borderalert");
		$('#shipperAddress').removeClass("borderalert");
		$('#shippercountrybordercss').removeClass("borderalert");
		$('#shipperstatebordercss').removeClass("borderalert");
		$('#shippercitybordercss').removeClass("borderalert");
		$('#shipperPickUp').removeClass("borderalert");
	}
	
	shipperCount:number=0;
    GenerateShipperFields(){
		if(this.dispatchForm.shipperId>0){
			$('#shipperId').text("")
		  }else{
			$('#shipperbordercss').addClass("borderalert");
			return false;
		}

		if($('#shipperAddress').val()==""){
		$('#shipperAddress').addClass("borderalert");
			return false;
		}

		if(this.dispatchForm.shipperCountryId>0){
			$('#shipperCountryId').text("")
		  }else{
			$('#shippercountrybordercss').addClass("borderalert");
			return false;
		}

		if(this.dispatchForm.shipperStateId>0){
			$('#shipperStateId').text("")
		  }else{
			$('#shipperstatebordercss').addClass("borderalert");
			return false;
		}

		if(this.dispatchForm.shipperCityId>0){
			$('#shipperCityId').text("")
		  }else{
			$('#shippercitybordercss').addClass("borderalert");
			return false;
		}

		if($('#shipperPickUp').val()==""){
			$('#shipperPickUp').addClass("borderalert");
				return false;
			}
		
      this.shipperCount++;
      let row = document.createElement('div'); 
      let formRow=""; 
      //row.className = 'row';
      
      formRow += `
	<div class="row" style="padding-top:5px;">
		<div class="col-lg-6">
			<div class="row">
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="shipperOrder`+this.shipperCount+`" name="shipperOrder`+this.shipperCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="shipperPickUp`+this.shipperCount+`" name="shipperPickUp`+this.shipperCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="shipperName`+this.shipperCount+`" name="shipperName`+this.shipperCount+`"></label>
				<input type="hidden" id="shipperId`+this.shipperCount+`" name="shipperId`+this.shipperCount+`">
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="shipperAddress`+this.shipperCount+`" name="shipperAddress`+this.shipperCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="stateName`+this.shipperCount+`" name="stateName`+this.shipperCount+`"></label>
				<input type="hidden" id="shipperStateId`+this.shipperCount+`" name="shipperStateId`+this.shipperCount+`">
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="cityName`+this.shipperCount+`" name="cityName`+this.shipperCount+`"></label>
				<input type="hidden" id="shipperCityId`+this.shipperCount+`" name="shipperCityId`+this.shipperCount+`">
				</div>
			</div>
		</div>
		<div class="col-lg-6">
			<div class="row">
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="shipperDate`+this.shipperCount+`" name="shipperDate`+this.shipperCount+`"></label>
				</div>
				<div class="col-lg-1" style="text-align:center; padding: 0 4px;">
					<label id="shipperTime`+this.shipperCount+`" name="shipperTime`+this.shipperCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="shipperCaseCount`+this.shipperCount+`" name="shipperCaseCount`+this.shipperCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="shipperPallets`+this.shipperCount+`" name="shipperPallets`+this.shipperCount+`"></label>
				</div>
				<div class="col-lg-1" style="text-align:center; padding: 0 4px;">
					<label id="shipperWeight`+this.shipperCount+`" name="shipperWeight`+this.shipperCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="shipperShippingNotes`+this.shipperCount+`" name="shipperShippingNotes`+this.shipperCount+`"></label>
					<input type="hidden" id="dispatchShipperContactNo`+this.shipperCount+`" name="dispatchShipperContactNo`+this.shipperCount+`">
					<input type="hidden" id="disptchShipperContactPerson`+this.shipperCount+`" name="disptchShipperContactPerson`+this.shipperCount+`">
					<input type="hidden" id="shipperComodity`+this.shipperCount+`" name="shipperComodity`+this.shipperCount+`">
					<input type="hidden" id="shipperReferTemp`+this.shipperCount+`" name="shipperReferTemp`+this.shipperCount+`">
					<input type="hidden" id="shipperReferModeId`+this.shipperCount+`" name="shipperReferModeId`+this.shipperCount+`">
					<input type="hidden" id="shipperCountryId`+this.shipperCount+`" name="shipperCountryId`+this.shipperCount+`">
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<span style="padding-left:5px;"><a name="removeRowShipper`+this.shipperCount+`" id="removeRowShipper`+this.shipperCount+`"><i class="fa fa-close" style="font-size:25px;color:red"></i></a></span>
				</div>
			</div>
		</div> 
	</div>`;
                  
		row.innerHTML = formRow;
		document.querySelector('.showShipperField').appendChild(row);
        $("#shipperOrder"+this.shipperCount).text(this.dispatchForm.shipperOrder);
        $("#shipperPickUp"+this.shipperCount).text(this.dispatchForm.shipperPickUp);
        $("#shipperId"+this.shipperCount).text(this.dispatchForm.shipperId);
		$("#shipperName"+this.shipperCount).text(this.SHIPPER_NAME);
        $("#shipperAddress"+this.shipperCount).text(this.dispatchForm.shipperAddress);
		$("#shipperStateId"+this.shipperCount).text(this.dispatchForm.shipperStateId);
		$("#stateName"+this.shipperCount).text(this.SHIPPER_STATE_NAME);
        $("#shipperCityId"+this.shipperCount).text(this.dispatchForm.shipperCityId);
		$("#cityName"+this.shipperCount).text(this.SHIPPER_CITY_NAME);
        $("#shipperDate"+this.shipperCount).text(this.dispatchForm.shipperDate);
		$("#shipperTime"+this.shipperCount).text(this.dispatchForm.shipperTime);
        $("#shipperCaseCount"+this.shipperCount).text(this.dispatchForm.shipperCaseCount);
        $("#shipperPallets"+this.shipperCount).text(this.dispatchForm.shipperPallets);
        $("#shipperWeight"+this.shipperCount).text(this.dispatchForm.shipperWeight);
		$("#shipperShippingNotes"+this.shipperCount).text(this.dispatchForm.shipperShippingNotes);
		$("#dispatchShipperContactNo"+this.shipperCount).text(this.dispatchForm.dispatchShipperContactNo);
		$("#disptchShipperContactPerson"+this.shipperCount).text(this.dispatchForm.disptchShipperContactPerson);
		$("#shipperComodity"+this.shipperCount).text(this.dispatchForm.shipperComodity);
		$("#shipperReferTemp"+this.shipperCount).text(this.dispatchForm.shipperReferTemp);
		$("#shipperReferModeId"+this.shipperCount).text(this.dispatchForm.shipperReferModeId);
		$("#shipperCountryId"+this.shipperCount).text(this.dispatchForm.shipperCountryId);
		const selectElement = document.querySelector('#removeRowShipper'+this.shipperCount);
		selectElement.addEventListener('click', (event) => {
		this.shipperCount--;
		document.querySelector('.showShipperField').removeChild(row);
      	});
	  	this.ClearShipperFieldsOnReset();
    	}
	
	  ClearShipperFieldsOnReset(){
		//this.dispatchForm.shipperId = '';
		this.dispatchForm.shipperCountryId = '';
		this.dispatchForm.shipperStateId = '';
		this.dispatchForm.shipperCityId = '';
		this.dispatchForm.shipperReferModeId = '';
		$("#shipperAddress").val("");
		$("#shipperDate").val("");
		$("#shipperTime").val("");
		$("#shipperPickUp").val("");
		$("#shipperComodity").val("");
		$("#shipperReferTemp").val("");
		$("#shipperCaseCount").val("");
		$("#shipperPallets").val("");
		$("#shipperWeight").val("");
		$("#shipperShippingNotes").val("");
		$("#disptchShipperContactPerson").val("");
		$("#dispatchShipperContactNo").val("");
		//this.dispatchForm.shipperOrder = '';
		$("#shipperOrder").val("");
	  }	

	//   GetOrderValue(val){
	// 	this.shipperOrder = $("#shipperOrder").val();
	// 	$("#shipperOrder").val(this.shipperOrder);
	// 	}
	// shipper modal  end here
	
	//receiver modal start here
	RECEIVER_NAME="";
	GetReceiverInfo(receiverId,receiverName){
	this.RECEIVER_NAME = receiverName;
	}

	// RECEIVER_NAME="";
	// GetReceiverInfo(receiverId,receiverName,physicalAddress,contactNo,countryId){
	// this.RECEIVER_NAME = receiverName;
	// $("#receiverAddress").val(physicalAddress);
	// $("#receiverContactNo").val(contactNo);
	// $(this.dispatchForm.receiverCountryId).val(countryId);
	// }
	
	RECEIVER_COUNTRY_NAME="";
	GetAllReceiverCountryInfo(receiverCountryId,receiverCountryName){
	this.RECEIVER_COUNTRY_NAME = receiverCountryName;
	}

	RECEIVER_STATE_NAME="";
	GetAllReceiverStateInfo(receiverStateId,receiverStateName){
	this.RECEIVER_STATE_NAME = receiverStateName;
	}

	RECEIVER_CITY_NAME="";
	GetAllReceiverCityInfo(receiverCityId,receiverCityName){
	this.RECEIVER_CITY_NAME = receiverCityName;
	}

	receiverDataObj=[];
	receiverDataArr;
	async getAllReceiverName(){
	try {
		const receiver = {
		'receiverId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const productData: any = await this.request.post('/master/view_receiver/',receiver);
		this.receiverDataObj=[];	
		for (let objKey of Object.keys(productData)) {
			let dataObj = productData[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				// this.designationDataObj.push(dataObj[objKey1]);
				let arr = {
				id:dataObj[objKey1].receiverId,
				receiverName:dataObj[objKey1].receiverName,
				physicalAddress:dataObj[objKey1].physicalAddress,
				contactNo:dataObj[objKey1].contactNo,
				};
				this.receiverDataObj.push(arr);
				}
			}
		}
		this.receiverDataArr = this.receiverDataObj;
		} catch (error) {}
	}

		countryReceiverDataObj=[];
		countryReceiverDataArr;
		async getAllReceiverCountry(){
		try {
			const bcountry = {
			'countryId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_country/',bcountry);
			this.countryReceiverDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
			let dataObj = bcountryData[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				// this.designationDataObj.push(dataObj[objKey1]);
				let arr = {
					id:dataObj[objKey1].countryId,
					receiverCountryName:dataObj[objKey1].countryName,
				};
				this.countryReceiverDataObj.push(arr);
				}
				}
			}
			this.countryReceiverDataArr = this.countryReceiverDataObj;
		} catch (error) {}
	}

		stateReceiverDataObj=[];
		stateReceiverDataArr;
		async getAllReceiverState(){
		try {
			const bstate = {
			'stateId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_state/',bstate);
			this.stateReceiverDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				// this.designationDataObj.push(dataObj[objKey1]);
				let arr = {
				id:dataObj[objKey1].stateId,
				receiverStateName:dataObj[objKey1].stateName,
				};
				this.stateReceiverDataObj.push(arr);
				}
				}
			}
			this.stateReceiverDataArr = this.stateReceiverDataObj;
		} catch (error) {}
	}

  	cityReceiverDataObj=[];
	cityReceiverDataArr;
	async getAllReceiverCity(){
		try {
			const bcountry = {
			'cityId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_city/',bcountry);
			this.cityReceiverDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				// this.designationDataObj.push(dataObj[objKey1]);
				let arr = {
				id:dataObj[objKey1].cityId,
				receiverCityName:dataObj[objKey1].cityName,
				};
				this.cityReceiverDataObj.push(arr);
				}
				}
			}
			this.cityReceiverDataArr = this.cityReceiverDataObj;
		} catch (error) {}
	}

	async SaveReceiverModalData(){	
	let receiverStatus="",receiverAppointment="";
	try {
      if ($('#receiverStatus').is(":checked"))
        {
			receiverStatus="active";
        }else{
			receiverStatus="inactive";
        }
		if ($('#receiverAppointment').is(":checked"))
        {
			receiverAppointment="active";
        }else{
			receiverAppointment="inactive";
        }
		const receiver = {
		"receiverName":$("#receiverName").val(),
        "receiverStartTime":$("#receiverStartTime").val(),
        "receiverEndTime":$("#receiverEndTime").val(),
        "physicalAddress":$("#receiverPhysicalAddress").val(),
		"zipcode":$("#receiverZipcode").val(),
		"contactNo":Number($("#receiverContactNumber").val()),
        "contactPerson":$("#receiverContactPer").val(),
		"countryId":Number(this.receiverForm.receiverCountryId),
		"stateId":Number(this.receiverForm.receiverStateId),
		"cityId":Number(this.receiverForm.receiverCityId),
        "status":receiverStatus,
		"clientId":Number(this.receiverForm.clientId),
		"appointment":receiverAppointment,
		"remarks":$("#receiverRemarks").val(),
		};
      	// console.log(receiver);
		const save: any = await this.request.post('/master/add_receiver',receiver);
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
			// window.location.reload();
			// this.ViewDevice();
			}
			//   window.location.reload();
			// this.ViewDevice();
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
	
	RemoveReceiverRequiredBorderClass( ){
		$('#receiverbordercss').removeClass("borderalert");
		$('#receiverAddress').removeClass("borderalert");
		$('#receivercountrybordercss').removeClass("borderalert");
		$('#receiverstatebordercss').removeClass("borderalert");
		$('#receivercitybordercss').removeClass("borderalert");
		$('#receiverReceivingNo').removeClass("borderalert");
	}

	receiverCount:number=0;
    GenerateReceiverFields(){
		if(this.dispatchForm.receiverId>0){
			$('#receiverId').text("")
		  }else{
			$('#receiverbordercss').addClass("borderalert");
			return false;
		}

		if($('#receiverAddress').val()==""){
		$('#receiverAddress').addClass("borderalert");
			return false;
		}

		if(this.dispatchForm.receiverCountryId>0){
			$('#receiverCountryId').text("")
		  }else{
			$('#receivercountrybordercss').addClass("borderalert");
			return false;
		}

		if(this.dispatchForm.receiverStateId>0){
			$('#receiverStateId').text("")
		  }else{
			$('#receiverstatebordercss').addClass("borderalert");
			return false;
		}

		if(this.dispatchForm.receiverCityId>0){
			$('#receiverCityId').text("")
		  }else{
			$('#receivercitybordercss').addClass("borderalert");
			return false;
		}

		if($('#receiverReceivingNo').val()==""){
			$('#receiverReceivingNo').addClass("borderalert");
				return false;
			}
      this.receiverCount++;
      let row = document.createElement('div'); 
      let formRow=""; 
      //row.className = 'row';
      formRow += `
	<div class="row" style="padding-top:5px;">
		<div class="col-lg-6">
			<div class="row">
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="receiverOrder`+this.receiverCount+`" name="receiverOrder`+this.receiverCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="receiverReceivingNo`+this.receiverCount+`" name="receiverReceivingNo`+this.receiverCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="receiverName`+this.receiverCount+`" name="receiverName`+this.receiverCount+`"></label>
				<input type="hidden" id="receiverId`+this.receiverCount+`" name="receiverId`+this.receiverCount+`">
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="receiverAddress`+this.receiverCount+`" name="receiverAddress`+this.receiverCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="receiverStateName`+this.receiverCount+`" name="receiverStateName`+this.receiverCount+`"></label>
				<input type="hidden" id="receiverStateId`+this.receiverCount+`" name="receiverStateId`+this.receiverCount+`">
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="receiverCityName`+this.receiverCount+`" name="receiverCityName`+this.receiverCount+`"></label>
				<input type="hidden" id="receiverCityId`+this.receiverCount+`" name="receiverCityId`+this.receiverCount+`">
				</div>
			</div>
		</div>
		<div class="col-lg-6">
			<div class="row">
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
				<label id="receiverDate`+this.receiverCount+`" name="receiverDate`+this.receiverCount+`"></label>
				</div>
				<div class="col-lg-1" style="text-align:center; padding: 0 4px;">
					<label id="receiverTime`+this.receiverCount+`" name="receiverTime`+this.receiverCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="receiverCaseCount`+this.receiverCount+`" name="receiverCaseCount`+this.receiverCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="receiverPallets`+this.receiverCount+`" name="receiverPallets`+this.receiverCount+`"></label>
				</div>
				<div class="col-lg-1" style="text-align:center; padding: 0 4px;">
					<label id="receiverWeight`+this.receiverCount+`" name="receiverWeight`+this.receiverCount+`"></label>
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<label id="receiverShippingNotes`+this.receiverCount+`" name="receiverShippingNotes`+this.receiverCount+`"></label>
					<input type="hidden" id="receiverContactNo`+this.receiverCount+`" name="receiverContactNo`+this.receiverCount+`">
					<input type="hidden" id="receiverContactPerson`+this.receiverCount+`" name="receiverContactPerson`+this.receiverCount+`">
					<input type="hidden" id="receiverComodity`+this.receiverCount+`" name="receiverComodity`+this.receiverCount+`">
					<input type="hidden" id="receiverReeferTemp`+this.receiverCount+`" name="receiverReeferTemp`+this.receiverCount+`">
					<input type="hidden" id="receiverReferModeId`+this.receiverCount+`" name="receiverReferModeId`+this.receiverCount+`">
					<input type="hidden" id="receiverCountryId`+this.receiverCount+`" name="receiverCountryId`+this.receiverCount+`">
				</div>
				<div class="col-lg-2" style="text-align:center; padding: 0 4px;">
					<span style="padding-left:5px;"><a name="removeRow`+this.receiverCount+`" id="removeRow`+this.receiverCount+`"><i class="fa fa-close" style="font-size:25px;color:red"></i></a></span>
				</div>
			</div>
		</div> 
	</div>`;
                  
	row.innerHTML = formRow;
	document.querySelector('.showReceiverField').appendChild(row);
	$("#receiverOrder"+this.receiverCount).text(this.dispatchForm.receiverOrder);
	$("#receiverReceivingNo"+this.receiverCount).text(this.dispatchForm.receiverReceivingNo);
	$("#receiverId"+this.receiverCount).text(this.dispatchForm.receiverId);
	$("#receiverName"+this.receiverCount).text(this.RECEIVER_NAME);
	$("#receiverAddress"+this.receiverCount).text(this.dispatchForm.receiverAddress);
	$("#receiverStateId"+this.receiverCount).text(this.dispatchForm.receiverStateId);
	$("#receiverStateName"+this.receiverCount).text(this.RECEIVER_STATE_NAME);
	$("#receiverCityId"+this.receiverCount).text(this.dispatchForm.receiverCityId);
	$("#receiverCityName"+this.receiverCount).text(this.RECEIVER_CITY_NAME);
	$("#receiverDate"+this.receiverCount).text(this.dispatchForm.receiverDate);
	$("#receiverTime"+this.receiverCount).text(this.dispatchForm.receiverTime);
	$("#receiverCaseCount"+this.receiverCount).text(this.dispatchForm.receiverCaseCount);
	$("#receiverPallets"+this.receiverCount).text(this.dispatchForm.receiverPallets);
	$("#receiverWeight"+this.receiverCount).text(this.dispatchForm.receiverWeight);
	$("#receiverShippingNotes"+this.receiverCount).text(this.dispatchForm.receiverShippingNotes);
	$("#receiverContactNo"+this.receiverCount).text(this.dispatchForm.receiverContactNo);
	$("#receiverContactPerson"+this.receiverCount).text(this.dispatchForm.receiverContactPerson);
	$("#receiverComodity"+this.receiverCount).text(this.dispatchForm.receiverComodity);
	$("#receiverReeferTemp"+this.receiverCount).text(this.dispatchForm.receiverReeferTemp);
	$("#receiverReferModeId"+this.receiverCount).text(this.dispatchForm.receiverReferModeId);
	$("#receiverCountryId"+this.receiverCount).text(this.dispatchForm.receiverCountryId);
	const selectElement = document.querySelector('#removeRow'+this.receiverCount);
	selectElement.addEventListener('click', (event) => {
	this.receiverCount--;
	document.querySelector('.showReceiverField').removeChild(row);
	});
	this.ClearReciverFieldsOnReset();
	}

	ClearReciverFieldsOnReset(){
	//this.dispatchForm.receiverId = '';
	this.dispatchForm.receiverCountryId = '';
	this.dispatchForm.receiverStateId = '';
	this.dispatchForm.receiverCityId = '';
	this.dispatchForm.receiverReferModeId = '';
	$("#receiverName").val("");
	$("#receiverAddress").val("");
	$("#receiverDate").val("");
	$("#receiverTime").val("");
	$("#receiverReceivingNo").val("");
	$("#receiverComodity").val("");
	$("#receiverReeferTemp").val("");
	$("#receiverCaseCount").val("");
	$("#receiverPallets").val("");
	$("#receiverWeight").val("");
	$("#receiverShippingNotes").val("");
	$("#receiverContactPerson").val("");
	$("#receiverContactNo").val("");
	$("#receiverOrder").val("");
	}	
	//receiver modal ends here

	shipperData=[];
	receiverData=[];
	otherChargeData=[];
	dispatchData=[];
	shipperDate;
	receiverDate;
	async SaveDispatchModalData(){	
	this.isEditMode=false;
	this.isViewMode=false;
	try {
	if($("#shipperDate").val()==null || $("#shipperDate").val()==""){
		this.shipperDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
		}else{
		this.shipperDate=( this.datePipe.transform($("#shipperDate").val(), 'yyyy-MM-dd'));
		}

	if($("#receiverDate").val()==null || $("#receiverDate").val()==""){
		this.receiverDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
		}else{
		this.receiverDate=( this.datePipe.transform($("#receiverDate").val(), 'yyyy-MM-dd'));
		}	
	this.shipperData=[];
	this.receiverData=[];
	this.otherChargeData=[];
	this.dispatchData=[];
	for(let i=1;i<=this.shipperCount;i++){
	let arrData={
		shipperId:Number($("#shipperId"+i).text()),
		shipperName:$("#shipperName"+i).text(),
		address:$("#shipperAddress"+i).text(),
		countryId:Number($("#shipperCountryId"+i).text()),
		stateId:Number($("#shipperStateId"+i).text()),
		stateName:$("#stateName"+i).text(),
		cityId:Number($("#shipperCityId"+i).text()),
		cityName:$("#cityName"+i).text(),
		date:this.shipperDate,
		time:$("#shipperTime"+i).text(),
		pickupNo:$("#shipperPickUp"+i).text(),
		comodity:$("#shipperComodity"+i).text(),
		reeferTemp:Number($("#shipperReferTemp"+i).text()),
		referModeId:Number($("#shipperReferModeId"+i).text()),
		caseCount:Number($("#shipperCaseCount"+i).text()),
		pallets:Number($("#shipperPallets"+i).text()),
		weight:Number($("#shipperWeight"+i).text()),
		shippingNotes:$("#shipperShippingNotes"+i).text(),
		contactPerson:$("#disptchShipperContactPerson"+i).text(),
		mobileNo:$("#disptchShipperContactPerson"+i).text(),
		order:$("#shipperOrder"+i).text(),
	}
	this.shipperData.push(arrData);
	}
	 console.log(this.shipperData);

	for(let i=1;i<=this.receiverCount;i++){
	let arrData1={
		receiverId:Number($("#receiverId"+i).text()),
		receiverName:$("#receiverName"+i).text(),
		address:$("#receiverAddress"+i).text(),
		countryId:Number($("#receiverCountryId"+i).text()),
		stateId:Number($("#receiverStateId"+i).text()),
		receiverStateName:$("#receiverStateName"+i).text(),
		cityId:Number($("#receiverCityId"+i).text()),
		receiverCityName:$("#receiverCityName"+i).text(),
		date:this.receiverDate,
		time:$("#receiverTime"+i).text(),
		receivingNo:$("#receiverReceivingNo"+i).text(),
		comodity:$("#receiverComodity"+i).text(),
		reeferTemp:Number($("#receiverReeferTemp"+i).text()),
		referModeId:Number($("#receiverReferModeId"+i).text()),
		caseCount:Number($("#receiverCaseCount"+i).text()),
		pallets:Number($("#receiverPallets"+i).text()),
		weight:Number($("#receiverWeight"+i).text()),
		shippingNotes:$("#receiverShippingNotes"+i).text(),
		contactPerson:$("#receiverContactPerson"+i).text(),
		mobileNo:$("#receiverContactNo"+i).text(),
		order:$("#receiverOrder"+i).text(),
	}
	this.receiverData.push(arrData1);
	}
	 console.log(this.receiverData);

	for(let i=1;i<=this.otherChargeCount;i++){
		let arrData2={
			type:$("#type"+i).text(),
			amount:Number($("#dispatchAmount1"+i).text()),
			reason:$("#dispatchReason1"+i).text(),
		}
		this.otherChargeData.push(arrData2);
		}
		// console.log(this.otherChargeData);

		let arrData3={
		clientId:Number(localStorage.getItem("clientId")),
		clientName:localStorage.getItem("clientName"),
		load:$("#dispatchLoad").val(),
		customerId:Number(this.dispatchForm.customerId),
		customerReferenceNo:$("#dispatchCustomerReferenceNo").val(),
		dispatcher:$("#dispatchDispatcher").val(),
		loadEnterBy:$("#dispatchLoadEnterBy").val(),
		currency:$("#dispatchCurrency").val(),
		flatRate:Number($("#dispatchFlatRate").val()),
		extraPD:Number($("#dispatchExtraPD").val()),
		fuelSurCharge:Number($("#dispatchFuelFuelSurCharge").val()),
		extraCharge:Number($("#dispatchExtraCharge").val()),
		otherCharge:Number($("#dispatchOtherCharge").val()),
		total:Number($("#dispatchTotal").val()),
		dudectionTotal:Number(this.totalDeductionAmount),
		reimbursementTotal:Number(this.totalReimbursement),
		dispatchBy:this.radioValue,
		driverId:Number(this.dispatchForm.employeeId),
		coDriverId:Number(this.dispatchForm.coDriverId),
		driverTruckId:Number(this.dispatchForm.vehicleId),
		driverTrailerId:Number(this.dispatchForm.trailerId),
		driverTruck:(this.VEHICLE_NO),
		driverTrailer:(this.TRAILER_NAME),
		driverRate:Number($("#driverRate").val()),
		totalMiles:Number($("#driverTotalMiles").val()),
		carrierId:Number(this.dispatchForm.carrierId),
		carrierTruck:$("#carrierTruck").val(),
		carrierTrailer:$("#carrierTrailer").val(),
		equipmentType:Number($("#carrierEquipmentType").val()),
		carrierRate:Number($("#carrierRate").val()),
		carrierOtherCharges:Number($("#carrierOtherCharges").val()),
		isDataSaveAsDraft:"false",
		}
		this.dispatchData.push(arrData3);
		// console.log(this.dispatchData);
		const dispatch = {
		"dispatchData":this.dispatchData,
		"shipperData":this.shipperData,
		"receiverData":this.receiverData,
		"otherChargeData":this.otherChargeData,
		// "clientId":Number(this.dispatchForm.clientId),
		};
      	console.log(dispatch);
		const save: any = await this.request.post('/dispatch/add_dispatch_details',dispatch);
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
			this.ViewDispatch();
			}
			window.location.reload();
			this.ViewDispatch();
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
	}
