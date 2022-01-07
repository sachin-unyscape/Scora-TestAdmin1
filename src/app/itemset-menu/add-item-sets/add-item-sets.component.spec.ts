import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemSetsComponent } from './add-item-sets.component';

describe('AddItemSetsComponent', () => {
  let component: AddItemSetsComponent;
  let fixture: ComponentFixture<AddItemSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddItemSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
