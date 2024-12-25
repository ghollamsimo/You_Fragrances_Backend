import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true , type: String,
    enum: UserRole, default: UserRole.CLIENT,
  })
  role: string;
}

export const UserModelSchema = SchemaFactory.createForClass(User);
