<template>
  <div class="container-wide creator-shell" :class="`state-${state}`">
    <template v-if="state === 'idle'">
      <div
        class="upload-board"
        :class="{ dragging }"
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <span class="corner c1" /><span class="corner c2" /><span class="corner c3" /><span class="corner c4" />
        <div class="mountain-mark" aria-hidden="true"><span /><span /><span /></div>
        <h2>{{ dragging ? '松开，开始寻诗' : '将照片拖到这里' }}</h2>
        <p>或点击选择图片</p>
        <button class="primary-button upload-button" type="button" @click="fileInput?.click()">选择图片</button>
        <input ref="fileInput" class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" @change="onFileChange">
        <p class="file-note">支持 JPG、PNG、WebP，最大 10 MB</p>
        <p v-if="errorMessage" class="upload-error" role="alert">{{ errorMessage }}</p>
        <p class="privacy-note"><Icon name="heroicons:lock-closed" /> 图片仅用于意境分析，本站不保存</p>
      </div>

      <div class="sample-picker">
        <button v-for="sample in samples" :key="sample.src" type="button" @click="useSample(sample)">
          <img :src="sample.src" :alt="sample.name">
          <small>{{ sample.name }}</small>
        </button>
      </div>
    </template>

    <template v-else-if="state === 'analyzing'">
      <div class="preview-frame">
        <span class="preview-label" :class="{ failed: analysisError }"><i /> {{ analysisError ? '处理未完成' : '正在理解图片并寻找诗句' }}</span>
        <img :src="selectedImage" alt="待分析图片">
        <button type="button" class="text-action" @click="reset">重新选择图片</button>
      </div>
      <div class="analysis-panel">
        <span class="section-kicker">意境分析</span>
        <template v-if="!analysisError">
          <h2 class="panel-title">正在感受画面并寻诗……</h2>
          <p>读懂景物、时节与情绪，再从已校验的真实古诗中寻找最相合的一首。</p>
          <ol class="progress-list analyzing-steps">
            <li class="active"><b>辨认画面中的主体景物</b></li>
            <li><b>判断时节、天气与光线</b></li>
            <li><b>匹配真实诗词……</b></li>
          </ol>
        </template>
        <template v-else>
          <h2 class="panel-title">这次没有读懂</h2>
          <p class="analysis-error" role="alert">{{ analysisError }}</p>
          <div class="analysis-actions">
            <button class="primary-button" type="button" @click="retryAnalysis">重新尝试</button>
            <button class="inline-link" type="button" @click="reset">重新选择图片</button>
          </div>
        </template>
        <p class="privacy-inline"><Icon name="heroicons:lock-closed" /> 图片仅用于意境分析，本站不保存</p>
      </div>
    </template>

    <template v-else-if="state === 'understood' && understandingResult">
      <div class="preview-frame">
        <span class="preview-label success"><Icon name="heroicons:check" /> 理解完成</span>
        <img :src="selectedImage" alt="已完成意境分析的图片">
        <button type="button" class="text-action" @click="reset">重新选择图片</button>
      </div>
      <div class="understanding-panel">
        <span class="section-kicker">画面意境</span>
        <h2 class="panel-title">已读懂这幅画</h2>
        <dl class="understanding-list">
          <div><dt>看见</dt><dd>{{ understandingResult.subjects.join(' · ') }}</dd></div>
          <div><dt>时节</dt><dd>{{ temporalDescription }}</dd></div>
          <div><dt>意境</dt><dd>{{ understandingResult.mood }}</dd></div>
        </dl>
        <blockquote>{{ understandingResult.sceneSummary }}</blockquote>
        <p class="confidence">理解可信度 {{ confidencePercent }}%</p>
        <div class="analysis-actions">
          <button class="primary-button" type="button" @click="retryAnalysis">重新分析</button>
          <button class="inline-link" type="button" @click="reset">换一张图片</button>
        </div>
        <p class="privacy-inline"><Icon name="heroicons:lock-closed" /> 图片仅用于意境分析，本站不保存</p>
      </div>
    </template>

    <template v-else-if="state === 'editor' && poetryMatch">
      <div class="preview-frame poster-preview">
        <span class="preview-label"><i /> 实时预览</span>
        <div class="poster-canvas" :class="posterClasses">
          <img :src="selectedImage" alt="配诗海报预览">
          <div class="vertical-poem">
            <strong><template v-for="line in posterLines" :key="line">{{ line }}<br></template></strong>
            <small v-if="showAttribution">{{ verticalAttribution }}</small>
            <span v-if="showStamp" class="mini-stamp">寻诗</span>
          </div>
        </div>
        <button type="button" class="text-action" @click="reset">重新选择图片</button>
      </div>
      <div class="editor-panel">
        <span class="section-kicker">最相合的诗句</span>
        <h2 class="poem-result">{{ posterText }}</h2>
        <p class="poem-source">{{ poemAttribution }}</p>
        <p class="match-reason"><b>匹配理由：</b>{{ poetryMatch.match.reason }}</p>
        <button class="inline-link" type="button" :aria-expanded="showFullPoem" @click="showFullPoem = !showFullPoem">{{ showFullPoem ? '收起全诗' : '查看全诗' }} <span>→</span></button>
        <div v-if="showFullPoem" class="full-poem">
          <p><template v-for="line in poetryMatch.poem.lines" :key="line">{{ line }}<br></template></p>
        </div>

        <div class="controls">
          <h3>调整排版</h3>
          <OptionRow v-model="layout" label="版式" :items="['留白题诗', '古意竖排', '画心题跋']" />
          <OptionRow v-model="font" label="字体" :items="['宋体', '楷体', '行楷']" />
          <OptionRow v-model="position" label="位置" :items="['上', '中', '下']" />
          <div class="color-row"><span>文字颜色</span><button v-for="color in colors" :key="color.name" class="color" :class="[color.className, { selected: textColor === color.name }]" type="button" :aria-label="color.name" :aria-pressed="textColor === color.name" @click="textColor = color.name" /></div>
          <div class="switch-row"><label>显示作者与篇名 <input v-model="showAttribution" type="checkbox"><i /></label><label>显示印章 <input v-model="showStamp" type="checkbox"><i /></label></div>
        </div>
        <button class="primary-button generate-button" type="button" :disabled="isGenerating" @click="generatePoster">{{ isGenerating ? '正在生成海报…' : '生成诗意海报' }}</button>
        <small class="ratio-note">保持原图比例</small>
      </div>
    </template>

    <template v-else>
      <div class="preview-frame poster-preview generated-preview">
        <span class="preview-label success"><Icon name="heroicons:check" /> 生成完成</span>
        <div class="poster-canvas" :class="posterClasses">
          <img :src="posterUrl || selectedImage" alt="生成完成的诗意海报">
          <div v-if="!posterUrl" class="vertical-poem">
            <strong><template v-for="line in posterLines" :key="line">{{ line }}<br></template></strong>
            <small v-if="showAttribution">{{ verticalAttribution }}</small>
            <span v-if="showStamp" class="mini-stamp">寻诗</span>
          </div>
        </div>
      </div>
      <div class="result-panel">
        <h2 class="panel-title">诗意海报已生成</h2>
        <p class="result-lead">古人的诗句，已落在你的风景里。</p>
        <div class="result-meta">
          <b>《{{ poetryMatch?.poem.title }}》</b>
          <span>{{ poetryMatch?.poem.dynasty }} · {{ poetryMatch?.poem.author }}</span>
          <p class="result-poem"><template v-for="line in poetryMatch?.poem.lines" :key="line">{{ line }}<br></template></p>
        </div>
        <a class="primary-button download-button" :href="posterUrl || selectedImage" :download="posterFilename"><Icon name="heroicons:arrow-down-tray" /> 下载高清图片</a>
        <button class="inline-link redo" type="button" @click="reset">再做一张 <span>→</span></button>
        <p class="trust-line">免费生成 · 无水印 · 无需登录</p>
        <p class="deleted-line"><Icon name="heroicons:check-circle" /> 本站不保存原始图片</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ImageUnderstandingResult, PoetryMatchResult } from '~/types/poetry'

