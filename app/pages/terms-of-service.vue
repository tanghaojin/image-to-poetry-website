<template>
  <LegalPageShell :eyebrow="t('terms.eyebrow')" :title="t('terms.title')" :updated="t('legal.updated')">
    <p class="legal-intro">{{ t('terms.intro') }}</p>
    <LocalizedLegalSections message-key="terms.sections" />
  </LegalPageShell>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const pageUrl = computed(() => `https://imagetopoetry.com${localePath('/terms-of-service')}`)
const title = computed(() => t('terms.seo.title'))
const description = computed(() => t('terms.seo.description'))

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: pageUrl,
  twitterCard: 'summary'
})
useHead(() => ({ link: [{ rel: 'canonical', href: `https://imagetopoetry.com${route.path}` }] }))
</script>
