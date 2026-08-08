import { Component, OnInit,ViewChild } from '@angular/core';
import { SidebarService } from '../../../shared/sidebar/sidebar.service';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http'; 

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import {Fill, Stroke, Style} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import Text from 'ol/style/Text';
import Point from 'ol/geom/Point';
import {transform} from 'ol/proj';
import CircleStyle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';
import {toStringHDMS} from 'ol/coordinate'; 
import Overlay from 'ol/Overlay';
import {toLonLat} from 'ol/proj';
import {Draw, Select, Modify, Snap} from 'ol/interaction';
//import GeoJSON from 'ol/format/GeoJSON';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { RequestService } from '../../../../services/request.service';
import { DatePipe } from '@angular/common';
import { from } from 'rxjs';

import * as Highcharts from 'highcharts';
import HC_exporting from "highcharts/modules/exporting";
import HC_Data from "highcharts/modules/export-data";
import Accessbility from "highcharts/modules/accessibility";

import { environment } from '../../../../environments/environment';

import { DataTableDirective} from 'angular-datatables';
import {Subject } from 'rxjs';

import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

HC_exporting(Highcharts);
HC_Data(Highcharts);
Accessbility(Highcharts);

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

declare let $: any;

@Component({
  selector: 'app-ifta-reports',
  templateUrl: './ifta-reports.component.html',
  styleUrls: ['./ifta-reports.component.scss']
})
export class IFTAReportsComponent implements OnInit {
  @ViewChild("lineChart", { static: false }) lineChart: any;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: any = {};
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  
  activeTab: string = 'newreports';

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if(tab=="reports"){
      $(".selectedDownloadBtn").css("display", "block");
      $(".selectedDownloadBtn").prop("disabled", true);
    }else{
      $(".selectedDownloadBtn").css("display", "none");
    }
  }

  RefreshPage(){
    window.location.reload();
  }

  Highcharts: typeof Highcharts = Highcharts; // required
  
  dwChart1Data: any[] = [];
  // dwChart1Data: any[] = [
  //   { barPercentage: .4, data: [27, 12, 26, 15], label: 'Facebook' }
  // ];
  dwChart1Labels: string[] = []; 

  dwChart1Options: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      text: 'IFTA Graph', // Set the title text
      fontSize: 16, // Adjust size if needed
      fontColor: '#333', // Change color if needed
      position: 'top', // Ensure it's displayed at the top
    },
    legend: {
      display: false,
      labels: {
      fontColor: '#ddd',  
      boxWidth:40
      }
    },
    // tooltips: {
    //   enabled:true,
    //   displayColors:true,
    // },
    // tooltips: {
    //   mode: 'index', // Ensures all datasets are shown together on hover
    //   intersect: false,
    //   callbacks: {
    //     label: function(tooltipItem, data) {
    //       let datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
    //       let value = tooltipItem.yLabel;
    //       return `${datasetLabel}: ${value}`;
    //     }
    //   }
    // },
    tooltips: {
      mode: 'index', // Ensures all relevant values are shown in the tooltip
      intersect: false,
      callbacks: {
        label: function(tooltipItem, data) {
          let label = `${data.datasets[tooltipItem.datasetIndex].label}: ${tooltipItem.value}`;
          let gpsValue = this.stateGpsKm[tooltipItem.index] || 0; // Fetch corresponding GPS value
          return [label, `GPS: ${gpsValue}`]; // Show both Odometer & GPS in tooltip
        }.bind(this) // Bind this to access `stateGPS`
      }
    },
    scales: {
      xAxes: [{
        display: true,
        stacked: true,
        
      ticks: {
        beginAtZero:true,
        fontColor: '#000000'
      },
      gridLines: {
        display: false ,
        color: "#fffff"
      },
    }],
     yAxes: [{
        stacked: true,
        display: true,
        ticks: {
          beginAtZero:false,
          fontColor: '#fffff'
        },
        gridLines: {
          display: false ,
          color: "rgba(221, 221, 221, 0.08)"
        },
      }]
     }
  };

  dwChart1Colors: Array<any> = [
    {
      backgroundColor: ["#4B0082","#800000","#8B008B","#A52A2A","#FF0000","#FF00FF","#00C851","#FFD700","#808000","#191970","#006400","#000080","#1E90FF","#2F4F4F","#8A2BE2","#A0522D","#C71585","#FA8072","#FF4500","#DA70D6","#DB7093","#663399","#B22222","#FF6347","#20B2AA","#0000CD","#4169E1","#D2691E","#00CED1","#3CB371","#556B2F","#778899","#B8860B","#6495ED","#3d2610","#ce40ce","#ce6440","#e1872d","#0f001a","#ca80ff"],
    },
    {
      backgroundColor: ["#4B0082","#800000","#8B008B","#A52A2A","#FF0000","#FF00FF","#00C851","#FFD700","#808000","#191970","#006400","#000080","#1E90FF","#2F4F4F","#8A2BE2","#A0522D","#C71585","#FA8072","#FF4500","#DA70D6","#DB7093","#663399","#B22222","#FF6347","#20B2AA","#0000CD","#4169E1","#D2691E","#00CED1","#3CB371","#556B2F","#778899","#B8860B","#6495ED","#3d2610","#ce40ce","#ce6440","#e1872d","#0f001a","#ca80ff"],
    },
  ];

  dwChart1Legend = false;
  dwChart1Type = 'horizontalBar';

  constructor(
    public sidebarservice: SidebarService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private request : RequestService,
    public datePipe: DatePipe,
  ) { }

  iftaForm:any={}

  public chartHovered(e: any): void {
    //your code here
  }

  async chartClicked(e:any) {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if ( activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        console.log(chart.data.datasets);
        const value = chart.data.datasets[0].data[clickedElementIndex];
        const labelValue = chart.data.datasets[0].label;
        console.log(clickedElementIndex, label, value,labelValue);
        
     }
  }
}

  ngOnInit(){
    $(".selectedDownloadBtn").css("display", "none");
    $("#fromDate").val(this.datePipe.transform(new Date(),"yyyy-MM-dd"));
    $("#toDate").val(this.datePipe.transform(new Date(),"yyyy-MM-dd"));
    this.getAllTruckNo();
    this.IftaGeneratedSummaryReport();
  }

  iftaSummaryReports=[];
  iftaRowData;
  async IftaGeneratedSummaryReport(){
    try {
      this.isLoading = true;
      const ifta= {
        'clientId':Number(localStorage.getItem("clientId")),
      };
      console.log(ifta);
      const data: any = await this.request.post('/dispatch/view_ifta_generated_summary_report',ifta);
      console.log(data);
      this.iftaSummaryReports=[];
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.iftaSummaryReports.push(dataObj[objKey1]);
          } 
        }				
      }
      this.iftaRowData = this.iftaSummaryReports;
      this.isLoading = false;
      this.rerender();
    } catch (error) {}
  }

  selectedValues: string[] = [];
  SelectAllIftaReport(evt){
    const checkbox = evt.target as HTMLInputElement;
    // alert(checkbox.checked);
    if (checkbox.checked) {
      this.iftaRowData.forEach(iftaData => {
        this.selectedValues = this.selectedValues.filter(v => v !== iftaData);
        this.selectedValues.push(iftaData);
      });
    }else{
      this.iftaRowData.forEach(iftaData => {
        this.selectedValues = this.selectedValues.filter(v => v !== iftaData);
      });
    }
    if(this.selectedValues.length>0){
      $(".selectedDownloadBtn").prop("disabled", false);
    }else{
      $(".selectedDownloadBtn").prop("disabled", true);
    }
    console.log(this.selectedValues);
  }

  onCheckboxChange(evt,iftaData){
    const checkbox = evt.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedValues.push(iftaData);
    } else {
      this.selectedValues = this.selectedValues.filter(v => v !== iftaData);
    }
    // console.log(this.selectedValues.length);
    if(this.selectedValues.length>0){
      $(".selectedDownloadBtn").prop("disabled", false);
    }else{
      $(".selectedDownloadBtn").prop("disabled", true);
    }
    console.log(this.selectedValues);
  }

  pdfUrls =[];
  csvUrls=[];
  SelectedDownloadIftaReport(){
    // console.log(this.selectedValues);
    this.pdfUrls=[];
    this.csvUrls = [];
    try{
      // this.selectedValues.forEach(item => {
      //   let sUrl = environment.apiUploadUrl+`/uploads/ifta_reports/${item.fileName}`;
      //   this.pdfUrls.push(sUrl);
      // });
      for(let i=0;i<this.selectedValues.length;i++){
        const item = this.selectedValues[i] as any; 
        // console.log(item.fileName);
        let sUrl = environment.apiUploadUrl+`/uploads/ifta_reports/${item.fileName}`;
        let csvUrl = environment.apiUploadUrl+`/uploads/ifta_reports/${item.fileName.replace('.pdf','.csv')}`;

        this.pdfUrls.push(sUrl);
         this.csvUrls.push(csvUrl);
      }
      // console.log(this.pdfUrls);
      this.downloadAndZipPdfs(this.pdfUrls,this.csvUrls);
    } catch(error){}
    
  }

  downloadAndZipPdfs(pdfList: string[], csvList: string[]) {

    const zip = new JSZip();
    const folder = zip.folder('IFTA_Reports');

    const downloadPromises: Promise<any>[] = [];

    // PDF files
    pdfList.forEach((fileUrl, index) => {

      const promise = this.http.get(fileUrl, { responseType: 'blob' })
        .toPromise()
        .then(blob => {

          const fileName = `IFTA_Report_${index + 1}.pdf`;
          folder?.file(fileName, blob);

        })
        .catch(() => {
          console.error('Failed to download PDF:', fileUrl);
        });

      downloadPromises.push(promise);
    });

    // CSV files
    csvList.forEach((fileUrl, index) => {

      const promise = this.http.get(fileUrl, { responseType: 'blob' })
        .toPromise()
        .then(blob => {

          const fileName = `IFTA_Report_${index + 1}.csv`;
          folder?.file(fileName, blob);

        })
        .catch(() => {
          console.error('Failed to download CSV:', fileUrl);
        });

      downloadPromises.push(promise);
    });

    Promise.all(downloadPromises).then(() => {

      zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, 'IFTA_Reports.zip');
      });

    });

  }

  downloadAndZipPdfs_old(fileList: string[]) {
    const zip = new JSZip();
    const folder = zip.folder('IFTA_PDFs');

    const downloadPromises = fileList.map((fileUrl, index) => {
      return this.http.get(fileUrl, { responseType: 'blob' }).toPromise().then(blob => {
        const fileName = `IFTA_Report_${index + 1}.pdf`;
        folder?.file(fileName, blob);
      }).catch(() => {
        console.error('Failed to download:', fileUrl);
      });
    });

    Promise.all(downloadPromises).then(() => {
      zip.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, 'IFTA_Reports.zip');
      });
    });
  }

  downloadFile(fileName: string) {
    const url = environment.apiUploadUrl+`/uploads/ifta_reports/${fileName}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  DownloadIftaGeneratedReport(iftaData){
    // console.log(iftaData);
    // let url = environment.apiUploadUrl+"/uploads/ifta_reports/"+iftaData.fileName;
    // window.open(url);

    this.downloadFile(iftaData.fileName).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // a.download = iftaData.fileName;
      a.download = "IFTA_Report.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    });

    const csvFile = iftaData.fileName.replace(".pdf", ".csv");
    // CSV download
    this.downloadFile(csvFile).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "IFTA_Report.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    });
    
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

  vehicleId=0;
  vehicleName="";
  GetDeviceName(vehicleName,vehicleId){
    this.vehicleId = vehicleId;
    this.vehicleName = vehicleName;
  }

  iftaReportData=[];
  rowData;
  carrierName;
  vehicleMake;
  vehicleVin;
  vehicleModel;
  manufacturingYear;
  isShowReport=false;
  periodTime;
  reportGenerateDate;
  isLoading=false;
  async GenerateIftaReport(){
    this.isShowReport=true;
    this.isLoading=true;
    let vehiceId = this.vehicleId;
    let fromDate = $("#fromDate").val();
    let toDate = $("#toDate").val();
    // $("#periodTime").html(fromDate+" To "+toDate);
    this.periodTime = fromDate+" To "+toDate;
    // alert(" >> "+fromDate);
    $("#reportGenerateDate").html(this.datePipe.transform(new Date(),"yyyy/MM/dd HH:mm:ss a"));
    this.reportGenerateDate = this.datePipe.transform(new Date(),"yyyy/MM/dd HH:mm:ss a");
    try {
			const data = {
        'vehicleId': vehiceId,
        'fromDate':this.datePipe.transform(fromDate+" 00:00:00","yyyy-MM-dd HH:mm:ss"),
        'toDate':this.datePipe.transform(toDate+" 23:59:59","yyyy-MM-dd HH:mm:ss"),
        'clientId':Number(localStorage.getItem("clientId")),
        // 'isGenerated':0
			};
			const vehicleData: any = await this.request.post('/dispatch/view_ifta_report/',data);
			this.iftaReportData=[];	
			for (let objKey of Object.keys(vehicleData)) {
				let dataObj = vehicleData[objKey];
				if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            // console.log(dataObj[objKey1]);
            this.carrierName = dataObj[objKey1].carrierName;
            this.vehicleMake = dataObj[objKey1].make;
            this.vehicleVin = dataObj[objKey1].vin;
            this.vehicleModel = dataObj[objKey1].model;
            this.manufacturingYear = dataObj[objKey1].manufacturingYear;
            // dataObj[objKey1].firstOdometer = dataObj[objKey1].firstOdometer.toFixed(2);
            // dataObj[objKey1].lastOdometer = dataObj[objKey1].lastOdometer.toFixed(2);
            this.iftaReportData.push(dataObj[objKey1]);
          }
				}
			}
      this.rowData = this.iftaReportData;
      this.isLoading=false;
		} catch (error) {}

    await new Promise(resolve => setTimeout(() => resolve(this.PrintIftaReport()), 2000));

    // console.log(" >> "+vehiceId+" :: "+fromDate+" :: "+toDate);

  }

  PrintIftaReport(){
    let printContents = document.getElementById("iftaReportSection").innerHTML;
    document.body.innerHTML = printContents;
    document.title="IFTA Report";
    window.print();
    window.location.reload();
    this.isShowReport=false;
  }

  isShowReportGraph=false;
  stateNameObj=[];
  stateOdometer=[];
  stateGpsKm=[];
  isUpdatedRecord;
  message;
  iftaRowDataGenerated;
  async ShowIftaReport(){
    // this.isShowReportGraph=true;
    this.isLoading=true;
    this.stateNameObj=[];
    this.stateOdometer=[];
    this.iftaReportData=[];	
    this.stateGpsKm=[];
    this.iftaRowDataGenerated="";
    this.isUpdatedRecord="";
    this.message="";
    let vehiceId = this.vehicleId;
    let fromDate = $("#fromDate").val();
    let toDate = $("#toDate").val();
    // $("#periodTime").html(fromDate+" To "+toDate);
    this.periodTime = fromDate+" To "+toDate;
    // alert(" >> "+fromDate);
    $("#reportGenerateDate").html(this.datePipe.transform(new Date(),"yyyy/MM/dd HH:mm:ss a"));
    this.reportGenerateDate = this.datePipe.transform(new Date(),"yyyy/MM/dd HH:mm:ss a");
    try {
			const data = {
        'vehicleId': vehiceId,
        'fromDate':this.datePipe.transform(fromDate+" 00:00:00","yyyy-MM-dd HH:mm:ss"),
        'toDate':this.datePipe.transform(toDate+" 23:59:59","yyyy-MM-dd HH:mm:ss"),
        'clientId':Number(localStorage.getItem("clientId")),
        // 'isGenerated':1
			};
      console.log(data);
			const vehicleData: any = await this.request.post('/dispatch/view_ifta_report/',data);
			for (let objKey of Object.keys(vehicleData)) {
				let dataObj = vehicleData[objKey];

        this.isUpdatedRecord = vehicleData.status;
        this.message = vehicleData.message;
        
        console.log(vehicleData);

        if (this.isUpdatedRecord=="FAIL") {
          const result = await Swal.fire({
            title: 'Report Generated',
            text: this.message, 
            type: 'warning',
            showConfirmButton: true,  
            // timer: 1500,
            confirmButtonText: 'Ok'
          });
          this.isLoading=false;
          return;
          // window.location.reload();
        }else{
          if(objKey=="result"){
            for (let objKey1 of Object.keys(dataObj)) {
              // console.log(dataObj[objKey1]);
              let stateName = dataObj[objKey1].stateName+" ("+dataObj[objKey1].stateCode+")";
              this.stateNameObj.push(stateName);
              // let odometer = dataObj[objKey1].lastOdometer-dataObj[objKey1].firstOdometer;
              let odometer = dataObj[objKey1].totalOdometer;
              this.stateOdometer.push(odometer);
              this.stateGpsKm.push(dataObj[objKey1].gpsKm);
              this.carrierName = dataObj[objKey1].carrierName;
              this.vehicleMake = dataObj[objKey1].make;
              this.vehicleVin = dataObj[objKey1].vin;
              this.vehicleModel = dataObj[objKey1].model;
              this.manufacturingYear = dataObj[objKey1].manufacturingYear;
              // dataObj[objKey1].firstOdometer = dataObj[objKey1].firstOdometer.toFixed(2);
              // dataObj[objKey1].lastOdometer = dataObj[objKey1].lastOdometer.toFixed(2);
              this.iftaReportData.push(dataObj[objKey1]);
              this.iftaRowDataGenerated = dataObj[objKey1];
            }
          }
        }
				
			}
      this.rowData = this.iftaReportData;
      this.isLoading=false;
      this.isShowReportGraph=true;
      // console.log(this.stateNameObj);
      // console.log(this.stateOdometer);
      this.dwChart1Labels = this.stateNameObj;
      this.dwChart1Data = [
        { barPercentage: .4, data:this.stateOdometer, label: 'Odometer (Miles)'},
        // { barPercentage: .4, data:this.stateGpsKm, label: 'GPS (Miles)'},
      ];
      
		} catch (error) {}
  }

  DownloadChart(iftaRowDataGenerated) {
    // this.GenerateIftaReport();
    this.DownloadIftaGeneratedReport(iftaRowDataGenerated);
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