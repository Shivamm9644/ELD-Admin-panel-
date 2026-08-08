import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleUsaComponent } from './cycle-usa.component';

describe('CycleUsaComponent', () => {
  let component: CycleUsaComponent;
  let fixture: ComponentFixture<CycleUsaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycleUsaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleUsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
