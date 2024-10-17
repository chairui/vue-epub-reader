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
      <h1 class="reader-note-title">字号大小</h1>
      <div class="reader-font-size-wrapper">
        <el-slider
          v-model="fontSize"
          :show-tooltip="false"
          :min="50"
          :max="200"
          @change="handleFontSizeChange"
        />
      </div>
      <h1 class="reader-note-title">字体</h1>
      <ul class="reader-font-list">
        <template v-for="item in fontAvailable" :key="item">
          <li
            @click="handleSetFontFamily(item)"
            :class="fontFamily === item ? 'reader-font-select' : ''"
          >
            <el-text :style="`fontFamily:${item}`">{{ item }}</el-text>
          </li>
        </template>
      </ul>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import bus from "../utils/bus";
import { useReaderStore } from "../stores/reader-store";
import getDrawerNewPosition from "../utils/position";
const readerStore = useReaderStore();

const drawer = ref(false);
const fontSize = ref(100);
const fontFamily = ref("宋体");
const fontAvailable = ref(<string[]>[]);
const readerDrawerStyle = ref("");

const show = () => {
  const pos = getDrawerNewPosition();
  // fix el-drawer position
  readerDrawerStyle.value = `height:${pos.height}px; top:${pos.top}px; left:${pos.left}px`;
  // show drawer
  drawer.value = true;
};

const handleFontSizeChange = () => {
  bus.emit("reader-set-font-size", {
    fontSize: fontSize.value,
  });
  readerStore.setFontSize(fontSize.value);
};

const handleSetFontFamily = (value: string) => {
  bus.emit("reader-set-font-family", {
    fontFamily: value,
  });
  fontFamily.value = value;
  readerStore.setfontFamily(value);
};

onMounted(() => {
  fontFamily.value = readerStore.fontFamily;
  fontSize.value = readerStore.fontSize;

  // init web font list
  const fontCheck = new Set(["宋体", "仿宋", "楷体", "微软雅黑", "Arial"]);
  document.fonts.ready;
  function isFontAvailable(fontName: string) {
    var canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    var text = "abcdefghijklmnopqrstuvwxyz0123456789";
    if (context) {
      context.font = "72px monospace";
      var baselineSize = context.measureText(text).width;

      context.font = "72px " + fontName + ", monospace";
      var newSize = context.measureText(text).width;
      return newSize !== baselineSize;
    }
    return false;
  }

  const _fontAvailable = new Array();
  for (const font of fontCheck.values()) {
    if (isFontAvailable(`${font}`)) {
      _fontAvailable.push(font);
    }
  }
  fontAvailable.value = _fontAvailable;
});

onUnmounted(() => {
  bus.off("reader-new-note");
});

defineExpose({
  show,
});
</script>
