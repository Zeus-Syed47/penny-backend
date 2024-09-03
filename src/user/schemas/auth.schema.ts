import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { SchemaTypes, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Auth {
  @Prop()
  auth_token: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  user: Types.ObjectId;

  _id: Types.ObjectId;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
