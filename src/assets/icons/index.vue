<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color: color }">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "",
  },
});
const iconName = computed(() => `#icon-${props.icon}`);
const svgClass = computed(() => {
  if (props.icon) return `icon-svg icon-${props.icon}`;
  return "icon-svg";
});
</script>

<style scoped>
.icon-svg {
  fill: currentColor;
  /* vertical-align: middle; */
}
</style>
