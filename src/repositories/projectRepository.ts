import type { Project } from '../types/domain';
import { EntityRepository } from './baseRepository';

export const projectRepository = new EntityRepository<Project>('projects');
