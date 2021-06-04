import { IPuppyContainerModel } from './../../models/recipePuppy';
import { RECIPESREQ } from 'src/TestData/Recipes';
import * as fromRecipes from './recipe.action';


describe('Recipes Actions', () => {
  describe(' Load Recipes Actions', () => {
    describe('LOAD_RECIPES', () => {
      it('should create an action', () => {
        const action = new fromRecipes.LoadRecipes();

        expect({ ...action }).toEqual({
          type: fromRecipes.LOAD_RECIPES,
        });
      });
    });

    describe('RECIPES_FAIL', () => {
      it('should create an action', () => {
        const action = new fromRecipes.RecipesFail();

        expect({ ...action }).toEqual({
          type: fromRecipes.RECIPES_FAIL
        });
      });
    });

    describe('RECIPES_SUCCESS', () => {
      it('should create an action', () => {
        const payload = IPuppyContainerModel.deserialize({ api: 'test', ...RECIPESREQ });
        const action = new fromRecipes.RecipesSuccess(payload);

        expect({ ...action }).toEqual({
          type: fromRecipes.RECIPES_SUCCESS,
          payload,
        });
      });
    });
  });

});
