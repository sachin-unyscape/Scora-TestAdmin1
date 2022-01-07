import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedItemsetComponent } from './requested-itemset.component';

describe('RequestedItemsetComponent', () => {
  let component: RequestedItemsetComponent;
  let fixture: ComponentFixture<RequestedItemsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedItemsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedItemsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
