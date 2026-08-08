import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
// import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import { DatePipe } from '@angular/common';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from 'src/services/request.service';
import { MasterService } from 'src/services/master.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import  { FormBuilder } from '@angular/forms'
// import * as $ from 'jquery';
// import 'datatables.net';
import { from, Subject } from 'rxjs';
import { get } from 'jquery';
declare let $: any;
import jsPDF from 'jspdf';


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
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
    // private datePipe : DatePipe
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
    this.ViewCountry();
    this.getAllClient();
    // this.EditCountry(country);
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
          className: 'btn btn-danger',
          // text:      '<i class="fa fa-file-text-o"></i>',
          text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Country Report' 
        },
        {
          extend: 'excel',
          // text:      '<i class="fa fa-file-excel-o"></i>',
          text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Country Report' 
        },
        {
          extend: 'pdf',
          // text: '<i class="fa fa-file-pdf-o"></i>',
          text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Country Report' 
        },
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
  countryviewDetails;
  async EditCountry(countryId){
    try {
			this.isEditMode=true;
			const country = {
				'countryId': countryId,
        'clientId':Number(localStorage.getItem("clientId")),
			};
			const data: any = await this.request.post('/master/view_country/',country);
			for (let objKey of Object.keys(data)) {
				let dataObj = data[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
            		this.countryviewDetails = dataObj[objKey1];
					} 
				}				
			}
      this.countryForm = this.countryviewDetails;
		} catch (error) {}
  }

  countryDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewCountry(){
    try {
      this.isLoading = true;
      const country = {
        'countryId': 0,
        'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_country',country);
      this.countryDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.countryDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.countryDetails;
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

  async UpdateCountry(){	
    // this.isEditMode=false;
    // this.isViewMode=false;
    try {
			const country = {
        "countryId":Number(this.countryForm.countryId),
				"countryCode":$("#countryCode").val(),
        "countryName":$("#countryName").val(),
        "lattitude":$("#lattitude").val(),
        "longitude":$("#longitude").val(),
        "clientId":Number(this.countryForm.clientId),
			};
      //console.log(country);
			const save: any = await this.request.post('/master/update_country',country);
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
				this.ViewCountry();
			  }
			  window.location.reload();
			this.ViewCountry();
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
  async SaveCountry(){	
    this.isEditMode=false;
    this.isViewMode=false;
    try{
			const country = {
				"countryCode":$("#countryCode").val(),
        "countryName":$("#countryName").val(),
        "lattitude":$("#lattitude").val(),
        "longitude":$("#longitude").val(),
        "clientId":Number(this.countryForm.clientId),
			};
      //console.log(country);
			const save: any = await this.request.post('/master/add_country',country);
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
				this.ViewCountry();
			  }
			  window.location.reload();
			this.ViewCountry();
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

    ClearForm(){
      this.countryForm={};
    }
      

    async DeleteCountry() {
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
        const country = {
        'countryId': Number(this.countryForm.countryId)
        };
        const allow: any = await this.request.post('/master/delete_country/',country);
        if (allow) {
        // Successfully Deleted
        Swal.fire(
        'Deleted!',
        'Country Information has been deleted.',
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
  


