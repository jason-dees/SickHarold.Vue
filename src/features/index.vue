<template>
    <div>
        <table border="1">
            <thead>
                <tr>
                    
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in results" :key="row.key+row.time">
                    <td>{{row.key}}</td>
                    <td>{{row.time}}</td>
                    <td>{{row.action}}</td>
                    <td>{{row.info}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import GoogleSheet from '../lib/GoogleSheet.js'
export default {
    name: 'index',
    data: function() {
        return {
            sheet: new GoogleSheet("1aPX6QcZWpaDF2gmFbbsjeb_MLoNB-2PThIf9neDdAJ8", 1),
            results: []
        };
    },
    mounted: function() {
        let self = this;
        self.sheet.getSheet().then( _ => {
            self.results = self.sheet.results;
            console.log(self.results);
        });
    },
    methods: {
    }
}
</script>