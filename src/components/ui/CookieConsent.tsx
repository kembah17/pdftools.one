'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-4xl mx-auto bg-surface border border-border rounded-xl shadow-lg p-4 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-text-light flex-1">
          We use cookies for analytics and to remember your preferences. All PDF processing happens in your browser — your files are never uploaded.
        </p>
        <button
          onClick={accept}
          className="px-5 py-2 bg-primary text-surface text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors whitespace-nowrap"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
