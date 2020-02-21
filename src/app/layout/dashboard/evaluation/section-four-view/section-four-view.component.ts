import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
declare const google: any;
@Component({
  selector: 'section-four-view',
  templateUrl: './section-four-view.component.html',
  styleUrls: ['./section-four-view.component.scss']
})
export class SectionFourViewComponent implements OnInit {

  @Input('data') data;
  locations: any = [];
  centerPoint: any = [];
  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes.data.currentValue;
    this.locations = [];
    this.centerPoint = [];
    let i = 0;
    console.log(this.data.mslTable)

    this.data.mslTable.forEach(e => {
      const locationElement = [e.visit_datetime, parseFloat(e.latitude), parseFloat(e.longitude), i];
      this.locations.push(locationElement);
      // console.log(this.locations)

      if (i == 0) { this.centerPoint = [parseFloat(e.latitude), parseFloat(e.longitude)]; }

      ++i;
    });
    this.initMap();
  }
  initMap() {
    // The location of Uluru
    // var marksman = {lat: 31.502102, lng: 74.335109};
    const locations = this.locations;

    // The map, centered at Uluru

    const a = this.centerPoint[0];
    const b = this.centerPoint[1];
    // var t= new google.maps.LatLng(a,b);

    const map = new google.maps.Map(document.getElementById('map'), {
       zoom: 19,
        center: new google.maps.LatLng(a, b),
        scrollwheel: false,
        // gestureHandling: 'cooperative'
       });
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
          radius: 50
        });
      }

      google.maps.event.addListener(
        marker,
        'click',
        (function (marker, i) {
          return function () {
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
    // map.fitBounds(t);
  }
}
