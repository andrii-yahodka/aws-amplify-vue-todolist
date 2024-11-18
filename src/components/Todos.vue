<script setup lang="ts">
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

import { ref, onMounted } from 'vue';

const todos = ref<Array<Schema['Todo']["type"]>>([]);
const name = ref('');
const content = ref('');

const fetchTodos = async () => {
  try {
    const { data: fetchedTodos, errors } = await client.models.Todo.list();
    if (errors) {
      console.log("Error fetching todos:", errors);
    } else {
      todos.value = fetchedTodos;
    }
  } catch (error) {
    console.error("Unexpected error fetching todos:", error);
  }
};

const createTodo = async () => {
  try {
    await client.models.Todo.create({
      name: name.value,
      content: content.value
    });

    // Clear the form inputs after adding a new todo
    name.value = '';
    content.value = '';

    // Fetch the updated list of todos
    fetchTodos();
  } catch (error) {
    console.error("Error creating todo:", error);
  }
};

// Fetch todos when the component is mounted
onMounted(() => {
  fetchTodos();
});
</script>

<template>
  <div class="container mt-4">
    <!-- Todo Form -->
    <form class="row g-3 mb-4" @submit.prevent="createTodo">
      <div class="col-md-4">
        <label for="todo-name" class="form-label visually-hidden">Todo Name</label>
        <input 
          type="text" 
          id="todo-name" 
          class="form-control" 
          v-model="name" 
          placeholder="Todo name" 
          required
        >
      </div>
      <div class="col-md-4">
        <label for="todo-content" class="form-label visually-hidden">Todo Content</label>
        <input 
          type="text" 
          id="todo-content" 
          class="form-control" 
          v-model="content" 
          placeholder="Todo description" 
          required
        >
      </div>
      <div class="col-md-4">
        <button type="submit" class="btn btn-primary">Create Todo</button>
      </div>
    </form>

    <!-- Todo Table -->
    <h2>My Todos</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Content</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="todo in todos" :key="todo.id">
          <td>{{ todo.name }}</td>
          <td>{{ todo.content }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
