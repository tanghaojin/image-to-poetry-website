import FingerprintJS from '@fingerprintjs/fingerprintjs'
import type { ImagePoetryResult } from '~/types/poetry'

type ImagePoetryErrorCode = 'fingerprint' | 'image' | 'busy' | 'timeout' | 'provider' | 'corpus' | 'network' | 'response-format' | 'request'

export class ImagePoetryError extends Error {
  constructor(public readonly code: ImagePoetryErrorCode) {
    super(code)
    this.name = 'ImagePoetryError'
  }
}

const REQUEST_TIMEOUT = 55_000
const FALLBACK_KEY = 'img2poetry-device-id'
let fingerprintPromise: Promise<string> | null = null

function fallbackFingerprint() {
  try {
    const existing = localStorage.getItem(FALLBACK_KEY)
    if (existing) return existing
    const generated = `fallback_${crypto.randomUUID().replaceAll('-', '')}`
    localStorage.setItem(FALLBACK_KEY, generated)
    return generated
  } catch {
    return `session_${crypto.randomUUID().replaceAll('-', '')}`
  }
}

async function deviceFingerprint() {
  if (!fingerprintPromise) {
    fingerprintPromise = FingerprintJS.load()
      .then(agent => agent.get())
      .then(result => result.visitorId)
      .catch(() => fallbackFingerprint())
  }
  return fingerprintPromise
}

async function sourceBlob(source: Blob | string) {
  if (source instanceof Blob) return source
  const response = await fetch(source)
  if (!response.ok) throw new ImagePoetryError('image')
  return response.blob()
}

function isValid(payload: unknown): payload is ImagePoetryResult {
  if (!payload || typeof payload !== 'object') return false
  const value = payload as Partial<ImagePoetryResult>
  return Boolean(value.understanding?.mood && value.poem?.id && value.poem.lines?.length
    && value.match?.algorithmVersion && typeof value.meta?.processingMs === 'number')
}

export function getImagePoetryErrorMessage(error: unknown) {
  if (!(error instanceof ImagePoetryError)) return '连接寻诗服务失败，请检查网络后重试。'
  const messages: Record<ImagePoetryErrorCode, string> = {
    fingerprint: '请求信息不完整，请刷新页面后重试。',
    image: '图片内容异常，请重新选择图片。',
    busy: '服务器繁忙，请稍后再试。',
    timeout: '图片分析等待超时，请重新尝试。',
    provider: '图片分析服务暂时不可用，请稍后再试。',
    corpus: '诗词库正在准备中，请稍后再试。',
    network: '连接寻诗服务失败，请检查网络后重试。',
    'response-format': '寻诗结果格式异常，请重新尝试。',
    request: '这次没有找到合适的诗句，请重新尝试。'
  }
  return messages[error.code]
}

export function useImagePoetry() {
  const config = useRuntimeConfig()
  let activeController: AbortController | null = null

  function cancel() {
    activeController?.abort()
    activeController = null
  }

  async function analyzeAndMatch(source: Blob | string) {
    cancel()
    const controller = new AbortController()
    activeController = controller
    let timedOut = false
    const timeout = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, REQUEST_TIMEOUT)
    try {
      const [image, fingerprint] = await Promise.all([sourceBlob(source), deviceFingerprint()])
      if (!fingerprint) throw new ImagePoetryError('fingerprint')
      const form = new FormData()
      form.append('image', image, image instanceof File ? image.name : 'image.jpg')
      const apiBase = String(config.public.apiBase || '').replace(/\/$/, '')
      const response = await fetch(`${apiBase}/api/v1/poetry/match`, {
        method: 'POST',
        headers: { 'X-Device-Fingerprint': fingerprint, 'X-Request-ID': `web_${crypto.randomUUID()}` },
        body: form,
        signal: controller.signal
      })
      let payload: any
      try { payload = await response.json() } catch { throw new ImagePoetryError('response-format') }
      if (!response.ok) {
        const code = String(payload?.error?.code || '')
        if (code === 'DEVICE_FINGERPRINT_MISSING') throw new ImagePoetryError('fingerprint')
        if (['IMAGE_MISSING', 'IMAGE_TOO_LARGE', 'IMAGE_TYPE_UNSUPPORTED', 'IMAGE_DECODE_FAILED'].includes(code)) throw new ImagePoetryError('image')
        if (['SERVER_BUSY', 'DEPENDENCY_UNAVAILABLE'].includes(code) || response.status === 429 || response.status === 503) {
          throw new ImagePoetryError('busy')
        }
        if (code === 'VISION_TIMEOUT') throw new ImagePoetryError('timeout')
        if (code === 'VISION_PROVIDER_UNAVAILABLE') throw new ImagePoetryError('provider')
        if (code === 'POETRY_CORPUS_UNAVAILABLE') throw new ImagePoetryError('corpus')
        throw new ImagePoetryError('request')
      }
      if (!isValid(payload)) throw new ImagePoetryError('response-format')
      return payload
    } catch (error) {
      if (timedOut) throw new ImagePoetryError('timeout')
      if (error instanceof ImagePoetryError) throw error
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      throw new ImagePoetryError('network')
    } finally {
      window.clearTimeout(timeout)
      if (activeController === controller) activeController = null
    }
  }
  return { analyzeAndMatch, cancel }
}
