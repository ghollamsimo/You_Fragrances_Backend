import { Document, Schema as MongooseSchema } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';;

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true , type: String,
    enum: UserRole, default: UserRole.CLIENT,
  })
  role: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Brand' }], 
    default: [],
  })
  followedBrands: string[] 
}

export const UserModelSchema = SchemaFactory.createForClass(User);
