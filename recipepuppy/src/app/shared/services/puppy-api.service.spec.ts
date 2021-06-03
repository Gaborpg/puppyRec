import { TestBed } from '@angular/core/testing';

import { PuppyApiService } from './puppy-api.service';

describe('PuppyApiService', () => {
  let service: PuppyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuppyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
