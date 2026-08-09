'use client';

import App from '../App';
import { ToastProvider } from '../components/ui/Toast';

export default function Page() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}

