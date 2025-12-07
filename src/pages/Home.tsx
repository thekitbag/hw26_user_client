import { Star } from 'lucide-react'

function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Harkwise User App
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Quick and anonymous feedback in seconds
        </p>

        {/* Placeholder feedback preview */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <p className="text-gray-700 mb-6">How was your experience?</p>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star
                key={rating}
                className="w-10 h-10 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Scan a QR code to get started
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
