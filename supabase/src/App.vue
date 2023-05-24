<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import Account from './components/Account.vue'
import Login from './components/Login.vue'
import { supabase } from '../src/lib/supabaseClient'

const session = ref()

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <RouterLink to="/">Home</RouterLink>
    <Account :userId="userId" v-if="session" :session="session" />
    <Login v-else />
    <RouterLink to="/register">Register</RouterLink>

    <RouterView />
  </div>
</template>
