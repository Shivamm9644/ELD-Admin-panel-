import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { SidebarService } from "../sidebar/sidebar.service";

import * as $ from 'jquery';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    
    public menuItems: any[];

  
    constructor( public sidebarservice: SidebarService,private router: Router) {

        router.events.subscribe( (event: Event) => {

            if (event instanceof NavigationStart) {
                // Show loading indicator
            }

            if (event instanceof NavigationEnd && $(window).width() < 1025 && ( document.readyState == 'complete' || false ) ) {

                this.toggleSidebar();
                // Hide loading indicator
               
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator

                // Present error to user
                console.log(event.error);
            }
        });

    }

        
    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());

    }

    getSideBarState() {
        return this.sidebarservice.getSidebarState();
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
    }
    

    specificMenuItems=[];
    specifiedSubmenuReports=[];
    eldReportSection=[];
    sessionAllowTracking;
    sessionAllowIfta;
    ngOnInit() {
        this.sessionAllowTracking = localStorage.getItem("allowTracking");
        this.sessionAllowIfta = localStorage.getItem("allowIfta");
        this.specificMenuItems=[];
        this.specifiedSubmenuReports=[];
        this.eldReportSection=[];
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        // console.log(this.menuItems);
        // console.log(Number(localStorage.getItem("userTypeId")));
        const userTypeId = Number(localStorage.getItem("userTypeId"));
        const clientId = Number(localStorage.getItem("clientId"));

        const dashboardMenu = this.menuItems.find(menu => menu.title === 'Dashboard');

        if (userTypeId === 1 && clientId === 0) {
            let adminMenu = this.menuItems.filter(menuItem => menuItem.title === "Administrator" || menuItem.title === "ELD");
            this.menuItems = dashboardMenu ? [dashboardMenu, ...adminMenu] : adminMenu;

        } else if (userTypeId === 1) {
            // ✅ Normal admin (clientId != 0)
            this.menuItems = this.menuItems; // or your existing logic

        } else {
            // ✅ Your existing else logic
            for (let key of Object.keys(this.menuItems)) {
                let dataObj = this.menuItems[key]["submenu"];

                if (this.menuItems[key].title != "Administrator" && this.menuItems[key].title != "Dashboard") {

                    for (let key1 of Object.keys(dataObj)) {

                        if (dataObj[key1].title == "Reports") {
                            let dataObj1 = dataObj[key1]["submenu"];

                            for (let key2 of Object.keys(dataObj1)) {
                                if (this.sessionAllowIfta == "true") {
                                    this.specifiedSubmenuReports.push(dataObj1[key2]);
                                } else {
                                    if (!dataObj1[key2].title.toLowerCase().includes('ifta')) {
                                        this.specifiedSubmenuReports.push(dataObj1[key2]);
                                    }
                                }
                            }

                            this.eldReportSection.push({
                                title: 'Reports',
                                icon: 'zmdi zmdi-chart',
                                class: 'sub',
                                badge: '',
                                badgeClass: '',
                                isExternalLink: false,
                                submenu: this.specifiedSubmenuReports
                            });

                        } else {
                            if (this.sessionAllowTracking == "false" && this.menuItems[key].title == "ELD") {
                                if (dataObj[key1].title != "Vehicles") {
                                    this.eldReportSection.push(dataObj[key1]);
                                }
                            } else {
                                this.eldReportSection.push(dataObj[key1]);
                            }
                        }
                    }

                    this.specificMenuItems.push({
                        title: 'ELD',
                        icon: 'fa fa-home',
                        class: 'sub',
                        badge: '',
                        badgeClass: '',
                        isExternalLink: false,
                        submenu: this.eldReportSection
                    });
                }
            }

            //this.menuItems = this.specificMenuItems;
            this.menuItems = dashboardMenu 
                ? [dashboardMenu, ...this.specificMenuItems] 
                : this.specificMenuItems;
        }
        $.getScript('./assets/js/app-sidebar.js');

    }

}
