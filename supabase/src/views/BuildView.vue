<template>
    <div class="build-container">
        <RouterLink to="/" class="home">Home</RouterLink>
        <p>></p>
        <RouterLink to="/" class="back">Back</RouterLink>
        <h1>
            {{ data.name }} made by {{ data.profiles.username }}
        </h1>
        <div v-for="[key, value] in Object.entries(data.info)" class="component">
            <h2>
                {{ key.split(/(?=[A-Z])/)
                    .map((string) =>
                        string.match(/\b(rpm|cpu|pwm|psu|tdp|gb|cas|ram|dpi|dvd|cd|snr|va)\b/i)
                            ? string.toUpperCase()
                            : string[0].toUpperCase() + string.substring(1)

                    )
                    .join(' ')
                }}
            </h2>
            <div v-for="[key, value] in Object.entries(value)">
                <p class="key">
                    {{
                        key
                            .split('_')
                            .map((string) =>
                                string.match(/rpm|pwm|psu|tdp|gb|cas|ram|dpi|dvd|cd|snr|va/i)
                                    ? string.toUpperCase()
                                    : string[0].toUpperCase() + string.substring(1)
                            )
                            .join(' ')
                    }}
                </p>
                <p>
                    : {{ value }}
                </p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { userSessionStore } from '../stores/userSession'
import { supabase } from '../lib/supabaseClient'
import DropDown from '../components/DropDown.vue'

const route = useRoute()
const data = ref({ info: {}, profiles: { username: {} } })
const username = ref('')
onMounted(async () => {
    const { data: pull, error } = await supabase
        .from('builds')
        .select('*, profiles(username)')
        .eq('id', route.params.id)
        .single()
    data.value = pull
    console.log(data.value)
})
</script>
<style scoped>
body {
    font-family: "Open Sans", sans-serif;
}

.home,
.back {
    grid-area: home;
    font-size: 20px;
    display: inline-block;
    width: 5.5rem;
}

.build-container {
    width: 100%;
    height: 99vh;
    /* wrap: wrap; */
    flex-wrap: wrap;
}

h2 {
    margin-left: 0;
}

.component {

    display: block;
    width: 100%;
    text-align: left;
    align-items: left;
}

p {
    font-size: 2rem;
    display: inline-block;
}

.key {
    width: 20rem;
}
</style>