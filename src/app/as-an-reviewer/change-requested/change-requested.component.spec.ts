import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestedComponent } from './change-requested.component';

describe('ChangeRequestedComponent', () => {
  let component: ChangeRequestedComponent;
  let fixture: ComponentFixture<ChangeRequestedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRequestedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
