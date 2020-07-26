<template>
    <div>
        <table spacing="0">
            <thead>
                <tr>
                    <th>
                        <a v-on:click="sortCol = 'dateTime'">
                            When
                            <a v-if="sortOrder=='asc' && sortCol == 'dateTime'" v-on:click="sortOrder = 'desc'">^</a>
                            <a v-if="sortOrder=='desc' && sortCol == 'dateTime'" v-on:click="sortOrder = 'asc'">v</a>
                        </a>
                        <!-- <a class="right">
                            filter
                        </a> -->
                    </th>
                    <th>
                        <a v-on:click="sortCol = 'action'">
                            What 
                            <a v-if="sortOrder=='asc' && sortCol == 'action'" v-on:click="sortOrder = 'desc'">^</a>
                            <a v-if="sortOrder=='desc' && sortCol == 'action'" v-on:click="sortOrder = 'asc'">v</a>
                        </a>
                        <a class="right" v-on:click="showWhatFilter = !showWhatFilter">
                            filter
                        </a>
                        <DropdownFilter v-bind:textOptions="whats" v-if="showWhatFilter" v-on:text-filter="whatFilterText = $event" />
                    </th>
                    <th>
                        More Info
                        <input type="text" placeholder="search" class="right" v-model="moreInfoFilterText" />
                        <!-- <a class="right" v-on:click="showMoreInfoFilter = !showMoreInfoFilter">
                            filter
                        </a> -->
                        <TextFilter v-if="showMoreInfoFilter" />
                    </th> 
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in filteredResults" :key="row.index">
                    <td v-if="row.noTime">
                        {{row.dateTime.format("YYYY-MM-DD")}}
                    </td>
                    <td v-else>
                        {{row.dateTime.format("YYYY-MM-DD hh:mm a")}}
                    </td>
                    <td>
                        {{row.action}}
                    </td>
                    <td>
                        {{row.info}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import GoogleSheet from '../lib/GoogleSheet.js'
import { map, orderBy, uniq, filter } from 'lodash'
import moment from 'moment'
import TextFilter from './TextFilter'
import DropdownFilter from './DropdownFilter'
export default {
    components: {
        DropdownFilter,
        TextFilter,
    },
    name: 'index',
    data: function() {
        return {
            sheet: new GoogleSheet("1aPX6QcZWpaDF2gmFbbsjeb_MLoNB-2PThIf9neDdAJ8", 1),
            results: [],
            sortCol: 'dateTime',
            sortOrder: "desc",
            filter: null,
            showWhatFilter: false,
            showMoreInfoFilter: false,
            moreInfoFilterText: '',
            whatFilterText: ''
        };
    },
    mounted: function() {
        let self = this;
        self.sheet.getSheet().then( _ => {
            var index = -1;
            let mapFn = function(row) {
                var time = row.time || ''
                index++
                var formattedTime = moment(row.key + " " + time, "MM/DD/YYYY hh:mm a")
                return {
                    index: index,
                    dateTime: formattedTime,
                    noTime: time == '',
                    action: row.action || '',
                    info: row.info || ''
                }
            }
            self.results = orderBy(map(self.sheet.results, mapFn), [self.sortCol], [self.sortOrder]);
        });
    },
    methods: {
        sort: function() {
            let self = this;
            self.results = orderBy(self.results, [self.sortCol], [self.sortOrder])
        },
        filterMoreInfo: function(){

        }
    },
    computed: {
        whats: function() {
            let self = this
            return orderBy(uniq(map(self.results, _ => _.action.toLowerCase())))
        },
        filteredResults: function() {
            let self = this;
            if(self.results.length == 0) { return [] }
            return filter(self.results, _ => _.info.toLowerCase().indexOf(self.moreInfoFilterText) > -1 && _.action.toLowerCase().indexOf(self.whatFilterText) > -1)
        }
    },
    watch: {
        sortCol: function(newCol, oldCol) {
            let self = this
            self.sort();
        },
        sortOrder: function() {
            this.sort();
        },
        whatFilterText: function() {
            console.log(arguments)
        }
    }
}
</script>

<style lang="scss">
    body{
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
    table {
        margin: 0 auto;
        border-collapse: collapse;
        > thead {
            > tr {
                > th {
                    background-color:gray;
                    padding:5px;
                    text-align: left;
                }
            }
        }
        > tbody {
            > tr {
                > td {
                    padding:5px;
                    &:nth-child(3){
                        width: 50%;
                    }
                }
                &:nth-child(even) {
                    > td {
                        background-color:lightgray
                    }
                }
            }
        }
    }
    .right {
        float:right;
    }
    .left {
        float:right;
    }
</style>