import React, { useState, useEffect } from 'react';
import { OnchainKitProvider,  } from '@coinbase/onchainkit';
import { ConnectAccount } from '@coinbase/onchainkit/wallet'; 
// import { WagmiProvider, CoinbaseWalletSDK, useWallet,  } from '@coinbase/wallet-sdk';
import { useAccount, useDisconnect } from 'wagmi';

// const sdk = new CoinbaseWalletSDK({
//   appName: 'Chomp Legacy',
//   appChainIds: [8453]
// });

export default function ConnectWallet({ setAccount }) {
  const [wallet, setWallet] = useState(null);

  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    console.log('wallet in useeffect', wallet)

    if (address) {
      setAccount(address)
    }

  }, [address]);

  console.log('==== status', status)
  console.log('==== wallet address', address)
    
  return (
      <div className="flex flex-col w-[200px]">
        <div className="flex items-center justify-center">
          {!address ? (
            <div className="bg-primary mt-4">
              <ConnectAccount />
            </div>
          ) : (
            <button type="button" onClick={() => disconnect()}>
            </button>
          )}
        </div>
      </div>
  );
}
