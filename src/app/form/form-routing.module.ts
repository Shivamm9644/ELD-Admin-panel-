import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppGuardGuard } from './../../guards/app-guard.guard';

import { BasicInputsComponent } from './basic-inputs/basic-inputs.component';
import { InputGroupComponent } from './input-group/input-group.component';
import { FormLayoutsComponent } from './form-layouts/form-layouts.component';
import { MasksComponent } from './masks/masks.component';
import { EditorComponent } from './editor/editor.component';
import { ValidationComponent } from './validation/validation.component';
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
import { DefectComponent } from './master/defect/defect.component';

import { EldLogComponent } from './reports/eld-log/eld-log.component';
import { LiveDataLogComponent } from './reports/live-data-log/live-data-log.component';
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
import { SubscriptionExpiryComponent } from './master/subscription-expiry/subscription-expiry.component';
import { EldSettingsComponent } from './master/eld-settings/eld-settings.component';
import { AllUsersComponent } from './administrator/all-users/all-users.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Dashboard'
    }
  },
  {
    path: 'all-users',
    component: AllUsersComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'All Users'
    }
  },
  {
    path: 'eld-settings',
    component: EldSettingsComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'ELD Settings'
    }
  },
  {
    path: 'subscription-expiry',
    component: SubscriptionExpiryComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Subscription Expiry'
    }
  },
  {
    path: 'eld-support',
    component: EldSupportComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'ELD Support'
    }
  },
  {
    path: 'login-log',
    component: LoginLogComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Login Log'
    }
  },
  {
    path: 'violation-report',
    component: ViolationReportComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Violation Report'
    }
  },
  {
    path: 'ifta-summary-report',
    component: IftaSummaryReportComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Ifta Summary Report'
    }
  },
  {
    path: 'eld-log-data',
    component: EldLogDataComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'ELD Log Data'
    }
  },
  {
    path: 'vehicle-condition',
    component: VehicleConditionComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Vehicle Condition'
    }
  },
  {
    path: 'eld-device',
    component: EldDeviceComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'ELD Device'
    }
  },
  {
    path: 'edit-company',
    component: EditCompanyComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Edit Company'
    }
  },
  {
    path: 'admin-company',
    component: AdminCompanyComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Admin Company'
    }
  },
  {
    path: 'ota-log',
    component: OtaLogComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'OTA Log'
    }
  },
  {
    path: 'manage-ota',
    component: ManageOtaComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Manage OTA'
    }
  },
  {
    path: 'unidentified-events',
    component: UnidentifiedEventsComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Unidentified Events'
    }
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'History'
    }
  },
  {
    path: 'reminders',
    component: RemindersComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Reminders'
    }
  },
  {
    path: 'idling',
    component: IdlingComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'Idling'
    }
  },
  {
    path: 'ifta-reports',
    component: IFTAReportsComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'IFTA Reports'
    }
  },
  {
    path: 'defects-details/:driverId/:datetime/:timestamp',
    component: DefectsDetailsComponent,
    canActivate: [AppGuardGuard],
    data: {
      heading: 'defect'
    }
  },


  {
    path: '',
    children: [{
      path: 'log-driver/:employeeId/:datetime',
      component: LogDriverComponent,
      canActivate: [AppGuardGuard],
    data: {
        heading: 'Log Driver'
      }
    },
      {
        path: 'working-detail/:employeeId',
        component: WorkingDetailComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Working Detail'
        }
      },
      {
        path: 'dispatch',
        component: DispatchComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Dispatch'
        }
      },
      {
        path: 'devices',
        component: DevicesComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Devices'
        }
      },
      {
        path: 'drivers',
        component: DriversComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Drivers'
        }
      },
      {
        path: 'receiver',
        component: ReceiverComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Receiver'
        }
      },
      {
        path: 'shipper',
        component: ShipperComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Shipper'
        }
      },
      {
        path: 'vehicles',
        component: VehiclesComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Vehicles'
        }
      }, 
      {
        path: 'carrier',
        component: CarrierComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Carrier'
        }
      },
      {
        path: 'costomer',
        component: CostomerComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Costomer'
        }
      },
      {
        path: 'country',
        component: CountryComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Country'
        }
      },
      {
        path: 'state',
        component: StateComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'State'
        }
      },
      {
        path: 'city',
        component: CityComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'City'
        }
      },
      {
        path: 'product',
        component: ProductComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Product'
        }
      },
      {
        path: 'user-type',
        component: UserTypeComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'User Type'
        }
      },
      {
        path: 'route',
        component: RouteComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Route'
        }
      },
      {
        path: 'company',
        component: CompanyComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Company'
        }
      },
      {
        path: 'language',
        component: LanguageComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Language'
        }
      },
      {
        path: 'cycle-usa',
        component: CycleUsaComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Cycle Usa'
        }
      },
      {
        path: 'cycle-canada',
        component: CycleCanadaComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Cycle Canada'
        }
      },
      {
        path: 'device-modal',
        component: DeviceModalComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Device Modal'
        }
      },
      {
        path: 'vehicle-type',
        component: VehicleTypeComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Vehicle Type'
        }
      },{
        path: 'main-terminal',
        component: MainTerminalComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: ' Main Terminal'
        }
      },
      {
        path: 'cargo-type',
        component: CargoTypeComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Cargo Type'
        }
      },{
        path: 'fuel-type',
        component: FuelTypeComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Fuel Type'
        }
      },
      {
        path: 'payment-status',
        component: PaymentStatusComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Payment Status'
        }
      },
      {
        path: 'refer-mode',
        component: ReferModeComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Refer Mode'
        }
      },
      {
        path: 'exception',
        component: ExceptionComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Exception'
        }
      },
      {
        path: 'trailer',
        component: TrailerComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Trailer'
        }
      },
      {
        path: 'defect',
        component: DefectComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Defect'
        }
      },
      {
        path: 'dvir',
        component:  DvirComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Dvir'
        }
      }, 
      {
        path: 'driver-logs/:employeeId',
        component: DriverLogsComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Driver Logs'
        }
      }, 
      {
        path: 'driver-status',
        component: DriverStatusComponent,
        // canActivate: [AppGuardGuard],
        data: {
          heading: 'Driver Status'
        }
      }, 
      {
        path: 'eld-log',
        component: EldLogComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Eld log'
      }
    },
      {
        path: 'live-data-log',
        component: LiveDataLogComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Live Data Log'
      }
    },
      {
        path: 'timed-transmission',
        component: TimedTransmissionComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Timed Transmission'
        }
      },
      {
        path: 'users',
        component:  UsersComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Users'
        }
      },
      {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Clients'
        }
      },
      {
        path: 'simulator',
        component: SimulatorComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Simulator'
        }
      },
      {
        path: 'driver-payroll',
        component:  DriverPayrollComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Driver Payroll'
        }
      },
      {
        path: 'carrier-payroll',
        component: CarrierPayrollComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Carrier Payroll'
        }
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Invoice'
        }
      },  
      {
        path: 'input-group',
        component: InputGroupComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Input Group'
        }
      }, 
      
      {
        path: 'form-layouts',
        component: FormLayoutsComponent,
        canActivate: [AppGuardGuard],
    data: {
          heading: 'Form Layouts'
        }
      }, 
    {
      path: 'masks',
      component: MasksComponent,
      canActivate: [AppGuardGuard],
    data: {
        heading: 'Masks'
      }
    }, 
    {
      path: 'editor',
      component: EditorComponent,
      canActivate: [AppGuardGuard],
    data: {
        heading: 'Editor'
      }
    },
    {
      path: 'validation',
      component: ValidationComponent,
      canActivate: [AppGuardGuard],
    data: {
        heading: 'Validation'
      }
    },
    {
      path: 'timepicker',
      component: TimepickerComponent,
      canActivate: [AppGuardGuard],
    data: {
        heading: 'Timepicker'
      }
    },
    {
      path: 'datepicker',
      component: DatepickerComponent,
      canActivate: [AppGuardGuard],
    data: {
        heading: 'Datepicker'
      }
    },
   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
