import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ingredient {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  width: string;

  @Prop({ required: true })
  image: string;
}
export const IngredientSchema = SchemaFactory.createForClass(Ingredient);

const topNoteCategories = ['Citrus', 'Aromatic & Herbal', 'Fruity', 'Green & Fresh', 'Spicy'];
const middleNoteCategories = ['Floral', 'Spicy', 'Fruity', 'Woody'];
const baseNoteCategories = ['Woody', 'Balsamic', 'Sweet & Gourmand', 'Musky & Animalic'];

@Schema()
export class Note {
  @Prop({ 
    required: true, 
    enum: ['top_note', 'middle_note', 'base_note'], 
    unique: true 
  }) 
  type: string;

  @Prop({
    required: true,
    validate: {
      validator: function(this: Note, value: string) {
        switch (this.type) {
          case 'top_note':
            return topNoteCategories.includes(value);
          case 'middle_note':
            return middleNoteCategories.includes(value);
          case 'base_note':
            return baseNoteCategories.includes(value);
          default:
            return false;
        }
      },
      message: 'Invalid category for the given note type',
    },
  })
  category: string;

  @Prop({ type: [IngredientSchema], required: true, default: [] })
  ingredients: Ingredient[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);
export type NoteDocument = Note & Document;