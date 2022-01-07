import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderReviewComponent } from './under-review.component';

describe('UnderReviewComponent', () => {
  let component: UnderReviewComponent;
  let fixture: ComponentFixture<UnderReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnderReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
