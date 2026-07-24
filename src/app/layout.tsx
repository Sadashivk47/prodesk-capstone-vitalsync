import './globals.css';

export const metadata = {
  title: 'VitalSync',
  description: 'Clinical dashboard for doctors and patients',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
