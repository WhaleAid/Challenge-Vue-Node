<script setup>
    import { defineProps } from 'vue'
    defineProps({
        text: {
            type: String,
            required: true
        },
        theme: {
            type: String,
            required: true
        }
    })
</script>

<template>
    <button class="btn" :class="theme">
        {{ text }}
    </button>
</template>

<style scoped lang="scss">

    btn {
        border: none;
        border-radius: 0.25rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        &:hover {
            opacity: 0.8;
        }
    }
</style>