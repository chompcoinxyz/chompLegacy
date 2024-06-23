import './globals.css';
// import { OnchainKitProvider } from '@coinbase/onchainkit';

export const metadata = {
  title: 'CHOMP Legacy',
  description: 'CHOMP Legacy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={'bg-bgMain'}>
      <body>{children}</body>
    </html>
  )
}
