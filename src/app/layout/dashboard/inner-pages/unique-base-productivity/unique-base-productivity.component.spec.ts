import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueBaseProductivityComponent } from './unique-base-productivity.component';

describe('UniqueBaseProductivityComponent', () => {
  let component: UniqueBaseProductivityComponent;
  let fixture: ComponentFixture<UniqueBaseProductivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueBaseProductivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueBaseProductivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
