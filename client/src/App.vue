

<template>
  <n-message-provider>
    <router-view></router-view>
  </n-message-provider>
</template>

<script setup>
import HelloWorld from './components/HelloWorld.vue'
import {defineStore,storeToRefs} from 'pinia'
import { testStore } from './stores/TestStore';
const counter = testStore()
function testClick(){
  counter.count++,
  message.value='11111'
}

let {message} = storeToRefs(counter)

</script>

<style scoped>

</style>
