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
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
	isEditMode: boolean=false;
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // post: any;
  searchText:String;

  driverForm:any={}
  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    // private datePipe : DatePipe
  ) { }

  userTypeId=0;
  ngOnInit(): void {
	this.password = 'password';
	this.isEditMode=false;
    this.isViewMode=false;
	this.driverForm.status=true;
	this.userTypeId = Number(localStorage.getItem('userTypeId'));
	// alert(this.userTypeId);
	$("#statusSection").text("(Active)");
	// if(localStorage.getItem("exemptDriver")=="false"){
	// 	$("#exempt").attr('disabled','disabled');
	// }else{
	// 	$("#exempt").removeAttr('disabled');
	// }
	$("#exempt").removeAttr('disabled');
	// alert(localStorage.getItem("shortHaulException"));
	// if(localStorage.getItem("shortHaulException")=="false"){
	// 	$("#shortHaulException").attr('disabled','disabled');
	// }else{
	// 	$("#shortHaulException").removeAttr('disabled');
	// }
	$("#shortHaulException").attr('disabled','disabled');
	
	if(localStorage.getItem("personalUse")=="false"){
		$("#personalUse").attr('disabled','disabled');
	}else{
		$("#personalUse").removeAttr('disabled');
	}
	if(localStorage.getItem("yardMoves")=="false"){
		$("#yardMoves").attr('disabled','disabled');
	}else{
		$("#yardMoves").removeAttr('disabled');
	}
    this.ViewDrivers('all');
    this.getAllCycleCanada();
    this.getAllCycleUsa();
    this.getAllMainTerminal();
    this.getCdlCountry();
    // this.getCdlState();
    this.getAllCargoType();
	this.getAllRestart();
	this.getAllRestBreak();
    this.getAllTruckNo();
    this.getAllClient();
    this.getAllLanguage();
    this.dtOptions = {
		pagingType: 'full_numbers',
		pageLength: 1000,
		paginate: false,
		processing: true,
      	dom: 'Bfrtip',
      
        buttons: [
        {
          extend: 'csv',
        //   text:  '<i class="fa fa-file-text-o"></i>',
		text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'Driver Report' 
        },
        {
          extend: 'excel',
        //   text:  '<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
          title: 'Driver Report' 
        },
        {
          extend: 'pdf',
		  //   text: '<i class="fa fa-file-pdf-o"></i>',
		  text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Pdf',
          title: 'Driver Report' 
        }
      ]
    };
  }

  passwordVisible: boolean = false;
  password;
  togglePassword() {
    if (this.password === 'password') {
      this.password = 'text';
      this.passwordVisible = true;
    } else {
      this.password = 'password';
      this.passwordVisible = false;
    }
  }

  confirmPasswordVisible;
  toggleConfirmPassword() {
	this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  ClearForm(){
	this.driverForm={};
	this.driverForm.status=true;
	if (this.mainterminalDataArr.length) {
		console.log(this.mainterminalDataArr[0].id);
		this.driverForm.mainTerminalId = this.mainterminalDataArr[0].id;
	}
	if (this.cycleusaDataArr.length) {
		this.driverForm.cycleUsaId = this.cycleusaDataArr[0].id;
	}
	if (this.cargoDataArr.length) {
		this.driverForm.cargoTypeId = this.cargoDataArr[0].id;
	}
	if (this.restartDataArr.length) {
		this.driverForm.restartId = this.restartDataArr[0].id;
	}
	if (this.restBreakDataArr.length) {
		this.driverForm.restBreakId = this.restBreakDataArr[0].id;
	}
  }

  ShowEmployeeData(type){
	this.ViewDrivers(type);
  }

  RefreshPage(){
    window.location.reload();
  }

  inputValidator(event: any) {
    //console.log(event.target.value);
    const pattern = /^[a-z.@0-9]*$/;   
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-z.@0-9]/g, "");
      // invalid character, prevent input
    }
  }

  inputValidatorForLicenseNumber(event: any) {
    //console.log(event.target.value);
    const pattern = /^[A-Za-z0-9]*$/;   
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^A-Za-z0-9]/g, "");
      // invalid character, prevent input
    }
  }


  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
    }
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

  cyclecanadaDataObj=[];
	cyclecanadaDataArr;
	async getAllCycleCanada(){
		try {
			const cycle = {
				'cycleCanadaId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const cycleData: any = await this.request.post('/master/view_cycle_canada/',cycle);
			this.cyclecanadaDataObj=[];	
			for (let objKey of Object.keys(cycleData)) {
				let dataObj = cycleData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].cycleCanadaId,
							cycleCanadaName:dataObj[objKey1].cycleCanadaName,
						};
						this.cyclecanadaDataObj.push(arr);
					}
				}
			}
			this.cyclecanadaDataArr = this.cyclecanadaDataObj;
		} catch (error) {}
	}

  mainterminalDataObj=[];
	mainterminalDataArr;
	async getAllMainTerminal(){
		try {
			const main = {
				'mainTerminalId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const terminalData: any = await this.request.post('/master/view_main_terminal/',main);
			this.mainterminalDataObj=[];	
			for (let objKey of Object.keys(terminalData)) {
				let dataObj = terminalData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].mainTerminalId,
							mainTerminalName:dataObj[objKey1].mainTerminalName,
						};
						this.mainterminalDataObj.push(arr);
					}
				}
			}
			this.mainterminalDataArr = this.mainterminalDataObj;
			if (this.mainterminalDataArr.length) {
				console.log(this.mainterminalDataArr);
				this.driverForm.mainTerminalId = this.mainterminalDataArr[0].id;
			}
		} catch (error) {}
	}

  cdlcountryDataObj=[];
	cdlcountryDataArr;
	async getCdlCountry(){
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
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].countryId,
							cdlCountryName:dataObj[objKey1].countryName,
						};
						this.cdlcountryDataObj.push(arr);
					}
				}
			}
			this.cdlcountryDataArr = this.cdlcountryDataObj;
		} catch (error) {}
	}

  cdlstateDataObj=[];
	cdlstateDataArr;
	async getCdlState(countryId){
		try {
			const state = {
				'countryId': countryId,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const countryState: any = await this.request.post('/master/view_state_by_country/',state);
			this.cdlstateDataObj=[];	
			for (let objKey of Object.keys(countryState)) {
				let dataObj = countryState[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].stateId,
							cdlStateName:dataObj[objKey1].stateName,
						};
						this.cdlstateDataObj.push(arr);
					}
				}
			}
			this.cdlstateDataArr = this.cdlstateDataObj;
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

	clientDataObj=[];
	clientDataArr;
	  async getAllClient(){
	  try {
		  const client = {
			  'clientId': 0
		  };
		  const clientData: any = await this.request.post('/master/view_client/',client);
		  this.clientDataObj=[];	
		  for (let objKey of Object.keys(clientData)) {
			  let dataObj = clientData[objKey];
			  if(objKey=="result"){
				  for (let objKey1 of Object.keys(dataObj)) {
					  // this.designationDataObj.push(dataObj[objKey1]);
					  let arr = {
						  id:dataObj[objKey1].clientId,
						  clientName:dataObj[objKey1].clientName,
					  };
					  this.clientDataObj.push(arr);
				  }
			  }
		  }
		  this.clientDataArr = this.clientDataObj;
	  } catch (error) {}
  }

  	languageDataObj=[];
	languageDataArr;
	async getAllLanguage(){
		try {
			const language = {
				'languageId': 0,
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const vehicleData: any = await this.request.post('/master/view_language/',language);
			this.languageDataObj=[];	
			for (let objKey of Object.keys(vehicleData)) {
				let dataObj = vehicleData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].languageId,
							languageName:dataObj[objKey1].languageName,
						};
						this.languageDataObj.push(arr);
					}
				}
			}
			this.languageDataArr = this.languageDataObj;
		} catch (error) {}
	}

	CheckStatus(){
		if($('#status').prop('checked')) {
			$("#statusSection").text("(Active)");
		}else{
			$("#statusSection").text("(Inactive)");
		}
	}

	isViewMode;
	driverViewDetails;
	async EditDriver(employeeId){
		try {
		this.isEditMode=true;
		const employee = {
		'employeeId': employeeId,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_employee/',employee);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.driverViewDetails = dataObj[objKey1];
				} 
			}				
		}
		this.getCdlState(this.driverViewDetails.cdlCountryId);
		
		if(this.driverViewDetails.status=="active"){
			this.driverViewDetails.status=true;
			$("#statusSection").text("(Active)");
		}else{
			this.driverViewDetails.status=false;
			$("#statusSection").text("(Inactive)");
		}
		if(this.driverViewDetails.yardMoves=="active"){
			this.driverViewDetails.yardMoves=true;
		}else{
			this.driverViewDetails.yardMoves=false;
		}

		if(this.driverViewDetails.exempt=="active"){
			this.driverViewDetails.exempt=true;
		}else{
			this.driverViewDetails.exempt=false;
		}

		if(this.driverViewDetails.shortHaulException=="active"){
			this.driverViewDetails.shortHaulException=true;
			this.isShortHaulException=true;
		}else{
			this.driverViewDetails.shortHaulException=false;
			this.isShortHaulException=false;
		}

		if(this.driverViewDetails.personalUse=="active"){
			this.driverViewDetails.personalUse=true;
		}else{
			this.driverViewDetails.personalUse=false;
		}

		if(this.driverViewDetails.unlimitedTrailers=="active"){
			this.driverViewDetails.unlimitedTrailers=true;
		}else{
			this.driverViewDetails.unlimitedTrailers=false;
		}

		if(this.driverViewDetails.unlimitedShippingDocs=="active"){
			this.driverViewDetails.unlimitedShippingDocs=true;
		}else{
			this.driverViewDetails.unlimitedShippingDocs=false;
		}

		this.driverForm = this.driverViewDetails;
		this.driverForm.passwordCnfrm = this.driverViewDetails.password;

		} catch (error) {}
  	}

	driverDetails=[];
	rowData;
	actionAssign;
	isSuperAdmin:boolean=false;
	isLoading : boolean=false;
	isDeleteAction: boolean=false;
	isEditAction: boolean=false;
	async ViewDrivers(type){
		try {
		this.isLoading = true;
		const employee = {
		'employeeId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		// this.dtTrigger=new Subject<any>();
		const data: any = await this.request.post('/master/view_employee/',employee);
		this.driverDetails=[];
		//alert(data);
		//   console.log(data);
		// this.dtTrigger.next();
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					if(type==dataObj[objKey1].status){
						this.driverDetails.push(dataObj[objKey1]);
					}else if(type=="all"){
						this.driverDetails.push(dataObj[objKey1]);
					}
				} 
			}				
		}
		this.rowData = this.driverDetails;
		// if(Number(localStorage.getItem("clientId"))!=1){
		//   if(this.actionAssign.get("delete")=="delete"){
		//     this.isDeleteAction = true;
		//   }
		//   if(this.actionAssign.get("update")=="update"){
		//   this.isEditAction = true;
		//   }
		// }
		// console.log(this.driverDetails);
		this.isLoading = false;
		this.rerender();
		} catch (error) {}
	}

	async DeleteDrivers() {
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
		  const employee = {
			'employeeId': Number(this.driverForm.employeeId)
		  };
		  const allow: any = await this.request.post('/master/delete_employee/',employee);
		  if (allow) {
			// Successfully Deleted
			Swal.fire(
			'Deleted!',
			'Driver information has been deleted.',
			'success'
			);
			// Reload DataTable
			// this.ViewDrivers();
			window.location.reload();
			// this.ngOnInit();
		  } else {
			Swal.fire(
			  'Error!'
			);
		  }
		}
	  }

	  checkConfirmPassword(){
		if($("#passwordCnfrm").val()!=$("#password").val()){
			 $("#isConfirmPasswordValid").text("Password and Password Confirm must match");
			// $("passwordCnfrm").addClass("borderalert");
			// $("#saveButton").removeAttr("disabled"); 
			$("#saveButton").attr("disabled", "disabled");
		}
		else{
			// $("#saveButton").attr("disabled", "disabled");
			$("#saveButton").removeAttr("disabled"); 
			$("#isConfirmPasswordValid").text();
		  }
	}

	isShortHaulException=false;
	CheckShortHaulException(id, cycleUsaName){
		// alert(cycleUsaName);
		if(cycleUsaName=="60 Hr / 7Days"){
			this.isShortHaulException=true;
			this.driverForm.shortHaulException=true;
		}else{
			this.isShortHaulException=false;
			this.driverForm.shortHaulException=false;
		}
	}

	isUpdatedRecord;
	message;
	async SaveDrivers(){	
	this.isEditMode=false;
    this.isViewMode=false;

	if($("#passwordCnfrm").val()!=$("#password").val()){
		$("#isConfirmPasswordValid").text("Check Password Confirm value Again");
		return;
	}

	let transferLog="",exempt="",personalUse="",yardMoves="",divR="",manageEquipement="",shortHaulException="",unlimitedTrailers="",unlimitedShippingDocs="";
    let title;
	let status="inactive";
	try {
		if ($('#status').is(":checked"))
        {
			status="active";
        }else{
			status="inactive";
        }

      	if ($('#transferLog').is(":checked"))
        {
          transferLog="active";
        }else{
          transferLog="inactive";
        }
        if ($('#exempt').is(":checked"))
        {
          exempt="active";
        }else{
          exempt="inactive";
        }
        if ($('#personalUse').is(":checked"))
        {
          personalUse="active";
        }else{
          personalUse="inactive";
        }
        if ($('#yardMoves').is(":checked"))
        {
          yardMoves="active";
        }else{
          yardMoves="inactive";
        }
		if ($('#shortHaulException').is(":checked"))
        {
		shortHaulException="active";
        }else{
		shortHaulException="inactive";
        }
		if ($('#unlimitedTrailers').is(":checked"))
        {
		unlimitedTrailers="active";
        }else{
		unlimitedTrailers="inactive";
        }
		if ($('#unlimitedShippingDocs').is(":checked"))
        {
		unlimitedShippingDocs="active";
        }else{
		unlimitedShippingDocs="inactive";
        }
        if ($('#divR').is(":checked"))
        {
          divR="active";
        }else{
          divR="inactive";
        }
        if ($('#manageEquipement').is(":checked"))
        {
          manageEquipement="active";
        }else{
          manageEquipement="inactive";
        }

        if($("#title").val()=="0"){
          title="";
        }else{
          title = $("#title").val();
        }
		// const Driver = {
		// "title":title,
        // "firstName":$("#firstName").val(),
        // "lastName":$("#lastName").val(),
        // "email":$("#email").val(),
        // "username":$("#username").val(),
        // "startTime":$("#startTime").val(),
        // "mobileNo":$("#mobileNo").val(),
        // "cdlNo":$("#cdlNo").val(),
        // "cdlExpiryDate":$("#cdlExpiryDate").val(),
        // "pdfEmail":$("#pdfEmail").val(),
        // "flatRate":$("#flatRate").val(),
        // "exempt":exempt,
        // "personalUse":personalUse,
        // "yardMoves":yardMoves,
        // "divR":divR,
        // "manageEquipement":manageEquipement,
        // "transferLog":transferLog,
        // "remarks":$("#remarks").val(),     
        // "cycleUsaId":Number(this.driverForm.cycleUsaId),
        // "cycleCanadaId":Number(this.driverForm.cycleCanadaId),
        // "mainTerminalId":Number(this.driverForm.mainTerminalId),
        // "cdlCountryId":Number(this.driverForm.cdlCountryId),
        // "cdlStateId":Number(this.driverForm.cdlStateId),
        // "cargoTypeId":Number(this.driverForm.cargoTypeId),
        // "truckNo":Number(this.driverForm.truckNo),
        // "languageId":Number(this.driverForm.languageId),
        // "clientId":Number(this.driverForm.clientId),
		// };
		const Driver = {
			"firstName":$("#firstName").val(),
			"lastName":$("#lastName").val(),
			"email":$("#email").val(),
			"username":$("#username").val(),
			"mobileNo":$("#mobileNo").val(),
			"cdlNo":$("#cdlNo").val(),
			"status":status,
			"exempt":exempt,
			"personalUse":personalUse,
			"yardMoves":yardMoves,
			"mainTerminalId":Number(this.driverForm.mainTerminalId),
			"truckNo":Number(this.driverForm.truckNo),
			"cdlCountryId":Number(this.driverForm.cdlCountryId),
			"cdlStateId":Number(this.driverForm.cdlStateId),
			"cargoTypeId":Number(this.driverForm.cargoTypeId),
			"cycleUsaId":Number(this.driverForm.cycleUsaId),

			"driverId":$("#driverId").val(),
			"password":$("#password").val(),
			"restartId": Number(this.driverForm.restartId),
			"restBreakId": Number(this.driverForm.restBreakId),
			"shortHaulException":shortHaulException,
			"unlimitedTrailers":unlimitedTrailers,
			"unlimitedShippingDocs":unlimitedShippingDocs,
			
			"title":title,
			"startTime":"",
			"cdlExpiryDate":"2024-05-02",
			"pdfEmail":"",
			"flatRate":0.0,
			"divR":"active",
			"manageEquipement":"active",
			"transferLog":"active",
			"remarks":"",     
			"cycleCanadaId":3,
			"languageId":3,
			'clientId':Number(localStorage.getItem("clientId")),
			};
      	// console.log(Driver);
		const save: any = await this.request.post('/master/add_employee/',Driver);
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
				this.ViewDrivers('all');
			  }
			  window.location.reload();
			this.ViewDrivers('all');
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

	async ActiveInactiveDriverAccount(driver){
		let driverStatus = driver.status === 'inactive' ? 'Active' : 'Inactive';
		let status="";
		if(driver.status=="inactive"){
			status="active";
		}else{
			status="inactive";
		}
		const confirm = await Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, '+driverStatus+' it!'
		});
		if (confirm.value) {
			const empData = {
				'employeeId': Number(driver.employeeId),
				"status":status,
			};
			console.log(empData);
			const allow: any = await this.request.post('/master/update_employee_active_inactive/',empData);
			if (allow) {
				Swal.fire(
				'Updated!',
				'Driver Information has been updated.',
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

	async UpdateDrivers(){	
	// this.isEditMode=false;
	// this.isViewMode=false;

	if($("#passwordCnfrm").val()!=$("#password").val()){
		$("#isConfirmPasswordValid").text("Check Password Confirm value Again");
		return;
	}
	
	let transferLog="",exempt="",personalUse="",yardMoves="",divR="",manageEquipement="",shortHaulException="",unlimitedTrailers="",unlimitedShippingDocs="";
    let title;
	let status="inactive";
	try {
		if ($('#status').is(":checked"))
        {
			status="active";
        }else{
			status="inactive";
        }
      	if ($('#transferLog').is(":checked"))
        {
          transferLog="active";
        }else{
          transferLog="inactive";
        }
        if ($('#exempt').is(":checked"))
        {
          exempt="active";
        }else{
          exempt="inactive";
        }
        if ($('#personalUse').is(":checked"))
        {
          personalUse="active";
        }else{
          personalUse="inactive";
        }
        if ($('#yardMoves').is(":checked"))
        {
          yardMoves="active";
        }else{
          yardMoves="inactive";
        }
		if ($('#shortHaulException').is(":checked"))
        {
		shortHaulException="active";
        }else{
		shortHaulException="inactive";
        }
		if ($('#unlimitedTrailers').is(":checked"))
        {
		unlimitedTrailers="active";
        }else{
		unlimitedTrailers="inactive";
        }
		if ($('#unlimitedShippingDocs').is(":checked"))
        {
		unlimitedShippingDocs="active";
        }else{
		unlimitedShippingDocs="inactive";
        }
        if ($('#divR').is(":checked"))
        {
          divR="active";
        }else{
          divR="inactive";
        }
        if ($('#manageEquipement').is(":checked"))
        {
          manageEquipement="active";
        }else{
          manageEquipement="inactive";
        }

        if($("#title").val()=="0"){
          title="";
        }else{
          title = $("#title").val();
        }
			const Driver = {
			"employeeId":Number(this.driverForm.employeeId),	
			"firstName":$("#firstName").val(),
			"lastName":$("#lastName").val(),
			"email":$("#email").val(),
			"username":$("#username").val(),
			"mobileNo":$("#mobileNo").val(),
			"cdlNo":$("#cdlNo").val(),
			"status":status,
			"exempt":exempt,
			"personalUse":personalUse,
			"yardMoves":yardMoves,
			"mainTerminalId":Number(this.driverForm.mainTerminalId),
			"truckNo":Number(this.driverForm.truckNo),
			"cdlCountryId":Number(this.driverForm.cdlCountryId),
			"cdlStateId":Number(this.driverForm.cdlStateId),
			"cargoTypeId":Number(this.driverForm.cargoTypeId),
			"cycleUsaId":Number(this.driverForm.cycleUsaId),

			"driverId":$("#driverId").val(),
			"password":$("#password").val(),
			"restartId": Number(this.driverForm.restartId),
			"restBreakId": Number(this.driverForm.restBreakId),
			"shortHaulException":shortHaulException,
			"unlimitedTrailers":unlimitedTrailers,
			"unlimitedShippingDocs":unlimitedShippingDocs,
			
			"title":title,
			"startTime":"",
			"cdlExpiryDate":"2024-05-02",
			"pdfEmail":"",
			"flatRate":0.0,
			"divR":"active",
			"manageEquipement":"active",
			"transferLog":"active",
			"remarks":"",     
			"cycleCanadaId":3,
			"languageId":3,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			// const Driver = {
			// 	"employeeId":Number(this.driverForm.employeeId),	
			// 	"title":title,
			// 	"firstName":$("#firstName").val(),
			// 	"lastName":$("#lastName").val(),
			// 	"email":$("#email").val(),
			// 	"username":$("#username").val(),
			// 	"startTime":$("#startTime").val(),
			// 	"mobileNo":$("#mobileNo").val(),
			// 	"cdlNo":$("#cdlNo").val(),
			// 	"cdlExpiryDate":$("#cdlExpiryDate").val(),
			// 	"pdfEmail":$("#pdfEmail").val(),
			// 	"flatRate":$("#flatRate").val(),
			// 	"exempt":exempt,
			// 	"personalUse":personalUse,
			// 	"yardMoves":yardMoves,
			// 	"divR":divR,
			// 	"manageEquipement":manageEquipement,
			// 	"transferLog":transferLog,
			// 	"remarks":$("#remarks").val(),     
			// 	"cycleUsaId":Number(this.driverForm.cycleUsaId),
			// 	"cycleCanadaId":Number(this.driverForm.cycleCanadaId),
			// 	"mainTerminalId":Number(this.driverForm.mainTerminalId),
			// 	"cdlCountryId":Number(this.driverForm.cdlCountryId),
			// 	"cdlStateId":Number(this.driverForm.cdlStateId),
			// 	"cargoTypeId":Number(this.driverForm.cargoTypeId),
			// 	"truckNo":Number(this.driverForm.truckNo),
			// 	"languageId":Number(this.driverForm.languageId),
			// 	'clientId':Number(localStorage.getItem("clientId")),
			// 	};
			 //console.log(Driver);
			const save: any = await this.request.post('/master/update_employee/',Driver);
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
					this.ViewDrivers('all');
				  }
				  window.location.reload();
					this.ViewDrivers('all');
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
