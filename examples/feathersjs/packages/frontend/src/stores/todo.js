import { feathersClient } from "@/feathersApp";
import { writable } from "svelte/store";

/**
 * @typedef {Object} Todo
 * @property {number} id
 * @property {string} text
 * @property {boolean} done
 */

/**
 * @template T
 * @typedef {Object} Service
 * @property {T[]} data
 * @property {number} total
 * @property {number} limit
 * @property {number} skip
 */

export const createTodosStore = () => {
  /** @type {Service<Todo>} */
  const state = { data: [], total: 0, limit: 0, skip: 0 };
  const { set, subscribe, update } = writable(state);

  const todoService = feathersClient.service("todo");

  const updateTodo = (todo) =>
    update((todos) => ({ ...todos, data: todos.data.map((t) => (t.id === todo.id ? todo : t)) }));

  todoService
    .on("created", (todo) => update((todos) => ({ ...todos, data: [...todos.data, todo], total: todos.total + 1 })))
    .on("updated", updateTodo)
    .on("patched", updateTodo)
    .on("removed", (_todo) =>
      update((todos) => ({ ...todos, data: todos.data.filter((todo) => todo.id !== _todo.id), total: todos.total - 1 }))
    );

  todoService.find().then(set);

  return {
    subscribe,
    delete: (id) => feathersClient.service("todo").remove(id),
    updateStatus: (id, value) => {
      console.log("send", id, value);
      feathersClient.service("todo").patch(id, { done: value });
    },
    add: (text) => feathersClient.service("todo").create({ text }),
  };
};

export const todos = createTodosStore();
