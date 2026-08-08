import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
// import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from 'src/services/request.service';
import { MasterService } from 'src/services/master.service';
import { environment } from 'src/environments/environment';
// import * as $ from 'jquery';
// import 'datatables.net';
import { from, Subject } from 'rxjs';
declare let $: any;
import jsPDF from 'jspdf';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  searchText: String;

  companyForm:any={}

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }

  clientId=0;
  userTypeId=0;
  isSuperAdminValue=0;
  ngOnInit(): void {
    this.isEditMode=false;
    this.isViewMode=false;
	this.clientId=Number(localStorage.getItem("clientId"));
	this.userTypeId=Number(localStorage.getItem("userTypeId"));
	this.isSuperAdminValue=Number(localStorage.getItem("isSuperAdmin"));
    this.ViewCompany();
    this.getTimeZone();
	this.getAllCargoType();
	this.getAllRestart();
	this.getAllRestBreak();
	this.getTimeZones();
	this.getAllCompanyTimeZones();
	this.getAllCycleUsa();
	this.getCountry();
    this.getState();
	this.getAllCompanyCountry();
	// this.getAllCompanyState();

	$("#shortHaulException").attr('disabled','disabled');

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      processing: true,
      dom: 'Blfrtip',
        buttons: [
        {
          extend: 'csv',
        //   text: '<i class="fa fa-file-text-o"></i>',
		  text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Company Report' 
        },
        {
          extend: 'excel',
        //   text: '<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Company Report' 
        },
		{
			extend: 'pdf',
			// text: '<i class="fa fa-file-pdf-o"></i>',
			text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
			titleAttr: 'Download as Pdf',
			title: 'Company Report' 
		},
      ]
    };	
  }

  async ActiveInactiveCompanyAccount(company){
		// alert(userId);
		let accountStatus = company.status === 'false' ? 'Active' : 'Inactive';
		let status="";
		if(company.status=="false"){
			status="true";
		}else{
			status="false";
		}
		const confirm = await Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, '+accountStatus+' it!'
		});
		if (confirm.value) {
			const userData = {
				'clientId': Number(company.clientId),
				"status":status,
			};
			// console.log(userData);
			const allow: any = await this.request.post('/master/update_client_active_inactive/',userData);
			if (allow) {
				Swal.fire(
				'Updated!',
				'Company Information has been updated.',
				'success'
				);
				window.location.reload();
			} else {
				Swal.fire(
					'Error!'
				);
			}
		}
	}

  isError;
  errorMessage;
  async getGeneratedCompanyNo(){
	try {
		let headers = new HttpHeaders();
		headers.set('Content-Type', 'application/json');
		let params = new HttpParams();
		const save : any = await this.http.post(environment.apiBaseUrl + '/master/get_next_company_no/',{ params, headers }).subscribe((res) => {
			for (let objKey of Object.keys(res)) {
				let dataObj = res[objKey];
				if(objKey=="result"){
					// console.log(dataObj);
					this.companyForm.companyId = dataObj;
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
 }

  ClearForm(){
	this.companyForm={};
	if (this.cycleusaDataArr.length > 0) {
		this.companyForm.cycleUsaId = this.cycleusaDataArr[0].id;
	}
	if (this.cargoDataArr.length > 0) {
		this.companyForm.cargoTypeId = this.cargoDataArr[0].id;
	}
	if (this.restartDataArr.length > 0) {
		this.companyForm.restartId = this.restartDataArr[0].id;
	}
	if (this.restBreakDataArr.length > 0) {
		this.companyForm.restBreakId = this.restBreakDataArr[0].id;
	}
	$("#companyName").val("");
	$("#dotNumber").val("");
	$("#companyStreetName").val("");
	$("#companyCity").val("");
	$("#companyZipCode").val("");
	$("#complianceMode").val("ELD");
	$("#vehicleMotionThresold").val("5 mi/h");
	this.getGeneratedCompanyNo();
  }

  iCount:any=1;
  async SelectClient(company){
	//  alert(clientId);
	// localStorage.removeItem('clientId');
	// localStorage.removeItem('clientName');
	let reloadCount = localStorage.getItem('reloadCount');
	// alert(reloadCount);
	localStorage.setItem('lattitude', company.lattitude);
	localStorage.setItem('longitude', company.longitude);

	localStorage.setItem('exemptDriver', company.exemptDriver);
	localStorage.setItem('personalUse', company.personalUse);
	localStorage.setItem('yardMoves', company.yardMoves);
	localStorage.setItem('shortHaulException', company.shortHaulException);
	localStorage.setItem('allowTracking', company.allowTracking);
	localStorage.setItem('allowGpsTracking', company.allowGpsTracking);
	localStorage.setItem('allowIfta', company.allowIfta);
			
	// console.log(company.lattitude+" :: "+company.longitude);

	if(Number(reloadCount)==0){
		localStorage.setItem('clientId', company.clientId);
		localStorage.setItem('clientName', company.clientName);
		// localStorage.removeItem('reloadCount');
		localStorage.setItem('reloadCount', this.iCount);
		// this.router.navigate(['/form/driver-status']);
		this.openRouteInNewTab();
	}else{
		const confirm = await Swal.fire({
			title: 'Are you sure want to change client?',
			//text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		});
		if (confirm.value) {
			localStorage.setItem('clientId', company.clientId);
			localStorage.setItem('clientName', company.clientName);
			// this.router.navigate(['/form/driver-status']);
			this.openRouteInNewTab();
		}
	}
	
	
   }

   openRouteInNewTab() {
	// console.log(window.location.origin);
	let baseUrl = window.location.origin;
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree(['/form/driver-status'])
    // );
    window.open(baseUrl+"/#/form/driver-status", '_blank');
  }

  terminalCount=0;
  addRow(){
    this.terminalCount++;
    let row = document.createElement('div'); 
    let formRow=""; 
    //row.className = 'row';
      
    formRow += `
    <div class="mb-2">
      <div class="d-flex justify-content-between mb-2">
        <span class="card-title h5 m-0" id="terminalNo" name="terminalNo">Terminal </span>
        <a class="btn btn-outline-dark btn-sm" name="removeRow`+this.terminalCount+`" id="removeRow`+this.terminalCount+`"><small>X</small></a>
      </div>

      <div class="row mb-3">
        <small for="" class="col-3 control-label">Time Zone</small>
        <div class="col-9" id="terminalTimezoneId`+this.terminalCount+`">
           `+this.createTimeZoneDropdown(this.terminalCount,0)+`
        </div>
      </div>

  
      <div class="row mb-3">
        <small for="" class="col-3 control-label">24H Period Staring Time</small>
        <div class="col-9">
		<input type="text" class="form-control  form-control-sm mainInput" id="terminalStartTime`+this.terminalCount+`" name="terminalStartTime`+this.terminalCount+`" class="form-control" placeholder="00:00">

        </div>
      </div>

      <div class="row mb-3">
        <small for="" class="col-3 control-label">Terminal Address</small>
        <div class="col-9 row pr-0">

          <div class="col-6">
            <input type="text" class="form-control  form-control-sm mainInput" id="terminalStreet`+this.terminalCount+`" name="terminalStreet`+this.terminalCount+`" class="form-control" placeholder="Street">
          </div>

          <div class="col-6 p-0">
		  <input type="text" class="form-control  form-control-sm mainInput" id="terminalCity`+this.terminalCount+`" name="terminalCity`+this.terminalCount+`" class="form-control" placeholder="City">
          </div>

          <div class="col-4 mt-3" id="terminalCountryId`+this.terminalCount+`">
              `+this.createCountryDropdown(this.terminalCount,0)+`
          </div>

          <div class="col-4 mt-3" id="terminalStateId`+this.terminalCount+`">
          `+this.createStateDropdown(this.terminalCount,0)+`
          </div>

          <div class="col-4 mt-3 pr-0 ">
			<input type="text" class="form-control  form-control-sm mainInput" id="terminalZipcode`+this.terminalCount+`" name="terminalZipcode`+this.terminalCount+`" class="form-control" placeholder="Zip / Portal Code">
          </div>

        </div>
      </div> 
    </div>`;       
    row.innerHTML = formRow;
    document.querySelector('.showTerminalField').appendChild(row);

    // $("#terminalNo"+this.terminalCount).val(this.terminalCount);
    // $("#terminalCountryId"+this.terminalCount).select2();
    // $("#terminalStateId"+this.terminalCount).select2();
	// $("#terminalTimezoneId"+this.terminalCount).select2();

    const selectElement = document.querySelector('#removeRow'+this.terminalCount);
      selectElement.addEventListener('click', (event) => {
      this.terminalCount--;
      //console.log(row);
      document.querySelector('.showTerminalField').removeChild(row);
    });
  }

  createTimeZoneDropdown(id,stateId){
    let selected="";
    let html = `<select name="timeZone`+id+`" class="form-control" id="timeZone`+id+`">
    <option value="0">Select TimeZone </option>`;
    for (let elem of this.timeZoneNameDataObj) {
      if(elem.stateId==stateId){
        selected="selected=selected";
      }else{
        selected="";
      }
      html+=`<option `+selected+` value="`+elem.stateId+`">`+elem.timeZone+`</option>`;
    }
    return html+=`</select>`;
  }

  timeZoneNameDataObj=[];
	timeZoneDataArr;
	async getTimeZone(){
		try {
			const state = {
				'stateId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const timeZone: any = await this.request.post('/master/view_state/',state);
			this.timeZoneNameDataObj=[];	
			for (let objKey of Object.keys(timeZone)) {
				let dataObj = timeZone[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						this.timeZoneNameDataObj.push(dataObj[objKey1]);
						// let arr = {
						// 	id:dataObj[objKey1].timeZone,
						// 	timeZoneName:dataObj[objKey1].timeZone,
						// };
						// this.timeZoneNameDataObj.push(arr);
					}
				}
			}
			this.timeZoneDataArr = this.timeZoneNameDataObj;
		} catch (error) {}
	}

  createCountryDropdown(id,countryId){
    let selected="";
    let html = `<select name="countryName`+id+`" class="form-control" id="countryName`+id+`">
    <option value="0">Select Country </option>`;
    for (let elem of this.cdlcountryDataObj) {
      if(elem.countryId==countryId){
        selected="selected=selected";
      }else{
        selected="";
      }
      html+=`<option `+selected+` value="`+elem.countryId+`">`+elem.countryName+`</option>`;
    }
    return html+=`</select>`;
  }

  cdlcountryDataObj=[];
	cdlcountryDataArr;
	async getCountry(){
		try {
			const country = {
				'countryId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryData: any = await this.request.post('/master/view_country/',country);
			this.cdlcountryDataObj=[];	
			for (let objKey of Object.keys(countryData)) {
				let dataObj = countryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						this.cdlcountryDataObj.push(dataObj[objKey1]);
						// let arr = {
						// 	id:dataObj[objKey1].countryId,
						// 	cdlCountryName:dataObj[objKey1].countryName,
						// };
						// this.cdlcountryDataObj.push(arr);
					}
				}
			}
			this.cdlcountryDataArr = this.cdlcountryDataObj;
		} catch (error) {}
	}


  cdlstateDataObj=[];
	cdlstateDataArr;
	async getState(){
		try {
			const state = {
				'stateId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_state/',state);
			this.cdlstateDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						 this.cdlstateDataObj.push(dataObj[objKey1]);
						// let arr = {
						// 	id:dataObj[objKey1].stateId,
						// 	cdlStateName:dataObj[objKey1].stateName,
						// };
						// this.cdlstateDataObj.push(arr);
					}
				}
			}
			this.cdlstateDataArr = this.cdlstateDataObj;
		} catch (error) {}
	}

  createStateDropdown(id,stateId){
    let selected="";
    let html = `<select name="stateName`+id+`" class="form-control" id="stateName`+id+`">
    <option value="0">Select State </option>`;
    for (let elem of this.cdlstateDataObj) {
      if(elem.stateId==stateId){
        selected="selected=selected";
      }else{
        selected="";
      }
      html+=`<option `+selected+` value="`+elem.stateId+`">`+elem.stateName+`</option>`;
    }
    return html+=`</select>`;
  }


  CompanyCountryDataObj=[];
  companyCountryDataArr;
	async getAllCompanyCountry(){
		try {
			const bcountry = {
				'countryId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_country/',bcountry);
			this.CompanyCountryDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].countryId,
							companyCountryName:dataObj[objKey1].countryName,
						};
						this.CompanyCountryDataObj.push(arr);
					}
				}
			}
			this.companyCountryDataArr = this.CompanyCountryDataObj;
		} catch (error) {}
	}

	companyStateDataObj=[];
	comapnyStateDataArr;
	async getAllCompanyState(countryId){
		try {
			const bstate = {
				'countryId': countryId,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			console.log(bstate);
			const bcountryData: any = await this.request.post('/master/view_state_by_country/',bstate);
			this.companyStateDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].stateId,
							companyStateName:dataObj[objKey1].stateName,
						};
						this.companyStateDataObj.push(arr);
					}
				}
			}
			this.comapnyStateDataArr = this.companyStateDataObj;
		} catch (error) {}
	}

  	cycleusaDataObj=[];
	cycleusaDataArr;
	async getAllCycleUsa(){
		try {
			const cycle = {
				'cycleUsaId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const cycleData: any = await this.request.post('/master/view_cycle_usa/',cycle);
			this.cycleusaDataObj=[];	
			for (let objKey of Object.keys(cycleData)) {
				let dataObj = cycleData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].cycleUsaId,
							cycleUsaName:dataObj[objKey1].cycleUsaName,
						};
						this.cycleusaDataObj.push(arr);
					}
				}
			}
			this.cycleusaDataArr = this.cycleusaDataObj;
			
		} catch (error) {}
	}

  cargotypeDataObj=[];
	cargoDataArr;
	async getAllCargoType(){
		try {
			const cargo = {
			'cargoTypeId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_cargo_type/',cargo);
			this.cargotypeDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].cargoTypeId,
							cargoTypeName:dataObj[objKey1].cargoTypeName,
						};
						this.cargotypeDataObj.push(arr);
					}
				}
			}
			this.cargoDataArr = this.cargotypeDataObj;
		} catch (error) {}
	}

	restartDataObj=[];
	restartDataArr;
	async getAllRestart(){
		try {
			const restart = {
			'restartId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_restart/',restart);
			this.restartDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].restartId,
							restartName:dataObj[objKey1].restartName,
						};
						this.restartDataObj.push(arr);
					}
				}
			}
			this.restartDataArr = this.restartDataObj;
		} catch (error) {}
	}

	restBreakDataObj=[];
	restBreakDataArr;
	async getAllRestBreak(){
		try {
			const restart = {
			'restBreakId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_rest_break/',restart);
			this.restBreakDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].restBreakId,
							restBreakName:dataObj[objKey1].restBreakName,
						};
						this.restBreakDataObj.push(arr);
					}
				}
			}
			this.restBreakDataArr = this.restBreakDataObj;
		} catch (error) {}
	}

	companyTimeZonesNameDataObj=[];
	companyTimeZonesDataArr;
	async getAllCompanyTimeZones(){
		try {
			const timezone = {
				'timezoneId': 0
			};
			const timeZone: any = await this.request.post('/master/view_timezone/',timezone);
			this.companyTimeZonesNameDataObj=[];	
			for (let objKey of Object.keys(timeZone)) {
				let dataObj = timeZone[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].timezoneId,
							companyTimeZoneName:dataObj[objKey1].timezoneName,
						};
						this.companyTimeZonesNameDataObj.push(arr);
					}
				}
			}
			this.companyTimeZonesDataArr = this.companyTimeZonesNameDataObj;
		} catch (error) {}
	}
  
	timeZonesNameDataObj=[];
	timeZonesDataArr;
	async getTimeZones(){
		try {
			const state = {
				'stateId': 0
			};
			const timeZone: any = await this.request.post('/master/view_state/',state);
			this.timeZonesNameDataObj=[];	
			for (let objKey of Object.keys(timeZone)) {
				let dataObj = timeZone[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].stateId,
							timeZoneName:dataObj[objKey1].stateName+" - ("+dataObj[objKey1].timeZone+")",
						};
						this.timeZonesNameDataObj.push(arr);
					}
				}
			}
			this.timeZonesDataArr = this.timeZonesNameDataObj;
		} catch (error) {}
	}

	isShortHaulException=false;
	CheckShortHaulException(id, cycleUsaName){
		// alert(cycleUsaName);
		if(cycleUsaName=="60 Hr / 7Days"){
			this.isShortHaulException=true;
			this.companyForm.shortHaulException=true;
		}else{
			this.isShortHaulException=false;
			this.companyForm.shortHaulException=false;
		}
	}

    isViewMode;
	companyviewDetails;
	EditCompany(company){
		try {
			this.companyForm = this.convertToBooleanFlags(company);
			this.isEditMode=true;
			this.companyviewDetails = company;
			if(company.shortHaulException=="true"){
				this.isShortHaulException=true;
			}else{
				this.isShortHaulException=false;
			}
			this.getAllCompanyState(this.companyviewDetails.countryId);
			// this.companyForm = company;
			console.log(this.companyForm);
			// this.companyForm.companyId = this.companyviewDetails.clientId;
			this.companyForm.companyId = this.companyviewDetails.companyId;
			$("#companyName").val(this.companyviewDetails.clientName);
			$("#dotNumber").val(this.companyviewDetails.dotNo);
			$("#companyStreetName").val(this.companyviewDetails.street);
			$("#companyCity").val(this.companyviewDetails.city);
			$("#companyZipCode").val(this.companyviewDetails.zipcode);
			$("#complianceMode").val(this.companyviewDetails.complianceMode);
			
			this.companyForm.companyCountryId = this.companyviewDetails.countryId;
			this.companyForm.companyStateId = this.companyviewDetails.stateId;

			this.companyForm.terminalTimezoneId = this.companyviewDetails.terminalData[0].terminalTimezoneId;
			this.companyForm.terminalStartTime = this.companyviewDetails.terminalData[0].terminalStartTime;
			this.companyForm.terminalStreet = this.companyviewDetails.terminalData[0].terminalStreet;
			this.companyForm.terminalCity = this.companyviewDetails.terminalData[0].terminalCity;
			this.companyForm.terminalCountryId = this.companyviewDetails.terminalData[0].terminalCountryId;
			this.companyForm.terminalStateId = this.companyviewDetails.terminalData[0].terminalStateId;
			this.companyForm.terminalZipcode = this.companyviewDetails.terminalData[0].terminalZipcode;
			// this.companyForm = this.companyviewDetails.terminalData[0];

		} catch (error) {}
	}

	convertToBooleanFlags(company: any): any {
		return {
			...company,
			exemptDriver: company.exemptDriver === 'true' || company.exemptDriver === true,
			shortHaulException: company.shortHaulException === 'true',
			personalUse: company.personalUse === 'true',
			yardMoves: company.yardMoves === 'true',
			project44: company.project44 === 'true',
			microPoint: company.microPoint === 'true',
			allowGpsTracking: company.allowGpsTracking === 'true',
			allowIfta: company.allowIfta === 'true',
			allowTracking: company.allowTracking === 'true'
		};
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
		let company_id=0;
		if(this.isSuperAdminValue==1){
			company_id = 0;
		}else{
			company_id = this.clientId;
		}
      this.isLoading = true;
      const company = {
        'clientId': company_id
        };
        this.dtTrigger=new Subject<any>();
      const data: any = await this.request.post('/master/view_client',company);
      this.companyDetails=[];
      //alert(data);
      this.dtTrigger.next();
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            this.companyDetails.push(dataObj[objKey1]);
          } 
        }				
      }
      this.rowData = this.companyDetails;
      
       console.log(this.companyDetails);
      this.isLoading = false;
    } catch (error) {}
  }

  async DeleteCompany() {
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
		const client = {
		'clientId': Number(this.companyForm.clientId)
		};
		const allow: any = await this.request.post('/master/delete_client/',client);
		if (allow) {
		// Successfully Deleted
		Swal.fire(
		'Deleted!',
		'Company Information has been deleted.',
		'success'
		);
		// Reload DataTable
		// this.ViewClients();
		window.location.reload();
		// this.ngOnInit();
		} else {
		Swal.fire(
			'Error!'
		);
		}
	}
  }

  terminalTimezoneName="";
  GetTimeZoneName(terminalTimezoneId,terminalTimezoneName){
	this.terminalTimezoneName = terminalTimezoneName;
  }

  terminalCountryName="";
  GetCountryName(terminalCountryId,terminalCountryName){
	this.terminalCountryName = terminalCountryName;
	this.getAllCompanyState(terminalCountryId);
  }

  terminalStateName="";
  GetStateName(terminalStateId,terminalStateName){
	this.terminalStateName = terminalStateName;
  }

  CompanyGraceDate(company){
	console.log(company);
	$("#clientId").val(company.clientId);
	$("#graceTime").val(this.datePipe.transform(new Date(company.graceTime), 'yyyy-MM-dd'));
  }

  async UpdateGraceTime(){
	const confirm = await Swal.fire({
		title: 'Are you sure?',
		text: "You won't be able to revert this!",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, change it!'
	});
	if (confirm.value) {
		const graceData = {
			'clientId': Number($("#clientId").val()),
			"graceTime":this.datePipe.transform($("#graceTime").val(), 'yyyy-MM-dd HH:mm:ss'),
		};
		// console.log(graceData);
		const allow: any = await this.request.post('/master/update_client_grace_time/',graceData);
		if (allow) {
			Swal.fire(
			'Updated!',
			'Company Information has been updated.',
			'success'
			);
			window.location.reload();
		} else {
			Swal.fire(
				'Error!'
			);
		}
	}
  }

  SameCompanyAddress(){
	if ($('#terminalSameAsAbove').is(":checked"))
	{
		this.companyForm.terminalTimezoneId = this.companyForm.timezoneId;
		this.companyForm.terminalStartTime = "00:00";
		this.companyForm.terminalStreet = this.companyForm.companyStreetName;
		this.companyForm.terminalCity = this.companyForm.companyCity;
		this.companyForm.terminalCountryId = this.companyForm.companyCountryId;
		this.companyForm.terminalStateId = this.companyForm.companyStateId;
		this.companyForm.terminalZipcode = this.companyForm.companyZipCode;
	}else{
		// this.companyForm.terminalTimezoneId = undefined;
		// this.companyForm.terminalStartTime = "";
		// this.companyForm.terminalStreet = "";
		// this.companyForm.terminalCity = "";
		// this.companyForm.terminalCountryId = undefined;
		// this.companyForm.terminalStateId = undefined;
		// this.companyForm.terminalZipcode = undefined;
	}
	
  }

	terminalData=[];
	isUpdatedRecord;
	message;
	async SaveClient(){	
		this.isEditMode=false;
		this.isViewMode=false;

		let exempt="",personalUse="",yardMoves="",shortHaulException="",project44="",microPoint="";
		let allowTracking="", allowGpsTracking="", allowIfta="";
		// console.log(this.terminalCount);
		this.terminalData=[];
		this.terminalData.push({terminalTimezoneId:Number(this.companyForm.terminalTimezoneId),
			terminalTimezoneName:this.terminalTimezoneName,
			terminalStartTime:$("#terminalStartTime").val(),
			terminalStreet:$("#terminalStreet").val(),
			terminalCity:$("#terminalCity").val(),
			terminalCountryId:Number(this.companyForm.terminalCountryId),
			terminalCountryName:this.terminalCountryName,
			terminalStateId:Number(this.companyForm.terminalStateId),
			terminalStateName:this.terminalStateName,
			terminalZipcode:Number($("#terminalZipcode").val())});
		for(let i=1;i<=this.terminalCount;i++){
			this.terminalData.push({terminalTimezoneId:Number($("#terminalTimezoneId"+i).find("option:selected").val()),
				terminalTimezoneName:$("#terminalTimezoneId"+i).find("option:selected").text(),
				terminalStartTime:$("#terminalStartTime"+i).val(),
				terminalStreet:$("#terminalStreet"+i).val(),
				terminalCity:$("#terminalCity"+i).val(),
				terminalCountryId:Number($("#terminalCountryId"+i).find("option:selected").val()),
				terminalCountryName:$("#terminalCountryId"+i).find("option:selected").text(),
				terminalStateId:Number($("#terminalStateId"+i).find("option:selected").val()),
				terminalStateName:$("#terminalStateId"+i).find("option:selected").text(),
				terminalZipcode:Number($("#terminalZipcode"+i).val())});
		}
		// console.log(this.terminalData);

	try {
		
		if ($('#exempt').is(":checked"))
		{
			exempt="true";
		}else{
			exempt="false";
		}
		if ($('#personalUse').is(":checked"))
		{
			personalUse="true";
		}else{
			personalUse="false";
		}
		if ($('#yardMoves').is(":checked"))
		{
			yardMoves="true";
		}else{
			yardMoves="false";
		}
		if ($('#shortHaulException').is(":checked"))
		{
		shortHaulException="true";
		}else{
		shortHaulException="false";
		}

		if ($('#allowTracking').is(":checked"))
		{
			allowTracking="true";
		}else{
			allowTracking="false";
		}
		if ($('#allowGpsTracking').is(":checked"))
		{
			allowGpsTracking="true";
		}else{
			allowGpsTracking="false";
		}
		if ($('#allowIfta').is(":checked"))
		{
			allowIfta="true";
		}else{
			allowIfta="false";
		}

		if ($('#project44').is(":checked"))
		{
			project44="true";
		}else{
			project44="false";
		}
		if ($('#microPoint').is(":checked"))
		{
			microPoint="true";
		}else{
			microPoint="false";
		}
		

	const company = {
	"companyId":this.companyForm.companyId,
	"clientName":$("#companyName").val(),
	"dotNo": $("#dotNumber").val(),
	"timezoneId":Number(this.companyForm.timezoneId),
	"street": $("#companyStreetName").val(),
	"city": $("#companyCity").val(),
	"countryId":Number(this.companyForm.companyCountryId),
	"stateId":Number(this.companyForm.companyStateId),
	"zipcode": Number($("#companyZipCode").val()),
	"vehicleMotionThresold": $("#vehicleMotionThresold").val(), //this.companyForm.vehicleMotionThresold,

	"terminalData":this.terminalData,

	"complianceMode": $("#complianceMode").val(),
	"exemptDriver":exempt,
	"cycleUsaId":Number(this.companyForm.cycleUsaId),
	"cargoTypeId":Number(this.companyForm.cargoTypeId),
	"restartId":Number(this.companyForm.restartId),
	"restBreakId":Number(this.companyForm.restBreakId),
	"personalUse":personalUse,
	"yardMoves":yardMoves,
	"shortHaulException":shortHaulException,
	"allowTracking":allowTracking,
	"allowGpsTracking":allowGpsTracking,
	"allowIfta":allowIfta,
	"project44":project44,
	"microPoint":microPoint,

	};
	// console.log(company);
	const save: any = await this.request.post('/master/add_client',company);
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
		title: 'Successfully Save',
		text: 'Saved Changes.',
		type: 'success',
		showConfirmButton: false,  
		timer: 1500
		// confirmButtonText: 'Ok'
		});
		if (result.value) {
			// Form Reset
			window.location.reload();
			this.ViewCompany();
		}
		window.location.reload();
		this.ViewCompany();
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

