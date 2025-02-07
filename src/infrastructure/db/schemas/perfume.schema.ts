import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
class Perfume extends Document{
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    image: string;

    @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: 'Brand'})
    brand: string

    @Prop({required: true,   type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Note' }], })
    notes: string[]
    
    @Prop({required: true,   type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Review' }], })
    reviews: string[]
}

export const PerfumeModelSchema = SchemaFactory.createForClass(Perfume);
