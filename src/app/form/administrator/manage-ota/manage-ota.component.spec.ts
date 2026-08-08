import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOtaComponent } from './manage-ota.component';

describe('ManageOtaComponent', () => {
  let component: ManageOtaComponent;
  let fixture: ComponentFixture<ManageOtaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageOtaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
