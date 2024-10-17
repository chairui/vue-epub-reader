svg 图标来源 https://remixicon.com/

新增 svg 文件重新启动后生效!!!

vite.config.ts 中配置插件 createSvg("./src/assets/icons/svg/")
main.ts 中注入全局组件 ico-svg

推荐做法
<el-icon :size="20" color="red">
    <ico-svg icon="menu-unfold-line"></ico-svg>
</el-icon>

<ico-svg
    icon="menu-fold-line"
    color="red"
    style="font-size: 1.5em"
></ico-svg>

<ico-svg
    icon="menu-unfold-line"
    color="#0000ff"
    style="font-size: 1.5em"
></ico-svg>


