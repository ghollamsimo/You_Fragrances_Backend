import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Type {
  NICHE = 'NICHE',
  DESIGNER = 'DESIGNER',
  ULTRA_NICHE = 'ULTRA_NICHE',
}

@Schema()
export class Brand extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: String,
    enum: Type,
    default: Type.DESIGNER,
  })
  type: Type;
}

export const BrandModelSchema = SchemaFactory.createForClass(Brand);
