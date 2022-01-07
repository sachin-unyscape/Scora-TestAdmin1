import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemSetComponent } from './edit-item-set.component';

describe('EditItemSetComponent', () => {
  let component: EditItemSetComponent;
  let fixture: ComponentFixture<EditItemSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditItemSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
