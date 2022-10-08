import { createEffect, createEvent, createStore, sample } from 'effector';
import { TodoDto } from '../models';

import {
  getFromLocalStorage,
  LocalStorageKeys,
  removeFromLocalStorage,
  saveToLocalStorage,
} from '../utils/localStorage';
import {
  $todos,
  newTodoSubmitted,
  todoRemoved,
  todoStatusChanged,
} from './todos';

export const $isPersist = createStore<boolean>(false);

export const persistValueRequested = createEvent();
export const persistValueToggled = createEvent();

const persistValueFx = createEffect((value: boolean) => {
  if (value) {
    saveToLocalStorage(LocalStorageKeys.Persist, $isPersist.getState());
  } else {
    removeFromLocalStorage(LocalStorageKeys.Persist);
  }
});

const persistDataFx = createEffect((value: boolean) => {
  if (value) {
    saveToLocalStorage(LocalStorageKeys.Todos, $todos.getState());
  } else {
    removeFromLocalStorage(LocalStorageKeys.Todos);
  }
});

$isPersist.on(
  persistValueRequested,
  () => !!getFromLocalStorage<boolean>(LocalStorageKeys.Persist)
);

$todos.on(
  persistValueRequested,
  () => getFromLocalStorage<TodoDto[]>(LocalStorageKeys.Todos) ?? []
);

sample({
  clock: persistValueToggled,
  source: $isPersist,
  fn: value => !value,
  target: [$isPersist, persistValueFx, persistDataFx],
});

sample({
  clock: [newTodoSubmitted, todoStatusChanged, todoRemoved],
  source: $isPersist,
  filter: value => value,
  target: persistDataFx,
});
