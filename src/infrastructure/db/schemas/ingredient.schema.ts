import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'ingredients' }) 
export class Ingredient {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  width: string;

  @Prop({ required: true })
  image: string;

  @Prop({
    type: String,
    enum: ['top_note', 'middle_note', 'base_note'],
    required: true
  })
  type: string;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
export type IngredientDocument = Ingredient & Document;
