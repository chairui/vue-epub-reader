<template>
  <div id="reader-wrapper" class="reader-wrapper" v-loading="state.loading">
    <div class="reader-toc-title">
      {{ state.tocTitle }}
    </div>
    <div ref="viewer"></div>
    <div class="reader-page-button" v-if="!state.loading">
      <el-button :icon="ArrowLeft" @click="prevPage" round
        >上一页&nbsp;</el-button
      >
      <el-button @click="nextPage" round
        >&nbsp;下一页<el-icon class="el-icon--right"><ArrowRight /></el-icon
      ></el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, nextTick } from "vue";
import ePub, { Book, Rendition, NavItem } from "epubjs";
import { RenditionOptions } from "epubjs/types/rendition";
import bus from "../utils/bus";
import _ from "lodash";
import { BookInfo } from "../api/book-types";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useDark, useToggle } from "@vueuse/core";
import { useReaderStore } from "../stores/reader-store";

const readerStore = useReaderStore();
const isDark = useDark();
const toggleDark = useToggle(isDark);
let book: null | Book = null,
  rendition: null | Rendition = null;
const viewer = ref<HTMLDivElement | null>(null);

const state = reactive({
  loading: false,
  contentWindow: null,
  // web 网页模式，默认宽高
  defaultWidth: 600,
  defaultHeight: 400,
  // 高度差，上面标题和下面页脚空白区域的高度和
  readerHeightDiff: 210,
  title: "",
  // 章节标题
  tocTitle: "",
  // 全部章对象
  toc: <Book["navigation"]["toc"]>[],
  // 当前章的当前页数
  page: "",
  // 当前章的总页数
  total: 0,
  // 当前章的页码信息
  label: "",
  // 字体大小，默认100%
  fontSize: 100,
  // 当前阅读进度 数值类型
  current: 0,
  // 当前阅读位置 cfi
  currentLocation: "",
  // 上次阅读位置 cfi
  lastLocation: "",
  // 选中的内容
  selections: <SELECTIONS[]>[],
  // 搜索关键字
  searchValue: "",
  // 默认字体
  fontFamily: "宋体",
  // web 前端可使用字体列表
  fontAvailable: Array<String>(),
});

let defaultTheme = {
  image: {
    border: "1px solid #ccc",
  },
  a: {
    color: "#1b88ee",
  },
  p: {
    "font-family": "inherit",
    "line-height": "160%",
    "margin-top": "15px",
    "margin-bottom": "15px",
  },
};

interface SELECTIONS {
  text: string;
  cfiRange: string;
}

const emit = defineEmits<{
  (event: "on-book-ready", bookInfo: BookInfo): void;
}>();

const setFontSize = (val: number) => {
  state.fontSize = val;
  rendition?.themes.fontSize(`${state.fontSize}%`);
};

const setFontFamily = (value: any) => {
  if (rendition) {
    state.fontFamily = value;
    defaultTheme.p["font-family"] = `${state.fontFamily}`;
    rendition.themes.register("default", defaultTheme);
    rendition.themes.select("default");
  }
};

const handleWindowResize = (e: Event) => {
  if (rendition) {
    state.loading = true;
    const debouncedFunction = _.debounce(() => {
      let width = state.defaultWidth;
      let height = state.defaultHeight;
      if (viewer.value) {
        width = viewer.value.clientWidth;
        height = document.documentElement.clientHeight;
        height = height - state.readerHeightDiff;
      }
      rendition?.resize(width, height);
      state.loading = false;
    }, 1000);
    debouncedFunction();
  }
};

const handleWindowKeyup = (event: any) => {
  let kc = event.keyCode || event.which;
  if (kc == 37 || kc == 38) prevPage();
  if (kc == 39 || kc == 40) nextPage();
};

