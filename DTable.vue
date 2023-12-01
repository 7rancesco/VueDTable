<script setup lang="ts">
    import DTableBuilder from './DTableBuilder.vue';
    const prop = defineProps({
        id: Number
    })
</script>

<template>
    <DTableBuilder :id="id" />
</template>

<style scoped>

</style>
