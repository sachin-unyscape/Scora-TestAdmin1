import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatemplatesComponent } from './datatemplates.component';

describe('DatatemplatesComponent', () => {
  let component: DatatemplatesComponent;
  let fixture: ComponentFixture<DatatemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
