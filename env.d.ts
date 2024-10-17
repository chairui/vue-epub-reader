/// <reference types="vite/client" />

// fix main.ts Cannot find module './App.vue' or its corresponding type declarations.
declare module "*.vue" {
  import { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 如果不声明，在使用 element-plus 组件时，例如 ElMessage("this is a message.") 会报错
// This expression is not callable.
//   Not all constituents of type 'SFCWithInstall<Required<NotifyPartial>>' are callable.
//     Type 'Required<NotifyPartial> & { install: PluginInstallFunction; }' has no call signatures.
declare module "element-plus";

declare module "mockjs";
