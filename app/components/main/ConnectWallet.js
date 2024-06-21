import React, { useState, useEffect } from 'react';
import { OnchainKitProvider,  } from '@coinbase/onchainkit';
import { ConnectAccount } from '@coinbase/onchainkit/wallet'; 
import { WagmiProvider, CoinbaseWalletSDK, useWallet,  } from '@coinbase/wallet-sdk';
import { useAccount, useDisconnect } from 'wagmi';

const sdk = new CoinbaseWalletSDK({
  appName: 'Chomp Legacy',
  appChainIds: [8453]
});

export default function ConnectWallet({ }) {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    console.log('wallet in useeffect', wallet)
  }, []);

  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();


  console.log('==== status', status)
  console.log('==== address', address)
    
  return (
      <div className="flex flex-col w-[200px]">
        {(() => {
  
          return (
            <div className="flex items-center justify-center">
              {!address ? (
                <div className="bg-blue-500 mt-4">
                  <ConnectAccount />
                </div>
              ) : (
                <button type="button" onClick={() => disconnect()}>
                </button>
              )}
            </div>
          );
        })()}

      </div>
    // </WagmiProvider>
  );
}
