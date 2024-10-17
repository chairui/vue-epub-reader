<template>
  <el-row :gutter="10">
    <el-col :xs="0" :sm="1" :md="2" :lg="1" :xl="1"> </el-col>
    <el-col :xs="24" :sm="22" :md="20" :lg="22" :xl="22">
      <BookHeader :title="book.title" />
    </el-col>
    <el-col :xs="0" :sm="1" :md="2" :lg="1" :xl="1"> </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :xs="0" :sm="1" :md="2" :lg="1" :xl="1"> </el-col>
    <el-col :xs="24" :sm="22" :md="20" :lg="22" :xl="22">
      <EpubReader ref="epubReaderRef" @on-book-ready="handleBookReady" />
    </el-col>
    <el-col :xs="0" :sm="1" :md="2" :lg="1" :xl="1">
      <BookRightMenu />
    </el-col>
  </el-row>
  <BookToc ref="bookTocRef" :toc="book.toc" />
  <BookNote ref="bookNoteRef" :note="note" />
  <BookFont ref="bookFontRef" />
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import BookHeader from "../../components/BookHeader.vue";
import BookToc from "../../components/BookToc.vue";
import BookNote from "../../components/BookNote.vue";
import BookFont from "../../components/BookFont.vue";
import BookRightMenu from "../../components/BookRightMenu.vue";
import EpubReader from "../../components/EpubReader.vue";
import { BookInfo, NoteResult } from "../../api/book-types";
import bus from "../../utils/bus";

const epubReaderRef = ref();
const bookTocRef = ref();
const bookNoteRef = ref();
const bookFontRef = ref();

const note = ref(<NoteResult[]>[]);
const book: BookInfo = reactive({
  title: "",
  toc: [],
});

const handleBookReady = (bookInfo: BookInfo) => {
  book.title = bookInfo.title;
  book.toc = bookInfo.toc;
};

onMounted(() => {
  epubReaderRef.value.initBook("/demo.epub");
  bus.on("reader-open-doc", () => {
    bookTocRef.value.show();
  });

  bus.on("reader-open-note", () => {
    bookNoteRef.value.show();
  });

  bus.on("reader-open-font", () => {
    bookFontRef.value.show();
  });
});

onUnmounted(() => {
  bus.off("reader-open-doc");
  bus.off("reader-open-note");
  bus.off("reader-open-font");
});
</script>
