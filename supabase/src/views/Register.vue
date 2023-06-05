<template>
  <form class="row flex-center flex" @submit.prevent="handleRegister" autocomplete="on">
    <h1>Registration</h1>
    <div class="col-6form-widget">
      <h1 class="header">Create a new account</h1>
      <div>
        <input class="inputField" required type="text" placeholder="Username" v-model="registerUsername" />
      </div>
      <div class="email">
        <input class="input1Field" required type="email" placeholder="E-mail" v-model="registerEmail"
          autocomplete="email" />
        <h5>Note: An account activation email will be sent to the email address you provide.</h5>
      </div>
      <div>
        <input class="inputField" required type="password" placeholder="Password" v-model="registerPassword"
          autocomplete="current-password" />
      </div>

      <div>
        <input type="submit" class="button block" :value="loadingRegister ? 'Registering...' : 'Register'"
          :disabled="loadingRegister" />
      </div>
    </div>
    <h1>Already a member?</h1>
    <RouterLink to="/login" class="login">Sign In</RouterLink>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { userSessionStore } from '../stores/userSession';

const userSession = userSessionStore()
const loadingRegister = ref(false)
const registerEmail = ref('')
const registerPassword = ref('')
const registerUsername = ref('')
const router = useRouter();

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

onMounted(() => {
  if (userSession.session !== null) {
    router.push(`/account/${userSession.session.user.id}`)
  }
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
}

.col-6form-widget {
  width: 700px;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h5 {
  color: black;
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

.input1Field {
  width: 100%;
  height: 40px;
  padding: 8px;
  /* margin-bottom: 16px; */
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 16px;
}

.email {
  margin-bottom: 16px;
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

.login {
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

.login:hover {
  /* Register button hover styles */
  background-color: #007bff;
  color: #ffffff;
}

.router-link-active {
  background-color: #007bff;
}
</style>
