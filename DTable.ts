import { ref } from "vue"

interface Head {
    label: string
}

interface ColumnSett extends Head{
    searchable?: boolean,
    sortable?: boolean
}

interface CellText extends ColumnSett{
    component: 'text'
}

interface CellNumber extends ColumnSett{
    component: 'number'
}

interface Actions {
    method: Function,
    active?: boolean,
    class: string
}

interface Buttons extends Head {
    component: 'buttons',
    buttons: {
        [key: string] : Actions
    }
}

type Component = CellText | CellNumber | Buttons;

interface Schema {
    [key : number] : {
        columns : {
            [key : string] : Component
        },
        data: {[key: string] : any}[],
        filters: {[key: string] : Actions},
        requests: {[key: string] : Actions},
        pagination: number,
        defaultRequest?: string
    }
}

const TabComponents = ref<Schema>({
    1 : {
        columns: {
            'name' : {
                label: 'Nome',
                sortable: true,
                searchable: true,
                component: 'text'              
            },
            'surname' : {
                label: 'Cognome',
                sortable: true,
                searchable: true,
                component: 'text'              
            },
            'id' : {
                label: 'Azioni',
                component: 'buttons',
                buttons: {
                    'Modifica' : {
                        method: (id : number) => {
                            alert(id);
                        },
                        class: ''
                    },
                    'Elimina' : {
                        method: (id : number) => {
                            alert(id);
                        },
                        class: ''
                    },
                }
            }
        },
        data: [
            {id: 1, name: 'Francesco', surname: 'Crupi'},
            {id: 2, name: 'Giuseppe', surname: 'Crupi'},
            {id: 3, name: 'Davide', surname: 'Crupi'},
        ],
        filters: {
            'Id > 1' : {
                method: (data : string[][]) => {
                    const k = Object.keys(TabComponents.value[1].columns);
                    return data.filter(e => Number(e[k.indexOf('id')]) > 1);
                },
                class: ''
            },
            'Id < 2' : {
                method: (data : string[][]) => {
                    const k = Object.keys(TabComponents.value[1].columns);
                    return data.filter(e => Number(e[k.indexOf('id')]) < 2);
                },
                class: ''
            },
        },
        requests: {
            'Small data' : {
                method: () => {
                    TabComponents.value[1].data = [
                        {id: 1, name: 'Francesco', surname: 'Crupi'},
                        {id: 2, name: 'Giuseppe', surname: 'Crupi'},
                        {id: 3, name: 'Davide', surname: 'Crupi'},                        
                    ]
                },
                class: ''
            },         
            'Full data' : {
                method: () => {
                    TabComponents.value[1].data = [
                        {id: 1, name: 'Francesco', surname: 'Crupi'},
                        {id: 2, name: 'Giuseppe', surname: 'Crupi'},
                        {id: 3, name: 'Davide', surname: 'Crupi'},                    
                        {id: 4, name: 'Jlenia', surname: 'Ilarda'},
                        {id: 5, name: 'Claudia', surname: 'Di Peri'},  
                        {id: 6, name: 'Michela', surname: 'Di Davide'}, 
                        {id: 7, name: 'John', surname: 'Doe'}, 
                        {id: 8, name: 'Mick', surname: 'Stern'}, 
                        {id: 9, name: 'Steve', surname: 'Harriss'}, 
                        {id: 10, name: 'Michael', surname: 'Jordan'}, 
                        {id: 11, name: 'George', surname: 'Bouble'}, 
                        {id: 12, name: 'Bob', surname: 'Berg'}, 
                        {id: 13, name: 'Frank', surname: 'Gambale'}, 
                        {id: 14, name: 'Joe', surname: 'Satriani'}, 
                        {id: 15, name: 'John', surname: 'Smith'}, 
                        {id: 16, name: 'Lars', surname: 'Ulric'}, 
                        {id: 17, name: 'David', surname: 'Rossi'}, 
                        {id: 18, name: 'Michele', surname: 'Rossi'}, 
                        {id: 19, name: 'Stefano', surname: 'Rossi'}, 
                        {id: 20, name: 'Mario', surname: 'Rossi'}, 
                    ]
                },
                class: ''
            },
        },
        pagination: 3,
        defaultRequest: 'Small data'
    }
})

export {
    TabComponents,
    type CellText,
    type CellNumber,
    type Buttons
}