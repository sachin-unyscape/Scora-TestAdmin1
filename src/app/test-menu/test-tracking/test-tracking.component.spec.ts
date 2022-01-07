import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTrackingComponent } from './test-tracking.component';

describe('TestTrackingComponent', () => {
  let component: TestTrackingComponent;
  let fixture: ComponentFixture<TestTrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
