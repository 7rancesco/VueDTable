<script setup lang="ts">
    import { ref, watch, onMounted } from 'vue';
    import DTableRoot from './DTableRoot';
    import { TabComponents } from './DTable';

    const props = defineProps({
        id: Number
    })

    const id = ref<number>(props.id ? props.id : 0);
    const data = ref<string[][]>();
    const columns = ref<string[]>([]);

    const setData = () => {

        //Set Columns
        columns.value = Object.keys(TabComponents.value[id.value].columns);

        //Set Data
        data.value = [];
        TabComponents.value[id.value].data.forEach(element => {
            const d : string[] = [];
            columns.value.forEach(key => {
                d.push(element[key].toString());
            });                
            data.value?.push(d)
        });

        //Run Filters
        runFilters();

        //Run Search
        getSearchResult();

    }

    onMounted(() => {
        setData();
    })

    watch(
        () => TabComponents.value[id.value].data,
        () => {
            setData();
        }
    )

    const searchValue = ref<string>('');

    const runFilters = () => {
        const fKeys = Object.keys( TabComponents.value[id.value].filters );
        fKeys.forEach(key => {
            const filter = TabComponents.value[id.value].filters[key];
            if(filter.active)
            {   
                data.value = filter.method(data.value)
            }
        });
    }  
    
    const getSearchResult = () => {
        let searchable : number[]= [];
        columns.value.forEach((key, index) => {
            const column = TabComponents.value[id.value].columns[key];
            if(column.component !== 'buttons' && column.searchable)
            {
                searchable.push(index)
            }
        });

        let result : string[][] = [];
        searchable.forEach(n => {
            data.value?.forEach(element => {
                if(element[n].toLocaleLowerCase().search(searchValue.value.toLocaleLowerCase()) >= 0)
                {   
                    result.push(element);
                }
            });
        });

        if(searchValue.value.length)
        {
            data.value = result
        }
    }    

</script>

<template>

    <div v-for="filter, key in TabComponents[id].filters">
        <input type="checkbox" @change="filter.active = !filter.active; setData()" /><label>{{ key }}</label>
    </div>

    <div v-for="request, key in TabComponents[id].requests">
        <button @click="request.method(); request.active = !request.active; setData();">{{ key }}</button>
    </div>

    <div>
        <input v-model="searchValue" @keyup="setData()" type="text" placeholder="Search">
    </div>

    <div style="display: flex;">
        <div v-for="column in columns">
            {{ TabComponents[id].columns[column].label }}
        </div>
    </div>

    <div v-for="row in data" style="display: flex;">
        <div v-for="cell, i in row">
            <component
                :value="cell"
                :componentSchema="TabComponents[id].columns[columns[i]]"
                :is="DTableRoot[TabComponents[id].columns[columns[i]].component]"
            />
        </div>
    </div>

</template>

<style scoped>

</style>
