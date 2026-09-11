import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from '../../../services/auth.service';

export var globalFullName: any = "";
export var globalEmployeeId: any = 0;
export var globalEmail: any = 0;

@Component({
  selector: 'app-signin2',
  templateUrl: './signin2.component.html',
  styleUrls: ['./signin2.component.scss']
})
export class Signin2Component implements OnInit {


  @ViewChild('f') signin2: NgForm;

  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth : AuthService,
  ) { }


  //  On submit click, reset field value
  errorMessage;
  isError:boolean=false;
  isLoading:boolean=false;
  async onSubmit() {
      this.isLoading=true;
      const userLogin = {
        username: (<HTMLInputElement>document.getElementById("username")).value,
        password: (<HTMLInputElement>document.getElementById("password")).value,
      };
      // console.log(userLogin);
      (await this.auth.authUser(userLogin)).subscribe(async (auth: any) => {
        //alert("here");
        // console.log(auth);
        if(auth.status=="FAIL"){
          this.isLoading=false;
          this.isError = true;
          this.errorMessage = auth.message;
          this.router.navigate(['/auth/signin']);
        }else if (auth.status=="SUCCESS") {
          globalFullName = auth.result.title+" "+auth.result.firstName+" "+auth.result.lastName;
          globalEmployeeId = Number(auth.result.employeeId);
          globalEmail = auth.result.email;

          localStorage.setItem('fullName', globalFullName);
          localStorage.setItem('employeeId', globalEmployeeId);
          localStorage.setItem('email', globalEmail);

          if (auth.token) {
            const rawToken = typeof auth.token === 'string' ? auth.token : (auth.token?.token || auth.token?.jwt || auth.token);
            const cleanToken = (typeof rawToken === 'string' ? rawToken : JSON.stringify(rawToken)).replace(/^"(.*)"$/, '$1');
            localStorage.setItem('auth_token', cleanToken);
          }
          this.router.navigate(['/form/dispatch']);
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
    
  // On ResetPassword link click
  onResetpassword2() {
    this.router.navigate(['reset-password2'], { relativeTo: this.route.parent });
  }

  // On Signup link click
  onSignup2() {
    this.router.navigate(['signup2'], { relativeTo: this.route.parent });
  }


  ngOnInit() {
  }

}
