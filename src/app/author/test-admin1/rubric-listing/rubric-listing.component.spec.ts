import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricListingComponent } from './rubric-listing.component';

describe('RubricListingComponent', () => {
  let component: RubricListingComponent;
  let fixture: ComponentFixture<RubricListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RubricListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RubricListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
