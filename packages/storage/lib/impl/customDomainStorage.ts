import type { BaseStorage } from '../base/index.js';
import { createStorage, StorageEnum } from '../base/index.js';

type PersistEvent = boolean;

type PersistEventStorage = BaseStorage<PersistEvent> & {
  toggle: () => Promise<void>;
};

const storage = createStorage<PersistEvent>('persist-event-storage-key', false, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const persistEventStorage: PersistEventStorage = {
  ...storage,
  toggle: async () => {
    await storage.set(persistEvent => {
      return !persistEvent;
    });
  },
};
