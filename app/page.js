import Hero from './components/main/Hero';

import { getFrameMetadata } from '@coinbase/onchainkit/frame';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Learn about CHOMP',
      action: 'link',
      target: 'https://www.chompcoin.xyz/',
    },
    {
      label: 'Chomp Legacy',
      action: 'link',
      target: 'https://www.chomplegacy.com/',
    },
  ],
  image: `${process.env.NEXT_PUBLIC_URL}/img/og_image.png`,
});

export const metadata = {
  manifest: '/manifest.json',
  other: {
    ...frameMetadata
  },
};

export default function Home() {
  return (
    <main className={'bg-bgMain'}>
        <Hero/ >
    </main>
  )
}
