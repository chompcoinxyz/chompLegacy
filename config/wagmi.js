import { createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
const chain = process.env.NEXT_PUBLIC_PROD !== 'false' ? base : baseSepolia;
// const chain = base;
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID;

const metadata = {
  name: 'CHOMP Legacy',
  description: 'Mint Chomp Legacy NFTs by Staking Chomp',
  url: 'https://chomplegacy.com',
  icons: [`${process.env.NEXT_PUBLIC_URL}/applie-icon.png`]
}

const wagmiConfig = createConfig({
  chains: [chain],
  connectors: [
    coinbaseWallet({
      appChainIds: [chain.id],
      appName: 'CHOMP Legacy',
    }),
    walletConnect({ projectId, metadata, showQrModal: false }),
  ],
  ssr: true,
  transports: {
    [chain.id]: http(),
    // [chain.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
  storage: createStorage({
    storage: cookieStorage
  }),
  // multiInjectedProviderDiscovery: false,
});

export default wagmiConfig;