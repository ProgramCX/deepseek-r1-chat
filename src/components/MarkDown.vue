<template>
    <div class="markdown-body" v-html="data"></div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from "vue";
import { marked, type Token, type Tokens } from "marked";
import MathJax from "../util/MathJax";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import ClipboardJS from "clipboard";
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
    },
});

// 解析 Markdown
const updateData = async () => {
    let content = props.content.replace(/<think>([\s\S]*?)<\/think>/g, '<blockquote>$1</blockquote>').replace(/\[([\s\S]*?)\]/g, '\\\[$1\\]').replace(/\(([\s\S]*?)\)/g, '\\\($1\\)');
    if (!outputFinished.value) {
        content += '⚫';
    }
    data.value = await marked(content);
    nextTick(() => {
      if (MathJax.isMathjaxConfig) { // 是否配置MathJax
            MathJax.initMathjaxConfig()
          }
    MathJax.MathQueue('markdown-body');
        new ClipboardJS("#copy-btn", {
            target: (trigger) => trigger.previousElementSibling,
        }).on("success", (e) => {
            e.trigger.textContent = "已复制";
            setTimeout(() => (e.trigger.textContent = "复制"), 1000);
            e.clearSelection();
        });
    });
};

setInterval(() => {
    const thinkElements = document.querySelectorAll("blockquote");
    //如果标签为空，则隐藏
    thinkElements.forEach((thinkElement:Element) => {
        if (thinkElement.textContent=='\n\n') {
            thinkElement.style.display = "none";
        }
    });

    const thinkElements2 = document.querySelectorAll("think");
    //如果标签为空，则隐藏
    thinkElements2.forEach((thinkElement:Element) => {
        if (thinkElement.textContent=='\n\n') {
            thinkElement.style.display = "none";
        }
    });
}, 100);

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
  padding-top: 35px;
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
  color:grey
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

think{
  margin-block-start: 5px;
  margin-block-end: 5px;
  margin-inline-start: 10px;
  margin-inline-end: 0;
  padding: 5px 5px 5px 15px;
  border-radius: 0 10px 10px 0;
  background-color: #4a4a4a14;
  border-left: 3px solid #2983cc;
}

blockquote:empty{
  display: none;
}

think:empty{
  display: none;
}

@media screen and (max-width: 768px) {
  .markdown-body pre code.hljs{
  left: 0;
   max-width: 90vw;
  }
  
}
</style>
