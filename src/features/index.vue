<template>
    <div>
        <table spacing="0">
            <thead>
                <tr>
                   <th v-on:click="sortCol = 'dateTime'">
                       When
                       <a v-if="sortOrder=='asc' && sortCol == 'dateTime'" v-on:click="sortOrder = 'desc'">^</a>
                       <a v-if="sortOrder=='desc' && sortCol == 'dateTime'" v-on:click="sortOrder = 'asc'">v</a>
                    </th>
                   <th  v-on:click="sortCol = 'action'">
                       What 
                       <a v-if="sortOrder=='asc' && sortCol == 'action'" v-on:click="sortOrder = 'desc'">^</a>
                       <a v-if="sortOrder=='desc' && sortCol == 'action'" v-on:click="sortOrder = 'asc'">v</a>
                    </th>
                   <th>
                       More Info
                    </th> 
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in results" :key="row.index">
                    <td v-if="row.noTime">
                        {{row.dateTime.format("YYYY-MM-DD")}}
                    </td>
                    <td v-else>{{row.dateTime.format("YYYY-MM-DD hh:mm a")}}</td>
                    <td>{{row.action}}</td>
                    <td>{{row.info}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import GoogleSheet from '../lib/GoogleSheet.js'
import { map, orderBy } from 'lodash'
import moment from 'moment'
export default {
    name: 'index',
    data: function() {
        return {
            sheet: new GoogleSheet("1aPX6QcZWpaDF2gmFbbsjeb_MLoNB-2PThIf9neDdAJ8", 1),
            results: [],
            sortCol: null,
            sortOrder: "asc",
            filter: null
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
                    action: row.action,
                    info: row.info
                }
            }
            self.results = map(self.sheet.results, mapFn);
        });
    },
    methods: {
        sort: function() {
            let self = this;
            self.results = orderBy(self.results, [self.sortCol], [self.sortOrder])
        },
    },
    watch: {
        sortCol: function(newCol, oldCol) {
            console.log(oldCol, newCol)
            let self = this
            self.sort();
        },
        sortOrder: function() {
            this.sort();
        }
    }
}
</script>

<style lang="scss">
    table {
        margin: 0 auto;
        border-collapse: collapse;
        > thead {
            > tr {
                > th {
                    background-color:gray;
                    padding:5px;
                }
            }
        }
        > tbody {
            > tr {
                > td {
                    padding:5px;
                }
            }
        }
    }
</style>