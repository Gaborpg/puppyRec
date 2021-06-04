import * as fromRecipes from './recipe.reducer';
import * as fromRecipesActions from '../actions/recipe.action';
import { IPuppyContainerModel } from '../../models/recipePuppy';
import { RECIPESREQ } from 'src/TestData/Recipes';

describe('RecipesReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromRecipes;
      const action = {} as any;
      const state = fromRecipes.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });


  describe('LOAD_RECIPES action', () => {
    it('should set loading to true', () => {
      const { initialState } = fromRecipes;
      const action = new fromRecipesActions.LoadRecipes();
      const state = fromRecipes.reducer(initialState, action);

      expect(state.loading).toEqual(true);
      expect(state.loaded).toEqual(false);
      expect(state.recipesList).toEqual([]);
      expect(state.ingredientList).toEqual([]);
    });
  });

  describe('RECIPES_SUCCESS action', () => {
    it('should populate the recipes List', () => {
      const Recipes: IPuppyContainerModel = IPuppyContainerModel.deserialize({ api: 'test', ...RECIPESREQ });
      const { initialState } = fromRecipes;
      const action = new fromRecipesActions.RecipesSuccess(Recipes);
      const state = fromRecipes.reducer(initialState, action);
      const recipesState = state.recipesList.map(recipe => JSON.stringify(recipe));
      const recipesPayload = action.payload.results.map(recipe => JSON.stringify(recipe));
      const recipesList = new Set([...recipesState, ...recipesPayload]);

      expect(state.loaded).toEqual(true);
      expect(state.loading).toEqual(false);
      expect(state.recipesList).toEqual(Array.from(recipesList).map((recipe) => JSON.parse(recipe)));
    });
  });

  describe('RECIPES_FAIL action', () => {
    it('should return the initial state', () => {
      const { initialState } = fromRecipes;
      const action = new fromRecipesActions.RecipesFail();
      const state = fromRecipes.reducer(initialState, action);

      expect(state).toEqual(initialState);
    });

    it('should return the previous state', () => {
      const { initialState } = fromRecipes;
      const previousState = { ...initialState, loading: true };
      const action = new fromRecipesActions.RecipesFail();
      const state = fromRecipes.reducer(previousState, action);

      expect(state).toEqual(initialState);
    });
  });

});


