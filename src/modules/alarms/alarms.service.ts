import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { AlarmEntity } from '../../entities/alarm.entity';
import { CreateAlarmDAO } from '../../interfaces/alarm.interfaces';

@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(AlarmEntity)
    private alarmRepository: Repository<AlarmEntity>,
  ) {}

  async createAlarmEntity(
    createAlarmDAO: CreateAlarmDAO,
    queryRunner: QueryRunner,
  ): Promise<AlarmEntity> {
    const { userId, spaceId, content } = createAlarmDAO;

    const alarm = new AlarmEntity();
    alarm.userId = userId;
    alarm.spaceId = spaceId;
    alarm.content = content;

    if (queryRunner) {
      await queryRunner.manager.getRepository(AlarmEntity).save(alarm);
    } else {
      await this.alarmRepository.save(alarm);
    }

    return alarm;
  }
}
