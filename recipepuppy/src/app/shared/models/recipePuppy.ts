export class IPuppyContainerModel {


  static deserialize(obj: any = null): IPuppyContainerModel {
    // @ts-ignore
    const puppyCont: IPuppyContainerModel = Object.assign(new IPuppyContainerModel(), obj);
    if (obj?.results) {
      puppyCont.results = obj.results.map((recipe: any) => IPuppyRecipeModel.deserialize(recipe));
    }

    return puppyCont;
  }
  constructor(
    public api: string = '',
    public results: IPuppyRecipeModel[] = [],
  ) { }

}

export class IPuppyRecipeModel {
  static deserialize(obj: any = null): IPuppyRecipeModel {
    // @ts-ignore
    const puppyRecip: IPuppyRecipeModel = Object.assign(new IPuppyRecipeModel(), obj);

    return puppyRecip;
  }

  public get initial(): string {
    return initialFun(this.title);
  }

  public get ingredientsArray(): string[] {
    return this.ingredients.split(', ');
  }


  constructor(
    public title: string = '',
    public href: string = '',
    public ingredients: string = '',
    public thumbnail: string = '',

  ) { }
}

export const initialFun = (name: string): string => {
  let initial = '';
  if (name?.length > 0) {
    const splitName = name.split(' ');
    splitName.forEach((init: string) => initial += init.charAt(0));
  }
  return initial.toUpperCase();
}
