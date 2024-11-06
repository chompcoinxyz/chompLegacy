import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ConnectWalletMobile from '../elems/ConnectWalletMobile';
import WalletIcon from '../elems/Wallet';
import CoinbaseCreateWalletButton from '../elems/CoinbaseCreateWalletButton';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import NavBuyChomp from './NavBuyChomp';


export default function Nav({ account, setAccount, updateProvider, setSwapModal }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { open } = useWeb3Modal()

    return (
      <div className="navbar">
        <div className="flex flex-row justify-between">
          <div className="logo">
            <Link href={"/"} className='cursor-pointer'>
              <Image 
                src="/img/logo.svg" 
                alt="Logo" 
                className='cursor-pointer'
                width="156" height="66"
              />
            </Link>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-primary md:hidden">
              <span className="sr-only">Toggle navigation</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} w-full flex-col lg:hidden absolute top-[100px] right-0 rounded shadow-xl mx-auto p-4 bg-white md:z-20 z-[1000]`} id="mobile-menu">
              <NavBuyChomp
                setIsDropdownOpen={setIsDropdownOpen}
                isDropdownOpen={isDropdownOpen}
                setSwapModal={setSwapModal}
                isMobile={true}
              />
              <div className="mb-4 text-center"><CoinbaseCreateWalletButton setAccount={setAccount} updateProvider={updateProvider} /></div>
              {!account ? (
                  <ConnectWalletMobile />
              ) : (
                <>
                  <button
                      className={`w-full flex flex-row items-center justify-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[11px] border border-primary text-black opacity-99 bg-primary hover:opacity-80`}
                    >
                    <WalletIcon />
                    <span className="ml-2 font-bold text-[18px]">{account.slice(0, 5)}...{account.slice(-4)}</span>
                  </button>
                </>
            )}
          </div>
          <div id="menu-2" className={`hidden md:flex md:ml-auto flex-row items-start mt-[7px]`}>
              
            <NavBuyChomp
              setIsDropdownOpen={setIsDropdownOpen}
              isDropdownOpen={isDropdownOpen}
              setSwapModal={setSwapModal}
              isMobile={false}
            />
            <div className="mr-4"><CoinbaseCreateWalletButton setAccount={setAccount} updateProvider={updateProvider} /></div>
              {!account ? (
                <button
                  type="submit" 
                  onClick={() => open()}
                  className={`flex flex-row opacity-99 items-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[11px] border border-white text-black bg-white hover:border-slate-200 hover:bg-slate-200`}
                >
                  <WalletIcon />
                  <span className="ml-2 font-bold text-[18px]">Connect</span>
                </button>
              ) : (
                <button
                  className={`flex flex-row opacity-99 items-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[11px] border border-white text-black bg-white hover:border-slate-200 hover:bg-slate-200`}
                >
                <WalletIcon />
                <span className="ml-2 font-bold text-[18px]">{account.slice(0, 5)}...{account.slice(-4)}</span>
              </button>
              )}
            </div>
        </div>
      </div>
    );
}
