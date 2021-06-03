import { IPuppyRecipeModel } from './shared/models/recipePuppy';
import { interval, Observable, Subject, throwError } from 'rxjs';
import { LoadRecipes, RecipesFail, RecipesSuccess } from './shared/store/actions/recipe.action';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { PuppyApiService } from './shared/services/puppy-api.service';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { catchError, filter, map, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { getRecipeState } from './shared/store';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RepositionScrollStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'recipepuppy';

  private initialized = false;


  displayedColumns: string[] = ['thumbnail', 'title', 'ingredients', 'rating'];
  dataSource: MatTableDataSource<IPuppyRecipeModel> = new MatTableDataSource<IPuppyRecipeModel>([]);

  ingridientList: string[] = [];
  selectedIngridientList: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  removable = true;
  ingridientCtrl = new FormControl();
  filteredIngridients: Observable<string[]>;


  snackBarApproved: Subject<any> = new Subject();
  ingSearch: Subject<string[]> = new Subject();
  destroy$ = new Subject();
  reqNumber = 1;


  @ViewChild('ingridientInput', { static: true }) ingridientInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;




  constructor(private puppyApiService: PuppyApiService, private store: Store, private snackBar: MatSnackBar,) {
    this.filteredIngridients = this.ingridientCtrl.valueChanges.pipe(
      startWith(<string>null),
      map((ingridient: string | null) => ingridient ? this._filter(ingridient) : this.ingridientList.slice()));

  }

  ngOnInit(): void {
    this.store.dispatch(new LoadRecipes());
    interval(10000).pipe(
      startWith(1),
      filter(() => this.reqNumber <= 100),
      switchMap(() =>
        this.puppyApiService.getRecipes(undefined, undefined, this.reqNumber).pipe(
          tap(recipes => {
            this.store.dispatch(new RecipesSuccess(recipes));

            if (!this.initialized) {
              this.snackBarApproved.next();
              this.initialized = true;
            }
            this.openSnackBar('Update the recepies', 'Update');
            this.reqNumber++;
          }),
          catchError(err => {
            this.store.dispatch(new RecipesFail());
            return throwError(err);
          }),
          takeUntil(this.destroy$)
        ))
    ).subscribe();


    this.snackBarApproved.pipe(
      switchMap(() =>
        this.store.select(getRecipeState).pipe(
          take(1),
          tap((lists) => {
            this.dataSource.data = lists.recipesList.map(recipe => IPuppyRecipeModel.deserialize(recipe));
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
            this.dataSource.data = recipes.results;
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action).onAction().subscribe((s) => this.snackBarApproved.next());
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

  formatLabel(value: number): string | number {
    if (value >= 100) {
      return Math.round(+value) + '%';
    }

    return value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

}
