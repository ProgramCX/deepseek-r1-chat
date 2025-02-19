<template>
    <div class="bubble-wrapper">
        <img :src="avatarSrc" :class="['avatar', roleType]" />
        <div class="bubble" :class="roleType">
            <div class="editor" v-if="isEditMode">
                <el-input id="input-edit" v-if="isEditMode" v-model="data" cols="58" rows="20" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
                <div class="buttons">
                    <el-button @click="isEditMode = false; data = oldData">取消</el-button>
                    <el-button type="primary" @click="edited">发送</el-button>
                </div>
            </div>
            <MarkDown :content="data" :finished="outputFinished" v-else />
        </div>
        <div class="tool-buttons" v-if="outputFinished" :class="roleType">
            <el-tooltip content="复制" placement="top" v-if="!isEditMode">
                <el-button circle @click="copyText"><el-icon>
                        <CopyDocument />
                    </el-icon></el-button>
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
import { computed, defineProps, watch } from 'vue';
import { ref } from 'vue';
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

watch(() =>useMessageStore().messages, () => {
    // 判断是否是当前对话
    //if(useMessageStore().messages.length -1  === props.id) {
    if(useMessageStore().messages.length === props.id) {
        isCurrent.value = true;
    } else {
        isCurrent.value = false;
    }
}, { immediate: true });

// 复制文本
const copyText = () => {
    navigator.clipboard.writeText(data.value).then(() => {
        ElMessage.success('复制成功');
    });
};

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
    console.log(isCurrent.value);
    if(isCurrent.value)
        outputFinished.value = props.finished;
    else
        outputFinished.value = true;
}, { immediate: true });

watch(() => isCurrent, () => {
    if(isCurrent.value)
        outputFinished.value = props.finished;
    else
        outputFinished.value = true;
}, { immediate: true });

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
    background-color: rgb(243, 243, 243);
    overflow-x: auto;
    box-shadow: 0px 0px 14px 0px rgba(100, 100, 111, 0.2);
    cursor: progress;
}

.bubble:hover {
    box-shadow: none;
}

.bubble-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px 60px;
    gap: 20px;
    background-color: #fff;
    box-shadow: none;
    width: 100%;
}

.user {
    align-self: flex-end;
}

.assistant {
    align-self: flex-start;
}

.editor {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    width: 100%;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
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
    }
    .bubble-wrapper {
        padding-left: 0px;
        padding-right: 0px;
    }
}
</style>