type State = 'idle' | 'analyzing' | 'understood' | 'editor' | 'generated'
type Sample = { name: string, src: string }

const assetPath = usePublicAsset()

const emit = defineEmits<{ 'active-change': [active: boolean] }>()

const state = ref<State>('idle')
const selectedImage = ref(assetPath('images/examples/winter-boat.jpg'))
const analysisSource = ref<Blob | string>(assetPath('images/examples/winter-boat.jpg'))
const understandingResult = ref<ImageUnderstandingResult | null>(null)
const poetryMatch = ref<PoetryMatchResult | null>(null)
const analysisError = ref('')
const dragging = ref(false)
const errorMessage = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const layout = ref('古意竖排')
const font = ref('楷体')
const position = ref('中')
const textColor = ref('墨黑')
const showAttribution = ref(true)
const showStamp = ref(true)
const showFullPoem = ref(false)
const isGenerating = ref(false)
const posterUrl = ref<string | null>(null)
let objectUrl: string | null = null
let analysisRequestId = 0
const { analyzeAndMatch, cancel: cancelImagePoetry } = useImagePoetry()

const colors = [
  { name: '墨黑', className: 'black' },
  { name: '米白', className: 'cream' },
  { name: '朱砂', className: 'red' }
]

const posterClasses = computed(() => [
  `layout-${layout.value}`,
  `font-${font.value}`,
  `position-${position.value}`,
  `color-${textColor.value}`
])

