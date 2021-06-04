import { IPuppyContainerModel, IRatingModel } from './../../models/recipePuppy';
import { Action } from '@ngrx/store';

export const LOAD_RECIPES = '[Core] Load Recipes';
export const RECIPES_FAIL = '[Core] Recipes FAIL';
export const RECIPES_SUCCESS = '[Core] Recipes Success';
export const RECIPES_RATING = '[Core] Recipes Rating';


export class LoadRecipes implements Action {
  readonly type = LOAD_RECIPES;
}


export class RecipesFail implements Action {
  readonly type = RECIPES_FAIL;
}

export class RecipesSuccess implements Action {
  readonly type = RECIPES_SUCCESS;
  constructor(public payload: IPuppyContainerModel) { }

}

export class RecipesRating implements Action {
  readonly type = RECIPES_RATING;
  constructor(public payload: IRatingModel) { }

}

export type RecipesActions = LoadRecipes | RecipesFail | RecipesSuccess | RecipesRating;

