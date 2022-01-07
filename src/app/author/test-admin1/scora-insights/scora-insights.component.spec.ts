import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoraInsightsComponent } from './scora-insights.component';

describe('ScoraInsightsComponent', () => {
  let component: ScoraInsightsComponent;
  let fixture: ComponentFixture<ScoraInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoraInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoraInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
