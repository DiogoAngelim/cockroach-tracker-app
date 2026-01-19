"use client";

import React from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }, []);
  return <>{children}</>;
}
