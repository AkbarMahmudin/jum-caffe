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
}

export const UserSchema = SchemaFactory.createForClass(User);
