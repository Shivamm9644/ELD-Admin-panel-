import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
// import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from 'src/services/request.service';
import { MasterService } from 'src/services/master.service';
import  { FormBuilder } from '@angular/forms'
// import * as $ from 'jquery';
// import 'datatables.net';
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { from, Subject } from 'rxjs';
import { get } from 'jquery';
import { globalDLDriverId,globalDLFromDates,globalDLToDates } from '../../reports/driver-logs/driver-logs.component';

declare let $: any;
searchText: String;

export var globalDriverId: number = 0;
export var globalDriverName: any ="";
export var globalFromDates: any = "";
export var globalToDates: any = "";

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit {

  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;
  simulatorForm:any={}

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
   private datePipe : DatePipe,
   //public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    globalDriverId = 0;
    globalDriverName= "";
    globalFromDates = "";
    globalToDates = "";

    this.isEditMode=false;
    this.isViewMode=false;
    this.DateShow();
    this.getAllDriverName();
    this.getAllClient();

     //console.log(" >> "+globalDLDriverId+" :: "+globalDLFromDates+" :: "+globalDLToDates);
    if(Number(globalDLDriverId)>0){
      $("#smFromDate").val(this.datePipe.transform(globalDLFromDates, 'yyyy-MM-dd'));
      $("#smToDate").val(this.datePipe.transform(globalDLToDates, 'yyyy-MM-dd'));
      this.simulatorForm.employeeId = Number(globalDLDriverId);
    }
    this.ShowSimulatorReport('');

    // console.log(new Date().toISOString());

    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   // pageLength: 10,
    //   processing: true,
    //   dom: 'Bfrtip',
      
    //     buttons: [
         
    //     {
    //       extend: 'csv',
    //       className: 'btn btn-danger',
    //       text:      '<i class="fa fa-file-text-o"></i>',
    //       titleAttr: 'Download as CSV',
    //       title: 'Simulator Report' 
    //     },
    //     {
    //       extend: 'excel',
    //       className: 'btn btn-danger',
    //       text:      '<i class="fa fa-file-excel-o"></i>',
    //       titleAttr: 'Download as Excel',
    //       title: 'Simulator Report' 
    //     },
	  //   {
    //       extend: 'pdf',
    //       className: 'btn btn-danger',
    //       text:      '<i class="fa fa-file-pdf-o"></i>',
    //       titleAttr: 'Download as Pdf',
    //       title: 'Simulator Report' 
		//  },
    //   ]
    // //   buttons: [
    // //      'csv', 'excel', 'pdf'
    // // ]
    // };

  }

  ClearFields(){
	//this.simulatorForm.employeeId = '';
	$("#simulatorStatus").val("");
  $("#dateTime").val("");
}

  // currentDate;
  // currentDateTime;
  // async DateShow(){
  //   // const dt = new Date();
  //   // dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
	//   // $('#bvFromDate').val(dt.toISOString().slice(0, 16));
  //   this.currentDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  //   this.currentDateTime=this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
  //   $('#fromDate').val(this.currentDate+" 00:00");
  //   $('#toDate').val(this.currentDateTime);
  // }

  currentDate;
  async DateShow(){
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    $('#smFromDate').val(this.currentDate);
    $('#smToDate').val(this.currentDate);
  };

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
						};
						this.driverDataObj.push(arr);
					}
				}
			}
			this.driverDataArr = this.driverDataObj;
		} catch (error) {}
	}
  
  isViewMode;
	splitFromDate;
  fromDate;
  toDate;
  splitToDate;
  simulatorDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  EMPLOYEE_NAME="";
  async ShowSimulatorReport(employeeName){
    try {
      if(employeeName!=""){
        this.EMPLOYEE_NAME = employeeName;
      }
      // this.isLoading = true;
      // this.splitFromDate = $("#fromDate").val();
      // let fDate = this.splitFromDate.split("T");
      // this.fromDate = fDate[0]+" "+fDate[1]+":00";

      // this.splitToDate = $("#toDate").val();
      // let tDate = this.splitToDate.split("T");
      // this.toDate = tDate[0]+" "+tDate[1]+":00";
      //alert(this.fromDate+" :: "+this.toDate);

      let sFromDate = $('#smFromDate').val()+" 00:00:00";
      let sToDate =   $('#smToDate').val()+ " 23:59:59";

      const simulator= {
        'driverId' : this.simulatorForm.employeeId,
        'clientId':Number(localStorage.getItem("clientId")),
        'fromDate' : this.datePipe.transform(sFromDate, 'yyyy-MM-dd HH:mm:ss'),
        'toDate' : this.datePipe.transform(sToDate, 'yyyy-MM-dd HH:mm:ss'),
        // 'fromDate' : this.fromDate,
        // 'toDate' : this.toDate,
			};
     // console.log(simulator);
       // this.dtTrigger=new Subject<any>();
        const data: any = await this.request.post('/master/view_simulator/',simulator);
        this.simulatorDetails=[];
      //alert(data);
      //this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.EMPLOYEE_NAME = dataObj[objKey1].title[0]+" "+dataObj[objKey1].firstName[0]+" "+dataObj[objKey1].lastName[0];
            this.simulatorDetails.push(dataObj[objKey1]);
          } 
        }	
      }
      this.rowData = this.simulatorDetails;
      this.rerender();
      this.ExportFile();			
      // if(this.isSuperAdmin==false){
      //   if(this.actionAssign.get("delete")=="delete"){
      //     this.isDeleteAction = true;
      //   }
      //   if(this.actionAssign.get("update")=="update"){
      //   this.isEditAction = true;
      //   }
      // }
       //console.log(this.simulatorDetails);
      this.isLoading = false;
    } catch (error) {}
  }

  ExportFile(){
    // alert(this.EMPLOYEE_NAME);
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
          title: this.EMPLOYEE_NAME+' Simulator Report',
        },
        {
          extend: 'excel',
          text:      '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: this.EMPLOYEE_NAME+' Simulator Report',
          // filename: function(){
          //   var d = new Date();
          //   var n = d.getTime();
          //   return $("#reportTypeName").text()+' Simulator Report';
          // },
        },
        {
          extend: 'pdf',
          text:  '<i class="fa fa-file-pdf-o"></i>',
          titleAttr: 'Download as Pdf',
          title: this.EMPLOYEE_NAME+' Simulator Report',
        },
      ]
    };
  }
  
  viewBySimulatorOnDL(driverId,firstName){
    globalDriverId = driverId;
    globalDriverName = firstName;
    globalFromDates = $('#smFromDate').val();
    globalToDates = $('#smToDate').val();
     //console.log(" >> "+globalDriverId+" :: "+globalFromDates+" :: "+globalToDates);
    this.router.navigate(['/form/driver-logs']);
  }

  dateTime;
  isUpdatedRecord;
  message;
  simulatorDate;
  async SaveSimulator(){	
    this.isEditMode=false;
    this.isViewMode=false;
    try{
    let dateTime = this.simulatorForm.dateTime.split("T");
    let sDate = dateTime[0]+" "+dateTime[1]+":00";
    this.simulatorDate = new Date(sDate).toUTCString();
    
    // console.log(this.simulatorDate);
    // console.log(this.datePipe.transform(this.simulatorDate, 'yyyy-MM-dd HH:mm:ss'));
    const simulator = {
      "driverId":Number(this.simulatorForm.employeeId),
      "status": this.simulatorForm.simulatorStatus,
      //"dateTime":dateTime[0]+" "+dateTime[1]+":00",
      "dateTime": this.simulatorDate,
      "clientId":Number(localStorage.getItem("clientId")),
    };
    //console.log(simulator);
    const save: any = await this.request.post('/master/add_simulator',simulator);
    //console.log(save);
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
      this.ShowSimulatorReport('');
      }
      // window.location.reload();
      this.ShowSimulatorReport('');
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

  async DeleteSimulator(_id){
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
      const simulator = {
        '_id': _id
      };
      const allow: any = await this.request.post('/master/delete_simulator/',simulator);
      if (allow) { 
        // Successfully Deleted
        Swal.fire(
          'Deleted!',
          'Simulator Information has been deleted.',
          'success'
        );
        // Reload DataTable
       // window.location.reload();
       this.ShowSimulatorReport('');
      } else {
        Swal.fire(
          'Error!'
        );
      }
    }
  }

    ngAfterViewInit(): void {
      this.dtTrigger.next();
    }
    
      ngOnDestroy(): void {
      // Do not forget to unsubscribe the event
      this.dtTrigger.unsubscribe();
      }
    
      rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }

}
