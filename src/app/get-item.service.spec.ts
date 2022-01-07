import { TestBed, inject } from '@angular/core/testing';

import { GetItemService } from './get-item.service';

describe('GetItemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetItemService]
    });
  });

  it('should ...', inject([GetItemService], (service: GetItemService) => {
    expect(service).toBeTruthy();
  }));
});
