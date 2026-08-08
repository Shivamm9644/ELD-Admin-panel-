import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
// import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';
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
  selector: 'app-violation-report',
  templateUrl: './violation-report.component.html',
  styleUrls: ['./violation-report.component.scss']
})
export class ViolationReportComponent implements OnInit {

  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: any = {};
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;

  vForm:any={};

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }

  ngOnInit() {
    this.getAllDrivers();
    $("#fromDate").val(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    $("#toDate").val(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));

    this.dtOptions = {
      pagingType: 'full_numbers',
      // pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      
        buttons: [
        {
          extend: 'csv',
          className: 'btn btn-danger',
          // text:      '<i class="fa fa-file-text-o"></i>',
          text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Violation Report' 
        },
        {
          extend: 'excel',
          className: 'btn btn-danger',
          // text:      '<i class="fa fa-file-excel-o"></i>',
          text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Violation Report' 
        },
      {
          extend: 'pdf',
          className: 'btn btn-danger',
          // text:      '<i class="fa fa-file-pdf-o"></i>',
          text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Violation Report' 
      },
      ]
    };
  }

  driverDataObj=[];
	driverDataArr;
	async getAllDrivers(){
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

  voilationDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async VoilationReport(){
    try {
      this.isLoading = true;
      let from = this.datePipe.transform($("#fromDate").val(), 'yyyy-MM-dd');
      let to = this.datePipe.transform($("#toDate").val(), 'yyyy-MM-dd');
      let driverId=0;
      if(this.vForm.driverId!=undefined){
        driverId = this.vForm.driverId;
      }
      const voilationData= {
        'driverId' : driverId, // Number(this.vForm.driverId),
        'fromDate' : this.datePipe.transform(new Date(from+" 00:00:00"), 'yyyy-MM-dd HH:mm:ss'),
        'toDate' : this.datePipe.transform(new Date(to+" 23:59:59"), 'yyyy-MM-dd HH:mm:ss'),
      };
      const data: any = await this.request.post('/dispatch/view_voilation_report',voilationData);
      console.log(data);
      this.voilationDetails=[];
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.voilationDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.voilationDetails;
      this.isLoading = false;
      this.rerender();
    } catch (error) {}
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
