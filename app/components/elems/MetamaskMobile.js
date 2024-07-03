import React from 'react';
import WalletIcon from './Wallet';
import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function MetamaskMobile() {
  const { open } = useWeb3Modal()

  return (
    // <a
    //   href={`https://metamask.app.link/dapp/${process.env.NEXT_PUBLIC_METAMASK_URL}`} 
    //   className={`w-full flex flex-row items-center justify-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[11px] border border-primary text-black opacity-99 bg-primary hover:opacity-80`}
    // >
    //   <WalletIcon />
    //   <span className="ml-2 font-bold text-[18px]">Connect Wallet</span>
    // </a>
    <button
      onClick={() => open()}
      className={`w-full flex flex-row items-center justify-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[11px] border border-primary text-black opacity-99 bg-primary hover:opacity-80`}
    >
      <WalletIcon />
      <span className="ml-2 font-bold text-[18px]">Connect Wallet</span>
    </button>
  );
}
