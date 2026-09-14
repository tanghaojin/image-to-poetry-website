<template>
  <div class="legal-page">
    <header class="legal-masthead">
      <div class="legal-container">
        <span class="section-kicker">{{ eyebrow }}</span>
        <h1>{{ title }}</h1>
        <p>{{ updated }}</p>
      </div>
    </header>
    <article class="legal-container legal-document">
      <slot />
    </article>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  updated: string
}>()
</script>

<style scoped>
.legal-page { min-height: 70vh; }
.legal-masthead { border-bottom: 1px solid var(--line); padding: 76px 0 56px; background: rgba(255,255,255,.2); }
.legal-container { width: min(900px, calc(100% - 48px)); margin-inline: auto; }
.legal-masthead h1 { margin: 28px 0 14px; font: 700 clamp(46px, 6vw, 74px)/1.1 var(--serif); letter-spacing: -.04em; }
.legal-masthead p { margin: 0; color: var(--muted); font-size: 14px; }
.legal-document { padding-block: 62px 100px; }
.legal-document :deep(.legal-intro) { margin: 0 0 54px; padding: 26px 30px; border-left: 2px solid var(--cinnabar); color: var(--muted); background: rgba(255,255,255,.3); font: 17px/2 var(--serif); }
.legal-document :deep(section) { margin-top: 46px; }
.legal-document :deep(h2) { margin: 0 0 20px; padding-bottom: 13px; border-bottom: 1px solid var(--line); font: 600 clamp(25px, 3vw, 32px)/1.4 var(--serif); }
.legal-document :deep(h3) { margin: 25px 0 10px; font: 600 19px/1.5 var(--serif); }
.legal-document :deep(p), .legal-document :deep(li) { color: #514d46; font-size: 16px; line-height: 1.95; }
.legal-document :deep(ul) { margin: 14px 0; padding-left: 1.4em; }
.legal-document :deep(li + li) { margin-top: 8px; }
.legal-document :deep(strong) { color: var(--ink); }
.legal-document :deep(a) { color: var(--cinnabar); text-decoration: underline; text-underline-offset: 4px; }
.legal-document :deep(.legal-notice) { margin-top: 22px; border: 1px solid rgba(181,72,54,.28); padding: 20px 24px; background: rgba(181,72,54,.055); }
.legal-document :deep(.legal-notice p) { margin: 0; }
@media (max-width: 767px) {
  .legal-masthead { padding: 52px 0 38px; }
  .legal-container { width: min(100% - 32px, 900px); }
  .legal-masthead h1 { margin-top: 22px; font-size: 42px; }
  .legal-document { padding-block: 42px 72px; }
  .legal-document :deep(.legal-intro) { margin-bottom: 40px; padding: 20px; font-size: 15px; }
  .legal-document :deep(section) { margin-top: 38px; }
  .legal-document :deep(p), .legal-document :deep(li) { font-size: 15px; }
}
</style>
