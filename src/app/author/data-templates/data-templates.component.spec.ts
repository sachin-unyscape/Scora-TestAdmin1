import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTemplatesComponent } from './data-templates.component';

describe('DefaultComponent', () => {
  let component: DataTemplatesComponent;
  let fixture: ComponentFixture<DataTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
