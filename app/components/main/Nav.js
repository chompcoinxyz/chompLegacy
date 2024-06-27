import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MetamaskMobile from '../elems/MetamaskMobile';
import ArrowDown from '../elems/ArrowDown';
import Line from '../elems/Line';
import WalletIcon from '../elems/Wallet';
import CoinbaseCreateWalletButton from '../elems/CoinbaseCreateWalletButton';

export default function Nav({ connectWallet, account }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   
    function handleNavigationClick() {
        if (window && window.innerWidth < 1024) {
            setIsMobileMenuOpen(false);
        }
    }

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
          <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} w-full flex-col lg:hidden absolute top-[100px] right-0 rounded shadow-xl mx-auto p-4 bg-white z-20`} id="mobile-menu">
              <div className="mb-4 text-center"><CoinbaseCreateWalletButton isMobile={true} /></div>
              {!account ? (
                  <MetamaskMobile/>
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
            <div className="relative h-[150px] mt-[7px] mr-4"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}>

              <button className="text-white text-[18px] font-semibold px-4 py-2 focus:outline-none focus:shadow-outline flex flex-row items-center">
                  Buy CHOMP <span className="ml-1"><ArrowDown/></span>
              </button>

              {isDropdownOpen && (
                <div className="absolute mt-1 w-full rounded-md shadow-lg bg-white">
                    <div className="py-1">
                        <a href="#" className="text-[18px] block px-4 py-2 font-medium text-black hover:bg-gray-100">Coinbase ($)</a>
                        <div className="px-[10px]"><Line/></div>
                        <a href="https://app.uniswap.org/swap?outputCurrency=0xebff2db643cf955247339c8c6bcd8406308ca437&chain=base" className="text-[18px] block px-4 py-2 font-medium text-black hover:bg-gray-100">Uniswap (Ξ)</a>
                    </div>
                </div>
              )}
          </div>

          <div className="mr-4"><CoinbaseCreateWalletButton/></div>

            {!account ? (
              <button
                type="submit" 
                onClick={connectWallet}
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
