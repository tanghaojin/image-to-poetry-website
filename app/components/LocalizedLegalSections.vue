<template>
  <section v-for="section in sections" :key="section.title">
    <h2>{{ section.title }}</h2>
    <template v-for="(block, index) in section.blocks" :key="index">
      <h3 v-if="block.type === 'heading'">{{ block.text }}</h3>
      <p v-else-if="block.type === 'paragraph'">{{ block.text }}</p>
      <ul v-else-if="block.type === 'list'">
        <li v-for="item in block.items" :key="item">{{ item }}</li>
      </ul>
      <div v-else-if="block.type === 'notice'" class="legal-notice"><p>{{ block.text }}</p></div>
      <p v-else-if="block.type === 'privacy-link'">
        {{ block.before }}<NuxtLink :to="localePath('/privacy-policy')">{{ t('nav.privacy') }}</NuxtLink>{{ block.after }}
      </p>
      <p v-else-if="block.type === 'contact'">
        {{ block.before }}<a href="mailto:tangjinhaodashagua@gmail.com">tangjinhaodashagua@gmail.com</a>{{ block.middle }}<a href="https://github.com/tanghaojin" target="_blank" rel="noopener noreferrer">{{ block.linkLabel }}</a>{{ block.after }}
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
type RawBlock = { type: string, text?: unknown, items?: unknown[], before?: unknown, middle?: unknown, linkLabel?: unknown, after?: unknown }
type RawSection = { title: unknown, blocks: RawBlock[] }

const props = defineProps<{ messageKey: string }>()
const { t, tm, rt } = useI18n()
const localePath = useLocalePath()
const resolve = (value: unknown) => typeof value === 'string' ? value : value ? rt(value as never) : ''

const sections = computed(() => {
  const raw = tm(props.messageKey) as RawSection[]
  if (!Array.isArray(raw)) return []
  return raw.map(section => ({
    title: resolve(section.title),
    blocks: (section.blocks || []).map(block => ({
      type: block.type,
      text: resolve(block.text),
      items: (block.items || []).map(resolve),
      before: resolve(block.before),
      middle: resolve(block.middle),
      linkLabel: resolve(block.linkLabel),
      after: resolve(block.after)
    }))
  }))
})
</script>
