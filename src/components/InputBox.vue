<template>
    <div class="input-box">
        <div class="image-area">
            <ImageComponent v-for="image in imageFiles" v-bind:key="image" :src="image" @cancel="handleCancel" />
        </div>
        <el-input @keyup.enter="onKeyup" style="width: 100%;" :autosize="{ minRows: 8, maxRows: 16 }" type="textarea"
            v-model="text"></el-input>
        <div class="button-area">
            <!-- <el-button @click="upload" :disabled="!outputDone">上传图片</el-button> -->
            <el-button @click="clear" type="danger">清空对话</el-button>
            <div class="right-button">
                <el-button type="primary" :disabled="imageFiles.length === 0 && text === '' || !outputDone"
                    @click="onSend">发送</el-button>
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
const props = defineProps<{
    outputDone: Boolean,
}>();

const emit = defineEmits(['send', 'stop']);
const text = ref('');
const clear = () => {
    messageStore.messages = [];
    window.location.reload();
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
    const message = { text: text.value, image: imageFiles.value }
    emit('send', message);
    text.value = ''
    imageFiles.value = []
}

const onStop = () => {
    emit('stop');
}

const onKeyup = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.ctrlKey) {
        if ((imageFiles.value.length > 0 || text.value !== '') && outputDone.value) {
            onSend(); // 发送消息
        }
    }
}
</script>
<style scoped>
div /deep/.el-input__inner {
  background-color: transparent !important;
  border: 1px solid #1296db;
}
.input-box {
    border-radius: 20px;
    min-width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 14px 0px rgba(100, 100, 111, 0.2);
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
    background-color: transparent;
}

.button-area {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
}

.button-area .right-button {
    display: flex;
    justify-content: flex-start;
}

@media screen and (max-width: 600px) {
    .input-box {
        min-width: 300px;

    }

    .text-area {
        width: 200px;

    }


}
</style>