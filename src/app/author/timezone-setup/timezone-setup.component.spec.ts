import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimezoneSetupComponent } from './timezone-setup.component';

describe('TimezoneSetupComponent', () => {
  let component: TimezoneSetupComponent;
  let fixture: ComponentFixture<TimezoneSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimezoneSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimezoneSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
