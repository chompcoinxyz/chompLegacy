import './globals.css';
// import { OnchainKitProvider } from '@coinbase/onchainkit';

export const metadata = {
  title: 'CHOMP Legacy',
  description: 'CHOMP Legacy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
