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

  /**
   * alarmEntity 생성
   * @param createAlarmDAO
   * @param queryRunner
   */
  async createAlarmEntity(
    createAlarmDAO: CreateAlarmDAO,
    queryRunner: QueryRunner,
  ): Promise<AlarmEntity> {
    const { userId, spaceId, postId, content, priority } = createAlarmDAO;

    const alarm = new AlarmEntity();
    alarm.userId = userId;
    alarm.postId = postId;
    alarm.spaceId = spaceId;
    alarm.content = content;
    alarm.priority = priority;

    if (queryRunner) {
      await queryRunner.manager.getRepository(AlarmEntity).save(alarm);
    } else {
      await this.alarmRepository.save(alarm);
    }

    return alarm;
  }

  /**
   * alarmEntity 삭제
   * @param userId
   * @param spaceId
   * @param queryRunner
   */
  async deleteAlarmEntity(
    userId: number,
    postId: number,
    spaceId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager.getRepository(AlarmEntity).softDelete({
        userId: userId,
        postId: postId,
      });
    } else {
      await this.alarmRepository.softDelete({
        userId: userId,
        postId: postId,
      });
    }
  }
}
