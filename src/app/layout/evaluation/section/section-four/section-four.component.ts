import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
declare const google: any;
@Component({
  selector: 'section-four',
  templateUrl: './section-four.component.html',
  styleUrls: ['./section-four.component.scss']
})
export class SectionFourComponent implements OnInit {
  @Input('data') data;
  locations: any = [];
  centerPoint: any = [];
  lat: any;
  long: any;
  mapSrc: SafeResourceUrl;
  url: any;
 // mapSrc: any;
  constructor(public sanitizer: DomSanitizer) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.data.currentValue;
    // debugger;
    // this.locations = [];
    // this.centerPoint = [];
    // const i = 0;

    this.lat = this.data.mslTable[0].latitude;
    this.long = this.data.mslTable[0].longitude;

    this.url = 'https://maps.google.com/maps?q=' + this.lat + '%2C' + this.long + '&t=&z=13&ie=UTF8&iwloc=&output=embed';
    this.mapSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);

    // this.data.mslTable.forEach(e => {
    //   const locationElement = [e.shop_title, parseFloat(e.latitude), parseFloat(e.longitude), i];
    //   this.locations.push(locationElement);

    //   if (i === 0) { this.centerPoint = [parseFloat(e.latitude), parseFloat(e.longitude)]; }

    //   ++i;
    // });

   // this.initMap();
  }
  initMap() {
    // The location of Uluru
    // var marksman = {lat: 31.502102, lng: 74.335109};
    const locations = this.locations;
    // The map, centered at Uluru

    const a = this.centerPoint[0];
    const b = this.centerPoint[1];
    const map = new google.maps.Map(document.getElementById('map'), { zoom: 12, center: new google.maps.LatLng(a, b)});
    // The marker, positioned at Uluru
    // var marker = new google.maps.Marker({position: marksman, map: map});
    const infowindow = new google.maps.InfoWindow();
    let marker, i, markserList;
    for (i = 0; i < locations.length; i++) {
      let url = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
      if (i === 0) {
        url = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      }
    //   var p = locations[i];
    //   var p1 = p[1];
    // var p2 = p[2];
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        center: new google.maps.LatLng(a, b),
        map: map,
        icon: {
          url: url
        },
        radius: 100
      });
      // markserList.push(marker)

      if (i === 0) {
        const cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          // strokeOpacity: 0.8,
          strokeWeight: 2,
          // fillColor: '#FF0000',
          // fillOpacity: 0.35,
          map: map,
          center: marker.center,
          radius: 100
        });
      }

      google.maps.event.addListener(
        marker,
        'click',
        (function(marker, i) {
          return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
          };
        })(marker, i)
      );

      // marker.Circle.bindTo(new google.maps.LatLng(locations[i][1], locations[i][2]), marker, new google.maps.LatLng(locations[i][1], locations[i][2]));
    }

    // var bounds = new google.maps.LatLngBounds();
    // for (var j = 0; j < markserList.length; j++) {
    //  bounds.extend(markserList[j].getPosition());
    // }

    // map.fitBounds(bounds);
  }
}
