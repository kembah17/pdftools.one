'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
      style={{ backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm flex-1" style={{ color: 'var(--color-text-secondary)' }}>
          We use cookies to improve your experience. No personal data is collected — all PDF processing happens in your browser.
        </p>
        <div className="flex gap-3">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ color: 'var(--color-text-tertiary)', backgroundColor: 'transparent', border: '1px solid var(--color-border)' }}
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF', border: 'none' }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
