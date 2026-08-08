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
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  productForm:any={}

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
    this.ViewProduct();
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
          title: 'Product Report' 
        },
        {
          extend: 'excel',
          text:      '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: 'Product Report' 
        },
        {
          extend: 'pdf',
          text: '<i class="fa fa-file-pdf-o"></i>',
          titleAttr: 'Download as Pdf',
          title: 'Product Report' 
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
		productviewDetails;
		async EditProduct(productId){
			try {
			this.isEditMode=true;
			const product = {
				'productId': productId,
        'clientId':Number(localStorage.getItem("clientId")),
			};
			const data: any = await this.request.post('/master/view_product/',product);
			for (let objKey of Object.keys(data)) {
				let dataObj = data[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
          this.productviewDetails = dataObj[objKey1];
					} 
				}				
			}
     		this.productForm = this.productviewDetails;
			} catch (error) {}
  }

  productDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewProduct(){
    try {
      this.isLoading = true;
      const product = {
        'productId': 0,
        'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_product',product);
      this.productDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.productDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.productDetails;
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

  async UpdateProduct(){	
    // this.isEditMode=false;
    // this.isViewMode=false;
    try{
    const product = {
      "productId":Number(this.productForm.productId),
      "productName":$("#productName").val(),
      "clientId":Number(this.productForm.clientId),
    };
    // console.log(product);
    const save: any = await this.request.post('/master/update_product',product);
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
      this.ViewProduct();
      }
      window.location.reload();
      this.ViewProduct();
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
  async SaveProduct(){	
      this.isEditMode=false;
      this.isViewMode=false;
      try{
			const product = {
        "productName":$("#productName").val(),
        "clientId":Number(this.productForm.clientId),
			};
      // console.log(product);
			const save: any = await this.request.post('/master/add_product',product);
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
				this.ViewProduct();
			  }
			  window.location.reload();
			  this.ViewProduct();
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

    async DeleteProduct() {
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
        'productId': Number(this.productForm.productId)
        };
        const allow: any = await this.request.post('/master/delete_product/',device);
        if (allow) {
        // Successfully Deleted
        Swal.fire(
        'Deleted!',
        'Product Information has been deleted.',
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
