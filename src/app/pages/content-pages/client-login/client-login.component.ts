import { Component, OnInit ,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataTableDirective} from 'angular-datatables';
import { MasterService } from 'src/services/master.service';
import { Subject } from 'rxjs';
import { DataTablesModule } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { RequestService } from 'src/services/request.service';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-client-login',
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.scss']
})
export class ClientLoginComponent implements OnInit {

  @ViewChild('f') clientLogin: NgForm;

  cForm: any = {}
  constructor(
    private request : RequestService,
    private http: HttpClient,
    private router: Router,
    // public datePipe: DatePipe,
    // private location: Location
  ) { } 

  ngOnInit() {
    this.GetAllClients();
  }

  GotoDispatchPage(clientId,clientName){
    // alert(clientId);
    localStorage.setItem('clientId', clientId);
    localStorage.setItem('clientName', clientName);
    this.router.navigate(['/form/dispatch']);
  }

  Logout(){
    localStorage.clear();
  }

  clientDataObj=[];
  clientDataArr;
  isDataLoading=false;
	async GetAllClients(){
		try {
      this.clientDataObj=[];
			const clients = {
				'clientId': 0
			};
      this.isDataLoading=true;
			const employeeData: any = await this.request.post('/master/view_client/',clients);
			for (let objKey of Object.keys(employeeData)) {
				let dataObj = employeeData[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
            let arr = {
              id:dataObj[objKey1].clientId,
              clientName:dataObj[objKey1].clientName
            };
            this.clientDataObj.push(arr);
					}
				}
			}
      this.clientDataArr = this.clientDataObj;
      this.isDataLoading=false;
		} catch (error) {}
	}
}
