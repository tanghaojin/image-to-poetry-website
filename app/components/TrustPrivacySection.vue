<template>
  <section id="about" class="trust-section">
    <div class="container-wide">
      <span class="section-kicker">所寻有据</span>
      <h2 class="display-title">只寻古人真句，不作凭空新作</h2>
      <p class="lead">见景寻诗只从有明确作者和出处的古典诗词中寻找答案。系统负责理解图片与匹配意境，不仿写古诗，也不把机器创作的内容冒充古人作品。</p>

      <div class="trust-grid">
        <article class="archive-sheet">
          <span class="archive-stamp">已核</span>
          <div class="poem-archive">
            <h3>宿建德江</h3>
            <p>移舟泊烟渚，日暮客愁新。<br>野旷天低树，江清月近人。</p>
            <span>唐 · 孟浩然</span>
          </div>
          <ul><li><b>原文可核</b><span>经权威古籍版本校对</span></li><li><b>作者明确</b><span>标明作者、朝代和篇名</span></li><li><b>出处可追溯</b><span>来源经典诗词文献</span></li></ul>
        </article>

        <article class="privacy-proof">
          <h3>照片属于你，<br>也只服务于这一次寻诗</h3>
          <p>图片仅用于分析画面意境，本站不保存。</p>
          <div class="privacy-flow"><span>选择图片</span><i>→</i><span>浏览器处理</span><i>→</i><span>意境分析</span><i>→</i><span class="deleted">本站不保存</span></div>
          <ul><li>无需登录</li><li>不建立公开作品页</li><li>本站不保存图片</li></ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust-section { padding: 115px 0; }.display-title { max-width: 980px; margin-top: 22px; font-size: clamp(42px, 5vw, 70px); }.lead { max-width: 850px; color: var(--muted); line-height: 1.9; }
.trust-grid { display: grid; grid-template-columns: 1.08fr .92fr; gap: 70px; margin-top: 55px; align-items: center; }.archive-sheet { position: relative; min-height: 440px; border: 1px solid rgba(120,83,55,.25); padding: 54px; background: #eee5d4; box-shadow: 0 18px 50px rgba(87,66,42,.1); transform: rotate(-1deg); }.archive-stamp { position: absolute; top: 38px; right: 42px; padding: 8px 5px; border: 2px solid var(--cinnabar); border-radius: 5px; color: var(--cinnabar); font: 20px/1 var(--serif); writing-mode: vertical-rl; }.poem-archive { display: grid; grid-template-columns: auto 1fr auto; gap: 28px; align-items: start; padding: 34px; border: 1px solid var(--cinnabar); font-family: var(--serif); }.poem-archive h3 { margin: 0; font-size: 29px; writing-mode: vertical-rl; }.poem-archive p { margin: 0; font-size: 22px; line-height: 2.1; writing-mode: vertical-rl; }.poem-archive span { color: var(--muted); writing-mode: vertical-rl; }.archive-sheet ul, .privacy-proof ul { list-style: none; margin: 30px 0 0; padding: 0; }.archive-sheet li { display: grid; grid-template-columns: 100px 1fr; gap: 15px; padding: 10px 0; border-bottom: 1px solid var(--line); }.archive-sheet li span { color: var(--muted); font-size: 13px; }
.privacy-proof { padding-left: 28px; border-left: 1px solid var(--cinnabar); }.privacy-proof h3 { margin: 0; font: 700 clamp(32px, 3.5vw, 50px)/1.35 var(--serif); }.privacy-proof > p { color: var(--muted); line-height: 1.9; }.privacy-flow { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items: center; gap: 8px; margin: 34px 0; padding: 25px 0; border-block: 1px solid var(--line); text-align: center; font: 13px var(--serif); }.privacy-flow i { color: var(--cinnabar); font-style: normal; }.privacy-flow .deleted { color: var(--cinnabar); font-weight: 700; }.privacy-proof ul { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; }.privacy-proof li { position: relative; padding-left: 20px; font-size: 13px; }.privacy-proof li::before { position: absolute; left: 0; width: 10px; height: 10px; border: 1px solid var(--cinnabar); border-radius: 50%; content: ""; }
@media (max-width: 900px) { .trust-section { padding: 80px 0; }.trust-grid { grid-template-columns: 1fr; gap: 50px; }.archive-sheet { transform: none; }.privacy-proof { padding-left: 20px; } }
@media (max-width: 560px) { .display-title { font-size: 38px; }.archive-sheet { min-height: 0; padding: 24px; }.archive-stamp { top: 18px; right: 18px; }.poem-archive { gap: 14px; padding: 20px; }.poem-archive h3 { font-size: 21px; }.poem-archive p { font-size: 16px; }.archive-sheet li { grid-template-columns: 82px 1fr; }.privacy-flow { grid-template-columns: 1fr; }.privacy-flow i { transform: rotate(90deg); }.privacy-proof ul { grid-template-columns: 1fr; } }
</style>
