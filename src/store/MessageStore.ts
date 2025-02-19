import {defineStore} from 'pinia'
export interface chatMessage{
    role: "user" | "assistant" | "system",
    content: string,
}
export const useMessageStore=defineStore("messageStore",{
    state:()=>({
        messages: [] as chatMessage[],
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