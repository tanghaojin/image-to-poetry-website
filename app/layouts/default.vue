<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">{{ t('common.skip') }}</a>
    <SiteHeader />
    <main id="main-content">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
