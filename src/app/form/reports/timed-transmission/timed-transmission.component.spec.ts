import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimedTransmissionComponent } from './timed-transmission.component';

describe('TimedTransmissionComponent', () => {
  let component: TimedTransmissionComponent;
  let fixture: ComponentFixture<TimedTransmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimedTransmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimedTransmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
