import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>City Guessing Game</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
