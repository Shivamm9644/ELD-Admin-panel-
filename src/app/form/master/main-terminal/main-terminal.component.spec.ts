import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTerminalComponent } from './main-terminal.component';

describe('MainTerminalComponent', () => {
  let component: MainTerminalComponent;
  let fixture: ComponentFixture<MainTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
