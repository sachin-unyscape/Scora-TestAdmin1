import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchItemUploadComponent } from './match-item-upload.component';

describe('MatchItemUploadComponent', () => {
  let component: MatchItemUploadComponent;
  let fixture: ComponentFixture<MatchItemUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchItemUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchItemUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
