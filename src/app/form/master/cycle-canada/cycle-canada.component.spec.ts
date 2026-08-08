import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCanadaComponent } from './cycle-canada.component';

describe('CycleCanadaComponent', () => {
  let component: CycleCanadaComponent;
  let fixture: ComponentFixture<CycleCanadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycleCanadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleCanadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
