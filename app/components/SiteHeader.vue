<template>
  <header class="site-header">
    <div class="container-wide nav-inner">
      <NuxtLink to="/" class="brand" aria-label="见景寻诗首页">
        <span>见景寻诗</span>
        <img class="brand-stamp" :src="assetPath('images/hero/seal-poetry-mood.png')" alt="诗境">
      </NuxtLink>

      <nav class="desktop-nav" aria-label="主导航">
        <NuxtLink to="/#examples">示例作品</NuxtLink>
        <NuxtLink to="/#how-it-works">如何使用</NuxtLink>
        <NuxtLink to="/#about">关于寻诗</NuxtLink>
        <NuxtLink to="/#faq">常见问题</NuxtLink>
      </nav>

      <button
        class="menu-button"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        aria-label="切换导航菜单"
        @click="menuOpen = !menuOpen"
      >
        <Icon :name="menuOpen ? 'heroicons:x-mark' : 'heroicons:bars-2'" size="27" />
      </button>
    </div>

    <Transition name="menu-fade">
      <nav v-if="menuOpen" id="mobile-menu" class="mobile-nav" aria-label="移动端导航">
        <NuxtLink to="/#examples" @click="menuOpen = false">示例作品</NuxtLink>
        <NuxtLink to="/#how-it-works" @click="menuOpen = false">如何使用</NuxtLink>
        <NuxtLink to="/#about" @click="menuOpen = false">关于寻诗</NuxtLink>
        <NuxtLink to="/#faq" @click="menuOpen = false">常见问题</NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const assetPath = usePublicAsset()
const menuOpen = ref(false)
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--paper) 92%, transparent);
  backdrop-filter: blur(14px);
}
.nav-inner { height: 68px; display: flex; align-items: center; justify-content: space-between; }
.brand { display: inline-flex; align-items: center; gap: 10px; font: 700 25px/1 var(--serif); letter-spacing: .12em; }
.brand-stamp { width: 25px; height: 34px; object-fit: contain; }
.desktop-nav { display: flex; gap: 42px; font-family: var(--serif); font-size: 15px; }
.desktop-nav a { position: relative; padding: 23px 0; }
.desktop-nav a::after { position: absolute; left: 50%; bottom: 14px; width: 0; height: 1px; content: ""; background: var(--cinnabar); transition: .2s ease; }
.desktop-nav a:hover::after { left: 0; width: 100%; }
.menu-button { display: none; border: 0; background: transparent; padding: 8px; cursor: pointer; }
.mobile-nav { position: absolute; inset: 68px 0 auto; display: grid; padding: 10px 24px 22px; border-bottom: 1px solid var(--line); background: var(--paper); box-shadow: 0 20px 35px rgba(60,45,30,.08); }
.mobile-nav a { padding: 14px 4px; border-bottom: 1px solid var(--line); font-family: var(--serif); }
.menu-fade-enter-active, .menu-fade-leave-active { transition: opacity .2s ease, transform .2s ease; }
.menu-fade-enter-from, .menu-fade-leave-to { opacity: 0; transform: translateY(-8px); }
@media (max-width: 767px) {
  .nav-inner { height: 60px; }
  .brand { font-size: 21px; }
  .desktop-nav { display: none; }
  .menu-button { display: inline-grid; place-items: center; }
  .mobile-nav { inset-block-start: 60px; }
}
</style>
