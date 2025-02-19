<template>
  <el-header class="header">
    <div class="title">
      <div class="userImg">
        <img src="../assets/icon/image.png" alt="" />
      </div>
      DeepSeek-R1 Chat
    </div>
    <div class="title">
      <el-link type="primary" @Click="handelUpdateLog">日志/反馈</el-link>
    <el-link type="primary" @Click="showAbout">关于</el-link>
    </div>
  </el-header>
  <el-drawer
    title="反馈/日志"
    v-model="drawerVisible"
    size="fit-content"
       :append-to-body="true" 
       :modal-append-to-body="false">
       <h2>反馈：</h2>
       <iframe width="100%" height="500px" src="https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__mHHsEJUNzNYVU04Q0ZGVThFTjdUOTQyMEY4U1FGWi4u&embed=true" frameborder="0" marginwidth="0" marginheight="0" style="border: none; max-width:100%; max-height:100vh" allowfullscreen webkitallowfullscreen mozallowfullscreen msallowfullscreen> </iframe>
       <h2>更新日志：</h2>
       <MarkDown :content="log" :finished="true"/>
    </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import MarkDown from './MarkDown.vue';
const showAbout = () => {
  ElMessageBox.alert(['本网站向安徽理工大学所有师生提供免费稳定的 Deepseek R1 对话服务。', 
  '后端开发：王子涵',
    "前端开发：程旭"
  ].join("<br/>"),
    '关于本网站', {
    confirmButtonText: '确定',
    type: 'info',
    dangerouslyUseHTMLString: true
  });
};

const drawerVisible = ref(false);
const handelUpdateLog=()=>{
  drawerVisible.value=true;
}
const log = ref('');
fetch('https://raw.githubusercontent.com/ProgramCX/deepseek-r1-chat/refs/heads/main/doc/CHANGELOG.md')
  .then(response => response.text())
  .then(data => {
    log.value = data;
  }).catch(() => {
    log.value = '由于网络因素，更新日志加载失败。还请刷新试试。';
  });
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

#drawer {
  width: 50vw;
}
@media screen and (max-width: 768px) {
  .title {
    font-size: 15px;
  }
  .userImg {
    height: 30px;
    width: 30px;
  }
  .userImg img {
    height: 100%;
    width: 100%;
  }
  #drawer {
    width: 90vw;
  }
}
</style>