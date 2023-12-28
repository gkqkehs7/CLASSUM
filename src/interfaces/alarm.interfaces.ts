import { AlarmEntity } from '../entities/alarm.entity';

interface Alarm extends AlarmEntity {}

interface CreateAlarmDAO {
  content: string;
  userId: number;
  spaceId: number;
}

export { Alarm, CreateAlarmDAO };
