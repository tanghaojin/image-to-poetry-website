<template>
  <section id="about" class="trust-section">
    <div class="container-wide">
      <span class="section-kicker">{{ t('home.trust.kicker') }}</span>
      <h2 class="display-title">{{ t('home.trust.title') }}</h2>
      <p class="lead">{{ t('home.trust.lead') }}</p>

      <div class="trust-grid">
        <article class="archive-sheet">
          <span class="archive-stamp">{{ t('home.trust.verified') }}</span>
          <div class="poem-archive">
            <h3>宿建德江</h3>
            <p>移舟泊烟渚，日暮客愁新。<br>野旷天低树，江清月近人。</p>
            <span>唐 · 孟浩然</span>
          </div>
          <ul><li><b>{{ t('home.trust.proof1Title') }}</b><span>{{ t('home.trust.proof1Text') }}</span></li><li><b>{{ t('home.trust.proof2Title') }}</b><span>{{ t('home.trust.proof2Text') }}</span></li><li><b>{{ t('home.trust.proof3Title') }}</b><span>{{ t('home.trust.proof3Text') }}</span></li></ul>
        </article>

        <article class="privacy-proof">
          <h3>{{ t('home.trust.privacyTitle1') }}<br>{{ t('home.trust.privacyTitle2') }}</h3>
          <p>{{ t('home.trust.privacyText') }}</p>
          <div class="privacy-flow"><span>{{ t('home.trust.flow1') }}</span><i>→</i><span>{{ t('home.trust.flow2') }}</span><i>→</i><span>{{ t('home.trust.flow3') }}</span><i>→</i><span class="deleted">{{ t('home.trust.flow4') }}</span></div>
          <ul><li>{{ t('home.trust.point1') }}</li><li>{{ t('home.trust.point2') }}</li><li>{{ t('home.trust.point3') }}</li></ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped>
.trust-section { padding: 115px 0; }.display-title { max-width: 980px; margin-top: 22px; font-size: clamp(42px, 5vw, 70px); }.lead { max-width: 850px; color: var(--muted); line-height: 1.9; }
.trust-grid { display: grid; grid-template-columns: 1.08fr .92fr; gap: 70px; margin-top: 55px; align-items: center; }.archive-sheet { position: relative; min-height: 440px; border: 1px solid rgba(120,83,55,.25); padding: 54px; background: #eee5d4; box-shadow: 0 18px 50px rgba(87,66,42,.1); transform: rotate(-1deg); }.archive-stamp { position: absolute; top: 38px; right: 42px; padding: 8px 5px; border: 2px solid var(--cinnabar); border-radius: 5px; color: var(--cinnabar); font: 20px/1 var(--serif); writing-mode: vertical-rl; }.poem-archive { display: grid; grid-template-columns: auto 1fr auto; gap: 28px; align-items: start; padding: 34px; border: 1px solid var(--cinnabar); font-family: var(--serif); }.poem-archive h3 { margin: 0; font-size: 29px; writing-mode: vertical-rl; }.poem-archive p { margin: 0; font-size: 22px; line-height: 2.1; writing-mode: vertical-rl; }.poem-archive span { color: var(--muted); writing-mode: vertical-rl; }.archive-sheet ul, .privacy-proof ul { list-style: none; margin: 30px 0 0; padding: 0; }.archive-sheet li { display: grid; grid-template-columns: 100px 1fr; gap: 15px; padding: 10px 0; border-bottom: 1px solid var(--line); }.archive-sheet li span { color: var(--muted); font-size: 13px; }
.privacy-proof { padding-left: 28px; border-left: 1px solid var(--cinnabar); }.privacy-proof h3 { margin: 0; font: 700 clamp(32px, 3.5vw, 50px)/1.35 var(--serif); }.privacy-proof > p { color: var(--muted); line-height: 1.9; }.privacy-flow { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items: center; gap: 8px; margin: 34px 0; padding: 25px 0; border-block: 1px solid var(--line); text-align: center; font: 13px var(--serif); }.privacy-flow i { color: var(--cinnabar); font-style: normal; }.privacy-flow .deleted { color: var(--cinnabar); font-weight: 700; }.privacy-proof ul { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; }.privacy-proof li { position: relative; padding-left: 20px; font-size: 13px; }.privacy-proof li::before { position: absolute; left: 0; width: 10px; height: 10px; border: 1px solid var(--cinnabar); border-radius: 50%; content: ""; }
@media (max-width: 900px) { .trust-section { padding: 80px 0; }.trust-grid { grid-template-columns: 1fr; gap: 50px; }.archive-sheet { transform: none; }.privacy-proof { padding-left: 20px; } }
@media (max-width: 560px) { .display-title { font-size: 38px; }.archive-sheet { min-height: 0; padding: 24px; }.archive-stamp { top: 18px; right: 18px; }.poem-archive { gap: 14px; padding: 20px; }.poem-archive h3 { font-size: 21px; }.poem-archive p { font-size: 16px; }.archive-sheet li { grid-template-columns: 82px 1fr; }.privacy-flow { grid-template-columns: 1fr; }.privacy-flow i { transform: rotate(90deg); }.privacy-proof ul { grid-template-columns: 1fr; } }
</style>
