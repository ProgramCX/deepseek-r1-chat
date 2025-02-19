<template>
  <el-header class="header">
    <div class="title">
      <div class="userImg">
        <img src="../assets/icon/image.png" alt="" />
      </div>
      DeepSeek-R1 Chat
    </div>
    <el-link type="primary" @Click="showAbout">关于本网站</el-link>
  </el-header>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus';
const showAbout = () => {
  ElMessageBox.alert(['本网站向安徽理工大学所有师生提供免费的稳定的 Deepseek R1 对话服务。', 
  '后端开发：王子涵',
    "前端开发：程旭"
  ].join("<br/>"),
    '关于本网站', {
    confirmButtonText: '确定',
    type: 'info',
    dangerouslyUseHTMLString: true
  });
};
</script>

<style>
.header {
  padding-left: 10px;
  padding-right: 30px;
  width: 99vw;
  top: 0;
  left: 0;
  height: 70px;
  background-color: rgb(244, 244, 244, 0.5);
  box-shadow: 0px 2px 11px 0px rgba(100, 100, 111, 0.2);
  backdrop-filter: blur(10px);
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: rgb(86, 84, 84);
  padding-left: 5px;

  display: flex;
  justify-content: flex-start;
  gap: 20px;
  flex-direction: row;
  align-items: center;
}

.userImg {
  top: 0;
  /* background-color: #f50b0b; */
  height: 40px;
  width: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.userImg img {
  height: 100%;
  width: 100%;
}
</style>