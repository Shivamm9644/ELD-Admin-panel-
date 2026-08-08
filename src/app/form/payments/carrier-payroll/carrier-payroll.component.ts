import { Component, OnInit ,ViewChild } from '@angular/core';
import { DataTableDirective} from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-carrier-payroll',
  templateUrl: './carrier-payroll.component.html',
  styleUrls: ['./carrier-payroll.component.scss']
})
export class CarrierPayrollComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective;
	dtOptions: any = {};
	// dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    // private request : RequestService,
    // private master : MasterService,
    // private http : HttpClient,
    // private router : Router,
    // private datePipe : DatePipe
  ) { }

  ngOnInit(): void {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      dom: 'Bfrtip',
        buttons: [
        {
          extend: 'csv',
          className: 'btn btn-danger',
          text:      '<i class="fa fa-file-text-o"></i>',
          titleAttr: 'Download as CSV',
          title: 'Download_report' 
        },
        {
          extend: 'excel',
          text:      '<i class="fa fa-file-excel-o"></i>',
          titleAttr: 'Download as Excel',
          title: 'Download_report' 
        }
      ]
    };

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
