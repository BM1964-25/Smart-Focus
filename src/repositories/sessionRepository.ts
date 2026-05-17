import type { PomodoroSession } from '../types/domain';
import { EntityRepository } from './baseRepository';

export const sessionRepository = new EntityRepository<PomodoroSession>('sessions');
