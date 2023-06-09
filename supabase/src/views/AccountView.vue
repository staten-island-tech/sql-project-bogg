<template>
    <div class=container>
        <RouterLink to="/" class="home">Home</RouterLink>

        <h1>{{ username }}'s Builds'</h1>
        <div class="parent">
            <RouterLink :to="'/build/' + build.id" class="child" v-for="build in data" :key="build.id">
                <p class="name">{{ build.name }}</p>
                <p class="description"></p>
            </RouterLink>
        </div>
    </div>
</template>
<script setup>
import BuildComp from '../components/BuildComponent.vue'
import ComponentDisplay from '../components/ComponentDisplay.vue'
import { ref, onMounted, reactive } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { userSessionStore } from '../stores/userSession'
import { supabase } from '../lib/supabaseClient'

const route = useRoute()
const data = ref([])
const username = ref('')
onMounted(async () => {
    const { data: pull, error } = await supabase
        .from('builds')
        .select('*, profiles(username)')
        .eq('user_id', route.params.id)
    data.value = pull
    if (error || pull[0] === undefined) {
        const { data: pull, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', route.params.id)
            .single()
        console.log(pull)
        username.value = pull.username
    } else {
        username.value = pull[0].profiles.username
        console.log(data.value)
    }
})
</script>
<style scoped>
@import '../assets/base.css';

.home {
    grid-area: home;
    font-size: 20px;
    display: block;
    width: 5.5rem;
}

body {
    font-family: "Open Sans", sans-serif;
}

.container {
    display: block;
    width: 100%;
    height: 99vh;
}

h1 {
    padding: 40px;
    display: block;
    text-align: center;
    font-size: 3rem;
    width: 100%;
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
</style>