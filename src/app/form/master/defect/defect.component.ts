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
searchText: String;
import jsPDF from 'jspdf';


@Component({
  selector: 'app-defect',
  templateUrl: './defect.component.html',
  styleUrls: ['./defect.component.scss']
})
export class DefectComponent implements OnInit {
  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  defectForm:any={}
  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    // private datePipe : DatePipe
  ) { }

  ClearForm(){
    this.defectForm={};
  }

  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
    this.ViewDefect();
    this.getAllClient();
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      paginate: false,
      processing: true,
        dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
          // text:  '<i class="fa fa-file-text-o"></i>',
          text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Defect Report' 
        },
        {
          extend: 'excel',
          // text:  '<i class="fa fa-file-excel-o"></i>',
          text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Defect Report' 
        },
        {
          extend: 'pdf',
          // text: '<i class="fa fa-file-pdf-o"></i>',
          text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Defect Report' 
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
  defectViewDetails;
		async EditDefect(defectId){
			try {
			this.isEditMode=true;
			const defect = {
				'defectId': defectId,
        'clientId':Number(localStorage.getItem("clientId")),
			};
			const data: any = await this.request.post('/master/view_defect/',defect);
			for (let objKey of Object.keys(data)) {
				let dataObj = data[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
            		this.defectViewDetails = dataObj[objKey1];
					} 
				}				
			}
     		 this.defectForm = this.defectViewDetails;
			} catch (error) {}
  		}

  defectDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewDefect(){
    try {
      this.isLoading = true;
      const defect = {
				'defectId': 0,
        'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
        const data: any = await this.request.post('/master/view_defect/',defect);
        this.defectDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.defectDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.defectDetails;
      // this.rerender();
      this.isLoading = false;
    } catch (error) {}
  }

  isUpdatedRecord;
  message;
  async SaveDefect(){	
      this.isEditMode=false;
    	this.isViewMode=false;
      try{
			const defect = {
        "defectName":$("#defectName").val(),
        "defectType": this.defectForm.defectType,
        "clientId":Number(this.defectForm.clientId),
			};
      // console.log(defect);
			const save: any = await this.request.post('/master/add_defect',defect);
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
				//  window.location.reload();
				// this.ViewDefect();
			  }
			   window.location.reload();
			  this.ViewDefect();
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

    async UpdateDefect(){	
      this.isEditMode=false;
    	this.isViewMode=false;
      try{
			const defect = {
        "defectId":Number(this.defectForm.defectId),
        "defectName":$("#defectName").val(),
        "defectType": this.defectForm.defectType,
        "clientId":Number(this.defectForm.clientId),
			};
      // console.log(defect);
			const save: any = await this.request.post('/master/update_defect',defect);
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
				//  window.location.reload();
				// this.ViewDefect();
			  }
			   window.location.reload();
			  this.ViewDefect();
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

    async DeleteDefect() {
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
        const defect = {
        "defectId":Number(this.defectForm.defectId),
        };
        const allow: any = await this.request.post('/master/delete_defect/',defect);
        if (allow) {
        // Successfully Deleted
        Swal.fire(
        'Deleted!',
        'Defect Information has been deleted.',
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
