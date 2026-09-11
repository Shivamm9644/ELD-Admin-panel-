import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
// import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import { DatePipe } from '@angular/common';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { RequestService } from 'src/services/request.service';
import { MasterService } from 'src/services/master.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/services/auth.service';
// import * as $ from 'jquery';
// import 'datatables.net';
import { from, Subject } from 'rxjs';
declare let $: any;
import { placeholderChars, alphabetic, digit } from '../../masks/constants';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';


import jsPDF from 'jspdf';
import { AbstractControl,ValidationErrors,ValidatorFn, } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators,ReactiveFormsModule} from '@angular/forms';

// export const confirmPasswordValidator: ValidatorFn = (
// 	control: AbstractControl
//   ): ValidationErrors | null => {
// 	return control.value.password1 === control.value.password2
// 	  ? null
// 	  : { PasswordNoMatch: true };
//   };

const defaultValues = {
	placeholderChar: placeholderChars.whitespace,
	guide: true,
	pipe: null,
	keepCharPositions: false,
	help: null,
	placeholder: null
  };
	
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})

export class UsersComponent implements OnInit {

	myModel: string;
	modelWithValue: string;
	formControlInput: FormControl = new FormControl();
	mask: Array<string | RegExp>;

	//status: boolean = false; 

	isEditMode: boolean=false;
	@ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
	dtTrigger: Subject<any> = new Subject();
	searchText: String;

	userForm:any={}

  choices = [{
    name: 'US Phone Number',
    mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    placeholder: '(123) 456-7890'
  }
];

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
	public authService: AuthService
    // private datePipe : DatePipe
  ) { 
	this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.myModel = '';
    this.modelWithValue = '1234567890';
    this.formControlInput.setValue('1234567899');
  }
  

  sessionUserTypeId=0;
  isSuperAdminValue=0;
  sessionEmail:any="";
  ngOnInit(): void {
	this.isEditMode=false;
    this.isViewMode=false;
	this.isSuperAdminValue=Number(localStorage.getItem("isSuperAdmin"));
	this.sessionUserTypeId = Number(localStorage.getItem("userTypeId"));
	this.sessionEmail = localStorage.getItem("email");

	// alert(this.sessionUserTypeId);
    this.getAllCountry();
    this.getAllState();
    this.getAllCity();
	this.getTimeZone();
	this.getAllClient();
	this.getAllUserTypeName();
	this.ViewUser();
	
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
        //   text: '<i class="fa fa-file-text-o"></i>',
		text: '<img src="assets/icon/csv.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as CSV',
          title: 'User Report' 
        },
        {
          extend: 'excel',
        //   text: '<i class="fa fa-file-excel-o"></i>',
		text: '<img src="assets/icon/excel.png" width="24px" height="24px" style="vertical-align: middle;">',
          titleAttr: 'Download as Excel',
		  title: 'User Report' 
        },
		{
			extend: 'pdf',
			// text:  '<i class="fa fa-file-pdf-o"></i>',
			text: '<img src="assets/icon/pdf.png" width="24px" height="24px" style="vertical-align: middle;">',
			titleAttr: 'Download as Pdf',
			title: 'User Report'  
		},
      ]
    };
  }

  openUserModal(user: any) {
	if (this.sessionUserTypeId == 1) {
		this.EditUser(user.userId);
		($('#user_modal') as any).modal('show');
	}
  }

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  togglePassword() {
	this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
	this.showConfirmPassword = !this.showConfirmPassword;
  }

  ClearForm(){
	this.userForm={};
	this.userForm.firstName = "GBT";
	this.userForm.lastName = "ELD";
  }

keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
    }
}

