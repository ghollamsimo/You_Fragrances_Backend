import { Ingredient } from "src/infrastructure/db/schemas/note.schema";

export class IngredientEntity {
  readonly name: string;
  readonly image: string;
  readonly color: string
  readonly width :string
  constructor(ingredient: Ingredient) {
    this.name = ingredient.name;
    this.image = ingredient.image;
    this.color = ingredient.color
    this.width = ingredient.width
  }
}

export class NoteEntity {
  readonly type: string;
  readonly ingredients: IngredientEntity[];

  constructor(note: any) {
    this.type = note.type;
    this.ingredients = note.ingredients?.map(
      (ingredient) => new IngredientEntity(ingredient)
    );
  }
}
