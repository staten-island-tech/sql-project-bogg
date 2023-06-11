<template>
  <RouterLink :to="userSession.session ? 'account/' + userSession.session.user.id : 'account/123'" class="home">
    Account
  </RouterLink>
  <div class="container">
    <h1>Welcome to Computer Builder</h1>
    <details class="dropdown">
      <summary role="button">
        <a class="button">Build Guides</a>
        <p class="rotate"></p>
      </summary>
      <ul>
        <li class="link-parent">
          <a href="https://www.newegg.com/insider/building-a-gaming-pc-for-the-first-time-dont-panic-this-guide-can-help-you-out/"
            class="links">Check out this article for first-time PC builders!
          </a>
        </li>
        <li class="link-parent">
          <a href="https://www.pcgamer.com/pc-build-guide-budget-gaming-pc/" class="links">Budget Intel Gaming PC</a>
        </li>
        <li class="link-parent">
          <a href="https://techbuyersguru.com/guide/the-best-750-budget-gaming-pc-build/" class="links">$750 Gaming PC</a>
        </li>
        <li class="link-parent"><a href="https://www.pcgamer.com/gaming-pc-build-guide/" class="links">Mid-tier AMD PC</a>
        </li>
      </ul>
    </details>
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
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown summary {
  cursor: pointer;
  outline: none;
  position: relative;
  vertical-align: middle;
}



.dropdown .button {
  font-size: 2.5rem;
  width: 100%;
  display: inline-block;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.dropdown .button:hover {
  background-color: #0056b3;
}

.dropdown ul {
  background-color: #999;
  list-style-type: none;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: block;
}


.dropdown ul li a {
  display: block;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.dropdown ul li a:hover {
  background-color: #f2f2f2;
}

.dropdown[open] ul {
  display: block;
}

summary::marker {
  display: none;
  position: absolute;
  color: rgba(0, 0, 0, 0)
}


.home {
  grid-area: home;
  font-size: 20px;
  display: block;
  width: 8rem;
  position: fixed;
  top: 1rem;
  left: 2rem;
  padding-left: 2px;
  border: 1px solid rgb(0, 189, 126);
  border-radius: 1rem;
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
  border-bottom: green solid 2px;
}


.links {
  color: #007bff;
  text-decoration: none;
  font-size: 2rem;
  width: 100%;
  height: 100%;
  padding-top: 1rem;
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

.link-parent {
  height: 5rem;
}
</style>