async UpdateClient(){	
	this.isEditMode=false;
	this.isViewMode=false;

	let exempt="",personalUse="",yardMoves="",shortHaulException="",project44="",microPoint="";
	let allowTracking="", allowGpsTracking="", allowIfta="";
	// console.log(this.terminalCount);
	this.terminalData=[];
	this.terminalData.push({terminalTimezoneId:Number(this.companyForm.terminalTimezoneId),
	terminalStartTime:$("#terminalStartTime").val(),
	terminalStreet:$("#terminalStreet").val(),
	terminalCity:$("#terminalCity").val(),
	terminalCountryId:Number(this.companyForm.terminalCountryId),
	terminalStateId:Number(this.companyForm.terminalStateId),
	terminalZipcode:Number($("#terminalZipcode").val())});
	for(let i=1;i<=this.terminalCount;i++){
		this.terminalData.push({terminalTimezoneId:Number($("#terminalTimezoneId"+i).find("option:selected").val()),
		terminalStartTime:$("#terminalStartTime"+i).val(),
		terminalStreet:$("#terminalStreet"+i).val(),
		terminalCity:$("#terminalCity"+i).val(),
		terminalCountryId:Number($("#terminalCountryId"+i).find("option:selected").val()),
		terminalStateId:Number($("#terminalStateId"+i).find("option:selected").val()),
		terminalZipcode:Number($("#terminalZipcode"+i).val())});
	}
	// console.log(this.terminalData);

	try {
	
		if ($('#exempt').is(":checked"))
		{
			exempt="true";
		}else{
			exempt="false";
		}
		if ($('#personalUse').is(":checked"))
		{
			personalUse="true";
		}else{
			personalUse="false";
		}
		if ($('#yardMoves').is(":checked"))
		{
			yardMoves="true";
		}else{
			yardMoves="false";
		}
		if ($('#shortHaulException').is(":checked"))
		{
		shortHaulException="true";
		}else{
		shortHaulException="false";
		}
		if ($('#allowTracking').is(":checked"))
		{
			allowTracking="true";
		}else{
			allowTracking="false";
		}
		if ($('#allowGpsTracking').is(":checked"))
		{
			allowGpsTracking="true";
		}else{
			allowGpsTracking="false";
		}
		if ($('#allowIfta').is(":checked"))
		{
			allowIfta="true";
		}else{
			allowIfta="false";
		}
		if ($('#project44').is(":checked"))
		{
			project44="true";
		}else{
			project44="false";
		}
		if ($('#microPoint').is(":checked"))
		{
			microPoint="true";
		}else{
			microPoint="false";
		}
		const company = {
			"clientId":this.companyForm.clientId,
			"companyId":this.companyForm.companyId,
			"clientName":$("#companyName").val(),
			"dotNo": $("#dotNumber").val(),
			"timezoneId":Number(this.companyForm.timezoneId),
			"street": $("#companyStreetName").val(),
			"city": $("#companyCity").val(),
			"countryId":Number(this.companyForm.companyCountryId),
			"stateId":Number(this.companyForm.companyStateId),
			"zipcode": Number($("#companyZipCode").val()),
			// "vehicleMotionThresold": this.companyForm.vehicleMotionThresold,
			"vehicleMotionThresold": $("#vehicleMotionThresold").val(), //this.companyForm.vehicleMotionThresold,
			"terminalData":this.terminalData,
			"complianceMode": $("#complianceMode").val(),
			"exemptDriver":exempt,
			"cycleUsaId":Number(this.companyForm.cycleUsaId),
			"cargoTypeId":Number(this.companyForm.cargoTypeId),
			"restartId":Number(this.companyForm.restartId),
			"restBreakId":Number(this.companyForm.restBreakId),
			"personalUse":personalUse,
			"yardMoves":yardMoves,
			"shortHaulException":shortHaulException,
			"allowTracking":allowTracking,
			"allowGpsTracking":allowGpsTracking,
			"allowIfta":allowIfta,
			"project44":project44,
			"microPoint":microPoint,

		};
		// console.log(company);
		const save: any = await this.request.post('/master/update_client',company);
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
			this.ViewCompany();
			}
			window.location.reload();
			this.ViewCompany();
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

//   isUpdatedRecord;
//   message;
//   async SaveCompany(){	
//       this.isEditMode=false;
//     	this.isViewMode=false;
// 			const company = {
//         "companyName":$("#companyName").val(),
//         "officeAddress":$("#officeAddress").val(),
//         "homeTerminalAddress":$("#homeTerminalAddress").val(),
//         "timeZone":this.companyForm.timeZone,
// 			};
//       console.log(company);
// 			const save: any = await this.request.post('/master/add_company',company);
//       // console.log(save);
// 			for (let objKey of Object.keys(save)) {
// 			  let dataObj = save[objKey];
// 			  if(objKey=="status"){
// 				this.isUpdatedRecord = save[objKey];
// 			  }
// 			  if(objKey=="message"){
// 				this.message = save[objKey];
// 			  }
// 			}
// 			if (this.isUpdatedRecord=="SUCCESS") {
// 			  // alert("Save Successfully");
// 			  const result = await Swal.fire({
// 				title: 'Successfully Save',
// 				text: 'Saved Changes.',
// 				type: 'success',
// 				showConfirmButton: false,  
// 				timer: 1500
// 				// confirmButtonText: 'Ok'
// 			  });
// 			  if (result.value) {
// 				// Form Reset
// 				 window.location.reload();
// 				this.ViewCompany();
// 			  }
// 			   window.location.reload();
// 			this.ViewCompany();
// 			} else{
// 			  const result = await Swal.fire({
// 				  title: "Oops ?",
// 				  text: this.message,   
// 				  type: "warning",   
// 				  showCancelButton: false,      
// 				  confirmButtonColor: "#FF0000",   
// 				  confirmButtonText: "Close",   
// 				  closeOnConfirm: false,   
// 				  closeOnCancel: false,
// 				  customClass: "Custom_Cancel"
// 			  });
// 			}		
// 		  } catch (error) {}
		
}
