import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsrSaleComponent } from './dsr-sale.component';

describe('DsrSaleComponent', () => {
  let component: DsrSaleComponent;
  let fixture: ComponentFixture<DsrSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsrSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsrSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
