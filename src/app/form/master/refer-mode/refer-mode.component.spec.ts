import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferModeComponent } from './refer-mode.component';

describe('ReferModeComponent', () => {
  let component: ReferModeComponent;
  let fixture: ComponentFixture<ReferModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
