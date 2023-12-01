<script setup lang="ts">

    import {type CellNumber} from '../DTable';
    interface Prop {
        value: string,
        componentSchema: CellNumber
    }
    const prop = defineProps<Prop>()

</script>

<template>
    {{ value }}
</template>

<style scoped>

</style>
