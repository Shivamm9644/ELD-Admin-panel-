import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestService } from 'src/services/request.service';

export var globalFullName: any = "";
export var globalEmployeeId: any = 0;
export var globalEmail: any = 0;
export var globalUserTypeId: any = 0;
export var globalClientId: any = 0;
export var globalClientName: any = "";
export var globalUserTypeName: any = "";

declare var $: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @ViewChild('f') signin: NgForm;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth : AuthService,
    private http: HttpClient,
    private request : RequestService,
  ) { }

  password:any;
  statusData:any;
  accessToken:any;
  ngOnInit() {
    this.password = 'password';
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

  //  On submit click, reset field value
  errorMessage:any;
  isError:boolean=false;
  isLoading:boolean=false;
  iCount:any = 0;
  disclaimer:any;
  async onSubmit() {
      const randomValue = this.generateRandomString(10); 
      // console.log('Random Token:', randomValue);
      this.accessToken = this.getCookie("accessToken");
      // console.log('Access Token From Browser:', this.accessToken);
      if(this.accessToken=="" || this.accessToken==null){
        // console.log("here...");
        this.setCookie('accessToken', randomValue, 365);
        this.accessToken = randomValue;
      }

      // console.log('Access Token:', this.accessToken);
      this.isLoading=true;
      const userLogin = {
        email: (<HTMLInputElement>document.getElementById("username")).value,
        password: (<HTMLInputElement>document.getElementById("password")).value,
        tokenNo: this.accessToken
      };
      // console.log(userLogin);
      (await this.auth.authUserWebAccess(userLogin)).subscribe(async (auth: any) => {
        //alert("here");
        // console.log(auth);
        if(auth.status=="FAIL"){
          this.isLoading=false;
          this.isError = true;
          this.errorMessage = auth.message;
          this.router.navigate(['/auth/signin']);
        }else if (auth.status=="SUCCESS") {
          let jwt: string = '';
          if (typeof auth.token === 'string') {
            jwt = auth.token;
          } else if (auth.token && typeof auth.token === 'object') {
            jwt = auth.token.token || auth.token.jwt || auth.token.accessToken || JSON.stringify(auth.token);
          } else if (auth.result && typeof auth.result === 'object') {
            jwt = auth.result.token || auth.result.jwt || '';
          }
          jwt = (jwt || '').replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '').trim();
          if (jwt && jwt !== 'null' && jwt !== 'undefined') {
            localStorage.setItem('auth_token', jwt);
          }
          for (let objKey of Object.keys(auth.result)) {
            // console.log(auth.result[objKey].loginDateTime);

            globalFullName = auth.result[objKey].firstName+" "+auth.result[objKey].lastName;
            globalEmployeeId = Number(auth.result[objKey].userId);
            globalEmail = auth.result[objKey].email;
            globalUserTypeId = Number(auth.result[objKey].userTypeId);
            globalClientId = Number(auth.result[objKey].clientId);
            globalClientName = auth.result[objKey].clientName;
            if(globalClientId==0){
              localStorage.setItem('isSuperAdmin', "1");
            }else{
              localStorage.setItem('isSuperAdmin', "0");
            }
            localStorage.setItem('fullName', globalFullName);
            localStorage.setItem('employeeId', globalEmployeeId);
            localStorage.setItem('email', globalEmail);
            localStorage.setItem('userTypeId', globalUserTypeId);
            localStorage.setItem('clientId', globalClientId);
            localStorage.setItem('reloadCount', this.iCount);
            localStorage.setItem('lattitude', auth.result[objKey].lattitude);
            localStorage.setItem('longitude', auth.result[objKey].longitude);
            localStorage.setItem('loginDateTime', auth.result[objKey].loginDateTime);
            localStorage.setItem('allowTracking', auth.result[objKey].allowTracking);
            localStorage.setItem('allowGpsTracking', auth.result[objKey].allowGpsTracking);
            localStorage.setItem('allowIfta', auth.result[objKey].allowIfta);
            localStorage.setItem('exemptDriver', auth.result[objKey].exemptDriver);
            localStorage.setItem('personalUse', auth.result[objKey].personalUse);
            localStorage.setItem('yardMoves', auth.result[objKey].yardMoves);
            localStorage.setItem('shortHaulException', auth.result[objKey].shortHaulException);

            this.disclaimer = auth.result[objKey].disclaimer;
            // localStorage.setItem('clientName', globalClientName);
            if(globalClientId==0){
              // this.router.navigate(['/form/dispatch']);
              // this.router.navigate(['/pages/client-login']);
              // this.router.navigate(['/form/clients']);
              this.isLoading=false;
              if(auth.result[objKey].disclaimerRead==0){
                $('#clientSetupModal').modal('show');
              }else{
                this.router.navigate(['/form/company']);
              }

            }else{
              // this.router.navigate(['/pages/client-login']);
              //this.router.navigate(['/form/dispatch']);
              this.router.navigate(['/form/driver-status']);
              // if(globalUserTypeId==2){
              //   this.router.navigate(['/form/company']);
              // }else{
              //   this.router.navigate(['/form/driver-status']);
              // }
            }
          }
          // console.log(auth.token);

          this.isError = false;
        }else{
          this.isLoading=false;
          this.isError = true;
          this.errorMessage = auth.message;
          this.router.navigate(['/auth/signin']);
        }
      },
      (error) => {
        this.isLoading = false;
        this.isError = true;
        if (error) {
          // this.errorMessage = error.status == 401? 'Unauthorized Error' : error.message;
          this.errorMessage = "Invalid username or password"
        } else {
          this.errorMessage = 'Server Not Response';
        }
      });
  }

  async onAgree() {
    try{
      const users = {
        "userId":Number(globalEmployeeId),
      };
      const save: any = await this.request.post('/master/update_disclaimer_in_user',users);
      } catch (error) {}
    $('#clientSetupModal').modal('hide');
    this.router.navigate(['/form/company']);
  }

  onDisagree() {
    $('#clientSetupModal').modal('hide');
    // Clear auth data and logout
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }
  
  // On ResetPassword link click
  onResetpassword2() {
    this.router.navigate(['reset-password2'], { relativeTo: this.route.parent });
  }

  // On Signup link click
  onSignup2() {
    this.router.navigate(['signup2'], { relativeTo: this.route.parent });
  }

  passwordVisible: boolean = false;
  togglePassword() {
    if (this.password === 'password') {
      this.password = 'text';
      this.passwordVisible = true;
    } else {
      this.password = 'password';
      this.passwordVisible = false;
    }
  }

}
