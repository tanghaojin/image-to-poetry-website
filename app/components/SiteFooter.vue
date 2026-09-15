<template>
  <footer class="site-footer">
    <div class="container-wide footer-main">
      <div class="footer-brand">
        <h2>
          <NuxtLink :to="localePath('/')">{{ t('common.brand') }}</NuxtLink>
          <img class="footer-stamp" :src="assetPath('images/hero/seal-poetry-mood.webp')" :alt="t('common.stampAlt')">
        </h2>
        <p>{{ t('footer.tagline') }}</p>
      </div>
      <nav :aria-label="t('common.siteNav')">
        <NuxtLink :to="homeLink('examples')">{{ t('nav.examples') }}</NuxtLink>
        <NuxtLink :to="homeLink('how-it-works')">{{ t('nav.how') }}</NuxtLink>
        <NuxtLink :to="homeLink('about')">{{ t('nav.about') }}</NuxtLink>
        <NuxtLink :to="homeLink('faq')">{{ t('nav.faq') }}</NuxtLink>
      </nav>
      <nav :aria-label="t('common.legalNav')">
        <NuxtLink :to="localePath('/privacy-policy')">{{ t('nav.privacy') }}</NuxtLink>
        <NuxtLink :to="localePath('/terms-of-service')">{{ t('nav.terms') }}</NuxtLink>
      </nav>
    </div>
    <div class="container-wide copyright">© 2026 {{ t('common.brand') }}</div>
  </footer>
</template>

<script setup lang="ts">
const assetPath = usePublicAsset()
const { t } = useI18n()
const localePath = useLocalePath()
const homeLink = (anchor: string) => `${localePath('/')}#${anchor}`
</script>

<style scoped>
.site-footer { padding: 42px 0 22px; color: #eee6da; background: #201e1b; }
.footer-main { display: grid; grid-template-columns: 1.25fr 1fr .55fr; gap: 55px; align-items: start; }
.footer-brand h2 { display: flex; align-items: center; gap: 10px; margin: 0; font: 600 30px var(--serif); }
.footer-stamp { width: 25px; height: 34px; object-fit: contain; }
.footer-brand p { color: #aaa196; }
.footer-main nav { display: flex; flex-wrap: wrap; gap: 22px 30px; padding-top: 10px; font: 14px var(--serif); }
.footer-main nav a { transition: color .2s ease; }
.footer-main nav a:hover { color: #ef765d; }
.copyright { margin-top: 30px; padding-top: 18px; border-top: 1px solid rgba(244,240,231,.22); color: #8f877e; font-size: 12px; }
@media (max-width: 800px) {
  .footer-main { grid-template-columns: 1fr; gap: 20px; }
  .footer-main nav { padding-top: 0; }
}
@media (max-width: 520px) { .site-footer { padding-top: 36px; } }
</style>
