import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../../shared/sidebar/sidebar.service';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http'; 
import { environment } from 'src/environments/environment';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import {Fill, Stroke, Style} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import MultiPolygon from 'ol/geom/MultiPolygon';
import LineString from 'ol/geom/LineString';
import MultiLineString from 'ol/geom/MultiLineString';
import Text from 'ol/style/Text';
import Point from 'ol/geom/Point';
import {transform} from 'ol/proj';
import CircleStyle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';
import {toStringHDMS} from 'ol/coordinate'; 
import Overlay from 'ol/Overlay';
import {toLonLat} from 'ol/proj';
import {Draw, Select, Modify, Snap} from 'ol/interaction';
//import GeoJSON from 'ol/format/GeoJSON';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { RequestService } from '../../../../services/request.service';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';

@Component({
  selector: 'app-live-data-log',
  templateUrl: './live-data-log.component.html',
  styleUrls: ['./live-data-log.component.scss']
})
export class LiveDataLogComponent implements OnInit {

  constructor(
    public sidebarservice: SidebarService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private request : RequestService,
    public datePipe: DatePipe,
  ) { }

  liveDataForm : any={};

  isLoading=false;
  
  vector;
  source;
  currentDate;
  timeoutId;
  sessionLat;
  sessionLng;
  sessionAllowGpsTracking;
  userTypeId;
  ngOnInit() {
   // this.toggleSidebar();

    this.source = new VectorSource();
    // this.vector = new VectorLayer({
    //   source: this.source,
    //   style: {
    //     'fill-color': 'rgba(255, 255, 255, 0.2)',
    //     'stroke-color': '#ffcc33',
    //     'stroke-width': 2,
    //     'circle-radius': 7,
    //     'circle-fill-color': '#ffcc33',
    //   },
    // });

    this.userTypeId = Number(localStorage.getItem("userTypeId"));
    this.sessionAllowGpsTracking = localStorage.getItem("allowGpsTracking");

    this.sessionLat = localStorage.getItem("lattitude");
    this.sessionLng = localStorage.getItem("longitude");
    

    // console.log(localStorage.getItem("lattitude")+" :: "+localStorage.getItem("longitude"));

    this.currentDate = this.datePipe.transform(new Date(),"yyyy-MM-ddTHH:mm");
    $("#fromDate").val(this.currentDate);
    $("#toDate").val(this.currentDate);

    this.getAllTruckNo();
    this.vector = new VectorLayer({
      source: this.source,
      style: new Style({
          stroke: new Stroke({
            color: 'black',
            width: 5
          })
      })
    });
    this.isLoading=true;
    this.timeoutId = setTimeout(() => {
      this.LoadMap();
      this.GetData();
      this.DrawPolygonLine();
    }, 2000);
    
  }

  vehicleDataObj=[];
	vehicleDataArr;
	async getAllTruckNo(){
		try {
			const vehicle = {
			'vehicleId': 0,
			'clientId':Number(localStorage.getItem("clientId")),
			};
			const vehicleData: any = await this.request.post('/master/view_vehicle/',vehicle);
			this.vehicleDataObj=[];	
			for (let objKey of Object.keys(vehicleData)) {
				let dataObj = vehicleData[objKey];
				if(objKey=="result"){
				for (let objKey1 of Object.keys(dataObj)) {
					// this.designationDataObj.push(dataObj[objKey1]);
					let arr = {
						id:dataObj[objKey1].vehicleId,
						vehicleNo:dataObj[objKey1].vehicleNo,
					};
					this.vehicleDataObj.push(arr);
				}
				}
			}
			this.vehicleDataArr = this.vehicleDataObj;
		} catch (error) {}
	}

  geofanceDetails;
  geofanceRowdata;
  vectorLayerPoly=[];
  flattenedCoordinates: Number[][] = [];

  async DrawPolygonLine(){
    try {
      // this.loading = true;
      let type="";
      let stateName, color, stateId=0;
      const geofances = {
        'geoId': 0
      };
      const data: any = await this.request.post('/master/view_geofance_master/',geofances);
      for (let objKey of Object.keys(data)) {
        let dataObj = data[objKey];
        if(objKey=="result"){
          for (let objKey1 of Object.keys(dataObj)) {
            // console.log(dataObj[objKey1].latLng.coordinates);
            this.geofanceDetails=[];
            let dataObj1 = dataObj[objKey1].latLng.coordinates;
            this.geofanceDetails = dataObj1;
            stateName = dataObj[objKey1].stateName;
            stateId = dataObj[objKey1].stateId;
            color = "#000";
            type = dataObj[objKey1].type;

            // console.log(" >> "+type);
            if(type=="Polygon" || type=="MultiPolygon"){ 
              let styles = [
                new Style({
                  stroke: new Stroke({
                    color: color,
                    width: 1,
                  })
                })
              ];
              var trip;
              if(type=="Polygon"){
                  trip = new Polygon(this.geofanceDetails).transform('EPSG:4326','EPSG:3857');
              } else{
                var obj_latlng = this.geofanceDetails;
                trip = new MultiPolygon(obj_latlng).transform('EPSG:4326','EPSG:3857');
              }

              let featurething = new Feature({
                type: 'geofance_polygon',
                geometry:trip,
                stateName:stateName,
                geofanceId:dataObj[objKey1].geofanceId,
              });

              let vectorSourcePoly = new VectorSource({
                features: [featurething]
              });
              this.vectorLayerPoly[stateId] = new VectorLayer({
                  style: styles,
                  source: vectorSourcePoly
              });
              this.map.addLayer(this.vectorLayerPoly[stateId]);
            }
          } 
        }				
      }
      // this.loading = false;
    } catch (error) {}
  }

  toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
    
