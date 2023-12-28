import { AlarmEntity } from '../entities/alarm.entity';

interface Alarm extends AlarmEntity {}

interface CreateAlarmDAO {
  content: string;
  userId: number;
  postId: number;
  spaceId: number;
  priority: number;
}

export { Alarm, CreateAlarmDAO };
