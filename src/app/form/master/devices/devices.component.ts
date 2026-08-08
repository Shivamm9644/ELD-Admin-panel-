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
import { DatePipe } from '@angular/common';
declare let $: any;
import jsPDF from 'jspdf';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;

  deviceForm:any={}
  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
    this.ViewDevice();
    this.getDeviceModal();
    this.getPaymentStatus();
    this.getAllClient();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      // pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      
        buttons: [
         
        {
          extend: 'csv',
          text: '<i class="fa fa-file-text-o"></i>',
          titleAttr: 'Download as CSV',
          title: 'Device Report' 
        },
        {
          extend: 'excel',
          text: '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: 'Device Report' 
        },
        {
          extend: 'pdf',
          text: '<i class="fa fa-file-pdf-o"></i>',
          titleAttr: 'Download as Pdf',
          title: 'Device Report' 
        }
      ]
    //   buttons: [
    //      'csv', 'excel', 'pdf'
    // ]
    };
  }

  // public downloadAsPDF() {
  //   let options : any = {
  //     orientation: 'p',
  //     unit: 'pt',
  //     format: 'a3',
  //     };
  //   let pdf = new jsPDF(options);
  //   pdf.html(this.challanTable.nativeElement, {
  //     callback: (pdf) => {
  //       // save pdf
  //       pdf.save("challan.pdf");
  //     },
  //     margin:50,
  //     x: 15,
  //     y: 15
  //   })
  // }

  	deviceModalNameDataObj=[];
	deviceModalNameDataArr;
	async getDeviceModal(){
	try {
		const device = {
		'deviceModalId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const deviceModal: any = await this.request.post('/master/view_device_modal/',device);
		this.deviceModalNameDataObj=[];	
		for (let objKey of Object.keys(deviceModal)) {
			let dataObj = deviceModal[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					// this.designationDataObj.push(dataObj[objKey1]);
					let arr = {
						id:dataObj[objKey1].deviceModalId,
						deviceModalName:dataObj[objKey1].deviceModalName,
					};
					this.deviceModalNameDataObj.push(arr);
				}
			}
		}
			this.deviceModalNameDataArr = this.deviceModalNameDataObj;
		} catch (error) {}
	}

  	paymentStatusNameDataObj=[];
	paymentStatusNameDataArr;
	async getPaymentStatus(){
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

  ClearFieldsOnCancel(){
	this.deviceForm.deviceModalId = '';
	this.deviceForm.paymentStatusId = '';
	this.deviceForm.clientId = '';
	$("#deviceNo").val("");
	$("#macId").val("");
	$("#serialNo").val("");
	$("#mobileNo").val("");
	$("#serviceDate").val("");
	$("#billingDate").val("");
	$("#warrantyDate").val("");
	this.deviceForm.status = '';
	// $("#status").val("");
  }	

  isViewMode;
  deviceViewDetails;
  async EditDevice(deviceId){
    try {
    this.isEditMode=true;
    const device = {
	'deviceId': deviceId,
	'clientId':Number(localStorage.getItem("clientId")),
    };
    const data: any = await this.request.post('/master/view_device',device);
    for (let objKey of Object.keys(data)) {
      let dataObj = data[objKey];
      if(objKey=="result"){
        for (let objKey1 of Object.keys(dataObj)) {
			this.deviceViewDetails = dataObj[objKey1];
			// alert(">> "+this.deviceViewDetails);
        } 
      }				
    }
        this.deviceForm = this.deviceViewDetails;
		// alert(">> "+this.deviceViewDetails);
    } catch (error) {}
    }

  deviceDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewDevice(){
    try {
      this.isLoading = true;
      const device = {
        'deviceId': 0,
        'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_device',device);
      this.deviceDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.deviceDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.deviceDetails;
      // this.rerender();
      // if(this.isSuperAdmin==false){
      //   if(this.actionAssign.get("delete")=="delete"){
      //     this.isDeleteAction = true;
      //   }
      //   if(this.actionAssign.get("update")=="update"){
      //   this.isEditAction = true;
      //   }
      // }
      // console.log(this.deviceDetails);
      this.isLoading = false;
    } catch (error) {}
  }

  async DeleteDevices() {
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
		const device = {
		'deviceId': Number(this.deviceForm.deviceId)
		};
		const allow: any = await this.request.post('/master/delete_device/',device);
		if (allow) {
		// Successfully Deleted
		Swal.fire(
		'Deleted!',
		'Device Information has been deleted.',
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

  serviceDate;
  warrantyDate;
  billingDate;
  isUpdatedRecord;
  message;
  async SaveDevices(){	
    this.isEditMode=false;
    this.isViewMode=false;
	let status=""
	try {
	if ($('#status').is(":checked"))
	{
	status="active";
	}else{
	status="inactive";
	}

	if($("#serviceDate").val()==null || $("#serviceDate").val()==""){
	this.serviceDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
	}else{
	this.serviceDate=( this.datePipe.transform($("#serviceDate").val(), 'yyyy-MM-dd'));
	}
	
	if($("#warrantyDate").val()==null || $("#warrantyDate").val()==""){
	this.warrantyDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
	}else{
	this.warrantyDate=( this.datePipe.transform($("#warrantyDate").val(), 'yyyy-MM-dd'));
	}

	if($("#billingDate").val()==null || $("#billingDate").val()==""){
	this.billingDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
	}else{
	this.billingDate=( this.datePipe.transform($("#billingDate").val(), 'yyyy-MM-dd'));
	}
	
	const Device = {
	"deviceNo":$("#deviceNo").val(),
	"macId":$("#macId").val(),
	"serialNo":$("#serialNo").val(),
	"deviceModelId":Number(this.deviceForm.deviceModelId),
	"mobileNo":Number($("#mobileNo").val()),
	"serviceDate":this.serviceDate,
	"billingDate":this.billingDate,
	"paymentStatusId":Number(this.deviceForm.paymentStatusId),
	"warrantyDate":this.warrantyDate,
	"status":status,
	"clientId":Number(this.deviceForm.clientId),
	};
	 console.log(Device);
	const save: any = await this.request.post('/master/add_device',Device);
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
			this.ViewDevice();
			}
			window.location.reload();
			this.ViewDevice();
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

	status;
  	async UpdateDevices(){	
	 let status="";
	try {
      if ($('#status').is(":checked"))
        {
          status="active";
        }else{
          status="inactive";
        }
		const Device = {
        "deviceId":Number(this.deviceForm.deviceId),
		"deviceNo":$("#deviceNo").val(),
        "macId":$("#macId").val(),
        "serialNo":$("#serialNo").val(),
        "deviceModelId":Number(this.deviceForm.deviceModelId),
        "mobileNo":Number($("#mobileNo").val()),
		"serviceDate":$("#serviceDate").val(),
        "billingDate":$("#billingDate").val(),
        "paymentStatusId":Number(this.deviceForm.paymentStatusId),
		"warrantyDate":$("#warrantyDate").val(),
        "status":status,
        "clientId":Number(this.deviceForm.clientId),
		};
      	// console.log(Device);
		const save: any = await this.request.post('/master/update_device',Device);
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
				this.ViewDevice();
			  }
			   window.location.reload();
				this.ViewDevice();
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
