<script setup lang="ts">

import {Todo} from "../../models/Todo.ts";
import {IconPlus} from '@tabler/icons-vue';
import {ref} from "vue";

const props = defineProps<{
  onTodoAdded: (todo: Todo) => void;
}>();

const name = ref<string>("");

const onSubmit = () => {
  
  if (!name.value) {
    return;
  }
  
  const todo: Todo = {
    name: name.value,
    isComplete: false
  };
  
  props.onTodoAdded(todo);
  
  name.value = "";
}

</script>

<template>
  <form class="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="onSubmit">
    <div class="mb-4">
      <label class="block text-gray-200 text-sm font-bold mb-2" for="todoName">Todo Name</label>
      <input 
          type="text" 
          class="rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline" 
          v-model="name" 
          aria-describedby="todoNameHelp" 
          placeholder="Enter todo name" 
          required 
      />
      <small id="todoNameHelp" class="text-gray-500">Enter the name of the todo you want to add.</small>
    </div>
    <div class="flex items-center justify-between">
      <button type="submit" class="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        <IconPlus class="fill-current w-7 h-7 mr-2" stroke={2} /> 
        <span>Add Todo</span>
      </button>
    </div>
  </form>
</template>

<style scoped>

</style>