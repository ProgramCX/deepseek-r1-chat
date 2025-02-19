import { useMessageStore } from "../store/MessageStore";
export async function sendDeepseekMessage(content:string): Promise<any> {
   return fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ message: content })
    }).then(res => res.json()).then(res => {
        const messageStore = useMessageStore()
        messageStore.addMessage({ role: 'user', content: content })
        messageStore.addMessage({ role: 'assistant', content: res.message })
        return res
    }).catch(err => {
        console.log(err)
    })
}