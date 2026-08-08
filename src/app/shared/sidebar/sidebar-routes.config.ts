import { RouteInfo } from './sidebar.metadata';

//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

    //     path: 'javascript:;', title: 'Menu Levels', icon: 'fa fa-share', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //         submenu: [
    //             { path: 'javascript:;', title: 'Level 1', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //                 { path: 'javascript:;', title: 'Level 1', icon: 'zmdi zmdi-dot-circle-alt', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, 
    //                     submenu: [
    //                         { path: 'javascript:;', title: 'level 2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //                         { path: 'javascript:;', title: 'level 2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //                         { path: 'javascript:;', title: 'level 2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    //                     ] },
    //             { path: 'javascript:;', title: 'Level 1', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         ]
    // },

    { path: 'form/dashboard', title: 'Dashboard', icon: 'zmdi zmdi-view-dashboard', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    {path: 'javascript:;', title: 'ELD', icon: 'fa fa-home', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
        submenu: [
            { path: '/form/driver-status', title: 'Drivers', icon: 'zmdi zmdi-account-box-o', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/live-data-log', title: 'Vehicles', icon: 'fa fa-retweet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/driver-logs/0', title: 'Logs', icon: 'zmdi zmdi-cast', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/unidentified-events', title: 'Unidentified Events', icon: 'zmdi zmdi-calendar', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/dvir', title: 'DVIRs', icon: 'zmdi zmdi-format-subject', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    
            { 
                path: '', title: 'Reports', icon: 'zmdi zmdi-chart', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
                    { path: '/form/ifta-reports', title: 'IFTA', icon: 'zmdi zmdi-gas-station', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                    { path: '/form/ifta-summary-report', title: 'IFTA Summary', icon: 'zmdi zmdi-gas-station', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                    { path: '/form/idling', title: 'Idling', icon: 'zmdi zmdi-time-interval', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                    { path: '/form/login-log', title: 'Login Log', icon: 'zmdi zmdi-time-interval', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                    { path: '/form/violation-report', title: 'Violations', icon: 'zmdi zmdi-time-interval', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

                ] 
            },
            { 
                path: '', title: 'Maintenance', icon: 'zmdi zmdi-wrench', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
                    { path: '/form/reminders', title: 'Reminders', icon: 'zmdi zmdi-alarm', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                    { path: '/form/history', title: 'History', icon: 'zmdi zmdi-alarm', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                ] 
            },
            {
                path: '', title: 'Manage', icon: 'zmdi zmdi-settings-square', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
                    { path: '/form/drivers', title: 'Drivers', icon: 'zmdi zmdi-account-box-o', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                    { path: '/form/users', title: 'Portal Users', icon: 'zmdi zmdi-account-circle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                    { path: '/form/vehicles', title: 'Vehicles', icon: 'zmdi zmdi-truck', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                    { path: '/form/eld-log', title: 'ELDs', icon: 'zmdi zmdi-remote-control', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                    { path: '/form/admin-company', title: 'Company', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

                    // { path: '/form/company', title: 'Company', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
                ]
            },
            
    ]},

    {
        path: '', title: 'Administrator', icon: 'zmdi zmdi-desktop-mac', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
            { path: '/form/all-users', title: 'All Users', icon: 'zmdi zmdi-account-circle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            // { path: '/form/clients', title: 'Clients', icon: 'zmdi zmdi-accounts', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            // { path: '/form/simulator', title: 'Simulator', icon: 'zmdi zmdi-ungroup', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/company', title: 'Company', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

            { path: '/form/manage-ota', title: 'Manage OTA', icon: 'zmdi zmdi-portable-wifi-changes', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/ota-log', title: 'OTA Log', icon: 'zmdi zmdi-swap-vertical-circle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            // { path: '/form/live-data-log', title: 'Live Panel', icon: 'fa fa-retweet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

            { path: '/form/country', title: 'Country', icon: 'fa fa-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/state', title: 'State', icon: 'fa fa-building-o', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/city', title: 'City', icon: 'zmdi zmdi-city', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/defect', title: 'Defect', icon: 'fa fa-exclamation-triangle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/user-type', title: 'User Type', icon: 'zmdi zmdi-account-circle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/cycle-usa', title: 'Cycle Usa', icon: 'zmdi zmdi-city', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            // { path: '/form/cycle-canada', title: 'Cycle Canada', icon: 'zmdi zmdi-satellite', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/cargo-type', title: 'Cargo Type', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/main-terminal', title: 'Main Terminal', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/payment-status', title: 'Payment Status', icon: 'zmdi zmdi-balance-wallet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/fuel-type', title: 'Fuel Type', icon: 'zmdi zmdi-gas-station', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/device-modal', title: 'Device Modal', icon: 'zmdi zmdi-devices', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/eld-device', title: 'ELD Device', icon: 'zmdi zmdi-devices', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/vehicle-condition', title: 'Vehicle Condition', icon: 'zmdi zmdi-devices', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/eld-log-data', title: 'ELD Log', icon: 'zmdi zmdi-devices', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/eld-support', title: 'ELD Support', icon: 'zmdi zmdi-devices', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            { path: '/form/eld-settings', title: 'Settings', icon: 'zmdi zmdi-settings', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

        ]
    },

    // { path: '/form/dispatch', title: 'Dispatch', icon: 'zmdi zmdi-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu:[]},
    // { path: '/form/driver-status', title: 'Drivers', icon: 'zmdi zmdi-account', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    // {
    //     path: '', title: 'Master', icon: 'zmdi zmdi-folder-outline', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    //         { path: '/form/drivers', title: 'Drivers', icon: 'zmdi zmdi-account-box-o', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/devices', title: 'Devices', icon: 'zmdi zmdi-devices', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/vehicles', title: 'Vehicles', icon: 'zmdi zmdi-truck', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/shipper', title: 'Shipper', icon: 'zmdi zmdi-flight-takeoff', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/receiver', title: 'Receiver', icon: 'zmdi zmdi-flight-land', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/costomer', title: 'Customer', icon: 'zmdi zmdi-accounts-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/carrier', title: 'Carrier', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
           
    //         { path: '/form/product', title: 'Product', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/route', title: 'Route', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         // { path: '/form/company', title: 'Company', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/language', title: 'Language', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            
    //         { path: '/form/device-modal', title: 'Device Modal', icon: 'zmdi zmdi-devices', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/vehicle-type', title: 'Vehicle Type', icon: 'fa fa-truck', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/cargo-type', title: 'Cargo Type', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/fuel-type', title: 'Fuel Type', icon: 'zmdi zmdi-gas-station', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/refer-mode', title: 'Refer Mode', icon: 'zmdi zmdi-router', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/exception', title: 'Exception', icon: 'zmdi zmdi-nature-people', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/trailer', title: 'Trailer', icon: 'fa fa-truck', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/defect', title: 'Defect', icon: 'fa fa-exclamation-triangle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
        
    //     ]
    // },
    // {
    //     path: '', title: 'Reports', icon: 'zmdi zmdi-file-text', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    //         { path: '/form/dvir', title: 'DVIR Log', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/driver-logs', title: 'Driver Log', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/timed-transmission', title: 'Timed Transmission', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/eld-log', title: 'Eld Log', icon: 'fa fa-retweet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/live-data-log', title: 'Live Monitoring', icon: 'fa fa-retweet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },
    // {
    //     path: '', title: 'Administrator', icon: 'zmdi zmdi-desktop-mac', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    //         { path: '/form/users', title: 'Users', icon: 'zmdi zmdi-account-circle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/clients', title: 'Clients', icon: 'zmdi zmdi-accounts', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/simulator', title: 'Simulator', icon: 'zmdi zmdi-ungroup', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/country', title: 'Country', icon: 'fa fa-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/state', title: 'State', icon: 'fa fa-building-o', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/city', title: 'City', icon: 'zmdi zmdi-city', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/user-type', title: 'User Type', icon: 'zmdi zmdi-account-circle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/cycle-usa', title: 'Cycle Usa', icon: 'zmdi zmdi-city', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/cycle-canada', title: 'Cycle Canada', icon: 'zmdi zmdi-satellite', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/main-terminal', title: 'Main Terminal', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/payment-status', title: 'Payment Status', icon: 'zmdi zmdi-balance-wallet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    //     ]
    // },
    // {
    //     path: '', title: 'Payments', icon: 'zmdi zmdi-balance-wallet', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    //         { path: '/form/driver-payroll', title: 'Driver Payroll', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/carrier-payroll', title: 'Carrier Payroll', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/invoice', title: 'Invoice', icon: 'zmdi zmdi-file-text', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },




    // { path: '/form/dispatch', title: 'Dispatch', icon: 'zmdi zmdi-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu:[]},
    
    // {
    //     path: '', title: 'Master', icon: 'zmdi zmdi-folder-outline', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    //         { path: '/form/drivers', title: 'Drivers', icon: 'zmdi zmdi-account-box-o', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/devices', title: 'Devices', icon: 'zmdi zmdi-devices', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/vehicles', title: 'Vehicles', icon: 'zmdi zmdi-truck', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/shipper', title: 'Shipper', icon: 'zmdi zmdi-flight-takeoff', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/receiver', title: 'Receiver', icon: 'zmdi zmdi-flight-land', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/costomer', title: 'Customer', icon: 'zmdi zmdi-accounts-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/carrier', title: 'Carrier', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/country', title: 'Country', icon: 'fa fa-home', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/state', title: 'State', icon: 'fa fa-building-o', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/city', title: 'City', icon: 'zmdi zmdi-city', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/product', title: 'Product', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/user-type', title: 'User Type', icon: 'zmdi zmdi-account-circle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/route', title: 'Route', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         // { path: '/form/company', title: 'Company', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/language', title: 'Language', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/cycle-usa', title: 'Cycle Usa', icon: 'zmdi zmdi-city', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/cycle-canada', title: 'Cycle Canada', icon: 'zmdi zmdi-satellite', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/device-modal', title: 'Device Modal', icon: 'zmdi zmdi-devices', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/vehicle-type', title: 'Vehicle Type', icon: 'fa fa-truck', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/main-terminal', title: 'Main Terminal', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/cargo-type', title: 'Cargo Type', icon: 'zmdi zmdi-collection-speaker', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/fuel-type', title: 'Fuel Type', icon: 'zmdi zmdi-gas-station', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/payment-status', title: 'Payment Status', icon: 'zmdi zmdi-balance-wallet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/refer-mode', title: 'Refer Mode', icon: 'zmdi zmdi-router', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/exception', title: 'Exception', icon: 'zmdi zmdi-nature-people', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/trailer', title: 'Trailer', icon: 'fa fa-truck', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/defect', title: 'Defect', icon: 'fa fa-exclamation-triangle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
        
    //     ]
    // },
    // {
    //     path: '', title: 'Reports', icon: 'zmdi zmdi-file-text', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    //         { path: '/form/dvir', title: 'DVIR Log', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/driver-logs', title: 'Driver Log', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/driver-status', title: 'Driver Status', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/timed-transmission', title: 'Timed Transmission', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/eld-log', title: 'Eld Log', icon: 'fa fa-retweet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/live-data-log', title: 'Live Monitoring', icon: 'fa fa-retweet', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },
    // {
    //     path: '', title: 'Administrator', icon: 'zmdi zmdi-desktop-mac', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    //         { path: '/form/users', title: 'Users', icon: 'zmdi zmdi-account-circle', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/clients', title: 'Clients', icon: 'zmdi zmdi-accounts', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/simulator', title: 'Simulator', icon: 'zmdi zmdi-ungroup', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },
    // {
    //     path: '', title: 'Payments', icon: 'zmdi zmdi-balance-wallet', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    //         { path: '/form/driver-payroll', title: 'Driver Payroll', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/carrier-payroll', title: 'Carrier Payroll', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/invoice', title: 'Invoice', icon: 'zmdi zmdi-file-text', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },






















































































    // {
    //     path: '', title: 'Dashboard', icon: 'zmdi zmdi-view-dashboard', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, submenu: [
    //         { path: '/dashboard/ecommerce-v1', title: 'eCommerce V1', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/dashboard/ecommerce-v2', title: 'eCommerce V2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/dashboard/human-resources', title: 'Human Resources', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/dashboard/digital-marketing', title: 'Digital Marketing', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/dashboard/property-listings', title: 'Property Listings', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/dashboard/services-support', title: 'Services & Support', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/dashboard/healthcare', title: 'Healthcare', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/dashboard/logistics', title: 'Logistics', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },
    // {
    //     path: '', title: 'UI Elements', icon: 'zmdi zmdi-layers', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/ui-elements/cards', title: 'Cards', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/buttons', title: 'Buttons', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/nav-tabs', title: 'Nav Tabs', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/tabset', title: 'Tabset', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/accordion', title: 'Accordion', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/modals', title: 'Modals', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/list-groups', title: 'List Groups', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/bs-elements', title: 'BS Elements', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/tag-input', title: 'Tag Input', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/pagination', title: 'Pagination', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/alerts', title: 'Alerts', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/progress-bar', title: 'Progress Bars', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/toastr', title: 'Toastr', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/sweet-alerts', title: 'Sweet Alert', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-elements/typography', title: 'Typography', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            
    //     ]
    // },
    // {
    //     path: '', title: 'Components', icon: 'zmdi zmdi-card-travel', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
            
    //         { path: '/components/carousel', title: 'Carousel', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/components/grid-layouts', title: 'Grid Layouts', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/components/switch', title: 'Switch', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/components/pricing-table', title: 'Pricing Table', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/components/vertical-timeline', title: 'Vertical Timeline', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/components/horizontal-timeline', title: 'Horizontal Timeline', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/components/color-palette', title: 'Color Palette', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/components/collapse', title: 'Collapse', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/components/dropdown', title: 'Dropdown', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
            
    //     ]
    // },
    // {
    //     path: '', title: 'Charts', icon: 'zmdi zmdi-chart', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/charts/chartjs', title: 'ChartJs', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/charts/apex-charts', title: 'Apex Charts', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/charts/sparkline-charts', title: 'Sparkline Charts', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/charts/peity-charts', title: 'Peity Charts', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/charts/other-charts', title: 'Other Charts', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },
    // {
    //     path: '', title: 'Widgets', icon: 'zmdi zmdi-widgets', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/widgets/static-widgets', title: 'Static Widgets', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/widgets/data-widgets', title: 'Data Widgets', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },
    // {
    //     path: '', title: 'Authentication', icon: 'zmdi zmdi-lock', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/auth/signin1', title: 'SignIn 1', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //         { path: '/auth/signup1', title: 'SignUp 1', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //         { path: '/auth/signin2', title: 'SignIn 2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //         { path: '/auth/signup2', title: 'SignUp 2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //         { path: '/auth/lock-screen', title: 'Lock Screen', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //         { path: '/auth/reset-password1', title: 'Reset Password 1', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //         { path: '/auth/reset-password2', title: 'Reset Password 2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //        ]
    // },
    // {
    //     path: '', title: 'Form', icon: 'zmdi zmdi-format-list-bulleted', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/form/basic-inputs', title: 'Basic Inputs', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/input-group', title: 'Input Group', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/form-layouts', title: 'Form Iayouts', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/masks', title: 'Masks', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/editor', title: 'Editor', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/validation', title: 'Validation', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/timepicker', title: 'Timepicker', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/form/datepicker', title: 'Datepicker', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //        ]
    // },
    // { path: '/calendar', title: 'Calendar', icon: 'zmdi zmdi-calendar-check', class: '', badge: 'New', badgeClass: 'badge badge-success ml-auto', isExternalLink: false, submenu: [] },
    // {
    //     path: '', title: 'Tables', icon: 'zmdi zmdi-grid', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/table/basic', title: 'Basic', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/table/responsive', title: 'Responsive', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //        ]
    // },
    // {
    //     path: '', title: 'Data Tables', icon: 'fa fa-database', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/datatable/basic', title: 'Basic', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/datatable/fullscreen', title: 'Fullscreen', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/datatable/editing', title: 'Editing', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/datatable/filter', title: 'Filter', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/datatable/paging', title: 'Paging', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/datatable/pinning', title: 'Pinning', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/datatable/selection', title: 'Selection', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/datatable/sorting', title: 'Sorting', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //       ]
    // },
    // {
    //     path: '', title: 'UI Icons', icon: 'zmdi zmdi-invert-colors', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/ui-icons/font-awesome-icon', title: 'Font Awesome icon', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-icons/material-design', title: 'Material Design', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-icons/themify', title: 'Themify', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/ui-icons/line-icons', title: 'Line Icons', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },
    // {
    //     path: '', title: 'Maps', icon: 'zmdi zmdi-map', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/maps/google', title: 'Google Maps', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/maps/fullscreen', title: 'Full Screen Map', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //     ]
    // },
    // {
    //     path: '', title: 'Pages', icon: 'zmdi zmdi-collection-folder-image', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //     submenu: [
    //         { path: '/pages/invoice', title: 'Invoice', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/user-profile', title: 'User Profile', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/blank-page', title: 'Blank Page', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         { path: '/pages/coming-soon', title: 'Coming Soon', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //         { path: '/pages/error-403', title: 'Error 403', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //         { path: '/pages/error-404', title: 'Error 404', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //         { path: '/pages/error-500', title: 'Error 500', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
    //     ]
    // },
    // {
    //     path: 'javascript:;', title: 'Menu Levels', icon: 'fa fa-share', class: 'sub', badge: '', badgeClass: '', isExternalLink: false,
    //         submenu: [
    //             { path: 'javascript:;', title: 'Level 1', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //                 { path: 'javascript:;', title: 'Level 1', icon: 'zmdi zmdi-dot-circle-alt', class: 'sub', badge: '', badgeClass: '', isExternalLink: false, 
    //                     submenu: [
    //                         { path: 'javascript:;', title: 'level 2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //                         { path: 'javascript:;', title: 'level 2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //                         { path: 'javascript:;', title: 'level 2', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

    //                     ] },
    //             { path: 'javascript:;', title: 'Level 1', icon: 'zmdi zmdi-dot-circle-alt', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    //         ]
    // },
    // 

    
];
