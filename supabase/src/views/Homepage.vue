<template>
  <div class="container">
    <h1>Welcome to PC Picker Parts</h1>
    <h2>Build Guides</h2>
    <a
      href="https://www.newegg.com/insider/building-a-gaming-pc-for-the-first-time-dont-panic-this-guide-can-help-you-out/">Check
      out this article for first-time PC builders!</a>
    <a href="https://www.pcgamer.com/pc-build-guide-budget-gaming-pc/">Budget Intel Gaming PC</a>
    <a href="https://techbuyersguru.com/guide/the-best-750-budget-gaming-pc-build/">$750 Gaming PC</a>
    <a href="https://www.pcgamer.com/gaming-pc-build-guide/">Mid-tier AMD PC</a>
    <div class="profiles">
      <h2>Profiles</h2>
      <ul>
        <li v-for="profile in profiles" :key="profile.id">
          <a :href="'user/' + profile.id">
            <span>{{ profile.username }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const profiles = ref([])

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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 20px;
}

h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.profiles {
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}
</style>
