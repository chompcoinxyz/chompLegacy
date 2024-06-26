export default function manifest() {
  return {
    name: 'CHOMP Legacy',
    short_name: 'CHOMP Legacy',
    description: 'Mint Chomp Legacy NFTs by Staking Chomp',
    start_url: '/',
    display: 'standalone',
    background_color: '#202037',
    theme_color: '#202037',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}