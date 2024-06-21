import { OnchainKitProvider } from '@coinbase/onchainkit';

const OnchainKit = ({ children }) => {
  return (
    <OnchainKitProvider>
      {children}
    </OnchainKitProvider>
  );
};

export default OnchainKit;