<script setup lang="ts">

    import {type CellText} from '../DTable';
    interface Prop {
        value: string,
        componentSchema: CellText
    }
    const prop = defineProps<Prop>()

</script>

<template>
    {{ value }}
</template>

<style scoped>

</style>
