import { NgModule } from '@angular/core';
import { CommonModule ,DatePipe} from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { ChartsModule } from 'ng2-charts'
import { ChartsRoutingModule } from '../charts/charts-routing.module';
import { HighchartsChartModule } from 'highcharts-angular';

// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

//@ts-ignore
// import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

// import * as CanvasJS from '@canvasjs/angular-charts';
// import { CanvasJSChart } from '@canvasjs/angular-charts';


import { FormRoutingModule } from './form-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbProgressbarModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomFormsModule } from 'ng2-validation';
import { TextMaskModule } from 'angular2-text-mask';

import { MasksComponent } from './masks/masks.component';
import { EditorComponent } from './editor/editor.component';
import { ValidationComponent } from './validation/validation.component';
import { BasicInputsComponent } from './basic-inputs/basic-inputs.component';
import { InputGroupComponent } from './input-group/input-group.component';
import { FormLayoutsComponent } from './form-layouts/form-layouts.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DispatchComponent } from './dispatch/dispatch.component';
import { DevicesComponent } from './master/devices/devices.component';
import { DriversComponent } from './master/drivers/drivers.component';
import { ReceiverComponent } from './master/receiver/receiver.component';
import { ShipperComponent } from './master/shipper/shipper.component';
import { VehiclesComponent } from './master/vehicles/vehicles.component';
import { CarrierComponent } from './master/carrier/carrier.component';
import { CostomerComponent } from './master/costomer/costomer.component';
import { DvirComponent } from './reports/dvir/dvir.component';
import { DriverLogsComponent } from './reports/driver-logs/driver-logs.component';
import { DriverStatusComponent } from './reports/driver-status/driver-status.component';
import { TimedTransmissionComponent } from './reports/timed-transmission/timed-transmission.component';
import { UsersComponent } from './administrator/users/users.component';
import { ClientsComponent } from './administrator/clients/clients.component';
import { SimulatorComponent } from './administrator/simulator/simulator.component';
import { DriverPayrollComponent } from './payments/driver-payroll/driver-payroll.component';
import { CarrierPayrollComponent } from './payments/carrier-payroll/carrier-payroll.component';
import { InvoiceComponent } from './payments/invoice/invoice.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CountryComponent } from './master/country/country.component';
import { StateComponent } from './master/state/state.component';
import { CityComponent } from './master/city/city.component';
import { ProductComponent } from './master/product/product.component';
import { UserTypeComponent } from './master/user-type/user-type.component';
import { RouteComponent } from './master/route/route.component';
import { CompanyComponent } from './master/company/company.component';
import { LanguageComponent } from './master/language/language.component';
import { CycleUsaComponent } from './master/cycle-usa/cycle-usa.component';
import { CycleCanadaComponent } from './master/cycle-canada/cycle-canada.component';
import { DeviceModalComponent } from './master/device-modal/device-modal.component';
import { VehicleTypeComponent } from './master/vehicle-type/vehicle-type.component';
import { MainTerminalComponent } from './master/main-terminal/main-terminal.component';
import { CargoTypeComponent } from './master/cargo-type/cargo-type.component';
import { FuelTypeComponent } from './master/fuel-type/fuel-type.component';
import { PaymentStatusComponent } from './master/payment-status/payment-status.component';
import { ReferModeComponent } from './master/refer-mode/refer-mode.component';
import { ExceptionComponent } from './master/exception/exception.component';
import { TrailerComponent } from './master/trailer/trailer.component';
import { EldLogComponent } from './reports/eld-log/eld-log.component';
import { LiveDataLogComponent } from './reports/live-data-log/live-data-log.component';
import { DefectComponent } from './master/defect/defect.component';
import { WorkingDetailComponent } from './reports/working-detail/working-detail.component';
import { LogDriverComponent } from './log-driver/log-driver.component';
import { DefectsDetailsComponent } from './reports/defects-details/defects-details.component';
import { IFTAReportsComponent } from './reports/ifta-reports/ifta-reports.component';
import { IdlingComponent } from './reports/idling/idling.component';
import { RemindersComponent } from './maintenance/reminders/reminders.component';
import { HistoryComponent } from './maintenance/history/history.component';
import { UnidentifiedEventsComponent } from './unidentified-events/unidentified-events.component';
import { ManageOtaComponent } from './administrator/manage-ota/manage-ota.component';
import { OtaLogComponent } from './administrator/ota-log/ota-log.component';
import { AdminCompanyComponent } from './master/admin-company/admin-company.component';
import { EditCompanyComponent } from './master/edit-company/edit-company.component';
import { VehicleConditionComponent } from './master/vehicle-condition/vehicle-condition.component';
import { EldDeviceComponent } from './master/eld-device/eld-device.component';
import { EldLogDataComponent } from './reports/eld-log-data/eld-log-data.component';
import { IftaSummaryReportComponent } from './reports/ifta-summary-report/ifta-summary-report.component';
import { LoginLogComponent } from './reports/login-log/login-log.component';
import { ViolationReportComponent } from './reports/violation-report/violation-report.component';
import { EldSupportComponent } from './administrator/eld-support/eld-support.component';
import { AllReportsComponent } from './fleet/all-reports/all-reports.component';
import { SubscriptionExpiryComponent } from './master/subscription-expiry/subscription-expiry.component';
import { EldSettingsComponent } from './master/eld-settings/eld-settings.component';
import { AllUsersComponent } from './administrator/all-users/all-users.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    BasicInputsComponent,
    InputGroupComponent, 
    FormLayoutsComponent,
    MasksComponent, 
    EditorComponent, 
    ValidationComponent, 
    TimepickerComponent,
    DatepickerComponent,
    DispatchComponent,
    DevicesComponent,
    DriversComponent,
    ReceiverComponent,
    ShipperComponent,
    VehiclesComponent,
    CarrierComponent,
    CostomerComponent,
    DvirComponent,
    DriverLogsComponent,
    DriverStatusComponent,
    TimedTransmissionComponent,
    UsersComponent,
    ClientsComponent,
    DriverPayrollComponent,
    CarrierPayrollComponent,
    InvoiceComponent,
    CountryComponent,
    StateComponent,
    CityComponent,
    ProductComponent,
    UserTypeComponent,
    RouteComponent,
    CompanyComponent,
    LanguageComponent,
    CycleUsaComponent,
    CycleCanadaComponent,
    DeviceModalComponent,
    VehicleTypeComponent,
    MainTerminalComponent,
    CargoTypeComponent,
    FuelTypeComponent,
    PaymentStatusComponent,
    ReferModeComponent,
    ExceptionComponent,
    TrailerComponent,
    EldLogComponent,
    LiveDataLogComponent,
    SimulatorComponent,
    DefectComponent,
    WorkingDetailComponent,
    LogDriverComponent,
    DefectsDetailsComponent,
    IFTAReportsComponent,
    IdlingComponent,
    RemindersComponent,
    HistoryComponent,
    UnidentifiedEventsComponent,
    ManageOtaComponent,
    OtaLogComponent,
    AdminCompanyComponent,
    EditCompanyComponent,
    // CanvasJSChart
    VehicleConditionComponent,
    EldDeviceComponent,
    EldLogDataComponent,
    IftaSummaryReportComponent,
    LoginLogComponent,
    ViolationReportComponent,
    EldSupportComponent,
    AllReportsComponent,
    SubscriptionExpiryComponent,
    EldSettingsComponent,
    AllUsersComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    FormRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    CustomFormsModule,
    TextMaskModule,
    NgSelectModule,
    ChartsRoutingModule,
    ChartsModule,
    HighchartsChartModule,
    // CommonModule,
    // RouterOutlet,
    // CanvasJSAngularChartsModule

    
  ],
  providers: [
    DatePipe
  ]
})
export class FormModule { }
