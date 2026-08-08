import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidentifiedEventsComponent } from './unidentified-events.component';

describe('UnidentifiedEventsComponent', () => {
  let component: UnidentifiedEventsComponent;
  let fixture: ComponentFixture<UnidentifiedEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidentifiedEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidentifiedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
