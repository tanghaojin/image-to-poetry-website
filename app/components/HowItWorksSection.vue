<template>
  <section id="how-it-works" class="how-section ink-landscape">
    <div class="container-wide">
      <span class="section-kicker">寻诗之路</span>
      <h2 class="display-title">一张照片，一次跨越千年的相遇</h2>
      <p class="intro">从眼前的景，到古人的句，只需四步。</p>

      <div class="journey">
        <div v-for="(step, index) in steps" :key="step.title" class="step">
          <span>0{{ index + 1 }}</span><div><h3>{{ step.title }}</h3><p>{{ step.text }}</p></div>
        </div>
      </div>

      <div class="analysis-story">
        <figure>
          <img :src="assetPath('images/examples/winter-boat.jpg')" alt="冬日湖上孤舟">
          <figcaption><b>意境分析样本</b><span>景物：寒江 · 孤舟 · 霜林</span><span>时节：冬日 · 清晨</span><span>意境：清寂 · 悠远</span></figcaption>
        </figure>
        <div class="story-copy">
          <h3>不只是看见景物，更要读懂意境</h3>
          <p>看见明月，不一定就是思乡；看见落花，也不一定只有伤感。见景寻诗会结合景物、时节、色彩与情绪，寻找整体意境最相合的一句。</p>
          <div class="dimensions"><span>景物相合</span><span>时节相应</span><span>情绪相通</span><span>出处真实</span></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const assetPath = usePublicAsset()
const steps = [
  { title: '上传照片', text: '选择一张风景、花木、建筑或生活照片。' },
  { title: '感受意境', text: '理解景物、时节、色彩与情绪。' },
  { title: '寻找诗句', text: '从真实古典诗词中匹配最相合的一句。' },
  { title: '生成海报', text: '调整排版，按原图比例下载高清图片。' }
]
</script>

<style scoped>
.how-section { position: relative; overflow: hidden; padding: 115px 0 125px; }.display-title { max-width: 950px; margin-top: 24px; font-size: clamp(40px, 4.8vw, 68px); }.intro { color: var(--muted); font: 21px var(--serif); }
.journey { position: relative; display: grid; grid-template-columns: repeat(4,1fr); gap: 30px; margin: 68px 0; }.journey::before { position: absolute; top: 19px; right: 0; left: 0; height: 1px; content: ""; background: var(--cinnabar); }.step { position: relative; padding-top: 44px; }.step::before { position: absolute; top: 12px; left: 0; width: 14px; height: 14px; border: 3px solid var(--paper); border-radius: 50%; content: ""; background: var(--cinnabar); outline: 1px solid var(--cinnabar); }.step > span { position: absolute; top: -16px; color: var(--cinnabar); font: 26px var(--serif); }.step h3 { margin: 0; font: 600 22px var(--serif); }.step p { color: var(--muted); line-height: 1.7; }
.analysis-story { position: relative; z-index: 1; display: grid; grid-template-columns: 1.1fr .9fr; gap: 60px; align-items: center; }.analysis-story figure { margin: 0; border: 1px solid var(--line); padding: 10px; background: rgba(255,252,245,.55); }.analysis-story img { width: 100%; }.analysis-story figcaption { display: grid; grid-template-columns: auto repeat(3, 1fr); gap: 18px; padding: 15px 8px 5px; color: var(--muted); font-size: 12px; }.analysis-story figcaption b { color: var(--ink); font-family: var(--serif); }.story-copy { padding-left: 32px; border-left: 1px solid var(--cinnabar); }.story-copy h3 { margin: 0; font: 700 clamp(30px, 3vw, 43px)/1.35 var(--serif); }.story-copy p { color: var(--muted); line-height: 1.9; }.dimensions { display: grid; grid-template-columns: repeat(4,1fr); margin-top: 30px; border-top: 1px solid var(--line); }.dimensions span { padding: 17px 8px 0; border-right: 1px solid var(--line); font-family: var(--serif); }.dimensions span:last-child { border: 0; }
@media (max-width: 800px) { .how-section { padding: 80px 0 90px; }.journey { grid-template-columns: 1fr 1fr; }.journey::before { display: none; }.step { padding: 18px 0 0 48px; border-top: 1px solid var(--line); }.step::before { top: 17px; }.step > span { top: 13px; left: 18px; font-size: 18px; }.analysis-story { grid-template-columns: 1fr; gap: 35px; }.analysis-story figcaption { grid-template-columns: 1fr; gap: 5px; }.story-copy { padding-left: 20px; }.dimensions { grid-template-columns: 1fr 1fr; }.dimensions span { border-bottom: 1px solid var(--line); } }
@media (max-width: 520px) { .journey { grid-template-columns: 1fr; margin: 48px 0; }.display-title { font-size: 39px; }.dimensions { font-size: 13px; } }
</style>
