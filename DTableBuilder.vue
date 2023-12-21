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

        //Set pagination
        if(TabComponents.value[id.value].pagination === 0)
        {
            pagination.value = {from: 0, to: 250};
            isPagination.value = false;
        }
        else
        {
            pagination.value = {from: 0, to: TabComponents.value[id.value].pagination};
            isPagination.value = true;
        }

        //SORT
        sorting();

        //Pagination 
        paginationIndex.value = 1;

    }

    onMounted(() => {
        setData();
        if(TabComponents.value[id.value].defaultRequest)
        {
            const dfrequest = TabComponents.value[id.value].defaultRequest;
            requestActive.value = dfrequest ? dfrequest : '';
        }
    })

    watch(
        () => TabComponents.value[id.value].data,
        () => {
            setData();
        }
    )

    const searchValue = ref<string>('');
    
    const countFilters = ref(0);
    const runFilters = () => {
        countFilters.value = 0;
        const fKeys = Object.keys( TabComponents.value[id.value].filters );
        fKeys.forEach(key => {
            const filter = TabComponents.value[id.value].filters[key];
            if(filter.active)
            {   
                countFilters.value += 1;
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

    const isPagination = ref(false);
    const pagination = ref({
        from: 0,
        to: 0
    })

    const requestActive = ref('');
    const sortActive = ref('');
    const sortBy = ref<{key: number, sort: 'ASC' | 'DESC'} | null>(null);

    const sorting = () => {
        if(sortBy.value !== null)
        {
            data.value = data.value?.sort(sortData(sortBy.value.key, sortBy.value.sort))
        }
    }

    function sortData(index : number, order : 'ASC' | 'DESC') {
        return function (a : string[], b : string[]) {
            const aValue = a[index];
            const bValue = b[index];

            if (order === 'ASC') {
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
            } else if (order === 'DESC') {
            if (aValue > bValue) return -1;
            if (aValue < bValue) return 1;
            return 0;
            } else {
            throw new Error('Invalid order type. Use "ASC" or "DESC".');
            }
        };
    }    

    const getPaginationLenght = () => {
        const l = data.value?.length;

        if(l)
        {
            const n = l / TabComponents.value[id.value].pagination;
            return (Math.round(n) -  1)
        }
        
        return 0
    }

    const paginationIndex = ref(1);

    const showSidebar = ref(false);

</script>

<template>

<div class="dTable-container">

    <div v-if="showSidebar" class="dTable-sidebar">
        <div v-for="filter, key in TabComponents[id].filters">
            <label><input type="checkbox" @change="filter.active = !filter.active; setData()" />{{ key }}</label>
        </div>
    </div>

    <div class="dTable-body">

        <div class="dTable-header">
            <div>
                <button @click="showSidebar = !showSidebar">Filtri ({{ countFilters }})</button>
            </div>
            <div v-for="request, key in TabComponents[id].requests">
                <button :class="requestActive == key ? 'request-active' : null" @click="request.method(); request.active = !request.active; setData(); requestActive = key.toString();">{{ key }}</button>
            </div>

            <div>
                <input v-model="searchValue" @keyup="setData()" type="text" placeholder="Search">
            </div>
        </div>

        <div class="dTable-content">
            <div class="dTable-columns">
                <div v-for="column, i in columns" class="dTable-column">
                    <div>
                        {{ TabComponents[id].columns[column].label }} 
                    </div>
                    <div v-if="TabComponents[id].columns[column].searchable" style="height: 40px;">
                        <div>
                            <button :class="sortActive == (i + 'DESC') ? 'sort-active' : null" @click="sortActive = i + 'DESC'; sortBy = {key: i, sort: 'DESC'}; setData();">^</button>
                        </div>
                        <div>
                            <button :class="sortActive == (i + 'ASC') ? 'sort-active' : null" @click="sortActive = i + 'ASC'; sortBy = {key: i, sort: 'ASC'}; setData();">v</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-for="row in data?.slice(pagination.from, pagination.to)" class="dTable-row">
                <div v-for="cell, i in row" class="dTable-cell">
                    <component
                        :value="cell"
                        :componentSchema="TabComponents[id].columns[columns[i]]"
                        :is="DTableRoot[TabComponents[id].columns[columns[i]].component]"
                    />
                </div>
            </div>        
        </div>

    </div>
</div>

<div v-if="pagination.to !== 0" class="pagination">
    <button v-if="pagination.from !== 0" @click="paginationIndex = 1; pagination = {from : 0, to : TabComponents[id].pagination}">1</button> 
    <button v-if="pagination.from !== 0" @click="pagination = {from : pagination.from - TabComponents[id].pagination, to : pagination.to - TabComponents[id].pagination}; paginationIndex-= 1;">Prev</button> 
    <div v-if="getPaginationLenght() > 1">
        <div v-for="n in getPaginationLenght()">
            <button :class="paginationIndex == n + 1 ? 'pagination-index' : null" @click="paginationIndex = n + 1; pagination = {from: n * TabComponents[id].pagination , to: (n * TabComponents[id].pagination) + TabComponents[id].pagination}">{{ n + 1 }}</button>
        </div>
    </div>
    <button v-if="pagination.to < data?.length" @click="pagination = {from : pagination.from + TabComponents[id].pagination, to : pagination.to + TabComponents[id].pagination}; paginationIndex+= 1;">Next</button> 
</div>
</template>

<style scoped>
    .dTable-container{
        display: flex;
        width: 100%;
        max-width: 1500px;
        min-height: 50vh;
        background: rgb(235, 229, 229);
    }

    .dTable-sidebar{
        width: 300px;
        background: red;
    }

    .dTable-header{
        display: flex;
        height: 50px;
        background: gray;
    }

    .dTable-body{
        width: 100%;
    }

    .dTable-content{
        width: 100%;
        height: 100%;
        overflow: scroll;

    }

    .dTable-columns{
        background: blue;
        height: 40px;
    }

    .dTable-column{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .dTable-column button{
        height: 20px;
        width: 20px;
        margin-top: 1px;
        border: none;
        background: transparent;
    }

    .dTable-row{
        
    }

    .dTable-cell{

    }

    .dTable-columns,
    .dTable-row
    {
        display: flex;
        justify-content: flex-start;
        align-items: start;
        border-bottom: solid;
    }

    .dTable-row:nth-child(odd)
    {
        background: red;
    }
    .dTable-row:nth-child(even)
    {
        background: orange;
    }

    .dTable-column,
    .dTable-cell
    {
        width: 300px;
        height: 30px;
        padding: 3px;
        border-left: solid;
    }

    .request-active{
        background: orange;
    }

    .sort-active
    {
        background: green !important;
    }

    .pagination-index{
        background: blue;
    }

    button:hover
    {
        cursor: pointer;
    }

</style>
