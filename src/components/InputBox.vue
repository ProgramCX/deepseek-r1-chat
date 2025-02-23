<template>
    <div class="input-box">
        <div class="image-area">
            <ImageComponent v-for="image in imageFiles" v-bind:key="image" :src="image" @cancel="handleCancel" />
        </div>
        <el-input placeholder="给 DeepSeek 发送消息，按 Shift + Enter 键换行" @keydown.enter="onKeydown" style="width: 100%" :autosize="{ minRows: 6, maxRows: 14 }" resize="none"
            type="textarea" v-model="text"></el-input>
        <div class="button-area">
            <!-- <el-button @click="upload" :disabled="!outputDone">上传图片</el-button> -->
            <div class="left">
                <el-button @click="clear" type="danger">清空对话</el-button>
                <el-select @change="handleChange"  v-model="roleId" placeholder="请选择角色" width="fit-content"  class="role-select">
                    <el-option :label="role" :value="index" v-for="(role, index) in roles" :key="role"></el-option>
                </el-select>
            </div>

            <div class="right-button">
                <el-button color="#2D90E0" :disabled="imageFiles.length === 0 && text.trim() === '' || !outputDone"
                  v-if="outputDone"  @click="onSend">发送</el-button>
                <el-button type="danger" @click="onStop" v-if="!outputDone">停止</el-button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMessageStore } from '../store/MessageStore';
const messageStore = useMessageStore();
import ImageComponent from './ImageComponent.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {roles as exRoles} from '../prompts';
const props = defineProps<{
    outputDone: Boolean,
    defaultRoleId: Number
}>();

const emit = defineEmits(['send', 'stop']);
const text = ref('');

const roles = ref(exRoles);

const roleId = ref(props.defaultRoleId);

const clear = () => {
    ElMessageBox.confirm('确定要清空对话吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        messageStore.messages = [];
        window.location.reload();
    }).catch(() => {
        ElMessage.info('已取消清空对话');
    });
}
const outputDone = ref(props.outputDone);

watch(() => props.outputDone, () => {
    outputDone.value = props.outputDone;
})

const imageFiles = ref([]);

const handleFileChange = (event: Event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            imageFiles.value.push(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }
}

const upload = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = "image/*";
    inputElement.multiple = true;
    inputElement.style.display = "none";
    inputElement.addEventListener('change', handleFileChange);
    inputElement.click();
}

const handleCancel = (src: string) => {
    imageFiles.value = imageFiles.value.filter((item) => item != src);
}

const onSend = () => {
    const message = { text: text.value, roleId: roleId.value, imageFiles: imageFiles.value };
    emit('send', message);
    text.value = ''
    imageFiles.value = []
}

const onStop = () => {
    emit('stop');
}

const onKeydown = (event: KeyboardEvent) => {
    if (event.shiftKey) {
        return;
      }
      onSend();
      event.preventDefault(); 
    
    }

const handleChange = () => {
    useMessageStore().currentRoleId = Number(roleId.value);
    ElMessage.success("已选择”" + roles.value[Number(roleId.value)] + "”角色，如果您发送了消息，将会清空之前的对话。");
}

</script>
<style scoped>
.left {
    display: flex;
    flex-direction: row;
    flex-wrap: auto;
    gap: 10px;
}
div /deep/.el-input__inner {
    border: 1px solid #1296db;
}

.input-box {
    border-radius: 15px;
    min-width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #e3e3e3;
}

.image-area {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    padding: 10px;
}

.text-area {
    width: 200px;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    border-radius: 0.25em;
}

.button-area {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    flex-wrap: no-wrap;
    gap: 5px;
}

.button-area .right-button {
    display: flex;
    justify-content: flex-start;
}

.role-select {
    width: 180px;
}
@media screen and (max-width: 768px) {
    .input-box {
        min-width: 90vw;
    }
    .role-select {
    width: 140px;
}
}
</style>