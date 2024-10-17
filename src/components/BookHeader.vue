<template>
  <el-row :gutter="10">
    <el-col :xs="16" :sm="16" :md="15" :lg="14" :xl="14">
      <h1 class="book-title">
        <el-text>{{ props.title }}</el-text>
      </h1>
    </el-col>
    <el-col :xs="8" :sm="8" :md="9" :lg="10" :xl="10">
      <div class="book-top-bar">
        <el-space :size="10">
          <label style="cursor: pointer">
            <el-text>浏览本地 epub 文件</el-text>
            <input
              style="display: none"
              type="file"
              accept=".epub"
              @change="handleLoadLocalFile"
            />
          </label>
          <el-text>|</el-text>
          <el-text>我的书架</el-text>
          <el-text>|</el-text>
          <el-link
            href="https://github.com/chairui/vue-epub-reader"
            :underline="false"
            target="_blank"
            ><el-icon style="cursor: pointer" :size="20">
              <ico-svg icon="github-fill"></ico-svg> </el-icon
          ></el-link>
        </el-space>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import bus from "../utils/bus";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const handleLoadLocalFile = (e: any) => {
  const file = e.target.files[0];
  const { name } = file;
  const title = name.replace(".epub", "");
  bus.emit("reader-init-file", { file: file, title });
};
</script>
