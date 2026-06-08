import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup(cls, req) {
          const authorization = req.headers.authorization;
          if (!authorization) {
            return;
          }

          const token = authorization.split(' ')[1];

          cls.set('token', token);

          const base64Payload = token.split('.')[1];
          const payloadBuffer = Buffer.from(base64Payload, 'base64');
          const decodedPayload = JSON.parse(payloadBuffer.toString());

          cls.set('user', decodedPayload);
        },
      },
    }),
  ],
  exports: [],
})
export class LocalStorageModule {}
