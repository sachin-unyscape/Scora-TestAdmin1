import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserResponseComponent } from './user-response.component';

describe('UserResponseComponent', () => {
  let component: UserResponseComponent;
  let fixture: ComponentFixture<UserResponseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserResponseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
