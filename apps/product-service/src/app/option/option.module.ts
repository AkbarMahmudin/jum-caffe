import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/option.entity';
import { OptionValue } from './entities/option-value.entity';
import { OptionRepository } from './repositories/option.repository';
import { OptionValueRepository } from './repositories/option-value.repository';
import { RmqModule } from '@jum-caffe/common';
import { PRODUCT_SERVICE } from '@jum-caffe/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Option, OptionValue]),
    RmqModule.register({ name: PRODUCT_SERVICE }),
  ],
  controllers: [OptionController],
  providers: [OptionService, OptionRepository, OptionValueRepository],
})
export class OptionModule {}
