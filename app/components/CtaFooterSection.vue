<template>
  <section class="closing-section">
    <div class="closing-main">
      <div class="container-wide closing-grid">
        <div class="closing-copy">
          <span class="section-kicker">再寻一景</span>
          <h2 class="display-title">你的照片里，<br>藏着哪一句诗？</h2>
          <p>上传一张照片，让千年前的诗句与眼前的风景相遇。</p>
          <a class="primary-button" href="#top">上传照片，开始寻诗</a>
          <small>免费使用 · 无需登录 · 保持原图比例</small>
        </div>
        <figure>
          <img :src="assetPath('images/examples/sunset-river.jpg')" alt="落日映照山水">
          <blockquote>一道残阳铺水中，<br>半江瑟瑟半江红。</blockquote>
        </figure>
      </div>
    </div>
    <footer class="site-footer">
      <div class="container-wide footer-main">
        <div><h3>见景寻诗 <img class="footer-stamp" :src="assetPath('images/hero/seal-poetry-mood.png')" alt="诗境"></h3><p>为眼前的风景，寻找古人的诗句。</p></div>
        <nav><a href="#examples">示例作品</a><a href="#how-it-works">如何使用</a><a href="#about">关于寻诗</a><a href="#faq">常见问题</a></nav>
        <nav aria-label="隐私说明"><a href="#about">图片与隐私说明</a></nav>
      </div>
      <div class="container-wide copyright">© 2026 见景寻诗</div>
    </footer>
  </section>
</template>

<script setup lang="ts">
const assetPath = usePublicAsset()
</script>

<style scoped>
.closing-main { overflow: hidden; padding-top: 90px; }.closing-grid { display: grid; grid-template-columns: 1fr .88fr; gap: 40px; align-items: center; }.closing-copy { padding: 55px 0 80px; }.closing-copy h2 { margin-top: 28px; font-size: clamp(54px, 6.5vw, 92px); }.closing-copy p { color: var(--muted); font: 20px/1.8 var(--serif); }.closing-copy .primary-button { display: inline-flex; align-items: center; margin-top: 18px; font: 20px var(--serif); }.closing-copy small { display: block; margin-top: 18px; color: var(--muted); }.closing-grid figure { position: relative; align-self: end; height: 680px; margin: 0; overflow: hidden; border: 10px solid #faf6ee; box-shadow: 0 20px 50px rgba(87,66,42,.15); transform: rotate(1deg); }.closing-grid img { width: 100%; height: 100%; object-fit: cover; }.closing-grid blockquote { position: absolute; top: 54px; right: 32px; margin: 0; color: #fff7ea; font: 20px/2 var(--serif); writing-mode: vertical-rl; }
.site-footer { padding: 42px 0 22px; color: #eee6da; background: #201e1b; }.footer-main { display: grid; grid-template-columns: 1.25fr 1fr .5fr; gap: 55px; align-items: start; }.footer-main h3 { display: flex; align-items: center; gap: 10px; margin: 0; font: 600 30px var(--serif); }.footer-stamp { width: 25px; height: 34px; object-fit: contain; }.footer-main p { color: #aaa196; }.footer-main nav { display: flex; flex-wrap: wrap; gap: 22px 30px; padding-top: 10px; font: 14px var(--serif); }.footer-main nav a:hover { color: #ef765d; }.copyright { margin-top: 30px; padding-top: 18px; border-top: 1px solid rgba(244,240,231,.22); color: #8f877e; font-size: 12px; }
@media (max-width: 800px) { .closing-main { padding-top: 60px; }.closing-grid { grid-template-columns: 1fr; }.closing-copy { padding-bottom: 25px; }.closing-copy h2 { font-size: 54px; }.closing-grid figure { width: min(100%, 520px); height: 620px; justify-self: center; }.footer-main { grid-template-columns: 1fr; gap: 20px; }.footer-main nav { padding-top: 0; } }
@media (max-width: 520px) { .closing-copy h2 { font-size: 44px; }.closing-copy .primary-button { width: 100%; justify-content: center; }.closing-grid figure { height: 520px; }.site-footer { padding-top: 36px; } }
</style>
