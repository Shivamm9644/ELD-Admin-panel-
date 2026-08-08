import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPayrollComponent } from './driver-payroll.component';

describe('DriverPayrollComponent', () => {
  let component: DriverPayrollComponent;
  let fixture: ComponentFixture<DriverPayrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverPayrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
