import './globals.css';

export const metadata = {
  title: 'CHOMP Legacy',
  description: 'CHOMP Legacy',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'CHOMP Legacy',
    description: 'Mint Chomp Legacy NFTs by Staking Chomp',
    type: 'website',
    url: process.env.NEXT_PUBLIC_URL,
    images: [`${process.env.NEXT_PUBLIC_URL}/img/og_image3.png`], 
    site_name: "CHOMP Legacy",
  },
  other: {},
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={'bg-bgMain'}>
      <body>{children}</body>
    </html>
  )
}
