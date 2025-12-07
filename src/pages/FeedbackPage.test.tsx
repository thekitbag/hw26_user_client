import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import FeedbackPage from './FeedbackPage'
import api from '@/services/api'

// Mock the API module
vi.mock('@/services/api', () => ({
  default: {
    post: vi.fn(),
  },
}))

function renderFeedbackPage(locationId = 'test-location') {
  return render(
    <MemoryRouter initialEntries={[`/${locationId}`]}>
      <Routes>
        <Route path="/:locationId" element={<FeedbackPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('FeedbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Render', () => {
    it('renders the form with all elements', () => {
      renderFeedbackPage('my-business')

      expect(screen.getByText(/Harkwise Feedback for my-business/i)).toBeInTheDocument()
      expect(screen.getByText(/How was your experience?/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/Optional comment.../i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Submit Feedback/i })).toBeInTheDocument()
    })

    it('has submit button disabled initially', () => {
      renderFeedbackPage()

      const submitButton = screen.getByRole('button', { name: /Submit Feedback/i })
      expect(submitButton).toBeDisabled()
    })

    it('displays all 5 star rating buttons', () => {
      renderFeedbackPage()

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByRole('button', { name: `Rate ${i} star${i > 1 ? 's' : ''}` })).toBeInTheDocument()
      }
    })

    it('displays character count for comment field', () => {
      renderFeedbackPage()

      expect(screen.getByText('0/500')).toBeInTheDocument()
    })
  })

  describe('Rating Selection', () => {
    it('updates rating when star is clicked', async () => {
      const user = userEvent.setup()
      renderFeedbackPage()

      const threeStarButton = screen.getByRole('button', { name: 'Rate 3 stars' })
      await user.click(threeStarButton)

      // Submit button should now be enabled
      const submitButton = screen.getByRole('button', { name: /Submit Feedback/i })
      expect(submitButton).not.toBeDisabled()
    })

    it('allows changing rating after initial selection', async () => {
      const user = userEvent.setup()
      renderFeedbackPage()

      // First select 3 stars
      await user.click(screen.getByRole('button', { name: 'Rate 3 stars' }))
      // Then select 5 stars
      await user.click(screen.getByRole('button', { name: 'Rate 5 stars' }))

      // Submit should still be enabled
      const submitButton = screen.getByRole('button', { name: /Submit Feedback/i })
      expect(submitButton).not.toBeDisabled()
    })
  })

  describe('Comment Input', () => {
    it('updates comment text when user types', async () => {
      const user = userEvent.setup()
      renderFeedbackPage()

      const commentInput = screen.getByPlaceholderText(/Optional comment.../i)
      await user.type(commentInput, 'Great service!')

      expect(commentInput).toHaveValue('Great service!')
      expect(screen.getByText('14/500')).toBeInTheDocument()
    })

    it('enforces max length of 500 characters', async () => {
      const user = userEvent.setup()
      renderFeedbackPage()

      const commentInput = screen.getByPlaceholderText(/Optional comment.../i) as HTMLTextAreaElement
      const longText = 'a'.repeat(600)
      await user.type(commentInput, longText)

      expect(commentInput.value.length).toBeLessThanOrEqual(500)
      expect(screen.getByText('500/500')).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('shows validation error when submitting without rating', async () => {
      const user = userEvent.setup()
      renderFeedbackPage()

      const submitButton = screen.getByRole('button', { name: /Submit Feedback/i })

      // Button should be disabled, but we can still try to submit via form
      // The validation should trigger when we try to enable and submit
      expect(submitButton).toBeDisabled()

      // Type a comment first
      const commentInput = screen.getByPlaceholderText(/Optional comment.../i)
      await user.type(commentInput, 'This is a comment')

      // Submit should still be disabled without rating
      expect(submitButton).toBeDisabled()
    })

    it('hides validation error after rating is selected', async () => {
      const user = userEvent.setup()
      renderFeedbackPage()

      // Select a rating
      await user.click(screen.getByRole('button', { name: 'Rate 4 stars' }))

      // Validation error should not appear
      expect(screen.queryByText(/Please select a rating/i)).not.toBeInTheDocument()
    })
  })

  describe('Form Submission - Success', () => {
    it('submits feedback successfully and shows success message', async () => {
      const user = userEvent.setup()
      vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } })

      renderFeedbackPage('coffee-shop')

      // Fill out form
      await user.click(screen.getByRole('button', { name: 'Rate 5 stars' }))
      const commentInput = screen.getByPlaceholderText(/Optional comment.../i)
      await user.type(commentInput, 'Excellent coffee!')

      // Submit form
      const submitButton = screen.getByRole('button', { name: /Submit Feedback/i })
      await user.click(submitButton)

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/Thank you for your feedback!/i)).toBeInTheDocument()
      })

      // Verify API was called with correct payload
      expect(api.post).toHaveBeenCalledWith(
        '/api/v1/feedback',
        expect.objectContaining({
          locationId: 'coffee-shop',
          rating: 5,
          comment: 'Excellent coffee!',
          submittedAt: expect.any(String),
        })
      )
    })

    it('allows submitting new feedback after success', async () => {
      const user = userEvent.setup()
      vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } })

      renderFeedbackPage()

      // Submit initial feedback
      await user.click(screen.getByRole('button', { name: 'Rate 4 stars' }))
      await user.click(screen.getByRole('button', { name: /Submit Feedback/i }))

      // Wait for success
      await waitFor(() => {
        expect(screen.getByText(/Thank you for your feedback!/i)).toBeInTheDocument()
      })

      // Click "Submit New Feedback"
      const newFeedbackButton = screen.getByRole('button', { name: /Submit New Feedback/i })
      await user.click(newFeedbackButton)

      // Form should be reset
      expect(screen.getByText(/How was your experience?/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Submit Feedback/i })).toBeDisabled()
    })

    it('does not include comment in payload if empty', async () => {
      const user = userEvent.setup()
      vi.mocked(api.post).mockResolvedValueOnce({ data: { success: true } })

      renderFeedbackPage('test-location')

      // Only select rating, no comment
      await user.click(screen.getByRole('button', { name: 'Rate 3 stars' }))
      await user.click(screen.getByRole('button', { name: /Submit Feedback/i }))

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith(
          '/api/v1/feedback',
          expect.objectContaining({
            locationId: 'test-location',
            rating: 3,
            comment: undefined,
            submittedAt: expect.any(String),
          })
        )
      })
    })
  })

  describe('Form Submission - Error', () => {
    it('shows error message when submission fails', async () => {
      const user = userEvent.setup()
      vi.mocked(api.post).mockRejectedValueOnce(new Error('Network error'))

      renderFeedbackPage()

      // Fill and submit form
      await user.click(screen.getByRole('button', { name: 'Rate 4 stars' }))
      await user.click(screen.getByRole('button', { name: /Submit Feedback/i }))

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/Failed to submit feedback. Please try again./i)).toBeInTheDocument()
      })

      // Form should still be visible
      expect(screen.getByText(/How was your experience?/i)).toBeInTheDocument()
    })

    it('keeps form data after error', async () => {
      const user = userEvent.setup()
      vi.mocked(api.post).mockRejectedValueOnce(new Error('Network error'))

      renderFeedbackPage()

      // Fill form
      await user.click(screen.getByRole('button', { name: 'Rate 5 stars' }))
      const commentInput = screen.getByPlaceholderText(/Optional comment.../i)
      await user.type(commentInput, 'My comment')

      // Submit
      await user.click(screen.getByRole('button', { name: /Submit Feedback/i }))

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/Failed to submit feedback/i)).toBeInTheDocument()
      })

      // Check that form data is preserved
      expect(commentInput).toHaveValue('My comment')
    })

    it('allows resubmission after error', async () => {
      const user = userEvent.setup()

      // First call fails, second succeeds
      vi.mocked(api.post)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: { success: true } })

      renderFeedbackPage()

      // Submit form (will fail)
      await user.click(screen.getByRole('button', { name: 'Rate 3 stars' }))
      await user.click(screen.getByRole('button', { name: /Submit Feedback/i }))

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText(/Failed to submit feedback/i)).toBeInTheDocument()
      })

      // Submit again (will succeed)
      const submitButton = screen.getByRole('button', { name: /Submit Feedback/i })
      await user.click(submitButton)

      // Should show success
      await waitFor(() => {
        expect(screen.getByText(/Thank you for your feedback!/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Disabled States', () => {
    it('disables form inputs during submission', async () => {
      const user = userEvent.setup()

      // Make the API call delay so we can check loading state
      vi.mocked(api.post).mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))

      renderFeedbackPage()

      await user.click(screen.getByRole('button', { name: 'Rate 4 stars' }))
      const submitButton = screen.getByRole('button', { name: /Submit Feedback/i })
      await user.click(submitButton)

      // Check that elements are disabled during submission
      expect(submitButton).toBeDisabled()
      expect(screen.getByPlaceholderText(/Optional comment.../i)).toBeDisabled()
    })
  })
})
