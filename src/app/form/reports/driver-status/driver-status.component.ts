import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
import * as chartsData from '../../../shared/data/chartjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from 'src/services/request.service';
import { MasterService } from 'src/services/master.service';
// import * as $ from 'jquery';
// import 'datatables.net';
import { from, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChartDataSets, ChartElementsOptions, ChartLineOptions } from 'chart.js';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as Highcharts from 'highcharts';

import HC_exporting from "highcharts/modules/exporting";
import HC_Data from "highcharts/modules/export-data";
import Accessbility from "highcharts/modules/accessibility";

HC_exporting(Highcharts);
HC_Data(Highcharts);
Accessbility(Highcharts);

declare let $: any;
import jsPDF from 'jspdf';


declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

@Component({
  selector: 'app-driver-status',
  templateUrl: './driver-status.component.html',
  styleUrls: ['./driver-status.component.scss']
})
export class DriverStatusComponent implements OnInit {
  @ViewChild("lineChart", { static: false }) lineChart: any;

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  //chartOptions: Highcharts.Options = { ... }; // required
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {  } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false
  
  highcharts = Highcharts;
   chartOptions = {   
      chart: {
        type: "line",
        zoomType: 'x'
      },
      title: {
        text: "Driver Working Status"
      },
      subtitle: {
         text: "Test"
      },
      xAxis: {
        // categories: ['1 Hr','2 Hr','3 Hr','4 Hr','5 Hr','6 Hr','7 Hr','8 Hr','9 Hr','10 Hr','11 Hr','12 Hr','13 Hr','14 Hr','15 Hr','16 Hr','17 Hr','18 Hr','19 Hr','20 Hr','21 Hr','22 Hr','23 Hr','24Hr'], 
       categories: ['1 Hr','1:30 Hr','2 Hr','2:30 Hr','3 Hr','3:30 Hr','4 Hr','4:30 Hr','5 Hr','5:30 Hr','6 Hr','6:30 Hr','7 Hr','7:30 Hr','8 Hr','8:30 Hr','9 Hr','9:30 Hr','10 Hr','10:30 Hr','11 Hr','11:30 Hr','12 Hr','12:30 Hr','13 Hr','13:30 Hr','14 Hr','14:30 Hr','15 Hr','15:30 Hr','16 Hr','16:30 Hr','17 Hr','17:30 Hr','18 Hr','18:30 Hr','19 Hr','19:30 Hr','20 Hr','20:30 Hr','21 Hr','21:30 Hr','22 Hr','22:30 Hr','23 Hr','23:30 Hr','24Hr'],
        //categories: ['0:15 Hr','0:30 Hr','0:45 Hr','1 Hr','1:15 Hr','1:30 Hr','1:45 Hr','2 Hr','2:15 Hr','2:30 Hr','2:45 Hr','3 Hr','3:15 Hr','3:30 Hr','3:45 Hr','4 Hr','4:15 Hr','4:30 Hr','4:45 Hr','5 Hr','5:15 Hr','5:30 Hr','5:45 Hr','6 Hr','6:15 Hr','6:30 Hr','6:45 Hr','7 Hr','7:15 Hr','7:30 Hr','7:45 Hr','8 Hr','8:15 Hr','8:30 Hr','8:45 Hr','9 Hr','9:15 Hr','9:30 Hr','9:45 Hr','10 Hr','10:15 Hr','10:30 Hr','10:45 Hr','11 Hr','11:15 Hr','11:30 Hr','11:45 Hr','12 Hr','12:15 Hr','12:30 Hr','12:45 Hr','13 Hr','13:15 Hr','13:30 Hr','13:45 Hr','14 Hr','14:15 Hr','14:30 Hr','14:45 Hr','15 Hr','15:15 Hr','15:30 Hr','15:45 Hr','16 Hr','16:15 Hr','16:30 Hr','16:45 Hr','17 Hr','17:15 Hr','17:30 Hr','17:45 Hr','18 Hr','18:15 Hr','18:30 Hr','18:45 Hr','19 Hr','19:15 Hr','19:30 Hr','19:45 Hr','20 Hr','20:15 Hr','20:30 Hr','20:45 Hr','21 Hr','21:15 Hr','21:30 Hr','21:45 Hr','22 Hr','22:15 Hr','22:30 Hr','22:45 Hr','23 Hr','23:15 Hr','23:30 Hr','23:45 Hr','24Hr'], //96 count
        title: {
          text: null,
        },
        //startOnTick: true,
        min: 0,
        //max: 53, // max pointer value in data set to show on x axis is (53-54)
        max:1439
      },
      yAxis: {
       categories: ["-","On Duty", "Drive", "Break", "Sleep", "Off Duty","Voilation"],
       // categories: ["-","On Duty", "On Drive", "OnBreak-Sleep", "OnBreak-Offduty", "OnBreak-Onduty","On Sleep","Off Duty"],
        min: 0,
        max: 6,
        title: false
      },
      tooltip: {
        // valueSuffix:" °C"
        enabled: true,
        // pointFormat: "Hello Data.."
        formatter: function() {
          // console.log(this);
          return "<b>Time : </b>"+this.x +"<br> <b>Status : </b>"+ this.series.yAxis.categories[this.y];
        }
      },
      series:[],
      exporting: {
        enabled: true,
        showTable: false,
        fileName: "line-chart",
        buttons: {
          contextButton: {
            menuItems: ["downloadSVG", "downloadPNG", "downloadPDF","downloadJPEG"]
          }
        }
      }
      // series: [
      //    {
      //       name: 'Driver Status',
      //       data: [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3],
      //       step: true,
      //       marker: {
      //         enabled: false
      //       },
      //       zones: [{
      //         value: 0,
      //         color: 'red'
      //       },
      //       {
      //         value: 1,
      //         color: 'blue'
      //       },
      //       {
      //         value: 2,
      //         color: 'gray'
      //       },
      //       {
      //         value: 3,
      //         color: 'black'
      //       }
      //     ]
      //    },
      // ]
   };

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

