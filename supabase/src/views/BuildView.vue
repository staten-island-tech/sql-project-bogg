<template>
    <div class="build-container">
        <RouterLink to="/" class="home">Home</RouterLink>
        <p class="arr">></p>
        <RouterLink :to="'/user/' + data.user_id" class="back">Back</RouterLink>
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
import { supabase } from '../lib/supabaseClient'

const route = useRoute()
const data = ref({ info: {}, profiles: { username: {} } })

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
    width: 6rem;
    border: 1px solid rgb(0, 189, 126);
    border-radius: 1rem;
    top: -1.5rem;
    left: -3rem;
    padding-left: 2px;
}

.arr {
    top: -1.5rem;
    left: -3rem;
}

.back {
    width: 4.5rem;
}

.build-container {
    width: 96vw;
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
    width: 80rem;

    display: block;
    text-align: left;
    margin-bottom: 2rem;
    border: blue solid 2px;
    padding-left: 2rem;
    margin: auto;
}

p {
    font-size: 2rem;
    display: inline-block;
}

.key {
    width: 20rem;
}
</style>