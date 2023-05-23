<template>
  <div class="account">
    <h1>Welcome to Your Account</h1>
    <p>Username: {{ username }}</p>
    <p>Email: {{ email }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useRoute } from 'vue-router'

const { userId } = toRefs(useRoute().params)
const username = ref('')
const email = ref('')

onMounted(() => {
  getUserProfile(userId.value)
})

async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username, email')
      .eq('id', userId)
      .single()

    if (error) throw error

    if (data) {
      username.value = data.username
      email.value = data.email
    }
  } catch (error) {
    alert(error.message)
  }
}

async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  } else alert('Logout has been successful.')
}
</script>

<style scoped>
.account {
  margin: 20px;
}
</style>
