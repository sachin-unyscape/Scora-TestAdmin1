import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToModifyComponent } from './to-modify.component';

describe('ToModifyComponent', () => {
  let component: ToModifyComponent;
  let fixture: ComponentFixture<ToModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
