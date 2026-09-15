<template>
  <div ref="rootRef" class="locale-switcher">
    <button
      class="locale-trigger"
      type="button"
      :aria-label="t('language.label')"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="open = !open"
    >
      <Icon name="heroicons:language" size="17" />
      <span>{{ compact ? currentLocale.short : currentLocale.name }}</span>
      <Icon class="locale-chevron" :class="{ open }" name="heroicons:chevron-down" size="14" />
    </button>

    <Transition name="locale-menu">
      <div v-if="open" class="locale-menu" role="listbox" :aria-label="t('language.label')">
        <button
          v-for="item in locales"
          :key="item.code"
          type="button"
          role="option"
          :aria-selected="locale === item.code"
          :class="{ active: locale === item.code }"
          @click="selectLocale(item.code)"
        >
          <span>{{ item.name }}</span>
          <Icon v-if="locale === item.code" name="heroicons:check" size="16" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const { t, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)

const locales = [
  { code: 'zh-CN', name: '简体中文', short: '简' },
  { code: 'zh-TW', name: '繁體中文', short: '繁' },
  { code: 'en', name: 'English', short: 'EN' }
] as const

const compact = computed(() => props.compact)
const currentLocale = computed(() => locales.find(item => item.code === locale.value) || locales[0])

async function selectLocale(code: typeof locales[number]['code']) {
  open.value = false
  if (code !== locale.value) await navigateTo(switchLocalePath(code))
}

function closeOnOutside(event: PointerEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) open.value = false
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', closeOnOutside, true)
  document.addEventListener('keydown', closeOnEscape)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', closeOnOutside, true)
  document.removeEventListener('keydown', closeOnEscape)
})
</script>

<style scoped>
.locale-switcher { position: relative; flex: 0 0 auto; }
.locale-trigger { display: inline-flex; height: 38px; align-items: center; justify-content: center; gap: 7px; border: 1px solid var(--line); border-radius: 6px; padding: 0 11px; color: var(--ink); background: rgba(255,252,245,.72); font: 13px var(--serif); cursor: pointer; transition: border-color .2s ease, background .2s ease, color .2s ease; }
.locale-trigger:hover { border-color: rgba(181,72,54,.5); color: var(--cinnabar); background: #fffaf2; }
.locale-chevron { transition: transform .2s ease; }.locale-chevron.open { transform: rotate(180deg); }
.locale-menu { position: absolute; z-index: 100; top: calc(100% + 9px); right: 0; width: 154px; overflow: hidden; border: 1px solid var(--line); border-radius: 8px; padding: 5px; background: color-mix(in srgb, var(--paper) 96%, white); box-shadow: 0 16px 38px rgba(60,45,30,.14); backdrop-filter: blur(14px); }
.locale-menu button { display: flex; width: 100%; align-items: center; justify-content: space-between; border: 0; border-radius: 5px; padding: 10px 11px; color: var(--ink); background: transparent; font: 13px var(--serif); text-align: left; cursor: pointer; }
.locale-menu button:hover { color: var(--cinnabar); background: rgba(181,72,54,.07); }.locale-menu button.active { color: var(--cinnabar); font-weight: 700; }
.locale-menu-enter-active,.locale-menu-leave-active { transition: opacity .16s ease, transform .16s ease; transform-origin: top right; }.locale-menu-enter-from,.locale-menu-leave-to { opacity: 0; transform: translateY(-5px) scale(.97); }
@media (max-width: 767px) { .locale-trigger { width: 42px; padding: 0; }.locale-trigger :deep(.locale-chevron) { display: none; }.locale-menu { right: 0; } }
</style>