const samples: Sample[] = [
  { name: '暮江落日', src: assetPath('images/examples/sunset-river.jpg') },
  { name: '寒江孤舟', src: assetPath('images/examples/winter-boat.jpg') },
  { name: '山中桃花', src: assetPath('images/examples/mountain-peach-blossom.jpg') }
]

const temporalDescription = computed(() => understandingResult.value
  ? [understandingResult.value.season, understandingResult.value.time, understandingResult.value.weather].filter((value, index, values) => value !== '无法确定' && values.indexOf(value) === index).join(' · ') || '无法确定'
  : '')
const confidencePercent = computed(() => Math.round((understandingResult.value?.confidence || 0) * 100))
const posterLines = computed(() => {
  const poem = poetryMatch.value?.poem
  if (!poem) return []
  const selected = poem.selectedLineIndexes.map(index => poem.lines[index]).filter((line): line is string => Boolean(line))
  return selected.length ? selected.slice(0, 2) : poem.lines.slice(0, 2)
})
const posterText = computed(() => posterLines.value.join(''))
const poemAttribution = computed(() => poetryMatch.value
  ? `${poetryMatch.value.poem.dynasty} · ${poetryMatch.value.poem.author}《${poetryMatch.value.poem.title}》`
  : '')
const compactAttribution = computed(() => poetryMatch.value
  ? `${poetryMatch.value.poem.dynasty}·${poetryMatch.value.poem.author}《${poetryMatch.value.poem.title}》`
  : '')
const verticalAttribution = computed(() => compactAttribution.value
  .replace('《', '︽')
  .replace('》', '︾'))
const posterFilename = computed(() => `见景寻诗-${poetryMatch.value?.poem.title || '诗意海报'}.jpg`)

async function beginAnalysis(src: string, source: Blob | string = src) {
  const requestId = ++analysisRequestId
  cancelImagePoetry()
  errorMessage.value = ''
  analysisError.value = ''
  understandingResult.value = null
  poetryMatch.value = null
  analysisSource.value = source
  selectedImage.value = src
  state.value = 'analyzing'
  emit('active-change', true)
  nextTick(() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' }))
  try {
    const result = await analyzeAndMatch(source)
    if (requestId !== analysisRequestId) return
    understandingResult.value = result.understanding
    poetryMatch.value = result
    showFullPoem.value = false
    state.value = 'editor'
  } catch (error) {
    if (requestId !== analysisRequestId || (error instanceof DOMException && error.name === 'AbortError')) return
    analysisError.value = getImagePoetryErrorMessage(error)
  }
}

function useSample(sample: Sample) { beginAnalysis(sample.src) }
function retryAnalysis() { beginAnalysis(selectedImage.value, analysisSource.value) }

function handleFile(file?: File) {
  if (!file) return
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    errorMessage.value = '请选择 JPG、PNG 或 WebP 图片。'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    errorMessage.value = '图片超过 10 MB，请压缩后重新选择。'
    return
  }
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = URL.createObjectURL(file)
  beginAnalysis(objectUrl, file)
}

