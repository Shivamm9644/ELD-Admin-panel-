import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IFTAReportsComponent } from './ifta-reports.component';

describe('IFTAReportsComponent', () => {
  let component: IFTAReportsComponent;
  let fixture: ComponentFixture<IFTAReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IFTAReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IFTAReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
