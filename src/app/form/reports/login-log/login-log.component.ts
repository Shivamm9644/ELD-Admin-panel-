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
  selector: 'app-login-log',
  templateUrl: './login-log.component.html',
  styleUrls: ['./login-log.component.scss']
})
export class LoginLogComponent implements OnInit {

  isEditMode: boolean=false;
    @ViewChild(DataTableDirective, {static: false})
    dtElement: DataTableDirective;
    dtOptions: any = {};
    // dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    searchText: String;
  
    llForm:any={};
  
    constructor(
      private request : RequestService,
      private master : MasterService,
      private http : HttpClient,
      private router : Router,
      private datePipe : DatePipe
    ) { }
  
    ngOnInit() {
      this.getAllUsers();
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
            title: 'Login Log' 
          },
          {
            extend: 'excel',
            className: 'btn btn-danger',
            // text:      '<i class="fa fa-file-excel-o"></i>',
            text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
            titleAttr: 'Download as Excel',
            title: 'Login Log' 
          },
        {
            extend: 'pdf',
            className: 'btn btn-danger',
            // text:      '<i class="fa fa-file-pdf-o"></i>',
            text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
            titleAttr: 'Download as Pdf',
            title: 'Login Log' 
        },
        ]
      };
    }
  
    userDataObj=[];
    userDataArr;
    async getAllUsers(){
      try {
        const users = {
          'userId': 0,
        };
        const userData: any = await this.request.post('/master/view_user/',users);
        this.userDataObj=[];	
        for (let objKey of Object.keys(userData)) {
          let dataObj = userData[objKey];
          if(objKey=="result"){
            for (let objKey1 of Object.keys(dataObj)) {
              // this.designationDataObj.push(dataObj[objKey1]);
              let arr = {
                id:dataObj[objKey1].userId,
                userName:dataObj[objKey1].firstName +" "+dataObj[objKey1].lastName,
              };
              this.userDataObj.push(arr);
            }
          }
        }
        this.userDataArr = this.userDataObj;
      } catch (error) {}
    }
  
    loginLogDetails=[];
    rowData;
    actionAssign;
    isSuperAdmin:boolean=false;
    isLoading : boolean=false;
    isDeleteAction: boolean=false;
    isEditAction: boolean=false;
    async LoginLogReport(){
      try {
        this.isLoading = true;
        let from = this.datePipe.transform($("#fromDate").val(), 'yyyy-MM-dd');
        let to = this.datePipe.transform($("#toDate").val(), 'yyyy-MM-dd');
        // console.log(this.llForm.userId);
        let userId=0;
        if(this.llForm.userId!=undefined){
          userId = Number(this.llForm.userId);
        }
        const llData= {
          'userId' : userId, // Number(this.llForm.userId),
          'fromDate' : this.datePipe.transform(new Date(from+" 00:00:00"), 'yyyy-MM-dd HH:mm:ss'),
          'toDate' : this.datePipe.transform(new Date(to+" 23:59:59"), 'yyyy-MM-dd HH:mm:ss'),
        };
        console.log(llData);
        const data: any = await this.request.post('/dispatch/login_log_for_web',llData);
        console.log(data);
        this.loginLogDetails=[];
        for (let objKey of Object.keys(data)) {
          let dataObj = data[objKey];
          if(objKey=="result"){
            for (let objKey1 of Object.keys(dataObj)) {
              this.loginLogDetails.push(dataObj[objKey1]);
            } 
          }				
        }
        this.rowData = this.loginLogDetails;
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
