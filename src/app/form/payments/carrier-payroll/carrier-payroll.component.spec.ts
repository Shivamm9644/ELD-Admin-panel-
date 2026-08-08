import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierPayrollComponent } from './carrier-payroll.component';

describe('CarrierPayrollComponent', () => {
  let component: CarrierPayrollComponent;
  let fixture: ComponentFixture<CarrierPayrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrierPayrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrierPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
