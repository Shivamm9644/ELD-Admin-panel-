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
  selector: 'app-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.scss']
})
export class CarrierComponent implements OnInit {
	isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;

  carrierForm:any={}
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
    this.ViewCarrierReport();
    this.getAllRoute();
    this.getAllBillingCountry();
    this.getAllBillingState();
    this.getAllBillingCity();
    this.getAllPhysicalCountry();
    this.getAllPhysicalState();
    this.getAllPhysicalCity();
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
          title: 'Carrier Report' 
        },
        {
          extend: 'excel',
          text:      '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: 'Carrier Report' 
        },
		{
			extend: 'pdf',
			text: '<i class="fa fa-file-pdf-o"></i>',
			titleAttr: 'Download as Pdf',
			title: 'Carrier Report' 
		},
      ]
    };
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
	carrierViewDetails;
	async EditCarrier(carrierId){
		try {
		this.isEditMode=true;
		const carrier = {
		'carrierId': carrierId,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_carrier',carrier);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.carrierViewDetails = dataObj[objKey1];
				} 
			}				
		}
		  this.carrierForm = this.carrierViewDetails;
		} catch (error) {}
	  }

  carrierDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewCarrierReport(){
    try {
      this.isLoading = true;
      const carrier = {
        'carrierId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_carrier',carrier);
      this.carrierDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.carrierDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.carrierDetails;
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
  
  isUpdatedRecord;
  message;
  async SaveCarrierModalData(){	
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
			const carrier = {
				"carrierName":$("#carrierName").val(),
				"dot":$("#dot").val(),
				"taxId":$("#taxId").val(),
				"billingAddress":$("#billingAddress").val(),
				"billingZipcode":Number($("#billingZipcode").val()),
				"contactEmail":$("#contactEmail").val(),
				"contactPhone":Number($("#contactPhone").val()),
				"physicalAddress":$("#physicalAddress").val(),
				"physicalZipcode":Number($("#physicalZipcode").val()),
				"mainEmail":$("#mainEmail").val(),
				"mainPhone":Number($("#mainPhone").val()),
				"mcNumber":$("#mcNumber").val(),
				"afterHoursPhone":Number($("#afterHoursPhone").val()),
				"accountingEmail":$("#accountingEmail").val(),
				"accountingPhone":Number($("#accountingPhone").val()),
				"remarks":$("#remarks").val(),
				"status":status,
				"routeId":Number(this.carrierForm.routeId),
				"billingCountryId":Number(this.carrierForm.billingCountryId),
				"billingStateId":Number(this.carrierForm.billingStateId),
				"billingCityId":Number(this.carrierForm.billingCityId),
				"physicalCountryId":Number(this.carrierForm.physicalCountryId),
				"physicalStateId":Number(this.carrierForm.physicalStateId),
				"physicalCityId":Number(this.carrierForm.physicalCityId),
				"clientId":Number(this.carrierForm.clientId),
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
				 window.location.reload();
				this.ViewCarrierReport();
			  }
			  window.location.reload();
			this.ViewCarrierReport();
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

	async UpdateCarrierModalData(){	
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
		const carrier = {
			"carrierId":Number(this.carrierForm.carrierId),
			"carrierName":$("#carrierName").val(),
			"dot":$("#dot").val(),
			"taxId":$("#taxId").val(),
			"billingAddress":$("#billingAddress").val(),
			"billingZipcode":Number($("#billingZipcode").val()),
			"contactEmail":$("#contactEmail").val(),
			"contactPhone":Number($("#contactPhone").val()),
			"physicalAddress":$("#physicalAddress").val(),
			"physicalZipcode":Number($("#physicalZipcode").val()),
			"mainEmail":$("#mainEmail").val(),
			"mainPhone":Number($("#mainPhone").val()),
			"mcNumber":$("#mcNumber").val(),
			"afterHoursPhone":Number($("#afterHoursPhone").val()),
			"accountingEmail":$("#accountingEmail").val(),
			"accountingPhone":Number($("#accountingPhone").val()),
			"remarks":$("#remarks").val(),
			"status":status,
			"routeId":Number(this.carrierForm.routeId),
			"billingCountryId":Number(this.carrierForm.billingCountryId),
			"billingStateId":Number(this.carrierForm.billingStateId),
			"billingCityId":Number(this.carrierForm.billingCityId),
			"physicalCountryId":Number(this.carrierForm.physicalCountryId),
			"physicalStateId":Number(this.carrierForm.physicalStateId),
			"physicalCityId":Number(this.carrierForm.physicalCityId),
			"clientId":Number(this.carrierForm.clientId),
		};
		// console.log(carrier);
		const save: any = await this.request.post('/master/update_carrier',carrier);
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
			this.ViewCarrierReport();
			}
			window.location.reload();
		this.ViewCarrierReport();
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
  
	async DeleteCarrierModalData() {
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
			const carrier = {
			'carrierId': Number(this.carrierForm.carrierId)
			};
			const allow: any = await this.request.post('/master/delete_carrier/',carrier);
			if (allow) {
			// Successfully Deleted
			Swal.fire(
			'Deleted!',
			'Carrier Information has been deleted.',
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
