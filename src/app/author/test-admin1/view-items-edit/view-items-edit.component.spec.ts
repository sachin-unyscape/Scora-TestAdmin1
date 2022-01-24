import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemsEditComponent } from './view-items-edit.component';

describe('ViewItemsEditComponent', () => {
  let component: ViewItemsEditComponent;
  let fixture: ComponentFixture<ViewItemsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewItemsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewItemsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
