<template>
  <form class="row flex-center flex" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <h1 class="header">Login</h1>
      <div>
        <input class="inputField" required type="email" placeholder="Email" v-model="loginEmail" />
      </div>
      <div>
        <input
          class="inputField"
          required
          type="password"
          placeholder="Password"
          v-model="loginPassword"
        />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loadingLogin ? 'Logging in...' : 'Log In'"
          :disabled="loadingLogin"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

const loadingLogin = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')

const handleLogin = async () => {
  try {
    loadingLogin.value = true
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.value,
      password: loginPassword.value
    })
    if (error) {
      console.log(error)
    } else {
      console.log(data)
    }
  } finally {
    loadingLogin.value = false
  }
}
</script>

<style>
/* Component styles go here */
</style>
