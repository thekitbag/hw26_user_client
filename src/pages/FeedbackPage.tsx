import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AlertCircle, CheckCircle } from 'lucide-react'
import StarRating from '@/components/StarRating'
import api from '@/services/api'
import type { FeedbackPayload, SubmissionStatus } from '@/types/feedback'

const MAX_COMMENT_LENGTH = 500

function FeedbackPage() {
  const { locationId } = useParams<{ locationId: string }>()
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState<string>('')
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showValidationError, setShowValidationError] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate rating
    if (rating === 0) {
      setShowValidationError(true)
      return
    }

    setShowValidationError(false)
    setSubmissionStatus('loading')
    setErrorMessage('')

    try {
      const payload: FeedbackPayload = {
        locationId: locationId ?? '',
        rating,
        comment: comment.trim() || undefined,
        submittedAt: new Date().toISOString(),
      }

      await api.post('/api/v1/feedback', payload)
      setSubmissionStatus('success')
    } catch {
      setSubmissionStatus('error')
      setErrorMessage('Failed to submit feedback. Please try again.')
    }
  }

  const handleReset = () => {
    setRating(0)
    setComment('')
    setSubmissionStatus('idle')
    setErrorMessage('')
    setShowValidationError(false)
  }

  const isFormDisabled = submissionStatus === 'loading' || submissionStatus === 'success'
  const isSubmitDisabled = rating === 0 || isFormDisabled

  if (submissionStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thank you for your feedback!
          </h2>
          <p className="text-gray-600 mb-6">
            Your feedback helps us improve our service.
          </p>
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit New Feedback
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Harkwise Feedback for {locationId}
        </h2>
        <p className="text-gray-600 mb-8 text-center">
          We value your opinion! Please rate your experience.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              How was your experience?
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              disabled={isFormDisabled}
            />
            {showValidationError && rating === 0 && (
              <p className="text-red-600 text-sm mt-2 text-center">
                Please select a rating before submitting
              </p>
            )}
          </div>

          {/* Comment Section */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Optional comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional comment..."
              maxLength={MAX_COMMENT_LENGTH}
              disabled={isFormDisabled}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            />
            <p className="text-sm text-gray-500 mt-1 text-right">
              {comment.length}/{MAX_COMMENT_LENGTH}
            </p>
          </div>

          {/* Error Message */}
          {submissionStatus === 'error' && errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isSubmitDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {submissionStatus === 'loading' ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FeedbackPage
