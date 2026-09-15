<template>
  <div>
    <HeroSection />
    <ExamplesSection />
    <HowItWorksSection />
    <TrustPrivacySection />
    <FaqSection />
    <CtaFooterSection />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const siteUrl = computed(() => `https://imagetopoetry.com${route.path === '/' ? '/' : route.path}`)
const title = computed(() => t('seo.home.title'))
const description = computed(() => t('seo.home.description'))
const socialImage = 'https://imagetopoetry.com/images/examples/sunset-river.webp'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: siteUrl,
  ogImage: socialImage,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: socialImage
})

useHead(() => ({
  link: [
    { rel: 'canonical', href: siteUrl.value }
  ]
}))
</script>
