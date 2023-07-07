import {defineStore,storeToRefs} from 'pinia'

export const testStore = defineStore("test", {
    state: () => {
        return {
            count:1,
            message:'hello'
        }
    },
    actions: {
        testAction(){
            this.count *=2
        }
    }, 
    getters: {

    }
})