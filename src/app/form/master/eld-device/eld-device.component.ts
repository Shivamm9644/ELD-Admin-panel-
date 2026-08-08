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
  selector: 'app-eld-device',
  templateUrl: './eld-device.component.html',
  styleUrls: ['./eld-device.component.scss']
})
export class EldDeviceComponent implements OnInit {

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

  ClearForm(){
    this.deviceForm={};
  }

  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
    this.ViewDevice();
    this.getDeviceModal();
    this.getVehicles();
    this.getAllClient();
    this.getWarranty();
    this.deviceForm.billingDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.deviceForm.status=true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 1000,
      paginate: false,
      processing: true,
      dom: 'Bfrtip',
      
        buttons: [
         
        {
          extend: 'csv',
          // text: '<i class="fa fa-file-text-o"></i>',
          text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Device Report' 
        },
        {
          extend: 'excel',
          // text: '<i class="fa fa-file-excel-o"></i>',
          text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Device Report' 
        },
        {
          extend: 'pdf',
          // text: '<i class="fa fa-file-pdf-o"></i>',
          text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Device Report' 
        }
      ]
    //   buttons: [
    //      'csv', 'excel', 'pdf'
    // ]
    };
  }

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

  vehicleDataObj=[];
	vehicleDataArr;
	async getVehicles(){
	try {
		const vehicles = {
		'vehicleId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_vehicle/',vehicles);
		this.vehicleDataObj=[];	
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
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
  	
  warrantyDataObj=[];
	warrantyDataArr;
	async getWarranty(){
	try {
    for(let i=0;i<=5;i++){
      let arr = {
        id:i,
        warranty:i,
      };
      this.warrantyDataObj.push(arr);
    }
		this.warrantyDataArr = this.warrantyDataObj;
		} catch (error) {}
	}

  GetWarrantyDate(warranty){
    this.deviceForm.warrantyFromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const sDate = new Date();
    sDate.setFullYear(sDate.getFullYear() + warranty);
    this.deviceForm.warrantyToDate = this.datePipe.transform(sDate, 'yyyy-MM-dd');
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
    this.deviceForm.warrantyValue = '';
    this.deviceForm.clientId = '';
    this.deviceForm.vehicleId = '';
    $("#deviceNo").val("");
    $("#macId").val("");
    $("#serialNo").val("");
    $("#billingDate").val("");
    $("#warrantyFromDate").val("");
    $("#warrantyToDate").val("");
    this.deviceForm.status = '';
    $("#malFunction").val("");
    $("#fwVersion").val("");
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
      // console.log(this.deviceViewDetails.warranty);
      this.deviceForm = this.deviceViewDetails;
      if(this.deviceViewDetails.status=="active"){
        this.deviceForm.warrantyValue=true;
      }else{
        this.deviceForm.warrantyValue=false;
      }
      this.deviceForm.warrantyValue = Number(this.deviceViewDetails.warranty);
      
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
      window.location.reload();
		} else {
		Swal.fire(
			'Error!'
		);
		}
	}
}

  warrantyFromDate;
  warrantyToDate;
  billingDate;
  isUpdatedRecord;
  message;
  async SaveDevices(){	
    this.isEditMode=false;
    this.isViewMode=false;
	try {
    let status=""
    if ($('#status').is(":checked"))
    {
    status="active";
    }else{
    status="inactive";
    }
	if($("#warrantyFromDate").val()==null || $("#warrantyFromDate").val()==""){
	  this.warrantyFromDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
	}else{
	  this.warrantyFromDate=( this.datePipe.transform($("#warrantyFromDate").val(), 'yyyy-MM-dd'));
	}

  if($("#warrantyToDate").val()==null || $("#warrantyToDate").val()==""){
	  this.warrantyToDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
	}else{
	  this.warrantyToDate=( this.datePipe.transform($("#warrantyToDate").val(), 'yyyy-MM-dd'));
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
    "billingDate":this.billingDate,
    "warranty":Number(this.deviceForm.warrantyValue),
    "warrantyFromDate":this.warrantyFromDate,
    "warrantyToDate":this.warrantyToDate,
    "vehicleId":Number(this.deviceForm.vehicleId),
    "clientId":Number(this.deviceForm.clientId),
    "status":status,
    "malFunction":$("#malFunction").val(),
    "fwVersion":$("#fwVersion").val(),
	};
	//  console.log(Device);
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
	  try {

      let status=""
      if ($('#status').is(":checked"))
      {
      status="active";
      }else{
      status="inactive";
      }

      if($("#warrantyFromDate").val()==null || $("#warrantyFromDate").val()==""){
        this.warrantyFromDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
      }else{
        this.warrantyFromDate=( this.datePipe.transform($("#warrantyFromDate").val(), 'yyyy-MM-dd'));
      }
    
      if($("#warrantyToDate").val()==null || $("#warrantyToDate").val()==""){
        this.warrantyToDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
      }else{
        this.warrantyToDate=( this.datePipe.transform($("#warrantyToDate").val(), 'yyyy-MM-dd'));
      }
    
      if($("#billingDate").val()==null || $("#billingDate").val()==""){
      this.billingDate=( this.datePipe.transform(new Date("1970-01-01"), 'yyyy-MM-dd'));
      }else{
      this.billingDate=( this.datePipe.transform($("#billingDate").val(), 'yyyy-MM-dd'));
      }
      
      const Device = {
        "deviceId":Number(this.deviceForm.deviceId),
        "deviceNo":$("#deviceNo").val(),
        "macId":$("#macId").val(),
        "serialNo":$("#serialNo").val(),
        "deviceModelId":Number(this.deviceForm.deviceModelId),
        "billingDate":this.billingDate,
        "warranty":Number(this.deviceForm.warrantyValue),
        "warrantyFromDate":this.warrantyFromDate,
        "warrantyToDate":this.warrantyToDate,
        "vehicleId":Number(this.deviceForm.vehicleId),
        "clientId":Number(this.deviceForm.clientId),  
        "status":status,
        "malFunction":$("#malFunction").val(),
        "fwVersion":$("#fwVersion").val(),
      };
      console.log(Device);
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
