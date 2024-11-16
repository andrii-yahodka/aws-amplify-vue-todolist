<script setup lang="ts">
  import { generateClient } from "aws-amplify/data";
  import type { Schema } from "../../amplify/data/resource"

  const client = generateClient<Schema>()

  import { ref, onMounted } from 'vue'

  const todos   = ref<Array<Schema['Todo']["type"]>>([])
  const name    = ref('')
  const content = ref('')

  function fetchTodos() {
    client.models.Todo.observeQuery().subscribe(
      {
        next: ({ items, isSynced }) => {
          todos.value = items
        }
      }
    )
  }

  function createTodo() {
    client.models.Todo.create(
      {
        name:    name.value,
        content: content.value
      }
    ).then(() => { fetchTodos() })
  }

  onMounted(() => { fetchTodos() })
</script>

<template>
  <input type="text" v-model="name" placeholder="Todo name">
  <input type="text" v-model="content" placeholder="Todo description">
  
  <button @click="createTodo">Create Todo</button>

  <h1>My todos</h1>
  <ul>
    <li
      v-for="todo in todos" :key="todo.id">
      {{ todo.name }} - {{ todo.content }}
    </li>
  </ul>
</template>
