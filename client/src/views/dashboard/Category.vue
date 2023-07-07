<template>
    <div>
        <n-button @click="showModal = true">添加</n-button>
        <div>token: {{ adminStore.token }}</div>
        <n-table :bordered="false" :single-line="false" size="large">
            <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index ) in categoryList">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <!-- <td>{{item.name}}</td> -->
                    <td><n-button  @click="toUpdate(category)">修改</n-button><n-button
                            @click="deleteCategory(category)">删除</n-button>
                    </td>
                </tr>
            </tbody>
            <n-modal v-model:show="showModal" preset="dialog">
                <div>
                    <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
                </div>
                <template #action>
                    <div>
                        <n-button @click="add">提交</n-button>
                    </div>
                </template>
            </n-modal>
            <n-modal v-model:show="showUpdateModal" preset="dialog">
                <div>
                    <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称" />
                </div>
                <template #action>
                    <div>
                        <n-button @click="update">提交</n-button>
                    </div>
                </template>
            </n-modal>
        </n-table>
    </div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore';
import { ref, reactive, inject, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const dialog = inject("dialog")
const adminStore = AdminStore()

const categoryList = ref([])
const addCategory = reactive({
    name: "",
    token: adminStore.token
})

const updateCategory = reactive({
    name: "",
    token: adminStore.token
})

const showAddModel = ref(false)
const showModal = ref(false)
const showUpdateModal = ref(false)

onMounted(() => {
    loadDatas()
})

const loadDatas = async () => {
    let res = await axios.get("/category/list")
    categoryList.value = res.data.rows
}

const deleteCategory = async (category) => {
    dialog.warning({
        title: '警告',
        content: '确定删除此分类？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async() => {
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
            if (res.data.code == 200) {
                message.info(res.data.message)
                loadDatas()
            } else {
                message.error(res.data.msg)
            }
            message.success('确定')
        },
        onNegativeClick: () => {
            message.error('取消')
        }
    })

}

const toUpdate = async(category)=>{
    showUpdateModal.value = true
    updateCategory.id = category.id,
    updateCategory.name = category.name
}

const update = async () => {
    console.log();
    let res = await axios.put("/category/_token/update",{ name: updateCategory.name , id:updateCategory.id })
    if (res.data.code == 200) {
        message.info(res.data.message)
        loadDatas()
    } else {
        message.error(res.data.msg)
    }
    showUpdateModal.value = false;
}


const add = async () => {
    let res = await axios.post("/category/_token/add", { name: addCategory.name })
    if (res.data.code == 200) {
        message.info(res.data.message)
        loadDatas()
    } else {
        message.error(res.data.msg)
    }
    showAddModel.value = false;
}

</script>

<style lang="scss" scoped></style>