import './globals.css';
import OnchainProviders from './components/providers/OnchainProviders';
// import { createWeb3Modal } from '@web3modal/wagmi/react'
// import { headers } from 'next/headers'
// import { cookieToInitialState } from 'wagmi';
// import wagmiConfig from './app/components/config/wagmi';


export const metadata = {
  title: 'CHOMP Legacy',
  description: 'Mint Chomp Legacy NFTs by Staking Chomp',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'CHOMP Legacy',
    description: 'Mint Chomp Legacy NFTs by Staking Chomp',
    type: 'website',
    url: process.env.NEXT_PUBLIC_URL,
    images: [`${process.env.NEXT_PUBLIC_URL}/img/og_image.png`], 
    site_name: "CHOMP Legacy",
  },
  other: {},
}

export default function RootLayout({ children }) {
  // const initialState = cookieToInitialState(wagmiConfig, headers().get('cookie'))
  return (
    <html lang="en" className={'bg-bgMain'}>
      <body>
        <OnchainProviders>{children}</OnchainProviders>
      </body>
    </html>
  )
}
