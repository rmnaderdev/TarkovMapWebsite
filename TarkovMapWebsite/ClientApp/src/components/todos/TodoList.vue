<script setup lang="ts">

import {Todo} from "../../models/Todo.ts";
import { IconX } from '@tabler/icons-vue';

const props = defineProps<{
  todos: Todo[];
  onMarkCompleted: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}>();

const onChecked = (todoId: number, checked: boolean) => {
  props.onMarkCompleted(todoId, checked);
};

</script>

<template>
  <ul class="list-none" v-if="props.todos.length > 0">
    <li v-for="todo in props.todos" :key="todo.id" :class="{ completed: todo.isComplete }">
      <label class="text-gray-200 font-bold cursor-pointer">
        <input class="mr-2 leading-tight" type="checkbox" @change="(e: Event) => onChecked(todo.id!, (e.target as HTMLInputElement).checked)" :checked="todo.isComplete" />
        <span class="text-sm">{{ todo.name }}</span>&nbsp;<IconX :title="('Delete ' + todo.name)" @click="todo.id !== undefined && props.onDelete(todo.id)" class="w-6 inline-block cursor-pointer stroke-red-600" stroke={2} />
      </label>
    </li>
  </ul>
  <p v-else>No todos found.</p>
</template>

<style scoped>
li.completed {
  text-decoration: line-through;
}
</style>