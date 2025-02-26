import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;


@Schema()
export class Brand extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  description: string;

  @Prop({required: true})
  country: string; 

  @Prop({required: true})
  founded: number; 
}

export const BrandModelSchema = SchemaFactory.createForClass(Brand);
