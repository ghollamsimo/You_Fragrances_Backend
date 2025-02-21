export class IngredientDTO {
    readonly name: string;
    readonly image: string;
    readonly color : string
    readonly width : string
    constructor(name: string, image: string, color: string, width: string) {
      this.name = name;
      this.image = image;
      this.color = color
      this.width = width
    }
  }
  
  export class NoteDTO {
    readonly type: 'top_note' | 'middle_note' | 'base_note';
    readonly ingredients: IngredientDTO[];
  
    constructor(type: 'top_note' | 'middle_note' | 'base_note', ingredients: IngredientDTO[]) {
      this.type = type;
      this.ingredients = ingredients;
    }
  }
  