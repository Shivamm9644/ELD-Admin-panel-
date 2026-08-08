import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogDriverComponent } from './log-driver.component';

describe('LogDriverComponent', () => {
  let component: LogDriverComponent;
  let fixture: ComponentFixture<LogDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
