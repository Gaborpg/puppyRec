import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RecipesState } from "../reducers/recipe.reducer";




export const getCoreState = createFeatureSelector<RecipesState>(
  'core'
);

export const getRecipeState = createSelector(getCoreState, (state: RecipesState) => state);
export const getRecipeLoaded = createSelector(getRecipeState, (state: RecipesState) => state.loaded);
export const getRecipeLoading = createSelector(getRecipeState, (state: RecipesState) => state.loading);
export const getRecipeList = createSelector(getRecipeState, (state: RecipesState) => state.recipesList);
export const getRecipeIngredientList = createSelector(getRecipeState, (state: RecipesState) => state.ingredientList);

