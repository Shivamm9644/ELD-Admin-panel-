import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldLogComponent } from './eld-log.component';

describe('EldLogComponent', () => {
  let component: EldLogComponent;
  let fixture: ComponentFixture<EldLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
