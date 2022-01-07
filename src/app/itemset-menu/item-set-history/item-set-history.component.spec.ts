import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSetHistoryComponent } from './item-set-history.component';

describe('ItemSetHistoryComponent', () => {
  let component: ItemSetHistoryComponent;
  let fixture: ComponentFixture<ItemSetHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSetHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSetHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
