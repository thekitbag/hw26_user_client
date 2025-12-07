import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StarRating from './StarRating'

describe('StarRating', () => {
  it('renders all 5 stars', () => {
    const mockOnChange = vi.fn()
    render(<StarRating rating={0} onRatingChange={mockOnChange} />)

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole('button', { name: `Rate ${i} star${i > 1 ? 's' : ''}` })).toBeInTheDocument()
    }
  })

  it('displays selected rating with filled stars', () => {
    const mockOnChange = vi.fn()
    render(<StarRating rating={3} onRatingChange={mockOnChange} />)

    const stars = screen.getAllByRole('button')
    // First 3 stars should be filled (yellow)
    expect(stars[0]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    expect(stars[1]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    expect(stars[2]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    // Last 2 stars should be unfilled
    expect(stars[3]?.querySelector('svg')).toHaveClass('fill-none')
    expect(stars[4]?.querySelector('svg')).toHaveClass('fill-none')
  })

  it('calls onRatingChange when star is clicked', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    render(<StarRating rating={0} onRatingChange={mockOnChange} />)

    const fourthStar = screen.getByRole('button', { name: 'Rate 4 stars' })
    await user.click(fourthStar)

    expect(mockOnChange).toHaveBeenCalledWith(4)
  })

  it('shows hover preview when hovering over stars', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    render(<StarRating rating={2} onRatingChange={mockOnChange} />)

    const fourthStar = screen.getByRole('button', { name: 'Rate 4 stars' })
    await user.hover(fourthStar)

    const stars = screen.getAllByRole('button')
    // First 4 stars should be filled on hover
    expect(stars[0]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    expect(stars[1]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    expect(stars[2]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    expect(stars[3]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    // Last star should be unfilled
    expect(stars[4]?.querySelector('svg')).toHaveClass('fill-none')
  })

  it('restores original rating after hover leaves', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    render(<StarRating rating={2} onRatingChange={mockOnChange} />)

    const fourthStar = screen.getByRole('button', { name: 'Rate 4 stars' })
    await user.hover(fourthStar)
    await user.unhover(fourthStar)

    const stars = screen.getAllByRole('button')
    // Back to original 2 stars filled
    expect(stars[0]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    expect(stars[1]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    expect(stars[2]?.querySelector('svg')).toHaveClass('fill-none')
    expect(stars[3]?.querySelector('svg')).toHaveClass('fill-none')
    expect(stars[4]?.querySelector('svg')).toHaveClass('fill-none')
  })

  it('does not respond to hover when disabled', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    render(<StarRating rating={2} onRatingChange={mockOnChange} disabled />)

    const fourthStar = screen.getByRole('button', { name: 'Rate 4 stars' })
    await user.hover(fourthStar)

    const stars = screen.getAllByRole('button')
    // Should still show only 2 stars (original rating)
    expect(stars[0]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    expect(stars[1]?.querySelector('svg')).toHaveClass('fill-yellow-400')
    expect(stars[2]?.querySelector('svg')).toHaveClass('fill-none')
  })

  it('does not call onRatingChange when disabled', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    render(<StarRating rating={0} onRatingChange={mockOnChange} disabled />)

    const firstStar = screen.getByRole('button', { name: 'Rate 1 star' })
    await user.click(firstStar)

    expect(mockOnChange).not.toHaveBeenCalled()
  })
})