    if ($("#wrapper").hasClass("nav-collapsed")) {
        // unpin sidebar when hovered
        $("#wrapper").removeClass("nav-collapsed");
        $("#sidebar-wrapper").unbind( "hover");
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
  
    }
}

  loading=false;
  map: Map;
  googleLayerHybrid:any;
  googleLayerHybrid2:any;
  public anchors;
  LoadMap(){
    
    this.googleLayerHybrid2 = new TileLayer({
      source: new XYZ({
        //url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        url: 'http://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
      })
    });

    this.googleLayerHybrid = new TileLayer({
      source: new XYZ({
        url: 'http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
      })
    });

    /* Elements that make up the popup. */
    // this.container = $("#popup").val(); //document.getElementById('popup');
    // this.content = $("#popup-content").val(); //document.getElementById('popup-content');
    // this.closer = $("#popup-closer").val(); //document.getElementById('popup-closer');

    let container1 = document.getElementById('popup');
    let content1 = document.getElementById('popup-content');
    let closer1 = document.getElementById('popup-closer');


    if (closer1) {
      closer1.onclick = function () {
        overlay1.setPosition(undefined);
        closer1.blur();
        return false;
      };
    }

    let overlay1 = new Overlay({
      element: container1,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    this.map = new Map({
      target: 'map',
      overlays: [overlay1],
      layers: [this.googleLayerHybrid2,this.vector],
      view: new View({
        center: fromLonLat([this.sessionLng, this.sessionLat]),
        zoom: 0,
        minZoom: 4,
        maxZoom: 25
      }),
    });

    console.log(this.map);

    this.map.on('singleclick', function(evt){
      //alert(evt.coordinate);
      let feature = evt.map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer){
          return feature;
      });
      if (feature){
        //alert(feature.get('type'));
        if(feature.get('type')=="device_position"){
          $("#popup").css("width", "500px");
          let device_id=feature.get('MAC'); 
          // alert(" >> "+device_id);
          let device_icon=feature.get('device_icon');
          let placeAddress=feature.get('placeAddress');
         
          let device_name=feature.get('vehicleName');
          let lat_lng=feature.get('lat')+" "+feature.get('lon');
          let deviceStatus=feature.get('movingMessage');

          let driverName=feature.get('driverName');
          let mobileNo=feature.get('mobileNo');

          let dateTime=feature.get('dateTime');
          let speed=feature.get('speed');
          let device_information;
          
          let dataDate = new Date(dateTime);
          let curDate = new Date();
          let diff;
          if(dataDate < curDate){
            let delta = (curDate.getTime() - dataDate.getTime())/1000;
            // calculate (and subtract) whole days
            let days = Math.floor(delta / 86400);
            delta -= days * 86400;
            // calculate (and subtract) whole hours
            let hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            // calculate (and subtract) whole minutes
            let minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            let seconds = Math.floor(delta % 60);
            if(days==0){
              diff=days+"days ";
              // if(hours!=0) diff+=hours+"hrs ";
            }
            if(days!=0){
              diff=days+"days ";
              // if(hours!=0) diff+=hours+"hrs ";
            }
            else if(hours!=0)
            { 
              diff+=hours+"hrs ";
              if(minutes!=0) diff+=minutes+"mins ";
            }else{
              if(minutes!=0) diff+=minutes+"mins ";
              diff+=seconds+"secs";  
            }
          }else{
            diff=0;
          }

          let sDateTime = feature.get('sDateTime');    
          device_information=`
                <div id="device_map_popup" style="font-size:12px;">
                  <div style="border: 1px solid #C0C0C0;margin: -1px;">
                    <div class="row" style="padding-top:18px;">
                      <div class="col-lg-1 text-right"><img id="icon" width="25" height="25" src="`+device_icon+`"></div>
                      <div class="col-lg-7 text-left"><h6 class="modal-title" id="device_detail_heading">`+device_name+`</h6></div>
                      
                      <div class="col-lg-4 text-right">
                        <span id="device_datetime_diff">`+diff+` ago</span><br/>
                        <span id="device_datetime">`+sDateTime+`<span>
                      </div>
                    </div>
                  </div>
                  <div style="border: 1px solid #C0C0C0;margin: -1px;">
                    <div style="padding:10px;font-size:1.1em" id="device_address">`+placeAddress+`</div>
                  </div>
                  <div style="border: 1px solid #C0C0C0; margin:-1px;" class="row">
                    <div style="border: 1px solid #C0C0C0; margin-top:-1px;margin-bottom:-1px;margin-left:-1px; padding-right:1px;" class="col-lg-6"><div style="padding-top:0px;" class="text-center" id="device_speed">`+speed+` miles/hrs</div></div>
                    <!--div style="border: 1px solid #C0C0C0;margin-top:-1px;margin-bottom:-1px;margin-left:-1px;" class="col-lg-3"><div style="padding-top:5px;" class="text-center font-weight-bold" id="device_moving_status">`+deviceStatus+`</div></div>
                    <div style="border: 1px solid #C0C0C0;margin-top:-1px;margin-bottom:-1px;margin-left:-1px; padding-right:1px;" class="col-lg-3"><div style="padding-top:10px;" class="text-center" id="device_satellites">`+0+`</div></div-->
                    <div style="border: 1px solid #C0C0C0;margin-top:-1px;margin-bottom:-1px;margin-left:-1px;border-right-style: none;" class="col-lg-6"><div class="text-center" id="device_latlng">`+lat_lng+`</div></div>
                  </div>
                 <div style="border: 1px solid #C0C0C0;margin: -1px;" class="row">
                    <div style="font-size:1.2em">&nbsp;&nbsp;
                      <span id="device_detail_name">
                        <b>ID:</b>`+device_id+`
                      </span>
                    </div>
                  </div>

                  <!-- <div style="border: 1px solid #C0C0C0; margin:-1px;" class="row">
                  <div style="border: 1px solid #C0C0C0; margin-top:-1px;margin-bottom:-1px;margin-left:-1px; padding-right:1px;" class="col-lg-4"><div id="device_detail_name"><b>ID:</b>`+device_id+`</div></div>
                  <div style="border: 1px solid #C0C0C0;margin-top:-1px;margin-bottom:-1px;margin-left:-1px;" class="col-lg-8"><div id="device_direction_name"><b>Destination:</b></div></div>
                  </div>-->
                  
                  <div style="border: 1px solid #C0C0C0;margin: -1px;" class="row">
                    <div style="font-size:1.2em">&nbsp;&nbsp;
                      <span id="driver_ward_detail">
                        <b>Driver: </b>`+driverName+`(`+mobileNo+`)
                      </span>
                    </div>
                  </div>


                </div>`;  
        
          let coordinate = evt.coordinate;
          let hdms = toStringHDMS(coordinate);
          content1.innerHTML = device_information; 
          overlay1.setPosition(coordinate);  

        }else if(feature.get('type')=="track_points"){
          let timestamp=feature.get('timestamp'); let date_time_show=""; let heading="";
          let device_information="";
          if(feature.get('idle_point')==true){
            // alert(" >> "+feature.get('idle_from_time'));
              let idle_from = feature.get('idle_from_time').split(" ");
              let idle_to = feature.get('idle_to_time').split(" ");
              date_time_show = idle_from[1] +" To "+ idle_to[1];
              heading = "Idle Duration";
              device_information=`
              <style>
                .track_table_idle{
                  padding: .25rem !important;
                  vertical-align: top;
                  border-top: 1px solid #dee2e6;
                  white-space: normal !important;
                  word-break: normal !important;
                  word-wrap: break-word !important;
                }
              </style>
              <table class="table table-bordered table-striped" style="font-size:14px;">
                  <tr>
                      <th style="background-color:#0a766c; color:white;" colspan="2" class="text-center track_table_idle">IDLE POINT</th>
                  </tr>
                  <tr>
                      <th width="50%" class="track_table_idle"><b>Vehicle Name</b></th>
                      <td class="track_table_idle">`+feature.get('device_name')+`</td>
                  </tr>
                  <tr>
                      <td class="text-center track_table_idle"><b>Start Time</b></td>
                      <td class="text-center track_table_idle"><b>End Time</b></td>
                  </tr>
                  <tr>
                      <td class="text-center track_table_idle">`+idle_from[1]+`</td>
                      <td class="text-center track_table_idle">`+idle_to[1]+`</td>
                  </tr>`;
                  if(feature.get('idle_time_duration')==true){
                      device_information+=`<tr">
                          <td colspan="2" class="track_table_idle">
                            <b style="color:red">More than 2 minutes</b> 
                            <b>(Duration : `+feature.get('idle_duration')+`)</b>
                          </td>
                      </tr>`;
                  }else{
                     device_information+=`<tr>
                          <td colspan="2" class="track_table_idle">
                            <b style="color:green">Less than 2 minutes</b>
                            <b>(Duration : `+feature.get('idle_duration')+`)</b>
                          </td>
                      </tr>`;                                                                                    
                  }                                                                                       
                  device_information+=`<!--tr>
                      <th class="track_table_idle"><b>Total&nbsp;Duration</b></th>
                      <td class="track_table_idle">`+feature.get('idle_duration')+`</td>
                  </tr-->
                  <tr>
                      <td colspan="2" class="track_table_idle">`+feature.get('place_address')+`</td>
                  </tr>
                  <!--tr>
                      <td class="text-center track_table_idle"><b>Latitude</b></td>
                      <td class="text-center track_table_idle"><b>Longitude</b></td>
                  </tr>
                  <tr>
                      <td class="text-center track_table_idle">`+feature.get('lat')+`</td>
                      <td class="text-center track_table_idle">`+feature.get('lng')+`</td>
                  </tr-->
                  <tr>
                    <td class="text-center track_table_idle"><b>Coordinates</b></td>
                    <td class="track_table_idle">`+feature.get('lat')+`,`+feature.get('lng')+`</td>
                  </tr>
              </table>`;                      
          }else{
              date_time_show = feature.get('date_time');
              heading = "Date Time";
              device_information=`
              <style>
                .track_table{
                  padding: .25rem !important;
                  vertical-align: top;
                  border-top: 1px solid #dee2e6;
                  white-space: normal !important;
                  word-break: normal !important;
                  word-wrap: break-word !important;
                }
              </style>
              <table class="table table-bordered table-striped">
                  <tr>
                    <th style="background-color:#0a766c; color:white;" colspan="2" class="text-center track_table">TRACK POINT</th>
                  </tr>
                  <tr>
                    <th class="track_table">Device&nbsp;Name</th>
                    <td class="track_table">`+feature.get('device_name')+`</td>
                  </tr>
                  <tr>
                      <th class="track_table">`+heading+`</th>
                      <td class="track_table">`+date_time_show+`</td>
                  </tr>
                  <tr>
                    <th class="track_table">Address</th>
                    <td class="track_table">`+feature.get('place_address')+`</td>
                  </tr>
                  <tr>
                    <th class="track_table">Lat Lng</th>
                    <td class="track_table">`+feature.get('lat')+`,`+feature.get('lng')+`</td>
                  </tr>
                  <tr>
                    <th class="track_table">Speed</th>
                    <td class="track_table">`+feature.get('speed')+`</td>
                  </tr>
              </table>`;                    
          }

          let coordinate =transform([parseFloat(feature.get('lng')), parseFloat(feature.get('lat'))], 'EPSG:4326','EPSG:3857');
          let hdms = toStringHDMS(coordinate);
          content1.innerHTML = device_information;
          overlay1.setPosition(coordinate);
        }else if(feature.get('type')=="geofance_polygon"){
          $("#popup").css("width", "300px");
          let stateName=feature.get('stateName');
          let geofanceId=feature.get('geofanceId');
          let device_information=`
                  <div style="border: 1px solid #C0C0C0">
                    <div style="font-size:1.2em">
                      <span>
                        <b>State: </b>`+stateName+`(`+geofanceId+`)
                      </span>
                    </div>
                  </div>`; 

          let coordinate = evt.coordinate;
          let hdms = toStringHDMS(coordinate);
          content1.innerHTML = device_information; 
          overlay1.setPosition(coordinate);  
        }else{

        }
      }
    });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      console.log("Timeout cleared!");
      this.isLoading=false;
    }

    // this.map.on('pointermove', function(evt){
    //   //alert(evt.coordinate);
    //   let feature = evt.map.forEachFeatureAtPixel(evt.pixel,
    //     function(feature, layer){
    //       return feature;
    //   });
    //   if (feature){
    //     //alert(feature.get('type'));
    //     if(feature.get('type')=="geofance_polygon"){
    //       $("#popup").css("width", "300px");
    //       let stateName=feature.get('stateName');
    //       let geofanceId=feature.get('geofanceId');
    //       let device_information=`
    //               <div style="border: 1px solid #C0C0C0">
    //                 <div style="font-size:1.2em">
    //                   <span>
    //                     <b>State: </b>`+stateName+`(`+geofanceId+`)
    //                   </span>
    //                 </div>
    //               </div>`; 

    //       let coordinate = evt.coordinate;
    //       let hdms = toStringHDMS(coordinate);
    //       content1.innerHTML = device_information; 
    //       overlay1.setPosition(coordinate);  
    //     } else{

    //     }
    //   }
    // });

  }

  RefreshPage(){
    window.location.reload();
  }

  RefreshMap(){
    // alert("here");
    this.map.setView(new View({
      center: fromLonLat([this.sessionLng, this.sessionLat]),
      zoom: 0,
      minZoom: 4,
      maxZoom: 25
    }));
  }

  NormalAndSatelliteMap(){
    if ($('#satellite_map').is(':checked')) {
        this.map.removeLayer(this.googleLayerHybrid2);
        this.map.addLayer(this.googleLayerHybrid);
    } else {
        this.map.removeLayer(this.googleLayerHybrid);
        this.map.addLayer(this.googleLayerHybrid2);
    }
    this.DrawPolygonLine();
  }

  marker;
  HighLightDevice(vehicleId){
    let lat;
    let lng;
    // console.log(this.VEHICLE_LIST);
    // for (let objKey of Object.keys(this.VEHICLE_LIST)) {
    //   let dataObj = this.VEHICLE_LIST[objKey];
    //   if(objKey=="result"){
    //     for (let objKey1 of Object.keys(dataObj)) {
    //       // alert(" >> "+dataObj[objKey1].VehicleId);
    //       if(dataObj[objKey1].VehicleId==vehicleId){
    //         // alert("here");
    //         lat = parseFloat(dataObj[objKey1].Lattitude);
    //         lng = parseFloat(dataObj[objKey1].Longitude);
    //       }
    //     }
    //   }
    // }

    for (let objKey of Object.keys(this.VEHICLE_LIST)) {
      let dataObj = this.VEHICLE_LIST[objKey];
      if(objKey=="result"){
        for (let objKey1 of Object.keys(dataObj)) {
          if(dataObj[objKey1].VehicleId==vehicleId){
            // alert("here");
            lat = parseFloat(dataObj[objKey1].Lattitude);
            lng = parseFloat(dataObj[objKey1].Longitude);
          }
        }
      }
    }

    let centerPoint = transform([lng, lat], 'EPSG:4326','EPSG:3857'); 
    this.map.getView().setCenter(centerPoint);
    this.map.getView().setZoom(15);
    let pos = fromLonLat([lng, lat]);
    this.marker = new Overlay({   
      position: pos,
      // anchor: [0.20,50],
      // anchorXUnits: 'fraction',
      // anchorYUnits: 'pixels',
      // opacity: 1,
      offset:[0,-5],
      positioning: 'center-center',
      element: /*markerId,  */ document.getElementById('marker'), 
      stopEvent: false
    });
    this.map.addOverlay(this.marker);
    setTimeout(this.RemoveWatchOnMapLayer, 5000);
  }

  RemoveWatchOnMapLayer(){
    // alert("here");
    // this.map.removeOverlay(this.marker);
    let pos = fromLonLat([this.sessionLng, this.sessionLat]);
    this.marker = new Overlay({   
        position: pos,
        // anchor: [0.20,50],
        // anchorXUnits: 'fraction',
        // anchorYUnits: 'pixels',
        // opacity: 1,
        offset:[0,-5],
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false
    });
    this.map.addOverlay(this.marker);
  }

  isMonitoring=true;
  LivePanelData(){
    this.isMonitoring=true;
    this.isTrack=false;
    // this.GetData();
  }

  isTrack=false;
  TrackData(){
    this.isMonitoring=false;
    this.isTrack=true;
    this.currentDate = this.datePipe.transform(new Date(),"yyyy-MM-ddTHH:mm");
    $("#fromDate").val(this.currentDate);
    $("#toDate").val(this.currentDate);
  }

  ClearTrack(){
    if(this.vectorLayerArrow!=null){
      this.map.removeLayer(this.vectorLayerArrow);
      this.map.removeLayer(this.vectorLayerLine);
      // this.map.removeLayer(this.vectorLayerRouteLine);
      this.map.removeLayer(this.vectorLayerParking);
      this.map.removeLayer(this.vectorLayerLineOverSpeed);
      this.vectorLayerArrow=null;
      this.vectorLayerLine=null;
      this.vectorLayerParking=null;
      this.vectorLayerLineOverSpeed=null;
      $("#track_total_km").html("");
    }
  }

  DEVICE_NAME;
  GetDeviceName(deviceName){
    this.DEVICE_NAME = deviceName;
    this.currentDate = this.datePipe.transform(new Date(),"yyyy-MM-ddTHH:mm");
    $("#fromDate").val(this.currentDate);
    $("#toDate").val(this.currentDate);
  }

  vectorLayerArrow:any=[];
  vectorLayerParking:any=[];
  vectorLayerLine:any=[];
  vectorLayerRouteLine:any=[];
  vectorLayerLineOverSpeed:any=[];
  historyData:any;
  cordsObj:any;
  cordsCount;
  bStopPlayTrack=false;
  async ShowVehicleTrack(){
    try{
      this.ClearTrack();
      // this.loading = true;
      console.log("here...");
      this.isLoading=true;
      let from = this.datePipe.transform($("#fromDate").val(),"yyyy-MM-dd HH:mm:ss");
      // from = from+" 00:00:00";
      let to = this.datePipe.transform($("#toDate").val(),"yyyy-MM-dd HH:mm:ss");
      // to = to+" 23:59:59";
      console.log(" >> "+from+" :: "+to);
      
      let vehicleId = Number(this.liveDataForm.vehicleId);
      let device_name = this.DEVICE_NAME;
      let color = "#3474eb";

      console.log(vehicleId+" :: "+from+" :: "+to);

      this.cordsObj = this.historyData;
      this.cordsCount= 0;
      this.cordsCount = parseInt(this.cordsCount);
      this.bStopPlayTrack=false;
      let vectorSourceLine=null;
      let vectorSourceStartPoint = new VectorLayer({});
      let vectorSourceEndPoint = new VectorSource({});
      let vectorSourcePointStyle = null;

      let vectorSourceLineStyle= new Style({
        stroke: new Stroke({
          color: color,
          width: 7
        })
      });

      console.log("Here 1");

      let trip_id="";
      let points=[];
      let bFlag=true;
      let mapcenter=null;
      let point=[];
      let cLine=null; let featurething=null;
      let featurethingOverSpeed=null;
      let pointStyle = null;
      let features=[];
      let circleFeatures=[]; let bFirst=true;
      let iFirstOdometer=0;
      let TOTAL_KM=0;
      let bTeltonicaDevice=false;
      let iLastOdometer=0;
      let iCurrentOdometer=0;
      let RESET_KM=0; let lastPoint=[]; let lastTimeStamp;
      let last_lat=""; let last_lng="";
      let first_lat=""; let first_lng="";
      let firstTimeStamp1=0;
      let lastTimeStamp1=0;
      let kmForArrow=0;
      
      let icon = 'assets/images/E.png';

      // console.log("Here 2");

      let vsLine = new VectorSource({});
      let vsArrow = new VectorSource({});
      let vsParking = new VectorSource({});
      var vsLineOverSpeed = new VectorSource({});
      let iCount=0; let KM;
      let bIdleStart=false; let lIdleStartTime=""; let lIdleStartTimeStamp=0;
      let cLineOverSpeed=null;

      let pStyle= new Style({
        image: new Icon(({
          src: 'assets/images/P.png'
        }))
      });
      let pStyle1= new Style({
        image: new Icon(({
            src: 'assets/images/P1.png'
        }))
      });
      let pStartStyle= new Style({
        image: new Icon(({
          src: 'assets/images/start_point.png'
        }))
      });
      let pEndStyle= new Style({
        image: new Icon(({
          src: 'assets/images/end_point.png'
        }))
      });

      // console.log("Here 4");

      let fDeviceName,lDeviceName;
      let fDateTime,lDateTime;
      let fPlaceAddress,lPlaceAddress;
      let fLat,fLng,fSpeed;
      let lLat,lLng,lSpeed;
      let timeDiff;
      let firstOdometer=0, lastOdometer=0;

      const trackData = {
        'vehicleId': vehicleId,
        'fromDate':from,
        'toDate':to
      };
       //console.log(trackData);
      const data: any = await this.request.post('/dispatch/view_eld_log_history/',trackData);
      console.log(data);
      this.historyData = data;
      for (let objKey of Object.keys(this.historyData)) {
        for (let [key,value] of Object.entries(this.historyData[objKey])) {
          // console.log(" >>> "+value["deviceId"]);
          mapcenter = transform([parseFloat(value['Longitude']), parseFloat(value['Lattitude'])], 'EPSG:4326', 'EPSG:3857');
          let idlePoints = false;
          let sDateTime = this.datePipe.transform(Number(value["utcDateTime"]), 'MM/dd/yyyy HH:mm:ss','UTC');
          if(bFirst)
          {
            if(value['Odometer']>0){
              firstOdometer = value['Odometer'];
            }
            
            bFirst=false;
            first_lat = value['Lattitude'];
            first_lng = value['Longitude'];
            firstTimeStamp1 = value['utcDateTime'];
            fDeviceName = device_name;
            fDateTime = sDateTime;
            fPlaceAddress = value["PlaceAddress"];
            fLat = value["Lattitude"];
            fLng = value["Longitude"];
            fSpeed = value["Speed"];
          }
          lastOdometer = value['Odometer'];
          // console.log(value["lattitude"]+" :: "+value["longitude"]);
          if(last_lat!="" && last_lat!=value['Lattitude']){
            KM=this.CalculateDistanceInMeters(value['Lattitude'],value['Longitude'],last_lat,last_lng);
            timeDiff = (value["utcDateTime"] - lastTimeStamp)/1000;
            // if((KM/1000)<=5 && timeDiff<=600){
              TOTAL_KM+= KM/1000;
              kmForArrow+=KM;
            // }
          }
          
          point = [value['Longitude'],value['Lattitude']];
          if(lastPoint.length>0){
            points.push(lastPoint);
            points.push(point);
            cLine = new LineString(points).transform('EPSG:4326', 'EPSG:3857');
            featurething = new Feature({
                type: 'track_points',
                geometry:cLine,
                timestamp: value['utcDateTime'],
                device_name:device_name,
                place_address:value['PlaceAddress'],
                lng:value['Longitude'],
                lat:value['Lattitude'],
                date_time:sDateTime,
                speed:value['Speed']
            });
            // if((KM/1000)<=5 && timeDiff<=600){
              vsLine.addFeature( featurething );
            // }

            if(kmForArrow>=100){
              //alert("here.");
                vsArrow.addFeature( featurething );
                kmForArrow=0;
            }
            points=[];
        }
        lastTimeStamp = value['utcDateTime'];
        lastPoint = point;

        if(value["Speed"]==0){
          if(bIdleStart==false){
            bIdleStart=true;
            lIdleStartTime= sDateTime;
            lIdleStartTimeStamp = value["utcDateTime"];
          }
        }else{
            bIdleStart=false;
            if(lIdleStartTime!=""){
              let diff = (value["utcDateTime"] - lIdleStartTimeStamp)/1000;
              
              if(diff>=30){
                console.log("here 1");
                idlePoints = true;
                  let idle_time_duration = false;
                  let rotation=0; let offsetX=0; let offsetY=0;
                  let centerPoint = transform([parseFloat(value["Longitude"]), parseFloat(value["Lattitude"])], 'EPSG:4326','EPSG:3857');
                  let pFeature = new Feature({
                    type:"track_points",
                    geometry: new Point(centerPoint),
                    timestamp: value["utcDateTime"],
                    idle_from_time:lIdleStartTime,
                    idle_to_time:sDateTime,
                    device_name:device_name,
                    idle_duration:this.FormatTime(diff),
                    place_address:value["PlaceAddress"],
                    lng:value["Longitude"],
                    lat:value["Lattitude"],
                    date_time:sDateTime,
                    speed:value["Speed"],
                    idle_time_duration:idle_time_duration,
                    idle_point:idlePoints
                });
                console.log("here 2");
                if(diff>=120)
                {
                  console.log("here 3");
                  idle_time_duration = true;
                  pFeature = new Feature({
                    type:"track_points",
                    geometry: new Point(centerPoint),
                    timestamp: value["utcDateTime"],
                    idle_from_time:lIdleStartTime,
                    idle_to_time:sDateTime,
                    device_name:device_name,
                    idle_duration:this.FormatTime(diff),
                    place_address:value["PlaceAddress"],
                    lng:value["Longitude"],
                    lat:value["Lattitude"],
                    date_time:sDateTime,
                    speed:value["Speed"],
                    idle_time_duration:idle_time_duration,
                    idle_point:idlePoints
                  });
                  pFeature.setStyle(pStyle1);
                  console.log("here 4");
                }
                else{
                  //alert(obj[x].speed);
                  pFeature.setStyle(pStyle);
                  console.log("here 5");
                }
                console.log("here 6");
                vsParking.addFeature(pFeature);
                //alert(obj[x].speed);
                console.log("here 7");
              }
              lIdleStartTimeStamp=0;
              lIdleStartTime="";
              console.log("here 8");
            }
            console.log("here 9");
          }
          console.log("here 10");
          last_lat = value["Lattitude"];
          last_lng = value["Longitude"];
          lastTimeStamp1 = value["utcDateTime"];
          lDeviceName = device_name;
          lDateTime = sDateTime;
          lPlaceAddress = value["PlaceAddress"];
          lLat = value["Lattitude"];
          lLng = value["Longitude"];
          lSpeed = value["Speed"];
          console.log("here 11");
        }

        if(mapcenter!=null){
          let startPoint = transform([parseFloat(first_lng), parseFloat(first_lat)], 'EPSG:4326','EPSG:3857');
          let startFeature = new Feature({
              type:"track_points",
              geometry: new Point(startPoint),
              timestamp: firstTimeStamp1,
              device_name:fDeviceName,
              place_address:fPlaceAddress,
              lng:fLng,
              lat:fLat,
              date_time:fDateTime,
              speed:fSpeed
          });
          startFeature.setStyle(pStartStyle);
          vsParking.addFeature(startFeature);
          
          let endPoint = transform([parseFloat(last_lng), parseFloat(last_lat)], 'EPSG:4326','EPSG:3857');
          let endFeature = new Feature({
              type:"track_points",
              geometry: new Point(endPoint),
              timestamp: lastTimeStamp1,
              device_name:lDeviceName,
              place_address:lPlaceAddress,
              lng:lLng,
              lat:lLat,
              date_time:lDateTime,
              speed:lSpeed
          });
          endFeature.setStyle(pEndStyle);
          vsParking.addFeature(endFeature);
          
          let stylesMap = {
            'track_points': function(feature) {
              let geometry = feature.getGeometry();
              let styles = [
                new Style({
                  // stroke: new Stroke({
                  //   color: color,
                  //   width: 7
                  // })
                })
              ];
  
              geometry.forEachSegment(function(start, end) {
                //alert("start : "+start+ ", end : "+end);
                let dx = end[0] - start[0];
                let dy = end[1] - start[1];
                let rotation = Math.atan2(dy, dx);
                styles.push(new Style({
                  geometry: new Point(end),
                  image: new Icon({
                    src: 'assets/images/arrow.png',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                  })
                }));
              });
              return styles;
            }
          };
  
          this.vectorLayerArrow = new VectorLayer({
              source: vsArrow,
              style: function(feature) {
                const myStyle = stylesMap[feature.get('type')];
                if (myStyle instanceof Function) {
                  return myStyle(feature);
                }
                return myStyle;
              }
          });
          
          this.vectorLayerParking = new VectorLayer({
              source: vsParking,
              style: new Style({
                  stroke: new Stroke({
                    color: color,
                    width: 5
                  })
              })
          });
          
          this.vectorLayerLine = new VectorLayer({
              source: vsLine,
              style: new Style({
                  stroke: new Stroke({
                    color: color,
                    width: 7
                  })
              })
          });

          // let trans_color_over_speed ="rgb("+255+","+0+","+0+")";
          // this.vectorLayerLineOverSpeed = new VectorLayer({
          //     source: vsLineOverSpeed,
          //     style: new Style({
          //         stroke: new Stroke({
          //           color: trans_color_over_speed,
          //           width: 7
          //         })
          //     })
          // });
            
          this.map.addLayer(this.vectorLayerLine);   
          // this.map.addLayer(this.vectorLayerLineOverSpeed);   
          this.map.addLayer(this.vectorLayerArrow); 
          this.map.addLayer(this.vectorLayerParking);
  
          console.log("Odometer = "+firstOdometer+" :: "+lastOdometer);

          TOTAL_KM = Math.round(TOTAL_KM);
          $("#track_total_km").text((TOTAL_KM*0.62137119).toFixed(2)+" Miles");
  
          this.map.setView(new View({
              center: mapcenter,
              zoom: 16,
              minZoom: 2,
              maxZoom: 20
          }));
        }
        this.isLoading=false;

      }

    } catch(error){}

  }

  CalculateDistanceInMeters(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      let radlat1 = Math.PI * lat1/180;
      let radlat2 = Math.PI * lat2/180;
      let theta = lon1-lon2;
      let radtheta = Math.PI * theta/180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
              dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344; //convert into km
      return dist*1000;
    }
  }

  FormatTime(iTotalTime){
    //alert(iTotalTime);
    let d = Number(iTotalTime);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);
    //let hl = h.length;
    //alert(h+" "+h.toString().length);
    if(h.toString().length<2) h=0+h;
    if(m.toString().length<2) m=0+m;
    if(s.toString().length<2) s=0+s;
    return h+":"+m+":"+s;
    // let hDisplay = h > 0 ? h + (h == 1 ? " hrs, " : " hrs, ") : "";
    // let mDisplay = m > 0 ? m + (m == 1 ? " mins, " : " mins, ") : "";
    // let sDisplay = s > 0 ? s + (s == 1 ? " secs" : " secs") : "";
    // iTotalTime= hDisplay + mDisplay + sDisplay;
    // return iTotalTime;
  }

  device_status_icon;
  LAST_LAT:any;
  LAST_LNG:any;
  VEHICLE_LIST:any=[];
  LAST_LAT_MAP = new Array();
  LAST_LNG_MAP = new Array();
  errorMessage;
	isError;
  liveDataDetails=[];
  liveRowData;
  async GetData_old(){
    try {
      this.liveDataDetails=[];
      let headers = new HttpHeaders();
      //this is the important step. You need to set content type as null
      headers.set('Content-Type', null);
      headers.set('Accept', "multipart/form-data");
      let params = new HttpParams();
      await this.http.post(environment.apiBaseUrl + '/dispatch/view_live_data_log', { params, headers }).subscribe((res) => {
        // console.log(res);
        this.VEHICLE_LIST=res;
        for (let objKey of Object.keys(res)) {
          if(objKey=="result"){
            let dataObj = res[objKey]
            for (let objKey1 of Object.keys(dataObj)) {
              // console.log(dataObj[objKey1].MAC);
              if(dataObj[objKey1].VehicleId!=null && dataObj[objKey1].VehicleId!=""){
                this.liveDataDetails.push(dataObj[objKey1]);
                this.LAST_LAT=dataObj[objKey1].Lattitude;
                this.LAST_LNG=dataObj[objKey1].Longitude;
  
                //if(this.LAST_LAT>0 && this.LAST_LNG>0){
                  this.ShowMarker(dataObj[objKey1].MAC,parseFloat(dataObj[objKey1].Lattitude),parseFloat(dataObj[objKey1].Longitude),dataObj[objKey1].SerialNo,dataObj[objKey1].DateTime,this.LAST_LAT,this.LAST_LNG,dataObj[objKey1].Speed,dataObj[objKey1].PlaceAddress,dataObj[objKey1].VehicleName,dataObj[objKey1].DriverName,dataObj[objKey1].mobileNo);
                //}
              }
            }
          }
        }
        this.liveRowData = this.liveDataDetails;
      },
      (error) => {
        this.isError = true;
        if (error) {
          this.errorMessage = error.status == 401? 'Unauthorized Error' : error.message;
        } else {
          this.errorMessage = 'Server Not Response';
        }
      });
    } catch (error) {}

    await new Promise(resolve => setTimeout(() => resolve(this.GetData()), 500));
  }

  async GetData(){
		try {
      this.liveDataDetails=[];
			const liveData = {
				'clientId':Number(localStorage.getItem("clientId")),
			};
			const data: any = await this.request.post('/dispatch/view_live_data_log/',liveData);
      this.VEHICLE_LIST=data;
			for (let objKey of Object.keys(data)) {
				let dataObj = data[objKey];
				if(objKey=="result"){
					for (let objKey1 of Object.keys(dataObj)) {
						if(dataObj[objKey1].VehicleId!=null && dataObj[objKey1].VehicleId!=""){
              this.liveDataDetails.push(dataObj[objKey1]);
              this.LAST_LAT=dataObj[objKey1].Lattitude;
              this.LAST_LNG=dataObj[objKey1].Longitude;

              this.ShowMarker(dataObj[objKey1].MAC,parseFloat(dataObj[objKey1].Lattitude),parseFloat(dataObj[objKey1].Longitude),dataObj[objKey1].SerialNo,dataObj[objKey1].DateTime,this.LAST_LAT,this.LAST_LNG,dataObj[objKey1].Speed,dataObj[objKey1].PlaceAddress,dataObj[objKey1].VehicleName,dataObj[objKey1].DriverName,dataObj[objKey1].mobileNo);
            }
					}
				}
			}
      this.liveRowData = this.liveDataDetails;
      await new Promise(resolve => setTimeout(() => resolve(this.GetData()), 500));
		} catch (error) {}
	}

  dataDate:any;
  curDate:any;
  delta:any;
  vectorLayer:any=[];
  degree:any;
  ShowMarker(MAC,lat,lon,serialNo,dateTime,last_lat,last_lng,speed,placeAddress,vehicleName,driverName,mobileNo){
    if(lat==0 || lon==0) return;
    let centerPoint = transform([lon, lat], 'EPSG:4326','EPSG:3857');
    /*--------------Calculating Time----------------------*/
    this.dataDate = new Date(dateTime);
    this.curDate = new Date();
    this.delta = (this.curDate - this.dataDate)/1000;

    // calculate (and subtract) whole days
    let days = Math.floor(this.delta / 86400);
    this.delta -= days * 86400;

    // calculate (and subtract) whole hours
    let hours = Math.floor(this.delta / 3600) % 24;
    this.delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    let minutes = Math.floor(this.delta / 60) % 60;
    this.delta -= minutes * 60;

    // what's left is seconds
    let seconds = this.delta % 60;
    seconds += minutes*60;
    /*---------------------------calculation---------------------------------*/
    //$('#left_footer').text(lat+" = "+last_lng+" :: "+lng+" : "+last_lng);
    // alert(MAC);

    
    // let lDatetime=new Date(Number(dateTime)).toLocaleDateString("en-us");
    let sDateTime = this.datePipe.transform(Number(dateTime), 'MM/dd/yyyy HH:mm:ss',"UTC");

    let iconFeature = new Feature({
      type:"device_position",
      geometry: new Point(centerPoint),
      MAC: MAC,
      placeAddress:placeAddress,
      vehicleName:vehicleName,
      driverName:driverName,
      mobileNo:mobileNo,
      movingMessage:"Moving(Test..)",
      serialNo:serialNo,
      lat:lat,
      lon:lon,
      dateTime:dateTime,
      speed:speed,
      sDateTime:sDateTime,
      device_icon: "assets/icon/bus.png",
      all_device_data: this.VEHICLE_LIST,
      population: 4000,
      rainfall: 500
    });
    
    let opacity=1;
    let icon;
    let offsetY=-15;
    // if(seconds<3600){
        icon = 'assets/icon/bus.png';
    // }else{
    //     icon = 'assets/icon/277.png';
    // }
    let iconStyle = new Style({
        image: new Icon(({
            anchor: [0.5, 15],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: opacity,
            offset:[0,0],
            src: icon
        })),
        text: new Text({
            font: 'bold 12px verdana,Calibri,sans-serif',
            fill: new Fill({ color: '#F00' }),
            offsetY: offsetY,
            stroke: new Stroke({
                color: '#fff', width: 1
            }),
            text: vehicleName
        })
    });

    iconFeature.setStyle(iconStyle);
    
    let vectorSource = new VectorSource({
      features: [iconFeature]
    });
    
    //bus_no = device_id;
    let bShow=true;
    /*if(lat-last_lat==0 && lon-last_lng==0){
        if(vectorLayer[bus_no]===null){
            bShow=true;
        }
    }else{
        bShow=true;
    }*/
   
    if(bShow){
        if(this.vectorLayer[serialNo]!==null){
          this.map.removeLayer(this.vectorLayer[serialNo]);
        }

        this.vectorLayer[serialNo] = new VectorLayer({
          source: vectorSource
        });

        this.map.addLayer(this.vectorLayer[serialNo]);   

    }
    speed = parseFloat(speed);

    // let mapcenter = transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857');
    //   this.map.setView(new View({
    //   center: mapcenter,
    //   zoom: 12,
    //   minZoom: 2,
    //   maxZoom: 20
    // }));

    this.ShowDirection(MAC,lat,lon,serialNo,dateTime,last_lat,last_lng,seconds,speed);
  }

  geo = {
    bearing : function (lat1,lng1,lat2,lng2){
        let dLon = this._toRad(lng2-lng1);
        let y = Math.sin(dLon) * Math.cos(this._toRad(lat2));
        let x = Math.cos(this._toRad(lat1))*Math.sin(this._toRad(lat2)) - Math.sin(this._toRad(lat1))*Math.cos(this._toRad(lat2))*Math.cos(dLon);
        let brng = this._toDeg(Math.atan2(y, x));
        return ((brng + 360) % 360);
    },
    _toRad : function(deg) {
         return deg * Math.PI / 180;
    },
    _toDeg : function(rad) {
        return rad * 180 / Math.PI;
    }
  };

  ShowDirection(MAC,lat,lon,serialNo,dateTime,last_lat,last_lng,seconds,speed){
    // alert(lat+","+lon+" :: "+last_lat+","+last_lng);
    try{
      serialNo = serialNo +"-direction";
    
     let icon;
      if(this.vectorLayer[serialNo]!==null){
        this.map.removeLayer(this.vectorLayer[serialNo]);
      } 
     
     icon = 'assets/images/E.png';
     if(isNaN(last_lat)) return;
     
     if(speed < 4) return;
     
     if(lat==last_lat && lon==last_lng) return;
     
     this.degree =this.geo.bearing(lat,lon,last_lat,last_lng);
     //let degree=360;
    //  alert(" >> Degree : "+this.degree);
     this.degree = Math.round(this.degree);
     if(this.degree<=0) return; 
     
     let rotation=0;
     let offsetX=0;
     let offsetY=0;
     let anchorX;
     let anchorY;
     switch(true){
         case this.degree>=1 && this.degree <=23:
             rotation=2.0;
             offsetX=-35;
             offsetY=-0;
             anchorX=0.7;
             anchorY=0.7;
             break;
         case this.degree>=24 && this.degree <=45:
             rotation=2.4;
             offsetX=-35;
             offsetY=-0;
             anchorX=0.7;
             anchorY=0.7;
             break;
         case this.degree>=46 && this.degree <=68:
             rotation=2.8;
             offsetX=-35;
             offsetY=-1;
             anchorX=0.7;
             anchorY=0.7;
             break;
         case this.degree>=69 && this.degree <=90:
             rotation=3.1;
             offsetX=-35;
             offsetY=3;
             anchorX=1;
             anchorY=1;
             break;
         case this.degree>=91 && this.degree <=113:
             rotation=3.6;
             offsetX=-30;
             offsetY=-5;
             anchorX=0.60;
             anchorY=0.60;
             break;
         case this.degree>=114 && this.degree <=135:
             rotation=4.0;
             offsetX=-30;
             offsetY=-5;
             anchorX=0.60;
             anchorY=0.60;
             break;                
         case this.degree>=136 && this.degree <=158:
             rotation=4.3;
             offsetX=-30;
             offsetY=2;
             anchorX=0.8;
             anchorY=0.8;
             break;
         case this.degree>=159 && this.degree <=180:
             rotation=4.7;
             offsetX=-30;
             offsetY=2;
             anchorX=0.8;
             anchorY=0.8;
             break;
         case this.degree>=181 && this.degree <=203:
             rotation=5.2;
             offsetX=-35;
             offsetY=-5;
             anchorX=0.60;
             anchorY=0.60;
             break;
         case this.degree>=204 && this.degree <=225:
             rotation=5.6;
             offsetX=-35;
             offsetY=-5;
             anchorX=0.60;
             anchorY=0.60;
             break;
         case this.degree>=226 && this.degree <=248:
             rotation=6.0;
             offsetX=-35;
             offsetY=-5;
             anchorX=0.60;
             anchorY=0.60;
             break;
         case this.degree>=248 && this.degree <=270:
             rotation=6.4;
             offsetX=-35;
             offsetY=-5;
             anchorX=0.80;
             anchorY=0.80;
             break;
         case this.degree>=271 && this.degree <=293:
             rotation=0.4;
             offsetX=-35;
             offsetY=-5;
             anchorX=0.60;
             anchorY=0.60;
             break;
         case this.degree>=294 && this.degree <=315:
             rotation=0.8;
             offsetX=-35;
             offsetY=-5;
             anchorX=0.60;
             anchorY=0.60;
             break;
         case this.degree>=316 && this.degree <=338:
             rotation=1.2;
             offsetX=-35;
             offsetY=-5;
             anchorX=0.60;
             anchorY=0.60;
             break;
         case this.degree>=339 && this.degree <=360:
             rotation=1.6;
             offsetX=-35;
             offsetY=2;
             anchorX=0.80;
             anchorY=0.80;
             break;
     }
     
     //rotation=1.6;
     
     if(this.degree>0)
         this.degree += " -D";
     else
         this.degree = " ";
     //if(degree!="0")
     //alert(degree + " " + lat + " " + lon + " " + last_lat + " " + last_lng );
         
     //degree += "-degree";
     let centerPoint = transform([lon, lat], 'EPSG:4326','EPSG:3857');
     let iconFeature = new Feature({
         geometry: new Point(centerPoint),
         name: MAC,
         population: 4000,
         rainfall: 500
     });

     let iconStyle = new Style({
         image: new Icon(({
             anchor: [anchorX, anchorY],
             anchorOrigin: 'top-right',
             anchorXUnits: 'fraction',
             anchorYUnits: 'pixels',
             scale: 1,
             opacity: 1,
             rotateWithView: false,
             rotation:rotation,
             size:[52,52],
             offset:[offsetX,offsetY],
             src: icon
         })),
         text: new Text({
             font: 'bold 12px verdana,Calibri,sans-serif',
             fill: new Fill({ color: '#00F' }),
             offsetY: -30,
             stroke: new Stroke({
                 color: '#fff', width: 1
             }),
             text: ""
         })
     });

     iconFeature.setStyle(iconStyle);

     let vectorSource = new VectorSource({
       features: [iconFeature]
     });
    
     if(this.vectorLayer[serialNo]!==null){
         this.map.removeLayer(this.vectorLayer[serialNo]);
     }

     this.vectorLayer[serialNo] = new VectorLayer({
       source: vectorSource
     });

     this.map.addLayer(this.vectorLayer[serialNo]);   
      
     }catch(ex){}
  }

}
