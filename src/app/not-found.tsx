import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page-container">
      <div className="text-center py-20">
        <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the page you are looking for does not exist or has been moved.
          Try one of our popular PDF tools below.
        </p>

        <div className="mb-12">
          <Link href="/" className="btn-primary">
            Go to Homepage
          </Link>
        </div>

        <div className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Popular PDF Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/merge-pdf"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-2 block">📄</span>
              <span className="font-medium text-gray-900">Merge PDF</span>
            </Link>
            <Link
              href="/split-pdf"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-2 block">✂️</span>
              <span className="font-medium text-gray-900">Split PDF</span>
            </Link>
            <Link
              href="/compress-pdf"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-2 block">🗜️</span>
              <span className="font-medium text-gray-900">Compress PDF</span>
            </Link>
            <Link
              href="/pdf-to-jpg"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-2 block">🖼️</span>
              <span className="font-medium text-gray-900">PDF to JPG</span>
            </Link>
            <Link
              href="/jpg-to-pdf"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-2 block">📷</span>
              <span className="font-medium text-gray-900">JPG to PDF</span>
            </Link>
            <Link
              href="/pdf-to-word"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-center"
            >
              <span className="text-2xl mb-2 block">📝</span>
              <span className="font-medium text-gray-900">PDF to Word</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
