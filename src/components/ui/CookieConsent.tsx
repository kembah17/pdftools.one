"use client";

import { useState, useEffect } from "react";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-surface dark:bg-surface-dark-alt border-t border-border dark:border-border-dark shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-light dark:text-text-dark-muted">
          We use cookies for analytics and to improve your experience. Your PDF files are never stored or transmitted.
        </p>
        <div className="flex items-center gap-3">
          <button onClick={decline} className="btn-secondary text-sm !px-4 !py-2">
            Decline
          </button>
          <button onClick={accept} className="btn-primary text-sm !px-4 !py-2">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
