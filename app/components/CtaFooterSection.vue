<template>
  <section class="closing-section">
    <div class="closing-main">
      <div class="container-wide closing-grid">
        <div class="closing-copy">
          <span class="section-kicker">{{ t('home.cta.kicker') }}</span>
          <h2 class="display-title">{{ t('home.cta.title1') }}<br>{{ t('home.cta.title2') }}</h2>
          <p>{{ t('home.cta.text') }}</p>
          <a class="primary-button" href="#top">{{ t('home.cta.button') }}</a>
          <small>{{ t('home.cta.note') }}</small>
        </div>
        <figure>
          <img :src="assetPath('images/examples/sunset-river.webp')" :alt="t('home.cta.imageAlt')">
          <blockquote>一道残阳铺水中，<br>半江瑟瑟半江红。</blockquote>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const assetPath = usePublicAsset()
const { t } = useI18n()
</script>

<style scoped>
.closing-main { overflow: hidden; padding-top: 90px; }.closing-grid { display: grid; grid-template-columns: 1fr .88fr; gap: 40px; align-items: center; }.closing-copy { padding: 55px 0 80px; }.closing-copy h2 { margin-top: 28px; font-size: clamp(54px, 6.5vw, 92px); }.closing-copy p { color: var(--muted); font: 20px/1.8 var(--serif); }.closing-copy .primary-button { display: inline-flex; align-items: center; margin-top: 18px; font: 20px var(--serif); }.closing-copy small { display: block; margin-top: 18px; color: var(--muted); }.closing-grid figure { position: relative; align-self: end; height: 680px; margin: 0; overflow: hidden; border: 10px solid #faf6ee; box-shadow: 0 20px 50px rgba(87,66,42,.15); transform: rotate(1deg); }.closing-grid img { width: 100%; height: 100%; object-fit: cover; }.closing-grid blockquote { position: absolute; top: 54px; right: 32px; margin: 0; color: #fff7ea; font: 20px/2 var(--serif); writing-mode: vertical-rl; }
@media (max-width: 800px) { .closing-main { padding-top: 60px; }.closing-grid { grid-template-columns: 1fr; }.closing-copy { padding-bottom: 25px; }.closing-copy h2 { font-size: 54px; }.closing-grid figure { width: min(100%, 520px); height: 620px; justify-self: center; } }
@media (max-width: 520px) { .closing-copy h2 { font-size: 44px; }.closing-copy .primary-button { width: 100%; justify-content: center; }.closing-grid figure { height: 520px; } }
</style>
