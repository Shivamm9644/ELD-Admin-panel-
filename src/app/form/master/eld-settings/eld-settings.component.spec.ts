import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldSettingsComponent } from './eld-settings.component';

describe('EldSettingsComponent', () => {
  let component: EldSettingsComponent;
  let fixture: ComponentFixture<EldSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
