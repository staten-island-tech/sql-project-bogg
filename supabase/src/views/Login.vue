<template>
  <form class="row flex-center flex" @submit.prevent="handleLogin" autocomplete="on">
    <h1>PC PART PICKER</h1>
    <h1>Your Account</h1>
    <div class="col-6form-widget">
      <h1 class="header">Sign In</h1>
      <div>
        <input
          class="inputField"
          required
          type="email"
          placeholder="Email"
          v-model="loginEmail"
          autocomplete="email"
        />
      </div>
      <div>
        <input
          class="inputField"
          required
          type="password"
          placeholder="Password"
          v-model="loginPassword"
          autocomplete="current-password"
        />
      </div>
      <div>
        <input
          type="submit"
          class="button block"
          :value="loadingLogin ? 'Logging in...' : 'Sign In'"
          :disabled="loadingLogin"
        />
      </div>
    </div>
    <h1>Not a member?</h1>
    <RouterLink to="/register" class="register" v-if="!showRegister"> Register Here </RouterLink>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { RouterLink, useRouter } from 'vue-router'
import { userSessionStore } from '../stores/userSession'
import { onMounted } from 'vue'

const router = useRouter()
const loadingLogin = ref(false)
const loginEmail = ref('')
const loginPassword = ref('')
const userSession = userSessionStore()

const handleLogin = async () => {
  try {
    loadingLogin.value = true
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.value,
      password: loginPassword.value
    })
    if (error) {
      throw error
    } else {
      console.log(data, 'loginPage Data')
      userSession.signedIn = true
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingLogin.value = false
    if (userSession.session.user.role === 'authenticated') {
      router.push(`/account/${userSession.session.user.id}`)
    }
  }
}

onMounted(() => {
  if (userSession.session !== null) {
    router.push(`/account/${userSession.session.user.id}`)
  }
})
</script>

<style scoped>
.col-6form-widget {
  width: 700px;
}

form {
  display: flex;
  width: 740px;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333333;
}

.inputField {
  width: 100%;
  height: 40px;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 16px;
}

.button {
  /* Sign In button styles */
  font-weight: bold;
  width: 100%;
  height: 40px;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.button.block {
  display: block;
  margin-bottom: 20px;
}

.header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

.register {
  /* Register button styles */
  border-style: solid;
  border-color: #ffffff;
  /* Set the border color to white */
  font-weight: bold;
  text-align: center;
  width: 100%;
  display: inline-block;
  padding: 10px 20px;
  background-color: #ffffff;
  color: #007bff;
  /* Set the text color to the same blue as the Sign In button */
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.register:hover {
  /* Register button hover styles */
  background-color: #007bff;
  color: #ffffff;
}

.router-link-active {
  background-color: #007bff;
}
</style>
