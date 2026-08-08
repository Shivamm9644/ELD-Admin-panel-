import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe,formatDate } from '@angular/common';
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
import { globalDriverName,globalDriverId,globalFromDates,globalToDates } from '../../administrator/simulator/simulator.component';
import { environment } from '../../../../environments/environment';

import html2canvas from 'html2canvas';

import * as Highcharts from 'highcharts';
import HC_exporting from "highcharts/modules/exporting";
import HC_Data from "highcharts/modules/export-data";
import Accessbility from "highcharts/modules/accessibility";

HC_exporting(Highcharts);
HC_Data(Highcharts);
Accessbility(Highcharts);

declare let $: any;
searchText: String;

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

export var globalDLDriverId: number = 0;
// export var globalDlDriverName: any ="";
export var globalDLFromDates: any = "";
export var globalDLToDates: any = "";


@Component({
  selector: 'app-driver-logs',
  templateUrl: './driver-logs.component.html',
  styleUrls: ['./driver-logs.component.scss']
})
export class DriverLogsComponent implements OnInit {
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
      
   };

  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;
  dlogForm:any={}
  driverLogForm:any={}

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private activatedRoute: ActivatedRoute,
    private datePipe : DatePipe
  ) { }

  imageInBase64;
  employeeId;
  ngOnInit() {
    this.employeeId=this.activatedRoute.snapshot.params.employeeId;
    // alert(" >> "+this.employeeId);
    this.dlogForm.employeeId = Number(this.employeeId);
    globalDLDriverId = 0;
    // globalDLDriverName= "";
    globalDLFromDates = "";
    globalDLToDates = "";

    this.isEditMode=false;
    this.isViewMode=false;
    this.DateShow();
    this.CurrentDate();
    this.getAllDriverName();
    this.getAllVoilations();
    // this.getAllDriver();
    // this.getAllClient();

    // console.log(" >> "+globalDriverId+" :: "+globalFromDates+" :: "+globalToDates);
    if(Number(globalDriverId)>0){
      $("#fromDate").val(this.datePipe.transform(globalFromDates, 'yyyy-MM-dd HH:mm'));
      $("#toDate").val(this.datePipe.transform(globalToDates, 'yyyy-MM-dd HH:mm'));
      //this.dlogForm.employeeId = Number(globalDriverId);
    }
    // this.ShowDLogReport('');
    if(this.employeeId>0){
      console.log("here");
      this.ShowDLogReports(this.employeeId);
    }

    // this.http.get('assets/images/logo-icon.png', { responseType: 'blob' }).subscribe(blob => {
    //   const reader = new FileReader();
    //   const binaryString = reader.readAsDataURL(blob);
    //   reader.onload = (event: any) => {
    //     this.imageInBase64 = event.target.result;
    //     console.log('Image in Base64: ', event.target.result);
    //     this.ExportFile(this.imageInBase64);
    //   };
    //   reader.onerror = (event: any) => {
    //     console.log("File could not be read: " + event.target.error.code);
    //   };
    // });
  }

  ShowWorkingDetails(){
    if(Number(this.employeeId)>0){
      this.router.navigate(['/form/working-detail/'+this.employeeId]);
    }
  }

  voilationDataObj=[];
	voilationDataArr;
	async getAllVoilations(){
		try {
			this.voilationDataObj=[];	
			let arr = {
        id:"Has Voilations",
        voilationName:"Has Voilations",
      };
      this.voilationDataObj.push(arr);
      arr = {
        id:"No Voilations",
        voilationName:"No Voilations",
      };
      this.voilationDataObj.push(arr);
			this.voilationDataArr = this.voilationDataObj;
		} catch (error) {}
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

    DownloadPdf() {
      // let doc = new jsPDF();
      // let doc = new jsPDF('l','mm',[297, 210]);
      let doc = new jsPDF('l','mm',"a4");
      // alert("here");
      // Add a title to your PDF
      // doc.setFontSize(30); 
      // doc.text("Driver Log",12, 10);
  
      // Create your table here (The dynamic table needs to be converted to canvas).
      var element = $("#driver_log_table")[0];
      html2canvas(element).then((canvas: any) => {
        // doc.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 0, 50, 
        // doc.internal.pageSize.width, element.offsetHeight / 5 );
        doc.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 0, 20, 
        doc.internal.pageSize.width, element.offsetHeight / 5 );
        doc.save(this.EMPLOYEE_NAME+' Driver Log.pdf');
      })
      // this.export("pdf");
    }
    
    ExportFile(base64Data){
    this.dtOptions = {
      pagingType: 'full_numbers',
      // pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
      
        buttons: [
        {
          extend: 'csv',
          className: 'btn btn-danger',
          text:'<i class="fa fa-file-text-o"></i>',
          titleAttr: 'Download as CSV',
          title: 'Driver Log Report' 
        },
        {
          extend: 'excel',
          className: 'btn btn-danger',
          text:'<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: 'Driver Log Report' 
        },
	    {
          extend: 'pdf',
          className: 'btn btn-danger',
          text:'<i class="fa fa-file-pdf-o"></i>',
          titleAttr: 'Download as Pdf',
          title: 'Driver Log Report' ,
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

  viewByDLOnSimulator(){
    globalDLDriverId =this.dlogForm.employeeId,
    globalDLFromDates = $('#fromDate').val();
    globalDLToDates = $('#toDate').val();
    // console.log(" >> "+globalDLDriverId+" :: "+globalDLFromDates+" :: "+globalDLToDates);
    this.router.navigate(['/form/simulator']);
  }

  currentDate;
  currentDateTime;
  currentDates;
  async DateShow(){
  this.currentDates=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  this.currentDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  this.currentDateTime=this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm');
  $('#fromDate').val(this.currentDate+" 00:00");
  $('#toDate').val(this.currentDateTime);
  $('#dateTime').val(this.currentDates)
  //alert(this.currentDateTime);
  }

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
  dgDataObj=[];
  dgCount=[];
  isGraphShow=false;
  seriesData=[];
  lastDateTime=0;
  lastStatus="";
  EMPLOYEE_ID=0;
  EMPLOYEE_NAME="";
  async ShowDLogReport(employeeName){
    try {
      this.EMPLOYEE_NAME = employeeName;
      this.seriesData=[];
      this.isLoading = true;

      this.splitFromDate = $("#fromDate").val();
      let cDate = this.splitFromDate.split("T");
      this.fromDate = cDate[0]+" "+cDate[1]+":00";

      this.splitToDate = $("#toDate").val();
       cDate = this.splitToDate.split("T");
      this.toDate = cDate[0]+" "+cDate[1]+":00";
      //alert(this.fromDate+" :: "+this.toDate);

     // let cDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

      // this.fromDate = this.datePipe.transform(cDate+" 00:00:00", 'yyyy-MM-dd HH:mm:ss');
      // this.toDate = this.datePipe.transform(cDate+" 23:59:59", 'yyyy-MM-dd HH:mm:ss');

      const dlog= {
        'driverId' : this.dlogForm.employeeId,
        'fromDate' : this.fromDate,
        'toDate' : this.toDate,
        'email': "" 
			};
      // console.log(dlog);
       // this.dtTrigger=new Subject<any>();
        const data: any = await this.request.post('/dispatch/view_drivering_status/',dlog);
        this.dvirDetails=[];
      //this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
           // console.log(dataObj[objKey1].driverName);
            this.EMPLOYEE_NAME = dataObj[objKey1].driverName;
            this.dvirDetails.push(dataObj[objKey1]);
          } 
        }
      }
      this.GraphData(data,this.EMPLOYEE_NAME, cDate);				
      this.rowData = this.dvirDetails;
      this.rerender();
      //console.log(this.simulatorDetails);
      this.isLoading = false;
    } catch (error) {}
  }

  DownloadDotReport(){
    let employeeId = this.driverLogForm.newLogEmployeeId;
    let fromDate = this.datePipe.transform($("#downloadLogStartDate").val()+" 00:00:00","yyyy-MM-dd HH:mm:ss");
    let toDate = this.datePipe.transform($("#downloadLogEndDate").val()+" 23:59:59","yyyy-MM-dd HH:mm:ss");
    let url = environment.apiUploadUrl+`/eldchart/generateCharts/`+employeeId+`/`+fromDate+`/`+toDate+`/download`;
    // console.log(url);
    // $('#reportWebView').attr('src', url);
    window.open(url, '_blank');

    // const DriverData= {
    //   'fromDate' : fromDate,
    //   'toDate' : toDate,
    //   'driverId' : employeeId,
    // };
    // const data: any = this.request.post('/dispatch/update_drivering_status_for_dot_report/',DriverData);

  }
 
    async ShowDriverStatusReportForGraph(){
      this.isGraphShow=true;
      this.seriesData=[];

      // this.splitFromDate = $("#fromDate").val();
      // let fDate = this.splitFromDate.split("T");
      // this.fromDate = fDate[0]+" "+fDate[1]+":00";

      // this.splitToDate = $("#toDate").val();
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

      this.isGraphShow=true;

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
        
      // this.DateShow();

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


  ShowNewDriverName(employeeId,employeeName){
    // console.log(employeeId,employeeName);
    this.driverLogForm.newEmployeeId = employeeId;
  }


  isUpdatedRecord;
  message;
  async UpdateDriverLog(){	
    try {
      this.splitFromDate = $("#fromDate").val();
      let fDate = this.splitFromDate.split("T");
      this.fromDate = fDate[0]+" "+fDate[1]+":00";

      this.splitToDate = $("#toDate").val();
      let tDate = this.splitToDate.split("T");
      this.toDate = tDate[0]+" "+tDate[1]+":00";
			const dlog = {
        "driverId":Number(this.driverLogForm.newEmployeeId),
				"lastDriverId":Number(this.dlogForm.employeeId),
        "fromDate" : this.fromDate,
        "toDate" : this.toDate,
			};
      // console.log(dlog);
			const save: any = await this.request.post('/dispatch/update_driver_log',dlog);
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
				this.ShowDLogReport('');
			  }
			  window.location.reload();
			  this.ShowDLogReport('');
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


// ShowEmployeeDetails(){
  //   this.router.navigate(['/form/log-driver/1/2024-01-01']);
  // }
  
  RefreshPage(){
    window.location.reload();
  }
  
  TodayCurrentDate;
  nextDayDate;
  CurrentDate(){
    this.TodayCurrentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.toDate=this.TodayCurrentDate
    this.nextDayDate = new Date();
    this.nextDayDate.setDate( this.nextDayDate.getDate()-15);
    this.fromDate=this.datePipe.transform(this.nextDayDate, 'yyyy-MM-dd');
    $('#dFromDate').val(this.fromDate);
    $('#dToDate').val(this.toDate);
    //  alert(this.fromDate+" :: "+this.toDate);
  } 

  ShowEmployeeDetails(driverId,dateTime){
    // alert(">> "+driverId+">> "+dateTime);
   this.router.navigate(['/form/log-driver/'+driverId+"/"+dateTime]);
 }

 dvirDetail=[];
 rowData1;
//  isLoading : boolean=false;
 EMPLOYEE_NAMES="";
 currentDateS;
 nextDate;
 logDate="";
 logDataArr=[];
 isVoilation=false;
 lastDateTimeS=0;
 lastStatuss;
 breakHour=0;
 driveHour=0;
 logRowData;
 certifiedSignature="";
 LOG_DATE_ARR=[];
 isCertified=false;
 certifiedDateData=[];
 async ShowDLogReports(employeeId){
    try {
      if(employeeId>0){
        this.employeeId = employeeId;
      }
      // alert(" >> "+this.employeeId);
      if(this.employeeId<=0){
        $("#employeeNameError").text("Please Select Driver Name.");
        return;
      }else{
        $("#employeeNameError").text("");
      }
      this.LOG_DATE_ARR=[];
      let iCount=0;
      let timezoneOffSet=""; let isData=false;
      let lDateTime=0, lastOnDriveDateTime=0, lastOnDriveStatus="";
      let sDateTime;
      let driverName="";
      this.logDataArr=[];
      this.logDate="";
      this.lastDateTime=0;
      this.isLoading = true;
      let sFromDate = $('#dFromDate').val()+" 00:00:00";
      let sToDate =   $('#dToDate').val()+ " 23:59:59";
        
      this.fromDate=this.datePipe.transform(sFromDate, 'yyyy-MM-dd HH:mm:ss');
      this.toDate=this.datePipe.transform(sToDate, 'yyyy-MM-dd HH:mm:ss');
      
      const dlog= {
        'driverId' : this.employeeId,
        'fromDate' : this.fromDate,
        'toDate' : this.toDate,
        'email': "" 
      };
      console.log(dlog);
      const data: any = await this.request.post('/dispatch/view_drivering_status_for_graph/',dlog);
      console.log(data);
      this.dvirDetails=[];
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="arrayData"){
              // console.log(dataObj);
              this.certifiedDateData = dataObj;
            }
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            if(new Date(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd'))>=new Date(this.datePipe.transform(sFromDate, 'yyyy-MM-dd'))){
              // console.log(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd')+" :: "+dataObj[objKey1].status);
              lDateTime = new Date(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd HH:mm:ss')).getTime();
              if(isData==false && dataObj[objKey1].timezoneOffSet!=""){
                isData=true;
                timezoneOffSet = dataObj[objKey1].timezoneOffSet;
                driverName = dataObj[objKey1].driverName;
              }
              if(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd')!=this.logDate && this.logDate!=""){
                // console.log(" >> "+this.logDate+" :: "+this.driveHour);
                // console.log(" >> "+this.logDate+" :: "+lastOnDriveStatus+" :: "+lastOnDriveDateTime);
                if(lastOnDriveStatus=="OnDrive"){
                  let cDate1 = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                  let cDate2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                  // console.log(" >> "+cDate1+" :: "+cDate2);
                  if(cDate1!=cDate2){
                    let lastDayDateTime = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                    lastDayDateTime = lastDayDateTime+" 23:59:59";
                    let timestamp = new Date(lastDayDateTime).getTime();
                    // console.log(" >> "+timestamp+" :: "+lastOnDriveDateTime);
                    this.driveHour+=Number(this.diff_hours(lastOnDriveDateTime,timestamp));
                  }else{
                    let timestamp = new Date().getTime();
                    // console.log(" >> "+timestamp+" :: "+lastOnDriveDateTime);
                    this.driveHour+=Number(this.diff_hours(lastOnDriveDateTime,timestamp));
                  }
                }
                let sHrs, sMins;
                if(this.driveHour>0){
                  var hrs = Math.floor(this.driveHour / 60);
                  var min = this.driveHour % 60;
                  if(hrs.toString().length==1){
                    sHrs = "0"+hrs;
                  }else{
                    sHrs = hrs;
                  }
                  if(min.toString().length==1){
                    sMins = "0"+min;
                  }else{
                    sMins = min;
                  }
                }else{
                  sHrs="00";
                  sMins="00";
                  
                }
                this.logDataArr.push({driverId:this.employeeId,driverName:driverName,dateTime:this.logDate,formattedDate:this.datePipe.transform(this.logDate, 'MMM dd'),workingHour:(sHrs+":"+sMins),voilation:this.isVoilation,certified:this.isCertified});
                this.isVoilation=false;
                this.isCertified=false;
                this.driveHour=0;
                // lastOnDriveDateTime=0;
                // lastOnDriveStatus = "";
              }
              this.logDate = this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd');
              if(dataObj[objKey1].status=="Voilation"){
                this.isVoilation=true;
              }

              try{
                if(dataObj[objKey1].shippingDocs.length>0){
                  this.isCertified=true;
                }else{
                  this.isCertified=false;
                }
              }catch(error){}

              // console.log(" >> "+this.logDate+" :: "+dataObj[objKey1].status);
              if(lastOnDriveDateTime>0 && (lastOnDriveStatus=="OnDrive" || lastOnDriveStatus=="OnDuty" || lastOnDriveStatus=="OnSleep" || lastOnDriveStatus=="OffDuty")){
                if(dataObj[objKey1].isVoilation==0){
                  let cDate1 = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                  let cDate2 = this.datePipe.transform(new Date(lDateTime), 'yyyy-MM-dd');
                  // console.log(" >> "+cDate1+" :: "+cDate2);
                  if(cDate1!=cDate2){
                    let lastDayDateTime = this.datePipe.transform(new Date(lDateTime), 'yyyy-MM-dd');
                    lastDayDateTime = lastDayDateTime+" 00:00:00";
                    let timestamp = new Date(lastDayDateTime).getTime();
                    // console.log( " >> Time : "+timestamp+" :: "+lDateTime);
                    this.driveHour+=Number(this.diff_hours(timestamp,lDateTime));
                    lastOnDriveDateTime = 0;
                    lastOnDriveStatus = "";
                  }else{
                    this.driveHour+=Number(this.diff_hours(lastOnDriveDateTime,lDateTime));
                    lastOnDriveDateTime = 0;
                    lastOnDriveStatus = "";
                  }
                }
              }
              
              if(dataObj[objKey1].status=="OnDrive"){
                lastOnDriveDateTime = lDateTime;
                lastOnDriveStatus = dataObj[objKey1].status;
                sDateTime = dataObj[objKey1].dateTime;
              }

              this.lastStatus = dataObj[objKey1].status;
              this.lastDateTime =lDateTime;

              this.dvirDetails.push(dataObj[objKey1]);
            }
           
          }
          let sHrs, sMins;
          // console.log(" >> "+this.logDate+" :: "+this.driveHour);
          if(lastOnDriveStatus=="OnDrive"){
            // let lastDayDateTime = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
            // lastDayDateTime = lastDayDateTime+" 23:59:59";
            // let timestamp = new Date(lastDayDateTime).getTime();
            // // console.log(" >> "+timestamp+" :: "+lastOnDriveDateTime);
            // this.driveHour+=Number(this.diff_hours(lastOnDriveDateTime,timestamp));

            // console.log(" >> "+sDateTime+" :: "+lastOnDriveDateTime);
            let cDate1 = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
            let cDate2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            // console.log(" >> "+cDate1+" :: "+cDate2);
            if(cDate1!=cDate2){
              let lastDayDateTime = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
              lastDayDateTime = lastDayDateTime+" 23:59:59";
              let timestamp = new Date(lastDayDateTime).getTime();
              // console.log(" >> "+timestamp+" :: "+lastOnDriveDateTime);
              this.driveHour+=Number(this.diff_hours(lastOnDriveDateTime,timestamp));
            }else{
              let timestamp = new Date().getTime();
              this.driveHour+=Number(this.diff_hours(lastOnDriveDateTime,timestamp));
            }
            
          }
          if(this.driveHour>0){
            var hrs = Math.floor(this.driveHour / 60);
            var min = this.driveHour % 60;
            if(hrs.toString().length==1){
              sHrs = "0"+hrs;
            }else{
              sHrs = hrs;
            }
            if(min.toString().length==1){
              sMins = "0"+min;
            }else{
              sMins = min;
            }
          }else{
            sHrs="00";
            sMins="00";
            
          }
          this.logDataArr.push({driverId:this.employeeId,driverName:driverName,dateTime:this.logDate,formattedDate:this.datePipe.transform(this.logDate, 'MMM dd'),workingHour:(sHrs+":"+sMins),voilation:this.isVoilation,certified:this.isCertified}); 
          this.isVoilation=false;
          this.isCertified=false;
          this.driveHour=0;
          lastOnDriveDateTime=0;
          lastOnDriveStatus = "";
          // console.log(this.logDataArr);
        }
      }

      this.rowData = this.dvirDetails;

      // console.log(this.logDataArr);

      this.logDataArr.forEach(log => {
        // console.log('Date:', log.dateTime);
        this.LOG_DATE_ARR.push(log.dateTime);
      });
      const firstDate = this.LOG_DATE_ARR[0];
      const lastDate = this.LOG_DATE_ARR[this.LOG_DATE_ARR.length - 1];
      timezoneOffSet = timezoneOffSet.replace(':', ''); 
      // console.log(" >> Timezone : "+timezoneOffSet);
      // console.log(lastDate+" :: "+formatDate(new Date(), "yyyy-MM-dd", "en-US", timezoneOffSet));
      const currentDayDate = formatDate(new Date(), "yyyy-MM-dd", "en-US", timezoneOffSet);
      // const missingFirstWorkingDaysDate = this.getMissingDates(this.datePipe.transform(new Date(sFromDate)-1, 'yyyy-MM-dd'),firstDate);
      const missingFirstWorkingDaysDate = this.getMissingDates(
        this.datePipe.transform(new Date(new Date(sFromDate).getTime() - 86400000), 'yyyy-MM-dd'),
        firstDate
      );
      const missingLastWorkingDaysDate = this.getMissingDates(lastDate, currentDayDate);
      // console.log(missingFirstWorkingDaysDate);
      const missingDates = this.findMissingDates(this.LOG_DATE_ARR);
      // console.log(this.LOG_DATE_ARR);
      // console.log(missingDates);
      const allMissingDates = [...missingDates, ...missingLastWorkingDaysDate, ...missingFirstWorkingDaysDate];
      // console.log(allMissingDates);
      this.addMissingDateLogs(allMissingDates, this.employeeId, "00", "00");

      this.logDataArr = this.removeDuplicates(this.logDataArr);
      // console.log(this.logDataArr);
      
      this.logDataArr.sort((a, b) => {
        const dateA = new Date(a.dateTime).getTime();
        const dateB = new Date(b.dateTime).getTime();
        return dateB - dateA; // Descending order
      });

      this.logRowData = this.logDataArr;
     console.log(this.logRowData);
      this.isLoading = false;
      this.rerender();

    } catch (error) {}
  }
 async ShowDLogReports_Old(employeeId){
   try {
    //this.EMPLOYEE_NAMES = employeeName;
      let workingHours=0;
      this.logDataArr=[];
      this.isLoading = true;
      this.LOG_DATE_ARR=[];
      let timezoneOffSet=""; let isData=false;
      // this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      // this.toDate=this.currentDate
      // this.nextDate = new Date();
      // this.nextDate.setDate( this.nextDate.getDate()-15);
      // this.fromDate=this.datePipe.transform(this.nextDate, 'yyyy-MM-dd HH:mm:ss');
       let sFromDate = $('#dFromDate').val()+" 00:00:00";
      let sToDate =   $('#dToDate').val()+ " 23:59:59";
      // alert(this.dlogForm.voilationId);
      let voilations="";
      if(this.dlogForm.voilationId==undefined){
        // alert("No Voilations");
        voilations = "No Voilations";
      }else{
        voilations = this.dlogForm.voilationId;
      }
      const dlog= {
        'driverId' : employeeId,
        'fromDate' : this.datePipe.transform(sFromDate, 'yyyy-MM-dd HH:mm:ss'),
        'toDate' : this.datePipe.transform(sToDate, 'yyyy-MM-dd HH:mm:ss'),
        'clientId': Number(localStorage.getItem("clientId"))
      };
      //console.log(dlog);
       const data: any = await this.request.post('/dispatch/view_drivering_status_for_log/',dlog);
       this.dvirDetail=[];
     for (let objKey of Object.keys(data)) {
       let dataObj = data[objKey];
       if(objKey=="result"){
         for (let objKey1 of Object.keys(dataObj)) {
          if(isData==false && dataObj[objKey1].timezoneOffSet!=""){
            isData=true;
            timezoneOffSet = dataObj[objKey1].timezoneOffSet;
          }
          if(voilations=="No Voilations"){

            if(dataObj[objKey1].certifiedSignature!=""){
              dataObj[objKey1].certifiedSignature="Certified";
            }else{
              dataObj[objKey1].certifiedSignature="Not Certified";
            }

            this.EMPLOYEE_NAMES = dataObj[objKey1].driverName;
           // console.log(dataObj[objKey1].driverName);
           if(this.datePipe.transform(dataObj[objKey1].lDateTime, 'yyyy-MM-dd')!=this.logDate && this.logDate!=""){
             this.logDataArr.push({driverName:this.EMPLOYEE_NAMES,driverId:dataObj[objKey1].driverId,dateTime:this.logDate,workingHour:(workingHours/60),voilation:this.isVoilation,certifiedSignature:this.certifiedSignature,certified:this.isCertified});
             this.isVoilation=false;
             this.isCertified=false;
             workingHours=0;
           }
           this.certifiedSignature = dataObj[objKey1].certifiedSignature;
           this.logDate = this.datePipe.transform(dataObj[objKey1].lDateTime, 'yyyy-MM-dd');
           if(dataObj[objKey1].status=="Voilation"){
             this.isVoilation=true;
           }

           try{
            if(dataObj[objKey1].shippingDocs.length>0){
              this.isCertified=true;
            }else{
              this.isCertified=false;
            }
          }catch(error){}
            
           let lDateTime=0;
           if(this.datePipe.transform(dataObj[objKey1].lDateTime, 'yyyy-MM-dd')==this.datePipe.transform(this.lastDateTime, 'yyyy-MM-dd') && this.lastDateTime>0){
             lDateTime = new Date(this.datePipe.transform(new Date(dataObj[objKey1].lDateTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
             if(this.lastDateTime>0 && this.lastStatus=="OnDuty"){
               workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
             }
             if(this.lastDateTime>0 && this.lastStatus=="OnDrive"){
               workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
               this.driveHour+=Number(this.diff_hour(this.lastDateTime,lDateTime));
             }
             if(this.lastDateTime>0 && this.lastStatus=="OnBreak"){
               workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
               this.breakHour+=Number(this.diff_hour(this.lastDateTime,lDateTime));
             }
             if(this.lastDateTime>0 && this.lastStatus=="OnSleep"){
               workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
             }
             if(this.lastDateTime>0 && this.lastStatus=="OffDuty"){
               workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
             }
             if(this.lastDateTime>0 && this.lastStatus=="Voilation"){
               workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
             }
             this.lastStatus = dataObj[objKey1].status;
             this.lastDateTime =lDateTime;
           }

           workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
           this.dvirDetail.push(dataObj[objKey1]);

          }else{
            if(dataObj[objKey1].status=="Voilation"){
              this.EMPLOYEE_NAMES = dataObj[objKey1].driverName;
              // console.log(dataObj[objKey1].driverName);
              if(this.datePipe.transform(dataObj[objKey1].lDateTime, 'yyyy-MM-dd')!=this.logDate && this.logDate!=""){
                this.logDataArr.push({driverName:this.EMPLOYEE_NAMES,driverId:dataObj[objKey1].driverId,dateTime:this.logDate,workingHour:(workingHours/60),voilation:this.isVoilation,certifiedSignature:this.certifiedSignature,certified:this.isCertified});
                this.isVoilation=false;
                workingHours=0;
              }
              this.certifiedSignature = dataObj[objKey1].certifiedSignature;
              
              this.logDate = this.datePipe.transform(dataObj[objKey1].lDateTime, 'yyyy-MM-dd');
              if(dataObj[objKey1].status=="Voilation"){
                this.isVoilation=true;
              }
   
              let lDateTime=0;
              if(this.datePipe.transform(dataObj[objKey1].lDateTime, 'yyyy-MM-dd')==this.datePipe.transform(this.lastDateTime, 'yyyy-MM-dd') && this.lastDateTime>0){
                lDateTime = new Date(this.datePipe.transform(new Date(dataObj[objKey1].lDateTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
                if(this.lastDateTime>0 && this.lastStatus=="OnDuty"){
                  workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
                }
                if(this.lastDateTime>0 && this.lastStatus=="OnDrive"){
                  workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
                  this.driveHour+=Number(this.diff_hour(this.lastDateTime,lDateTime));
                }
                if(this.lastDateTime>0 && this.lastStatus=="OnBreak"){
                  workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
                  this.breakHour+=Number(this.diff_hour(this.lastDateTime,lDateTime));
                }
                if(this.lastDateTime>0 && this.lastStatus=="OnSleep"){
                  workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
                }
                if(this.lastDateTime>0 && this.lastStatus=="OffDuty"){
                  workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
                }
                if(this.lastDateTime>0 && this.lastStatus=="Voilation"){
                  workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
                }
                this.lastStatus = dataObj[objKey1].status;
                this.lastDateTime =lDateTime;
              }
   
              workingHours += Number(this.diff_hour(this.lastDateTime,lDateTime));
              this.dvirDetail.push(dataObj[objKey1]);
            }
          }
           
         }
         this.logDataArr.push({driverName:this.EMPLOYEE_NAMES,driverId:employeeId,dateTime:this.logDate,workingHour:(workingHours/60),voilation:this.isVoilation,certifiedSignature:this.certifiedSignature,certified:this.isCertified}); 
         this.isVoilation=false;
         workingHours=0;
       }
     }

     this.logDataArr.forEach(log => {
        // console.log('Date:', log.dateTime);
        this.LOG_DATE_ARR.push(log.dateTime);
      });
      const lastDate = this.LOG_DATE_ARR[this.LOG_DATE_ARR.length - 1];
      timezoneOffSet = timezoneOffSet.replace(':', ''); 
      // console.log(" >> Timezone : "+timezoneOffSet);
      // console.log(lastDate+" :: "+formatDate(new Date(), "yyyy-MM-dd", "en-US", timezoneOffSet));
      const currentDayDate = formatDate(new Date(), "yyyy-MM-dd", "en-US", timezoneOffSet);

      const missingLastWorkingDaysDate = this.getMissingDates(lastDate, currentDayDate);
      // console.log(missingLastWorkingDaysDate);
      const missingDates = this.findMissingDates(this.LOG_DATE_ARR);
      // console.log(this.LOG_DATE_ARR);
      // console.log(missingDates);
      const allMissingDates = [...missingDates, ...missingLastWorkingDaysDate];
      this.addMissingDateLogs(allMissingDates, employeeId, "00", "00");

      this.logDataArr = this.removeDuplicates(this.logDataArr);

      this.logDataArr.sort(function(a, b) {
        // console.log(a.dateTime);
        if (a.dateTime > b.dateTime) {
          return -1;
        }
        if (a.dateTime < b.dateTime) {
          return 1;
        }
        // date time must be equal
        return 0;
      });

      
     this.logRowData = this.logDataArr;
     this.rowData1 = this.dvirDetail;
      // console.log(this.logDataArr);
     this.isLoading = false;
     this.rerender();
   } catch (error) {}
 }

 addMissingDateLogs(missingDates: string[], employeeId: number, sHrs: string, sMins: string): void {
    missingDates.forEach(date => {
      let exists = this.certifiedDateData.includes(date);
      this.logDataArr.push({driverId: employeeId,dateTime: date,formattedDate:this.datePipe.transform(date, 'MMM dd'),workingHour: `${sHrs}:${sMins}`,voilation: false,certified: exists});
    });
  }

  getMissingDates(start: string, end: string): string[] {
    const missingDates: string[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Move to the next date after startDate
    startDate.setDate(startDate.getDate() + 1);

    while (startDate <= endDate) {
      const yyyy = startDate.getFullYear();
      const mm = String(startDate.getMonth() + 1).padStart(2, '0');
      const dd = String(startDate.getDate()).padStart(2, '0');
      missingDates.push(`${yyyy}-${mm}-${dd}`);

      startDate.setDate(startDate.getDate() + 1);
    }

    return missingDates;
  }

  findMissingDates(dateStrings: string[]): string[] {
    const dateSet = new Set(dateStrings);

    const startDate = new Date(dateStrings[0]);
    const endDate = new Date(dateStrings[dateStrings.length - 1]);

    const missingDates: string[] = [];

    let current = new Date(startDate);
    while (current <= endDate) {
      const formatted = current.toISOString().split('T')[0];
      if (!dateSet.has(formatted)) {
        missingDates.push(formatted);
      }
      current.setDate(current.getDate() + 1);
    }

    return missingDates;
  }
  

  removeDuplicates(data: any[]): any[] {
    return data.reduce((acc, item) => {
      if (!acc.some(existingItem => existingItem.dateTime === item.dateTime)) {
        acc.push(item);
      }
      return acc;
    }, []);
  }

 diff_hour(dt2, dt1) {
   var diff =(dt2 - dt1) / 1000;
   // diff = diff/60;
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
