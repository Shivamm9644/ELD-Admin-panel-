import { Component , OnInit } from '@angular/core';
import { SidebarService } from '../sidebar/sidebar.service';
import { Router, NavigationEnd } from '@angular/router';
import { RequestService } from '../../../services/request.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit{

    constructor(
        public sidebarservice: SidebarService,
        private router: Router,
        private request : RequestService,
    ) { }
        
    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
        
        if ($("#wrapper").hasClass("nav-collapsed")) {
            // unpin sidebar when hovered
            $("#wrapper").removeClass("nav-collapsed");
            $("#sidebar-wrapper").unbind( "hover");
            $("#footer").removeClass("footer-collapsed");
        } else {
            $("#wrapper").addClass("nav-collapsed");
            $("#sidebar-wrapper").hover(
                function () {
                    $("#wrapper").addClass("sidebar-hovered");
                },
                function () {
                    $("#wrapper").removeClass("sidebar-hovered");
                }
            )
            $("#footer").addClass("footer-collapsed");
      
        }
    }
    
    getSideBarState() {
        return this.sidebarservice.getSidebarState();
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
    }

    showSidebar() {
        this.sidebarservice.setSidebarState(false);
    }
    // firstName;
    fullName;
    employeeId=0;
    email;
    clientName;
    timeoutId;
    intervalId: any;
    ngOnInit() {
        this.fullName = localStorage.getItem("fullName");
        this.employeeId = Number(localStorage.getItem("employeeId"));
        this.email = localStorage.getItem("email");
        this.clientName = localStorage.getItem("clientName");

        this.getUnreadAlerts(Number(localStorage.getItem("clientId")));
        this.intervalId = setInterval(() => {
            this.getUnreadAlerts(Number(localStorage.getItem("clientId")));
        }, 10000);

        if(Number(localStorage.getItem("clientId"))>0){
            $(".toggleBtn").show();
            $(".navigation").show();
            this.showSidebar();
        }else if(Number(localStorage.getItem("clientId"))==0 && Number(localStorage.getItem("userTypeId"))==1){
            $(".toggleBtn").show();
            $(".navigation").show();
            this.showSidebar();
        }else{
            $(".toggleBtn").hide();
            $(".navigation").hide();
            this.hideSidebar();
        }

        // this.firstName = localStorage.getItem("firstName");

        /* Search Bar */
        $(document).ready(function () {
            $(".search-btn-mobile").on("click", function () {
                $(".search-bar").addClass("full-search-bar");
            });
            $(".search-arrow-back").on("click", function () {
                $(".search-bar").removeClass("full-search-bar");
            });
        });

        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.fullName = localStorage.getItem("fullName");
                this.employeeId = Number(localStorage.getItem("employeeId"));
                this.email = localStorage.getItem("email");
                this.clientName = localStorage.getItem("clientName");
                // console.log(" >> "+this.clientName);
                if(Number(localStorage.getItem("clientId"))>0){
                    $(".toggleBtn").show();
                    $(".navigation").show();
                    this.showSidebar();
                }
                
                if (event.url === '/form/driver-status') { // Change to your target page
                    // alert("here");
                    this.timeoutId = setTimeout(() => {
                        this.reloadNavbar();
                    }, 2000);
                }
            }
        });

    }

    playNotificationSound() {
        const audio = new Audio();
        audio.src = "assets/sound/notification.mp3";
        audio.load();
        audio.play().catch(err => {
            console.error("Playback failed", err);
        });
    }

    alertDataObj=[];
    alertRowData;
    notificationCount=0;
    async getUnreadAlerts(clientId){
		try {
			const alerts = {
			'clientId':clientId,
			};
			const vehicleData: any = await this.request.post('/dispatch/view_alerts/',alerts);
			this.alertDataObj=[];	
			for (let objKey of Object.keys(vehicleData)) {
				let dataObj = vehicleData[objKey];
				if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
                    dataObj[objKey1].message = this.getIdleTimeMessage(dataObj[objKey1].durationInMillis,dataObj[objKey1].message);
					this.alertDataObj.push(dataObj[objKey1]);
				}
				}
			}
			this.alertRowData = this.alertDataObj;
            this.notificationCount = this.alertDataObj.length;
            // if(this.notificationCount>0){
            //     this.playNotificationSound();
            // }
		} catch (error) {}
	}

    getIdleTimeMessage(durationInMillis,message): string {
        const totalSeconds = Math.floor(durationInMillis / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${message} since ${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    }

    private pad(value: number): string {
        return value < 10 ? '0' + value : value.toString();
    }

    async ReadAlert(alert){
        const alerts = {
            'driverId':alert.driverId,
            'startUtcDateTime':alert.startUtcDateTime,
            'readByEmail': this.email
        };
        // console.log(alerts);
        const save: any = await this.request.post('/dispatch/update_alerts',alerts);
    }

    async ReadAllNotifications(){
        const alerts = {
            'clientId':Number(localStorage.getItem("clientId")),
            'readByEmail': this.email
        };
        // console.log(alerts);
        const save: any = await this.request.post('/dispatch/update_all_unread_alerts',alerts);
        window.location.reload();
    }

    reloadNavbar() {
        console.log('Navbar reloaded!'+this.clientName);
        if(this.clientName!="" && this.clientName!=null){
            $("#clientNameMiddle").text(this.clientName);
            $("#clientNameProfile").text(this.clientName);
        }
        // Any additional logic like re-fetching data, updating UI, etc.
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            console.log("Timeout cleared!");
          }
    }

    async Logout(){
        try{
            const logoutAPI= {
                "employeeId": this.employeeId,
                'loginDateTime' : Number(localStorage.getItem("loginDateTime")),
            };
            // console.log(logoutAPI);
            const data: any = await this.request.post('/auth/logout_web_api',logoutAPI);
            for (let objKey of Object.keys(data)) {
                if(data[objKey]=="SUCCESS"){
                    localStorage.clear();
                }
              }
        }catch(error){ }
        finally {
            localStorage.clear();
        }
    }

    ngOnDestroy(): void {
        // Clear interval to avoid memory leaks
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    } 
}
