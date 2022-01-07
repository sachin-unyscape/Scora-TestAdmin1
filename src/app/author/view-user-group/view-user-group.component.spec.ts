import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserGroupComponent } from './view-user-group.component';

describe('ViewUserGroupComponent', () => {
  let component: ViewUserGroupComponent;
  let fixture: ComponentFixture<ViewUserGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUserGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
