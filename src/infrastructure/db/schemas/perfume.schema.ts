import { Document, Schema as MongooseSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type PerfumeDocument = Perfume & Document;

@Schema({ collection: 'perfumes', timestamps: true }) 
export class Perfume {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand', required: true, index: true }) 
  brand: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Note' }], default: [] })
  topNotes: MongooseSchema.Types.ObjectId
;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Note' }], default: [] })
  middleNotes: MongooseSchema.Types.ObjectId
;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Note' }], default: [] })
  baseNotes: MongooseSchema.Types.ObjectId
;
}

export const PerfumeSchema = SchemaFactory.createForClass(Perfume);
