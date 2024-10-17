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
      <div class="toc-search">
        <el-input
          v-model="searchValue"
          :style="searchCancel ? 'width: 310px' : 'width: 390px'"
          placeholder="搜索"
          :prefix-icon="Search"
          :maxlength="30"
          size="large"
          clearable
          @input="handleSearchValueChange"
        />
        <span
          v-if="searchCancel"
          class="toc-search-cancel"
          @click="
            () => {
              searchValue = '';
              searchCancel = false;
            }
          "
          >取消</span
        >
      </div>
      <el-scrollbar :height="scrollbarHeight">
        <!-- 目录 -->
        <ul v-if="!searchCancel" class="toc">
          <template v-for="item in props.toc" :key="item.id">
            <li @click="handleSetLocation(item.href)">
              <el-text>{{ item.label }}</el-text>
            </li>
            <template v-if="item.subitems">
              <li
                v-for="subitem in item.subitems"
                :key="subitem.id"
                class="sub-list-item"
                @click="handleSetLocation(subitem.href)"
              >
                <el-text>{{ subitem.label }}</el-text>
              </li>
            </template>
          </template>
        </ul>

        <!-- 查询结果 -->
        <ul v-if="searchCancel" v-loading="loading" class="toc">
          <template v-for="item in searchResult" :key="item.cfi">
            <li @click="handleSetLocation(item.cfi)">
              <el-text v-html="item.excerpt"></el-text>
            </li>
          </template></ul
      ></el-scrollbar>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { NavItem } from "epubjs";
import bus from "../utils/bus";
import { Search } from "@element-plus/icons-vue";
import _ from "lodash";
import { SearchResult } from "../api/book-types";
import getDrawerNewPosition from "../utils/position";

const drawer = ref(false);
const searchValue = ref("");
const searchCancel = ref(false);
const searchResult = ref(<SearchResult[]>[]);
const loading = ref(false);
const readerDrawerStyle = ref("");
const scrollbarHeight = ref("");

const props = defineProps({
  toc: {
    type: Array<NavItem>,
    required: true,
  },
});

const show = () => {
  const pos = getDrawerNewPosition();
  // fix el-drawer position
  readerDrawerStyle.value = `height:${pos.height}px; top:${pos.top}px; left:${pos.left}px`;
  // fix el-scrollbar height
  scrollbarHeight.value = pos.height - 120 + "px";
  // show drawer
  drawer.value = true;
};

const handleSetLocation = (href: string) => {
  bus.emit("reader-set-location", {
    href: href,
  });
  drawer.value = false;
};

const handleSearchValueChange = () => {
  if (searchValue.value != "") {
    searchCancel.value = true;
    searchResult.value = [];
    if (searchValue.value.length > 1) {
      // 至少2个字符触发搜索，防抖函数
      loading.value = true;
      const debouncedFunction = _.debounce((url: string) => {
        bus.emit("reader-search-value", {
          searchValue: searchValue.value,
        });
      }, 1000);
      debouncedFunction("/demo2.epub");
    }
  } else {
    searchCancel.value = false;
  }
};

onMounted(() => {
  bus.on("reader-search-result", (data: any) => {
    const searchList = data.searchResult.map((item: SearchResult) => {
      item.excerpt = item.excerpt.replace(
        searchValue.value,
        `<span class="toc-search-text">${searchValue.value}</span>`
      );
      return item;
    });
    loading.value = false;
    searchResult.value = searchList;
  });
});

onUnmounted(() => {
  bus.off("reader-search-result");
});

defineExpose({
  show,
});
</script>
