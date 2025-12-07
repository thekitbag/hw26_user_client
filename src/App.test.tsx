import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '@/App'

describe('App', () => {
  it('renders the Harkwise User App heading', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByText('Harkwise User App')).toBeInTheDocument()
  })

  it('renders the star rating preview', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByText('How was your experience?')).toBeInTheDocument()
  })
})
