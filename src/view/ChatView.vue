<template>
    <div class="chat-view" :class="{ 'init-chat-view': isInitChatView }">
        <h1 v-if="isInitChatView">有什么我们可以帮你的吗？</h1>
        <div v-else class="chat-container">
            <BubbleComponent v-for="(message, index) in messages" :content-text="message.content" :type="message.role"
                :id="index" :finished="outputDone" @refresh="handleRefresh" @edited="handleEdited" class="bubble" />
        </div>
        <div class="chat-input" :class="{ 'fixed-bottom': !isInitChatView }">
            <InputBox :output-done="outputDone" @send="handleSend" @stop="handleStop" class="input-box" />
        </div>

    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useMessageStore, type chatMessage } from '../store/MessageStore.ts';
import BubbleComponent from '../components/BubbleComponent.vue';
import InputBox from '../components/InputBox.vue';
import { sendDeepseekMessage } from '../api/index.ts';

const messageStore = useMessageStore();
const messages = ref([] as chatMessage[]);

const outputDone = ref(true);
const isInitChatView = ref(true);
onMounted(() => {
    messages.value = [...messageStore.messages];
    if(messages.value.length > 0) {
        isInitChatView.value = false;
    }
    window.scrollTo(0, document.body.scrollHeight);
});

const handleRefresh = (id: number) => {
    const text = messageStore.messages[id - 1].content;
    sendModifiedMessage(text, id - 1);
}

const sendModifiedMessage = (text: string, id: number) => {
    messageStore.messages.splice(id, messageStore.messages.length - id);
    console.log(messageStore.messages);

    const newMessages = [...messageStore.messages];

    messages.value = newMessages;

    messages.value.push({
        role: 'user',
        content: text,
    });

    messages.value.push({
        role: 'assistant',
        content: '',
    });

    outputDone.value = false;


    sendDeepseekMessage(text).then((data) => {
        messages.value[messages.value.length - 1].content = data.message;
        outputDone.value = true;
        window.scrollTo(0, document.body.scrollHeight);
        if(data.message){
            isInitChatView.value = false;
        }
    });
}

const handleEdited = (content: string, id: number) => {
    sendModifiedMessage(content, id);
}

const handleSend = (message: { text: string, image: string[] }) => {
    outputDone.value = false;
    messages.value.push({
        role: 'user',
        content: message.text,
    });

    messages.value.push({
        role: 'assistant',
        content: '正在思考请稍后...',
    });
    outputDone.value = false;

    console.log(message.text);

    sendDeepseekMessage(message.text).then((data) => {
        console.log(data.message);
        messages.value[messages.value.length - 1].content = data.message;
        console.log(messages.value);
        outputDone.value = true;
        window.scrollTo(0, document.body.scrollHeight);
        if(data.message){
            isInitChatView.value = false;
        }
    });
}

const handleStop = () => {
    outputDone.value = true;
}




</script>
<style scoped>
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
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px;
    background-color: rbg(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    --webkit-backdrop-filter: blur(10px);
}


.input-box {
    width: 80%;
}

.init-chat-view {
    align-items: center;
}

.bubble {
    width: 100%;
}

.fixed-bottom {
    position: sticky;
    bottom: 0;
}
</style>