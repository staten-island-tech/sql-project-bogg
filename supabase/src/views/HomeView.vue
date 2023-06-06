<template>
  <main>
    <h1>Welcome {{ user.username }}</h1>
    <nav>
      <h2 id="title">Your Builds</h2>
      <div class="parent">
        <RouterLink :to="'/build/' + build.id" class="child" v-for="build in builds">
          <p class="name">{{ build.name }}</p>
          <p class="description"></p>
        </RouterLink>
        <RouterLink :to="`/${userSession.session.user.id}/new`" class="child new">
          <p class="name">New</p>
          <p class="description"></p>
        </RouterLink>
      </div>
      <button @click="logout" class="logout">Logout</button>
    </nav>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { userSessionStore } from '../stores/userSession'
import { supabase } from '../lib/supabaseClient'

const router = useRouter()
const route = useRoute()
const userSession = userSessionStore()
const builds = ref([])
const user = ref({})

watch(userSession.session, (newVal, oldVal) => {
  if (userSession.session === null) {
    router.push('/')
  }
})

async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  } else {
    alert('You have been logged out')
    userSession.signedIn = false
    router.push('/')
  }
}

onMounted(async () => {
  let { data: info, error } = await supabase
    .from('builds')
    .select('name, info, id')
    .eq('user_id', userSession.session.user.id)
  builds.value = info

  const { data: userData, error: usersError } = await supabase
    .from('users')
    .select('email, username')
    .eq('email', userSession.session.user.email)
    .single()
  user.value = userData
  console.log(info, userSession.session, userData)

})
</script>
<style>
@import '../assets/base.css';

:root {
  --background-color: rgb(255, 255, 255);
  --hover-color: rgb(0, 0, 0);
  --h1-color: rgb(46, 46, 46);
  --radial-1: rgba(50, 50, 50, 0.35);
  --radial-2: rgba(0, 0, 0, 0);
}

html,
*,
body {
  font-size: 10px;
}

main {
  height: 100vh;
  padding-top: 1rem;
  width: 80vw;
  text-align: center;
}

.logout {
  background: #FF4742;
  border: 1px solid #FF4742;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: nunito, roboto, proxima-nova, "proxima nova", sans-serif;
  font-size: 16px;
  font-weight: 800;
  line-height: 16px;
  min-height: 40px;
  outline: 0;
  padding: 12px 14px;
  text-align: center;
  text-rendering: geometricprecision;
  text-transform: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  margin: auto;
  margin-top: 2rem;
}

.logout:hover,
.logout:active {
  background-color: initial;
  background-position: 0 0;
  color: #FF4742;
}

.logout:active {
  opacity: .5;
}

@media (prefers-color-scheme: dark) {
  :root {
    --hover-color: rgb(255, 255, 255);
    --h1-color: rgb(221, 221, 221);
    --radial-1: rgba(205, 205, 205, 0.35);
  }
}

body {
  height: 100vh;
  display: flex;
  align-items: top;
}

header {
  display: block;
  width: 100%;
  height: 50px;
}

h1 {
  display: block;
  font-size: 5rem;
  color: var(--h1-color);
  text-align: center;
}

h2 {
  font-size: 3rem;
  display: block;
  color: var(--h1-color);
  text-align: center;
}

.parent {
  display: flex;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
}

.child {
  display: inline-block;
  width: 30rem;
  height: 15rem;
  color: green;
  border: 2px solid var(--color-border);
  padding: 10px;
  margin: 1rem;
  border-radius: 2rem;
  transition-duration: 0.3s;
  font-size: 5rem;
}

.child:before {
  position: absolute;
  content: '';
  top: 100%;
  left: 5%;
  height: 2rem;
  width: 90%;
  opacity: 0;
  background: radial-gradient(ellipse at center, var(--radial-1) 0%, rgba(0, 0, 0, 0) 70%);
  transition-duration: 0.3s;
  transition-property: transform, opacity;
}

.child:hover,
.child:focus,
.child:active {
  -webkit-transform: translateY(-5px);
  transform: translateY(-5px);
}

.child:hover:before,
.child:focus:before,
.child:active:before {
  opacity: 1;
  -webkit-transform: translateY(5px);
  transform: translateY(5px);
}

.name {
  width: 100%;
  text-align: center;
  font-size: 3rem;
}

.discription {
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
}

.new {
  border-color: rgb(212, 175, 55);
}
</style>
