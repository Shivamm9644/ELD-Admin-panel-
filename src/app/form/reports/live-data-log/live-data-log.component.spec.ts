import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDataLogComponent } from './live-data-log.component';

describe('LiveDataLogComponent', () => {
  let component: LiveDataLogComponent;
  let fixture: ComponentFixture<LiveDataLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveDataLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveDataLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
