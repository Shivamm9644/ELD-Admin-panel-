import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldDeviceComponent } from './eld-device.component';

describe('EldDeviceComponent', () => {
  let component: EldDeviceComponent;
  let fixture: ComponentFixture<EldDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldDeviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
