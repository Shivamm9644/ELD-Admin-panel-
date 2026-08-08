import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
// import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
 import { DatePipe } from '@angular/common';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from 'src/services/request.service';
import { MasterService } from 'src/services/master.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import  { FormBuilder } from '@angular/forms'
// import * as $ from 'jquery';
// import 'datatables.net';
import { from, Subject } from 'rxjs';
import { get } from 'jquery';
declare let $: any;
import jsPDF from 'jspdf';


@Component({
  selector: 'app-manage-ota',
  templateUrl: './manage-ota.component.html',
  styleUrls: ['./manage-ota.component.scss']
})
export class ManageOtaComponent implements OnInit {

isEditMode: boolean=false;
countryForm: any = {}
@ViewChild(DataTableDirective, {static: false})
dtElement: DataTableDirective;
dtOptions: any = {};
// dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject();
searchText: String;

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
     this.ViewOTA();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
          className: 'btn btn-danger',
        //   text:      '<i class="fa fa-file-text-o"></i>',
		text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'OTA Report' 
        },
        {
          extend: 'excel',
        //   text:      '<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'OTA Report' 
        },
        {
          extend: 'pdf',
        //   text: '<i class="fa fa-file-pdf-o"></i>',
		text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'OTA Report' 
        },
      ]
    };
  }


  selectedFiles;
	selectFile(event) {
		this.selectedFiles = event.target.files;
	}

  isViewMode;
  otaForm: any = {}
  otaDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewOTA(){
    try {
      this.isLoading = true;
      const ota = {
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/dispatch/view_eld_ota',ota);
      this.otaDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.otaDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.otaDetails;
      this.isLoading = false;
    } catch (error) {}
  }

  openFile(otaUrl) {
    window.open(otaUrl);
}

  openDocument(firmwareFileName) {
    window.open(firmwareFileName);
}

  isSaved;
	errorMessage;
	isError;
  	async SaveOta(){
    let processOta=0;
    if ($('#processOta').is(":checked"))
		{
    processOta=1;
		}else{
    processOta=0;
		}
		// this.isEditMode=false;
		// if($("#documentName").val()=="0"){
		// 	$("#isDocumentNameValid").text("Document name is required");
		// 	return;
		// }
		
		// if($("#file").val()==""){
		// 	$("#isDocumentFileValid").text("Document file is required");
		// 	return;
		// }
		// if($("#documentNo").val()==""){
		// 	$("#isDocumentNoValid").text("Document no. is required");
		// 	return;
		// }
		// if($("#expenseAmount").val()==""){
		// 	$("#isExpenseAmountValid").text("Expense amount is required");
		// 	return;
		// }
		
		// if($("#issueDate").val()==""){
		// 	$("#isIssuedDateValid").text("Issue date is required");
		// 	return;
		// }
		// if($("#expiryDate").val()==""){
		// 	$("#isExpiryDateValid").text("Expiry date is required");
		// 	return;
		// }
		
		const confirm = await Swal.fire({
			title: 'Are you sure save record?',
			text: "You can't update this record!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Save it!'
		  });
		
		if (confirm.value) {
		var formData: any = new FormData();
    
		formData.append("file", this.selectedFiles.item(0));
		formData.append("hardwareVersion", (<HTMLInputElement>document.getElementById("hardwareVersion")).value);
    	formData.append("firmwareVersion", (<HTMLInputElement>document.getElementById("firmwareVersion")).value);
		formData.append("otaUrl", (<HTMLInputElement>document.getElementById("otaUrl")).value);
    	formData.append("processOta", processOta);
		
		// const save: any = await this.request.post('/hrms/add_employee', formData);

		let headers = new HttpHeaders();
		//this is the important step. You need to set content type as null
		headers.set('Content-Type', null);
		headers.set('Accept', "multipart/form-data");
		let params = new HttpParams();
		const save : any = await this.http.post(environment.apiBaseUrl + '/dispatch/add_eld_ota', formData, { params, headers }).subscribe((res) => {
			console.log(res);
			let status,message;
			for (let objKey of Object.keys(res)) {
				let dataObj = res[objKey];
				if(objKey=="status"){
					status = dataObj;
				}
				if(objKey=="message"){
					message = dataObj;
				}
			}
		
			//if(objKey=="status"){
				// console.log(" >> "+res[objKey]);
				// this.isSaved = res[objKey];
				if (status=="SUCCESS") {
					// alert("Save Successfully");
					const result = Swal.fire({
						title: 'Successfully Save',
						text: 'Saved Changes.',
						type: 'success',
						showConfirmButton: false,  
						  timer: 1500
						// confirmButtonText: 'Ok'
					});
					if (result.value) {
						// Reload DataTable
						 window.location.reload();
						// this.router.navigate(['/form/view-employee']);
            //this.ResetForm();
					}
					 window.location.reload();
					// this.router.navigate(['/form/view-employee']);
       
         // this.ResetForm();
				}else{
					const result = Swal.fire({
						title: "Oops ?",
						text: message,   
						type: "warning",   
						showCancelButton: false,      
						confirmButtonColor: "#FF0000",   
						confirmButtonText: "Close",   
						closeOnConfirm: false,   
						closeOnCancel: false,
						customClass: "Custom_Cancel"

					});
				}
			//}
		},
		(error) => {
			// this.isLoading = false;
			this.isError = true;
			if (error) {
			  this.errorMessage = error.status == 401? 'Unauthorized Error' : error.message;
			} else {
			  this.errorMessage = 'Server Not Response';
			}
		});
    	//console.log(":: "+this.isSaved);
	}
	}



}
