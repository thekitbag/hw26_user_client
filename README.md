# Harkwise User Client

Mobile-first web app for customers to submit quick, anonymous feedback via QR codes.

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Vitest** for testing with React Testing Library
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for HTTP requests
- **Lucide React** for icons

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` to set the backend API URL (defaults to `http://localhost:3000`).

### Development

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

Run tests:

```bash
npm test
```

Run tests once (CI mode):

```bash
npm test -- --run
```

## Code Quality

### Linting

```bash
npm run lint
```

### Formatting

Format all files:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

## Project Structure

```
src/
  assets/       # Images, fonts
  components/   # Shared UI components (Layout, etc.)
  hooks/        # Custom React hooks
  pages/        # Page components (Home, etc.)
  services/     # API calls (axios client configured)
  test/         # Test setup and utilities
  types/        # Global TypeScript types
  utils/        # Helper functions
  App.tsx       # Main app component with routing
  main.tsx      # Entry point
  index.css     # Global styles with Tailwind directives
```

## Path Aliases

The project uses `@/` as an alias for the `src/` directory. Import like this:

```typescript
import Layout from '@/components/Layout'
import api from '@/services/api'
```

## Features

- Mobile-first responsive design
- Fast feedback submission (<10s target)
- Anonymous (no user accounts)
- Offline capability (PWA features to be added)

## Next Steps

- Implement feedback form with star rating
- Add text note and tag inputs
- Integrate with backend API
- Add PWA features for offline support
- Implement QR code parameter handling
