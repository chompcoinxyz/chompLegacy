'use client';

import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia, base } from 'viem/chains';
import { WagmiProvider, cookieToInitialState } from 'wagmi';
import { createWeb3Modal } from '@web3modal/wagmi/react'
import wagmiConfig from '../../../config/wagmi';

const queryClient = new QueryClient();
const projectId = process.env.NEXT_PUBLIC_WALLET_COINBASE_PROJECT_ID;
const chain = process.env.NEXT_PUBLIC_PROD !== 'false' ? base : baseSepolia;

createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  // enableOnramp: true // Optional - false as default
  name: 'CHOMP Legacy',
  description: 'Mint Chomp Legacy NFTs by Staking Chomp',
  url: 'https://chomplegacy.com',
  icons: [`${process.env.NEXT_PUBLIC_URL}/applie-icon.png`]
})

// const initialState = cookieToInitialState(wagmiConfig, headers().get('cookie'))
// const wagmiConfig = createWagmiConfig(rpcUrl);

function OnchainProviders({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider chain={chain}>
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
