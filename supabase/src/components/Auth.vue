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
            :value="loadingLogin ? 'Logging in...' : 'Log In'"
            :disabled="loadingLogin"
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
            :value="loadingRegister ? 'Registering...' : 'Register'"
            :disabled="loadingRegister"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'

const loadingLogin = ref(false)
const loadingRegister = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerUsername = ref('')

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

const handleRegister = async () => {
  try {
    loadingRegister.value = true

    // Check if user with the provided email already exists
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select()
      .eq('email', registerEmail.value)

    if (usersData && usersData.length > 0) {
      // User with the provided email already exists
      alert('Email has already been registered.')
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: registerEmail.value,
        password: registerPassword.value
      })

      if (error) {
        console.log(error)
      } else {
        console.log(data)

        // Insert the user's email and username into the users table
        await supabase
          .from('users')
          .insert([{ email: registerEmail.value, username: registerUsername.value }])

        alert('Please check your email for confirmation.')
      }
    }
  } finally {
    loadingRegister.value = false
  }
}
</script>
