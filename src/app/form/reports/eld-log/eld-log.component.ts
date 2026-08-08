import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
// import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
 import { DatePipe } from '@angular/common';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from 'src/services/request.service';
import { MasterService } from 'src/services/master.service';
import jsPDF from 'jspdf';
// import * as $ from 'jquery';
// import 'datatables.net';
import { from, Subject } from 'rxjs';
declare let $: any;


@Component({
  selector: 'app-eld-log',
  templateUrl: './eld-log.component.html',
  styleUrls: ['./eld-log.component.scss']
})
export class EldLogComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
   private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    // this.ViewEldLogReport();
    // this.ViewDevice();
    this.ViewVehiclesData();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 1000,
      paginate: false,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
          // text:  '<i class="fa fa-file-text-o"></i>',
          text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Eld Log Report' 
        },
        {
          extend: 'excel',
          // text:  '<i class="fa fa-file-excel-o"></i>',
          text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Eld Log Report' 
        },
    //     {
    //       extend: 'pdfHtml5',
    //       text:  '<i class="fa fa-file-pdf-o"></i>',
    //       titleAttr: 'Download as Pdf',
    //       title: 'Eld Log Report' ,
    //       orientation: 'landscape',
    //       pageSize: 'LEGAL',
    //       exportOptions: {columns: ':visible'}
		//  },
        
    //  'colvis'
      ]
    };
  }

  isError;
  errorMessage;
  refreshTime;
  eldLogDetails=[];
	rowData;
	actionAssign;
	isSuperAdmin:boolean=false;
	isLoading : boolean=false;
	isDeleteAction: boolean=false;
	isEditAction: boolean=false;
	async ViewEldLogReport(){
		try {
		this.isLoading = true;
		const eldlog = {
			'clientId':Number(localStorage.getItem("clientId")),
			};
			this.dtTrigger=new Subject<any>();
		const data: any = await this.request.post('/dispatch/view_eld_log_data',eldlog);
		this.eldLogDetails=[];
		//alert(data);
		this.dtTrigger.next();
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
			for (let objKey1 of Object.keys(dataObj)) {
				this.eldLogDetails.push(dataObj[objKey1]);
			} 
			}				
		}
		this.rowData = this.eldLogDetails;
		// console.log(this.eldLogDetails);
		this.isLoading = false;
    (error) => {
      this.isError = true;
      if (error) {
        this.errorMessage = error.status == 401? 'Unauthorized Error' : error.message;
      } else {
        this.errorMessage = 'Server Not Response';
      }
      };

    } catch (error) {}
    let isChecked = $('#refreshBtn').is(':checked');
    if(isChecked){
      // alert("here");
      this.refreshTime = this.datePipe.transform(new Date(), 'HH:mm:ss');
       // alert("here");
      await new Promise(resolve => setTimeout(() => resolve(this.ViewEldLogReport()), 5000));
    }else{
      this.refreshTime = this.datePipe.transform(new Date(), 'HH:mm:ss');
    }
  }

  deviceDetails=[];
  async ViewDevice(){
    try {
      this.isLoading = true;
      const device = {
        'deviceId': 0,
        'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_device',device);
      this.deviceDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.deviceDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.deviceDetails;
      
      this.isLoading = false;
    } catch (error) {}
  }

  async ViewVehiclesData(){
    try {
      this.isLoading = true;
      const device = {
        'vehicleId': 0,
        'clientId':Number(localStorage.getItem("clientId")),
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_vehicle',device);
      this.deviceDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.deviceDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.deviceDetails;
      
      this.isLoading = false;
    } catch (error) {}
  }

  RefreshData(){
    //  alert("here");
    let isChecked = $('#refreshBtn').is(':checked');
    if(isChecked){
      this.ViewEldLogReport();
    }else{
    }
  }

}
