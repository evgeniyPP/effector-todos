import { createEvent, createStore, sample } from 'effector';

import { TodoDto } from '../models';

export const $todos = createStore<TodoDto[]>([]);
export const $activeTodos = $todos.map(todos => todos.filter(t => t.isActive));
export const $doneTodos = $todos.map(todos => todos.filter(t => !t.isActive));
export const $newTodoInput = createStore<string>('');

export const newTodoChanged = createEvent<string>();
export const newTodoCleared = createEvent();
export const newTodoSubmitted = createEvent();

export const todoRemoved = createEvent<number>();
export const todoStatusChanged = createEvent<number>();

$newTodoInput.on(newTodoChanged, (_, newValue) => newValue);
$newTodoInput.on(newTodoCleared, _ => '');

$todos.on(newTodoSubmitted, todos => [
  ...todos,
  {
    id: todos.reduce((acc, cur) => Math.max(acc, cur.id), 0) + 1,
    value: $newTodoInput.getState(),
    isActive: true,
  },
]);
$todos.on(todoRemoved, (todos, removedTodoId) =>
  todos.filter(t => t.id !== removedTodoId)
);
$todos.on(todoStatusChanged, (todos, changedTodoId) =>
  todos.map(t => (t.id === changedTodoId ? { ...t, isActive: !t.isActive } : t))
);

sample({
  clock: newTodoSubmitted,
  target: newTodoCleared,
});
