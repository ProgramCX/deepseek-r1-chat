import { useMessageStore } from "../store/MessageStore";
import { getPrompt } from "../prompts";

// TypeScript 类型定义
export async function sendDeepseekMessage(
  content: string,
  controller: AbortController,
  roleIndex: number = 0,
  onUpdate?: (updatedText: string) => void // 回调函数，接收流式数据
): Promise<{ message: string }> {
  const signal = controller.signal;
  const messageStore = useMessageStore();
  const rolePrompt = getPrompt(roleIndex);
  // 组合 prompt
  const prompt = `
    系统提示词（非用户输入）：
    ${rolePrompt}
    请注意，数学公式请用 LaTeX 格式输入。
    以下是与用户的对话历史（非用户输入）：
    ${messageStore.messages
      .map(
        (item) => (item.role === "user" ? "用户：" : "助手：") + item.content
      )
      .join("\n\n")}

    现在，请回答用户的最新问题：
  `;

  // 只保留最近 10 条对话
  if (messageStore.messages.length > 10) {
    messageStore.messages = messageStore.messages.slice(-10);
  }

  messageStore.addMessage({ role: "user", content });

  try {
    const response = await fetch("/api/chat", {
      signal,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
      body: JSON.stringify({ message: prompt + content }),
    });

    if (!response.body) throw new Error("出现了抽象的错误");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let assistantMessage = "";
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";  // 保留最后一行未完整的数据

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;
          if (trimmedLine.startsWith("data:")) {
            try {
              const parsed = JSON.parse(trimmedLine.substring(5));
              const chunck = parsed.completion;
              assistantMessage += chunck;
              if (onUpdate) onUpdate(assistantMessage); // 更新流式数据
            } catch (error) {
              console.error("JSON解析错误:", error);
            }
          }
        }
      }
    }


    messageStore.addMessage({ role: "assistant", content: assistantMessage });
    return { message: assistantMessage };
  } catch (err: any) {
    const errorMessage =
      err.name === "AbortError"
        ? "请求已取消"
        : "请求失败，请稍后再试。（可能由于大模型输出字数较多、输出时间较长导致网络超时，后续版本的输出方式将会改为流式输出。您可以先清空对话，如果清空对话后发送简单的问题仍然遇到此情况，请点击右上角“反馈/日志”进行反馈。对您使用造成的不便请您谅解。）";

    messageStore.addMessage({ role: "assistant", content: errorMessage });
    return { message: errorMessage };
  }
}

// 停止当前请求
export function stopDeepseekMessage(controller: AbortController) {
  controller.abort();
}
