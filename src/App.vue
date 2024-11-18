<script setup lang="ts">
  import { Authenticator } from "@aws-amplify/ui-vue"

  import Todos from './components/Todos.vue'
</script>

<template>
  <authenticator>
    <template v-slot="{ user, signOut }">
      <h1>Hello {{ user.username }}!</h1>
      <main>
        <Todos />
      </main>
      <button @click="signOut">Sign Out</button>
    </template>
  </authenticator>
</template>

