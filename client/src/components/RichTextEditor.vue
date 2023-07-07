<template>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>
    {{}}
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, reactive, inject, onMounted, shallowRef, onBeforeUnmount } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const server_url = inject("server_url")
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
//删除上传视频的接口
const toolbarConfig = {excludeKeys:["uploadVideo"]};
const editorConfig = { placeholder: '请输入内容...' };
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
    base64LimitSize:10*1024,//10kb
    server:server_url+'/upload/rich_editor_upload',
}
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc:(src)=>{
        if(src.indexOf('http') !==0){
            return `${server_url}${src}`
        }
        return src
    }
}
const mode = ref("default")
const valueHtml = ref("")

const props = defineProps({
   modelValue:{
        type:String,
        default:""
   } 
})

const emit = defineEmits(["update:model-value"])
let initFinished =false

onMounted(()=>{
    setTimeout(()=>{
        valueHtml.value = props.modelValue;
        initFinished = true;
    },10);
})

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
    console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {

    emit("update:model-value",valueHtml.value)
};


</script>

<style lang="scss" scoped></style>