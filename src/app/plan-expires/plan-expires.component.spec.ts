import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanExpiresComponent } from './plan-expires.component';

describe('PlanExpiresComponent', () => {
  let component: PlanExpiresComponent;
  let fixture: ComponentFixture<PlanExpiresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanExpiresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanExpiresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
