<template>
  <div class="option-row">
    <span>{{ label }}</span>
    <div>
      <button
        v-for="item in items"
        :key="item"
        type="button"
        :class="{ selected: item === modelValue }"
        :aria-pressed="item === modelValue"
        @click="emit('update:modelValue', item)"
      >{{ item }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string, items: string[], modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<style scoped>
.option-row { display: grid; grid-template-columns: 64px 1fr; align-items: center; gap: 10px; margin-top: 10px; font-size: 13px; }
.option-row > div { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
button { min-height: 34px; border: 1px solid var(--line); border-radius: 5px; background: transparent; cursor: pointer; }
button.selected { border-color: var(--cinnabar); color: var(--cinnabar); box-shadow: inset 0 -2px var(--cinnabar); }
</style>
