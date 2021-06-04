import { IPuppyRecipeModel } from './../../models/recipePuppy';
import * as recAct from "../actions/recipe.action";


export interface RecipesState {
  loaded: boolean;
  loading: boolean;
  recipesList: IPuppyRecipeModel[];
  ingredientList: string[];

}


export const initialState: RecipesState = {
  loaded: false,
  loading: false,
  recipesList: [],
  ingredientList: []
};

export function reducer(
  state: RecipesState = initialState,
  action: recAct.RecipesActions
): RecipesState {
  switch (action.type) {
    case recAct.LOAD_RECIPES: {
      return {
        ...state,
        loading: true,
      };
    }

    case recAct.RECIPES_SUCCESS: {
      const ingredientListNew: string[] = action.payload.results.map(ing => ing.ingredients).reduce((pre, cur) => {
        return [...pre, ...cur.split(', ')];
      }, []);
      const ingredientList = new Set([...state.ingredientList, ...ingredientListNew]);
      const recipesState = state.recipesList.map(recipe => JSON.stringify(recipe));
      const recipesPayload = action.payload.results.map(recipe => JSON.stringify(recipe));
      const recipesList = new Set([...recipesState, ...recipesPayload]);
      return {
        ...state,
        loading: false,
        loaded: true,
        recipesList: Array.from(recipesList).map((recipe) => JSON.parse(recipe)),
        ingredientList: Array.from(ingredientList),
      };
    }

    case recAct.RECIPES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }

    case recAct.RECIPES_RATING: {
      const list: IPuppyRecipeModel[] = state.recipesList.map(recipe => IPuppyRecipeModel.deserialize(recipe));
      const index = list.findIndex(recipe => recipe.title === action.payload.title);
      list[index].rating = action.payload.value;
      return {
        ...state,
        recipesList: list
      }
    }
    default:
      return state;
  }

}

