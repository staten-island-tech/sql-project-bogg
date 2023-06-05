<template>
  <main>
    <nav>
      <RouterLink to="/new">New</RouterLink>
      <RouterLink v-for="build in builds" :to="build.dir">{{ build.name }}</RouterLink>
    </nav>

    <div class="about"></div>
  </main>
</template>

<script>
export default {
  name: 'about',
  props: {
    component: String
  },
  components: {},
  data() {
    return {
      builds: localStorage.getItem('builds')
    }
  },
  methods: {
    addbuild: function () {}
  }
}

async function getData() {
  return await fetch('../', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
    .then((response) => response.json())
    .then((response) => console.log(JSON.stringify(response)))
}
</script>
