import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  constructor(
    private request : RequestService,
    private master : MasterService,
    private http : HttpClient,
    private router : Router,
    private datePipe : DatePipe
  ) { }

  chart: any;

  data = {
    vehicles: 0,
    users: 0,
    drivers: 0,
    companies: 0,
    connected: 0,
    disconnected: 0,
  };

  connectedPct: number = 0;
  disconnectedPct: number = 0;

  clientId=0;
  isSuperAdminValue=0;
  ngOnInit() {
    this.isSuperAdminValue=Number(localStorage.getItem("isSuperAdmin"));
    if(this.isSuperAdminValue==1){
      this.clientId = 0;
    }else{
      this.clientId = Number(localStorage.getItem("clientId"));
    }
    this.GetDashboardData();
    this.calculatePercentages();
  }

  isLoading=false;
  async GetDashboardData() {
    try {
      this.isLoading = true;
      const reqData = {
        clientId: this.clientId
      };
      const response: any = await this.request.post('/master/view_project_detail_analytics_by_client/',reqData);
      if (response && response.result) {
        const res = response.result;
        this.data = {
          vehicles: res.totalVehicles || 0,
          users: res.totalUsers || 0,
          drivers: res.totalDrivers || 0,
          companies: res.totalCompanies || 0,
          connected: res.totalDeviceConnected || 0,
          disconnected: res.totalDeviceDisconnected || 0
        };
      }
      this.isLoading = false;
       this.calculatePercentages();
      this.loadChart();
    } catch (error) {
      this.isLoading = false;
      console.error(error);
    }
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  calculatePercentages() {
    let totalDevices = this.data.connected + this.data.disconnected;

    this.connectedPct = +(this.data.connected / totalDevices * 100).toFixed(1);
    this.disconnectedPct = +(this.data.disconnected / totalDevices * 100).toFixed(1);
    
  }

  loadChart() {
    this.chart = new Chart.Chart('deviceChart', {
      type: 'doughnut',
      data: {
        labels: ['Connected Devices', 'Disconnected Devices'],
        datasets: [{
          data: [this.data.connected, this.data.disconnected],
          backgroundColor: ['#16a34a', '#dc2626'],
          borderWidth: 0
        }]
      },
      options: {
        cutoutPercentage: 65,
        legend: {
          position: 'bottom'
        }
      }
    });
  }
}