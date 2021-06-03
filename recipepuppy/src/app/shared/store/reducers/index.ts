import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as recipe from './recipe.reducer';
import { RecipesState } from './recipe.reducer';

export interface ICoreState {
  core: RecipesState;
}

export const reducers: ActionReducerMap<ICoreState> = {
  core: recipe.reducer,
};

