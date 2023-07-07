<template>
    <div>
        <div class="login-panel">
            <n-card title="后台管理登录">
                <n-form :rules="rules" :model="admin">
                    <n-form-item path="account" label="账号">
                        <n-input v-model:value="admin.account"  placeholder="请输入账号"></n-input>
                    </n-form-item>
                    <n-form-item path="password" label="密码">
                        <n-input v-model:value="admin.password" type="password" placeholder="请输入密码"></n-input>
                    </n-form-item>
                </n-form>
                <template #footer>
                    <div>
                        <n-checkbox v-model:checked="admin.remeber" label="记住我"></n-checkbox>
                        <n-button @click="login">登录</n-button>
                    </div>
                </template>
            </n-card>
        </div>
    </div>
</template>

<script setup>
import {reactive,ref,inject} from 'vue'
import {AdminStore} from '../stores/AdminStore'

import {useRouter,useRoute} from 'vue-router'
const router = useRouter()
const route = useRoute()


let axios = inject("axios")
const adminStore = AdminStore()
const message = inject("message")




let rules = {
    account: [
        {required:true,message:"请输入账号",trigger:"blur"},
        {min:3,max:12,message:"账号长度在3到12个字符",trigger:"blur"},
    ],
    password: [
        {required:true,message:"请输入密码",trigger:"blur"},
        {min:3,max:12,message:"账号长度在6到18个字符",trigger:"blur"},
    ],
};



const admin = reactive({
    account: localStorage.getItem("account") || "",
    password: localStorage.getItem("password") || "",
    remeber: localStorage.getItem("remeber") || false,
})

let login = async() => {
    let result = await axios.post("/admin/login",{
        account:admin.account,
        password: admin.password
    });
    if(result.data.code == 200){
        adminStore.token = result.data.data.token
        adminStore.account = result.data.data.account
        adminStore.id = result.data.data.id
        console.log("remeber:"+admin.remeber);
        
        if(admin.remeber){
            localStorage.setItem("account",admin.account)
            localStorage.setItem("password",admin.password)
            localStorage.setItem("remeber",admin.remeber?true:false)
        }
        router.push("/dashboard")
        message.info("登录成功"+localStorage.getItem("password"))
        return
    }else{
        message.error('登录失败')
        // localStorage.setItem("password",'123456')
        // let pwd = localStorage.getItem("password")
        // message.error(pwd)
    }
    console.log(result);
}
</script>

<style lang="scss" scoped>
.login-panel {
    width: 500px;
    margin: 0 auto;
    margin-left: 40vw;
    margin-top: 130px;
}
</style>