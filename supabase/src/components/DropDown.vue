<template>
    <div class=container>
        <div class="component">
            <label for="touch"><span>{{
                key.split(/(?=[A-Z])/)
                    .map((string) => {
                        console.log(string)
                        return string.match(/\b(rpm|pwm|psu|tdp|gb|cas|ram|dpi|dvd|cd|snr|va)\b/i)
                            ? string.toUpperCase()
                            : string[0].toUpperCase() + string.substring(1)
                    }
                    )
                    .join(' ')
            }} >
                    {{ value.brand }} :
                    {{ value.model }}
                </span></label>
            <input type="checkbox" id="touch">
            <ul class="slide">
                <li>{{ value }}</li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive, defineProps, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const props = defineProps({
    key: {
        type: String,
        required: true
    },
    value: {
        type: Object,
        required: true
    }
})

const key = ref('Key')
const value = ref({})

watch(() => props.key, (newVal, oldVal) => {
    key.value = props.key
})
watch(() => props.value, (newVal, oldVal) => {
    value.value = props.value
})
onMounted(() => {
    key.value = props.key
    value.value = props.value
})
</script>
<style scoped>
body {
    font-family: "Open Sans", sans-serif;
}

li {
    text-decoration: none;
}

span {
    padding: 15px;
    background: #2d2f31;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    display: block;
}

span::after {
    float: right;
    right: 10%;
    content: "+";
}

.slide {
    clear: both;
    width: 100%;
    height: 0px;
    overflow: hidden;
    transition: height .4s ease;
    color: #2c5c8b
}

.slide li {
    padding: 30px;
}

#touch {
    position: absolute;
    opacity: 0;
    height: 0px;
}

#touch:checked+.slide {
    height: fit-content;
}
</style>