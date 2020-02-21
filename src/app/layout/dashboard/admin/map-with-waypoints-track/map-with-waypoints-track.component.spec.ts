import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWithWaypointsTrackComponent } from './map-with-waypoints-track.component';

describe('MapWithWaypointsTrackComponent', () => {
  let component: MapWithWaypointsTrackComponent;
  let fixture: ComponentFixture<MapWithWaypointsTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapWithWaypointsTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapWithWaypointsTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
