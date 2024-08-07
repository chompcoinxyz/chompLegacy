'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia, base } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { createWeb3Modal } from '@web3modal/wagmi/react'
import wagmiConfig from '../../../config/wagmi';

const queryClient = new QueryClient();
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;
const chain = process.env.NEXT_PUBLIC_PROD !== 'false' ? base : baseSepolia;
// const chain = base;
const onchainKey = process.env.NEXT_PUBLIC_ONCHAINKIT_KEY;


createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  name: 'CHOMP Legacy',
  description: 'Mint Chomp Legacy NFTs by Staking Chomp',
  url: 'https://chomplegacy.com',
  icons: [`${process.env.NEXT_PUBLIC_URL}/applie-icon.png`],
  themeVariables: {
    '--w3m-z-index': 100000,
  },
})

function OnchainProviders({ children, }) {
  return (
    <WagmiProvider config={wagmiConfig} >
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={chain} apiKey={onchainKey} >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