function onFileChange(event: Event) { handleFile((event.target as HTMLInputElement).files?.[0]) }
function onDrop(event: DragEvent) { dragging.value = false; handleFile(event.dataTransfer?.files?.[0]) }

function reset() {
  analysisRequestId += 1
  cancelImagePoetry()
  state.value = 'idle'
  emit('active-change', false)
  if (posterUrl.value) { URL.revokeObjectURL(posterUrl.value); posterUrl.value = null }
  if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null }
  selectedImage.value = assetPath('images/examples/winter-boat.jpg')
  analysisSource.value = assetPath('images/examples/winter-boat.jpg')
  understandingResult.value = null
  poetryMatch.value = null
  analysisError.value = ''
  showFullPoem.value = false
  errorMessage.value = ''
  nextTick(() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' }))
}

function loadPosterImage() {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = selectedImage.value
  })
}

function drawOutlinedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, outlined: boolean) {
  if (outlined) {
    ctx.lineJoin = 'round'
    ctx.miterLimit = 2
    ctx.strokeStyle = 'rgba(0, 0, 0, .86)'
    ctx.lineWidth = Math.max(2, size * .095)
    ctx.strokeText(text, x, y)
  }
  ctx.fillText(text, x, y)
}

function drawVerticalText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, outlined = false) {
  ;[...text].forEach((char, index) => drawOutlinedText(ctx, char, x, y + index * size * 1.18, size, outlined))
}

async function renderPosterBlob() {
  try {
    const image = await loadPosterImage()
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(image, 0, 0)
    const size = Math.max(34, Math.round(Math.min(canvas.width, canvas.height) * .043))
    const ink = textColor.value === '米白' ? '#fffaf0' : textColor.value === '朱砂' ? '#b54836' : '#171512'
    const outlined = textColor.value === '米白'
    const fontFamily = font.value === '宋体' ? 'SimSun, serif' : font.value === '行楷' ? 'STXingkai, KaiTi, serif' : 'KaiTi, serif'
    ctx.fillStyle = ink
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.font = `600 ${size}px ${fontFamily}`

    if (layout.value === '古意竖排') {
      const top = position.value === '上' ? canvas.height * .12 : position.value === '下' ? canvas.height * .5 : canvas.height * .25
      posterLines.value.forEach((line, index) => drawVerticalText(ctx, line, canvas.width * (.86 - index * .065), top, size, outlined))
      if (showAttribution.value) {
        const attributionSize = Math.max(18, Math.round(size * .58))
        ctx.font = `${attributionSize}px ${fontFamily}`
        drawVerticalText(ctx, verticalAttribution.value, canvas.width * .925, top, attributionSize, outlined)
      }
    } else {
      const bandY = position.value === '上' ? canvas.height * .08 : position.value === '下' ? canvas.height * .7 : canvas.height * .39
      const bandH = size * (layout.value === '画心题跋' ? 3.2 : 2.5)
      ctx.fillStyle = layout.value === '画心题跋' ? 'rgba(244,240,231,.88)' : 'rgba(17,15,12,.38)'
      ctx.fillRect(canvas.width * .08, bandY, canvas.width * .84, bandH)
      ctx.fillStyle = ink
      ctx.font = `600 ${size}px ${fontFamily}`
      drawOutlinedText(ctx, posterText.value, canvas.width / 2, bandY + size * .42, size, outlined)
      if (showAttribution.value) {
        const attributionSize = Math.round(size * .43)
        ctx.font = `${attributionSize}px ${fontFamily}`
        drawOutlinedText(ctx, poemAttribution.value, canvas.width / 2, bandY + size * 1.65, attributionSize, outlined)
      }
    }

    if (showStamp.value) {
      const stampSize = Math.round(size * .82)
      ctx.strokeStyle = '#b54836'
      ctx.lineWidth = Math.max(2, canvas.width / 900)
      const stampX = canvas.width * .9
      const stampY = layout.value === '古意竖排' ? canvas.height * .045 : canvas.height * .82
      ctx.strokeRect(stampX, stampY, stampSize, stampSize)
      ctx.fillStyle = '#b54836'
      ctx.font = `${Math.round(stampSize * .38)}px KaiTi, serif`
      ctx.fillText('寻诗', stampX + stampSize / 2, stampY + stampSize * .18)
    }

    return await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', .94))
  } catch {
    return null
  }
}

