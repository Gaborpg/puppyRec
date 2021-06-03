import { TestBed } from '@angular/core/testing';

import { RecipeCachingInterceptor } from './recipe-caching.interceptor';

describe('RecipeCachingInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RecipeCachingInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RecipeCachingInterceptor = TestBed.inject(RecipeCachingInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
