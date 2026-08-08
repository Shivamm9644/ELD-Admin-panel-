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
  selector: 'app-ifta-summary-report',
  templateUrl: './ifta-summary-report.component.html',
  styleUrls: ['./ifta-summary-report.component.scss']
})
export class IftaSummaryReportComponent implements OnInit {

  isEditMode: boolean=false;
    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;
    dtOptions: any = {};
    // dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    searchText: String;
  
    iftaSummaryForm:any={};
  
    constructor(
      private request : RequestService,
      private master : MasterService,
      private http : HttpClient,
      private router : Router,
      private datePipe : DatePipe
    ) { }
  
    ngOnInit() {
      this.getAllTruckNo();
      $("#fromDate").val(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm'));
      $("#toDate").val(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm'));

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
            title: 'IFTA Summary Report' 
          },
          {
            extend: 'excel',
            className: 'btn btn-danger',
            // text:      '<i class="fa fa-file-excel-o"></i>',
            text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
            titleAttr: 'Download as Excel',
            title: 'IFTA Summary Report' 
          },
        {
            extend: 'pdf',
            className: 'btn btn-danger',
            // text:      '<i class="fa fa-file-pdf-o"></i>',
            text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
            titleAttr: 'Download as Pdf',
            title: 'IFTA Summary Report' 
        },
        ]
      };
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
  
    iftaSummaryDetails=[];
    rowData;
    actionAssign;
    isSuperAdmin:boolean=false;
    isLoading : boolean=false;
    isDeleteAction: boolean=false;
    isEditAction: boolean=false;
    async EftaSummaryReport(){
      try {
        this.isLoading = true;
        let from = this.datePipe.transform($("#fromDate").val(), 'yyyy-MM-dd HH:mm:ss');
        let to = this.datePipe.transform($("#toDate").val(), 'yyyy-MM-dd HH:mm:ss');
  
          const eldData= {
            'vehicleId' : Number(this.iftaSummaryForm.vehicleId),
            // 'fromDate' : this.datePipe.transform(new Date(from+" 00:00:00"), 'yyyy-MM-dd HH:mm:ss'),
            // 'toDate' : this.datePipe.transform(new Date(to+" 23:59:59"), 'yyyy-MM-dd HH:mm:ss'),
            'fromDate' : from,
            'toDate' : to,
        };
        const data: any = await this.request.post('/dispatch/view_ifta_summary_report',eldData);
        this.iftaSummaryDetails=[];
        for (let objKey of Object.keys(data)) {
          let dataObj = data[objKey];
          if(objKey=="result"){
            for (let objKey1 of Object.keys(dataObj)) {
              this.iftaSummaryDetails.push(dataObj[objKey1]);
            } 
          }				
        }
        this.rowData = this.iftaSummaryDetails;
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
