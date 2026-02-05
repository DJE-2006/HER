import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Will You Be My Valentine? 💕',
  description: 'A special Valentine\'s Day surprise',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cormorant+Garamond:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}