<template>
    <div class="build-container">
        <RouterLink to="/" class="home">Home</RouterLink>
        <p>></p>
        <RouterLink to="/" class="back">Back</RouterLink>
        <h1>
            {{ data.name }}
        </h1>
        <p class="author">Made by {{ data.profiles.username }}</p>
        <div v-for="[key, value] in Object.entries(data.info)" class="component">
            <h2>
                {{ key.split(/(?=[A-Z])/)
                    .map((string) =>
                        string.match(/\b(rpm|ups|cpu|pwm|psu|tdp|gb|cas|ram|dpi|dvd|cd|snr|va)\b/i)
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
                <p v-if="(typeof value !== 'object')">
                    : {{ value }}
                </p>
                <p v-else>
                    : {{ objectControl(value) }}
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

const route = useRoute()
const data = ref({ info: {}, profiles: { username: {} } })
const username = ref('')

function objectControl(value) {
    if (value.default !== undefined) {
        return `Default: ${value.default}`
    } else if (value.min !== undefined) {
        return `Min: ${value.min}, Max: ${value.max}`
    } else {
        return 'Unknown/None'
    }
}

onMounted(async () => {
    const { data: pull, error } = await supabase
        .from('builds')
        .select('*, profiles(username)')
        .eq('id', route.params.id)
        .single()
    data.value = pull
})
</script>
<style scoped>
.home,
.back {
    grid-area: home;
    font-size: 20px;
    display: inline-block;
    width: 5.5rem;
}

.build-container {
    width: 80rem;
    height: 99vh;
    flex-wrap: wrap;
    padding: 2rem;
    padding-bottom: 5rem;
}

.author {
    display: block;
    margin-bottom: 1rem;
    text-align: center;
}

h2 {
    margin-left: 0;
}

.component {

    display: block;
    width: 100%;
    text-align: left;
    align-items: left;
    margin-bottom: 2rem;
    border: blue solid 2px;
    padding-left: 2rem;
}

p {
    font-size: 2rem;
    display: inline-block;
}

.key {
    width: 20rem;
}
</style>