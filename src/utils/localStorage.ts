export enum LocalStorageKeys {
  Todos = 'effector-todos-list',
  Persist = 'effector-todos-persist',
}

export function getFromLocalStorage<T>(key: LocalStorageKeys): T | null {
  const str = localStorage.getItem(key);

  if (!str) {
    return null;
  }

  return JSON.parse(str) as T;
}

export function saveToLocalStorage<T>(key: LocalStorageKeys, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromLocalStorage(key: LocalStorageKeys) {
  localStorage.removeItem(key);
}
