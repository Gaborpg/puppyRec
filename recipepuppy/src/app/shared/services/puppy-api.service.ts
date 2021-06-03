import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { IPuppyContainerModel } from '../models/recipePuppy';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PuppyApiService {

  constructor(private httpClient: HttpClient) { }

  getRecipes(ingredients?: string, search?: string, page?: number): Observable<IPuppyContainerModel> {
    let params = new HttpParams();
    if (ingredients) {
      params = params.set('i', ingredients);
    }
    if (search) {
      params = params.set('q', search);
    }
    if (page) {
      params = params.set('p', page.toString());
    }
    return this.httpClient.get(`api`, { params }).pipe(
      map((recipe: any) => IPuppyContainerModel.deserialize({
        ...recipe, api: `api${params.toString()}`
      })),
      catchError((err: any) => throwError(err))
    );
  }



}
