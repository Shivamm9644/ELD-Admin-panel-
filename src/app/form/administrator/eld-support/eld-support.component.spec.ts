import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldSupportComponent } from './eld-support.component';

describe('EldSupportComponent', () => {
  let component: EldSupportComponent;
  let fixture: ComponentFixture<EldSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
