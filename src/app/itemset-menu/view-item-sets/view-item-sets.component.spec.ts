import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemSetsComponent } from './view-item-sets.component';

describe('ViewItemSetsComponent', () => {
  let component: ViewItemSetsComponent;
  let fixture: ComponentFixture<ViewItemSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewItemSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewItemSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