  CLIENT_ID=0;
  imageInBase64;
  refreshIntervals = [
    { label: 'Auto Refresh Off', value: 0 },
    { label: '1 min', value: 60000 },
    { label: '2 min', value: 120000 },
    { label: '5 min', value: 300000 }
  ];

  selectedRefreshInterval = 0;
  refreshTimer: any;

  onRefreshIntervalChange(event) {
  // Clear previous interval
  // alert(" >> "+interval);
  if (this.refreshTimer) {
    clearInterval(this.refreshTimer);
  }

  // If interval is not 'None', start new auto refresh
  if (event.value > 0) {
    this.refreshTimer = setInterval(() => {
      this.autoRefreshFunction();
    }, event.value);
  }
}

autoRefreshFunction() {
  // alert("here...");
  this.ShowDriverStatusReport(0,this.CLIENT_ID);
}

  ngOnInit(): void {
    this.CLIENT_ID = Number(localStorage.getItem("clientId"));
    this.ShowDriverStatusReport(0,this.CLIENT_ID);
        
    this.http.get('assets/images/logo-icon.png', { responseType: 'blob' })
    .subscribe(blob => {
      const reader = new FileReader();
      const binaryString = reader.readAsDataURL(blob);
      reader.onload = (event: any) => {
        this.imageInBase64 = event.target.result;
        console.log('Image in Base64: ', event.target.result);
        this.ExportFile(this.imageInBase64);
      };

      reader.onerror = (event: any) => {
        console.log("File could not be read: " + event.target.error.code);
      };

    });
  }

  public export = type => {
    // console.log(type);
    switch (type) {
      case "pdf":
        this.lineChart.chart.exportChart({
          type: "application/pdf",
          filename: "line-chart"
        });
        break;
    }
  };

