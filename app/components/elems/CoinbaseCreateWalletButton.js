import React, { useCallback } from 'react';
import { useConnect } from 'wagmi';
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

export default function CoinbaseCreateWalletButton() {
  const { connectors, connect } = useConnect();

  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      connector => connector.id === 'coinbaseWalletSDK'
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  return (
    <button 
      style={buttonStyles} 
      onClick={createWallet} 
      className={`w-full sm:w-[200px] py-[12px] opacity-99 px-[25px] leading-[27px] bg-primary sm:bg-white hover:border-slate-200 hover:bg-slate-200`}
    >
      <span className="mr-1"><CoinbaseWalletLogo /></span>
      Create Wallet
    </button>
  );
}
