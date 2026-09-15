<template>
  <LegalPageShell :eyebrow="t('privacy.eyebrow')" :title="t('privacy.title')" :updated="t('legal.updated')">
    <p class="legal-intro">{{ t('privacy.intro') }}</p>
    <LocalizedLegalSections message-key="privacy.sections" />
  </LegalPageShell>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const pageUrl = computed(() => `https://imagetopoetry.com${localePath('/privacy-policy')}`)
const title = computed(() => t('privacy.seo.title'))
const description = computed(() => t('privacy.seo.description'))

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
