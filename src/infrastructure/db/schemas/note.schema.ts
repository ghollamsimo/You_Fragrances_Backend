import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NoteDocument = Note & Document;

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
export type IngredientDocument = Ingredient & Document;

const topNoteCategories = ['Citrus', 'Aromatic & Herbal', 'Fruity', 'Green & Fresh', 'Spicy'];
const middleNoteCategories = ['Floral', 'Spicy', 'Fruity', 'Woody'];
const baseNoteCategories = ['Woody', 'Balsamic', 'Sweet & Gourmand', 'Musky & Animalic'];

@Schema()
export class Note {
  @Prop({ required: true, enum: ['top_note', 'middle_note', 'base_note'] })
  type: string;

  @Prop({
    required: true,
    validate: {
      validator: function (this: Note, value: string) {
        if (this.type === 'top_note') return topNoteCategories.includes(value);
        if (this.type === 'middle_note') return middleNoteCategories.includes(value);
        if (this.type === 'base_note') return baseNoteCategories.includes(value);
        return false;
      },
      message: 'Invalid category for the given note type',
    },
  })
  category: string;

  @Prop({ type: [IngredientSchema], required: true }) // Embed IngredientSchema
  ingredients: Ingredient[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);