const MAX_ANALYSIS_EDGE = 1600
const DIRECT_UPLOAD_LIMIT = 1.5 * 1024 * 1024
const ANALYSIS_QUALITY = 0.8

type DecodedImage = {
  source: CanvasImageSource
  width: number
  height: number
  dispose: () => void
}

function abortError() {
  return new DOMException('Image preparation aborted', 'AbortError')
}

function ensureActive(signal?: AbortSignal) {
  if (signal?.aborted) throw abortError()
}

async function decodeWithImageElement(file: File, signal?: AbortSignal): Promise<DecodedImage> {
  const url = URL.createObjectURL(file)
  const image = new Image()
  try {
    await new Promise<void>((resolve, reject) => {
      const onAbort = () => reject(abortError())
      const cleanup = () => signal?.removeEventListener('abort', onAbort)
      image.onload = () => { cleanup(); resolve() }
      image.onerror = () => { cleanup(); reject(new Error('Image decode failed')) }
      signal?.addEventListener('abort', onAbort, { once: true })
      image.src = url
    })
    ensureActive(signal)
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      dispose: () => URL.revokeObjectURL(url)
    }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

async function decodeImage(file: File, signal?: AbortSignal): Promise<DecodedImage> {
  ensureActive(signal)
  if (typeof createImageBitmap !== 'undefined') {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    if (signal?.aborted) {
      bitmap.close()
      throw abortError()
    }
    return { source: bitmap, width: bitmap.width, height: bitmap.height, dispose: () => bitmap.close() }
  }
  return decodeWithImageElement(file, signal)
}

function encodeCanvas(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality))
}

export async function prepareAnalysisImage(file: File, signal?: AbortSignal): Promise<Blob> {
  const decoded = await decodeImage(file, signal)
  try {
    ensureActive(signal)
    const longestEdge = Math.max(decoded.width, decoded.height)
    if (longestEdge <= MAX_ANALYSIS_EDGE && file.size <= DIRECT_UPLOAD_LIMIT) return file

    const scale = Math.min(1, MAX_ANALYSIS_EDGE / longestEdge)
    const width = Math.max(1, Math.round(decoded.width * scale))
    const height = Math.max(1, Math.round(decoded.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return file
    context.drawImage(decoded.source, 0, 0, width, height)
    ensureActive(signal)

    let compressed = await encodeCanvas(canvas, 'image/webp', ANALYSIS_QUALITY)
    if (!compressed || compressed.type !== 'image/webp') {
      compressed = await encodeCanvas(canvas, 'image/jpeg', ANALYSIS_QUALITY)
    }
    ensureActive(signal)
    return compressed && compressed.size < file.size ? compressed : file
  } finally {
    decoded.dispose()
  }
}

