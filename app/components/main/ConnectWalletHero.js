import React, { useState, useEffect } from 'react';
import { OnchainKitProvider,  } from '@coinbase/onchainkit';
import { ConnectAccount } from '@coinbase/onchainkit/wallet'; 
// import { WagmiProvider, CoinbaseWalletSDK, useWallet,  } from '@coinbase/wallet-sdk';
import { useAccount, useDisconnect } from 'wagmi';
import Nav from './Nav';

// const sdk = new CoinbaseWalletSDK({
//   appName: 'Chomp Legacy',
//   appChainIds: [8453]
// });

export default function ConnectWalletHero({ 
  connectWallet,
  account,
  isConnecting,
}) {
    
  return (
    <div className="border border-white solid rounded-[20px] py-[25px] px-[50px]">
      <Nav connectWallet={connectWallet} account={account} />
      <h1 className="font-amiger text-[55px] pt-[120px] uppercase text-white text-center title__shadow opacity-99">stake chomp, gather dots, mint legacy.</h1>
      <div className="w-full flex justify-center mt-[50px] mb-[120px]">
        {!account ? (
          <button
            type="submit" 
            onClick={connectWallet}
            disabled={isConnecting}
            className={`w-[285px] text-center py-[12px] px-[25px] text-[19px] leading-[27px] rounded-[9px] opacity-99 font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#F88040] to-[#FD603D] hover:opacity-80 btn__shadow`}
          >
            Connect Wallet
          </button>
        ) : (
          <div className="">Stake</div>
        )}
        
      </div>
    </div>
  );
}
