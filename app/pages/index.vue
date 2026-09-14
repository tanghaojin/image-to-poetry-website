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
const siteUrl = 'https://imagetopoetry.com/'
const title = '见景寻诗｜上传照片智能匹配真实古典诗词并生成高清诗意海报的免费在线图片配诗创作工具'
const description = '上传一张照片，找到最贴近画面意境的真实古典诗词，并生成保持原图比例的高清诗意海报。'
const socialImage = 'https://imagetopoetry.com/images/examples/sunset-river.jpg'

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

useHead({
  link: [
    { rel: 'canonical', href: siteUrl }
  ]
})
</script>
