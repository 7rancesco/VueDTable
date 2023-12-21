<script setup lang="ts">

    import {type Buttons} from '../DTable';
    interface Prop {
        value: string,
        componentSchema: Buttons
    }
    const prop = defineProps<Prop>()

</script>

<template>
    <div style="display: flex;">
        <div v-for="button, key in componentSchema.buttons">
            <button @click="button.method(Number(value))">{{ key }}</button>
        </div>
    </div>
</template>

<style scoped>

</style>
