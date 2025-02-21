import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;


@Schema({ _id: false })
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

@Schema()
export class Note {
  @Prop({ required: true, enum: ['top_note', 'middle_note', 'base_note'] })
  type: string;

  @Prop({ type: [Ingredient], required: true })
  ingredients: Ingredient[];
}

export const NoteModelSchema = SchemaFactory.createForClass(Note);
