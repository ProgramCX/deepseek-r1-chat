import {defineStore} from 'pinia'
export interface chatMessage{
    role: "user" | "assistant" | "system",
    content: string,
}
export const useMessageStore=defineStore("messageStore",{
    state:()=>({
        messages: [] as chatMessage[],
        currentRoleId: 0 // 设置一个默认值
    }),
    actions:{
        addMessage(message: chatMessage){
            this.messages.push(message)
        },
        clearMessages(){
            this.messages=[]
        }
    },
    persist: true,
});