RefreshPage(){
    window.location.reload();
  }

  clientDataObj=[];
	  clientDataArr;
		async getAllClient(){
		try {
			const client = {
			'clientId': 0,
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

	userTypeDataObj=[];
	userTypeDataArr;
		async getAllUserTypeName(){
		try {
			let arr={};
			const userType = {
			'userTypeId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const clientData: any = await this.request.post('/master/view_user_type/',userType);
			this.userTypeDataObj=[];	
			for (let objKey of Object.keys(clientData)) {
				let dataObj = clientData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						let currentRoleId = dataObj[objKey1].userTypeId;
						let allowAdd = false;
						if (this.sessionUserTypeId == 1 && currentRoleId > 1) {
							allowAdd = true;
						} else if (this.sessionUserTypeId == 2 && currentRoleId == 3) {
							allowAdd = true;
						}

						if (allowAdd) {
							this.userTypeDataObj.push({
								id: currentRoleId,
								userTypeName: dataObj[objKey1].userTypeName,
							});
						}
					}
				}
			}
			this.userTypeDataArr = this.userTypeDataObj;
		} catch (error) {}
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
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].timeZone,
							timeZoneName:dataObj[objKey1].timeZone,
						};
						this.timeZoneNameDataObj.push(arr);
					}
				}
			}
			this.timeZoneDataArr = this.timeZoneNameDataObj;
		} catch (error) {}
	}

  	countryDataObj=[];
	countryDataArr;
	async getAllCountry(){
	try {
		const bcountry = {
		'countryId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const bcountryData: any = await this.request.post('/master/view_country/',bcountry);
		this.countryDataObj=[];	
		for (let objKey of Object.keys(bcountryData)) {
			let dataObj = bcountryData[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					// this.designationDataObj.push(dataObj[objKey1]);
					let arr = {
						id:dataObj[objKey1].countryId,
						countryName:dataObj[objKey1].countryName,
						};
						this.countryDataObj.push(arr);
					}
				}
			}
			this.countryDataArr = this.countryDataObj;
		} catch (error) {}
	}

	stateDataObj=[];
	stateDataArr;
	async getAllState(){
	try {
		const bstate = {
		'stateId': 0,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const bcountryData: any = await this.request.post('/master/view_state/',bstate);
		this.stateDataObj=[];	
		for (let objKey of Object.keys(bcountryData)) {
			let dataObj = bcountryData[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					// this.designationDataObj.push(dataObj[objKey1]);
					let arr = {
						id:dataObj[objKey1].stateId,
						stateName:dataObj[objKey1].stateName,
						};
						this.stateDataObj.push(arr);
					}
				}
			}
			this.stateDataArr = this.stateDataObj;
		} catch (error) {}
	}

  	cityDataObj=[];
	cityDataArr;
	async getAllCity(){
		try {
			const bcountry = {
			'cityId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const bcountryData: any = await this.request.post('/master/view_city/',bcountry);
			this.cityDataObj=[];	
			for (let objKey of Object.keys(bcountryData)) {
				let dataObj = bcountryData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						// this.designationDataObj.push(dataObj[objKey1]);
						let arr = {
							id:dataObj[objKey1].cityId,
							cityName:dataObj[objKey1].cityName,
						};
						this.cityDataObj.push(arr);
					}
				}
			}
			this.cityDataArr = this.cityDataObj;
		} catch (error) {}
	}
  
	isViewMode;
	userViewDetails;
	async EditUser(userId){
		try {
		this.isEditMode=true;
		const user = {
		'userId':userId,
		'clientId':Number(localStorage.getItem("clientId")),
		};
		const data: any = await this.request.post('/master/view_user',user);
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
				this.userViewDetails = dataObj[objKey1];
				} 
			}				
		}
		this.userForm = this.convertToBooleanFlags(this.userViewDetails);
		this.userForm.passwordCnfrm = this.userForm.password;
		// this.userForm = this.userViewDetails;
		// console.log(this.userForm);
		} catch (error) {}
	}

	convertToBooleanFlags(user: any): any {
		return {
			...user,
			status: user.status === 'true' || user.status === true,
			webAccess: user.webAccess === 'true',
			mobileAccess: user.mobileAccess === 'true',
			eldFeature: user.eldFeature === 'true',
			dispatchFeature: user.dispatchFeature === 'true'
		};
	}

	userDetails=[];
	rowData;
	actionAssign;
	isSuperAdmin:boolean=false;
	isLoading : boolean=false;
	isDeleteAction: boolean=false;
	isEditAction: boolean=false;
	async ViewUser(){
		try {
		this.isLoading = true;
		let clientId=0;
		// alert(this.sessionUserTypeId);
		//if(Number(this.sessionUserTypeId)>1 && this.isSuperAdminValue==1){
			clientId=Number(localStorage.getItem("clientId"));
		// }else{
		// 	clientId=0;
		// }
		const user = {
		'userId': 0,
		'clientId':clientId,
		};
		console.log(user);
		this.dtTrigger=new Subject<any>();
		const data: any = await this.request.post('/master/view_user',user);
		this.userDetails=[];
		//alert(data);
		this.dtTrigger.next();
		for (let objKey of Object.keys(data)) {
			let dataObj = data[objKey];
			if(objKey=="result"){
			for (let objKey1 of Object.keys(dataObj)) {
				if(this.sessionEmail!=dataObj[objKey1].email){
					this.userDetails.push(dataObj[objKey1]);
				}
			} 
			}				
		}
		this.rowData = this.userDetails;
		this.isLoading = false;
		} catch (error) {}
	}

	async ActiveInactiveAccount(user){
		// alert(userId);
		let accountStatus = user.status === 'false' ? 'Active' : 'Inactive';
		let status="", webAccess="",mobileAccess="";
		if(user.status=="false"){
			status="true";
			webAccess="true";
			// mobileAccess="true";
		}else{
			status="false";
			webAccess="false";
			// mobileAccess="false";
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
				'userId': Number(user.userId),
				"status":status,
				"webAccess":webAccess,
				"mobileAccess":mobileAccess,
			};
			// console.log(userData);
			const allow: any = await this.request.post('/master/update_user_feature/',userData);
			if (allow) {
				Swal.fire(
				'Updated!',
				'User Information has been updated.',
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

	async ResetToken(user){
		const confirm = await Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, Reset it!'
		});
		if (confirm.value) {
			const userData = {
				'userId': Number(user.userId),
			};
			// console.log(userData);
			const allow: any = await this.request.post('/master/reset_user_token/',userData);
			if (allow) {
				Swal.fire(
				'Updated!',
				'User token has been reset.',
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

	selectedFiles;
	selectFile(event) {
		this.selectedFiles = event.target.files;
	}

	isUpdatedRecord;
	message;
	async SaveUser(){	
	this.isEditMode=false;
	this.isViewMode=false;

	if($("#passwordCnfrm").val()!=$("#password").val()){
		$("#isConfirmPasswordValid").text("Check Password Confirm value Again");
		return;
	}
	
	let status="",webAccess="",mobileAccess="",eldFeature="",dispatchFeature="";
	try {
	if ($('#status').is(":checked"))
		{
		status="true";
		}else{
		status="false";
		}

		if ($('#webAccess').is(":checked"))
		{
		webAccess="true";
		}else{
		webAccess="false";
		}

		if ($('#mobileAccess').is(":checked"))
		{
		mobileAccess="true";
		}else{
		mobileAccess="false";
		}

		if ($('#eldFeature').is(":checked"))
		{
		eldFeature="true";
		}else{
		eldFeature="false";
		}

		if ($('#dispatchFeature').is(":checked"))
		{
		dispatchFeature="true";
		}else{
		dispatchFeature="false";
		}
		let clientId=0;
		if(this.isSuperAdminValue!=1){
			clientId=Number(localStorage.getItem("clientId"));
		}else{
			if(this.isSuperAdminValue==1 && this.userForm.userTypeId==2){
				clientId=Number(localStorage.getItem("clientId"));
			}else{
				clientId=0;
			}
		}
		const User = {
			"username":$("#username").val(),
			"password":$("#password").val(),
			"userTypeId":Number(this.userForm.userTypeId),
			'clientId':clientId,
			// "clientId":Number(this.userForm.clientId),
			"firstName":$("#firstName").val(),
			"lastName":$("#lastName").val(),
			"mobileNo":Number($("#mobileNo").val()),
			"email":$("#email").val(),
			"countryId":Number(this.userForm.countryId),
			"stateId":Number(this.userForm.stateId),
			"cityId":Number(this.userForm.cityId),
			"zipcode":Number($("#zipcode").val()),
			"timezone":this.userForm.timezone,
			"status":status,
			"webAccess":webAccess,
			"mobileAccess":"false",
			"eldFeature":"false",
			"dispatchFeature":"false"
		};
		 console.log(User);
		const save: any = await this.request.post('/master/add_user',User);
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
			this.ViewUser();
			}
			window.location.reload();
			this.ViewUser();
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

// isError;
// errorMessage;
// async SaveUser(){	
// 	this.isEditMode=false;
// 	this.isViewMode=false;

// 	if($("#passwordCnfrm").val()!=$("#password").val()){
// 		$("#isConfirmPasswordValid").text("Check Password Confirm value Again");
// 		return;
// 	}
	
// 	let status="",webAccess="",mobileAccess="",eldFeature="",dispatchFeature="";
// 	try {
// 	if ($('#status').is(":checked"))
// 		{
// 		status="true";
// 		}else{
// 		status="false";
// 		}

// 		if ($('#webAccess').is(":checked"))
// 		{
// 		webAccess="yes";
// 		}else{
// 		webAccess="no";
// 		}

// 		if ($('#mobileAccess').is(":checked"))
// 		{
// 		mobileAccess="yes";
// 		}else{
// 		mobileAccess="no";
// 		}

// 		if ($('#eldFeature').is(":checked"))
// 		{
// 		eldFeature="yes";
// 		}else{
// 		eldFeature="no";
// 		}

// 		if ($('#dispatchFeature').is(":checked"))
// 		{
// 		dispatchFeature="yes";
// 		}else{
// 		dispatchFeature="no";
// 		}
// 		// const User = {
// 		// 	"username":$("#username").val(),
// 		// 	"password":$("#password").val(),
// 		// 	"userTypeId":Number(this.userForm.userTypeId),
// 		// 	'clientId':Number(localStorage.getItem("clientId")),
// 		// 	// "clientId":Number(this.userForm.clientId),
// 		// 	"firstName":$("#firstName").val(),
// 		// 	"lastName":$("#lastName").val(),
// 		// 	"mobileNo":Number($("#mobileNo").val()),
// 		// 	"email":$("#email").val(),
// 		// 	"countryId":Number(this.userForm.countryId),
// 		// 	"stateId":Number(this.userForm.stateId),
// 		// 	"cityId":Number(this.userForm.cityId),
// 		// 	"zipcode":Number($("#zipcode").val()),
// 		// 	"timezone":this.userForm.timezone,
// 		// 	"status":status,
// 		// 	"webAccess":"yes",
// 		// 	"mobileAccess":"yes",
// 		// 	"eldFeature":"yes",
// 		// 	"dispatchFeature":"yes"
// 		// };
		 
// 		var formData: any = new FormData();
// 		formData.append("file", this.selectedFiles.item(0));
// 		formData.append("username", (<HTMLInputElement>document.getElementById("hardwareVersion")).value);
// 		formData.append("password", (<HTMLInputElement>document.getElementById("firmwareVersion")).value);
// 		formData.append("userTypeId", (<HTMLInputElement>document.getElementById("otaUrl")).value);
// 		formData.append("clientId", processOta);
// 		formData.append("firstName", processOta);
// 		formData.append("lastName", processOta);
// 		formData.append("mobileNo", processOta);
// 		formData.append("email", processOta);
// 		formData.append("countryId", processOta);
// 		formData.append("stateId", processOta);
// 		formData.append("cityId", processOta);
// 		formData.append("zipcode", processOta);
// 		formData.append("timezone", processOta);
// 		formData.append("status", processOta);
// 		formData.append("webAccess", processOta);
// 		formData.append("mobileAccess", processOta);
// 		formData.append("eldFeature", processOta);
// 		formData.append("dispatchFeature", processOta);
		
// 		// const save: any = await this.request.post('/hrms/add_employee', formData);

// 		let headers = new HttpHeaders();
// 		//this is the important step. You need to set content type as null
// 		headers.set('Content-Type', null);
// 		headers.set('Accept', "multipart/form-data");
// 		let params = new HttpParams();
// 		const save : any = await this.http.post(environment.apiBaseUrl + '/master/add_user_new', formData, { params, headers }).subscribe((res) => {
// 			console.log(res);
// 			let status,message;
// 			for (let objKey of Object.keys(res)) {
// 				let dataObj = res[objKey];
// 				if(objKey=="status"){
// 					status = dataObj;
// 				}
// 				if(objKey=="message"){
// 					message = dataObj;
// 				}
// 			}
// 			if (status=="SUCCESS") {
// 				// alert("Save Successfully");
// 				const result = Swal.fire({
// 					title: 'Successfully Save',
// 					text: 'Saved Changes.',
// 					type: 'success',
// 					showConfirmButton: false,  
// 						timer: 1500
// 					// confirmButtonText: 'Ok'
// 				});
// 				if (result.value) {
// 					// Reload DataTable
// 						window.location.reload();
// 				}
// 				window.location.reload();
// 			}else{
// 				const result = Swal.fire({
// 					title: "Oops ?",
// 					text: message,   
// 					type: "warning",   
// 					showCancelButton: false,      
// 					confirmButtonColor: "#FF0000",   
// 					confirmButtonText: "Close",   
// 					closeOnConfirm: false,   
// 					closeOnCancel: false,
// 					customClass: "Custom_Cancel"

// 				});
// 			}
// 		},
// 		(error) => {
// 			// this.isLoading = false;
// 			this.isError = true;
// 			if (error) {
// 				this.errorMessage = error.status == 401? 'Unauthorized Error' : error.message;
// 			} else {
// 				this.errorMessage = 'Server Not Response';
// 			}
// 		});
// 	} catch (error) {}
// }

async UpdateUser(){	
	// this.isEditMode=false;
	// this.isViewMode=false;
	if($("#passwordCnfrm").val()!=$("#password").val()){
		$("#isConfirmPasswordValid").text("Check Password Confirm value Again");
		return;
	}
	let status="",webAccess="",mobileAccess="",eldFeature="",dispatchFeature="";
	try {
	if ($('#status').is(":checked"))
		{
		status="true";
		}else{
		status="false";
		}

		if ($('#webAccess').is(":checked"))
		{
		webAccess="true";
		}else{
		webAccess="false";
		}

		if ($('#mobileAccess').is(":checked"))
		{
		mobileAccess="true";
		}else{
		mobileAccess="false";
		}

		if ($('#eldFeature').is(":checked"))
		{
		eldFeature="true";
		}else{
		eldFeature="false";
		}

		if ($('#dispatchFeature').is(":checked"))
		{
		dispatchFeature="true";
		}else{
		dispatchFeature="false";
		}
		let clientId=0;
		// if(Number(this.sessionUserTypeId)>1){
			clientId=Number(localStorage.getItem("clientId"));
		// }else{
		// 	clientId=0;
		// }
		const User = {
		"userId":Number(this.userForm.userId),	
		"username":$("#username").val(),
		"password":$("#password").val(),
		"userTypeId":Number(this.userForm.userTypeId),
		'clientId':clientId,
		// "clientId":Number(this.userForm.clientId),
		"firstName":$("#firstName").val(),
		"lastName":$("#lastName").val(),
		"mobileNo":Number($("#mobileNo").val()),
		"email":$("#email").val(),
		"countryId":Number(this.userForm.countryId),
		"stateId":Number(this.userForm.stateId),
		"cityId":Number(this.userForm.cityId),
		"zipcode":Number($("#zipcode").val()),
		"timezone":this.userForm.timezone,
		"status":status,
		"webAccess":webAccess,
		"mobileAccess":"false",
		"eldFeature":"false",
		"dispatchFeature":"false"
		};
		// console.log(User);
		const save: any = await this.request.post('/master/update_user',User);
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
			this.ViewUser();
			}
			window.location.reload();
			this.ViewUser();
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
 
async DeleteUser() {
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
		const user = {
		'userId': Number(this.userForm.userId)
		};
		const allow: any = await this.request.post('/master/delete_user/',user);
		if (allow) {
		// Successfully Deleted
		Swal.fire(
		'Deleted!',
		'User Information has been deleted.',
		'success'
		);
		// Reload DataTable
		// this.ViewUser();
		window.location.reload();
		// this.ngOnInit();
		} else {
		Swal.fire(
			'Error!'
		);
		}
	}
}

}
