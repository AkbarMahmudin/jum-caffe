import { UserRole } from '@jum-caffe/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ type: String })
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, index: true, unique: true, type: String })
  email!: string;

  @Prop({ required: true, minlength: 6, type: String })
  password!: string;

  @Prop({
    required: true,
    type: String,
    enum: UserRole,
    default: UserRole.Customer,
  })
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
