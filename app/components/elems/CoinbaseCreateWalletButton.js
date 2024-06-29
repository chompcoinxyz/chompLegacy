import React, { useCallback, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import CoinbaseWalletLogo from './CoinbaseWalletLogo';

const buttonStyles = {
  border: '1px solid white',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: 18,
  borderRadius: 11,
};

export default function CoinbaseCreateWalletButton({ setAccount, setWeb3, updateProvider }) {
  const { connectors, connect, data } = useConnect();
  const { address, status, accountStatus } = useAccount()
  const connector = connectors[0];
  const { disconnect } = useDisconnect();

  // console.log('==== connector in CoinbaseCreateWalletButton', connector)
  // console.log('==== address in CoinbaseCreateWalletButton', address)
  // console.log('==== accountStatus in CoinbaseCreateWalletButton', accountStatus)
  // console.log('==== status in CoinbaseCreateWalletButton', status)

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      connector => connector.id === 'coinbaseWalletSDK'
    );

    // console.log('=== coinbaseWalletConnector', coinbaseWalletConnector)
    // console.log('=== data in hook', data) 

    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });

      updateProvider(coinbaseWalletConnector)
    }

  }, [connectors, connect]);

  useEffect(() => {
    if (!address) return;
    // console.log('===== address in useEffect', address)
    setAccount(address);

    // const web3 = new Web3(provider);
    // setWeb3(web3);
  }, [address]);

  const handleDisconnectWallet = useCallback(() => {
    disconnect({ connector });
    setAccount(null)
  }, [disconnect]);

  console.log('=== data in coinbase smart wallet', data)

  return (
    <>
      {!status || status !== 'connected' ? (
        <button 
          style={buttonStyles} 
          onClick={createWallet} 
          className={`w-full sm:w-[200px] py-[12px] opacity-99 px-[25px] leading-[27px] bg-primary sm:bg-white hover:border-slate-200 hover:bg-slate-200`}
        >
          <span className="mr-1"><CoinbaseWalletLogo /></span>
          Create Wallet
        </button>
      ) : (
        <>
          {status === 'connected' && (
            <button 
              style={buttonStyles} 
              onClick={handleDisconnectWallet} 
              className={`w-full sm:w-[200px] py-[12px] opacity-99 px-[25px] leading-[27px] bg-primary sm:bg-white hover:border-slate-200 hover:bg-slate-200`}
            >
              <span className="mr-1"><CoinbaseWalletLogo /></span>
              Log Out
            </button>
          )}
        </>
      )}
    </>
  );
}
