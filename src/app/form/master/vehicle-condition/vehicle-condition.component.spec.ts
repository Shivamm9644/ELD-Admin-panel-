import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleConditionComponent } from './vehicle-condition.component';

describe('VehicleConditionComponent', () => {
  let component: VehicleConditionComponent;
  let fixture: ComponentFixture<VehicleConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
