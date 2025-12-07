export interface FeedbackPayload {
  locationId: string
  rating: number
  comment?: string
  submittedAt: string
}

export type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error'
