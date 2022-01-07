import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InReviewComponent } from './in-review.component';

describe('InReviewComponent', () => {
  let component: InReviewComponent;
  let fixture: ComponentFixture<InReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