async function generatePoster() {
  isGenerating.value = true
  const blob = await renderPosterBlob()
  if (posterUrl.value) URL.revokeObjectURL(posterUrl.value)
  posterUrl.value = blob ? URL.createObjectURL(blob) : null
  if (blob && objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null }
  isGenerating.value = false
  state.value = 'generated'
}

onUnmounted(() => {
  cancelImagePoetry()
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  if (posterUrl.value) URL.revokeObjectURL(posterUrl.value)
})
</script>

<style scoped>
.creator-shell { position: relative; z-index: 2; }
.state-idle { position: relative; }
.upload-board { position: relative; display: grid; min-height: 455px; grid-template-columns: minmax(0, 1fr); place-items: center; align-content: center; border: 1px solid rgba(93,79,62,.34); background: rgba(255,252,245,.58); box-shadow: 0 18px 40px rgba(78,62,42,.055); transition: border-color .2s, background .2s; }
.upload-board > * { min-width: 0; max-width: 100%; }
.upload-board.dragging { border-color: var(--cinnabar); background: rgba(181,72,54,.05); }
.corner { position: absolute; width: 14px; height: 14px; border-color: var(--muted); }
.c1 { top: 12px; left: 12px; border-top: 2px solid; border-left: 2px solid; }.c2 { top: 12px; right: 12px; border-top: 2px solid; border-right: 2px solid; }.c3 { bottom: 12px; left: 12px; border-bottom: 2px solid; border-left: 2px solid; }.c4 { bottom: 12px; right: 12px; border-bottom: 2px solid; border-right: 2px solid; }
.mountain-mark { position: relative; width: 118px; height: 58px; margin-bottom: 18px; opacity: .5; }
.mountain-mark span { position: absolute; bottom: 7px; width: 58px; height: 38px; border-top: 1px solid var(--muted); transform: rotate(-30deg) skewX(22deg); }
.mountain-mark span:nth-child(1) { left: 8px; }
.mountain-mark span:nth-child(2) { left: 43px; width: 48px; height: 27px; transform: rotate(-36deg) skewX(30deg); }
.mountain-mark span:nth-child(3) { left: 63px; bottom: 1px; width: 35px; height: 20px; opacity: .55; }
.upload-board h2 { margin: 0; font: 600 28px/1.3 var(--serif); }
.upload-board > p { margin: 8px 0 0; color: var(--muted); }
.upload-button { min-width: 240px; margin-top: 24px; font: 20px var(--serif); }
.file-note { font-size: 13px; }.privacy-note, .privacy-inline { display: flex; align-items: center; gap: 7px; font-size: 12px; }.privacy-note { justify-content: center; flex-wrap: wrap; }
.upload-error { color: var(--cinnabar) !important; font-size: 13px; font-weight: 600; }
.sample-picker { position: absolute; z-index: 3; top: -40px; right: -74px; display: grid; width: 160px; justify-items: center; }
.sample-picker button { position: relative; overflow: hidden; width: 148px; height: 150px; margin: 0; padding: 7px 7px 27px; border: 1px solid rgba(93,79,62,.24); background: #f8f3e9; box-shadow: 0 12px 22px rgba(57,45,31,.16); cursor: pointer; transition: transform .2s ease, z-index .2s; }
.sample-picker button:nth-of-type(1) { z-index: 3; transform: rotate(5deg); }
.sample-picker button:nth-of-type(2) { z-index: 2; margin-top: -17px; transform: rotate(-4deg) translateX(25px); }
.sample-picker button:nth-of-type(3) { z-index: 1; margin-top: -17px; transform: rotate(6deg) translateX(10px); }
.sample-picker button:hover { z-index: 5; transform: rotate(0) scale(1.04); }
.sample-picker img { width: 100%; height: 100%; object-fit: cover; }
.sample-picker small { position: absolute; right: 7px; bottom: 6px; left: 7px; overflow: hidden; color: var(--muted); font: 11px var(--serif); text-align: center; white-space: nowrap; }
.state-analyzing, .state-understood, .state-editor, .state-generated { display: grid; grid-template-columns: minmax(0, 1.38fr) minmax(360px, .82fr); gap: 48px; align-items: center; }
.preview-frame { position: relative; border: 1px solid var(--line); padding: 36px 12px 12px; background: rgba(255,252,245,.5); }
.preview-frame > img, .poster-canvas img { width: 100%; max-height: 560px; object-fit: contain; }
.preview-label { position: absolute; top: 10px; left: 14px; display: flex; align-items: center; gap: 8px; font: 13px var(--serif); }
.preview-label i { width: 7px; height: 7px; border-radius: 50%; background: var(--cinnabar); }
.text-action { display: block; margin: 15px auto 0; border: 0; color: var(--muted); background: transparent; cursor: pointer; }
.analysis-panel, .understanding-panel, .editor-panel, .result-panel { padding-right: 12px; }
.panel-title { margin: 24px 0 12px; font: 700 clamp(34px, 3.5vw, 52px)/1.15 var(--serif); }
.analysis-panel > p { color: var(--muted); }
.progress-list { position: relative; display: grid; gap: 5px; margin: 32px 0 0; padding: 0; list-style: none; }
.progress-list li { position: relative; display: grid; gap: 4px; min-height: 62px; padding: 0 0 14px 42px; }
.progress-list li::before { position: absolute; top: 2px; left: 4px; display: grid; width: 24px; height: 24px; place-items: center; border: 1px solid var(--cinnabar); border-radius: 50%; color: white; content: ""; }
.progress-list li.done::before { content: "✓"; background: var(--cinnabar); }
.progress-list li:not(:last-child)::after { position: absolute; top: 27px; bottom: 0; left: 15px; width: 1px; content: ""; background: var(--cinnabar); }
.progress-list span { color: var(--muted); font-size: 12px; }
.progress-list .active::after { position: absolute; left: 42px; bottom: 5px; width: 60%; height: 2px; content: ""; background: linear-gradient(90deg, var(--cinnabar) 70%, rgba(181,72,54,.15) 70%); animation: searching 1.4s ease-in-out infinite alternate; }
.analyzing-steps li::before { background: rgba(181,72,54,.08); }
.analyzing-steps li.active::before { background: var(--cinnabar); box-shadow: 0 0 0 6px rgba(181,72,54,.09); animation: pulse 1.3s ease-in-out infinite alternate; }
.preview-label.failed { color: var(--cinnabar); }.preview-label.failed i { background: var(--cinnabar); }
.analysis-error { color: var(--cinnabar) !important; line-height: 1.7; }
.analysis-actions { display: flex; align-items: center; gap: 22px; margin-top: 26px; }.analysis-actions .primary-button { min-width: 150px; }
.understanding-list { display: grid; margin: 28px 0 0; border-top: 1px solid var(--line); }.understanding-list div { display: grid; grid-template-columns: 64px 1fr; gap: 18px; padding: 16px 0; border-bottom: 1px solid var(--line); }.understanding-list dt { color: var(--cinnabar); font: 600 15px var(--serif); letter-spacing: .12em; }.understanding-list dd { margin: 0; font: 18px/1.65 var(--serif); }.understanding-panel blockquote { margin: 24px 0 0; padding-left: 18px; border-left: 2px solid var(--cinnabar); font: 22px/1.7 var(--serif); }.confidence { margin: 12px 0 0; color: var(--muted); font-size: 12px; letter-spacing: .08em; }
.privacy-inline { margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--line); }
.poster-canvas { position: relative; overflow: hidden; }
.vertical-poem { position: absolute; top: 13%; right: 8%; display: flex; flex-direction: row-reverse; align-items: flex-start; gap: 10px; font-family: var(--serif); writing-mode: vertical-rl; }
.poster-canvas.layout-古意竖排 .vertical-poem small { position: absolute; top: 0; right: -2.2em; margin: 0; font-size: clamp(14px, 1.1vw, 18px); line-height: 1; letter-spacing: .04em; white-space: nowrap; writing-mode: vertical-rl; text-orientation: upright; }
.poster-canvas.layout-古意竖排 .mini-stamp { position: absolute; top: -4.2em; right: -3.8em; margin: 0; }
.poster-canvas.font-宋体 .vertical-poem { font-family: SimSun, var(--serif); }
.poster-canvas.font-行楷 .vertical-poem { font-family: STXingkai, KaiTi, var(--serif); }
.poster-canvas.color-米白 .vertical-poem { color: #fffaf0; }
.poster-canvas.color-米白 .vertical-poem strong, .poster-canvas.color-米白 .vertical-poem small { text-shadow: 0 1px 3px rgba(0,0,0,.85), 0 0 6px rgba(0,0,0,.5); -webkit-text-stroke: clamp(.45px, .08vw, 1px) rgba(0,0,0,.88); paint-order: stroke fill; }
.poster-canvas.color-朱砂 .vertical-poem { color: var(--cinnabar); }
.poster-canvas.position-上 .vertical-poem { top: 5%; }
.poster-canvas.position-下 .vertical-poem { top: 42%; }
.poster-canvas.layout-留白题诗 .vertical-poem, .poster-canvas.layout-画心题跋 .vertical-poem { top: auto; right: 7%; bottom: 8%; left: 7%; display: grid; justify-items: center; gap: 5px; padding: 18px; text-align: center; writing-mode: horizontal-tb; }
.poster-canvas.layout-留白题诗 .vertical-poem { color: #fffaf0; background: rgba(17,15,12,.38); text-shadow: 0 1px 5px rgba(0,0,0,.45); }
.poster-canvas.layout-画心题跋 .vertical-poem { color: var(--ink); background: rgba(244,240,231,.88); }
.poster-canvas.layout-留白题诗.color-墨黑 .vertical-poem, .poster-canvas.layout-画心题跋.color-墨黑 .vertical-poem { color: var(--ink); }
.poster-canvas.layout-留白题诗.color-米白 .vertical-poem, .poster-canvas.layout-画心题跋.color-米白 .vertical-poem { color: #fffaf0; }
.poster-canvas.layout-留白题诗.color-朱砂 .vertical-poem, .poster-canvas.layout-画心题跋.color-朱砂 .vertical-poem { color: var(--cinnabar); }
.poster-canvas.layout-留白题诗.position-上 .vertical-poem, .poster-canvas.layout-画心题跋.position-上 .vertical-poem { top: 7%; bottom: auto; }
.poster-canvas.layout-留白题诗.position-中 .vertical-poem, .poster-canvas.layout-画心题跋.position-中 .vertical-poem { top: 40%; bottom: auto; }
.vertical-poem strong { font-size: clamp(20px, 2.1vw, 34px); line-height: 1.28; letter-spacing: .08em; }
.vertical-poem small { margin-top: 20px; font-size: 12px; }
.mini-stamp { margin-top: 110px; padding: 5px 3px; border: 1px solid var(--cinnabar); border-radius: 3px; color: var(--cinnabar); font-size: 10px; }
.poem-result { margin: 25px 0 7px; font: 700 33px/1.4 var(--serif); }
.poem-source { margin: 0; color: var(--muted); font-family: var(--serif); }
.match-reason { margin: 20px 0 10px; color: var(--muted); line-height: 1.7; }
.full-poem { margin: 12px 0 0; padding: 14px 16px; border-left: 2px solid var(--cinnabar); background: rgba(181,72,54,.045); }
.full-poem p { margin: 0 0 8px; font: 17px/1.75 var(--serif); }
.full-poem small { color: var(--muted); line-height: 1.6; }
.inline-link { border: 0; padding: 5px 0; color: var(--cinnabar); background: transparent; cursor: pointer; }
.controls { margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--line); }
.controls h3 { margin: 0 0 15px; font: 600 20px var(--serif); }
.color-row, .switch-row { display: flex; align-items: center; gap: 12px; margin-top: 12px; font-size: 13px; }
.color-row > span { width: 64px; }.color { width: 24px; height: 24px; border: 1px solid var(--line); border-radius: 50%; cursor: pointer; }.color.selected { outline: 1px solid var(--cinnabar); outline-offset: 3px; }.black { background: var(--ink); }.cream { background: #fffaf0; }.red { background: var(--cinnabar); }
.switch-row { justify-content: space-between; }.switch-row label { display: flex; align-items: center; gap: 8px; }.switch-row input { position: absolute; opacity: 0; }.switch-row i { position: relative; width: 38px; height: 21px; border-radius: 20px; background: var(--line); transition: background .2s; }.switch-row input:checked + i { background: var(--cinnabar); }.switch-row i::after { position: absolute; top: 3px; left: 3px; width: 15px; height: 15px; border-radius: 50%; content: ""; background: white; transition: transform .2s; }.switch-row input:checked + i::after { transform: translateX(17px); }
.generate-button, .download-button { width: 100%; margin-top: 20px; font: 20px var(--serif); }.ratio-note { display: block; margin-top: 8px; color: var(--muted); text-align: center; }
.preview-label.success { color: var(--cinnabar); }.result-lead { color: var(--muted); font: 20px/1.7 var(--serif); }.result-meta { display: grid; gap: 8px; margin: 32px 0 8px; }.result-meta b { font: 28px var(--serif); }.result-meta span { color: var(--muted); }.result-poem { margin: 12px 0 6px; color: var(--ink); font: 18px/1.85 var(--serif); letter-spacing: .06em; }.download-button { display: flex; align-items: center; justify-content: center; gap: 10px; }.redo { display: block; margin: 16px auto; }.trust-line, .deleted-line { color: var(--muted); text-align: center; font-size: 13px; }.deleted-line { display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: 30px; padding-top: 24px; border-top: 1px solid var(--line); color: var(--cinnabar); }
.generate-button:disabled { cursor: wait; opacity: .72; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
@keyframes searching { from { transform: scaleX(.86); transform-origin: left; } to { transform: scaleX(1); transform-origin: left; } }
@keyframes pulse { from { transform: scale(.9); opacity: .65; } to { transform: scale(1); opacity: 1; } }
@media (min-width: 851px) {
  .state-idle .upload-board { min-height: 485px; }
}
@media (min-width: 1121px) and (max-width: 1600px) {
  .sample-picker { right: -8px; }
}
@media (max-width: 850px) {
  .state-idle { display: grid; grid-template-columns: 1fr; gap: 20px; }
  .sample-picker { position: static; display: grid; width: auto; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
  .sample-picker button { width: 100%; height: 98px; margin: 0 !important; padding: 4px; transform: none !important; }
  .sample-picker small { display: none; }
  .state-analyzing, .state-understood, .state-editor, .state-generated { grid-template-columns: 1fr; gap: 28px; }
  .analysis-panel, .understanding-panel, .editor-panel, .result-panel { padding-right: 0; }
}
@media (max-width: 520px) {
  .upload-board { min-height: 365px; padding: 32px 18px; text-align: center; }
  .upload-board h2 { font-size: 24px; }.upload-button { width: 280px; min-width: 0; }
  .state-idle { gap: 18px; }.sample-picker button { min-height: 78px; }
  .preview-frame { padding-top: 34px; }.poster-preview { padding-inline: 6px; }
  .vertical-poem { top: 8%; right: 4%; gap: 3px; }.vertical-poem strong { font-size: 13px; line-height: 1.22; }.poster-canvas.layout-古意竖排 .vertical-poem small { right: -2.15em; font-size: 11px; }.vertical-poem small { margin-top: 8px; }.mini-stamp { margin-top: 42px; font-size: 8px; }
  .poem-result { font-size: 27px; }.match-reason { font-size: 14px; }.switch-row { align-items: flex-start; flex-direction: column; }
}
</style>
