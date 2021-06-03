import { IPuppyRecipeModel } from './shared/models/recipePuppy';
import { interval, Observable, Subject, throwError } from 'rxjs';
import { LoadRecipes, RecipesFail, RecipesSuccess } from './shared/store/actions/recipe.action';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { PuppyApiService } from './shared/services/puppy-api.service';
import { MatSnackBar, MatSnackBarDismiss, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { catchError, delay, distinctUntilChanged, exhaustMap, filter, map, mergeAll, mergeMap, repeat, skip, startWith, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { getRecipeList, getRecipeState } from './shared/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'recipepuppy';


  displayedColumns: string[] = ['thumbnail', 'title', 'ingredients', 'href'];
  dataSource: IPuppyRecipeModel[] = [];

  ingridientList: string[] = [];
  selectedIngridientList: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  removable = true;
  ingridientCtrl = new FormControl();
  filteredIngridients: Observable<string[]>;


  snackBarApproved: Subject<MatSnackBarDismiss> = new Subject();
  ingSearch: Subject<string[]> = new Subject();
  destroy$ = new Subject();
  i: number = 1;


  @ViewChild('ingridientInput') ingridientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(private puppyApiService: PuppyApiService, private store: Store, private _snackBar: MatSnackBar,) {
    this.filteredIngridients = this.ingridientCtrl.valueChanges.pipe(
      startWith(null),
      map((ingridient: string | null) => ingridient ? this._filter(ingridient) : this.ingridientList.slice()));

  }

  ngOnInit(): void {
    this.store.dispatch(new LoadRecipes());
    interval(10000).pipe(
      filter(() => this.i <= 100),
      switchMap(() =>
        this.puppyApiService.getRecipes(undefined, undefined, this.i).pipe(
          tap(recipes => {
            this.store.dispatch(new RecipesSuccess(recipes));
            this.openSnackBar('Update the recepies', 'Update');
            this.i++;
          }),
          catchError(err => {
            this.store.dispatch(new RecipesFail());
            return throwError(err);
          }),
          takeUntil(this.destroy$)
        ))
    ).subscribe();

    this.store.select(getRecipeState).pipe(
      filter(lists => !!lists.recipesList.length || !!lists.ingredientList.length),
      take(1),
      tap(lists => {
        this.dataSource = [...lists.recipesList];
        this.ingridientList = [...lists.ingredientList];
      })
    ).subscribe();

    this.snackBarApproved.pipe(
      switchMap(() =>
        this.store.select(getRecipeState).pipe(
          takeWhile((value) => value.recipesList.length !== this.dataSource.length),
          tap((lists) => {
            this.dataSource = [...lists.recipesList];
            this.ingridientList = [...lists.ingredientList];
          })
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe();

    this.ingSearch.pipe(
      switchMap((list) =>
        this.puppyApiService.getRecipes(list.toString()).pipe(
          tap(recipes => {
            this.store.dispatch(new RecipesSuccess(recipes));
          }),
          catchError(err => {
            this.store.dispatch(new RecipesFail());
            return throwError(err);
          }),
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe();

  }

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action).onAction().subscribe((s) => this.snackBarApproved.next());
  }

  removeFromIngredients(ingridient: string): void {
    const index = this.selectedIngridientList.indexOf(ingridient);

    if (index >= 0) {
      this.selectedIngridientList.splice(index, 1);
    }
  }

  addIngredient(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.selectedIngridientList.push(value);
      this.ingSearch.next(this.selectedIngridientList);
    }
    this.ingridientCtrl.setValue(null);
  }


  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedIngridientList.push(event.option.viewValue);
    this.ingridientInput.nativeElement.value = '';
    this.ingridientCtrl.setValue(null);
    this.ingSearch.next(this.selectedIngridientList);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.selectedIngridientList.filter(ingridient => ingridient.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
