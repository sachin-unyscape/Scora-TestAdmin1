import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorNavbarComponent } from './author-navbar.component';

describe('AuthorNavbarComponent', () => {
  let component: AuthorNavbarComponent;
  let fixture: ComponentFixture<AuthorNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
