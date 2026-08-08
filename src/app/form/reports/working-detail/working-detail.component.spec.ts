import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingDetailComponent } from './working-detail.component';

describe('WorkingDetailComponent', () => {
  let component: WorkingDetailComponent;
  let fixture: ComponentFixture<WorkingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
