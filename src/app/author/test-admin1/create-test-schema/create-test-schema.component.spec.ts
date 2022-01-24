import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestSchemaComponent } from './create-test-schema.component';

describe('CreateTestSchemaComponent', () => {
  let component: CreateTestSchemaComponent;
  let fixture: ComponentFixture<CreateTestSchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTestSchemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
