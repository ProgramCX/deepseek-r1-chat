<template>
    <div class="bubble-wrapper">
        <img :src="avatarSrc" :class="['avatar', roleType]" />
        <div class="bubble" :class="roleType">
            <div class="editor" v-if="isEditMode">
                <el-input @keydown.enter="onKeydown" id="input-edit" v-if="isEditMode" v-model="data" cols="58" rows="20" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
                <div class="buttons">
                    <el-button @click="isEditMode = false; data = oldData">取消</el-button>
                    <el-button type="primary" @click="edited" :disabled="data.trim().length===0">发送</el-button>
                </div>
            </div>
            <MarkDown :content="data" :finished="outputFinished" v-else />
        </div>
        <div class="tool-buttons" v-if="outputFinished" :class="roleType">
            <el-tooltip content="复制" placement="top" v-if="!isEditMode" >
                <el-button circle :id="`copy-btn-${props.id}`" :data-clipboard-text="data" class="copy-btn">
                    <el-icon>
                        <CopyDocument />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip content="刷新" placement="top" v-if="roleType == 'assistant' && !isEditMode">
                <el-button circle @click="refresh"><el-icon>
                        <Refresh />
                    </el-icon></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" v-if="roleType == 'user' && !isEditMode">
                <el-button circle @click="edit"><el-icon>
                        <Edit />
                    </el-icon></el-button>
            </el-tooltip>
        </div>
    </div>
</template>
<script lang="ts" setup>
import MarkDown from './MarkDown.vue';
import ClipboardJS from 'clipboard';

import { computed, defineProps, nextTick, watch, onMounted, onBeforeUnmount, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useMessageStore } from '../store/MessageStore';

import userAvatar from '../assets/icon/student.png';
import assistantAvatar from '../assets/icon/image.png';
const props = defineProps<{
    contentText: string,
    type: string,
    finished: boolean,
    id: number
}>();
const data = ref('');
const isCurrent = ref(true);

const emit = defineEmits(['refresh', 'edited']);

const isEditMode = ref(false);
const edit = () => {
    isEditMode.value = true;
    oldData.value = data.value;
};

const outputFinished = ref(false);

const oldData = ref('');

const roleType = computed(() => {
    return props.type;
});

const avatarSrc = computed(() => {
    return roleType.value === 'user' ? userAvatar : assistantAvatar;
});
const onKeydown = (event: KeyboardEvent) => {
    if (event.shiftKey) {
        return;
      }
      edited();
      event.preventDefault(); 
    
    }
watch(() =>useMessageStore().messages, () => {
    // 判断是否是当前对话
    //if(useMessageStore().messages.length -1  === props.id) {
    if(useMessageStore().messages.length === props.id) {
        isCurrent.value = true;
    } else {
        isCurrent.value = false;
    }
}, { immediate: true });

const clip = ref<ClipboardJS | null>(null);

onMounted(() => {
    if (!clip.value) {
        clip.value = new ClipboardJS(`#copy-btn-${props.id}`);
        clip.value.on('success', (e) => {
            ElMessage.success('复制成功');
            e.clearSelection();
        });
        clip.value.on('error', () => {
            ElMessage.error('复制失败');
        });
    }
});

onBeforeUnmount(() => {
    clip.value?.destroy();
});

//重新生成
const refresh = () => {
    emit('refresh', props.id);
};

//编辑完成
const edited = () => {
    isEditMode.value = false
    emit('edited', data.value, props.id);
};

watch(() => props.contentText, () => {
    data.value = props.contentText;
}, { immediate: true });

watch(() => props.finished, () => {
    if(props.type === 'user'){
        outputFinished.value = true;
        return;
    }
    if(isCurrent.value)
        outputFinished.value = props.finished;
    else
        outputFinished.value = true;
}, { immediate: true });

watch(() => isCurrent, () => {
    if(props.type === 'user'){
        outputFinished.value = true;
        return;
    }
    if(isCurrent.value)
        outputFinished.value = props.finished;
    else
        outputFinished.value = true;
}, { immediate: true });

nextTick(()=>{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
})

</script>

<style lang="css" scoped>
textarea {
  font-family: inherit;
  font-size: 1em;
  line-height: 1.5;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  border-radius: 0.25em;
  background-color: transparent;
}

.bubble {
    min-width: 50px;
    min-height: 50px;
    width: fit-content;
    height: fit-content;
    border-radius: 20px;
    padding: 5px 15px;
    background-color: rgb(250, 250, 250);
    overflow-x: auto;
    cursor: text;
    border: rgba(230, 230, 230, 0.6) 0.5px solid;

}

.bubble:hover {
    transition: background-color 0.3s;
    background-color: #f8f7f7;
}

.bubble-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px 60px;
    gap: 20px;
    width: 100%;
    overflow-x:hidden;
}


.user {
    align-self: flex-end;
    animation: fadeInRight;
    animation-duration: 500ms;

}

.assistant {
    align-self: flex-start;
    animation: fadeInLeft;
    animation-duration: 500ms;
}

.editor {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    width: 100%;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    background-color: #f9f9f9;
    border: 1px rgb(225,225,225,0.3) solid;
    padding: 10px;
}

.user.avatar {
    align-self: flex-end;
    margin-left: 10px;
}

.assistant.avatar {
    align-self: flex-start;
    margin-right: 10px;
}

::v-deep #input-edit .el-input__inner {
  background-color: yellow !important; 
  color: red !important;
}
@media screen and (max-width: 768px) {
    .bubble {
        max-width: 400px;
        padding: 10px;
        word-break: break-word;
    }
    .bubble-wrapper {
        padding-left: 10px; 
        padding-right: 10px; 
    }
}
</style>