import { openDB, type DBSchema } from 'idb';

type Preferences = {
  selectedModelId: string;
  searchQuery: string;
  category: string;
};

interface LabDB extends DBSchema {
  preferences: {
    key: string;
    value: Preferences;
  };
}

const dbPromise = openDB<LabDB>('netlogo-browser-lab', 1, {
  upgrade(db) {
    db.createObjectStore('preferences');
  },
});

export async function loadPreferences(): Promise<Preferences | undefined> {
  return (await dbPromise).get('preferences', 'main');
}

export async function savePreferences(preferences: Preferences): Promise<void> {
  await (await dbPromise).put('preferences', preferences, 'main');
}
