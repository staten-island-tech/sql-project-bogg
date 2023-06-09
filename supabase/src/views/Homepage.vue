<template>
  <RouterLink :to="userSession.session ? 'account/' + userSession.session.user.id : 'account/123'" class="home">
    Account
  </RouterLink>
  <div class="container">
    <h1>Welcome to Computer Builder</h1>
    <h2>Build Guides</h2>
    <a href="https://www.newegg.com/insider/building-a-gaming-pc-for-the-first-time-dont-panic-this-guide-can-help-you-out/"
      class="links">Check
      out this article for first-time PC builders!</a>
    <a href="https://www.pcgamer.com/pc-build-guide-budget-gaming-pc/" class="links">Budget Intel Gaming PC</a>
    <a href="https://techbuyersguru.com/guide/the-best-750-budget-gaming-pc-build/" class="links">$750 Gaming PC</a>
    <a href="https://www.pcgamer.com/gaming-pc-build-guide/" class="links">Mid-tier AMD PC</a>
    <div class="profiles">
      <h2 class="profile-text">Profiles</h2>
      <ul>
        <li v-for="profile in profiles" :key="profile.id">
          <div>
            <RouterLink :to="'user/' + profile.id" class="user-redirect">
              <span>{{ profile.username }}</span>
            </RouterLink>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { userSessionStore } from '../stores/userSession'
import { useRoute, RouterLink } from 'vue-router'



const profiles = ref([])
const userSession = userSessionStore()

onMounted(async () => {
  const { data, error } = await supabase.from('profiles').select('username, id')
  if (error) {
    console.error(error.message)
  } else {
    profiles.value = data
  }
})

</script>

<style scoped>
.home {
  grid-area: home;
  font-size: 20px;
  display: block;
  width: 8rem;
  position: fixed;
  top: 1rem;
  left: 2rem;
}

.container {
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 20px;
  height: 100vh;
}

h1 {
  font-size: 5rem;
  margin-bottom: 10px;
  width: 100%;
}

h2 {
  font-size: 4rem;
  margin-bottom: 10px;
  border-bottom: blue solid 2px;
}

.profile-text {
  border-bottom: green solid 2px;
}

.links {
  color: #007bff;
  text-decoration: none;
  font-size: 2rem;
}

.links:hover {
  text-decoration: underline;
  background-color: #1c89fd2d;
}

.profiles {
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
  width: 100%;

}

li {
  margin-bottom: 10px;

}

span {
  font-size: 2rem;
  width: 80rem;
  text-decoration: underline;
}


.user-redirect {
  width: 100%;
  display: block;

}
</style>
