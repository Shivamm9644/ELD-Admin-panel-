import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
import { NgForm } from '@angular/forms';
import { MasterService } from 'src/services/master.service';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { RequestService } from 'src/services/request.service';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-unidentified-events',
  templateUrl:'./unidentified-events.component.html',
  styleUrls: ['./unidentified-events.component.scss']
})
export class UnidentifiedEventsComponent implements OnInit {

  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // post: any;
  searchText:String;

  ueForm:any={}

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }

  logStatus = ["OnDuty","OnDrive","OnSleep","OffDuty","PersonalUse","YardMove"];
  logStatusDetails=[];
  logStatusDataArr;

  ngOnInit(): void {
    this.getAllTruckNo();
    this.DateShow();
    this.ShowUnidentifiedEventsReport(0,'');

    for(let i=0;i<this.logStatus.length;i++){
      let arr = {
        id:this.logStatus[i],
        logStatus:this.logStatus[i]
      };
      this.logStatusDetails.push(arr);
    }
    this.logStatusDataArr = this.logStatusDetails;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      paginate: false,
      processing: true,
          dom: 'Blfrtip',
        
          buttons: [
          {
            extend: 'csv',
            // text:  '<i class="fa fa-file-text-o"></i>',
            text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
            titleAttr: 'Download as CSV',
            title: 'Unidentified Report' 
          },
          {
            extend: 'excel',
            // text:  '<i class="fa fa-file-excel-o"></i>',
            text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
            titleAttr: 'Download as Excel',
            title: 'Unidentified Report' 
          },
          {
            extend: 'pdf',
            // text: '<i class="fa fa-file-pdf-o"></i>',
            text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
            titleAttr: 'Download as Pdf',
            title: 'Unidentified Report' 
          }
        ]
      };
  }

  currentDate;
  async DateShow(){
	this.currentDate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
	$('#fromDate').val(this.currentDate);
	$('#toDate').val(this.currentDate);
  }

  unidentifiedEventDEtails=[];
  rowData;
  isLoading : boolean=false;
  async ShowUnidentifiedEventsReport(vehicleId,status){
    try {
      this.isLoading = true;
      let from = this.datePipe.transform($("#fromDate").val(), 'yyyy-MM-dd');
      let to = this.datePipe.transform($("#toDate").val(), 'yyyy-MM-dd');
      vehicleId = Number(this.ueForm.truckNo) || 0;
      let selectedVehicle = this.vehicleDataArr ? this.vehicleDataArr.find(v => v.id === vehicleId) : null;
      let macAddress = this.ueForm.macAddress || (selectedVehicle ? selectedVehicle.macAddress : '');

      const unidentifiedEvent= {
        'vehicleId' : vehicleId,
        'fromDate' : this.datePipe.transform(new Date(from+" 00:00:00"), 'yyyy-MM-dd HH:mm:ss'),
        'toDate' : this.datePipe.transform(new Date(to+" 23:59:59"), 'yyyy-MM-dd HH:mm:ss'),
        'clientId' : Number(localStorage.getItem("clientId")),
        'macAddress' : macAddress || '',
      };
    //   console.log(unidentifiedEvent);
      const data: any = await this.request.post('/dispatch/view_unidentified_events/',unidentifiedEvent);
      this.unidentifiedEventDEtails=[];
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            let item = dataObj[objKey1];
            item.macAddress = this.getMacAddressDisplay(item);
            this.unidentifiedEventDEtails.push(item);
          } 
        }				
      }
      status = this.ueForm.logStatus;
      let filtered = this.unidentifiedEventDEtails;
      if(status!="" && status!=undefined){
        filtered = filtered.filter(item => item.status === status);
      }
      if(this.ueForm.macAddress && this.ueForm.macAddress.trim() !== ''){
        const macSearch = this.ueForm.macAddress.trim().toLowerCase();
        filtered = filtered.filter(item => 
          (item.macAddress && item.macAddress.toLowerCase().includes(macSearch)) ||
          (item.truckNo && item.truckNo.toLowerCase().includes(macSearch)) ||
          (item.vehicleId && String(item.vehicleId).includes(macSearch))
        );
      }
      this.rowData = filtered;

      this.rowData.sort((a, b) => {
        const dateA = new Date(a.dateTime).getTime();
        const dateB = new Date(b.dateTime).getTime();
        // console.log(dateA+" : "+dateB);
        return dateB - dateA; // Descending order
      });

	  console.log(this.rowData);
      this.rerender();
      this.ExportFile();
      this.isLoading = false;
    } catch (error) {}
  }

  ExportFile(){
    // alert(this.EMPLOYEE_NAME);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true,
      dom: 'Blfrtip',
        buttons: [
        {
          extend: 'csv',
          className: 'btn btn-danger',
          text:      '<i class="fa fa-file-text-o"></i>',
          titleAttr: 'Download as CSV',
          title: 'Unidentified Report',
        },
        {
          extend: 'excel',
          text:      '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title:'Unidentified Report',
          // filename: function(){
          //   var d = new Date();
          //   var n = d.getTime();
          //   return $("#reportTypeName").text()+' Simulator Report';
          // },
        },
        {
          extend: 'pdf',
          text:  '<i class="fa fa-file-pdf-o"></i>',
          titleAttr: 'Download as Pdf',
          title:'Unidentified Report',
        },
      ]
    };
  }

  async EnableDisableLog(logData){
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, undo it!'
      });
      if (confirm.value) {
        const dlog= {
          'driverStatusId' : logData._id,
          'driverId' : logData.driverId,
          'isVisible' : 1,
          'email' : localStorage.getItem("email"),
          'dateTime': logData.utcDateTime.toString(),
          'status':logData.status,
          'shift':logData.shift,
          'days':logData.days
        };
        // console.log(dlog);
        const allow: any = await this.request.post('/dispatch/update_and_enable_disable_driver_log/',dlog);
        if (allow) {
          // Successfully Deleted
          Swal.fire(
          'Recovered!',
          'Log Status has been recoverd.',
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

  async DeleteLog(logData){
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!'
      });
      if (confirm.value) {
        const dlog= {
          'driverStatusId' : logData._id,
          'driverId' : logData.driverId,
          'isVisible' : 2,
          'email' : localStorage.getItem("email"),
          'dateTime': logData.utcDateTime.toString(),
          'status':logData.status,
          'shift':logData.shift,
          'days':logData.days
        };
        console.log(dlog);
        const allow: any = await this.request.post('/dispatch/update_and_enable_disable_driver_log/',dlog);
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

  toggleAll(checked: boolean) {
    if (!this.rowData || this.rowData.length === 0) {
      return;
    }
    this.rowData.forEach(x => x.checked = checked);
  }

  async BulkDeleteLog(){
    const selectedLogs = this.rowData.filter(x => x.checked);
    if (selectedLogs.length === 0) {
      Swal.fire('Please select at least one log');
      return;
    }
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${selectedLogs.length} selected logs ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    });
    if (!confirm.value) {
      return;
    }
    try {
      for (const logData of selectedLogs) {
        const dlog = {
          driverStatusId : logData._id,
          driverId : logData.driverId,
          isVisible : 2,
          email : localStorage.getItem("email"),
          dateTime : logData.utcDateTime.toString(),
          status : logData.status,
          shift : logData.shift,
          days : logData.days
        };
        // console.log(dlog);
        await this.request.post('/dispatch/update_and_enable_disable_driver_log/',dlog);
      }
      Swal.fire(
        'Deleted!',
        'Selected logs deleted successfully',
        'success'
      );
      // refresh table without full reload (better)
      this.ShowUnidentifiedEventsReport(this.ueForm.truckNo || 0,this.ueForm.logStatus || '');

    } catch (e) {
      Swal.fire('Error while deleting logs');
    }
  }

  hasAnySelected(): boolean {
    return this.rowData?.some(x => x.checked === true);
  }

  vehicleDataObj=[];
	vehicleDataArr:any;
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
					let vNo = dataObj[objKey1].vehicleNo || '';
					let mac = dataObj[objKey1].macAddress || '';
					let label = vNo + (mac ? ' (' + mac + ')' : '');
					let arr = {
						id: dataObj[objKey1].vehicleId,
						vehicleNo: vNo,
						macAddress: mac,
						label: label
					};
					this.vehicleDataObj.push(arr);
				}
				}
			}
			this.vehicleDataArr = this.vehicleDataObj;
		} catch (error) {}
	}

  customVehicleSearch(term: string, item: any) {
    if (!term) return true;
    term = term.toLowerCase().trim();
    const vNoMatches = item.vehicleNo && item.vehicleNo.toLowerCase().includes(term);
    const macMatches = item.macAddress && item.macAddress.toLowerCase().includes(term);
    const labelMatches = item.label && item.label.toLowerCase().includes(term);
    return vNoMatches || macMatches || labelMatches;
  }

  getVehicleDisplay(event: any): string {
    if (!event) return '-';
    if (event.truckNo && event.truckNo !== '0' && String(event.truckNo).trim() !== '') {
      return event.truckNo;
    }
    if (event.vehicleId && Number(event.vehicleId) > 0) {
      const v = this.vehicleDataArr ? this.vehicleDataArr.find(x => x.id === Number(event.vehicleId)) : null;
      if (v && v.vehicleNo) {
        return v.vehicleNo;
      }
      return 'Vehicle #' + event.vehicleId;
    }
    if (event.macAddress && String(event.macAddress).trim() !== '') {
      const v = this.vehicleDataArr ? this.vehicleDataArr.find(x => x.macAddress && x.macAddress.toLowerCase() === String(event.macAddress).toLowerCase()) : null;
      if (v && v.vehicleNo) {
        return v.vehicleNo;
      }
    }
    return '-';
  }

  getMacAddressDisplay(event: any): string {
    if (!event) return 'N/A';
    if (event.macAddress && String(event.macAddress).trim() !== '' && String(event.macAddress) !== 'null' && String(event.macAddress) !== 'undefined') {
      return event.macAddress;
    }
    if (event.mac_address && String(event.mac_address).trim() !== '' && String(event.mac_address) !== 'null' && String(event.mac_address) !== 'undefined') {
      return event.mac_address;
    }
    if (event.mac && String(event.mac).trim() !== '' && String(event.mac) !== 'null' && String(event.mac) !== 'undefined') {
      return event.mac;
    }
    if (event.vehicleId && Number(event.vehicleId) > 0) {
      const v = this.vehicleDataArr ? this.vehicleDataArr.find(x => Number(x.id) === Number(event.vehicleId)) : null;
      if (v && v.macAddress) {
        return v.macAddress;
      }
    }
    if (event.truckNo && String(event.truckNo).trim() !== '') {
      const v = this.vehicleDataArr ? this.vehicleDataArr.find(x => x.vehicleNo && String(x.vehicleNo).trim().toLowerCase() === String(event.truckNo).trim().toLowerCase()) : null;
      if (v && v.macAddress) {
        return v.macAddress;
      }
    }
    return 'N/A';
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
