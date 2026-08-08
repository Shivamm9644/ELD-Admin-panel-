import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldLogDataComponent } from './eld-log-data.component';

describe('EldLogDataComponent', () => {
  let component: EldLogDataComponent;
  let fixture: ComponentFixture<EldLogDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldLogDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldLogDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
