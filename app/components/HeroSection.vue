<template>
  <section id="top" class="hero-section ink-landscape" :class="{ 'creator-active': creatorActive }">
    <img v-show="!creatorActive" class="hero-ink hero-ink-left" :src="assetPath('images/hero/ink-landscape-left.png')" alt="" aria-hidden="true">
    <img v-show="!creatorActive" class="hero-ink hero-ink-right" :src="assetPath('images/hero/ink-mountains-right.png')" alt="" aria-hidden="true">

    <div class="container-wide hero-stage">
      <div v-show="!creatorActive" class="hero-copy">
        <span class="section-kicker">免费图片配诗工具</span>
        <h1 class="display-title">为你眼中的风景，<br>寻一句千年前的回响</h1>
        <p class="hero-subtitle">上传一张照片，找到最贴近画面意境的真实古典诗词。</p>
        <p class="hero-trust">真实诗词出处 <i /> 免费使用 <i /> 无需登录</p>
        <div class="side-note" aria-hidden="true">
          <img :src="assetPath('images/hero/seal-brand.png')" alt="">
          <span>山河入镜<br>诗意自来</span>
        </div>
      </div>
      <PoetryCreator @active-change="creatorActive = $event" />
    </div>

  </section>
</template>

<script setup lang="ts">
const assetPath = usePublicAsset()
const creatorActive = ref(false)
</script>

<style scoped>
.hero-section { position: relative; min-height: clamp(660px, 68vh, 720px); overflow: hidden; padding: clamp(46px, 4vw, 64px) 0 34px; }
.hero-section::before { position: absolute; z-index: 0; top: 22px; right: 5.8%; width: 94px; height: 94px; content: ""; border-radius: 50%; opacity: .13; background: var(--cinnabar); }
.hero-section::after { display: none; }
.hero-stage { position: relative; z-index: 2; display: grid; width: min(1520px, calc(100% - 80px)); grid-template-columns: minmax(660px, 1.04fr) minmax(0, .96fr); align-items: center; gap: clamp(34px, 3vw, 48px); }
.hero-stage :deep(.creator-shell) { width: 100%; margin: 0; }
.hero-copy { position: relative; z-index: 1; padding-bottom: 18px; }
.display-title { max-width: 720px; margin-top: 24px; font-size: clamp(56px, 4vw, 68px); }
.hero-subtitle { margin: 25px 0 0; color: var(--muted); font: 19px/1.8 var(--serif); }
.hero-trust { display: flex; align-items: center; gap: 13px; margin: 18px 0 0; color: var(--muted); font-size: 14px; letter-spacing: .08em; }
.hero-trust i { width: 3px; height: 3px; border-radius: 50%; background: var(--cinnabar); }
.side-note { display: flex; align-items: center; gap: 20px; margin-top: 46px; color: var(--muted); font: 14px/1.9 var(--serif); letter-spacing: .15em; }
.side-note::before { width: 2px; height: 66px; content: ""; background: var(--cinnabar); }
.side-note img { width: 52px; height: 52px; object-fit: contain; }
.hero-ink { position: absolute; z-index: 0; pointer-events: none; user-select: none; }
.hero-ink-left { bottom: -78px; left: 0; width: min(68vw, 1250px); opacity: .5; }
.hero-ink-right { top: 34px; right: -4%; width: min(50vw, 900px); opacity: .38; }
.hero-section.creator-active { min-height: calc(100dvh - 68px); padding-top: 44px; }
.hero-section.creator-active .hero-stage { display: block; }
@media (max-width: 767px) {
  .hero-section { min-height: calc(100dvh - 60px); padding: 42px 0 58px; }
  .hero-section::before { width: 70px; height: 70px; top: 22px; }
  .hero-stage { display: block; width: min(100% - 32px, 680px); }
  .hero-copy { margin-bottom: 30px; padding-bottom: 0; }
  .display-title { margin-top: 19px; font-size: clamp(34px, 9vw, 42px); line-height: 1.16; }
  .hero-subtitle { margin-top: 18px; font-size: 16px; line-height: 1.75; }
  .hero-trust { gap: 8px; font-size: 12px; letter-spacing: 0; }
  .side-note { display: none; }
  .hero-ink-left { width: 105vw; opacity: .25; }
  .hero-ink-right { top: 10px; right: -38%; width: 110vw; opacity: .22; }
  .hero-section.creator-active { min-height: calc(100dvh - 60px); padding-top: 24px; }
}
@media (min-width: 768px) and (max-width: 1120px) {
  .hero-section { min-height: 720px; }
  .hero-stage { width: min(100% - 48px, 1040px); }
  .hero-stage { grid-template-columns: minmax(0, .9fr) minmax(460px, 1.1fr); gap: 30px; }
  .display-title { font-size: clamp(44px, 5vw, 58px); }
  .hero-subtitle { font-size: 17px; }
}
@media (min-width: 1121px) and (max-width: 1600px) {
  .hero-stage { width: calc(100% - 160px); }
}
</style>
