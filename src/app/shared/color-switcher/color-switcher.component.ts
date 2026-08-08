import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-color-switcher',
  templateUrl: './color-switcher.component.html',
  styleUrls: ['./color-switcher.component.scss']
})
export class ColorSwitcherComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // theme setting
    $(".switcher-icon").on("click", function (e) {
      e.preventDefault();
      $(".right-sidebar").toggleClass("right-toggled");
    });
    $('#theme1').click(theme1);
    $('#theme2').click(theme2);
    $('#theme3').click(theme3);
    $('#theme4').click(theme4);
    $('#theme5').click(theme5);
    $('#theme6').click(theme6);
    $('#theme7').click(theme7);

    function theme1() {
      $('#sidebar-wrapper').attr('class', 'sidebar bg-theme bg-theme1');
      $('.brand-logo').removeClass('bg-theme bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6');
      $('.brand-logo').addClass('bg-theme bg-theme1');
    }
    
    function theme2() {
      $('#sidebar-wrapper').attr('class', 'sidebar bg-theme bg-theme2');
      $('.brand-logo').removeClass('bg-theme bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6');
      $('.brand-logo').addClass('bg-theme bg-theme2');
    }
    
    function theme3() {
      $('#sidebar-wrapper').attr('class', 'sidebar bg-theme bg-theme3');
      $('.brand-logo').removeClass('bg-theme bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6');
      $('.brand-logo').addClass('bg-theme bg-theme3');
    }
    
    function theme4() {
      $('#sidebar-wrapper').attr('class', 'sidebar bg-theme bg-theme4');
      $('.brand-logo').removeClass('bg-theme bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6');
      $('.brand-logo').addClass('bg-theme bg-theme4');
    }
    
    function theme5() {
      $('#sidebar-wrapper').attr('class', 'sidebar bg-theme bg-theme5');
      $('.brand-logo').removeClass('bg-theme bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6');
      $('.brand-logo').addClass('bg-theme bg-theme5');
    }
    
    function theme6() {
      $('#sidebar-wrapper').attr('class', 'sidebar bg-theme bg-theme6');
      $('.brand-logo').removeClass('bg-theme bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6');
      $('.brand-logo').addClass('bg-theme bg-theme6');
    }
    function theme7() {
      $('#sidebar-wrapper').attr('class', 'sidebar bg-theme bg-theme7');
      $('.brand-logo').removeClass('bg-theme bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6 bg-theme7');
      $('.brand-logo').addClass('bg-theme bg-theme7');
    }
    // header setting 
    $('#header1').click(header1);
    $('#header2').click(header2);
    $('#header3').click(header3);
    $('#header4').click(header4);
    $('#header5').click(header5);
    $('#header6').click(header6);
    $('#header7').click(header7);
    
    function header1() {
      $('#header-setting').attr('class', 'navbar navbar-expand fixed-top color-header bg-theme1');
    }
    
    function header2() {
      $('#header-setting').attr('class', 'navbar navbar-expand fixed-top color-header bg-theme2');
    }
    
    function header3() {
      $('#header-setting').attr('class', 'navbar navbar-expand fixed-top color-header bg-theme3');
    }
    
    function header4() {
      $('#header-setting').attr('class', 'navbar navbar-expand fixed-top color-header bg-theme4');
    }
    
    function header5() {
      $('#header-setting').attr('class', 'navbar navbar-expand fixed-top color-header bg-theme5');
    }
    
    function header6() {
      $('#header-setting').attr('class', 'navbar navbar-expand fixed-top color-header bg-theme6');
    }

    function header7() {
      $('#header-setting').attr('class', 'navbar navbar-expand fixed-top color-header bg-theme7');
    }

    // default header & sidebar
    $(document).ready(function () {
    //   $("#default-header").click(function () {
    //     $("#header-setting").removeClass("color-header bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6 bg-theme7");
    //   });
    //   $("#default-sidebar").click(function () {
    //     $("#sidebar-wrapper").removeClass("bg-theme bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6 bg-theme7");
    //     $('.brand-logo').removeClass('bg-theme bg-theme1 bg-theme2 bg-theme3 bg-theme4 bg-theme5 bg-theme6 bg-theme7');
    //   });
      // theme7();
      // header7();

    });
    

  }

}
