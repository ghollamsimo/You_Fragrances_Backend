import { IsEnum, IsString, IsNotEmpty, Validate } from 'class-validator';
import { Type } from 'class-transformer';

export class IngredientDTO {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  readonly image?: string;

  @IsString()
  @IsNotEmpty()
  readonly color: string;

  @IsString()
  @IsNotEmpty()
  readonly width: string;

  constructor(name: string, image: string, color: string, width: string) {
    this.name = name;
    this.image = image;
    this.color = color;
    this.width = width;
  }
}

export class NoteDTO {
  @IsEnum(['top_note', 'middle_note', 'base_note'])
  @IsNotEmpty()
  readonly type: 'top_note' | 'middle_note' | 'base_note';

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @Type(() => IngredientDTO)
  readonly ingredients: IngredientDTO[];

  constructor(
    type: 'top_note' | 'middle_note' | 'base_note',
    category: string,
    ingredients: IngredientDTO[]
  ) {
    if (!NoteDTO.isValidCategory(type, category)) {
      throw new Error(`Invalid category "${category}" for note type "${type}".`);
    }
    this.type = type;
    this.category = category;
    this.ingredients = ingredients;
  }

  private static isValidCategory(type: string, category: string): boolean {
    const categories = {
      top_note: ['Citrus', 'Aromatic & Herbal', 'Fruity', 'Green & Fresh', 'Spicy'],
      middle_note: ['Floral', 'Spicy', 'Fruity', 'Woody'],
      base_note: ['Woody', 'Balsamic', 'Sweet & Gourmand', 'Musky & Animalic'],
    };
    return categories[type]?.includes(category) || false;
  }
}