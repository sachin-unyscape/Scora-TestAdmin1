import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingSchemaComponent } from './marking-schema.component';

describe('MarkingSchemaComponent', () => {
  let component: MarkingSchemaComponent;
  let fixture: ComponentFixture<MarkingSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkingSchemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkingSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