onMounted(() => {
  nextTick(() => {
    // 还原 element-puls 黑暗模式
    if (isDark.value) {
      updateTheme("dark");
    } else {
      updateTheme("light");
    }
  });
  window.addEventListener("resize", handleWindowResize);
  window.addEventListener("keyup", handleWindowKeyup);

  bus.on("reader-change-light", (data: any) => {
    if (data.light) {
      updateTheme("light");
      if (isDark.value) {
        toggleDark();
      }
    } else {
      updateTheme("dark");
      if (!isDark.value) {
        toggleDark();
      }
    }
  });

  bus.on("reader-set-location", (data: any) => {
    setLocation(data.href);
  });

  bus.on("reader-search-value", (data: any) => {
    handleSearch(data.searchValue);
  });

  bus.on("reader-set-font-size", (data: any) => {
    setFontSize(data.fontSize);
  });

  bus.on("reader-set-font-family", (data: any) => {
    setFontFamily(data.fontFamily);
  });

  bus.on("reader-init-file", (data: any) => {
    if (window.FileReader) {
      state.loading = true;
      var reader = new FileReader();
      reader.onloadend = (e) => initBook(reader.result);
      reader.readAsArrayBuffer(data.file);
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", handleWindowResize);
  window.removeEventListener("keyup", handleWindowKeyup);
  bus.off("reader-change-light");
  bus.off("reader-set-location");
  bus.off("reader-search-value");
  bus.off("reader-set-font-size");
  bus.off("reader-set-font-family");
  bus.off("reader-init-file");
});

const initBook = (urlOrData: any) => {
  state.loading = true;
  try {
    // resize 时，频繁销毁报错
    if (book) book.destroy();
  } catch (e) {}
  book = null;
  book = ePub(urlOrData as "string | ArrayBuffer", {});

  let width = state.defaultWidth;
  let height = state.defaultHeight;
  if (viewer.value) {
    width = viewer.value.clientWidth;
    height = document.documentElement.clientHeight;
    height = height - state.readerHeightDiff;
  }
  rendition = book.renderTo(
    viewer.value as HTMLDivElement,
    {
      width: width,
      height: height,
      method: "continuous",
      allowScriptedContent: true,
    } as RenditionOptions
  );

  // 自定义模版
  rendition.themes.register("default", defaultTheme);
  rendition.themes.select("default");
  // 选中高亮
  rendition.themes.default({
    "::selection": {
      background: "orange",
    },
  });

  rendition.on("selected", setRenderSelection);
  rendition.on("locationChanged", onLocationChange);
  rendition.on("rendered", (e: Event, iframe: any) => {
    // 必须有这段代码，否则键盘事件无法绑定，每次翻页都会触发
    iframe?.iframe?.contentWindow.focus();
    state.contentWindow = iframe?.iframe?.contentWindow;
  });
  rendition.on("keyup", (event: any) => {
    handleWindowKeyup(event);
  });

  // Disable context menu
  rendition.hooks.content.register((contents: any) => {
    const body = contents.window.document.querySelector("body");
    if (body) {
      body.oncontextmenu = () => {
        return false;
      };
    }
  });

  // 还原字体
  setFontFamily(readerStore.fontFamily);
  // 还原字体大小
  setFontSize(readerStore.fontSize);

  const displayed = rendition.display();
  book.ready
    .then(() => {
      console.log("book.ready1");

      book?.loaded.metadata.then(async (metadata) => {
        console.log("metadata", metadata);
        const cover = await book?.coverUrl();
        const information = { ...metadata, cover };
        state.title = information.title;

        const bookInfo: BookInfo = {
          title: state.title,
          toc: state.toc,
        };
        emit("on-book-ready", bookInfo);
      });

      state.loading = false;
      // 使用进度条必须初始化，初始化 0 和 1600 没区别
      // Load all of sections in the book to generate locations
      return book?.locations.generate(1600);
    })
    .then((locations) => {
      displayed.then(function () {
        var currentLocation = rendition?.currentLocation();
        if (currentLocation && currentLocation.cfi) {
          const currentPage = book?.locations.percentageFromCfi(
            currentLocation.cfi
          );
          if (currentPage) {
            state.current = currentPage;
          }
        }
      });
    });

  // 导航对象
  book.loaded.navigation.then(({ toc: _toc }) => {
    state.toc = _toc;
  });
};

const setRenderSelection = (cfiRange: string, contents: any) => {
  if (rendition) {
    const text = rendition.getRange(cfiRange).toString();
    // 点击图片也会触发，并且没有返回文字
    if (text && text.trim().length > 0) {
      bus.emit("reader-new-note", {
        note: {
          text: text,
          cfiRange,
        },
      });
      rendition.annotations.add("highlight", cfiRange, {}, () => {}, "hl", {
        "mix-blend-mode": "multiply",
      });
    }
  }
  // 取消浏览器默认选中样式
  contents.window.getSelection().removeAllRanges();
};

const updateTheme = (theme: string) => {
  if (rendition) {
    const themes = rendition.themes;
    switch (theme) {
      case "dark": {
        themes.override("color", "#d0d3d8");
        themes.override("background", "#1c1c1d");
        break;
      }
      case "light": {
        themes.override("color", "#0d141e");
        themes.override("background", "#fff");
        break;
      }
    }
  }
};

// https://github.com/futurepress/epub.js/wiki/Tips-and-Tricks-%28v0.3%29
const handleSearch = (searchValue: string) => {
  if (searchValue.length == 0) {
    return;
  }
  Promise.all(
    // @ts-ignore
    book?.spine.spineItems.map((section: any) =>
      section
        .load(book?.load.bind(book))
        .then(section.find.bind(section, searchValue))
        .finally(section.unload.bind(section))
    )
  ).then((results) => {
    const results1 = [].concat.apply([], results);
    bus.emit("reader-search-result", { searchResult: results1 });
  });

  rendition?.annotations.highlight(searchValue);
};

const nextPage = () => {
  rendition?.next().then(() => {});
};

const prevPage = () => {
  rendition?.prev();
};

const getLabel = (toc: Book["navigation"]["toc"], href: string) => {
  let label = "n/a";
  toc.some((item: NavItem) => {
    if (item.subitems && item.subitems.length > 0) {
      const subChapter = getLabel(item.subitems, href);
      if (subChapter !== "n/a") {
        label = subChapter;
        return true;
      }
    } else if (item.href.includes(href)) {
      label = item.label;
      return true;
    }
  });
  return label;
};

const onLocationChange = (epubcifi: Rendition["location"]) => {
  // 监听翻页
  if (book && epubcifi && rendition) {
    const { displayed, href, cfi } = rendition?.location.start;
    state.currentLocation = cfi;
    state.label = getLabel(state.toc, href);
    let tocTitle = getLabel(state.toc, href);
    if (tocTitle != "n/a") {
      state.tocTitle = tocTitle.trim();
    }
    state.total = displayed.total;
    state.page = `${displayed.page}/${displayed.total} ${state.label}`;
    console.log("onLocationChange", state.currentLocation);
  }
};

const setLocation = async (href: number | string) => {
  if (rendition) {
    if (typeof href === "string") {
      await rendition.display(href);
      await rendition.display(href);
    }
    if (typeof href === "number") {
      await rendition.display(href);
      await rendition.display(href);
    }
  }
};

defineExpose({
  initBook,
});
</script>
