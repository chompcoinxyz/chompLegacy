import './globals.css';
// import { OnchainKitProvider } from '@coinbase/onchainkit';

export const metadata = {
  title: 'CHOMP Legacy',
  description: 'CHOMP Legacy',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={'bg-bgMain'}>
      <body>{children}</body>
    </html>
  )
}
