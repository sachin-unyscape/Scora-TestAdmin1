import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashItemsComponent } from './trash-items.component';

describe('TrashItemsComponent', () => {
  let component: TrashItemsComponent;
  let fixture: ComponentFixture<TrashItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
