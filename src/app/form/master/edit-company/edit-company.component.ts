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

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit {

companyForm:any={}

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }


  GoBackToCompanyDetails(){
    this.router.navigate(['/form/admin-company']);
  }

  clientId=0;
  ngOnInit(): void {
    this.clientId = Number(localStorage.getItem("clientId"));
	this.EditCompany(this.clientId);
   // alert(this.clientId);
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
							timeZoneName:dataObj[objKey1].timeZone,
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
	async EditCompany(clientId){
		try {
			// console.log(" >> "+clientId);
			//this.isEditMode=true;
			const company = {
				'clientId': clientId
			};
			const data: any = await this.request.post('/master/view_client/',company);
			for (let objKey of Object.keys(data)) {
				let dataObj = data[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						this.companyviewDetails = dataObj[objKey1];
					} 
				}				
			}
			this.getAllCompanyState(this.companyviewDetails.countryId);
			this.companyForm = this.companyviewDetails;
			if(this.companyForm.shortHaulException=="true"){
				this.isShortHaulException=true;
			}else{
				this.isShortHaulException=false;
			}
			// console.log(this.companyviewDetails);
			$("#companyName").val(this.companyviewDetails.clientName);
			$("#dotNumber").val(this.companyviewDetails.dotNo);
			$("#companyStreetName").val(this.companyviewDetails.street);
			$("#companyCity").val(this.companyviewDetails.city);
			$("#companyZipCode").val(this.companyviewDetails.zipcode);
			$("#complianceMode").val(this.companyviewDetails.complianceMode);
			
			this.companyForm.companyCountryId = this.companyviewDetails.countryId;
			this.companyForm.companyStateId = this.companyviewDetails.stateId;

			// this.companyForm.cycleUsaId = this.companyviewDetails.cycleUsaId;
			// this.companyForm.cargoTypeId = this.companyviewDetails.cargoTypeId;



			this.companyForm.terminalTimezoneId = this.companyviewDetails.terminalData[0].terminalTimezoneId;
			this.companyForm.terminalStartTime = this.companyviewDetails.terminalData[0].terminalStartTime;
			this.companyForm.terminalStreet = this.companyviewDetails.terminalData[0].terminalStreet;
			this.companyForm.terminalCity = this.companyviewDetails.terminalData[0].terminalCity;
			this.companyForm.terminalCountryId = this.companyviewDetails.terminalData[0].terminalCountryId;
			this.companyForm.terminalStateId = this.companyviewDetails.terminalData[0].terminalStateId;
			this.companyForm.terminalZipcode = this.companyviewDetails.terminalData[0].terminalZipcode;
			this.companyForm = this.companyviewDetails.terminalData[0];

			this.companyForm = this.companyviewDetails;

			// "exemptDriver":exempt,
			// "personalUse":personalUse,
			// "yardMoves":yardMoves,
			// "shortHaulException":shortHaulException,
			// "project44":project44,
			// "microPoint":microPoint,

		} catch (error) {}
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

	terminalData=[];
	message;
	isUpdatedRecord;
	async UpdateClient(){	
		//this.isEditMode=false;
		this.isViewMode=false;
	
		let exempt="",personalUse="",yardMoves="",shortHaulException="",project44="",microPoint="";
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
				"vehicleMotionThresold": this.companyForm.vehicleMotionThresold,
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
				"project44":project44,
				"microPoint":microPoint,
	
			};
			 console.log(company);
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
				//this.ViewCompany();
				}
				window.location.reload();
				//this.ViewCompany();
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

}