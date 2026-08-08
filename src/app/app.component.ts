import { Component, OnInit ,Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  userTypeId=0;
  ngOnInit() {
    this.userTypeId = Number(localStorage.getItem("userTypeId"));
    // alert(this.userTypeId);
    // if (this.userTypeId == 1) {
    //   setTimeout(() => {
    //     this.hideAllButtonsAndLinks();
    //   }, 500);
    // }
    this.clearAllCookies();
  }

  hideAllButtonsAndLinks(): void {
    const elements = document.querySelectorAll('button, a');
    elements.forEach((el: any) => {
      this.renderer.setStyle(el, 'display', 'none');
    });
  }

  // clearAllCookies() {
  //   console.log("clear cookie...");
  //   document.cookie.split(";").forEach(function(c) {
  //     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
  //   });
  // }

  clearAllCookies() {
    // console.log("Clearing all cookies except 'accessToken'...");

    const cookies = document.cookie.split(";");
    cookies.forEach((cookie) => {
      const [name] = cookie.split("=");
      const trimmedName = name.trim();

      if (trimmedName !== "accessToken") {
        document.cookie = `${trimmedName}=;expires=${new Date(0).toUTCString()};path=/`;
      }
    });
  }

}
