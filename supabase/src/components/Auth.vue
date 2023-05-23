<template>
  <div>
    <form class="row flex-center flex" @submit.prevent="handleLogin">
      <div class="col-6 form-widget">
        <h1 class="header">Login</h1>
        <div>
          <input
            class="inputField"
            required
            type="email"
            placeholder="Email"
            v-model="loginEmail"
          />
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
            :value="loading ? 'Logging in...' : 'Log In'"
            :disabled="loading"
          />
        </div>
      </div>
    </form>

    <form class="row flex-center flex" @submit.prevent="handleRegister">
      <div class="col-6 form-widget">
        <h1 class="header">Register</h1>
        <div>
          <input
            class="inputField"
            required
            type="email"
            placeholder="Email"
            v-model="registerEmail"
          />
        </div>
        <div>
          <input
            class="inputField"
            required
            type="password"
            placeholder="Password"
            v-model="registerPassword"
          />
        </div>
        <div>
          <input
            class="inputField"
            required
            type="text"
            placeholder="Username"
            v-model="registerUsername"
          />
        </div>
        <div>
          <input
            type="submit"
            class="button block"
            :value="loading ? 'Registering...' : 'Register'"
            :disabled="loading"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

const loading = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerUsername = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
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
    loading.value = false
  }
}

const handleRegister = async () => {
  try {
    loading.value = true
    const { data, error } = await supabase.auth.signUp({
      email: registerEmail.value,
      password: registerPassword.value
    })
    if (error) {
      throw error
    } else alert('please check your e-mail for confirmation')
  } finally {
    loading.value = false
  }
}
</script>
