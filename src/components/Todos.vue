<script setup lang="ts">
import { generateClient } from "aws-amplify/data"
import { getCurrentUser } from 'aws-amplify/auth'
import type { Schema } from "../../amplify/data/resource"

const client = generateClient<Schema>(
  { authMode: 'userPool' }
);

import { ref, onMounted } from 'vue';

const todos = ref<Array<Schema['Todo']["type"]>>([]);
const name = ref('');
const content = ref('');

const fetchTodos = async () => {
  try {
    const { userId } = await getCurrentUser()

    const { data: fetchedTodos, errors } = await client.models.Todo.listTodoByUserId({ userId: userId })

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

    const { userId } = await getCurrentUser()
    
    await client.models.Todo.create(
      {
        name: name.value,
        content: content.value,
        userId: userId
      },
      {
        authMode: 'userPool'
      }
    )

    // Clear the form inputs after adding a new todo
    name.value = '';
    content.value = '';

    // Fetch the updated list of todos
    fetchTodos();
  } catch (error) {
    console.error("Error creating todo:", error);
  }
};

const deleteTodo = async (todoId: string) => {
  try {
    await client.models.Todo.delete({ id: todoId })
    
    fetchTodos()
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

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

    <h2>My Todos</h2>
    <b-container fluid>
      <b-row>
        <b-col v-for="(todo, index) in todos" :key="todo.id" cols="12" md="4">
          <b-card
            :title="todo.name"
            img-src="https://picsum.photos/300/300/?image=41"
            img-alt="Image"
            img-top
            class="mb-4"
          >
            <b-card-text>
              {{ todo.content }}
            </b-card-text>
            <template #footer>
              <button @click="deleteTodo(todo.id)" class="btn btn-link float-end p-0" aria-label="Delete Todo">
                <i class="bi bi-trash text-danger"></i>
              </button>
            </template>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
