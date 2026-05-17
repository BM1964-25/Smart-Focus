import type { TaskCard } from '../types/domain';
import { EntityRepository } from './baseRepository';

export const taskRepository = new EntityRepository<TaskCard>('tasks');
