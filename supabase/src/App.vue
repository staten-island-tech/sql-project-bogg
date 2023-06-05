<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { supabase } from '../src/lib/supabaseClient'
import { userSessionStore } from './stores/userSession';

const userSession = userSessionStore()
const router = useRouter()
const session = ref()
const showRegister = ref(false)

supabase.auth.onAuthStateChange((event, session) => {
  userSession.session = session
  // console.log(event, "its working", userSession, userSession.signedIn)
  // if (userSession.session !== null) {
  //   if (userSession.session.user.role === "authenticated") {
  //     router.push(`/account/${userSession.session.user.id}`)
  //   }
  // }
})

onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session
    // if (data.session !== null) {
    //   if (data.session.user.role === "authenticated") {
    //     router.push(`/account/${data.session.user.id}`)
    //   }
    // }
  })

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session
  })
})
</script>

<style scoped></style>
