import { Component, OnInit, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as chartsData from '../../shared/data/chartjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { RequestService } from 'src/services/request.service';
import { MasterService } from 'src/services/master.service';
import * as Prism from 'prismjs';
// import * as $ from 'jquery';
// import 'datatables.net';
import { from, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChartDataSets, ChartElementsOptions, ChartLineOptions } from 'chart.js';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
// import { CanvasJSChart } from '@canvasjs/angular-charts';
import * as CanvasJS from 'src/assets/js/canvasjs.min.js';
import { filter } from 'rxjs/operators';


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

@Component({
  selector: 'app-log-driver',
  templateUrl: './log-driver.component.html',
  styleUrls: ['./log-driver.component.scss']
})
export class LogDriverComponent implements OnInit {

  statusFilter: string = 'All';

  get filteredRowData() {
    if (!this.rowData) return [];
    if (this.statusFilter === 'All') {
      return this.rowData;
    } else if (this.statusFilter === 'Active') {
      return this.rowData.filter(item => item.isInactive !== 1);
    } else if (this.statusFilter === 'Inactive') {
      return this.rowData.filter(item => item.isInactive === 1);
    }
    return this.rowData;
  }

  @ViewChild("lineChart", { static: false }) lineChart: any;

  parseLocalDate(dateInput: any): Date {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) return dateInput;
    if (typeof dateInput === 'number') return new Date(dateInput);

    const dateStr = String(dateInput).trim();
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateOnlyRegex.test(dateStr)) {
      const parts = dateStr.split('-');
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    return new Date(dateStr);
  }

  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  //chartOptions: Highcharts.Options = { ... }; // required
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  highcharts = Highcharts;
  chartOptions = {
    chart: {
      zoomType: 'x',
      data: {
        type: 'line',

      },
      // {
      //   type: "rangeColumn",
      //   color: "black",
      //   xValueFormatString: "ss:fff",
      //   toolTipContent: null
      // },

    },
    title: {
      text: "Driver Working Status"
    },
    subtitle: {
      text: "Test"
    },
    xAxis: {
      // categories: ['1 Hr','2 Hr','3 Hr','4 Hr','5 Hr','6 Hr','7 Hr','8 Hr','9 Hr','10 Hr','11 Hr','12 Hr','13 Hr','14 Hr','15 Hr','16 Hr','17 Hr','18 Hr','19 Hr','20 Hr','21 Hr','22 Hr','23 Hr','24Hr'], 
      categories: ['1 Hr', '1:30 Hr', '2 Hr', '2:30 Hr', '3 Hr', '3:30 Hr', '4 Hr', '4:30 Hr', '5 Hr', '5:30 Hr', '6 Hr', '6:30 Hr', '7 Hr', '7:30 Hr', '8 Hr', '8:30 Hr', '9 Hr', '9:30 Hr', '10 Hr', '10:30 Hr', '11 Hr', '11:30 Hr', '12 Hr', '12:30 Hr', '13 Hr', '13:30 Hr', '14 Hr', '14:30 Hr', '15 Hr', '15:30 Hr', '16 Hr', '16:30 Hr', '17 Hr', '17:30 Hr', '18 Hr', '18:30 Hr', '19 Hr', '19:30 Hr', '20 Hr', '20:30 Hr', '21 Hr', '21:30 Hr', '22 Hr', '22:30 Hr', '23 Hr', '23:30 Hr', '24Hr'],
      //categories: ['0:15 Hr','0:30 Hr','0:45 Hr','1 Hr','1:15 Hr','1:30 Hr','1:45 Hr','2 Hr','2:15 Hr','2:30 Hr','2:45 Hr','3 Hr','3:15 Hr','3:30 Hr','3:45 Hr','4 Hr','4:15 Hr','4:30 Hr','4:45 Hr','5 Hr','5:15 Hr','5:30 Hr','5:45 Hr','6 Hr','6:15 Hr','6:30 Hr','6:45 Hr','7 Hr','7:15 Hr','7:30 Hr','7:45 Hr','8 Hr','8:15 Hr','8:30 Hr','8:45 Hr','9 Hr','9:15 Hr','9:30 Hr','9:45 Hr','10 Hr','10:15 Hr','10:30 Hr','10:45 Hr','11 Hr','11:15 Hr','11:30 Hr','11:45 Hr','12 Hr','12:15 Hr','12:30 Hr','12:45 Hr','13 Hr','13:15 Hr','13:30 Hr','13:45 Hr','14 Hr','14:15 Hr','14:30 Hr','14:45 Hr','15 Hr','15:15 Hr','15:30 Hr','15:45 Hr','16 Hr','16:15 Hr','16:30 Hr','16:45 Hr','17 Hr','17:15 Hr','17:30 Hr','17:45 Hr','18 Hr','18:15 Hr','18:30 Hr','18:45 Hr','19 Hr','19:15 Hr','19:30 Hr','19:45 Hr','20 Hr','20:15 Hr','20:30 Hr','20:45 Hr','21 Hr','21:15 Hr','21:30 Hr','21:45 Hr','22 Hr','22:15 Hr','22:30 Hr','22:45 Hr','23 Hr','23:15 Hr','23:30 Hr','23:45 Hr','24Hr'], //96 count

      title: {
        text: null,
      },
      //startOnTick: true,
      min: 0,
      // max: 53, // max pointer value in data set to show on x axis is (53-54)
      max: 1439,
      // max:25,
      // offset:4,
    },
    yAxis: [
      // { // Primary yAxis
      //   labels: {
      //       format: '00:00',
      //   },
      //   // categories: ["-","On Duty", "Drive", "Sleep", "Off Duty"],
      //   min: 1,
      //   max: 4,
      //   opposite: true
      // },
      {

        //  categories: ["-","On Duty", "Drive", "Break", "Sleep", "Off Duty","Voilation"],
        categories: ["-", "On Duty", "Drive", "Sleep", "Off Duty"],
        // categories: ["-","On Duty", "On Drive", "OnBreak-Sleep", "OnBreak-Offduty", "OnBreak-Onduty","On Sleep","Off Duty"],
        min: 1,
        max: 4,
        title: false,
      }],
    tooltip: {
      // valueSuffix:" °C"
      enabled: true,
      // valueDecimals: 2,
      // pointFormat: "Hello Data.."
      formatter: function () {
        // console.log(this);
        return "<b>Time : </b>" + this.x + "<br> <b>Status : </b>" + this.series.yAxis.categories[this.y];
      }
    },
    series: [],
    exporting: {
      enabled: true,
      showTable: false,
      fileName: "line-chart",
      buttons: {
        contextButton: {
          menuItems: ["downloadSVG", "downloadPNG", "downloadPDF", "downloadJPEG"]
        }
      }
    }
  };

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: any = {};
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  logDriverForm: any = {};

  constructor(
    private request: RequestService,
    private master: MasterService,
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private datePipe: DatePipe
  ) { }

  employeeId: any;
  CLIENT_ID = 0;
  dateTime = "";
  isEditing = false;
  jsonEditingData;
  logStatus = ["OnDuty", "OnDrive", "OnSleep", "OffDuty", "PersonalUse", "YardMove", "Engine On", "Engine Off",
    "Login", "Logout", "Malfunction Logged", "Malfunction Cleared", "Diagnostic Logged", "Diagnostic Cleared",
    "OndutyNotDrivering", "Engine synchronization data diagnostic", "Engine synchronization data diagnostic (cleared)"];
  logStatusDetails = [];
  logStatusDataArr;
  logOrigin = ["Driver", "Auto", "Intermediate w/ CLP", "Unidentified"];
  logOriginDetails = [];
  logOriginDataArr;
  refreshTime;
  maxDateSelected;
  userTypeId = 0;
  ngOnInit() {
    this.RefreshData();
    this.viewDate();
    this.getAllTruckNo();
    this.getAllDriverName();
    this.employeeId = Number(this.activatedRoute.snapshot.params.employeeId);
    this.dateTime = this.activatedRoute.snapshot.params.datetime;
    this.logDriverForm.isCheckedValue = 1;
    $("#logDateTime").val(this.dateTime);
    $("#newLogUpdateDateTime").val(this.datePipe.transform(this.dateTime, "yyyy-MM-ddTHH:mm:ss"));
    // alert(" >> "+this.employeeId+" : "+this.dateTime);
    this.CLIENT_ID = Number(localStorage.getItem("clientId"));
    this.ShowUserWiseLogReport();
    //this.ShowDLogReport(this.employeeId,this.dateTime);
    //this.ShowDLogReportPreviousDay(this.employeeId,this.dateTime);
    this.ShowTableAndDate();
    //alert(" >> "+this.dateTime+" >> "+this.employeeId);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.maxDateSelected = this.datePipe.transform(tomorrow, 'yyyy-MM-dd');

    if (this.dateTime == this.datePipe.transform(tomorrow, 'yyyy-MM-dd')) {
      $("#nextDateButton").attr('disabled', true);
    } else {
      $("#nextDateButton").removeAttr('disabled');
    }

    this.master.getJsonData().subscribe(data => {
      if (data) {
        this.jsonEditingData = data;
        // console.log(this.jsonEditingData.isEditing);
        if (this.jsonEditingData.isEditing == 1) {
          console.log("here");
          this.isEditing = true;
        } else {
          this.isEditing = false;
        }
      } else {
        this.isEditing = false;
      }
    });

    for (let i = 0; i < this.logStatus.length; i++) {
      let arr = {
        id: this.logStatus[i],
        logStatus: this.logStatus[i]
      };
      this.logStatusDetails.push(arr);
    }
    this.logStatusDataArr = this.logStatusDetails;

    for (let i = 0; i < this.logOrigin.length; i++) {
      let arr = {
        id: this.logOrigin[i],
        logOrigin: this.logOrigin[i]
      };
      this.logOriginDetails.push(arr);
    }
    this.logOriginDataArr = this.logOriginDetails;

    this.userTypeId = Number(localStorage.getItem("userTypeId"));
    if (this.userTypeId == 2 || this.userTypeId == 3) {
      setTimeout(() => this.hideRestrictedElements(), 100);
      // this.hideRestrictedElements();

    }

  }

  hideRestrictedElements() {
    // alert("here...");
    const restrictedElements = document.querySelectorAll('.restricted-access');
    restrictedElements.forEach((el: any) => {
      el.style.display = 'none';
    });
  }

  vehicleDataObj = [];
  vehicleDataArr;
  async getAllTruckNo() {
    try {
      const vehicle = {
        'vehicleId': 0,
        'clientId': Number(localStorage.getItem("clientId")),
      };
      const vehicleData: any = await this.request.post('/master/view_vehicle/', vehicle);
      this.vehicleDataObj = [];
      for (let objKey of Object.keys(vehicleData)) {
        let dataObj = vehicleData[objKey];
        if (objKey == "result") {
          for (let objKey1 of Object.keys(dataObj)) {
            // this.designationDataObj.push(dataObj[objKey1]);
            let arr = {
              id: dataObj[objKey1].vehicleId,
              vehicleNo: dataObj[objKey1].vehicleNo,
            };
            this.vehicleDataObj.push(arr);
          }
        }
      }
      this.vehicleDataArr = this.vehicleDataObj;
    } catch (error) { }
  }

  RefreshData() {
    //  alert("here");
    let isChecked = $('#refreshBtn').is(':checked');
    if (isChecked) {
      // alert("refresh");
      this.ShowTableAndDate();
    } else {
      // alert("not refresh");
    }
  }


  ShowEmployeeDetailsBackOnWorkingDetail(employeeId) {
    // alert(">> "+employeeId);
    // console.log(employeeId);
    this.router.navigate(['/form/working-detail/' + this.employeeId]);
  }

  driverDataObj = [];
  driverDataArr;
  async getAllDriverName() {
    try {
      this.driverDataObj = [];
      let arr = {
        id: 0,
        employeeName: "No Driver",
      };
      this.driverDataObj.push(arr);
      const employee = {
        'clientId': Number(localStorage.getItem("clientId")),
      };
      const employeeData: any = await this.request.post('/master/view_employee_first_login/', employee);
      for (let objKey of Object.keys(employeeData)) {
        let dataObj = employeeData[objKey];
        if (objKey == "result") {
          for (let objKey1 of Object.keys(dataObj)) {
            // this.designationDataObj.push(dataObj[objKey1]);
            if (this.employeeId != dataObj[objKey1].employeeId) {
              arr = {
                id: dataObj[objKey1].employeeId,
                employeeName: dataObj[objKey1].firstName + " " + dataObj[objKey1].lastName,
              };
              this.driverDataObj.push(arr);
            }

          }
        }
      }
      this.driverDataArr = this.driverDataObj;
    } catch (error) { }
  }

  GetDriverLogData() {
    this.dateTime = this.datePipe.transform($("#logDateTime").val(), "yyyy-MM-dd");
    this.router.navigate(['/form/log-driver/' + this.employeeId + "/" + this.dateTime]);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (this.dateTime == this.datePipe.transform(tomorrow, 'yyyy-MM-dd')) {
      $("#nextDateButton").attr('disabled', true);
    } else {
      $("#nextDateButton").removeAttr('disabled');
    }
    this.ShowUserWiseLogReport();
    this.ShowTableAndDate();
  }

  async AddNewDriverLog() {
    try {
      var checkboxValue = $('#newLogIsActive').prop('checked') ? 1 : 0; 
      // alert(checkboxValue);
      const dateTimeString = this.datePipe.transform($("#newLogUpdateDateTime").val(), "yyyy-MM-dd HH:mm:ss");
      const dLog = {
        // 'statusId':Number($("#newLogStatusId").val()),
        'statusId': Number(this.logDriverForm.newLogStatusId),
        'dateTime': dateTimeString,
        'status': this.logDriverForm.newLogStatus,
        'vehicleId': Number(this.logDriverForm.newLogVehicleNo),
        'driverId': Number(this.employeeId),
        'customLocation': $("#newLogPlaceAddress").val(),
        'currentLocation': $("#newLogPlaceAddress").val(),
        'note': $("#newLogNotes").val(),
        'clientId': Number(this.CLIENT_ID),
        'lattitude': Number($("#newLogLattitude").val()),
        'longitude': Number($("#newLogLongitude").val()),
        'logType': "log",
        'utcDateTime': 0,
        // 'utcDateTime':new Date(dateTimeString!).getTime(), // "!" ensures non-null for TypeScript
        'appVersion': "1.0",
        'osVersion': 'app',
        'isVoilation': 0,
        'engineHour': $("#newLogEngineHour").val(),
        'engineStatus': "Off",
        'origin': "",
        'odometer': $("#newLogOdometer").val(),
        'isActive': checkboxValue
      };
      console.log(dLog);
      const save: any = await this.request.post('/dispatch/add_drivering_status_from_web', dLog);
      console.log(save);
      for (let objKey of Object.keys(save)) {
        let dataObj = save[objKey];
        if (objKey == "status") {
          this.isUpdatedRecord = save[objKey];
        }
        if (objKey == "message") {
          this.message = save[objKey];
        }
      }
      if (this.isUpdatedRecord == "SUCCESS") {
        // alert("Save Successfully");
        const result = await Swal.fire({
          title: 'Successfully Saved',
          text: 'Saved Changes.',
          type: 'success',
          showConfirmButton: false,
          timer: 1500
          // confirmButtonText: 'Ok'
        });
        if (result.value) {
          // Form Reset
          window.location.reload();
        }
        window.location.reload();
      } else {
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

    } catch (error) { }
  }

  selectedFile: File | null = null;
  onFileChange(event: any) {
    // alert("here");
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.logDriverForm.signatureFileName = file.name;
      // alert(this.logDriverForm.signatureFileName);
    }
  }

  async SaveCertifiedLogLive() {
    this.trailerDataArray = [];
    this.shippingDocsDataArray = [];
    this.trailerDataArray.push($("#logtrailer").val());
    this.shippingDocsDataArray.push($("#logShippingDocs").val());

    let timestamp: any;
    if (this.datePipe.transform(this.dateTime, "yyyy-MM-dd") ==
      this.datePipe.transform(new Date(), "yyyy-MM-dd")) {
      timestamp = new Date().getTime();
    } else {
      // let d = new Date(this.dateTime);
      let d = this.parseLocalDate(this.dateTime);
      d.setHours(23, 59, 59, 999);
      timestamp = d.getTime();
    }

    const formData = new FormData();
    formData.append('coDriverId', this.logDriverForm.certifiedDriverId);
    formData.append('driverId', this.employeeId);
    formData.append('tokenNo', "qwerty");
    formData.append('vehicleId', this.VEHICLE_ID);
    formData.append('certifiedDate', this.datePipe.transform(this.dateTime, "yyyy-MM-dd") || '');
    formData.append('trailers', JSON.stringify(this.trailerDataArray));
    formData.append('shippingDocs', JSON.stringify(this.shippingDocsDataArray));
    formData.append('certifiedDateTime', timestamp);
    formData.append('certifiedAt', new Date().getTime().toString());

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    try {

      const save: any = await this.request.post('/dispatch/add_certified_log_from_web', formData);
      // console.log(save);
      for (let objKey of Object.keys(save)) {
        let dataObj = save[objKey];
        if (objKey == "status") {
          this.isUpdatedRecord = save[objKey];
        }
        if (objKey == "message") {
          this.message = save[objKey];
        }
      }
      if (this.isUpdatedRecord == "SUCCESS") {
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
        }
        window.location.reload();
      } else {
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

    } catch (err) {
      console.error(err);
    }
  }

  trailerDataArray: string[] = [];
  shippingDocsDataArray: string[] = [];
  async UpdateDriverCertifiedLog() {
    this.trailerDataArray = [];
    this.shippingDocsDataArray = [];
    this.trailerDataArray.push($("#logtrailer").val());
    this.shippingDocsDataArray.push($("#logShippingDocs").val());

    const cLog = {
      'certifiedLogId': $("#certifiedLogId").val(),
      'coDriverId': this.logDriverForm.certifiedDriverId,
      'trailers': this.trailerDataArray,
      'shippingDocs': this.shippingDocsDataArray,
      'certifiedSignature': $("#signatureFileName").val(),
    };
    // console.log(cLog);
    const save: any = await this.request.post('/dispatch/update_certified_log_with_co_driver', cLog);
    console.log(save);
    for (let objKey of Object.keys(save)) {
      let dataObj = save[objKey];
      if (objKey == "status") {
        this.isUpdatedRecord = save[objKey];
      }
      if (objKey == "message") {
        this.message = save[objKey];
      }
    }
    if (this.isUpdatedRecord == "SUCCESS") {
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
      }
      window.location.reload();
    } else {
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
  }

  async RemoveVoilations() {
    let cDate = this.datePipe.transform(this.dateTime, 'yyyy-MM-dd');
    this.fromDate = this.datePipe.transform(this.dateTime + " 00:00:00", 'yyyy-MM-dd HH:mm:ss');
    this.toDate = this.datePipe.transform(this.dateTime + " 23:59:59", 'yyyy-MM-dd HH:mm:ss');
    //alert(this.fromDate+" :: "+this.toDate);

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
      const dlog = {
        'driverId': this.employeeId,
        'fromDate': this.fromDate,
        'toDate': this.toDate,
      };
      const allow: any = await this.request.post('/dispatch/delete_voilation_by_date/', dlog);
      if (allow) {
        // Successfully Deleted
        Swal.fire(
          'Deleted!',
          'All Voilation Status has been deleted.',
          'success'
        );
        // Reload DataTable
        window.location.reload();
      } else {
        Swal.fire(
          'Error!'
        );
      }
    }

  }

  currentDate;
  getdtRange() {
    var dtRange = [];
    for (var j = 0; j < 4; j++) {
      for (var i = 0; i < 24; i++) {
        var dt = new Date("2024-05-26");
        var item = {
          x: new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            this.currentDate.getDate(),
            i,
            15
          ),
          y: [j, j + 0.3],
        };
        dtRange.push(item);
        var item = {
          x: new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            this.currentDate.getDate(),
            i,
            30
          ),
          y: [j, j + 0.5],
        };
        dtRange.push(item);
        var item = {
          x: new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            this.currentDate.getDate(),
            i,
            45
          ),
          y: [j, j + 0.3],
        };
        dtRange.push(item);
      }
    }

    return dtRange;
  }

  GetLevel(label) {
    switch (label) {

      case "OFF_DUTY":
        return 3.5;
        break;
      case "SLEEP":
        return 2.5;
        break;
      case "DRIVE":
        return 1.5;
        break;
      case "START_DUTY":
        return .5;
        break;

      default:
        return 3.5;
    }
  }

  GetColor(label) {
    switch (label) {
      case "DRIVE":
        return "GREEN";
        break;
      case "START_DUTY":
        return "BLUE";
        break;
      case "SLEEP":
        return "BLACK";
        break;
      case "OFF_DUTY":
        return "ORANGE";
        break;

      default:
        return "GREY";
    }
  }

  getDateTime(mDate) {
    var now = new Date(mDate);
    // console.log("getDateTime" + now);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    // console.log(year+" :: "+month+" :: "+day);
    let sMonth, sDay, sHour, sMinute, sSecond;
    if (month.toString().length == 1) {
      sMonth = '0' + month;
    } else {
      sMonth = month;
    }
    if (day.toString().length == 1) {
      sDay = '0' + day;
    } else {
      sDay = day;
    }
    if (hour.toString().length == 1) {
      sHour = '0' + hour;
    } else {
      sHour = hour;
    }
    if (minute.toString().length == 1) {
      sMinute = '0' + minute;
    } else {
      sMinute = minute;
    }
    if (second.toString().length == 1) {
      sSecond = '0' + second;
    } else {
      sSecond = second;
    }
    var dateTime = year + '-' + sMonth + '-' + sDay + ' ' + sHour + ':' + sMinute + ':' + sSecond;
    // console.log(" >> "+dateTime);
    return dateTime;
  }

  getDate() {
    var now = new Date(this.currentDate);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    let sMonth, sDay, sHour, sMinute, sSecond;
    if (month.toString().length == 1) {
      sMonth = '0' + month;
    }
    if (day.toString().length == 1) {
      sDay = '0' + day;
    }
    if (hour.toString().length == 1) {
      sHour = '0' + hour;
    }
    if (minute.toString().length == 1) {
      sMinute = '0' + minute;
    }
    if (second.toString().length == 1) {
      sSecond = '0' + second;
    }
    var dateTime = year + '-' + sMonth + '-' + sDay;
    return dateTime;
  }

  endTime;
  startTime;
  calculateTotalTime(value) {
    // Parse the JSON string into an array if necessary
    // console.log(value);
    const data = value;
    // console.log(JSON.stringify(data));
    // Initialize an object with all possible labels and set them to "0:00"
    const labelTime = {
      START_DUTY: "0:00",
      DRIVE: "0:00",
      SLEEP: "0:00",
      OFF_DUTY: "0:00"
    };


    // Check if the first record has an 'x' start time from a previous day compared to the second record's event_end_time
    if (data.length > 1) {
      const firstRecord = data[0];
      const secondRecord = data[1];

      // console.log(secondRecord);
      // Convert start time (x) and end time (event_end_time) to Date objects
      let firstStartTime = new Date(firstRecord.x);
      let secondEndTime = new Date(secondRecord.event_end_time);
      // console.log(firstStartTime+" :: "+secondEndTime);
      // Check if first record's start time is from a previous day
      if (firstStartTime.toDateString() !== secondEndTime.toDateString()) {
        // Adjust first record's start time to the next day's 00:00:00
        firstStartTime = new Date(secondEndTime);
        firstStartTime.setHours(0, 0, 0, 0); // Set to 00:00:00 of the next day
        firstRecord.x = firstStartTime.toISOString(); // Update the first record's start time (x)
      }
    }

    // Check if the last record's 'x' and 'event_end_time' are on different dates
    if (data.length > 0) {
      // console.log("2");
      const lastRecord = data[data.length - 1];
      let lastStartTime = new Date(lastRecord.x);
      let lastEndTime = new Date(lastRecord.event_end_time);
      // console.log("3");
      // If last record's event_end_time is on a different day, adjust it to 23:59:59 of the same day as x
      if (lastStartTime.toDateString() !== lastEndTime.toDateString()) {
        lastEndTime = new Date(lastStartTime); // Set to the same day as 'x'
        lastEndTime.setHours(23, 59, 59, 999); // Set to 23:59:59
        lastRecord.event_end_time = lastEndTime.toISOString(); // Update the event_end_time
      }
    }

    // Loop through each entry in the data array
    let iCount = 0, inc = 0;
    data.forEach(entry => {
      const label = entry.label;
      inc++;
      // Convert start time (x) and end time (event_end_time) to Date objects
      this.startTime = new Date(entry.x);
      this.endTime = new Date(entry.event_end_time);

      // Check if startTime is on a previous day compared to endTime
      if (this.startTime.toDateString() !== this.endTime.toDateString()) {
        // Adjust startTime to the next day's 00:00:00 if startTime is before endTime's date
        if (iCount == 0) {
          this.startTime = new Date(this.endTime);
          this.startTime.setHours(0, 0, 0, 0); // Set to 00:00:00 of the next day
        }
        iCount++;
      }

      if (data.length == inc) {
        this.endTime = new Date(this.endTime);
        // console.log(this.datePipe.transform(this.endTime,"yyyy-MM-dd")+" :: "+this.datePipe.transform(new Date(),"yyyy-MM-dd"));
        // if(this.datePipe.transform(this.endTime,"yyyy-MM-dd")!=this.datePipe.transform(new Date(),"yyyy-MM-dd")){
        //   this.endTime.setHours(23, 59, 59, 999); // Set to 23:59:59 of the same day
        // }else{
        //   //this.endTime = new Date();
        // }
      }

      // console.log(" >> "+data.length+" : "+inc);
      // Calculate the difference in minutes between start and end times
      console.log(" >> Calculation : " + label + " :: " + this.endTime + " :: " + this.startTime);
      const timeDiff = (this.endTime - this.startTime) / 1000 / 60; // Convert milliseconds to minutes
      // console.log(" >> Calculation : "+label+" :: "+timeDiff);
      // Add the time difference to the corresponding label in the labelTime object (if it exists)
      if (labelTime[label] === "0:00") {
        labelTime[label] = timeDiff;
        console.log(" >> Calculation1 : " + label + " :: " + labelTime[label]);
      } else if (labelTime[label]) {
        labelTime[label] += timeDiff;
        console.log(" >> Calculation2 : " + label + " :: " + labelTime[label]);
      } else {
        console.log(" >> Calculation3 : " + label + " :: " + labelTime[label]);
        labelTime[label] = timeDiff;
      }
    });

    // Convert the total time in minutes to HH:MM format for each label
    let sHour, sMinute;
    for (let label in labelTime) {
      if (typeof labelTime[label] === "number") {
        const totalMinutes = labelTime[label];
        const hours = Math.floor(totalMinutes / 60);
        if (hours.toString().length == 1) {
          sHour = "0" + hours;
        } else {
          sHour = hours;
        }
        const minutes = Math.floor(totalMinutes % 60);
        if (minutes.toString().length == 1) {
          sMinute = "0" + minutes;
        } else {
          sMinute = minutes;
        }
        labelTime[label] = `${String(sHour).padStart(1, '0')}:${String(sMinute).padStart(2, '0')}`;
      }
    }

    // console.log(" >> "+labelTime);
    // Return the labelTime object with total time in HH:MM format for each label
    return labelTime;
  }

  cValue;
  minDate;
  maxDate;
  dataPoints = [];
  LoadChart() {
    // this.cValue = [{"date":"2024-12-20","event_end_time":"2024-12-20 07:41:11","id":1,"label":"DRIVE","lineColor":"","x":"2024-12-20 00:00:00","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 08:41:18","id":2,"label":"DRIVE","lineColor":"","x":"2024-12-20 07:41:11","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 12:04:26","id":3,"label":"DRIVE","lineColor":"","x":"2024-12-20 08:41:18","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 12:10:03","id":4,"label":"DRIVE","lineColor":"","x":"2024-12-20 12:04:26","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 14:43:51","id":5,"label":"OFF_DUTY","lineColor":"","x":"2024-12-20 12:10:03","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 15:15:34","id":6,"label":"START_DUTY","lineColor":"","x":"2024-12-20 14:43:51","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 15:15:34","id":7,"label":"SLEEP","lineColor":"","x":"2024-12-20 15:15:34","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 15:15:34","id":7,"label":"SLEEP","lineColor":"","x":"2024-12-20 15:15:34","y":""}];
    // console.log("SDS: string " + JSON.stringify(this.cValue));

    // this.cValue = [{"date":"2025-01-19","event_end_time":"2025-01-20 23:59:59","id":1,"label":"OFF_DUTY","lineColor":"","x":"2025-01-20 00:00:00","y":""},{"date":"2025-01-21","event_end_time":"2025-01-20 23:59:59","id":2,"label":"OFF_DUTY","lineColor":"","x":"2025-01-20 23:59:59","y":""},{"date":"2025-01-21","event_end_time":"2025-01-20 23:59:59","id":2,"label":"OFF_DUTY","lineColor":"","x":"2025-01-20 23:59:59","y":""},{"date":"2025-01-21","event_end_time":"2025-01-20 23:59:59","id":2,"label":"OFF_DUTY","lineColor":"","x":"2025-01-20 23:59:59","y":""},{"date":"2025-01-21","event_end_time":"2025-01-20 23:59:59","id":2,"label":"OFF_DUTY","lineColor":"","x":"2025-01-20 23:59:59","y":""},{"date":"2025-01-21","event_end_time":"2025-01-20 23:59:59","id":2,"label":"OFF_DUTY","lineColor":"","x":"2025-01-20 23:59:59","y":""},{"date":"2025-01-21","event_end_time":"2025-01-20 23:59:59","id":2,"label":"OFF_DUTY","lineColor":"","x":"2025-01-20 23:59:59","y":""}];
    var totalLabelTime = this.calculateTotalTime(this.cValue);
    //alert(JSON.stringify(totalLabelTime));


    var obj1 = this.cValue;
    var currentstatus = obj1[obj1.length - 1];
    currentstatus.x = this.getDateTime(currentstatus.x);
    obj1.push(currentstatus);
    // console.log("currentstatus:" + JSON.stringify(currentstatus));
    // console.log("OBJ1:" + JSON.stringify(obj1));


    //get date
    var obj = obj1[1];
    this.minDate = obj.date + " 00:00:00";
    this.maxDate = obj.date + " 23:59:59";

    // console.log(this.minDate+" :: "+this.maxDate);
    // this.currentDate = new Date(obj.date);
    this.currentDate = this.parseLocalDate(obj.date);
    // console.log("OBJ1:" + this.minDate);

    this.dataPoints = [];
    // for (var i = 0; i < obj1.length; i++) {
    //   var obj = obj1[i];
    //   // console.log("obj.label: " + JSON.stringify(obj.label));
    //   // console.log("Y axis: " + JSON.stringify(this.GetLevel(obj.label)));
    //   this.dataPoints.push({ x: new Date(obj.x), y: this.GetLevel(obj.label), lineColor: this.GetColor(obj.label), label: "" });
    //   // console.log(this.dataPoints.indexOf);

    //   if(i == obj1.length-1){
    //     this.dataPoints.push({ x: new Date(obj.event_end_time), y: this.GetLevel(obj.label), lineColor: this.GetColor(obj.label), label: "" });
    //   }

    // }

    let eventStatus = ""; let eventLine = "solid";
    let eventColor = "";
    for (var i = 0; i < obj1.length; i++) {
      var obj = obj1[i];
      eventStatus = obj.eventStatus;
      // set event line like dot, solid, dash
      if (eventStatus == "PersonalUse" || eventStatus == "YardMove") {
        eventLine = "dot";
        if (eventStatus == "YardMove") {
          eventColor = "#f57842";
        } else {
          eventColor = "#f87c91ff";
        }
        // eventColor = this.GetColor(obj.label);
      } else {
        eventLine = "solid";
        eventColor = this.GetColor(obj.label);
      }

      // Check if it's the first record
      if (i === 0) {
        // Create a Date object from obj.x and set the time to 00:00:00
        // console.log(" DAte : "+obj.x+" :: "+obj.event_end_time);
        var date = new Date(obj.x);
        //date.setHours(0, 0, 0, 0); // Set time to 00:00:00

        // Push the first record with 00:00:00 hours
        this.dataPoints.push({
          x: date,
          y: this.GetLevel(obj.label),
          // lineColor: this.GetColor(obj.label), 
          lineColor: eventColor,
          lineDashType: eventLine,
          label: ""
        });
      } else {
        // For subsequent records, use the original obj.x value
        this.dataPoints.push({
          x: new Date(obj.x),
          y: this.GetLevel(obj.label),
          lineColor: eventColor,
          lineDashType: eventLine,
          label: ""
        });
      }

      // For the last record, adjust the time if the date is not the current date
      if (i === obj1.length - 1) {
        var lastDate = new Date(obj.event_end_time);
        var currentDate = new Date();

        // Check if the last record's date is not today's date
        // if (lastDate.toDateString() !== currentDate.toDateString()) {
        //   // Set the time to 23:59:59 if it's not the current date
        //   lastDate.setHours(23, 59, 59, 999);
        // }else{
        //   //lastDate = currentDate;
        // }

        // Push the last record
        this.dataPoints.push({
          x: lastDate,
          y: this.GetLevel(obj.label),
          lineColor: this.GetColor(obj.label),
          lineDashType: eventLine,
          label: ""
        });
      }
    }

    var options = {
      animationEnabled: false,
      exportEnabled: false,
      title: {
        text: "Hours Of Service"
      },
      toolTip: {
        contentFormatter: function (e) {
          var y = e.entries[0].dataPoint.y;

          switch (y) {
            case 3.5:
              return "OFF DUTY " + CanvasJS.formatDate(e.entries[0].dataPoint.x, "HH:mm");
              break;
            case 2.5:
              return "SLEEP " + CanvasJS.formatDate(e.entries[0].dataPoint.x, "HH:mm");
              break;
            case 1.5:
              return "DRIVE " + CanvasJS.formatDate(e.entries[0].dataPoint.x, "HH:mm");
              break;
            case .5:
              return "ON DUTY " + CanvasJS.formatDate(e.entries[0].dataPoint.x, "HH:mm");
              break;
            default:
              return "";
          }


        }
      },
      axisX: {
        tickLength: 0,
        minimum: new Date(this.minDate),
        maximum: new Date(this.maxDate),
        interval: 1,
        intervalType: "hour",
        margin: 5,
        labelFontColor: "transparent",
        gridThickness: 1,
        labelFontSize: 12,
        valueFormatString: "HH",
      },
      axisX2: {
        tickLength: 0,
        minimum: new Date(this.minDate),
        maximum: new Date(this.maxDate),
        title: "Time in Hours.",
        interval: 1,
        intervalType: "hour",
        margin: 5,
        labelFontColor: "#C24642",
        gridThickness: 1,
        labelFontSize: 12,
        valueFormatString: "HH",
      },
      axisY: {
        tickLength: 0,
        interval: 1,
        maximum: 4,
        margin: 2,
        gridThickness: 1,
        labelFontColor: "blue",
        labelFontSize: 12,
        stripLines: [
          {
            value: 3.5,
            color: "transparent",
            label: "OFF",
            labelFontColor: "blue",
            labelBackgroundColor: "transparent",
            labelPlacement: "outside",
          },
          {
            value: 2.5,
            label: "SB",
            labelFontColor: "blue",
            labelBackgroundColor: "transparent",
            color: "transparent",
            labelPlacement: "outside",
          },
          {
            value: 1.5,
            label: "D",
            labelFontColor: "blue",
            labelBackgroundColor: "transparent",
            color: "transparent",
            labelPlacement: "outside",
          },
          {
            value: 0.5,
            label: "ON",
            labelFontColor: "blue",
            labelBackgroundColor: "transparent",
            color: "transparent",
            labelPlacement: "outside",
          },
        ],

        labelFormatter: function (e) {
          return "";
          if (e.value == 4) {
            return "OFF";
          } else if (e.value == 3) {
            return "SL";
          } else if (e.value == 2) {
            return "DR";
          } else if (e.value == 1) {
            return "OD";
          } else {
            return "5";
          }
        },

      },

      axisY2: {
        interval: 1,
        tickLength: 0,
        maximum: 4,
        minimum: 0,
        margin: 2,
        //gridThickness: 1,
        labelFontColor: "blue",
        labelFontSize: 12,
        stripLines: [
          {
            value: 3.5,
            color: "transparent",
            label: totalLabelTime["OFF_DUTY"],
            labelFontColor: "black",
            labelBackgroundColor: "transparent",
            labelPlacement: "outside",
          },
          {
            value: 2.5,
            label: totalLabelTime["SLEEP"],
            labelFontColor: "black",
            labelBackgroundColor: "transparent",
            color: "transparent",
            labelPlacement: "outside",
          },
          {
            value: 1.5,
            label: totalLabelTime["DRIVE"],
            labelFontColor: "black",
            labelBackgroundColor: "transparent",
            color: "transparent",
            labelPlacement: "outside",
          },
          {
            value: 0.5,
            label: totalLabelTime["START_DUTY"],
            labelFontColor: "black",
            labelBackgroundColor: "transparent",
            color: "transparent",
            labelPlacement: "outside",
          },
        ],
        labelFormatter: function (e) {
          return "";
        },
      },
      dataPointWidth: 1,
      data: [
        {
          type: "rangeColumn",
          color: "black",
          dataPoints: this.getdtRange(),
          xValueFormatString: "ss:fff",
          toolTipContent: null
        },
        {
          type: "stepLine",
          axisXType: "secondary",  // Associate data with axisX2
          dataPoints: this.getdtRange(),
          color: "rgba(0,204,102,0.7)",
          markerSize: 5,
          lineThickness: 4,
          fillOpacity: 0.2,
        },
        {
          type: "stepLine",
          // lineDashType: "dot",
          color: "rgba(0,204,102,0.7)",
          markerSize: 5,
          lineThickness: 4,
          fillOpacity: 0.2,
          //indexLabel: "APPLE",
          //toolTipContent:"ORANGE",
          dataPoints: this.dataPoints
        },
        {
          type: "stepLine",
          color: "rgba(0,204,102,0.7)",
          markerSize: 5,
          lineThickness: 4,
          fillOpacity: 0.2,
          axisYType: "secondary",
          dataPoints: this.getdtRange(),
        }
      ]
    };

    var chart = new CanvasJS.Chart("chartContainer", options);
    chart.render();

  }

  PlusMinusDays(dayType) {
    if (dayType == "minus") {
      this.dateTime = this.activatedRoute.snapshot.params.datetime;
      // let lDate = new Date(this.dateTime);
      let lDate = this.parseLocalDate(this.dateTime);
      lDate.setDate(lDate.getDate() - 1);
      this.dateTime = this.datePipe.transform(lDate, 'yyyy-MM-dd');
      $("#logDateTime").val(this.dateTime);
      // alert(" >> "+this.employeeId+" :: "+this.dateTime);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (this.dateTime == this.datePipe.transform(tomorrow, 'yyyy-MM-dd')) {
        this.router.navigate(['/form/log-driver/' + this.employeeId + "/" + this.dateTime]);
        this.ShowUserWiseLogReport();
        this.ShowTableAndDate();
        $("#nextDateButton").attr('disabled', true);
      } else {
        this.router.navigate(['/form/log-driver/' + this.employeeId + "/" + this.dateTime]);
        this.ShowUserWiseLogReport();
        this.ShowTableAndDate();
        $("#nextDateButton").removeAttr('disabled');
      }
    } else {
      this.dateTime = this.activatedRoute.snapshot.params.datetime;
      // let lDate = new Date(this.dateTime);
      let lDate = this.parseLocalDate(this.dateTime);
      lDate.setDate(lDate.getDate() + 1);
      this.dateTime = this.datePipe.transform(lDate, 'yyyy-MM-dd');
      $("#logDateTime").val(this.dateTime);
      //alert(" >> "+this.employeeId+" :: "+this.dateTime);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (this.dateTime == this.datePipe.transform(tomorrow, 'yyyy-MM-dd')) {
        this.router.navigate(['/form/log-driver/' + this.employeeId + "/" + this.dateTime]);
        this.ShowUserWiseLogReport();
        this.ShowTableAndDate();
        $("#nextDateButton").attr('disabled', true);
      } else {
        this.router.navigate(['/form/log-driver/' + this.employeeId + "/" + this.dateTime]);
        this.ShowUserWiseLogReport();
        this.ShowTableAndDate();
        $("#nextDateButton").removeAttr('disabled');

      }

    }
  }



  // PrintPage(PrintWholePage) {
  //   $(".getDataDate").hide();
  //   $(".printDate").css({"display":"block"});
  //   $(".printDate").text(this.datePipe.transform($("#logDateTime").val(),"EE MMM d, y"));
  //   $("thead").css({"color":"#FFFFF", "print-color-adjust":"exact"});
  //   $("#chartPlaceholder").css({"display":"block"});

  //   const canvas = document.querySelector('#chartContainer canvas') as HTMLCanvasElement;
  //   const imageUrl = canvas.toDataURL('image/png');
  //   $("#chartPlaceholder").html('<img src="' + imageUrl + '" width="100%" />');

  //   $(".canvasGraphSection").hide();

  //   let printContents = document.getElementById(PrintWholePage,).innerHTML;
  //   let originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   document.title="Eld NEXT";
  //   window.print();
  //   document.body.innerHTML = originalContents;
  //   window.location.reload();
  // }

  PrintPage(PrintWholePage) {
    $(".getDataDate").hide();
    $(".refreshSection").hide();
    $(".printDate").css({ "display": "block" });
    $(".printDate").text(this.datePipe.transform($("#logDateTime").val(), "EE MMM d, y"));
    $("thead").css({ "color": "#FFFFF", "print-color-adjust": "exact" });
    $("#chartPlaceholder").css({ "display": "block" });

    const canvas = document.querySelector('#chartContainer canvas') as HTMLCanvasElement;
    const imageUrl = canvas.toDataURL('image/png');
    const img = new Image();
    img.src = imageUrl;
    img.style.width = "100%";

    // Wait for image to load before proceeding
    img.onload = () => {
      $("#chartPlaceholder").html('');
      $("#chartPlaceholder").append(img);

      $(".canvasGraphSection").hide();

      const printContents = document.getElementById(PrintWholePage).innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      document.title = "GBT Eld";

      // Delay window.print() slightly to ensure DOM is ready
      setTimeout(() => {
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
      }, 500);  // You can increase this delay if still unreliable
    };
  }

  // PrintPage(PrintWholePage)
  // {
  //     var mywindow = window.open('', 'PRINT', 'height=400,width=600');

  //     mywindow.document.write('<html><head><title>' + document.title  + '</title>');
  //     mywindow.document.write('</head><body >');
  //     mywindow.document.write('<h1>' + document.title  + '</h1>');
  //     mywindow.document.write(document.getElementById(PrintWholePage).innerHTML);
  //     mywindow.document.write('</body></html>');

  //     mywindow.document.close(); // necessary for IE >= 10
  //     mywindow.focus(); // necessary for IE >= 10*/

  //     mywindow.print();
  //     mywindow.close();

  //     return true;
  // }

  refreshAllData() {
    $("#ViewDriverName").text("");
    $("#ViewDriverNames").text("");
    $("#ViewCycleHour").text("");
    $("#ViewDriverExemptStatus").text("");
    $("#ViewDriverId").text("");
    $("#ViewCoDriverName").text("");
    $("#ViewDriverLicense").text("");
    $("#ViewCoDriverId").text("");
    $("#ViewDriverLicenseState").text("");
    $("#ViewDriverExceptions").text("");

    $("#ViewDriverVehicleNo").text("");
    $("#ViewDriverVin").text("");
    $("#ViewDriverOdometer").text("");
    $("#ViewDriverDistance").text("");
    $("#ViewDriverEngineHours").text("");
    $("#ViewDriverTrailer").text("");
    $("#ViewDriverShippingDocs").text("");
    $("#ViewDriverCarrier").text("");

    $("#ViewDriverMainOffice").text("");
    $("#ViewDriverHomeTerminal").text("");
    $("#ViewDriverDotNumber").text("");

    $("#ViewDriverSN").text("");
    $("#ViewDriverProvider").text("");
    $("#viewEldRegistrationId").text("");
    $("#viewEldIdentifier").text("");
    $("#ViewDriverDiagnosticIndicator").text("");
    $("#ViewDriverMalfunctionIndicator").text("");
  }

  camelCaseToWords(str) {
    return str
      .replace(/^[a-z]/g, char => ` ${char.toUpperCase()}`)
      .replace(/[A-Z]|[0-9]+/g, ' $&')
      .replace(/(?:\s+)/, char => '');
  };

  onValueChange(event: any) {
    this.logDriverForm.isCheckedValue = event.target.checked ? 1 : 0;
    // alert(this.logDriverForm.isCheckedValue);
  }

  isSignatureCertified = false;
  LOG_DATA;
  VEHICLE_ID: any;
  IMAGE_URL: any;
  async ShowUserWiseLogReport() {
    try {
      this.refreshAllData();
      this.VEHICLE_ID = 0;
      let cDate = this.datePipe.transform(this.dateTime, 'yyyy-MM-dd');
      const driverStatusReport = {
        // 'driverId' : employeeId,
        // "clientId":clientId
        "driverId": this.employeeId,
        'dateTime': cDate,
      };
      console.log(driverStatusReport);
      const data: any = await this.request.post('/dispatch/view_drivering_status_by_date', driverStatusReport);
      //console.log(data);
      this.LOG_DATA = data;
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if (objKey == "result") {
          for (let objKey1 of Object.keys(dataObj)) {
            //console.log(dataObj[objKey1]);
            this.IMAGE_URL = dataObj[objKey1].signatureUrl;
            $("#imageUrl").text(dataObj[objKey1].signatureUrl);
            $("#ViewDriverName").text(dataObj[objKey1].driverName);
            $("#ViewDriverNames").text(dataObj[objKey1].driverName);
            $("#ViewCycleHour").text(dataObj[objKey1].cycleUsaName);
            $("#ViewDriverExemptStatus").text(this.camelCaseToWords(dataObj[objKey1].exempt));
            $("#ViewDriverId").text(dataObj[objKey1].companyDriverId);
            if (dataObj[objKey1].coDriverName != "" && dataObj[objKey1].coDriverName != null) {
              $("#ViewCoDriverName").text(dataObj[objKey1].coDriverName);
            } else {
              $("#ViewCoDriverName").text("-");
            }
            $("#ViewDriverLicense").text(dataObj[objKey1].cdlNo);
            if (dataObj[objKey1].companyCoDriverId != "" && dataObj[objKey1].companyCoDriverId != null) {
              $("#ViewCoDriverId").text(dataObj[objKey1].companyCoDriverId);
            } else {
              $("#ViewCoDriverId").text("-");
            }
            $("#ViewDriverLicenseState").text(dataObj[objKey1].stateName);
            if (dataObj[objKey1].exception != "" && dataObj[objKey1].exception != null) {
              $("#ViewDriverExceptions").text(dataObj[objKey1].exception);
            } else {
              $("#ViewDriverExceptions").text("-");
            }

            this.VEHICLE_ID = dataObj[objKey1].vehicleId;
            $("#ViewDriverVehicleNo").text(dataObj[objKey1].truckNo);
            $("#ViewDriverVin").text(dataObj[objKey1].vin);
            $("#ViewDriverOdometer").text(Number(dataObj[objKey1].odometer).toFixed(2));
            // $("#ViewDriverOdometer").text(dataObj[objKey1].endOdometer+" - "+dataObj[objKey1].startOdometer);
            $("#ViewDriverDistance").text(Number(dataObj[objKey1].distance).toFixed(2));
            $("#ViewDriverEngineHours").text(Number(dataObj[objKey1].engineHour).toFixed(2));
            // let engineHour = Number(dataObj[objKey1].startEngineHour).toFixed(2)+" - "+Number(dataObj[objKey1].endEngineHour).toFixed(2);
            // $("#ViewDriverEngineHours").text(engineHour);
            if (dataObj[objKey1].trailers.length > 0) {
              $("#ViewDriverTrailer").text(dataObj[objKey1].trailers);
            } else {
              $("#ViewDriverTrailer").text("NA");
            }
            if (dataObj[objKey1].shippingDocs.length > 0) {
              $("#ViewDriverShippingDocs").text(dataObj[objKey1].shippingDocs);
            } else {
              $("#ViewDriverShippingDocs").text("NA");
            }
            $("#ViewDriverCarrier").text(dataObj[objKey1].carrier);

            $("#ViewDriverMainOffice").text(dataObj[objKey1].mainOffice);
            $("#ViewDriverHomeTerminal").text(dataObj[objKey1].mainTerminalName);
            $("#ViewDriverDotNumber").text(dataObj[objKey1].dotNo);
            let serialNo = dataObj[objKey1].serialNo ?? "-";
            let macAddress = dataObj[objKey1].macAddress ?? "-";
            $("#ViewDriverSN").text(serialNo + (macAddress ? " (" + macAddress + ")" : "-"));
            $("#ViewDriverProvider").text(dataObj[objKey1].eldProvider);

            $("#viewEldRegistrationId").text(dataObj[objKey1].eldRegistrationId);
            $("#viewEldIdentifier").text(dataObj[objKey1].eldIdentifier);

            $("#ViewDriverDiagnosticIndicator").text(dataObj[objKey1].diagnosticIndicator);
            $("#ViewDriverMalfunctionIndicator").text(dataObj[objKey1].malfunctionIndicator);

            if (dataObj[objKey1].certifiedSignature != "" && dataObj[objKey1].certifiedSignature != null) {
              this.isSignatureCertified = true;
              // alert(dataObj[objKey1].certifiedSignature);
              $("#ViewDriverSign").attr("src", dataObj[objKey1].certifiedSignature);
              $("#certifiedText").html(`Certified <img id="certifiedIconImage" src="assets/images/success.png" alt="" width="30px" height="30px">`).css("color", "green");
            } else {
              this.isSignatureCertified = false;
              $("#ViewDriverSign").attr("src", "assets/images/default_sign.jpg");
              $("#certifiedText").html(`Uncertified <img id="certifiedIconImage" src="assets/images/pending.png" alt="" width="30px" height="30px">`).css("color", "red");
            }

          }
        }
      }
    } catch (error) { }
  }

  DownloadImage() {
    const url = this.IMAGE_URL;

    if (!url) {
      console.error('Image URL is undefined');
      return;
    }

    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);

        const fileName = url.split('/').pop() || 'image.jpg';

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.error('Download failed', err));
  }

  ShowCertifiedLog() {
    for (let objKey of Object.keys(this.LOG_DATA)) {
      let dataObj = this.LOG_DATA[objKey];
      if (objKey == "result") {
        for (let objKey1 of Object.keys(dataObj)) {
          $("#certifiedLogId").val(dataObj[objKey1].certifiedLogId);
          this.logDriverForm.certifiedDriverId = dataObj[objKey1].coDriverId;
          $("#logtrailer").val(dataObj[objKey1].trailers);
          $("#logShippingDocs").val(dataObj[objKey1].shippingDocs);
          $("#signatureFileName").val(dataObj[objKey1].certifiedSignatureName);
        }
      }
    }
  }

  fromDate;
  toDate;
  dvirDetails = [];
  // rowData;
  isLoading: boolean = false;
  dgDataObj = [];
  dgCount = [];
  isGraphShow = false;
  seriesData = [];
  lastDateTime = 0;
  // srNo=0;
  lastStatus = "";
  EMPLOYEE_ID = 0;
  EMPLOYEE_NAME = "";
  nextDate;
  //LDATE_TIME;
  // async ShowDLogReport(employeeId,dateTime){
  //   try {
  //    // this.EMPLOYEE_NAME = employeeName;
  //     this.seriesData=[];
  //     this.isLoading = true;
  //     let cDate = this.datePipe.transform(dateTime, 'yyyy-MM-dd');
  //    // console.log(cDate);
  //     this.fromDate = this.datePipe.transform(dateTime+" 00:00:00", 'yyyy-MM-dd HH:mm:ss');
  //     this.toDate = this.datePipe.transform(dateTime+" 23:59:59", 'yyyy-MM-dd HH:mm:ss');
  //     //alert(this.fromDate+" :: "+this.toDate);
  //     const dlog= {
  //       'driverId' : employeeId,
  //       'fromDate' : this.fromDate,
  //       'toDate' : this.toDate,
  //       'email': "" 
  // 		};
  //     // console.log(dlog);
  //      // this.dtTrigger=new Subject<any>();
  //       const data: any = await this.request.post('/dispatch/view_drivering_status/',dlog);
  //       this.dvirDetails=[];
  //     //this.dtTrigger.next();
  //     for (let objKey of Object.keys(data)) {
  //       let dataObj = data[objKey];
  //       if(objKey=="result"){
  //         for (let objKey1 of Object.keys(dataObj)) {
  //          // console.log(dataObj[objKey1].driverName);
  //          //this.LDATE_TIME=(this.datePipe.transform(dataObj[objKey1].lDateTime, 'yyyy-MM-dd HH:mm:ss'));
  //          this.EMPLOYEE_NAME = dataObj[objKey1].driverName;
  //           this.dvirDetails.push(dataObj[objKey1]);
  //         } 
  //       }
  //     }
  //     this.GraphData(data,this.EMPLOYEE_NAME, cDate);	
  //     this.ShowTableAndDate(employeeId,cDate);	
  //     //this.ShowDLogReportPreviousDay(employeeId,cDate);		
  //    // this.rowData = this.dvirDetails;
  //     this.isLoading = false;
  //   } catch (error) {}
  // }


  fromDates;
  toDates;
  async ShowDLogReportPreviousDay(employeeId, dateTime) {
    try {
      // this.EMPLOYEE_NAME = employeeName;
      this.seriesData = [];
      this.isLoading = true;
      // alert("hi");
      // let TodayDate = dateTime;
      // let yesterday = new Date(dateTime);
      let yesterday = this.parseLocalDate(dateTime);
      yesterday.setDate(yesterday.getDate() - 1);

      let cDates = this.datePipe.transform(yesterday, 'yyyy-MM-dd');
      //console.log(cDates);

      this.fromDates = this.datePipe.transform(cDates + " 00:00:00", 'yyyy-MM-dd HH:mm:ss');
      this.toDates = this.datePipe.transform(cDates + " 23:59:59", 'yyyy-MM-dd HH:mm:ss');
      //alert(this.fromDates+" :: "+this.toDates);
      const dlog = {
        'driverId': employeeId,
        'fromDate': this.fromDates,
        'toDate': this.toDates,
        'email': ""
      };
      // console.log(dlog);
      const data: any = await this.request.post('/dispatch/view_drivering_status/', dlog);
      this.dvirDetails = [];
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if (objKey == "result") {
          for (let objKey1 of Object.keys(dataObj)) {
            // console.log(dataObj[objKey1].driverName);
            this.EMPLOYEE_NAME = dataObj[objKey1].driverName;
            this.dvirDetails.push(dataObj[objKey1]);
          }
        }
      }
      // this.GraphData(data,this.EMPLOYEE_NAME, cDates);		
      this.ShowTableAndDate();
      this.isLoading = false;
    } catch (error) { }
  }


  newCurrentDate;
  viewDate() {
    this.newCurrentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // let date = new Date();
    // let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // // alert(this.datePipe.transform(firstDay, 'yyyy-MM-dd'));
    // $('#crmsFromDate').val(this.datePipe.transform(firstDay, 'yyyy-MM-dd'));
    $('#nextDateButton').val(this.newCurrentDate);
  };

  fromNextDates;
  toNextDates;
  tomorrowDate;
  async ShowDLogReportNextDay(employeeId, dateTime) {

    // if(this.newCurrentDate){
    //   $("#nextDateButton").attr("disabled","disabled");
    // }

    try {
      // this.EMPLOYEE_NAME = employeeName;
      this.seriesData = [];
      this.isLoading = true;
      // alert("hi");
      let TodayDate = dateTime;
      // let tommorrow = new Date(TodayDate);
      let tommorrow = this.parseLocalDate(TodayDate);
      tommorrow.setDate(tommorrow.getDate() + 1);

      let cDates = this.datePipe.transform(tommorrow, 'yyyy-MM-dd');
      //console.log(cDates);

      this.fromNextDates = this.datePipe.transform(cDates + " 00:00:00", 'yyyy-MM-dd HH:mm:ss');
      this.toNextDates = this.datePipe.transform(cDates + " 23:59:59", 'yyyy-MM-dd HH:mm:ss');
      //alert(this.fromDates+" :: "+this.toDates);
      const dlog = {
        'driverId': employeeId,
        'fromDate': this.fromNextDates,
        'toDate': this.toNextDates,
        'email': ""
      };
      // console.log(dlog);
      const data: any = await this.request.post('/dispatch/view_drivering_status/', dlog);
      this.dvirDetails = [];
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if (objKey == "result") {
          for (let objKey1 of Object.keys(dataObj)) {
            // console.log(dataObj[objKey1].driverName);
            this.EMPLOYEE_NAME = dataObj[objKey1].driverName;
            this.dvirDetails.push(dataObj[objKey1]);
          }
        }
      }
      // this.GraphData(data,this.EMPLOYEE_NAME, cDates);		
      this.ShowTableAndDate();
      this.isLoading = false;
    } catch (error) { }
  }

  rowData;
  voilationRowData;
  voilationDataDetails = [];
  LDATE_TIME;
  isReportGenerated = 0;
  refreshTimeout: any;
  statusIdDetail = [];
  statusIdArr;
  async ShowTableAndDate() {
    try {
      // alert(dateTime);
      // this.EMPLOYEE_NAME = employeeName;
      this.isReportGenerated = 0;
      this.cValue = [];
      this.seriesData = [];
      this.statusIdDetail = [];
      this.isLoading = true;
      let cDate = this.datePipe.transform(this.dateTime, 'yyyy-MM-dd');
      // console.log(cDate);
      this.fromDate = this.datePipe.transform(this.dateTime + " 00:00:00", 'yyyy-MM-dd HH:mm:ss');
      this.toDate = this.datePipe.transform(this.dateTime + " 23:59:59", 'yyyy-MM-dd HH:mm:ss');
      //alert(this.fromDate+" :: "+this.toDate);
      const dlog = {
        'driverId': this.employeeId,
        'fromDate': this.fromDate,
        'toDate': this.toDate,
        'email': ""
      };
      console.log(dlog);
      // const data: any = await this.request.post('/dispatch/view_drivering_status/',dlog);
      const data: any = await this.request.post('/dispatch/view_drivering_status_log/', dlog);
      const graphData: any = await this.request.post('/dispatch/view_drivering_status_for_graph/', dlog);
      this.dvirDetails = [];
      this.voilationDataDetails = [];
      // console.log(graphData);
      let bFlag = false;
      let statusArr;

      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if (objKey == "result") {
          for (let objKey1 of Object.keys(dataObj)) {
            try {
              if (dataObj[objKey1].customLocation != "" && bFlag == false) {
                this.isReportGenerated = Number(dataObj[objKey1].isReportGenerated);
                bFlag = true;
              }
              statusArr = {
                id: dataObj[objKey1].statusId,
                statusId: dataObj[objKey1].statusId
              };
              this.statusIdDetail.push(statusArr);

              this.LDATE_TIME = (this.datePipe.transform(new Date(Number(dataObj[objKey1].dateTime)), 'yyyy-MM-dd '));
              // this.LDATE_TIME=(this.datePipe.transform(dataObj[objKey1].lDateTime, 'yyyy-MM-dd HH:mm:ss'));
              let sDate = (this.datePipe.transform(new Date(Number(dataObj[objKey1].dateTime)), 'yyyy-MM-dd HH:mm:ss'));
              dataObj[objKey1].dateTime = new Date(sDate).getTime();
              this.EMPLOYEE_NAME = dataObj[objKey1].driverName;
              dataObj[objKey1].engineHour = Number(dataObj[objKey1].engineHour).toFixed(1);
              if (dataObj[objKey1].isVoilation == 1) {
                this.voilationDataDetails.push(dataObj[objKey1]);
              } else {
                this.dvirDetails.push(dataObj[objKey1]);
              }
            } catch (error) { }
          }
        }
      }
      console.log(" >> isReportGenerated: " + this.isReportGenerated + " :: " + this.isEditing);
      // this.GraphData(graphData,this.EMPLOYEE_NAME, cDate);		
      // console.log(graphData);
      if (graphData.result.length > 0) {
        $(".canvasGraphSection").show();
        const status = this.checkDateStatus(this.datePipe.transform(this.dateTime, 'yyyy-MM-dd'));
        if (status == "today" || status == "past") {
          this.CanvasGraphData(graphData);
        } else {
          $(".canvasGraphSection").hide();
        }
      } else {
        $(".canvasGraphSection").hide();
      }
      this.rowData = this.dvirDetails;
      this.voilationRowData = this.voilationDataDetails;
      this.statusIdArr = this.statusIdDetail;

      // this.ShowDLogReportPreviousDay(employeeId,cDate);		

      // console.log(this.rowData);
      // console.log(this.voilationRowData);

      this.rowData.sort(function (a, b) {
        // console.log(a.dateTime);
        if (a.dateTime < b.dateTime) {
          return -1;
        }
        if (a.dateTime > b.dateTime) {
          return 1;
        }
        // date time must be equal
        return 0;
      });

      //this.rerender();
      //console.log(this.simulatorDetails);
      this.isLoading = false;

      if (this.userTypeId == 2) {
        setTimeout(() => this.hideRestrictedElements(), 100);
      }

      if (this.refreshTimeout) {
        // alert("clear timeout here...");
        clearInterval(this.refreshTimeout);
      }

      // await new Promise(resolve => setTimeout(() => resolve(window.location.reload()), 120000));
      let isChecked = $('#refreshBtn').is(':checked');
      if (isChecked) {
        this.refreshTime = this.datePipe.transform(new Date(), 'HH:mm:ss');
        // alert("refresh");
        // await new Promise(resolve => setTimeout(() => resolve(
        //   //window.location.reload()
        //   this.RefreshPageData()
        // ), 60000));
        this.refreshTimeout = setInterval(() => {
          this.RefreshPageData();
        }, 60000);
      } else {
        // alert("not refresh");
        this.refreshTime = this.datePipe.transform(new Date(), 'HH:mm:ss');
      }
    } catch (error) { }
  }

  checkDateStatus(inputDate: string): string {
    const today = new Date();
    const formattedToday = this.datePipe.transform(today, 'yyyy-MM-dd');
    // const formattedInput = this.datePipe.transform(new Date(inputDate), 'yyyy-MM-dd');
    const formattedInput = this.datePipe.transform(this.parseLocalDate(inputDate), 'yyyy-MM-dd');

    if (formattedInput === formattedToday) {
      return 'today';
    } else if (formattedInput < formattedToday) {
      return 'past';
    } else {
      return 'future';
    }
  }

  RefreshPageData() {
    // alert("refresh here...");
    this.ShowUserWiseLogReport()
    this.ShowTableAndDate()
  }

  SelectAllLog(evt) {
    const checkbox = evt.target as HTMLInputElement;
    // alert(checkbox.checked);
    if (checkbox.checked) {
      this.rowData.forEach(graphStatus => {
        this.selectedValues = this.selectedValues.filter(v => v !== graphStatus);
        this.selectedValues.push(graphStatus);
      });
      this.selectedValues = this.selectedValues.filter((log, index) => index !== 0);
    } else {
      this.rowData.forEach(graphStatus => {
        this.selectedValues = this.selectedValues.filter(v => v !== graphStatus);
      });
    }
    if (this.selectedValues.length > 0) {
      this.isCheckedLogData = true;
    } else {
      this.isCheckedLogData = false;
    }
    // console.log(this.selectedValues);
  }

  selectedValues: string[] = [];
  isCheckedLogData = false;
  onCheckboxChange(evt, graphStatus) {
    const checkbox = evt.target as HTMLInputElement;
    // if (checkbox.checked) {
    //   this.selectedValues.push(graphStatus.driverStatusId+"-"+graphStatus.driverStatus+"-"+graphStatus.dateTime);
    // } else {
    //   this.selectedValues = this.selectedValues.filter(v => v !== graphStatus.driverStatusId+"-"+graphStatus.driverStatus+"-"+graphStatus.dateTime);
    // }
    if (checkbox.checked) {
      this.selectedValues.push(graphStatus);
    } else {
      this.selectedValues = this.selectedValues.filter(v => v !== graphStatus);
    }
    // console.log(this.selectedValues.length);
    if (this.selectedValues.length > 0) {
      this.isCheckedLogData = true;
    } else {
      this.isCheckedLogData = false;
    }
    // console.log(this.selectedValues);
  }

  isBulkAssign = false;
  isBulkAssignVisible: boolean = false;
  ShowBulkAssign() {
    this.isBulkAssign = true;
    this.isBulkAssignVisible = !this.isBulkAssignVisible;
  }

  firstLog: any = [];
  AssignBulkEdit() {
    // this.logDriverForm.logDate = this.datePipe.transform(this.dateTime, "yyyy-MM-dd");
    if (this.selectedValues.length > 0) {
      this.firstLog = this.selectedValues[0];
      this.logDriverForm.logEditDateTime = this.datePipe.transform(new Date(this.firstLog.dateTime), "yyyy-MM-ddTHH:mm:ss", 'UTC');
    }
  }

  async BulkDelete() {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${this.selectedValues.length} selected logs ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    });

    if (!confirm.value) {
      return;
    }

    try {

      for (const logData of this.selectedValues as any[]) {

        const dlog = {
          driverStatusId: logData.driverStatusId,
          driverId: logData.driverId,
          isVisible: 0,
          email: localStorage.getItem("email"),
          dateTime: logData.dateTime,
          status: logData.status,
          shift: logData.shift,
          days: logData.days
        };
        // console.log(dlog);
        await this.request.post('/dispatch/update_and_enable_disable_driver_log/', dlog);
      }

      Swal.fire(
        'Deleted!',
        'Selected logs deleted successfully',
        'success'
      );

      window.location.reload();

    } catch (e) {
      Swal.fire('Error while deleting logs');
    }
  }


  dLogArray: any = [];
  selectedDateTime: any;
  async BulkShiftLogUpdate() {
    try {
      let checkDvir = $('#checkDvirEdit').is(':checked');
      // console.log(checkDvir);
      let logDateTime = this.datePipe.transform(this.logDriverForm.logEditDateTime, "yyyy-MM-dd HH:mm:ss");
      // console.log(logDateTime);
      this.dLogArray = [];
      let icount = 0, totalSeconds = 0;
      (this.selectedValues as any[]).forEach((log: any) => {
        // let logTime = this.datePipe.transform(log.dateTime, "HH:mm:ss","UTC");
        if (icount == 0) {
          this.selectedDateTime = logDateTime;
          let isoUtcStr = this.selectedDateTime.replace(' ', 'T') + 'Z';
          let dateObj = new Date(isoUtcStr);
          let diff = dateObj.getTime() - log.dateTime;
          totalSeconds = diff / 1000;
        }
        icount++;
        let newTimestamp = log.dateTime + (totalSeconds * 1000);
        // console.log(log.dateTime+" :: "+totalSeconds);
        let newDateTime = this.datePipe.transform(newTimestamp, "yyyy-MM-dd HH:mm:ss", "UTC");
        // console.log(newDateTime);
        this.dLogArray.push({
          vehicleId: log.vehicleId,
          driverId: log.driverId,
          driverStatusId: log.driverStatusId,
          statusId: log.statusId,
          dateTime: newDateTime,
          lastUtcDateTime: log.dateTime || 0,
          status: log.status,
          origin: log.origin || '',
          lattitude: log.lattitude || 0,
          longitude: log.longitude || 0,
          customLocation: log.customLocation || '',
          odometer: log.odometer || 0,
          engineHour: log.engineHour || '0.0',
          note: log.note || '',
          totalSeconds: totalSeconds,
          shift: log.shift || 0,
          days: log.days || 0,
          isDvirShift: checkDvir.toString()
        });
      });
      // console.log(this.dLogArray);

      // let selectedDate = this.datePipe.transform(this.logDriverForm.logDate,"yyyy-MM-dd");
      // (this.selectedValues as any[]).forEach((log: any) => {
      //   let logTime = this.datePipe.transform(log.dateTime, "HH:mm:ss","UTC");
      //   let logDateTime = this.datePipe.transform(selectedDate+" "+logTime, 'yyyy-MM-dd HH:mm:ss');
      //   let isoUtcStr = selectedDate + 'T' + logTime + 'Z';
      //   let dateObj = new Date(isoUtcStr);
      //   let diff = dateObj.getTime() - log.dateTime;
      //   let totalSeconds = diff / 1000;
      //   this.dLogArray.push({
      //     vehicleId: log.vehicleId,
      //     driverId: log.driverId,
      //     driverStatusId: log.driverStatusId,
      //     statusId: log.statusId,
      //     dateTime: logDateTime,
      //     lastUtcDateTime: log.dateTime || 0,
      //     status: log.status,
      //     origin: log.origin || '',
      //     lattitude: log.lattitude || 0,
      //     longitude: log.longitude || 0,
      //     customLocation: log.customLocation || '',
      //     odometer: log.odometer || 0,
      //     engineHour: log.engineHour || '0.0',
      //     note: log.note || '',
      //     totalSeconds: totalSeconds,
      //     shift: log.shift || 0,
      //     days: log.days || 0
      //   });
      // });

      const confirm = await Swal.fire({
        title: 'Are you sure?',
        text: "You want to change log date!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
      });
      if (confirm.value) {
        const dLog = {
          'logStatusData': this.dLogArray,
        };
        const save: any = await this.request.post('/dispatch/update_and_shift_driver_log_in_bulk', dLog);
        // console.log(save);
        for (let objKey of Object.keys(save)) {
          let dataObj = save[objKey];
          if (objKey == "status") {
            this.isUpdatedRecord = save[objKey];
          }
          if (objKey == "message") {
            this.message = save[objKey];
          }
        }
        if (this.isUpdatedRecord == "SUCCESS") {
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
          }
          window.location.reload();
        } else {
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
      }

    } catch (error) { }
  }

  isUpdatedRecord;
  message;
  async BulkAssignUpdate() {
    try {
      let checkDvir = $('#checkDvir').is(':checked');
      let checkCertified = $('#checkCertified').is(':checked');
      const dLog = {
        'driverId': this.logDriverForm.employeeId,
        'checkDvir': checkDvir.toString(),
        'checkCertified': checkCertified.toString(),
        'logStatusData': this.selectedValues,
      };
      console.log(dLog);
      const save: any = await this.request.post('/dispatch/assign_log_to_driver', dLog);
      console.log(save);
      for (let objKey of Object.keys(save)) {
        let dataObj = save[objKey];
        if (objKey == "status") {
          this.isUpdatedRecord = save[objKey];
        }
        if (objKey == "message") {
          this.message = save[objKey];
        }
      }
      if (this.isUpdatedRecord == "SUCCESS") {
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
          //window.location.reload();
        }
        //window.location.reload();
      } else {
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
    } catch (error) { }
  }

  syntaxHighlight(json: any): string {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, null, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(.*?)")(\s*:\s*)?([^\n]*)?/g, (match, p1, p2, p3, p4) => {
      const key = `<span class="json-key">${p1}</span>`;
      const sep = p3 || '';
      const val = p4 || '';
      let valueClass = 'json-value';

      if (/^"/.test(val)) {
        valueClass = 'json-string';
      } else if (/true|false/.test(val)) {
        valueClass = 'json-boolean';
      } else if (/null/.test(val)) {
        valueClass = 'json-null';
      }

      return key + sep + `<span class="${valueClass}">${val}</span>`;
    });
  }


  jsonData;
  styledJson = "";
  logRowData;
  LogDataShow(logData) {
    // console.log(logData);
    $("#logUpdateDateTime").val(this.datePipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss"));
    // $(".logJsonSection").text(JSON.stringify(logData));
    // $(".logJsonSection").css("white-space", "normal");
    this.jsonData = logData;
    this.styledJson = this.syntaxHighlight(this.jsonData);
    this.logRowData = logData
    $("#logDriverStatusId").val(logData.driverStatusId);
    $("#logShift").val(logData.shift);
    $("#logDays").val(logData.days);
    $("#logStatusId").val(logData.statusId);
    // $("#logDriverName").val(logData.driverName);
    $("#logUpdateDateTime").val(this.datePipe.transform(logData.dateTime, "yyyy-MM-ddTHH:mm:ss", 'UTC'));
    $("#lastLogUpdateDateTime").val(this.datePipe.transform(logData.dateTime, "yyyy-MM-ddTHH:mm:ss", 'UTC'));
    $("#lastLogUpdateDateTimeTimestamp").val(logData.dateTime);
    // $("#logStatus").val(logData.status);
    this.logDriverForm.logStatus = logData.status;
    $("#logLattitude").val(logData.lattitude);
    $("#logLongitude").val(logData.longitude);
    $("#logPlaceAddress").val(logData.customLocation);
    // $("#logOrigin").val(logData.origin);
    this.logDriverForm.logOrigin = logData.origin;
    this.logDriverForm.logVehicleNo = logData.vehicleId;
    $("#logOdometer").val(logData.odometer);
    $("#logEngineHour").val(logData.engineHour);
    $("#logNotes").val(logData.note);
    // console.log(this.logRowData.driverName);

    // const currentIndex = this.rowData.findIndex(log => log.statusId === logData.statusId);
    // const lastLog = currentIndex > 0 ? this.rowData[currentIndex - 1] : null;
    // console.log("Current Log:", logData);
    // console.log("Last Log:", lastLog);

  }

  async EnableDisableLog(logData) {
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
      const dlog = {
        'driverStatusId': logData.driverStatusId,
        'driverId': logData.driverId,
        'isVisible': 0,
        'email': localStorage.getItem("email"),
        'dateTime': logData.dateTime,
        'status': logData.status,
        'shift': logData.shift,
        'days': logData.days
      };
      // console.log(dlog);
      const allow: any = await this.request.post('/dispatch/update_and_enable_disable_driver_log/', dlog);
      if (allow) {
        // Successfully Deleted
        Swal.fire(
          'Deleted!',
          'Log Status has been deleted.',
          'success'
        );
        // Reload DataTable
        window.location.reload();
      } else {
        Swal.fire(
          'Error!'
        );
      }
    }
  }

  async UpdateDriverLog() {
    let driverStatusId = $("#logDriverStatusId").val();
    let logUpdateDateTime = this.datePipe.transform($("#logUpdateDateTime").val(), "yyyy-MM-dd HH:mm:ss");
    let logNotes = $("#logNotes").val();
    let diff = new Date($("#logUpdateDateTime").val()).getTime() - new Date($("#lastLogUpdateDateTime").val()).getTime();
    // Convert milliseconds to total seconds
    let totalSeconds = diff / 1000;
    // console.log(totalSeconds);

    let odometer = Number($("#logOdometer").val());
    let engineHour = Number($("#logEngineHour").val());
    if (["Login", "Logout", "Certified"].includes(this.logDriverForm.logStatus)) {

    } else {
      if (this.logDriverForm.logOrigin != "Unidentified") {
        if (odometer <= 0 && engineHour <= 0) {
          Swal.fire({
            title: "Oops?",
            text: "Please enter valid odometer or engine hour!",
            icon: "question",
            type: "warning",
          });
          return;
        }
      }
    }

    // $('#driver_log_modal').modal('hide');
    const dLog = {
      'vehicleId': this.logDriverForm.logVehicleNo,
      'driverId': this.employeeId,
      'driverStatusId': driverStatusId,
      'statusId': $("#logStatusId").val(),
      'dateTime': logUpdateDateTime,
      'lastUtcDateTime': Number($("#lastLogUpdateDateTimeTimestamp").val()),
      'status': this.logDriverForm.logStatus,
      'origin': this.logDriverForm.logOrigin,
      'lattitude': Number($("#logLattitude").val()),
      'longitude': Number($("#logLongitude").val()),
      'customLocation': $("#logPlaceAddress").val(),
      'odometer': odometer,
      'engineHour': engineHour,
      'note': logNotes,
      'totalSeconds': totalSeconds,
      'shift': Number($("#logShift").val()),
      'days': Number($("#logDays").val())
    };
    console.log(dLog);
    const save: any = await this.request.post('/dispatch/update_and_shift_driver_log', dLog);
    // console.log(save);
    for (let objKey of Object.keys(save)) {
      let dataObj = save[objKey];
      if (objKey == "status") {
        this.isUpdatedRecord = save[objKey];
      }
      if (objKey == "message") {
        this.message = save[objKey];
      }
    }
    if (this.isUpdatedRecord == "SUCCESS") {
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
      }
      window.location.reload();
    } else {
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
  }

  GraphData(data, employeeName, selectDate) {
    this.dgDataObj = [];
    this.dgCount = [];
    this.seriesData = [];
    this.lastDateTime = 0;
    // this.srNo=0;
    this.lastStatus = "";

    this.isGraphShow = true;

    let iCount = 0, srNo = 0, totalHourCount = 0, inc = 0;
    let workingHours = 0;
    let fromDate = 0, toDate = 0, sDate = "", date;
    let lastStatusValue = 0;

    // console.log("Series length  :"+this.chartOptions.series.length);
    while (this.chartOptions.series.length > 0) {
      this.chartOptions.series.pop();
    }
    for (let objKey of Object.keys(data)) {
      let dataObj = data[objKey];
      if (objKey == "result") {
        for (let objKey1 of Object.keys(dataObj)) {


          srNo++;

          // let lDateTime = new Date(this.datePipe.transform(new Date(dataObj[objKey1].dateTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
          if (srNo == 1 && dataObj[objKey1].status == "OnDuty") {
            // workingHours = this.diff_hours(this.srNo,lDateTime);
            // console.log(workingHours);
            lastStatusValue = 1;
            this.seriesData.push(1);
            iCount++;

          }
          else if (srNo == 1 && dataObj[objKey1].status == "OnDrive") {
            // workingHours = this.diff_hours(this.srNo,lDateTime);
            //console.log(workingHours);
            lastStatusValue = 2;
            this.seriesData.push(2);
            iCount++;

          }
          else if (srNo == 1 && dataObj[objKey1].status == "OnSleep") {
            // workingHours = this.diff_hours(this.srNo,lDateTime);
            // console.log(workingHours);
            lastStatusValue = 3;
            this.seriesData.push(3);
            iCount++;

          }
          else if (srNo == 1 && dataObj[objKey1].status == "OffDuty") {
            // workingHours = this.diff_hours(this.srNo,lDateTime);
            // console.log(workingHours);
            lastStatusValue = 4;
            this.seriesData.push(4);
            iCount++;

          }


          if (srNo > 1) {

            // if(dataObj[objKey1].driverId=21 ){

            fromDate = dataObj[objKey1].fromDate;
            toDate = dataObj[objKey1].toDate;
            if (inc == 0) {
              sDate = dataObj[objKey1].dateTime;
              // date = this.datePipe.transform(new Date(selectDate), 'yyyy-MM-dd');
              date = this.datePipe.transform(this.parseLocalDate(selectDate), 'yyyy-MM-dd');
              let currentTime = new Date(this.datePipe.transform(new Date(sDate), 'yyyy-MM-dd HH:mm')).getTime();
              let midnightTime = new Date(this.datePipe.transform(date + " 00:00", 'yyyy-MM-dd HH:mm')).getTime();
              workingHours = this.diff_hours(midnightTime, currentTime);
              // console.log(currentTime+ ": "+midnightTime+" :: "+workingHours);
              if (currentTime > midnightTime) {
                for (let i = 1; i <= workingHours; i++) {
                  this.seriesData.push(lastStatusValue);
                  iCount++;
                }
              }

            }
            inc++;

            let lDateTime = new Date(this.datePipe.transform(new Date(dataObj[objKey1].dateTime), 'yyyy-MM-dd HH:mm:ss')).getTime();
            if (this.lastDateTime > 0 && this.lastStatus == "OnDuty") {
              workingHours = this.diff_hours(this.lastDateTime, lDateTime);
              // console.log(workingHours);
              for (let i = 1; i <= workingHours; i++) {
                this.seriesData.push(1);
                iCount++;
              }
            }
            if (this.lastDateTime > 0 && this.lastStatus == "OnDrive") {
              workingHours = this.diff_hours(this.lastDateTime, lDateTime);
              //console.log(workingHours);
              for (let i = 1; i <= workingHours; i++) {
                this.seriesData.push(2);
                iCount++;
              }
            }

            // if(this.lastDateTime>0 && this.lastStatus=="OnBreak"){
            //   workingHours = this.diff_hours(this.lastDateTime,lDateTime);
            //   // console.log(workingHours);
            //   for(let i=1;i<=workingHours;i++){
            //     this.seriesData.push(3);
            //     iCount++;
            //   }
            // }
            if (this.lastDateTime > 0 && this.lastStatus == "OnSleep") {
              workingHours = this.diff_hours(this.lastDateTime, lDateTime);
              // console.log(workingHours);
              for (let i = 1; i <= workingHours; i++) {
                this.seriesData.push(3);
                iCount++;
              }
            }
            if (this.lastDateTime > 0 && this.lastStatus == "OffDuty") {
              workingHours = this.diff_hours(this.lastDateTime, lDateTime);
              // console.log(workingHours);
              for (let i = 1; i <= workingHours; i++) {
                this.seriesData.push(4);
                iCount++;
              }
            }
            // if(this.lastDateTime>0 && this.lastStatus=="Voilation"){
            //   workingHours = this.diff_hours(this.lastDateTime,lDateTime);
            //   // console.log(workingHours);
            //   for(let i=1;i<=workingHours;i++){
            //     this.seriesData.push(6);
            //     iCount++;
            //   }
            // }
            this.lastStatus = dataObj[objKey1].status;
            this.lastDateTime = lDateTime;
            // }
          }

          // console.log(dataObj[objKey1]);

        }


        if (this.datePipe.transform(new Date(), 'yyyy-MM-dd') == this.datePipe.transform(new Date(sDate), 'yyyy-MM-dd')) {
          // console.log("here"+this.datePipe.transform(new Date(), 'yyyy-MM-dd')+" :: "+this.datePipe.transform(new Date(toDate), 'yyyy-MM-dd'));
          toDate = new Date().getTime();
        } else {
          toDate = new Date(this.datePipe.transform(new Date(toDate).toISOString(), 'yyyy-MM-dd HH:mm:ss')).getTime();
        }

        if (this.lastDateTime > 0 && this.lastStatus == "OnDuty") {
          workingHours = this.diff_hours(this.lastDateTime, toDate);
          // console.log(workingHours);
          for (let i = 1; i <= workingHours; i++) {
            this.seriesData.push(1);
            iCount++;
          }
        }
        if (this.lastDateTime > 0 && this.lastStatus == "OnDrive") {
          workingHours = this.diff_hours(this.lastDateTime, toDate);
          // console.log(workingHours);
          for (let i = 1; i <= workingHours; i++) {
            this.seriesData.push(2);
            iCount++;
          }
        }
        // if(this.lastDateTime>0 && this.lastStatus=="OnBreak"){
        //   workingHours = this.diff_hours(this.lastDateTime,toDate);
        //   // console.log(workingHours);
        //   for(let i=1;i<=workingHours;i++){
        //     this.seriesData.push(3);
        //     iCount++;
        //   }
        // }
        if (this.lastDateTime > 0 && this.lastStatus == "OnSleep") {
          workingHours = this.diff_hours(this.lastDateTime, toDate);
          // console.log(workingHours+" :: "+new Date().getTime());
          for (let i = 1; i <= workingHours; i++) {
            this.seriesData.push(3);
            iCount++;
          }
        }
        if (this.lastDateTime > 0 && this.lastStatus == "OffDuty") {
          workingHours = this.diff_hours(this.lastDateTime, toDate);
          // console.log(workingHours);
          for (let i = 1; i <= workingHours; i++) {
            this.seriesData.push(4);
            iCount++;
          }
        }
        // if(this.lastDateTime>0 && this.lastStatus=="Voilation"){
        //   workingHours = this.diff_hours(this.lastDateTime,toDate);
        //   // console.log(workingHours);
        //   for(let i=1;i<=workingHours;i++){
        //     this.seriesData.push(6);
        //     iCount++;
        //   }
        // }

        // let cDate = this.datePipe.transform(sDate, 'yyyy-MM-dd HH:mm:ss');
        let currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        let cDate = this.datePipe.transform(currentDate + " 00:00:00", 'yyyy-MM-dd HH:mm:ss');
        // alert(cDate);
        let nextDate = this.datePipe.transform(new Date(cDate).setDate(new Date(cDate).getDate() + 1), 'yyyy-MM-dd HH:mm:ss');
        let time = new Date(nextDate).getTime() - new Date(cDate).getTime();  //msec
        let hoursDiff = time / (60 * 1000);
        // console.log(hoursDiff);
        let createTime;
        let createTimeInMin;
        for (let i = 0; i < hoursDiff; i++) {
          totalHourCount++;
          // createTime = new Date(cDate).setHours(new Date(cDate).getHours() + i);
          createTimeInMin = new Date(cDate).setMinutes(new Date(cDate).getMinutes() + i * 1);
          // createTime = this.datePipe.transform(new Date(createTime), 'HH:mm');
          createTimeInMin = this.datePipe.transform(new Date(createTimeInMin), 'HH:mm');
          //console.log(cDate+" :: "+nextDate+" :: "+createTimeInMin );
          this.dgDataObj.push(createTimeInMin);
        }

        // console.log(this.dgDataObj);
        // Highcharts.charts[0].xAxis[0].update({categories:this.dgDataObj}, true); //using without update flag
        this.chartOptions.xAxis.categories = this.dgDataObj;
        this.chartOptions.subtitle.text = employeeName;

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
      name: "Driver Status",
      data: this.seriesData,
      step: true,
      lineWidth: 3,
      marker: {
        enabled: false
      },
    });
    this.updateFlag = true;
  }

  CanvasGraphData(data) {
    // this.cValue = [{"date":"2024-12-20","event_end_time":"2024-12-20 07:41:11","id":1,"label":"DRIVE","lineColor":"","x":"2024-12-20 00:00:00","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 08:41:18","id":2,"label":"DRIVE","lineColor":"","x":"2024-12-20 07:41:11","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 12:04:26","id":3,"label":"DRIVE","lineColor":"","x":"2024-12-20 08:41:18","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 12:10:03","id":4,"label":"DRIVE","lineColor":"","x":"2024-12-20 12:04:26","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 14:43:51","id":5,"label":"OFF_DUTY","lineColor":"","x":"2024-12-20 12:10:03","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 15:15:34","id":6,"label":"START_DUTY","lineColor":"","x":"2024-12-20 14:43:51","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 15:15:34","id":7,"label":"SLEEP","lineColor":"","x":"2024-12-20 15:15:34","y":""},{"date":"2024-12-20","event_end_time":"2024-12-20 15:15:34","id":7,"label":"SLEEP","lineColor":"","x":"2024-12-20 15:15:34","y":""}];
    this.isGraphShow = true;
    this.cValue = [];
    let iCount = 0;
    let sDate, sDateTime, sLastDateTime, sLastStatus, sLabel;
    for (let objKey of Object.keys(data)) {
      let dataObj = data[objKey];
      if (objKey == "result") {
        for (let objKey1 of Object.keys(dataObj)) {
          // sDateTime = this.datePipe.transform(new Date(dataObj[objKey1].utcDateTime),"yyyy-MM-dd HH:mm:ss");
          if (dataObj[objKey1].isVoilation == 0) {
            sDateTime = this.getFormattedUTCDate(dataObj[objKey1].utcDateTime);
            // console.log(sDateTime);
            if (sLastDateTime != "" && (sLastStatus != "" && sLastStatus != null)) {
              // console.log(" >> "+sLastStatus);
              // console.log("sDate : "+sDateTime+" :: "+sLastDateTime+" :: "+sLastStatus);
              if (this.datePipe.transform(sDateTime, "yyyy-MM-dd") != this.datePipe.transform(sLastDateTime, "yyyy-MM-dd")) {
                if (this.datePipe.transform(sDateTime, "yyyy-MM-dd") == this.datePipe.transform(new Date(), "yyyy-MM-dd")) {

                } else {
                  sLastDateTime = this.datePipe.transform(sDateTime, "yyyy-MM-dd");
                  sLastDateTime = sLastDateTime + " 00:00:00";
                }
              }
              if (sLastStatus == "OnDuty") {
                sLabel = "START_DUTY";
                this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
              }
              else if (sLastStatus == "YardMove") {
                sLabel = "START_DUTY";
                this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
              }
              else if (sLastStatus == "OnDrive") {
                sLabel = "DRIVE";
                this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
              }
              else if (sLastStatus == "OnSleep") {
                sLabel = "SLEEP";
                this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
              }
              else if (sLastStatus == "OffDuty") {
                sLabel = "OFF_DUTY";
                this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
              } else if (sLastStatus == "PersonalUse") {
                sLabel = "OFF_DUTY";
                this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
              }
            }
            sLastDateTime = sDateTime;
            sLastStatus = dataObj[objKey1].status;
            sDate = this.datePipe.transform(sDateTime, "yyyy-MM-dd");
            iCount++;
          }
        }
      }
      if (sLastStatus == "OnDuty") {
        sLabel = "START_DUTY";
        this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
      }
      else if (sLastStatus == "YardMove") {
        sLabel = "START_DUTY";
        this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
      }
      else if (sLastStatus == "OnDrive") {
        sLabel = "DRIVE";
        this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
      }
      else if (sLastStatus == "OnSleep") {
        sLabel = "SLEEP";
        this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
      }
      else if (sLastStatus == "OffDuty") {
        sLabel = "OFF_DUTY";
        this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
      } else if (sLastStatus == "PersonalUse") {
        sLabel = "OFF_DUTY";
        this.cValue.push({ date: sDate, event_end_time: sDateTime, id: iCount, label: sLabel, lineColor: "", x: sLastDateTime, y: "", eventStatus: sLastStatus });
      }
    }
    // console.log("Data : "+JSON.stringify(this.cValue));
    this.LoadChart();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OnDuty': return 'badge badge-primary';
      case 'Voilation': return 'badge badge-danger';
      case 'OffDuty': return 'badge badge-warning';
      case 'OnDrive': return 'badge badge-success';
      case 'OnSleep': return 'badge badge-dark';
      case 'Break': return 'badge badge-secondary';
      case 'YardMove': return 'badge badge-primary';
      case 'PersonalUse': return 'badge badge-warning';
      default: return ''; // fallback
    }
  }

  getStatusLabel(status: string): string {
    if (status === 'YardMove') return 'YardMove (OnDuty)';
    if (status === 'PersonalUse') return 'PersonalUse (OffDuty)';
    return status;
  }

  getFormattedUTCDate(utcDateTime) {
    const timestamp = utcDateTime;
    // Create a Date object using the timestamp
    const date = new Date(timestamp);

    // Get the UTC components and manually format the date
    const utcYear = date.getUTCFullYear();
    const utcMonth = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const utcDate = date.getUTCDate().toString().padStart(2, '0');
    const utcHours = date.getUTCHours().toString().padStart(2, '0');
    const utcMinutes = date.getUTCMinutes().toString().padStart(2, '0');
    const utcSeconds = date.getUTCSeconds().toString().padStart(2, '0');

    // Format the UTC date string manually
    const formattedUTC = `${utcYear}-${utcMonth}-${utcDate} ${utcHours}:${utcMinutes}:${utcSeconds}`;
    // console.log(formattedUTC);
    return formattedUTC;
  }

  diff_hours(dt2, dt1) {
    var diff = (dt2 - dt1) / 1000;
    diff = diff / 60;
    // console.log("Diff : "+diff);
    // return Math.abs(diff);
    return Math.abs(Math.round(diff));
  }

  ngAfterViewInit() {
    console.log("here");
    Prism.highlightAll(); // Apply Prism.js syntax highlighting
  }

}
