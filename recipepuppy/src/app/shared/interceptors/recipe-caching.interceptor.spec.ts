import { HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { RECIPESREQ } from 'src/TestData/Recipes';
import { PuppyApiService } from '../services/puppy-api.service';

import { RecipeCachingInterceptor } from './recipe-caching.interceptor';

describe('RecipeCachingInterceptor', () => {
  let httpMock: HttpTestingController;
  let interceptor: RecipeCachingInterceptor;
  let service: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RecipeCachingInterceptor,
        PuppyApiService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RecipeCachingInterceptor,
          multi: true,
        }]
    });

    service = {
      getRecipes: jasmine.createSpy('getRecipes')
    };
    interceptor = TestBed.inject(RecipeCachingInterceptor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept', () => {
    const response = new HttpErrorResponse({ status: 401 });
    const next: any = {
      handle: jasmine.createSpy('getRecipes').and.callFake(() => of(response))
    };

    interceptor.intercept(response as any, next).pipe(take(1))
      .subscribe();
  });

  afterEach(() => {
    httpMock.verify();
  });
});

