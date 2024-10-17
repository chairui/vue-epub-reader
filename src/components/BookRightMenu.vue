<template>
  <div class="reader-right-menu-wrapper">
    <el-space direction="vertical" :size="20">
      <el-icon
        title="目录"
        class="reader-right-button"
        :size="20"
        @click="handleOpenDoc"
      >
        <ico-svg icon="menu-line"></ico-svg>
      </el-icon>

      <el-icon
        title="笔记"
        class="reader-right-button"
        :size="20"
        @click="handleOpenMark"
      >
        <ico-svg icon="quill-pen-line"></ico-svg>
      </el-icon>

      <el-icon
        title="字体"
        class="reader-right-button"
        :size="20"
        @click="handleOpenConfig"
      >
        <ico-svg icon="font-family"></ico-svg>
      </el-icon>

      <el-icon
        title="深色"
        class="reader-right-button"
        :size="20"
        v-if="light"
        @click="handleChangeLight"
      >
        <ico-svg icon="moon-line"></ico-svg>
      </el-icon>

      <el-icon
        title="浅色"
        class="reader-right-button"
        :size="20"
        v-if="!light"
        @click="handleChangeLight"
      >
        <ico-svg icon="sun-line"></ico-svg>
      </el-icon>
    </el-space>
  </div>
</template>
<script setup lang="ts">
import { useDark } from "@vueuse/core";
const isDark = useDark();
import { onMounted, ref } from "vue";
import bus from "../utils/bus";

const light = ref(true);

const handleOpenDoc = () => {
  bus.emit("reader-open-doc");
};

const handleOpenMark = () => {
  bus.emit("reader-open-note");
};

const handleOpenConfig = () => {
  bus.emit("reader-open-font");
};

const handleChangeLight = () => {
  light.value = !light.value;
  bus.emit("reader-change-light", { light: light.value });
};

onMounted(() => {
  light.value = !isDark.value;
});
</script>
