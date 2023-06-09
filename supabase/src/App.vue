<template>
  <div class="container">
    <RouterView />
  </div>
</template>

<script setup>
import Homepage from './views/Homepage.vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { supabase } from '../src/lib/supabaseClient'
import { userSessionStore } from './stores/userSession'

const userSession = userSessionStore()
const router = useRouter()
const session = ref()
const showRegister = ref(false)

supabase.auth.onAuthStateChange((event, session) => {
  userSession.session = session
})

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
</style>
