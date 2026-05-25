import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@jum-caffe/common';

@Schema({ versionKey: false, timestamps: false })
export class RefreshToken extends AbstractDocument {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  refreshToken!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  accessToken!: string;

  @Prop({
    required: false,
    expires: 7 * 24 * 60 * 60,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
  })
  expirationAt?: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
