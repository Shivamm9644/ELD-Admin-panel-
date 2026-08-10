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
  selector: 'app-idling',
  templateUrl: './idling.component.html',
  styleUrls: ['./idling.component.scss']
})
export class IdlingComponent implements OnInit {

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }

  idleForm:any={};

  ngOnInit() {
    this.getAllTruckNo();
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

  RefreshPage(){
    window.location.reload();
  }

  exportOptions = [
    { label: 'CSV', value: 'csv' },
    { label: 'PDF', value: 'pdf' }
  ];
  selectedFormat: string = 'pdf';

  async GenerateIdleReport(){
    try{
      let vehiceId = this.vehicleId;
      let fromDate: any = $("#fromDate").val();
      let toDate: any = $("#toDate").val();
      if (!fromDate || !toDate) {
        Swal.fire('Warning', 'Please select valid From Date and To Date.', 'warning');
        return;
      }
      let sanitizedFrom = String(fromDate).replace(/-/g, "_");
      let sanitizedTo = String(toDate).replace(/-/g, "_");
      let extension = this.selectedFormat === 'csv' ? 'csv' : 'pdf';
      let fileName = sanitizedFrom + "_" + sanitizedTo + "_" + this.vehicleId + "." + extension;
      const idleReq = {
        'vehicleId': vehiceId,
        'fromDate': this.datePipe.transform(fromDate + " 00:00:00", "yyyy-MM-dd HH:mm:ss"),
        'toDate': this.datePipe.transform(toDate + " 23:59:59", "yyyy-MM-dd HH:mm:ss"),
        'clientId': Number(localStorage.getItem("clientId")),
        'reportType': this.selectedFormat,
      };

      const data: any = await this.request.post('/dispatch/view_idling_report/', idleReq);
      if (!data || data.status === 'FAIL' || !data.result) {
        Swal.fire({
          title: 'Report Not Available',
          text: data?.message || 'No idling data found for the selected criteria.',
          type: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      let downloadUrl = data.result;
      if (typeof downloadUrl === 'string' && downloadUrl.startsWith('http://')) {
        downloadUrl = downloadUrl.replace('http://', 'https://');
      }

      this.downloadFile(downloadUrl).subscribe(
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        (error) => {
          console.error('Error downloading file:', error);
          Swal.fire('Error', 'Failed to download report file.', 'error');
        }
      );
    } catch(error) {
      console.error('Error generating idling report:', error);
    }

  }

  downloadFile(url: string) {
    if (!url) {
      throw new Error('Download URL cannot be empty.');
    }
    return this.http.get(url, { responseType: 'blob' });
  }

}
