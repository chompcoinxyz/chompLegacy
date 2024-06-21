import { WagmiProvider } from '@coinbase/wallet-sdk';

const WalletProvider = ({ children }) => {
  return (
    <WagmiProvider>
      {children}
    </WagmiProvider>
  );
};

export default WalletProvider;