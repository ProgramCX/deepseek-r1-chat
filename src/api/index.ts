import { useMessageStore } from "../store/MessageStore";
import { getPrompt } from "../prompts";

export async function sendDeepseekMessage(
  content: string,
  controller: AbortController,
  roleIndex: number = 0
): Promise<any> {
  const signal = controller.signal;
  const messageStore = useMessageStore();
  const rolePrompt = getPrompt(roleIndex);

  const prompt = `
    系统提示词（非用户输入）：
    ${rolePrompt}
    请注意。数学公式请用LaTeX格式输入，如：$x = {-b \pm \sqrt{b^2-4ac} \over 2a}$，必须要用$符号包裹起来。
    以下是与用户的对话历史（非用户输入）：
    ${messageStore.messages
      .map((item) =>
        (item.role === "user" ? "用户：" : "助手：" )+ item.content
      )
      .join("\n\n")}

    现在，请回答用户的最新问题：
    `;

  // 保留最后十条对话
  if (messageStore.messages.length > 10) {
    messageStore.messages = messageStore.messages.slice(-10);
  }

  return fetch("/chat", {
    signal,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ message: prompt + content }),
  })
    .then((res) => res.json())
    .then((res) => {
      messageStore.addMessage({ role: "user", content: content });
      messageStore.addMessage({ role: "assistant", content: res.message });
      return res;
    })
    .catch((err) => {
      let contentReturn =
        err.name === "AbortError" ? "请求已取消" : "请求失败，请稍后再试。（可能由于大模型输出字数较多、输出时间较长导致网络超时，后续版本的输出方式将会改为流式输出。您可以先清空对话，如果清空对话后发送简单的问题仍然遇到此情况，请点击右上角“反馈/日志”进行反馈。对您使用造成的不便请您谅解。）";
      messageStore.addMessage({ role: "user", content: content });
      messageStore.addMessage({ role: "assistant", content: contentReturn });
      return { message: contentReturn };
    });
}

// 停止当前请求的函数
export async function stopDeepseekMessage(controller: AbortController) {
  controller.abort();
}
