import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectsDetailsComponent } from './defects-details.component';

describe('DefectsDetailsComponent', () => {
  let component: DefectsDetailsComponent;
  let fixture: ComponentFixture<DefectsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
