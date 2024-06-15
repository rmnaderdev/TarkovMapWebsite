<script setup lang="ts">
import {onMounted, ref} from "vue";
import { useToast } from "vue-toastification";
import {Todo} from "../models/Todo.ts";
import TodoList from "../components/todos/TodoList.vue";
import AddTodoForm from "../components/todos/AddTodoForm.vue";
import {tryGetErrorMessage} from "../helpers.ts";

const toast = useToast();

const todos = ref<Todo[]>([]);

const getTodos = async () => {
  const response = await fetch("api/todoitems");
  if (response.ok) {
    todos.value = await response.json();
  } else {
    const errorObj = await tryGetErrorMessage(response);
    console.error(errorObj?.message ?? "Failed to get todos");
    toast.error(errorObj?.message ?? "Failed to get todos");
  }
};

const updateTodo = async (id: number, todo: Todo) => {
  const response = await fetch(`api/todoitems/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todo)
  });

  if (response.ok) {
    await getTodos();
  } else {
    const errorObj = await tryGetErrorMessage(response);
    console.error(errorObj?.message ?? "Failed to update todo");
    toast.error(errorObj?.message ?? "Failed to update todo");
  }
};

const onCreateTodo = async (todo: Todo) => {
  const response = await fetch("api/todoitems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todo)
  });

  if (response.ok) {
    await getTodos();
  } else {
    const errorObj = await tryGetErrorMessage(response);
    console.error(errorObj?.message ?? "Failed to create todo");
    toast.error(errorObj?.message ?? "Failed to create todo");
  }
}

const deleteTodo = async (id: number) => {
  const response = await fetch(`api/todoitems/${id}`, {
    method: "DELETE"
  });

  if (response.ok) {
    await getTodos();
  } else {
    const errorObj = await tryGetErrorMessage(response);
    console.error(errorObj?.message ?? "Failed to delete todo");
    toast.error(errorObj?.message ?? "Failed to delete todo");
  }
};

const onMarkCompleted = async (id: number, completed: boolean) => {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.isComplete = completed;
    await updateTodo(id, todo);
  }
};

onMounted(async () => {
  await getTodos();
});

</script>

<template>
  <h1 class="page-heading">Todos</h1>
  
  <AddTodoForm :onTodoAdded="onCreateTodo" />
  
  <p class="text-lg font-bold">Here are your todos:</p>
  
  <hr class="my-4" />
  
  <TodoList :todos="todos" :onDelete="deleteTodo" :onMarkCompleted="onMarkCompleted" />
</template>

<style scoped>
  
</style>