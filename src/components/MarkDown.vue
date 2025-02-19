<template>
    <div class="markdown-body" v-html="data"></div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { marked, type Token, type Tokens } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const props = defineProps<{
    content: string;
    finished: boolean;
}>();
const data = ref("");

const outputFinished = ref(false);
marked.use({
    gfm: true,
    renderer: {
        code(token: Token & { lang?: string; text: string }) {
            const lang = token.lang || "plaintext";
            const validLang = hljs.getLanguage(lang) ? lang : "plaintext";
            const highlighted = hljs.highlight(token.text, { language: validLang }).value;
            return `<pre><div class="wrapper"><code class="hljs">${highlighted}</code><button id="copy-btn">复制</button></div></pre>`;
        },
        // 自定义 HTML 渲染，处理 <think> 标签
    html(html: string) {
      // 捕获并替换 <think> 标签内部的内容，保留文字
      return html.replace(/<think>(.*?)<\/think>/g, (match, content) => {
        return `<blockquote style="color: #3498db; font-weight: bold; background-color: yellow;">${content}</blockquote>`;
      });
    },
    },
});

// 解析 Markdown
const updateData = async () => {
    let content = props.content;
    if (!outputFinished.value) {
        content += '⚫';
    }
    data.value = await marked(content);
    // 等待 DOM 更新后添加事件监听
    nextTick(() => {
        const copyButtons = document.querySelectorAll("#copy-btn");
        copyButtons.forEach((button) => {
            button.addEventListener("click", copyCode);
        });
    });
};

// 复制代码
const copyCode = (event: Event) => {
    const button = event.target as HTMLButtonElement;
    const codeElement = button.previousElementSibling as HTMLElement;
    if (!codeElement) return;

    const codeText = codeElement.innerText;
    navigator.clipboard.writeText(codeText).then(() => {
        button.textContent = "已复制";
        setTimeout(() => (button.textContent = "复制"), 1000);
    });
};

// 监听属性变化，实时更新
watch(() => props.content, updateData, { immediate: true });
watch(() => props.finished, () => {
    outputFinished.value = props.finished;
    updateData();
}, { immediate: true });
</script>

<style scoped>
.markdown-body {
    padding: 16px;
    border-radius: 5px;
    font-size: 14px;
    line-height: 1.6;
    word-wrap: break-word;
    margin: 0;
    padding: 0;
}
</style>
<style>

.wrapper {
    position: relative;
    width: 100%;
    height: fit-content;
}

#copy-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.3s;
    background-color: #ccc;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
}

#copy-btn:hover {
    background-color: #999;
}


.markdown-body pre code.hljs{
  border-radius: 10px;
  width: 100%;
  padding: 20px;
  font-size: 14px;
  border: 2px solid #a0a0a027;
}

.markdown-body pre code.hljs.language-liter{
  white-space: pre-line;
  background-color: #f0ebdcce;
  color: #000;
  font-size: 1.2em;
  font-family: 'Times New Roman', Times, "SimSun", "NSimSun", "STSong", "宋体", serif;
}
.markdown-body .hljs.language-liter::selection,
.markdown-body .hljs.language-liter *::selection{
  background-color: #c7a07230;
  text-decoration: underline #a27f57;
  /* color: #fff; */
}
.markdown-body code.hljs.language-liter .hljs-comment{
  color: #888;
}
.markdown-body code.hljs.language-liter .hljs-title{
  color: #070707;
  font-weight: bold;
  font-size: 1.4em;
  
}
.markdown-body code.hljs.language-liter .hljs-string{
  color: #237bc4;
  
}

.markdown-body a{
  color: #2983cc;
}

.markdown-body a:hover{
  text-decoration: underline;
  filter: brightness(1.2);
}

.markdown-body a:active{
  opacity: 0.7;
}

#body ul, #body ol{
  padding-left: 21px;
}

#body h1, #body h2, #body h3, #body h4, #body h5, #body h6{
  font-weight: 100;
}

#body h1{
  font-size: 2.5em;
}

#body h2{
  font-size: 2em;
}

#body h3{
  font-size: 1.6em;
}

#body h4{
  font-size: 1.3em;
}

#body h5{
  font-size: 1.1em;
}

#body h6{
  font-size: 0.9em;
}

blockquote{
  margin-block-start: 5px;
  margin-block-end: 5px;
  margin-inline-start: 10px;
  margin-inline-end: 0;
  padding: 5px 5px 5px 15px;
  border-radius: 0 10px 10px 0;
  background-color: #a0a0a014;
  border-left: 3px solid #2983cc;
}
blockquote p{
  margin: 2px 0;
}
code.inline{
  background-color: #afafaf35;
  border-radius: 5px;
  padding: 3px 5px;
  font-size: 0.9em;
}

/* 通用表格样式 */
table {
  border-collapse: collapse;
  margin: 10px 0;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); */
}

/* 表头样式 */
thead tr {
  background-color: #2983cc20;
  font-weight: bold;
}

/* 表头单元格样式 */
th, td {
  padding: 12px 15px;
  border: 1px solid #a0a0a070;
  /* border-width: ; */
}

tbody tr:nth-of-type(even) {
  background-color: #a0a0a018;
}
</style>
