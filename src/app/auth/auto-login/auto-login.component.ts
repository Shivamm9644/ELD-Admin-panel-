import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { RequestService } from 'src/services/request.service';

export var globalFullName: any = "";
export var globalEmployeeId: any = 0;
export var globalEmail: any = "";
export var globalUserTypeId: any = 0;
export var globalClientId: any = 0;
export var globalClientName: any = "";
export var globalUserTypeName: any = "";

declare var $: any;

@Component({
  selector: 'app-auto-login',
  templateUrl: './auto-login.component.html',
  styleUrls: ['./auto-login.component.scss']
})
export class AutoLoginComponent implements OnInit {

  password: string = 'password';
  accessToken: any;
  errorMessage: any;
  isError: boolean = false;
  isLoading: boolean = false;
  disclaimer: any;
  passwordVisible: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private http: HttpClient,
    private request: RequestService,
  ) {}

  ngOnInit() {
    this.autoLoginSuperAdmin();
  }

  username:any;
  passcode:any;
  async autoLoginSuperAdmin() {
    try {
      let isFirst=false;
      const user = {
        'userId': 0,
        'clientId':0,
      };
      const data: any = await this.request.post('/master/view_user',user);
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
        for (let objKey1 of Object.keys(dataObj)) {
          if(dataObj[objKey1].userTypeId==1 && isFirst==false){
            isFirst=true;
            this.username = dataObj[objKey1].email;
            this.passcode = dataObj[objKey1].password;
          }
        } 
      }				
    }
    } catch (error) {}
    const username = this.username;
    const password = this.passcode;
    this.accessToken = this.getCookie("accessToken");
    if (!this.accessToken) {
      const randomValue = this.generateRandomString(10);
      this.setCookie('accessToken', randomValue, 365);
      this.accessToken = randomValue;
    }

    const userLogin = {
      email: username,
      password: password,
      tokenNo: this.accessToken
    };

    this.isLoading = true;

    (await this.auth.authUserWebAccess(userLogin)).subscribe(async (auth: any) => {
      this.isLoading = false;

      if (auth.status === "FAIL") {
        this.handleLoginError(auth.message);
      } 
      else if (auth.status === "SUCCESS" && auth.result && auth.result.length > 0) {
        const user = auth.result[0];
        globalUserTypeId = Number(user.userTypeId);
        if (globalUserTypeId === 1) {
          console.log(user);
          this.storeUserData(user, auth.token);
          this.disclaimer = user.disclaimer;

          if (user.disclaimerRead === 0) {
            $('#clientSetupModal').modal('show');
          } else {
            this.router.navigate(['/form/company']);
          }
        } else {
          this.handleLoginError('Access Denied: Only SuperAdmin can auto-login.');
        }
      } 
      else {
        this.handleLoginError(auth.message || 'Unexpected login error.');
      }
    }, 
    (error) => {
      this.handleLoginError("Invalid username or password");
    });
  }

  storeUserData(user: any, token: any) {
    globalFullName = user.firstName + " " + user.lastName;
    globalEmployeeId = Number(user.userId);
    globalEmail = user.email;
    globalUserTypeId = Number(user.userTypeId);
    globalClientId = Number(user.clientId);
    globalClientName = user.clientName;

    localStorage.setItem('auth_token', JSON.stringify(token));
    localStorage.setItem('fullName', globalFullName);
    localStorage.setItem('employeeId', globalEmployeeId.toString());
    localStorage.setItem('email', globalEmail);
    localStorage.setItem('userTypeId', globalUserTypeId.toString());
    localStorage.setItem('clientId', globalClientId.toString());
    localStorage.setItem('clientName', globalClientName);
  }

  async onAgree() {
    try {
      const users = { "userId": Number(globalEmployeeId) };
      await this.request.post('/master/update_disclaimer_in_user', users);
    } catch (error) {}

    $('#clientSetupModal').modal('hide');
    this.router.navigate(['/form/company']);
  }

  onDisagree() {
    $('#clientSetupModal').modal('hide');
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }

  handleLoginError(message: string) {
    this.isError = true;
    this.errorMessage = message;
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }

  setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
    this.password = this.passwordVisible ? 'text' : 'password';
  }
}
