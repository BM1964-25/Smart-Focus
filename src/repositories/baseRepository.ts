import { getDb } from './db';

export class EntityRepository<T extends { id: string }> {
  constructor(private readonly storeName: 'tasks' | 'projects' | 'sessions') {}

  async all(): Promise<T[]> {
    const db = await getDb();
    return (await db.getAll(this.storeName as never)) as unknown as T[];
  }

  async get(id: string): Promise<T | undefined> {
    const db = await getDb();
    return (await db.get(this.storeName as never, id)) as unknown as T | undefined;
  }

  async put(entity: T): Promise<void> {
    const db = await getDb();
    await db.put(this.storeName as never, entity as never);
  }

  async bulkPut(entities: T[]): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(this.storeName as never, 'readwrite');
    await Promise.all(entities.map((entity) => tx.store.put(entity as never)));
    await tx.done;
  }

  async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.delete(this.storeName as never, id);
  }

  async clear(): Promise<void> {
    const db = await getDb();
    await db.clear(this.storeName as never);
  }
}
