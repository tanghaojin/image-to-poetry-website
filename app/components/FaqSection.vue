<template>
  <section id="faq" class="faq-section">
    <div class="container-wide faq-grid">
      <div class="faq-heading">
        <span class="section-kicker dark">寻诗问答</span>
        <h2 class="display-title">常见问题</h2>
        <p>关于诗词、图片与生成方式，<br>你想知道的都在这里。</p>
        <span class="question-mark" aria-hidden="true">？</span>
      </div>
      <div class="faq-list">
        <article v-for="(item, index) in items" :key="item.question" :class="{ open: openIndex === index }">
          <button type="button" :aria-expanded="openIndex === index" @click="openIndex = openIndex === index ? -1 : index">
            <span>0{{ index + 1 }}</span><b>{{ item.question }}</b><i>{{ openIndex === index ? '−' : '+' }}</i>
          </button>
          <Transition name="answer"><p v-if="openIndex === index">{{ item.answer }}</p></Transition>
        </article>
        <footer>真实古句 · 原图比例 · 免费使用 · 无需登录</footer>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openIndex = ref(0)
const items = [
  { question: '推荐的诗词是真实的吗？', answer: '是。所有推荐内容均来自真实古典诗词，并展示篇名、作者和朝代。' },
  { question: '系统如何选择诗词？', answer: '系统会综合分析图片中的景物、时节、色彩和情绪，再从诗词库中选择整体意境最相合的一句。' },
  { question: '为什么只推荐一句？', answer: '我们希望减少选择负担，因此会直接呈现综合匹配度最高的结果。' },
  { question: '哪些图片更适合寻诗？', answer: '风景、花木、动物、古建筑和具有明确氛围的生活照片通常能获得更贴切的结果。' },
  { question: '是否免费，需要注册吗？', answer: '首版免费使用，无需注册或登录。' },
  { question: '下载的图片会改变尺寸吗？', answer: '生成结果会保持原图比例，不进行强制裁切。' }
]
</script>

<style scoped>
.faq-section { position: relative; overflow: hidden; padding: 110px 0; color: #f8f0e3; background: #201e1b; background-image: radial-gradient(circle at 85% 10%, rgba(255,255,255,.04), transparent 28%), repeating-linear-gradient(11deg, rgba(255,255,255,.013) 0 1px, transparent 1px 7px); }.faq-grid { display: grid; grid-template-columns: .7fr 1.3fr; gap: 80px; }.section-kicker.dark { color: #f8f0e3; }.faq-heading h2 { margin-top: 32px; font-size: clamp(55px, 7vw, 94px); }.faq-heading p { color: #d1c8bb; font: 28px/1.6 var(--serif); }.question-mark { display: block; margin-top: 30px; color: rgba(244,240,231,.1); font: 180px/.8 var(--serif); }
.faq-list article { border-top: 1px solid rgba(244,240,231,.34); }.faq-list article:last-of-type { border-bottom: 1px solid rgba(244,240,231,.34); }.faq-list button { display: grid; width: 100%; grid-template-columns: 64px 1fr auto; align-items: center; gap: 16px; border: 0; padding: 25px 10px; color: #f8f0e3; background: transparent; text-align: left; cursor: pointer; }.faq-list button span, .faq-list button i { color: #e36b52; font: 26px var(--serif); }.faq-list button b { font: 600 clamp(20px, 2.1vw, 30px) var(--serif); }.faq-list p { margin: -6px 64px 24px 90px; color: #d1c8bb; line-height: 1.8; }.faq-list footer { margin-top: 28px; color: #958c80; font-size: 12px; letter-spacing: .2em; text-align: center; }.answer-enter-active,.answer-leave-active { transition: .2s ease; }.answer-enter-from,.answer-leave-to { opacity: 0; transform: translateY(-5px); }
@media (max-width: 800px) { .faq-section { padding: 80px 0; }.faq-grid { grid-template-columns: 1fr; gap: 44px; }.faq-heading p { font-size: 21px; }.question-mark { display: none; }.faq-list button { grid-template-columns: 42px 1fr auto; gap: 8px; padding: 21px 0; }.faq-list button span { font-size: 18px; }.faq-list button i { font-size: 24px; }.faq-list p { margin: -4px 32px 20px 50px; font-size: 14px; } }
</style>
