import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdlingComponent } from './idling.component';

describe('IdlingComponent', () => {
  let component: IdlingComponent;
  let fixture: ComponentFixture<IdlingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdlingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
