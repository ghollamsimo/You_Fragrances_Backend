import { Document, Schema as MongooseSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';


@Schema({ timestamps: true })
export class Favorite extends Document {
    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user: string;

    @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Perfume' })
    perfume: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
