import { WagmiProvider } from '@coinbase/wallet-sdk';

const WalletProvider = ({ children }) => {
  console.log('=== WAGMI childred', children)
  return (
    <WagmiProvider>
      {children}
    </WagmiProvider>
  );
};

export default WalletProvider;