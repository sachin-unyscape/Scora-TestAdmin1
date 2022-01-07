import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadItemsListComponent } from './bulk-upload-items-list.component';

describe('BulkUploadItemsListComponent', () => {
  let component: BulkUploadItemsListComponent;
  let fixture: ComponentFixture<BulkUploadItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
