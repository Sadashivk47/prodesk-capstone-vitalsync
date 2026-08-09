import './globals.css';

export const metadata = {
  title: 'VitalSync | Warm Clinical Platform',
  description: 'Unifying clinical workflows with the power of human-centered AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#f8f3eb] text-[#1d1c17] min-h-screen selection:bg-[#dee0ff] selection:text-[#00105b]">
        {children}
      </body>
    </html>
  );
}

