import { get, set, del, update, keys } from 'idb-keyval';

// Set a value
export async function saveData(key: string, value: any) {
  return set(key, value);
}

// Get a value
export async function getData(key: string) {
  return get(key);
}

// Delete a value
export async function deleteData(key: string) {
  return del(key);
}

// Update a value
export async function updateData(key: string, updater: (oldValue: any) => any) {
  return update(key, updater);
}

// List all keys
export async function listKeys() {
  return keys();
}
