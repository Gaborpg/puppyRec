import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { PuppyApiService } from './puppy-api.service';
import { HttpClient } from '@angular/common/http';
import { RECIPESREQ } from 'src/TestData/Recipes';



describe('PuppyApiService', () => {
  let service: PuppyApiService;
  let httpTesting: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PuppyApiService]
    });
    service = TestBed.inject(PuppyApiService);
    httpTesting = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get Recipes', () => {
    service.getRecipes().subscribe(recepies => {
      expect(recepies).toBeTruthy('No recipes returned');
      expect(recepies.results).toBeTruthy();
      expect(recepies.results[0].title).toBe('Ginger Champagne');
      expect(recepies.results[0].ingredients).toBe('champagne, ginger, ice, vodka');

    });
    const req = httpTesting.expectOne('api');
    expect(req.request.method).toEqual('GET');
    req.flush(RECIPESREQ);
  });

  afterEach(() => {
    httpTesting.verify();
  });
});
