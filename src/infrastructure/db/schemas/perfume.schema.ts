import { Document, Schema as MongooseSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Ingredient } from './ingredient.schema'; // Import Ingredient schema

export type PerfumeDocument = Perfume & Document;

export enum Target_Audience {
  Women = 'Women',
  Man  = 'Man',
  UniSex = 'UniSex'
}

export enum Concentration {
  Eau_de_Perfume = 'Eau de Perfume',
  Parfum  = 'Parfum',
  Eau_de_Toilette = 'Eau de Toilette',
  EdC = 'Eau de Cologne',
  Eau_Fraiche = 'Eau Fraîche',
  Mist = 'Mist'
}

@Schema({ collection: 'perfumes', timestamps: true }) 
export class Perfume {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand', required: true, index: true }) 
  brand: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Ingredient' }], default: [] })
  topNotes: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Ingredient' }], default: [] })
  middleNotes: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Ingredient' }], default: [] })
  baseNotes: MongooseSchema.Types.ObjectId[];

  @Prop({ type: String, default: Target_Audience.Women })
  TargetAudience: string;

  @Prop({ required: true, type: String })
  Volume: string;

  @Prop({ required: true, type: String, default: Concentration.Eau_de_Perfume })
  Concentration: string;

  @Prop({ type: String, enum: ['Light', 'Moderate', 'Heavy'], default: 'Moderate' })
  sillage: string;

  @Prop({ required: true, type: String })
  Barcode: string;
}

export const PerfumeSchema = SchemaFactory.createForClass(Perfume);
