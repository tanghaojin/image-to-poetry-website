export interface ImageUnderstandingResult {
  subjects: string[]
  season: string
  time: string
  weather: string
  mood: string
  moods?: Array<{
    tag: string
    confidence: number
  }>
  sceneSummary: string
  confidence: number
}

export interface MatchedPoem {
  id: string
  title: string
  author: string
  dynasty: string
  genre: string
  lines: string[]
  selectedLineIndexes: number[]
}

export interface PoetryMatchResult {
  requestId: string
  understanding: ImageUnderstandingResult
  poem: MatchedPoem
  match: {
    score: number
    matchedTags: string[]
    reason: string
    algorithmVersion: string
  }
}

export interface ImagePoetryResult extends PoetryMatchResult {
  meta: {
    processingMs: number
  }
}
