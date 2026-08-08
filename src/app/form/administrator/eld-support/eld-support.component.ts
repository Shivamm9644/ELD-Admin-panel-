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
  selector: 'app-eld-support',
  templateUrl: './eld-support.component.html',
  styleUrls: ['./eld-support.component.scss']
})
export class EldSupportComponent implements OnInit {

  isEditMode: boolean=false;
  supportForm: any = {}
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
   // this.isViewMode=false;
     this.viewDate();
     this.getAllDrivers();
     this.ViewELDSupport();
    
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
          title: 'Support Report' 
        },
        {
          extend: 'excel',
          // text:      '<i class="fa fa-file-excel-o"></i>',
          text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Support Report' 
        },
        {
          extend: 'pdf',
          // text: '<i class="fa fa-file-pdf-o"></i>',
          text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Support Report' 
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
  
  currentDate;
  viewDate(){
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    $('#fromDate').val(this.currentDate);
    $('#toDate').val(this.currentDate);
  };
  
  supportDetails=[];
  rowData;
  isLoading : boolean=false;
  async ViewELDSupport(){
    try {
      let driverId=0;
      if(this.supportForm.driverId!=undefined){
        driverId = this.supportForm.driverId;
      }
      let sFromDate = $('#fromDate').val()+" 00:00:00";
      let sToDate =   $('#toDate').val()+ " 23:59:59";
      const loginReport= {
        'fromDate' : this.datePipe.transform(sFromDate, 'yyyy-MM-dd HH:mm:ss'),
        'toDate' : this.datePipe.transform(sToDate, 'yyyy-MM-dd HH:mm:ss'),
        'driverId': driverId
      };
      this.isLoading=true;
      const data: any = await this.request.post('/dispatch/view_eld_support_by_date/',loginReport);
      this.supportDetails=[];
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
              this.supportDetails.push(dataObj[objKey1]);  
          } 
        }				
      }
      this.rowData = this.supportDetails;
      this.rerender(); 
      this.isLoading=false;
    } catch (error) {}
  }

  ShowELDSupport(otaLog){

  }

  UpdateELDSupport(){
    
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
