<template>
  <section id="examples" class="deferred-section examples-section">
    <div class="container-wide">
      <span class="section-kicker">{{ t('home.examples.kicker') }}</span>
      <div class="section-heading">
        <div>
          <h2 class="display-title">{{ t('home.examples.title') }}</h2>
          <p>{{ t('home.examples.text') }}</p>
        </div>
        <small>{{ t('home.examples.hint') }}</small>
      </div>

      <div class="gallery">
        <article class="work work-main">
          <span class="work-number">01</span>
          <div class="work-image sunset" :class="{ original: activeOriginal === 0 }">
            <img :src="assetPath('images/examples/sunset-river-960.webp')" width="960" height="1440" loading="lazy" decoding="async" :alt="t('home.examples.sunsetAlt')">
            <div class="horizontal-verse">
              <strong>一道残阳铺水中，<br>半江瑟瑟半江红。</strong>
              <span>唐 · 白居易《暮江吟》</span>
            </div>
          </div>
          <button type="button" :aria-pressed="activeOriginal === 0" @click="toggleOriginal(0)"><Icon :name="activeOriginal === 0 ? 'heroicons:sparkles' : 'heroicons:magnifying-glass'" /> {{ activeOriginal === 0 ? t('home.examples.viewPoem') : t('home.examples.viewOriginal') }}</button>
        </article>

        <article class="work work-winter">
          <span class="work-number">02</span>
          <div class="work-image" :class="{ original: activeOriginal === 1 }">
            <img :src="assetPath('images/examples/winter-boat-960.webp')" width="960" height="518" loading="lazy" decoding="async" :alt="t('home.examples.winterAlt')">
            <div class="vertical-verse"><strong>孤舟蓑笠翁，<br>独钓寒江雪。</strong><span>唐 · 柳宗元《江雪》</span></div>
          </div>
          <button type="button" :aria-pressed="activeOriginal === 1" @click="toggleOriginal(1)"><Icon :name="activeOriginal === 1 ? 'heroicons:sparkles' : 'heroicons:magnifying-glass'" /> {{ activeOriginal === 1 ? t('home.examples.viewPoem') : t('home.examples.viewOriginal') }}</button>
        </article>

        <article class="work work-peach">
          <span class="work-number">03</span>
          <div class="work-image peach-frame" :class="{ original: activeOriginal === 2 }">
            <img :src="assetPath('images/examples/mountain-peach-blossom-960.webp')" width="960" height="1278" loading="lazy" decoding="async" :alt="t('home.examples.peachAlt')">
            <div class="peach-verse"><strong>人间四月芳菲尽，<br>山寺桃花始盛开。</strong><span>唐 · 白居易《大林寺桃花》</span></div>
          </div>
          <button type="button" :aria-pressed="activeOriginal === 2" @click="toggleOriginal(2)"><Icon :name="activeOriginal === 2 ? 'heroicons:sparkles' : 'heroicons:magnifying-glass'" /> {{ activeOriginal === 2 ? t('home.examples.viewPoem') : t('home.examples.viewOriginal') }}</button>
        </article>
      </div>
      <a class="example-cta" href="#top">{{ t('home.examples.cta') }} <span>→</span></a>
    </div>
  </section>
</template>

<script setup lang="ts">
const assetPath = usePublicAsset()
const { t } = useI18n()
const activeOriginal = ref<number | null>(null)

function toggleOriginal(index: number) {
  activeOriginal.value = activeOriginal.value === index ? null : index
}
</script>

<style scoped>
.examples-section { padding: 56px 0 112px; background: rgba(255,252,245,.42); }
.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 30px; margin: 20px 0 42px; }
.section-heading h2 { font-size: clamp(38px, 4.5vw, 64px); }.section-heading p { margin: 16px 0 0; color: var(--muted); font-family: var(--serif); }.section-heading small { color: var(--muted); }
.gallery { display: grid; grid-template-columns: .85fr 1.4fr; grid-template-rows: auto auto; gap: 20px 28px; }
.work { position: relative; padding-left: 42px; }.work-main { grid-row: 1 / 3; }.work-number { position: absolute; top: 0; left: 0; font-family: var(--serif); }
.work-image { position: relative; overflow: hidden; border: 1px solid var(--line); background: var(--paper-deep); }.work-image img { width: 100%; height: 100%; object-fit: cover; }.work-main .work-image { aspect-ratio: 2 / 3; }.work-winter .work-image { aspect-ratio: 1.85 / 1; }.work-peach .work-image { display: grid; grid-template-columns: 1.5fr .7fr; aspect-ratio: 2.2 / 1; padding: 10px; background: #f8f3e9; }.work-peach img { object-position: 50% 42%; }
.horizontal-verse { position: absolute; inset: auto 0 0; padding: 25% 28px 28px; color: #fff9ee; background: linear-gradient(transparent, rgba(15,12,9,.78)); font-family: var(--serif); transition: opacity .24s ease, transform .24s ease; }.horizontal-verse strong { font-size: clamp(20px, 2vw, 28px); line-height: 1.65; }.horizontal-verse span { display: block; margin-top: 12px; font-size: 12px; }
.vertical-verse { position: absolute; top: 11%; right: 5%; display: flex; flex-direction: row-reverse; gap: 8px; color: #fffaf0; text-shadow: 0 1px 5px rgba(20,24,24,.68); writing-mode: vertical-rl; font-family: var(--serif); transition: opacity .24s ease, transform .24s ease; }.vertical-verse strong { font-size: clamp(17px, 1.7vw, 25px); line-height: 1.5; }.vertical-verse span { font-size: 10px; }
.peach-verse { display: flex; align-items: flex-start; justify-content: center; gap: 12px; padding: 18px 8px; font-family: var(--serif); transition: opacity .24s ease, transform .24s ease; }.peach-verse strong, .peach-verse span { writing-mode: vertical-rl; }.peach-verse strong { font-size: clamp(14px, 1.4vw, 20px); line-height: 1.55; }.peach-verse span { color: var(--muted); font-size: 9px; }
.work-image.original .horizontal-verse, .work-image.original .vertical-verse, .work-image.original .peach-verse { opacity: 0; pointer-events: none; transform: translateY(8px); }
.work button { display: flex; align-items: center; gap: 6px; margin-top: 10px; border: 0; padding: 4px 0; color: var(--muted); background: transparent; cursor: pointer; transition: color .2s ease, transform .2s ease; }
.work button:hover { color: var(--cinnabar); transform: translateX(3px); }
.example-cta { display: flex; justify-content: center; gap: 12px; margin-top: 34px; color: var(--cinnabar); font-family: var(--serif); }
@media (max-width: 800px) { .examples-section { padding: 80px 0; }.section-heading { display: block; }.section-heading small { display: block; margin-top: 10px; }.gallery { grid-template-columns: 1fr; grid-template-rows: auto; }.work-main { grid-row: auto; }.work { padding-left: 32px; }.work-main .work-image { max-height: 620px; }.work-peach .work-image { aspect-ratio: 1.35/1; } }
@media (max-width: 520px) { .work-main .work-image { aspect-ratio: 3/4; }.horizontal-verse { padding: 28% 20px 20px; }.work-winter .vertical-verse strong { font-size: 13px; }.work-peach .work-image { grid-template-columns: 1.25fr .75fr; }.section-heading h2 { font-size: 38px; } }
</style>
