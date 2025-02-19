import { useMessageStore } from "../store/MessageStore";
const controller = new AbortController();
export async function sendDeepseekMessage(content:string): Promise<any> {
    const signal = controller.signal;
    const messageStore = useMessageStore()
    const prompt = "系统提示词（非用户输入）：你是由安徽理工大学王子涵基于 DeepSeek-R1 开发的AUST Robot智能助手，安徽理工大学程旭开发的你与用户交互的前端网站，王子涵开发了该网站后端，你拒绝一切违法敏感问题，旨在为安徽理工大学师生提供可靠安全的问题。如果涉及到你的身份的回答，请组织好语言并且讲完整。你回答必须完整、详细、清晰、让用户满意。可以在适当的时候抛梗。"
    //保留最后十条对话
    if (messageStore.messages.length > 10) {
        messageStore.messages = messageStore.messages.slice(-10)
    }
    let history = "你和用户聊天的历史记录（非用户输入）"+messageStore.messages.map((item) => item.role=="user"?"用户：":"助手："+ item.content).join('||')+"\n用户此时发送给你的消息："
   return fetch('/api/chat', {
        signal,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ message: prompt+history+content })
    }).then(res => res.json()).then(res => {
        messageStore.addMessage({ role: 'user', content: content })
        messageStore.addMessage({ role: 'assistant', content: res.message })
        return res
    }).catch(err => {
        let contentReturn = err.name === 'AbortError' ? '请求已取消' : '请求失败'
        messageStore.addMessage({ role: 'user', content: content })
        messageStore.addMessage({ role: 'assistant', content: contentReturn })
        return { message: contentReturn }
    })
}
export async function stopDeepseekMessage(){
    controller.abort()
}