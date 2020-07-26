
<template>
    <div>
        <select v-if="textOptions.length > 0" v-on:change="$emit('text-filter', filteredText)" v-model="filteredText">
            <option value=''>[none]</option>
            <option v-for="option in textOptions" :key="option">
                {{option}}
            </option>
        </select>
        <button>Cancel</button>
    </div>
</template>
<script>
export default {
    props: {
        'textOptions': Array
    },
    data: function (){
        return {
            filteredText: ''
        }
    }
}
</script>
<style scoped lang="scss">
    div {
        position: absolute;
        border:1px solid lightgray;
        background-color:white;
        padding:20px;
    }
</style>