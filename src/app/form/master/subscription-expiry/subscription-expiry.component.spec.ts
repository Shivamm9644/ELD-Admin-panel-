import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionExpiryComponent } from './subscription-expiry.component';

describe('SubscriptionExpiryComponent', () => {
  let component: SubscriptionExpiryComponent;
  let fixture: ComponentFixture<SubscriptionExpiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionExpiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionExpiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
