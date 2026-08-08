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
declare let $: any;
searchText: String;

export var globalCompanyId: number = 0;

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.scss']
})
export class AdminCompanyComponent implements OnInit {

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    globalCompanyId=0;
    this.ViewCompany();
  }
  
  RefreshPage(){
    window.location.reload();
  }

  companyDetails=[];
  rowData;
  actionAssign;
  isSuperAdmin:boolean=false;
  isLoading : boolean=false;
  isDeleteAction: boolean=false;
  isEditAction: boolean=false;
  async ViewCompany(){
    try {
      this.isLoading = true;
      const company = {
        'clientId':Number(localStorage.getItem("clientId")),
        };
      const data: any = await this.request.post('/master/view_client',company);
      this.companyDetails=[];
      //alert(data);
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.companyDetails.push(dataObj[objKey1]);
            $("#companyId").text(dataObj[objKey1].companyId);
             $("#companyName").text(dataObj[objKey1].clientName);
             $("#dotNo").text(dataObj[objKey1].dotNo);
              $("#companyTimeZone").text(dataObj[objKey1].timezone);
              $("#terminalTimezone").text(dataObj[objKey1].timezone);
              $("#companyAddress").text(dataObj[objKey1].street+","+dataObj[objKey1].city +","+dataObj[objKey1].zipcode);
             // $("#terminalAddress").text(dataObj[objKey1].homeTerminalAddress);

             $("#terminalAddress").text(dataObj[objKey1].terminalData[0].terminalStreet+","+dataObj[objKey1].terminalData[0].terminalCity+","+dataObj[objKey1].terminalData[0].terminalZipcode);
            //  $("#terminalTimezone").text(dataObj[objKey1].terminalData[0].terminalTimezoneName);
             $("#terminalStartTime").text(dataObj[objKey1].terminalData[0].terminalStartTime);

             $("#viewComplianceMode").text(dataObj[objKey1].complianceMode);
             $("#viewVehicleMotionThreshold").text(dataObj[objKey1].vehicleMotionThresold);
             $("#viewCycleRule").text(dataObj[objKey1].cycleUsaName[0]);
             $("#viewCargoType").text(dataObj[objKey1].cargoTypeName[0]);
             $("#viewRestart").text(dataObj[objKey1].restartName[0]);
             $("#viewRestBreak").text(dataObj[objKey1].restBreakName[0]);

             $("#viewShortHaulException").text(dataObj[objKey1].shortHaulException);
             $("#viewPersonalConveyance").text(dataObj[objKey1].personalUse);
             $("#viewYardMoves").text(dataObj[objKey1].yardMoves);
             $("#viewExemptDriver").text(dataObj[objKey1].exemptDriver);
             $("#viewProject44").text(dataObj[objKey1].project44);
             $("#viewMacroPoint").text(dataObj[objKey1].microPoint);
          } 
        }				
      }
      this.rowData = this.companyDetails;
      // console.log(this.companyDetails);
      this.isLoading = false;
    } catch (error) {}
  }


  EditCompanyDetails(){
    this.router.navigate(['/form/edit-company']);
  }

  // EditCompanyDetails(companyId){
  //   globalCompanyId = companyId;
  //   this.router.navigate(['/form/edit-company']);
  // }

}
