import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IftaSummaryReportComponent } from './ifta-summary-report.component';

describe('IftaSummaryReportComponent', () => {
  let component: IftaSummaryReportComponent;
  let fixture: ComponentFixture<IftaSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IftaSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IftaSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
