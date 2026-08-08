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
import { Injectable } from '@angular/core';
import { ChartDataSets, ChartElementsOptions, ChartLineOptions } from 'chart.js';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import html2canvas from 'html2canvas';
declare let $: any;
searchText: String;

@Component({
  selector: 'app-defects',
  templateUrl: './defects-details.component.html',
  styleUrls: ['./defects-details.component.scss']
})
export class DefectsDetailsComponent implements OnInit {

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private datePipe : DatePipe
  ) { }
  

  driverId=0;
  dateTime="";
  timestamp="";
  ngOnInit(): void {
    this.driverId=this.activatedRoute.snapshot.params.driverId;
    this.dateTime=this.activatedRoute.snapshot.params.datetime;
    this.timestamp=this.activatedRoute.snapshot.params.timestamp;

    //alert(" >> "+this.dateTime+" >> "+this.driverId);
    // this.ShowUserWiseDefectDetailReport(this.driverId,this.dateTime);
    this.ShowUserWiseDefectDetailReport(this.timestamp);

  }

  async DeleteDvir(){
    // console.log(this.driverId+" :: "+this.timestamp);
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
      const dlog= {
        'driverId' : this.driverId,
        'timestamp' : this.timestamp,
      };
      // console.log(dlog);
      const allow: any = await this.request.post('/dispatch/delete_dvir/',dlog);
      if (allow) {
        // Successfully Deleted
        Swal.fire(
        'Deleted!',
        'DVIR has been deleted.',
        'success'
        );
        // Reload DataTable
        this.router.navigate(['/form/dvir/']);
      } else {
        Swal.fire(
        'Error!'
        );
      }
    }
  }
  
  ShowEmployeeDetailsBackOnWorkingDetail(driverId){
    // alert(">> "+driverId);
    this.router.navigate(['/form/working-detail/'+driverId]);
  }

  PrintPage(PrintWholePage) {
    //$("thead").css({"color":"#FFFFF", "print-color-adjust":"exact"});
    let printContents = document.getElementById(PrintWholePage,).innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    document.title="dvir";
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
}


  fromDate;
  toDate;
  LDATE_TIME;
  vehicleCondition;
  timezoneName="";
  dvirData;
  // async ShowUserWiseDefectDetailReport(driverId,dateTime){
    async ShowUserWiseDefectDetailReport(timestamp){
    try {
     // let cDate = this.datePipe.transform(dateTime, 'yyyy-MM-dd');
      // console.log(cDate);
      //  this.fromDate = this.datePipe.transform(cDate+" 00:00:00", 'yyyy-MM-dd HH:mm:ss');
      //  this.toDate = this.datePipe.transform(cDate+" 23:59:59", 'yyyy-MM-dd HH:mm:ss');
       //alert(this.fromDate+" :: "+this.toDate);
      const dvir= {
        // 'driverId' : driverId,
        // 'fromDate' : this.fromDate,
        // 'toDate' : this.toDate,
        // 'email': "" 
        'timestamp': timestamp,
			};
     // console.log(dvir);
    const data: any = await this.request.post('/dispatch/view_dvir_data_by_timestamp',dvir);
    //console.log(data);
    for (let objKey of Object.keys(data)) {
            let dataObj = data[objKey];
            if(objKey=="result"){
              for (let objKey1 of Object.keys(dataObj)) {
                //console.log(dataObj[objKey1]);
                this.LDATE_TIME=(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd HH:mm:ss'));
                this.vehicleCondition=dataObj[objKey1].vehicleCondition;
                this.timezoneName = dataObj[objKey1].timezoneName;

                $("#ViewDriverName").text(dataObj[objKey1].driverName);
                $("#viewDriverNameTbl").text(dataObj[objKey1].driverName);
                $("#ViewVehicle").text(dataObj[objKey1].vehicleNo);
                $("#ViewLocation").text(dataObj[objKey1].location);
                $("#ViewDvirLocation").text(dataObj[objKey1].location);
                $("#ViewVehicleName").text(dataObj[objKey1].vehicleNo);
                $("#ViewVehicleVin").text(dataObj[objKey1].vin);
                $("#viewTrailerNo").text(dataObj[objKey1].trailer);
                $("#ViewVehicleDefect").text(dataObj[objKey1].truckDefect);
                $("#companyName").text(dataObj[objKey1].companyName);
                $("#ViewTrailerDefect").text(dataObj[objKey1].trailerDefect);
                $("#ViewRemarks").text(dataObj[objKey1].notes);
                $("#ViewVehicleCondition").text(dataObj[objKey1].vehicleCondition);
                $("#ViewOdometer").text(dataObj[objKey1].odometer);
                $("#ViewEngineHour").text(dataObj[objKey1].engineHour);
                $("#ViewDriverSign").attr("src",dataObj[objKey1].driverSignFile);
                this.dvirData = dataObj[objKey1];
              }
            }
          }
      } catch (error) {}
    }

    selectedImage: string = '';
    viewImage(imageUrl: string) {
      this.selectedImage = imageUrl;
      ($('#imageModal') as any).modal('show'); // Bootstrap modal open
    }
}
