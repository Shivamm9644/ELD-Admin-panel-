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
  selector: 'app-device-modal',
  templateUrl: './device-modal.component.html',
  styleUrls: ['./device-modal.component.scss']
})
export class DeviceModalComponent implements OnInit {
  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  deviceModalForm:any={}
  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    // private datePipe : DatePipe
  ) { }

  ClearForm(){
	this.deviceModalForm={};
  }

  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
    this.ViewDeviceModal();
    this.getAllClient();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
        //   text: '<i class="fa fa-file-text-o"></i>',
		text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Device Modal Report' 
        },
        {
          extend: 'excel',
        //   text: '<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Device Modal Report' 
        },
        {
          extend: 'pdf',
        //   text: '<i class="fa fa-file-pdf-o"></i>',
		text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Device Modal Report' 
        }
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
	deviceModalViewDetails;
	async EditDeviceModal(deviceModalId){
		try {
		this.isEditMode=true;
		const device = {
		'deviceModalId': deviceModalId,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_device_modal/',device);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.deviceModalViewDetails = dataObj[objKey1];
				} 
			}				
		}
			this.deviceModalForm = this.deviceModalViewDetails;
		} catch (error) {}
	}

  deviceModalDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewDeviceModal(){
    try {
      this.isLoading = true;
      const device = {
        'deviceModalId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_device_modal',device);
      this.deviceModalDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.deviceModalDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.deviceModalDetails;
      // console.log(this.deviceModalDetails);
      this.isLoading = false;
    } catch (error) {}
  }
  
  isUpdatedRecord;
  message;
  async SaveDeviceModal(){	
      this.isEditMode=false;
    	this.isViewMode=false;
		try{
		const device = {
        "deviceModalName":$("#deviceModalName").val(),
        "clientId":Number(this.deviceModalForm.clientId),
		};
      console.log(device);
		const save: any = await this.request.post('/master/add_device_modal',device);
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
			this.ViewDeviceModal();
			}
			window.location.reload();
			this.ViewDeviceModal();
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

	async UpdateDeviceModal(){	
	// this.isEditMode=false;
	// this.isViewMode=false;
		try{
		const device = {
		"deviceModalId":Number(this.deviceModalForm.deviceModalId),
		"deviceModalName":$("#deviceModalName").val(),
		"clientId":Number(this.deviceModalForm.clientId),
		};
		// console.log(device);
		const save: any = await this.request.post('/master/update_device_modal',device);
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
				this.ViewDeviceModal();
			}
				window.location.reload();
				this.ViewDeviceModal();
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
			  
	async DeleteDeviceModal() {
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
		'deviceModalId': Number(this.deviceModalForm.deviceModalId)
		};
		const allow: any = await this.request.post('/master/delete_device_modal/',device);
		if (allow) {
		// Successfully Deleted
		Swal.fire(
		'Deleted!',
		'Device Modal Information has been deleted.',
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
