<script setup lang="ts">
  import { generateClient } from "aws-amplify/data";
  import type { Schema } from "../../amplify/data/resource"

  const client = generateClient<Schema>()

  import { ref, onMounted } from 'vue'

  const todos   = ref<Array<Schema['Todo']["type"]>>([])
  const name    = ref('')
  const content = ref('')

  const fetchTodos = async () => {
    try {
      const { data: fetchedTodos, errors } = await client.models.Todo.list()
      if (errors) {
        console.log("Error fetching todos:", errors)
      } else {
        todos.value = fetchedTodos
      }
    } catch (error) {
      console.error("Unexpected error fetching todos:", error)
    }
  }

  const createTodo = async() => {
    try {
      await client.models.Todo.create(
        {
          name:    name.value,
          content: content.value
        }
      )
      
      name.value    = ''
      content.value = ''

      fetchTodos()
    } catch (error) {
      console.error("Error creating todo:", error);
    }
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