  ExportFile(base64Data){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 1000,
      paginate: false,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
          // className: 'btn btn-danger',
          // text:      '<i class="fa fa-file-text-o"></i>',
          text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Driver Status' 
        },
        {
          extend: 'excel',
          // text:      '<i class="fa fa-file-excel-o"></i>',
          text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Driver Status' 
        },
        {
          extend: 'pdf',
          // text:  '<i class="fa fa-file-pdf-o"></i>',
          text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Driver Status',
          customize: function (doc) {
            doc.content.splice(1, 0, {
                margin: [0, 0, 0, 12],
                alignment: 'center',
                image: base64Data
            });
          }  
        },
      ]
    };
  }

  ShowEmployeeDetails(employeeId){
    // alert(">> "+employeeId);
    this.router.navigate(['/form/working-detail/'+employeeId]);
  }

  RefreshPage(){
    window.location.reload();
  }

  currentDate;
  currentDateTime;
  async DateShow(fromDate,toDate,sDate){
    this.currentDate=this.datePipe.transform(new Date(sDate), 'yyyy-MM-dd');
    // this.currentDateTime = this.datePipe.transform(new Date(sDate).setDate(new Date(sDate).getDate() + 1), 'yyyy-MM-dd HH:mm');
    // // this.currentDateTime=this.datePipe.transform(new Date(toDate), 'yyyy-MM-dd HH:mm');
    // $('#dsFromDate').val(this.currentDate);
    // $('#dsToDate').val(this.currentDateTime);
    $('#dateTime').val(this.currentDate);
  }

  driverStatusReportDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ShowDriverStatusReport(driverId,clientId){
    try {
      // let sFromDate = $('#dsFromDate').val()+" 00:00:00";
      // let sToDate =   $('#dsToDate').val()+ " 23:59:59";
      // const driverStatusReport= {
      //   'fromDate' : this.datePipe.transform(sFromDate, 'yyyy-MM-dd HH:mm:ss'),
      //   'toDate' : this.datePipe.transform(sToDate, 'yyyy-MM-dd HH:mm:ss'),
      //   'driverId' : 1,
			// };
      const driverStatusReport= {
        'driverId' : driverId,
        "clientId":clientId
			};
      this.isLoading=true;
      // this.dtTrigger=new Subject<any>();
		 	// const data: any = await this.request.post('/dispatch/view_drivering_status',driverStatusReport);
       const data: any = await this.request.post('/dispatch/view_all_driver_status',driverStatusReport);
      this.driverStatusReportDetails=[];
      // this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            if(dataObj[objKey1].deviceStatus!="" && dataObj[objKey1].deviceStatus!=null){

            }else{
              dataObj[objKey1].deviceStatus="-";
            }
            this.driverStatusReportDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.driverStatusReportDetails;
			// console.log(this.driverStatusReportDetails);
      this.rerender(); 
      this.isLoading=false;
   } catch (error) {}
}

    dgDataObj=[];
    dgCount=[];
    isGraphShow=false;
    seriesData=[];
    lastDateTime=0;
    lastStatus="";
    EMPLOYEE_ID=0;
    EMPLOYEE_NAME="";
    async ShowDriverGraphData(driverData){
      this.EMPLOYEE_ID = driverData.employeeId;
      this.EMPLOYEE_NAME = driverData.title+" "+driverData.firstName+" "+driverData.lastName;
      this.isGraphShow=true;
      this.seriesData=[];
      $("html, body").animate({ 
        scrollTop: $('html, body').get(0).scrollHeight }, 2000);
    
      // const DriverData = {
      //   'driverId':driverData.employeeId,
      // };
      // const data: any = await this.request.post('/dispatch/view_driver_working_status/',DriverData);
      
      let cDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

      this.fromDate = this.datePipe.transform(cDate+" 00:00:00", 'yyyy-MM-dd HH:mm:ss');
      this.toDate = this.datePipe.transform(cDate+" 23:59:59", 'yyyy-MM-dd HH:mm:ss');

      const DriverData= {
        'fromDate' : this.fromDate,
        'toDate' : this.toDate,
        'driverId' : this.EMPLOYEE_ID,
        'email': ""
			};
      const data: any = await this.request.post('/dispatch/view_drivering_status/',DriverData);
      this.GraphData(data,this.EMPLOYEE_NAME,cDate);
    }

    splitFromDate;
    fromDate;
    toDate;
    splitToDate;
    async ShowDriverStatusReportForGraph(){
      this.isGraphShow=true;
      this.seriesData=[];

      // this.splitFromDate = $("#dsFromDate").val();
      // let fDate = this.splitFromDate.split("T");
      // this.fromDate = fDate[0]+" "+fDate[1]+":00";

      // this.splitToDate = $("#dsToDate").val();
      // let tDate = this.splitToDate.split("T");
      // this.toDate = tDate[0]+" "+tDate[1]+":00";

      this.fromDate = this.datePipe.transform($("#dateTime").val()+" 00:00:00", 'yyyy-MM-dd HH:mm:ss');
      this.toDate = this.datePipe.transform($("#dateTime").val()+" 23:59:59", 'yyyy-MM-dd HH:mm:ss');
      let cDate = this.datePipe.transform($("#dateTime").val(), 'yyyy-MM-dd');
      // console.log(this.fromDate+" :: "+this.toDate);
      const DriverData= {
        'fromDate' : this.fromDate,
        'toDate' : this.toDate,
        'driverId' : this.EMPLOYEE_ID,
        'email': ""
			};
      // console.log(DriverData);
      const data: any = await this.request.post('/dispatch/view_drivering_status/',DriverData);
     // console.log(data);
      this.GraphData(data,this.EMPLOYEE_NAME, cDate);
    }

    GraphData(data,employeeName,selectDate){
      this.dgDataObj=[];
      this.dgCount=[];
      this.seriesData=[];
      this.lastDateTime=0;
      this.lastStatus="";

      let iCount=0,totalHourCount=0, inc=0;
      let workingHours=0;
      let fromDate=0, toDate=0, sDate="", date;

      // console.log("Series length  :"+this.chartOptions.series.length);
      while(this.chartOptions.series.length>0) {
        this.chartOptions.series.pop();
      }
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            // if(dataObj[objKey1].status!="Voilation"){

            
              // console.log(dataObj[objKey1]);
              fromDate = dataObj[objKey1].fromDate;
              toDate = dataObj[objKey1].toDate;
              if(inc==0){
                sDate = dataObj[objKey1].dateTime;

                date = this.datePipe.transform(new Date(selectDate), 'yyyy-MM-dd');
                let currentTime = new Date(this.datePipe.transform(new Date(sDate), 'yyyy-MM-dd HH:mm')).getTime();
                let midnightTime = new Date(this.datePipe.transform(date+ " 00:00", 'yyyy-MM-dd HH:mm')).getTime();
                workingHours = this.diff_hours(midnightTime,currentTime);
                // console.log(currentTime+ ": "+midnightTime+" :: "+workingHours);
                if(currentTime>midnightTime){
                  for(let i=1;i<=workingHours;i++){
                    this.seriesData.push(0);
                    iCount++;
                  }
                }
              }
              inc++;

              let lDateTime = new Date(this.datePipe.transform(new Date(dataObj[objKey1].dateTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
              if(this.lastDateTime>0 && this.lastStatus=="OnDuty"){
                workingHours = this.diff_hours(this.lastDateTime,lDateTime);
                // console.log(workingHours);
                for(let i=1;i<=workingHours;i++){
                  this.seriesData.push(1);
                  iCount++;
                }
              }
              if(this.lastDateTime>0 && this.lastStatus=="OnDrive"){
                workingHours = this.diff_hours(this.lastDateTime,lDateTime);
                //console.log(workingHours);
                for(let i=1;i<=workingHours;i++){
                  this.seriesData.push(2);
                  iCount++;
                }
              }
              if(this.lastDateTime>0 && this.lastStatus=="OnBreak"){
                workingHours = this.diff_hours(this.lastDateTime,lDateTime);
                // console.log(workingHours);
                for(let i=1;i<=workingHours;i++){
                  this.seriesData.push(3);
                  iCount++;
                }
              }
              if(this.lastDateTime>0 && this.lastStatus=="OnSleep"){
                workingHours = this.diff_hours(this.lastDateTime,lDateTime);
                // console.log(workingHours);
                for(let i=1;i<=workingHours;i++){
                  this.seriesData.push(4);
                  iCount++;
                }
              }
              if(this.lastDateTime>0 && this.lastStatus=="OffDuty"){
                workingHours = this.diff_hours(this.lastDateTime,lDateTime);
                // console.log(workingHours);
                for(let i=1;i<=workingHours;i++){
                  this.seriesData.push(5);
                  iCount++;
                }
              }
              
              if(this.lastDateTime>0 && this.lastStatus=="Voilation"){
                workingHours = this.diff_hours(this.lastDateTime,lDateTime);
                // console.log(workingHours);
                for(let i=1;i<=workingHours;i++){
                  this.seriesData.push(6);
                  iCount++;
                }
              }
            
              this.lastStatus = dataObj[objKey1].status;
              this.lastDateTime =lDateTime;
            // }
          }

          if(this.datePipe.transform(new Date(), 'yyyy-MM-dd')==this.datePipe.transform(new Date(sDate), 'yyyy-MM-dd')){
            // console.log("here"+this.datePipe.transform(new Date(), 'yyyy-MM-dd')+" :: "+this.datePipe.transform(new Date(toDate), 'yyyy-MM-dd'));
            toDate = new Date().getTime();
          }else{
            toDate = new Date(this.datePipe.transform(new Date(toDate).toISOString(), 'yyyy-MM-dd HH:mm:ss')).getTime();
          }

          if(this.lastDateTime>0 && this.lastStatus=="OnDuty"){
            workingHours = this.diff_hours(this.lastDateTime,toDate);
            // console.log(workingHours);
            for(let i=1;i<=workingHours;i++){
              this.seriesData.push(1);
              iCount++;
            }
          }
          if(this.lastDateTime>0 && this.lastStatus=="OnDrive"){
            workingHours = this.diff_hours(this.lastDateTime,toDate);
            // console.log(workingHours);
            for(let i=1;i<=workingHours;i++){
              this.seriesData.push(2);
              iCount++;
            }
          }
          if(this.lastDateTime>0 && this.lastStatus=="OnBreak"){
            workingHours = this.diff_hours(this.lastDateTime,toDate);
            // console.log(workingHours);
            for(let i=1;i<=workingHours;i++){
              this.seriesData.push(3);
              iCount++;
            }
          }
          if(this.lastDateTime>0 && this.lastStatus=="OnSleep"){
            workingHours = this.diff_hours(this.lastDateTime,toDate);
            // console.log(workingHours+" :: "+new Date().getTime());
            for(let i=1;i<=workingHours;i++){
              this.seriesData.push(4);
              iCount++;
            }
          }
          if(this.lastDateTime>0 && this.lastStatus=="OffDuty"){
            workingHours = this.diff_hours(this.lastDateTime,toDate);
            // console.log(workingHours);
            for(let i=1;i<=workingHours;i++){
              this.seriesData.push(5);
              iCount++;
            }
          }
          if(this.lastDateTime>0 && this.lastStatus=="Voilation"){
            workingHours = this.diff_hours(this.lastDateTime,toDate);
            // console.log(workingHours);
            for(let i=1;i<=workingHours;i++){
              this.seriesData.push(6);
              iCount++;
            }
          }

          // let cDate = this.datePipe.transform(sDate, 'yyyy-MM-dd HH:mm:ss');
          let currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
          let cDate = this.datePipe.transform(currentDate+" 00:00:00", 'yyyy-MM-dd HH:mm:ss');
          // alert(cDate);
          let nextDate = this.datePipe.transform(new Date(cDate).setDate(new Date(cDate).getDate() + 1), 'yyyy-MM-dd HH:mm:ss');
          let time = new Date(nextDate).getTime() - new Date(cDate).getTime();  //msec
          let hoursDiff = time / ( 60 * 1000);
         // console.log(hoursDiff);
          let createTime;
          let createTimeInMin;
          for(let i=0;i<hoursDiff;i++){
            totalHourCount++;
            // createTime = new Date(cDate).setHours(new Date(cDate).getHours() + i);
            createTimeInMin = new Date(cDate).setMinutes(new Date(cDate).getMinutes() + i*1);
            // createTime = this.datePipe.transform(new Date(createTime), 'HH:mm');
            createTimeInMin = this.datePipe.transform(new Date(createTimeInMin), 'HH:mm');
            //console.log(cDate+" :: "+nextDate+" :: "+createTimeInMin );
            this.dgDataObj.push(createTimeInMin);
          }

          // console.log(this.dgDataObj);
          // Highcharts.charts[0].xAxis[0].update({categories:this.dgDataObj}, true); //using without update flag
          this.chartOptions.xAxis.categories=this.dgDataObj;  
          this.chartOptions.subtitle.text=employeeName;

          // for(let i=iCount;i<totalHourCount;i++){
          //   this.seriesData.push(0);
          // }

        }
        // this.export('pdf');
      }
        
      this.DateShow(fromDate,toDate,sDate);

      // this.seriesData = [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3];
      //console.log(this.seriesData);
      this.chartOptions.series.push({
        name : "Driver Status",
        data: this.seriesData,
        step: true,
        lineWidth: 3,
        marker: {
          enabled: false
        },
        
        // zones: [
        //   {
        //     value: 6,
        //     color: 'red'
        //   }
        // ]

      });

      this.updateFlag=true;
    }

    diff_hours(dt2, dt1) {
      var diff =(dt2 - dt1) / 1000;
      diff = diff/60;
      // console.log("Diff : "+diff);
      // return Math.abs(diff);
      return Math.abs(Math.round(diff));
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


