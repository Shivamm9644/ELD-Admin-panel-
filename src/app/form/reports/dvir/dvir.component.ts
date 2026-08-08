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
import autoTable from 'jspdf-autotable'
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { from, Subject } from 'rxjs';
import { get } from 'jquery';
declare let $: any;
searchText: String;

@Component({
  selector: 'app-dvir',
  templateUrl: './dvir.component.html',
  styleUrls: ['./dvir.component.scss']
})
export class DvirComponent implements OnInit {

  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;
  dvirForm:any={}

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
    this.DateShow();
    this.getAllDriverName();
    this.getAllVehicleCondition();
    this.getAllTruckNo();
    // this.getAllClient();
    this.ShowDvirLogReport('');

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
    //       title: 'DVIR Log Report' 
    //     },
    //     {
    //       extend: 'excel',
    //       className: 'btn btn-danger',
    //       text:      '<i class="fa fa-file-excel-o"></i>',
    //       titleAttr: 'Download as Excel',
    //       title: 'DVIR Log Report' 
    //     },
	  //   {
    //       extend: 'pdf',
    //       className: 'btn btn-danger',
    //       text:      '<i class="fa fa-file-pdf-o"></i>',
    //       titleAttr: 'Download as Pdf',
    //       title: 'DVIR Log Report' 
		//  },
    //   ]
    // };
  }

  ShowDefectDetail(driverId,dateTime,timestamp){
    //alert(">> "+driverId+">> "+dateTime);
   this.router.navigate(['/form/defects-details/'+driverId+"/"+dateTime+"/"+timestamp]);
 }

  RefreshPage(){
    window.location.reload();
  }

  currentDate;
  currentDateTime;
  async DateShow(){
    this.currentDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.currentDateTime=this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
    // $('#fromDate').val(this.currentDate+" 00:00");
    // $('#toDate').val(this.currentDateTime);
    $('#fromDate').val(this.currentDate);
    $('#toDate').val(this.currentDate);
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

  // clientDataObj=[];
	// clientDataArr;
	//   async getAllClient(){
	//   try {
	// 	  const client = {
	// 		  'clientId': 0
	// 	  };
	// 	  const clientData: any = await this.request.post('/master/view_client/',client);
	// 	  this.clientDataObj=[];	
	// 	  for (let objKey of Object.keys(clientData)) {
	// 		  let dataObj = clientData[objKey];
	// 		  if(objKey=="result"){
	// 			  for (let objKey1 of Object.keys(dataObj)) {
	// 				  // this.designationDataObj.push(dataObj[objKey1]);
	// 				  let arr = {
	// 					  id:dataObj[objKey1].clientId,
	// 					  clientName:dataObj[objKey1].clientName,
	// 				  };
	// 				  this.clientDataObj.push(arr);
	// 			  }
	// 		  }
	// 	  }
	// 	  this.clientDataArr = this.clientDataObj;
	//   } catch (error) {}
  // }

  driverDataObj=[];
	driverDataArr;
	async getAllDriverName(){
		try {
			const employee = {
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const employeeData: any = await this.request.post('/master/view_employee_first_login/',employee);
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

  vcDataObj=[];
	vcDataArr;
  filtered;
	async getAllVehicleCondition(){
		try {
			const vc = {
				'clientId':Number(localStorage.getItem("clientId")),
        'vehicleConditionId':0
			};
			const employeeData: any = await this.request.post('/master/view_vehicle_condition/',vc);
			this.vcDataObj=[];	
			for (let objKey of Object.keys(employeeData)) {
				let dataObj = employeeData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].vehicleConditionId,
							vehicleConditionName:dataObj[objKey1].vehicleConditionName,
						};
						this.vcDataObj.push(arr);
					}
				}
			}
			this.vcDataArr = this.vcDataObj;
		} catch (error) {}
	}

  FilterDVIRData(vehicleConditionName){
    console.log(vehicleConditionName);
    console.log(this.vcDataArr);
    this.filtered = this.rowData.filter(item => item.vehicleCondition === vehicleConditionName);
    console.log(this.filtered);
  }

  isViewMode;
	splitFromDate;
  fromDate;
  toDate;
  splitToDate;
  dvirDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  EMPLOYEE_NAME="";
  async ShowDvirLogReport(employeeName){
    try {
      if(employeeName!=""){
        this.EMPLOYEE_NAME = employeeName;
      }
      this.isLoading = true;
      // this.splitFromDate = $("#fromDate").val();
      // let fDate = this.splitFromDate.split("T");
      // this.fromDate = fDate[0]+" "+fDate[1]+":00";

      // this.splitToDate = $("#toDate").val();
      // let tDate = this.splitToDate.split("T");
      // this.toDate = tDate[0]+" "+tDate[1]+":00";

      this.splitFromDate = this.datePipe.transform($("#fromDate").val(), 'yyyy-MM-dd');
      this.fromDate = this.splitFromDate+" 00:00:00";

      this.splitToDate = this.datePipe.transform($("#toDate").val(), 'yyyy-MM-dd');
      this.toDate = this.splitToDate+" 23:59:59"
      //alert(this.fromDate+" :: "+this.toDate);
      const dvir= {
        'driverId' : this.dvirForm.employeeId,
        'fromDate' : this.fromDate,
        'toDate' : this.toDate,
        'clientId' : Number(localStorage.getItem("clientId")),
        'email': "" 
			};
      //console.log(dvir);
       // this.dtTrigger=new Subject<any>();
        const data: any = await this.request.post('/dispatch/view_dvir_data/',dvir);
        this.dvirDetails=[];
      //this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.dvirDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.dvirDetails;
      this.filtered = this.rowData;
      this.rerender();
      this.ExportFile();
      //console.log(this.simulatorDetails);
      this.isLoading = false;
    } catch (error) {}
  }

  async DownloadDVIRReport(){
    try {
      
      this.isLoading = true;
      
      this.splitFromDate = this.datePipe.transform($("#downloadLogStartDate").val(), 'yyyy-MM-dd');
      this.fromDate = this.splitFromDate+" 00:00:00";

      this.splitToDate = this.datePipe.transform($("#downloadLogEndDate").val(), 'yyyy-MM-dd');
      this.toDate = this.splitToDate+" 23:59:59"
      //alert(this.fromDate+" :: "+this.toDate);
      const dvir= {
        'driverId' : this.dvirForm.newLogEmployeeId,
        'fromDate' : this.fromDate,
        'toDate' : this.toDate,
        'clientId' : Number(localStorage.getItem("clientId")),
			};
      // console.log(dvir);
      const data: any = await this.request.post('/dispatch/download_dvir_report/',dvir);
      // console.log(data.result);
      this.DownloadDVIRGeneratedReport(data.result);
      this.isLoading = false;
    } catch (error) {}
  }

  downloadFile(sUrl: string) {
    return this.http.get(sUrl, { responseType: 'blob' });
  }

  DownloadDVIRGeneratedReport(sUrl){
    this.downloadFile(sUrl).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "DVIR_Report.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    });
    
  }

  ExportFile(){
    // alert(this.EMPLOYEE_NAME);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 1000,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
          className: 'btn btn-danger',
          text:      '<i class="fa fa-file-text-o"></i>',
          titleAttr: 'Download as CSV',
          title: this.EMPLOYEE_NAME+' Dvir Report',
        },
        {
          extend: 'excel',
          text:      '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: this.EMPLOYEE_NAME+' Dvir Report',
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
          title: this.EMPLOYEE_NAME+' Dvir Report',
        },
      ]
    };
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
