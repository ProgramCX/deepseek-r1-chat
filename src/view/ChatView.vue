<template>
    <div class="chat-view" :class="{ 'init-chat-view': isInitChatView }">
        <h1 v-if="isInitChatView" style="text-align: center;" class="bounce">有什么我们可以帮你的吗？</h1>
        <div v-else class="chat-container">
            <BubbleComponent v-for="(message, index) in messages" :content-text="message.content" :type="message.role"
                :id="index" :finished="outputDone" @refresh="handleRefresh" @edited="handleEdited" class="bubble-chat" />
        </div>
        <div class="chat-input" :class="{ 'fixed-bottom': !isInitChatView }">
            <InputBox :output-done="outputDone" @send="handleSend" @stop="handleStop" class="input-box" :class="{'init-chat-input':isInitChatView}" :default-role-id="currentRoleId"/>
        </div>

    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMessageStore, type chatMessage } from '../store/MessageStore.ts';
import BubbleComponent from '../components/BubbleComponent.vue';
import InputBox from '../components/InputBox.vue';
import { sendDeepseekMessage, stopDeepseekMessage } from '../api/index.ts';
const messageStore = useMessageStore();
const messages = ref([] as chatMessage[]);

const outputDone = ref(true);
const isInitChatView = ref(true);

const controller = ref({} as AbortController);

const currentRoleId = ref(useMessageStore().currentRoleId);

onMounted(() => {
    messages.value = [...messageStore.messages];
    if (messages.value.length > 0) {
        isInitChatView.value = false;
    }
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, 1);
});

const handleRefresh = (id: number) => {
    const text = messageStore.messages[id - 1].content;
    sendModifiedMessage(text, id - 1);
}

const sendModifiedMessage = (text: string, id: number) => {
    messageStore.messages.splice(id, messageStore.messages.length - id);
    const newMessages = [...messageStore.messages];

    messages.value = newMessages;

    messages.value.push({
        role: 'user',
        content: text,
    });

    messages.value.push({
        role: 'assistant',
        content: '<img src="https://assets.programcx.cn/index.svg" height="50px" />',
    });

    outputDone.value = false;

    controller.value = new AbortController();
    sendDeepseekMessage(text, controller.value,currentRoleId.value).then((data) => {
        messages.value[messages.value.length - 1].content = data.message;
        outputDone.value = true;
        if (data.message) {
            isInitChatView.value = false;
        }
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
}

const handleEdited = (content: string, id: number) => {
    sendModifiedMessage(content, id);
}

const handleSend = (message: { text: string, roleId: number, image: string[] }) => {
    if(currentRoleId.value != message.roleId) {
        currentRoleId.value = message.roleId;
        messages.value = [];
        messageStore.messages = [];
    }
    isInitChatView.value = false;
    outputDone.value = false;
    messages.value.push({
        role: 'user',
        content: message.text,
    });

    messages.value.push({
        role: 'assistant',
        content: '<img src="https://assets.programcx.cn/index.svg" height="40px" />',
    });
    outputDone.value = false;

    if (controller.value) {
        stopDeepseekMessage(controller.value);
    }
    controller.value = new AbortController();
    sendDeepseekMessage(message.text, controller.value,currentRoleId.value).then((data) => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        messages.value[messages.value.length - 1].content = data.message;
        outputDone.value = true;
        if (data.message) {
            isInitChatView.value = false;
        }
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
}

const handleStop = () => {
    outputDone.value = true;
    stopDeepseekMessage(controller.value);
}

</script>
<style scoped>
.bounce {
    animation: zoomIn 0.5s;
}
.chat-view {
    width: 100%;
    min-height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 100px;
}

.chat-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.chat-input {
    width: 80%;
    height: fit-content;
    display: flex;
    justify-content: center;
    padding: 0 5px;
    background-color: white;
}

.input-box {
    width: 100%;
    height: fit-content;
    animation: fadeInDown;
    animation-duration: 0.5s;
}

.init-chat-view {
    align-items: center;
}

.init-chat-input {
   box-shadow: 0px 1px 11px 0px rgba(100, 100, 111, 0.2);
   animation: fadeInUp;
    animation-duration: 0.5s; 
}

.bubble-chat {
    width: 100%;
}

.fixed-bottom {
    position: sticky;
    bottom: 0;
    width: 100%;
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

@media screen and (max-width: 1000px) {
    .bubble {
        max-width: 800px;
        padding: 10px; 
        word-break: break-word; 
    }
    .bubble-wrapper {
        padding-left: 10px; 
        padding-right: 10px; 
    }
    
}
</style>