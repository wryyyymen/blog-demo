<template>
    <div class="conteiner">
        <div class="nav">
            <div @click="homePage">首页</div>
            <n-popselect v-model:value="selectedCategory" :options="categoryOptions" trigger = 'click'>
                <div>分类 <span>{{categoryName}}</span></div>
            </n-popselect>
            <div @click="dashboard">后台</div>
        </div>


        <div v-for="(blog,index) in blogListInfo">
            <n-card :title="blog.title" style="margin-bottom:15px"> 
                {{blog.content}}
                
                <template #footer>
                    <n-sqace text-align="center">
                        <div>发布时间:{{blog.create_time}}</div>
                    </n-sqace>
                </template>
            </n-card>
        </div>
        
        <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />


        <div class="footer">
            <div>Power by XXXX</div>
            <div>XICP备xxxx号</div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted,computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import RichTextEditor from '../components/RichTextEditor.vue'

const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const dialog = inject("dialog")

onMounted(() => {
    loadCategorys();
    loadBlogs()
})

const pageInfo = reactive({
    page:1,
    pageSize:6,
    pageCount:0,
    count:0,
    keyword:''
})

const loadBlogs =async () => {
    let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
    let temp_rows = res.data.data.rows;
    for(let row of temp_rows){
        row.content += "..."
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
    }
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.count;
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count%pageInfo > 0 ? 1 : 0)
    console.log(res);
}

const selectedCategory = ref(0)
const categoryOptions = ref([])
const  blogListInfo = ref([])

const categoryName = computed(() => {
    let selectedOption = categoryOptions.value.find((option) => { return option.value == selectedCategory.value })
    return selectedOption ? selectedOption.label:""
})


const loadCategorys = async()=>{
    let res = await axios.get("/category/list")
    categoryOptions.value = res.data.rows.map((item)=>{
        return {
            label:item.name,
            value:item.id
        }
    })
    console.log(categoryOptions.value);
}

const homePage = () => {
    router.push('/')
}
const dashboard = () => {
    router.push('/login')
}
</script>

<style lang="scss" scoped>
    .conteiner{
        width: 1200px;
        margin: 0 auto;

        margin-left:30vw;
    }

    .nav{
        display: flex;
        margin: 50px;
        margin-left: 0;
        font-size: 40px;
        padding-top:20px;
        color:#64676a;
        div{
            cursor:pointer;
            margin-right:  50px;
            &:hover{
                color:#f60;
            }
        }
    }

    .footer{
        margin-top: auto;
        text-align: center;
        line-height: 25px;
        color: #64676a;
    }
</style>