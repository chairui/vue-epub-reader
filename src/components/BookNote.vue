<template>
  <el-drawer
    v-model="drawer"
    :show-close="false"
    :with-header="false"
    direction="rtl"
    :size="440"
    class="reader-drawer"
    :style="readerDrawerStyle"
  >
    <div class="toc-wapper">
      <h1 class="reader-note-title">笔记</h1>
      <el-scrollbar :height="scrollbarHeight">
        <ul v-loading="loading" class="toc">
          <template v-for="item in noteResult" :key="item.cfiRange">
            <li @click="handleSetLocation(item.cfiRange)">
              <el-text v-html="item.text"></el-text>
            </li>
          </template>
        </ul>
      </el-scrollbar>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import bus from "../utils/bus";
import { NoteResult } from "../api/book-types";
import getDrawerNewPosition from "../utils/position";

const drawer = ref(false);
const noteResult = ref(<NoteResult[]>[]);
const loading = ref(false);
const readerDrawerStyle = ref("");
const scrollbarHeight = ref("");

const props = defineProps({
  note: {
    type: Array<NoteResult>,
    required: true,
  },
});

const show = () => {
  const pos = getDrawerNewPosition();
  // fix el-drawer position
  readerDrawerStyle.value = `height:${pos.height}px; top:${pos.top}px; left:${pos.left}px`;
  // fix el-scrollbar height
  scrollbarHeight.value = pos.height - 100 + "px";
  // show drawer
  drawer.value = true;
};

const handleSetLocation = (href: string) => {
  bus.emit("reader-set-location", {
    href: href,
  });
  drawer.value = false;
};

onMounted(() => {
  props.note.forEach((m) => {
    noteResult.value.push(m);
  });
  bus.on("reader-new-note", (data: any) => {
    noteResult.value.push(data.note);
  });
  bus.on("reader-init-file", (data: any) => {
    // reset note list
    noteResult.value = <NoteResult[]>[];
  });
});

onUnmounted(() => {
  bus.off("reader-new-note");
  bus.off("reader-init-file");
});

defineExpose({
  show,
});
</script>
