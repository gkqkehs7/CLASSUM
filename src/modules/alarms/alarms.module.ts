import { Module } from '@nestjs/common';
import { AlarmsService } from './alarms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmEntity } from '../../entities/alarm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlarmEntity])],
  exports: [AlarmsService],
  providers: [AlarmsService],
})
export class AlarmsModule {}
