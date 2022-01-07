import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToCreateComponent } from './to-create.component';

describe('ToCreateComponent', () => {
  let component: ToCreateComponent;
  let fixture: ComponentFixture<ToCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
