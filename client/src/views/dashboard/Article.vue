<template>
    <n-tabs type="line"  justify-content="space-evenly" v-model:value="tabValue">
        <n-tab-pane name="list" tab="文章列表">
            <div v-for="(blog,index) in blogListInfo">
                <n-card :title="blog.title" style="margin-bottom:15px"> 
                    {{blog.content}}
                    
                    <template #footer>
                        <n-sqace text-align="center">
                            <div>发布时间:{{blog.create_time}}</div>
                            <n-button @click="toUpdate(blog)">修改</n-button>
                            <n-button @click="toDelete(blog)">删除</n-button>
                        </n-sqace>
                    </template>
                </n-card>
            </div>
            <n-sapce class="page">
                <div v-for="pageNum in pageInfo.pageCount" class="pageItem" @click="toPage(pageNum)">
                    <div :style="'color:'+ (pageNum == pageInfo.page ? 'blue':'')">
                        {{pageNum}}
                    </div> 
                </div>
            </n-sapce>

        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入标题"></n-input>
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="addArticle.categoryId" :options="categoryOptions"></n-select>
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="addArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
        <n-tab-pane name="update" tab="修改文章">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输入标题"></n-input>
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.categoryId" :options="categoryOptions"></n-select>
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="Update()">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
    </n-tabs>
</template>


<script setup>
import { AdminStore } from '../../stores/AdminStore';
import { ref, reactive, inject, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import RichTextEditor from '../../components/RichTextEditor.vue'
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")
const dialog = inject("dialog")

const adminStore = AdminStore()

const addArticle = reactive({
    categoryId:0,
    title:"",
    content:"",
})

const updateArticle = reactive({
    id:0,
    categoryId:0,
    title:'',
    cotent:'',
})

const  blogListInfo = ref([])
const categoryOptions = ref([])
const tabValue = ref("list") 


const loadCategorys = async()=>{
    let res = await axios.get("/category/list")
    categoryOptions.value = res.data.rows.map((item)=>{
        return {
            label:item.name,
            value:item.id
        }
    })
    console.log(categoryOptions);
}

const pageInfo = reactive({
    page:1,
    pageSize:3,
    pageCount:0,
    count:0,
})


onMounted(()=>{
    loadBlogs()
    loadCategorys()
})

const loadBlogs =async () => {
    if(page != 0){}
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
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

const add = async () => {
    let res = await axios.post("/blog/_token/add", { title:addArticle.title , content:addArticle.content ,categoryId:addArticle.categoryId })
    if (res.data.code == 200) {
        message.info(res.data.message)
    } else {
        message.error(res.data.msg)
    }
}

const toPage = async (pageNum) => {
    pageInfo.page = pageNum
    loadBlogs()
}

const toUpdate = async (blog) => {
    tabValue.value = "update"
    let res = await axios.get("/blog/detail?id="+blog.id)
    console.log(res.data.rows);
    updateArticle.id = res.data.rows[0].id
    updateArticle.title = res.data.rows[0].title
    updateArticle.content= res.data.rows[0].content
    updateArticle.categoryId = res.data.rows[0].category_id
}

const Update = async () => {
    let res = await axios.put("/blog/_token/update",updateArticle)
    if (res.data.code == 200) {
        message.info('修改成功')
        tabValue.value = 'list'
        loadBlogs()
    } else {
        message.error(res.data.msg)
    }
}

const toDelete = async (blog) =>{
    let res = await axios.delete('/blog/_token/delete?id='+blog.id)
    if (res.data.code == 200) {
        message.info(res.data.message)
        loadBlogs()
    } else {
        message.error(res.data.msg)
    }
}
</script>

<style lang="scss" scoped>
.card-tabs .n-tabs-nav--bar-type {
    padding-left: 4px;
}

.page{
    display: flex;
}

.pageItem{
    margin: 10px;
    width: 20px;
    height: 20px;
    text-align: center;
}
</style>