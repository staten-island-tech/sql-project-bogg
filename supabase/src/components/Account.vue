<template>
  <div class="account">
    <h1>Welcome to Your Account</h1>
    <p>Username: {{ username }}</p>
    <p>Email: {{ email }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const username = ref('')
const email = ref('')

onMounted(async () => {
  const { data: userData, error: userError } = await supabase.auth.getSession()
  if (userData) {
    email.value = userData.session.user.email
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('email, username')
      .eq('email', userData.session.user.email)
      .single()

    if (usersData) {
      username.value = usersData.username
    }
  }
})

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
