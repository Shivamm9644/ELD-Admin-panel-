import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtaLogComponent } from './ota-log.component';

describe('OtaLogComponent', () => {
  let component: OtaLogComponent;
  let fixture: ComponentFixture<OtaLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtaLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtaLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
