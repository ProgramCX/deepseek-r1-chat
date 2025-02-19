<template>
    <div class="image-component" v-if="show">
        <img :src="src" height="50px" class="image"/>
        <el-button circle size="small" class="cancel" @click="cancel"><template #icon><el-icon><Close /></el-icon></template></el-button>
    </div>
</template>
<script setup lang="ts">
import { defineProps, watch, ref } from 'vue';
const props = defineProps<{
    src: string;
}>(); 
let src = props.src;
let emit = defineEmits(['cancel']);

watch(() => props.src, () => {
    src = props.src;
});
const show = ref(true);
const cancel = () => {
    emit('cancel', src);
    src = '';
    show.value = false;
};
</script>
<style scoped>
.image-component {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 10px;
}
.image {
    border-radius: 5px;
    position: relative;
}
.image-component .cancel {
    position: relative;
    top: -8px;
    left: -8px;
}
</style>