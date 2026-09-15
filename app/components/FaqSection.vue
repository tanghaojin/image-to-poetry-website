<template>
  <section id="faq" class="faq-section">
    <div class="container-wide faq-grid">
      <div class="faq-heading">
        <span class="section-kicker dark">{{ t('home.faq.kicker') }}</span>
        <h2 class="display-title">{{ t('home.faq.title') }}</h2>
        <p>{{ t('home.faq.intro1') }}<br>{{ t('home.faq.intro2') }}</p>
        <span class="question-mark" aria-hidden="true">？</span>
      </div>
      <div class="faq-list">
        <article v-for="(item, index) in items" :key="item.question" :class="{ open: openIndex === index }">
          <button type="button" :aria-expanded="openIndex === index" @click="openIndex = openIndex === index ? -1 : index">
            <span>0{{ index + 1 }}</span><b>{{ item.question }}</b><i>{{ openIndex === index ? '−' : '+' }}</i>
          </button>
          <Transition name="answer"><p v-if="openIndex === index">{{ item.answer }}</p></Transition>
        </article>
        <footer>{{ t('home.faq.footer') }}</footer>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const openIndex = ref(0)
const { t } = useI18n()
const items = computed(() => [1, 2, 3, 4, 5, 6].map(index => ({ question: t(`home.faq.items.${index}.question`), answer: t(`home.faq.items.${index}.answer`) })))
</script>

<style scoped>
.faq-section { position: relative; overflow: hidden; padding: 110px 0; color: #f8f0e3; background: #201e1b; background-image: radial-gradient(circle at 85% 10%, rgba(255,255,255,.04), transparent 28%), repeating-linear-gradient(11deg, rgba(255,255,255,.013) 0 1px, transparent 1px 7px); }.faq-grid { display: grid; grid-template-columns: .7fr 1.3fr; gap: 80px; }.section-kicker.dark { color: #f8f0e3; }.faq-heading h2 { margin-top: 32px; font-size: clamp(55px, 7vw, 94px); }.faq-heading p { color: #d1c8bb; font: 28px/1.6 var(--serif); }.question-mark { display: block; margin-top: 30px; color: rgba(244,240,231,.1); font: 180px/.8 var(--serif); }
.faq-list article { border-top: 1px solid rgba(244,240,231,.34); }.faq-list article:last-of-type { border-bottom: 1px solid rgba(244,240,231,.34); }.faq-list button { display: grid; width: 100%; grid-template-columns: 64px 1fr auto; align-items: center; gap: 16px; border: 0; padding: 25px 10px; color: #f8f0e3; background: transparent; text-align: left; cursor: pointer; }.faq-list button span, .faq-list button i { color: #e36b52; font: 26px var(--serif); }.faq-list button b { font: 600 clamp(20px, 2.1vw, 30px) var(--serif); }.faq-list p { margin: -6px 64px 24px 90px; color: #d1c8bb; line-height: 1.8; }.faq-list footer { margin-top: 28px; color: #958c80; font-size: 12px; letter-spacing: .2em; text-align: center; }.answer-enter-active,.answer-leave-active { transition: .2s ease; }.answer-enter-from,.answer-leave-to { opacity: 0; transform: translateY(-5px); }
@media (max-width: 800px) { .faq-section { padding: 80px 0; }.faq-grid { grid-template-columns: 1fr; gap: 44px; }.faq-heading p { font-size: 21px; }.question-mark { display: none; }.faq-list button { grid-template-columns: 42px 1fr auto; gap: 8px; padding: 21px 0; }.faq-list button span { font-size: 18px; }.faq-list button i { font-size: 24px; }.faq-list p { margin: -4px 32px 20px 50px; font-size: 14px; } }
</style>
