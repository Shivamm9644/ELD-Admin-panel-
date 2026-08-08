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
import { DatePipe, formatDate } from '@angular/common';
import { ChartDataSets, ChartElementsOptions, ChartLineOptions } from 'chart.js';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import * as Highcharts from 'highcharts';

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
import { environment } from 'src/environments/environment';
import { none } from 'ol/centerconstraint';
// import { google } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-working-detail',
  templateUrl:'./working-detail.component.html',
  styleUrls: ['./working-detail.component.scss']
})
export class WorkingDetailComponent implements OnInit {
 
  showMyContainer: boolean = false;
   showMyContainerMap = false;
   showSecret = false;
   
  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private activatedRoute : ActivatedRoute,
    private datePipe : DatePipe
  ) { }

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
    this.ShowDLogReport(this.employeeId,"auto");
  }
  
  onToggleDisplay(){
    this.showSecret = !this.showSecret;
    //this.log.push(this.log.length + 1);
  }

  RefreshPage(){
    window.location.reload();
  }

  ShowEmployeeDetails(driverId,dateTime){
    // alert(">> "+driverId+" :: "+dateTime);
    // console.log(dateTime);
    if(dateTime!=""){
      this.router.navigate(['/form/log-driver/'+driverId+"/"+dateTime]);
    } else{
      // alert(">> "+driverId+" :: "+dateTime);
    }
  }
  
  CLIENT_ID=0;
  employeeId=0;
  vector;
  source;
  ngOnInit(){
    this.source = new VectorSource();
    this.employeeId=this.activatedRoute.snapshot.params.employeeId;
    // alert(" >> "+this.employeeId);
    this.CLIENT_ID = Number(localStorage.getItem("clientId"));
    this.ShowDLogReport(this.employeeId,"auto");
    this.onRefreshIntervalChange({ value: this.selectedRefreshInterval });
    this.vector = new VectorLayer({
      source: this.source,
      style: new Style({
          stroke: new Stroke({
            color: 'black',
            width: 5
          })
      })
    });

    this.LoadMap();
    this.GetData();

  }

  RedirectToDriverInfo(empId){
    alert("emp id : "+empId);
  }

  ShowDriverLog(){
    this.router.navigate(['/form/driver-logs/'+this.employeeId]);
  }

      fromDate;
      toDate;
      dvirDetails=[];
      rowData;
      isLoading : boolean=false;
      EMPLOYEE_NAME="";
      currentDate;
      nextDate;
      logDate="";
      logDataArr=[];
      isVoilation=false;
      isCertified=false;
      lastDateTime=0;
      lastStatus;
      breakHour=0;
      driveHour=0;
      DRIVER_NAME;
      MOBILE_NO;
      EMAIL;
      TRUCKNO;
      LDATE_TIME;
      STATUS;
      LATTITUDE_LONGITUDE;
      CUSTOM_LOCATION;
      TIME_ZONE;
      DEVICE_ID;
      BREAK_HOUR;
      DRIVE_HOUR;
      SHIFT_HOUR;
      CYCLE_HOUR;
      LOG_DATE_ARR=[];
      certifiedDateData=[];
      async ShowDLogReport(employeeId,auto){
        try {
          this.LOG_DATE_ARR=[];
          let iCount=0;
          let timezoneOffSet="+05:30"; let isData=false;
          let lDateTime=0, lastOnDriveDateTime=0, lastOnDriveStatus="";
          let sDateTime;
          this.logDataArr=[];
          this.logDate="";
          this.lastDateTime=0;
          this.isLoading = true;
          if(auto=="auto"){
            this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            this.currentDate = this.currentDate+" 23:59:59";
            this.toDate=this.currentDate;
            this.nextDate = new Date();
            this.nextDate.setDate( this.nextDate.getDate()-13);
            this.fromDate=this.datePipe.transform(this.nextDate, 'yyyy-MM-dd');
            this.fromDate=this.fromDate+" 00:00:00"
          }else{

          }
          
          const dlog= {
            'driverId' : employeeId,
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
                // console.log(objKey1);
                if(isData==false && dataObj[objKey1].timezoneOffSet!=""){
                  isData=true;
                  // console.log(dataObj[objKey1].timezoneOffSet);
                  timezoneOffSet = dataObj[objKey1].timezoneOffSet;
                }
                // console.log(dataObj[objKey1].dateTime);
                if(Number(objKey1)>0){
                  // console.log(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd')+" :: "+dataObj[objKey1].status);
                  lDateTime = new Date(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd HH:mm:ss')).getTime();
                  
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
                    // console.log(this.logDate);
                    this.logDataArr.push({driverId:employeeId,dateTime:this.logDate,workingHour:(sHrs+":"+sMins),voilation:this.isVoilation,certified:this.isCertified});
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
              // console.log(this.logDate);
              this.logDataArr.push({driverId:employeeId,dateTime:this.logDate,workingHour:(sHrs+":"+sMins),voilation:this.isVoilation,certified:this.isCertified}); 
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
          
          // console.log(this.LOG_DATE_ARR);
          const firstDate = this.LOG_DATE_ARR[0];
          const lastDate = this.LOG_DATE_ARR[this.LOG_DATE_ARR.length - 1];
          // console.log("here..."+timezoneOffSet);
          //timezoneOffSet="+05:30";
          timezoneOffSet = timezoneOffSet.replace(':', ''); 
          // console.log(" >> Timezone : "+timezoneOffSet);
          // console.log(lastDate+" :: "+formatDate(new Date(), "yyyy-MM-dd", "en-US", timezoneOffSet));
          const currentDayDate = formatDate(new Date(), "yyyy-MM-dd", "en-US", timezoneOffSet);

          const missingFirstWorkingDaysDate = this.getMissingDates(
            this.datePipe.transform(new Date(new Date(this.fromDate).getTime() - 86400000), 'yyyy-MM-dd'),
            firstDate
          );

          const missingLastWorkingDaysDate = this.getMissingDates(lastDate, currentDayDate);
          // console.log(missingLastWorkingDaysDate);
          const missingDates = this.findMissingDates(this.LOG_DATE_ARR);
          // console.log(this.LOG_DATE_ARR);
          // console.log(missingDates);
          // console.log(this.certifiedDateData);
          const allMissingDates = [...missingDates, ...missingLastWorkingDaysDate, ...missingFirstWorkingDaysDate];
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

          // console.log(this.rowData);
          let incCount=0;
          let iiCount = 0;
          if(this.rowData.length<=2){
            iiCount=1;
          }else{
            iiCount = this.rowData.length-1;
          }
          console.log(this.rowData);
          if(this.rowData.length>0){
            for(let i=0;i<this.rowData.length;i++){
              incCount++;
              if(incCount==iiCount){
                this.DRIVER_NAME = this.rowData[i].driverName;
                this.MOBILE_NO = this.rowData[i].mobileNo;
                this.EMAIL = this.rowData[i].email;
                this.TRUCKNO = this.rowData[i].truckNo;
                this.LDATE_TIME=(this.datePipe.transform(this.rowData[i].dateTime, 'yyyy-MM-dd HH:mm:ss'));
                this.STATUS = this.rowData[i].status;
                this.LATTITUDE_LONGITUDE = this.rowData[i].lattitude+" , "+this.rowData[i].longitude;
                this.CUSTOM_LOCATION = this.rowData[i].customLocation;
                this.TIME_ZONE=this.rowData[i].cycleUsaName;
                this.DEVICE_ID=(this.rowData[i].osVersion);
    
                this.BREAK_HOUR=this.rowData[i].onBreak;
                this.DRIVE_HOUR=this.rowData[i].onDriveTime;
                this.SHIFT_HOUR=this.rowData[i].onDutyTime;
                this.CYCLE_HOUR=this.rowData[i].weeklyTime;
              }
            }
          }
          this.isLoading = false;
          this.RecapReport();

          // alert("here");
          // await new Promise(resolve => setTimeout(() => resolve(this.ShowDLogReport(employeeId,auto)), 30000));

        } catch (error) {}
      }

      addMissingDateLogs(missingDates: string[], employeeId: number, sHrs: string, sMins: string): void {
        missingDates.forEach(date => {
          // console.log(date);
          let exists = this.certifiedDateData.includes(date);
          this.logDataArr.push({driverId: employeeId,dateTime: date,workingHour: `${sHrs}:${sMins}`,voilation: false,certified: exists});
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

      recapDataArr=[];
      onDutyHour=0;
      totalWorkingHour="00:00";
      async RecapReport() {
        try {
          this.LOG_DATE_ARR = [];
          let timezoneOffSet = "+05:30"; let isData = false;
          let lDateTime = 0, lastOnDutyDateTime = 0, lastOnDutyStatus = "";
          let sDateTime;
          this.recapDataArr = [];
          this.logDate = "";
          this.lastDateTime = 0;
          this.isLoading = true;

          this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
          this.currentDate = this.currentDate + " 23:59:59";
          this.toDate = this.currentDate;
          this.nextDate = new Date();
          this.nextDate.setDate(this.nextDate.getDate() - 7);
          this.fromDate = this.datePipe.transform(this.nextDate, 'yyyy-MM-dd');
          this.fromDate = this.fromDate + " 00:00:00";

          const dlog = {
            'driverId': this.employeeId,
            'fromDate': this.fromDate,
            'toDate': this.toDate,
            'email': ""
          };
          // console.log(dlog);
          const data: any = await this.request.post('/dispatch/view_drivering_status_for_graph/', dlog);
          console.log(data);
          for (let objKey of Object.keys(data)) {
            let dataObj = data[objKey];
            if (objKey == "result") {

              const keys = Object.keys(dataObj).filter(k => Number(k) > 0);
              let startIndex = 0;
              if (keys.length > 1) {
                const firstDate = this.datePipe.transform(dataObj[keys[0]].dateTime, 'yyyy-MM-dd');
                const secondDate = this.datePipe.transform(dataObj[keys[1]].dateTime, 'yyyy-MM-dd');
                if (firstDate !== secondDate) {
                  startIndex = 1;
                }
              }
              console.log("Index : "+startIndex);
              for (let objKey1 of Object.keys(dataObj)) {
                if (Number(objKey1) >= startIndex) {
                  lDateTime = new Date(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd HH:mm:ss')).getTime();
                  if (isData == false && dataObj[objKey1].timezoneOffSet != "") {
                    isData = true;
                    timezoneOffSet = dataObj[objKey1].timezoneOffSet;
                  }
                  console.log(lastOnDutyStatus+ " : "+sDateTime);
                  if (this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd') != this.logDate && this.logDate != "") {
                    
                    if (lastOnDutyStatus == "OnDuty" || lastOnDutyStatus == "OnDrive") {
                      let cDate1 = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                      let cDate2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                      if (cDate1 != cDate2) {
                        let lastDayDateTime = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                        lastDayDateTime = lastDayDateTime + " 23:59:59";
                        let timestamp = new Date(lastDayDateTime).getTime();
                        this.onDutyHour += Number(this.diff_hours(lastOnDutyDateTime, timestamp));
                      } else {
                        let timestamp = new Date().getTime();
                        this.onDutyHour += Number(this.diff_hours(lastOnDutyDateTime, timestamp));
                      }
                    }

                    let sHrs, sMins;
                    if (this.onDutyHour > 0) {
                      var hrs = Math.floor(this.onDutyHour / 60);
                      var min = this.onDutyHour % 60;
                      sHrs = hrs.toString().length == 1 ? "0" + hrs : hrs;
                      sMins = min.toString().length == 1 ? "0" + min : min;
                    } else {
                      sHrs = "00"; sMins = "00";
                    }
                    this.recapDataArr.push({ dateTime: this.logDate, workingHour: (sHrs + ":" + sMins) });
                    this.onDutyHour = 0;
                  }
                  this.logDate = this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd');

                  // ✅ UPDATED BLOCK
                  if (lastOnDutyDateTime > 0 && (
                    lastOnDutyStatus == "OnDrive" ||
                    lastOnDutyStatus == "OnDuty" ||
                    lastOnDutyStatus == "OnSleep" ||
                    lastOnDutyStatus == "OffDuty")) {

                    if (dataObj[objKey1].isVoilation == 0) {
                      let cDate1 = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                      let cDate2 = this.datePipe.transform(new Date(lDateTime), 'yyyy-MM-dd');

                      if (cDate1 != cDate2) {
                        let lastDayDateTime = this.datePipe.transform(new Date(lDateTime), 'yyyy-MM-dd');
                        lastDayDateTime = lastDayDateTime + " 00:00:00";
                        let timestamp = new Date(lastDayDateTime).getTime();
                        let diffMins = Number(this.diff_hours(timestamp, lDateTime));

                        if (lastOnDutyStatus == "OffDuty" || lastOnDutyStatus == "OnSleep") {
                          if (diffMins < 120) {
                            this.onDutyHour += diffMins;
                          }
                        } else {
                          this.onDutyHour += diffMins;
                        }
                        lastOnDutyDateTime = 0;
                        lastOnDutyStatus = "";
                      } else {
                        let diffMins = Number(this.diff_hours(lastOnDutyDateTime, lDateTime));
                        if (lastOnDutyStatus == "OffDuty" || lastOnDutyStatus == "OnSleep") {
                          if (diffMins < 120) {
                            this.onDutyHour += diffMins;
                          }
                        } else {
                          this.onDutyHour += diffMins;
                        }
                        lastOnDutyDateTime = 0;
                        lastOnDutyStatus = "";
                      }
                    }
                  }

                  if (dataObj[objKey1].status == "OnDuty" || dataObj[objKey1].status == "OnDrive" ||
                      dataObj[objKey1].status == "OnSleep" || dataObj[objKey1].status == "OffDuty" ||
                      dataObj[objKey1].status == "PersonalUse" || dataObj[objKey1].status == "YardMove") {
                    lastOnDutyDateTime = lDateTime;
                    if(dataObj[objKey1].status=="PersonalUse"){
                      dataObj[objKey1].status = "OffDuty";
                    }else if(dataObj[objKey1].status=="YardMove"){
                      dataObj[objKey1].status = "OnDuty";
                    }
                    lastOnDutyStatus = dataObj[objKey1].status;
                    sDateTime = dataObj[objKey1].dateTime;
                  }

                  this.lastStatus = dataObj[objKey1].status;
                  this.lastDateTime = lDateTime;
                }
              }

              let sHrs, sMins;
              if (lastOnDutyStatus == "OnDuty" || lastOnDutyStatus == "OnDrive") {
                let cDate1 = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                let cDate2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                if (cDate1 != cDate2) {
                  let lastDayDateTime = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                  lastDayDateTime = lastDayDateTime + " 23:59:59";
                  let timestamp = new Date(lastDayDateTime).getTime();
                  this.onDutyHour += Number(this.diff_hours(lastOnDutyDateTime, timestamp));
                } else {
                  let timestamp = new Date().getTime();
                  this.onDutyHour += Number(this.diff_hours(lastOnDutyDateTime, timestamp));
                }
              }

              if (this.onDutyHour > 0) {
                var hrs = Math.floor(this.onDutyHour / 60);
                var min = this.onDutyHour % 60;
                sHrs = hrs.toString().length == 1 ? "0" + hrs : hrs;
                sMins = min.toString().length == 1 ? "0" + min : min;
              } else {
                sHrs = "00"; sMins = "00";
              }
              this.recapDataArr.push({ dateTime: this.logDate, workingHour: (sHrs + ":" + sMins) });
              this.onDutyHour = 0;
              lastOnDutyDateTime = 0;
              lastOnDutyStatus = "";
            }
          }

          this.isLoading = false;

          this.recapDataArr.forEach(log => {
            this.LOG_DATE_ARR.push(log.dateTime);
          });

          const lastDate = this.LOG_DATE_ARR[this.LOG_DATE_ARR.length - 1];

          timezoneOffSet = timezoneOffSet.replace(':', '');
          const currentDayDate = formatDate(new Date(), "yyyy-MM-dd", "en-US", timezoneOffSet);

          const firstDate = this.LOG_DATE_ARR[0];
          const missingFirstWorkingDaysDate = this.getMissingDates(
            this.datePipe.transform(new Date(new Date(this.fromDate).getTime() - 86400000), 'yyyy-MM-dd'),
            firstDate
          );

          const missingLastWorkingDaysDate = this.getMissingDates(lastDate, currentDayDate);
          const missingDates = this.findMissingDates(this.LOG_DATE_ARR);
          const allMissingDates = [...missingDates, ...missingLastWorkingDaysDate, ...missingFirstWorkingDaysDate];

          allMissingDates.forEach(date => {
            this.recapDataArr.push({ dateTime: date, workingHour: ("00" + ":" + "00") });
          });

          this.recapDataArr = this.removeDuplicates(this.recapDataArr);

          this.recapDataArr.sort(function (a, b) {
            if (a.dateTime > b.dateTime) return -1;
            if (a.dateTime < b.dateTime) return 1;
            return 0;
          });

          let totalMinutes = 0;
          this.recapDataArr.forEach(item => {
            const [hrs, mins] = item.workingHour.split(':').map(Number);
            totalMinutes += (hrs * 60) + mins;
          });

          const totalHours = Math.floor(totalMinutes / 60);
          const totalRemainingMinutes = totalMinutes % 60;

          let formattedHours = totalHours < 10 ? '0' + totalHours : totalHours.toString();
          let formattedMinutes = totalRemainingMinutes < 10 ? '0' + totalRemainingMinutes : totalRemainingMinutes.toString();

          this.totalWorkingHour = `${formattedHours}:${formattedMinutes}`;

        } catch (error) { }
      }

      async RecapReport_old(){
        try {
          this.LOG_DATE_ARR=[];
          let timezoneOffSet="+05:30"; let isData=false;
          let lDateTime=0, lastOnDutyDateTime=0, lastOnDutyStatus="";
          let sDateTime;
          this.recapDataArr=[];
          this.logDate="";
          this.lastDateTime=0;
          this.isLoading = true;
          
          this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
          this.currentDate = this.currentDate+" 23:59:59";
          this.toDate=this.currentDate
          this.nextDate = new Date();
          this.nextDate.setDate( this.nextDate.getDate()-7);
          this.fromDate=this.datePipe.transform(this.nextDate, 'yyyy-MM-dd');
          this.fromDate=this.fromDate+" 00:00:00"
          
          const dlog= {
            'driverId' : this.employeeId,
            'fromDate' : this.fromDate,
            'toDate' : this.toDate,
            'email': "" 
          };
          console.log(dlog);
          const data: any = await this.request.post('/dispatch/view_drivering_status_for_graph/',dlog);

          for (let objKey of Object.keys(data)) {
            let dataObj = data[objKey];
            if(objKey=="result"){
              for (let objKey1 of Object.keys(dataObj)) {
                if(Number(objKey1)>0){
                  // console.log(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd')+" :: "+dataObj[objKey1].status);
                  lDateTime = new Date(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd HH:mm:ss')).getTime();
                  if(isData==false && dataObj[objKey1].timezoneOffSet!=""){
                    isData=true;
                    timezoneOffSet = dataObj[objKey1].timezoneOffSet;
                  }
                  if(this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd')!=this.logDate && this.logDate!=""){
                    // console.log(" >> "+this.logDate+" :: "+this.onDutyHour);
                    // console.log(" >> "+this.logDate+" :: "+lastOnDutyStatus+" :: "+lastOnDutyDateTime);
                    if(lastOnDutyStatus=="OnDuty" || lastOnDutyStatus=="OnDrive"){
                      let cDate1 = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                      let cDate2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                      // console.log(" >> "+cDate1+" :: "+cDate2);
                      if(cDate1!=cDate2){
                        let lastDayDateTime = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                        lastDayDateTime = lastDayDateTime+" 23:59:59";
                        let timestamp = new Date(lastDayDateTime).getTime();
                        console.log(" >> "+timestamp+" :: "+lastOnDutyDateTime);
                        this.onDutyHour+=Number(this.diff_hours(lastOnDutyDateTime,timestamp));
                      }else{
                        let timestamp = new Date().getTime();
                        // console.log(" >> "+timestamp+" :: "+lastOnDutyDateTime);
                        this.onDutyHour+=Number(this.diff_hours(lastOnDutyDateTime,timestamp));
                      }
                    }
                    let sHrs, sMins;
                    console.log(" Hour : "+this.onDutyHour);
                    if(this.onDutyHour>0){
                      var hrs = Math.floor(this.onDutyHour / 60);
                      var min = this.onDutyHour % 60;
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
                    console.log(" >> "+(sHrs+":"+sMins));
                    this.recapDataArr.push({dateTime:this.logDate,workingHour:(sHrs+":"+sMins)});
                    this.onDutyHour=0;
                    // lastOnDutyDateTime=0;
                    // lastOnDutyStatus = "";
                  }
                  this.logDate = this.datePipe.transform(dataObj[objKey1].dateTime, 'yyyy-MM-dd');
                  
                  // console.log(" >> "+this.logDate+" :: "+dataObj[objKey1].status);
                  if(lastOnDutyDateTime>0 && (lastOnDutyStatus=="OnDrive" || lastOnDutyStatus=="OnDuty" || lastOnDutyStatus=="OnSleep" || lastOnDutyStatus=="OffDuty")){
                    if(dataObj[objKey1].isVoilation==0){
                      let cDate1 = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                      let cDate2 = this.datePipe.transform(new Date(lDateTime), 'yyyy-MM-dd');
                      // console.log(" >> "+cDate1+" :: "+cDate2);
                      if(cDate1!=cDate2){
                        let lastDayDateTime = this.datePipe.transform(new Date(lDateTime), 'yyyy-MM-dd');
                        lastDayDateTime = lastDayDateTime+" 00:00:00";
                        let timestamp = new Date(lastDayDateTime).getTime();
                        // console.log( " >> Time : "+timestamp+" :: "+lDateTime);
                        this.onDutyHour+=Number(this.diff_hours(timestamp,lDateTime));
                        lastOnDutyDateTime = 0;
                        lastOnDutyStatus = "";
                      }else{
                        // console.log(" >> "+lastOnDutyDateTime+" :: "+lDateTime);
                        this.onDutyHour+=Number(this.diff_hours(lastOnDutyDateTime,lDateTime));
                        lastOnDutyDateTime = 0;
                        lastOnDutyStatus = "";
                      }
                    }
                  }
                  
                  if(dataObj[objKey1].status=="OnDuty" || dataObj[objKey1].status=="OnDrive"){
                    lastOnDutyDateTime = lDateTime;
                    lastOnDutyStatus = dataObj[objKey1].status;
                    sDateTime = dataObj[objKey1].dateTime;
                  }

                  this.lastStatus = dataObj[objKey1].status;
                  this.lastDateTime =lDateTime;
                }
                

              }
              let sHrs, sMins;
              // console.log(" >> "+this.logDate+" :: "+this.onDutyHour);
              if(lastOnDutyStatus=="OnDuty" || lastOnDutyStatus=="OnDrive"){
                // let lastDayDateTime = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                // lastDayDateTime = lastDayDateTime+" 23:59:59";
                // let timestamp = new Date(lastDayDateTime).getTime();
                // // console.log(" >> "+timestamp+" :: "+lastOnDutyDateTime);
                // this.onDutyHour+=Number(this.diff_hours(lastOnDutyDateTime,timestamp));

                // console.log(" >> "+sDateTime+" :: "+lastOnDutyDateTime);
                let cDate1 = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                let cDate2 = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                // console.log(" >> "+cDate1+" :: "+cDate2);
                if(cDate1!=cDate2){
                  let lastDayDateTime = this.datePipe.transform(sDateTime, 'yyyy-MM-dd');
                  lastDayDateTime = lastDayDateTime+" 23:59:59";
                  let timestamp = new Date(lastDayDateTime).getTime();
                  // console.log(" >> "+timestamp+" :: "+lastOnDutyDateTime);
                  this.onDutyHour+=Number(this.diff_hours(lastOnDutyDateTime,timestamp));
                }else{
                  let timestamp = new Date().getTime();
                  this.onDutyHour+=Number(this.diff_hours(lastOnDutyDateTime,timestamp));
                }
                
              }
              console.log(" Hour >>: "+this.onDutyHour);
              if(this.onDutyHour>0){
                var hrs = Math.floor(this.onDutyHour / 60);
                var min = this.onDutyHour % 60;
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
              this.recapDataArr.push({dateTime:this.logDate,workingHour:(sHrs+":"+sMins)});
              this.onDutyHour=0;
              lastOnDutyDateTime=0;
              lastOnDutyStatus = "";
              // console.log(this.logDataArr);
            }
          }
          this.isLoading = false;

          this.recapDataArr.forEach(log => {
            // console.log('Date:', log.dateTime);
            this.LOG_DATE_ARR.push(log.dateTime);
          });

          const lastDate = this.LOG_DATE_ARR[this.LOG_DATE_ARR.length - 1];

          timezoneOffSet = timezoneOffSet.replace(':', ''); 
          // console.log(" >> Timezone : "+timezoneOffSet);
          // console.log(lastDate+" :: "+formatDate(new Date(), "yyyy-MM-dd", "en-US", timezoneOffSet));
          const currentDayDate = formatDate(new Date(), "yyyy-MM-dd", "en-US", timezoneOffSet);

          const firstDate = this.LOG_DATE_ARR[0];
          const missingFirstWorkingDaysDate = this.getMissingDates(
            this.datePipe.transform(new Date(new Date(this.fromDate).getTime() - 86400000), 'yyyy-MM-dd'),
            firstDate
          );

          const missingLastWorkingDaysDate = this.getMissingDates(lastDate, currentDayDate);

          const missingDates = this.findMissingDates(this.LOG_DATE_ARR);
          // console.log(this.LOG_DATE_ARR);
          // console.log(missingDates);
          const allMissingDates = [...missingDates, ...missingLastWorkingDaysDate, ...missingFirstWorkingDaysDate];

          allMissingDates.forEach(date => {
            this.recapDataArr.push({dateTime: date,workingHour: ("00"+":"+"00")});
          });

          this.recapDataArr = this.removeDuplicates(this.recapDataArr);

          this.recapDataArr.sort(function(a, b) {
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
          // console.log(this.rowData);

          let totalMinutes = 0;
          this.recapDataArr.forEach(item => {
            const [hrs, mins] = item.workingHour.split(':').map(Number);
            totalMinutes += (hrs * 60) + mins;
          });
          // Convert total minutes back to HH:mm
          const totalHours = Math.floor(totalMinutes / 60);
          const totalRemainingMinutes = totalMinutes % 60;

          let formattedHours = totalHours < 10 ? '0' + totalHours : totalHours.toString();
          let formattedMinutes = totalRemainingMinutes < 10 ? '0' + totalRemainingMinutes : totalRemainingMinutes.toString();

          this.totalWorkingHour = `${formattedHours}:${formattedMinutes}`;


        } catch (error) {}
      }

      diff_hours(dt2, dt1) {
        var diff =(dt2 - dt1) / 1000;
        diff = diff/60;
        // console.log("Diff : "+diff);
        // return Math.abs(diff);
        return Math.abs(Math.round(diff));
      }
      
      loading=false;
      map: Map;
      googleLayerHybrid:any;
      googleLayerHybrid2:any;
      public anchors;
      container1; content1; closer1; overlay1;
      LoadMap(){
        this.googleLayerHybrid2 = new TileLayer({
          source: new XYZ({
            //url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            url: 'http://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
          })
        });
    
        this.googleLayerHybrid = new TileLayer({
          source: new XYZ({
            url: 'http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
          })
        });
    
        /* Elements that make up the popup. */
        // this.container = $("#popup").val(); //document.getElementById('popup');
        // this.content = $("#popup-content").val(); //document.getElementById('popup-content');
        // this.closer = $("#popup-closer").val(); //document.getElementById('popup-closer');
    
        this.container1 = document.getElementById('popup');
        this.content1 = document.getElementById('popup-content');
        this.closer1 = document.getElementById('popup-closer');
    
    
        this.closer1.onclick = function () {
          // this.overlay1.setPosition(undefined);
          // this.closer1.blur();
          return false;
        };
    
        this.overlay1 = new Overlay({
          element: this.container1,
          autoPan: true,
          autoPanAnimation: {
            duration: 250,
          },
        });
    
        this.map = new Map({
          target: 'map',
          overlays: [this.overlay1],
          layers: [this.googleLayerHybrid2,this.vector],
          view: new View({
            // center: fromLonLat([75.896823, 22.74764]),
            center: fromLonLat([0, 0]),
            zoom: 0,
            minZoom: 0,
            maxZoom: 25
          }),
        });

        $("#map_section").css({'display':'none'});

        this.map.on('singleclick', function(evt){
          //alert(evt.coordinate);
          let feature = evt.map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer){
              return feature;
          });
          if (feature){
            //alert(feature.get('type'));
            if(feature.get('type')=="device_position"){
              $("#popup").css("width", "500px");
              let device_id=feature.get('MAC'); 
              // alert(" >> "+device_id);
              let device_icon=feature.get('device_icon');
              let placeAddress=feature.get('placeAddress');
             
              let device_name=feature.get('vehicleName');
              let lat_lng=feature.get('lat')+" "+feature.get('lon');
              let deviceStatus=feature.get('movingMessage');
    
              let driverName=feature.get('driverName');
              let mobileNo=feature.get('mobileNo');
    
              let dateTime=feature.get('dateTime');
              let speed=feature.get('speed');
              let device_information;
              
              let dataDate = new Date(dateTime);
              let curDate = new Date();
              let diff;
              if(dataDate < curDate){
                let delta = (curDate.getTime() - dataDate.getTime())/1000;
                // calculate (and subtract) whole days
                let days = Math.floor(delta / 86400);
                delta -= days * 86400;
                // calculate (and subtract) whole hours
                let hours = Math.floor(delta / 3600) % 24;
                delta -= hours * 3600;
                // calculate (and subtract) whole minutes
                let minutes = Math.floor(delta / 60) % 60;
                delta -= minutes * 60;
    
                // what's left is seconds
                let seconds = Math.floor(delta % 60);
                if(days==0){
                  diff=days+"days ";
                  // if(hours!=0) diff+=hours+"hrs ";
                }
                if(days!=0){
                  diff=days+"days ";
                  // if(hours!=0) diff+=hours+"hrs ";
                }
                else if(hours!=0)
                { 
                  diff+=hours+"hrs ";
                  if(minutes!=0) diff+=minutes+"mins ";
                }else{
                  if(minutes!=0) diff+=minutes+"mins ";
                  diff+=seconds+"secs";  
                }
              }else{
                diff=0;
              }
    
              let sDateTime = feature.get('sDateTime');    
              device_information=`
                    <div id="device_map_popup" style="font-size:12px;">
                      <div style="border: 1px solid #C0C0C0;margin: -1px;">
                        <div class="row" style="padding-top:18px;">
                          <div class="col-lg-1 text-right"><img id="icon" width="25" height="25" src="`+device_icon+`"></div>
                          <div class="col-lg-7 text-left"><h6 class="modal-title" id="device_detail_heading">`+device_name+`</h6></div>
                          
                          <div class="col-lg-4 text-right">
                            <span id="device_datetime_diff">`+diff+` ago</span><br/>
                            <span id="device_datetime">`+sDateTime+`<span>
                          </div>
                        </div>
                      </div>
                      <div style="border: 1px solid #C0C0C0;margin: -1px;">
                        <div style="padding:10px;font-size:1.1em" id="device_address">`+placeAddress+`</div>
                      </div>
                      <div style="border: 1px solid #C0C0C0; margin:-1px;" class="row">
                        <div style="border: 1px solid #C0C0C0; margin-top:-1px;margin-bottom:-1px;margin-left:-1px; padding-right:1px;" class="col-lg-6"><div style="padding-top:0px;" class="text-center" id="device_speed">`+speed+`</div></div>
                        <!--div style="border: 1px solid #C0C0C0;margin-top:-1px;margin-bottom:-1px;margin-left:-1px;" class="col-lg-3"><div style="padding-top:5px;" class="text-center font-weight-bold" id="device_moving_status">`+deviceStatus+`</div></div>
                        <div style="border: 1px solid #C0C0C0;margin-top:-1px;margin-bottom:-1px;margin-left:-1px; padding-right:1px;" class="col-lg-3"><div style="padding-top:10px;" class="text-center" id="device_satellites">`+0+`</div></div-->
                        <div style="border: 1px solid #C0C0C0;margin-top:-1px;margin-bottom:-1px;margin-left:-1px;border-right-style: none;" class="col-lg-6"><div class="text-center" id="device_latlng">`+lat_lng+`</div></div>
                      </div>
                     <div style="border: 1px solid #C0C0C0;margin: -1px;" class="row">
                        <div style="font-size:1.2em">&nbsp;&nbsp;
                          <span id="device_detail_name">
                            <b>ID:</b>`+device_id+`
                          </span>
                        </div>
                      </div>
    
                      <!-- <div style="border: 1px solid #C0C0C0; margin:-1px;" class="row">
                      <div style="border: 1px solid #C0C0C0; margin-top:-1px;margin-bottom:-1px;margin-left:-1px; padding-right:1px;" class="col-lg-4"><div id="device_detail_name"><b>ID:</b>`+device_id+`</div></div>
                      <div style="border: 1px solid #C0C0C0;margin-top:-1px;margin-bottom:-1px;margin-left:-1px;" class="col-lg-8"><div id="device_direction_name"><b>Destination:</b></div></div>
                      </div>-->
                      
                      <div style="border: 1px solid #C0C0C0;margin: -1px;" class="row">
                        <div style="font-size:1.2em">&nbsp;&nbsp;
                          <span id="driver_ward_detail">
                            <b>Driver: </b>`+driverName+`(`+mobileNo+`)
                          </span>
                        </div>
                      </div>
    
    
                    </div>`;  
            
              let coordinate = evt.coordinate;
              let hdms = toStringHDMS(coordinate);
              this.content1.innerHTML = device_information; 
              this.overlay1.setPosition(coordinate);  
    
            } else{

            }
          }
        });
    
      }

      NormalAndSatelliteMap(){
        if ($('#satellite_map').is(':checked')) {
            this.map.removeLayer(this.googleLayerHybrid2);
            this.map.addLayer(this.googleLayerHybrid);
        } else {
            this.map.removeLayer(this.googleLayerHybrid);
            this.map.addLayer(this.googleLayerHybrid2);
        }
    }
    
      device_status_icon;
      LAST_LAT:any;
      LAST_LNG:any;
      VEHICLE_LIST:any=[];
      LAST_LAT_MAP = new Array();
      LAST_LNG_MAP = new Array();
      errorMessage;
      isError;
      isDataFound=false;
      async GetData_old(){
        try {
          this.isDataFound=false;
          let headers = new HttpHeaders();
          //this is the important step. You need to set content type as null
          headers.set('Content-Type', null);
          headers.set('Accept', "multipart/form-data");
          let params = new HttpParams();
    
          await this.http.post(environment.apiBaseUrl + '/dispatch/view_live_data_log', { params, headers }).subscribe((res) => {
            // console.log(res);
            for (let objKey of Object.keys(res)) {
              if(objKey=="result"){
                let dataObj = res[objKey]
                for (let objKey1 of Object.keys(dataObj)) {
                  // console.log(dataObj[objKey1].MAC);
                  // alert(this.employeeId);
                  if(this.employeeId==Number(dataObj[objKey1].DriverId)){
                    this.LAST_LAT=dataObj[objKey1].Lattitude;
                    this.LAST_LNG=dataObj[objKey1].Longitude;
                    this.isDataFound=true;
                    // if(this.LAST_LAT>0 && this.LAST_LNG>0){
                      this.ShowMarker(dataObj[objKey1].MAC,parseFloat(dataObj[objKey1].Lattitude),parseFloat(dataObj[objKey1].Longitude),dataObj[objKey1].SerialNo,dataObj[objKey1].DateTime,this.LAST_LAT,this.LAST_LNG,dataObj[objKey1].Speed,dataObj[objKey1].PlaceAddress,dataObj[objKey1].VehicleName,dataObj[objKey1].DriverName,dataObj[objKey1].mobileNo);
                    // }
                  }
                }
              }
            }
            if(!this.isDataFound){
              if (this.overlay1) {
                let html = `<div style="font-size:32px;"><strong>No Data Found</strong></div>`;
                this.content1.innerHTML = html; 
                this.overlay1.setPosition(transform([0, 0], 'EPSG:4326','EPSG:3857'));
              }
            }
          },
          (error) => {
            this.isError = true;
            if (error) {
              this.errorMessage = error.status == 401? 'Unauthorized Error' : error.message;
            } else {
              this.errorMessage = 'Server Not Response';
            }
          });
        } catch (error) {}
    
        await new Promise(resolve => setTimeout(() => resolve(this.GetData()), 500));
      }

      async GetData(){
        try {
          this.isDataFound=false;
          const liveData = {
            'clientId':Number(localStorage.getItem("clientId")),
          };
          const data: any = await this.request.post('/dispatch/view_live_data_log/',liveData);

          for (let objKey of Object.keys(data)) {
            let dataObj = data[objKey];
            if(objKey=="result"){
              for (let objKey1 of Object.keys(dataObj)) {
                if(this.employeeId==Number(dataObj[objKey1].DriverId)){
                  this.LAST_LAT=dataObj[objKey1].Lattitude;
                  this.LAST_LNG=dataObj[objKey1].Longitude;
                  this.isDataFound=true;
                  this.ShowMarker(dataObj[objKey1].MAC,parseFloat(dataObj[objKey1].Lattitude),parseFloat(dataObj[objKey1].Longitude),dataObj[objKey1].SerialNo,dataObj[objKey1].DateTime,this.LAST_LAT,this.LAST_LNG,dataObj[objKey1].Speed,dataObj[objKey1].PlaceAddress,dataObj[objKey1].VehicleName,dataObj[objKey1].DriverName,dataObj[objKey1].mobileNo);
                }
              }
            }
          }
          if(!this.isDataFound){
            if (this.overlay1) {
              let html = `<div style="font-size:32px;"><strong>No Data Found</strong></div>`;
              this.content1.innerHTML = html; 
              this.overlay1.setPosition(transform([0, 0], 'EPSG:4326','EPSG:3857'));
            }
          }
         
        } catch (error) {}
    
        await new Promise(resolve => setTimeout(() => resolve(this.GetData()), 500));
      }
    
      dataDate:any;
      curDate:any;
      delta:any;
      vectorLayer:any=[];
      degree:any;
      isShowVehicle=false;
      ShowMarker(MAC,lat,lon,serialNo,dateTime,last_lat,last_lng,speed,placeAddress,vehicleName,driverName,mobileNo){
        if(lat==0 || lon==0) return;
        let centerPoint = transform([lon, lat], 'EPSG:4326','EPSG:3857');
        /*--------------Calculating Time----------------------*/
        this.dataDate = new Date(dateTime);
        this.curDate = new Date();
        this.delta = (this.curDate - this.dataDate)/1000;
    
        // calculate (and subtract) whole days
        let days = Math.floor(this.delta / 86400);
        this.delta -= days * 86400;
    
        // calculate (and subtract) whole hours
        let hours = Math.floor(this.delta / 3600) % 24;
        this.delta -= hours * 3600;
    
        // calculate (and subtract) whole minutes
        let minutes = Math.floor(this.delta / 60) % 60;
        this.delta -= minutes * 60;
    
        // what's left is seconds
        let seconds = this.delta % 60;
        seconds += minutes*60;
        /*---------------------------calculation---------------------------------*/
        //$('#left_footer').text(lat+" = "+last_lng+" :: "+lng+" : "+last_lng);
        // alert(MAC);
    
        
        // let lDatetime=new Date(Number(dateTime)).toLocaleDateString("en-us");
        let sDateTime = this.datePipe.transform(Number(dateTime), 'dd-MM-yyyy HH:mm:ss');
    
        let iconFeature = new Feature({
          type:"device_position",
          geometry: new Point(centerPoint),
          MAC: MAC,
          placeAddress:placeAddress,
          vehicleName:vehicleName,
          driverName:driverName,
          mobileNo:mobileNo,
          serialNo:serialNo,
          movingMessage:"Moving(Test..)",
          lat:lat,
          lon:lon,
          dateTime:dateTime,
          speed:speed,
          sDateTime:sDateTime,
          device_icon: "assets/icon/bus.png",
          all_device_data: this.VEHICLE_LIST,
          population: 4000,
          rainfall: 500
        });
        
        let opacity=1;
        let icon;
        let offsetY=-15;
        // if(seconds<3600){
            // icon = 'assets/icon/user.png';
            icon = 'assets/icon/bus.png';
        // }else{
        //     icon = 'assets/icon/277.png';
        // }
        let iconStyle = new Style({
            image: new Icon(({
                anchor: [0.5, 15],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: opacity,
                offset:[0,0],
                src: icon
            })),
            text: new Text({
                font: 'bold 12px verdana,Calibri,sans-serif',
                fill: new Fill({ color: '#F00' }),
                offsetY: offsetY,
                stroke: new Stroke({
                    color: '#fff', width: 1
                }),
                text: serialNo
            })
        });
    
        iconFeature.setStyle(iconStyle);
        
        let vectorSource = new VectorSource({
          features: [iconFeature]
        });
        
        //bus_no = device_id;
        let bShow=true;
        /*if(lat-last_lat==0 && lon-last_lng==0){
            if(vectorLayer[bus_no]===null){
                bShow=true;
            }
        }else{
            bShow=true;
        }*/
       
        if(bShow){
            if(this.vectorLayer[serialNo]!==null){
              this.map.removeLayer(this.vectorLayer[serialNo]);
            }
    
            this.vectorLayer[serialNo] = new VectorLayer({
              source: vectorSource
            });
    
            this.map.addLayer(this.vectorLayer[serialNo]);   
    
        }
        speed = parseFloat(speed);

        if(this.isShowVehicle==false){
          let mapcenter = transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857');
          this.map.setView(new View({
           center: mapcenter,
           zoom: 12,
           minZoom: 2,
           maxZoom: 20
         }));
        }
        this.isShowVehicle=true;

        this.ShowDirection(MAC,lat,lon,serialNo,dateTime,last_lat,last_lng,seconds,speed);
      }
    
      geo = {
        bearing : function (lat1,lng1,lat2,lng2){
            let dLon = this._toRad(lng2-lng1);
            let y = Math.sin(dLon) * Math.cos(this._toRad(lat2));
            let x = Math.cos(this._toRad(lat1))*Math.sin(this._toRad(lat2)) - Math.sin(this._toRad(lat1))*Math.cos(this._toRad(lat2))*Math.cos(dLon);
            let brng = this._toDeg(Math.atan2(y, x));
            return ((brng + 360) % 360);
        },
        _toRad : function(deg) {
             return deg * Math.PI / 180;
        },
        _toDeg : function(rad) {
            return rad * 180 / Math.PI;
        }
      };
    
      ShowDirection(MAC,lat,lon,serialNo,dateTime,last_lat,last_lng,seconds,speed){
        // alert(lat+","+lon+" :: "+last_lat+","+last_lng);
        try{
          serialNo = serialNo +"-direction";
        
         let icon;
          if(this.vectorLayer[serialNo]!==null){
            this.map.removeLayer(this.vectorLayer[serialNo]);
          } 
         
         icon = 'assets/images/E.png';
         if(isNaN(last_lat)) return;
         
         if(speed < 4) return;
         
         if(lat==last_lat && lon==last_lng) return;
         
         this.degree =this.geo.bearing(lat,lon,last_lat,last_lng);
         //let degree=360;
        //  alert(" >> Degree : "+this.degree);
         this.degree = Math.round(this.degree);
         if(this.degree<=0) return; 
         
         let rotation=0;
         let offsetX=0;
         let offsetY=0;
         let anchorX;
         let anchorY;
         switch(true){
             case this.degree>=1 && this.degree <=23:
                 rotation=2.0;
                 offsetX=-35;
                 offsetY=-0;
                 anchorX=0.7;
                 anchorY=0.7;
                 break;
             case this.degree>=24 && this.degree <=45:
                 rotation=2.4;
                 offsetX=-35;
                 offsetY=-0;
                 anchorX=0.7;
                 anchorY=0.7;
                 break;
             case this.degree>=46 && this.degree <=68:
                 rotation=2.8;
                 offsetX=-35;
                 offsetY=-1;
                 anchorX=0.7;
                 anchorY=0.7;
                 break;
             case this.degree>=69 && this.degree <=90:
                 rotation=3.1;
                 offsetX=-35;
                 offsetY=3;
                 anchorX=1;
                 anchorY=1;
                 break;
             case this.degree>=91 && this.degree <=113:
                 rotation=3.6;
                 offsetX=-30;
                 offsetY=-5;
                 anchorX=0.60;
                 anchorY=0.60;
                 break;
             case this.degree>=114 && this.degree <=135:
                 rotation=4.0;
                 offsetX=-30;
                 offsetY=-5;
                 anchorX=0.60;
                 anchorY=0.60;
                 break;                
             case this.degree>=136 && this.degree <=158:
                 rotation=4.3;
                 offsetX=-30;
                 offsetY=2;
                 anchorX=0.8;
                 anchorY=0.8;
                 break;
             case this.degree>=159 && this.degree <=180:
                 rotation=4.7;
                 offsetX=-30;
                 offsetY=2;
                 anchorX=0.8;
                 anchorY=0.8;
                 break;
             case this.degree>=181 && this.degree <=203:
                 rotation=5.2;
                 offsetX=-35;
                 offsetY=-5;
                 anchorX=0.60;
                 anchorY=0.60;
                 break;
             case this.degree>=204 && this.degree <=225:
                 rotation=5.6;
                 offsetX=-35;
                 offsetY=-5;
                 anchorX=0.60;
                 anchorY=0.60;
                 break;
             case this.degree>=226 && this.degree <=248:
                 rotation=6.0;
                 offsetX=-35;
                 offsetY=-5;
                 anchorX=0.60;
                 anchorY=0.60;
                 break;
             case this.degree>=248 && this.degree <=270:
                 rotation=6.4;
                 offsetX=-35;
                 offsetY=-5;
                 anchorX=0.80;
                 anchorY=0.80;
                 break;
             case this.degree>=271 && this.degree <=293:
                 rotation=0.4;
                 offsetX=-35;
                 offsetY=-5;
                 anchorX=0.60;
                 anchorY=0.60;
                 break;
             case this.degree>=294 && this.degree <=315:
                 rotation=0.8;
                 offsetX=-35;
                 offsetY=-5;
                 anchorX=0.60;
                 anchorY=0.60;
                 break;
             case this.degree>=316 && this.degree <=338:
                 rotation=1.2;
                 offsetX=-35;
                 offsetY=-5;
                 anchorX=0.60;
                 anchorY=0.60;
                 break;
             case this.degree>=339 && this.degree <=360:
                 rotation=1.6;
                 offsetX=-35;
                 offsetY=2;
                 anchorX=0.80;
                 anchorY=0.80;
                 break;
         }
         
         //rotation=1.6;
         
         if(this.degree>0)
             this.degree += " -D";
         else
             this.degree = " ";
         //if(degree!="0")
         //alert(degree + " " + lat + " " + lon + " " + last_lat + " " + last_lng );
             
         //degree += "-degree";
         let centerPoint = transform([lon, lat], 'EPSG:4326','EPSG:3857');
         let iconFeature = new Feature({
             geometry: new Point(centerPoint),
             name: MAC,
             population: 4000,
             rainfall: 500
         });
    
         let iconStyle = new Style({
             image: new Icon(({
                 anchor: [anchorX, anchorY],
                 anchorOrigin: 'top-right',
                 anchorXUnits: 'fraction',
                 anchorYUnits: 'pixels',
                 scale: 1,
                 opacity: 1,
                 rotateWithView: false,
                 rotation:rotation,
                 size:[52,52],
                 offset:[offsetX,offsetY],
                 src: icon
             })),
             text: new Text({
                 font: 'bold 12px verdana,Calibri,sans-serif',
                 fill: new Fill({ color: '#00F' }),
                 offsetY: -30,
                 stroke: new Stroke({
                     color: '#fff', width: 1
                 }),
                 text: ""
             })
         });
    
         iconFeature.setStyle(iconStyle);
    
         let vectorSource = new VectorSource({
           features: [iconFeature]
         });
        
         if(this.vectorLayer[serialNo]!==null){
             this.map.removeLayer(this.vectorLayer[serialNo]);
         }
    
         this.vectorLayer[serialNo] = new VectorLayer({
           source: vectorSource
         });
    
         this.map.addLayer(this.vectorLayer[serialNo]); 
         
         }catch(ex){}
      }

  
}
