import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestbankListingComponent } from './testbank-listing.component';

describe('TestbankListingComponent', () => {
  let component: TestbankListingComponent;
  let fixture: ComponentFixture<TestbankListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestbankListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestbankListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
