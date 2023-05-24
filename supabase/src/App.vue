<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <RouterLink to="/" v-if="showRegister">Home</RouterLink>
    <Account :userId="userId" v-if="session" :session="session" />
    <Login v-else-if="!showRegister" />
    <RouterLink to="/register" v-if="!showRegister && !session">Register</RouterLink>

    <RouterView v-if="showRegister" />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import Account from './components/Account.vue'
import Login from './components/Login.vue'
import { supabase } from '../src/lib/supabaseClient'

const session = ref()
const route = useRoute()
const showRegister = ref(false)

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })

  watch(route, () => {
    showRegister.value = route.path === '/register'
  })
})
</script>
