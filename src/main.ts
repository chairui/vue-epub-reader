import { createApp } from "vue";
import "./style.scss";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import icoSvg from "./assets/icons/index.vue";
import "element-plus/theme-chalk/dark/css-vars.css";
import { createPinia } from "pinia";
import App from "./App.vue";

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(ElementPlus);
app.component("ico-svg", icoSvg);
app.mount("#app");
