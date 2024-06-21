import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MetamaskMobile from '../elems/MetamaskMobile';

export default function Nav({ connectWallet, account }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    function handleNavigationClick() {
        if (window && window.innerWidth < 1024) {
            setIsMobileMenuOpen(false);
        }
    }

    // console.log('====== isMobileMenuOpen', isMobileMenuOpen)
    // console.log('====== account in nav', account)
    return (
      <section>
        <div className="navbar pt-[16px] px-4 xl:px-0">
          <div className="flex flex-row justify-between">
            <div className="logo">
              <Link href={"/"}>
                <Image 
                  src="/img/logo.png" 
                  alt="Logo" 
                  className='cursor-pointer'
                  width="40" height="40"
                />
              </Link>
            </div>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-primary md:hidden">
                <span className="sr-only">Toggle navigation</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            </button>
            <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} w-full flex-col lg:hidden absolute top-[70px] right-0 rounded shadow-xl mx-auto p-4 bg-white z-20`} id="mobile-menu">
                {/* <a href="https://app.uniswap.org/swap?outputCurrency=0xe3944ab788a60ca266f1eec3c26925b95f6370ad&chain=mainnet" target="_blank" rel="noopener noreferrer" className="py-2 px-4 block text-center" onClick={handleNavigationClick}>Access RAIN</a> */}
                {!account ? (
                    <MetamaskMobile/>
                ) : (
                <button
                  className={`w-[250px] mx-auto flex flex-row items-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[39px] border border-primary text-white bg-primary hover:border-blue-700 hover:bg-blue-700`}
                >
                <svg width="22" height="21" viewBox="0 0 22 21" className='mr-2' fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.7778 19.6969H3.22222C2.63285 19.6969 2.06762 19.4628 1.65087 19.046C1.23413 18.6293 1 18.064 1 17.4747V7.47466C1 6.88529 1.23413 6.32006 1.65087 5.90332C2.06762 5.48657 2.63285 5.25244 3.22222 5.25244H18.7778C19.3671 5.25244 19.9324 5.48657 20.3491 5.90332C20.7659 6.32006 21 6.88529 21 7.47466V17.4747C21 18.064 20.7659 18.6293 20.3491 19.046C19.9324 19.4628 19.3671 19.6969 18.7778 19.6969Z" stroke="white" strokeWidth="1.2"/>
                  <path d="M16 13.0302C15.8527 13.0302 15.7114 12.9717 15.6072 12.8675C15.503 12.7633 15.4445 12.622 15.4445 12.4747C15.4445 12.3273 15.503 12.186 15.6072 12.0818C15.7114 11.9776 15.8527 11.9191 16 11.9191C16.1474 11.9191 16.2887 11.9776 16.3929 12.0818C16.497 12.186 16.5556 12.3273 16.5556 12.4747C16.5556 12.622 16.497 12.7633 16.3929 12.8675C16.2887 12.9717 16.1474 13.0302 16 13.0302Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.6667 5.25243V3.70021C17.6666 3.35966 17.5882 3.02368 17.4376 2.71823C17.287 2.41278 17.0683 2.14602 16.7982 1.93856C16.5281 1.7311 16.214 1.58848 15.8801 1.52172C15.5461 1.45496 15.2013 1.46585 14.8722 1.55354L2.65 4.81243C2.17673 4.93855 1.75838 5.2175 1.45999 5.60591C1.1616 5.99431 0.999891 6.47042 1 6.96021V7.47466" stroke="white" strokeWidth="1.2"/>
                </svg>
                {account.slice(0, 9)}...
              </button>
              )}
            </div>
            <div id="menu-2" className={`hidden md:flex md:ml-auto flex-row items-center`}>
              {/* <button 
                  type="submit" 
                  className={`mr-[16px] py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[39px] border border-primary text-primary hover:border-blue-700 hover:text-blue-700`}
                >
                  <a href="https://app.uniswap.org/swap?outputCurrency=0xe3944ab788a60ca266f1eec3c26925b95f6370ad&chain=mainnet" target="_blank" rel="noopener noreferrer">Access RAIN</a>
              </button> */}
              {!account ? (
                <button
                  type="submit" 
                  onClick={connectWallet}
                  className={`flex flex-row items-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[39px] border border-primary text-white bg-primary hover:border-blue-700 hover:bg-blue-700`}
                >
                <svg width="22" height="21" viewBox="0 0 22 21" className='mr-2' fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.7778 19.6969H3.22222C2.63285 19.6969 2.06762 19.4628 1.65087 19.046C1.23413 18.6293 1 18.064 1 17.4747V7.47466C1 6.88529 1.23413 6.32006 1.65087 5.90332C2.06762 5.48657 2.63285 5.25244 3.22222 5.25244H18.7778C19.3671 5.25244 19.9324 5.48657 20.3491 5.90332C20.7659 6.32006 21 6.88529 21 7.47466V17.4747C21 18.064 20.7659 18.6293 20.3491 19.046C19.9324 19.4628 19.3671 19.6969 18.7778 19.6969Z" stroke="white" strokeWidth="1.2"/>
                  <path d="M16 13.0302C15.8527 13.0302 15.7114 12.9717 15.6072 12.8675C15.503 12.7633 15.4445 12.622 15.4445 12.4747C15.4445 12.3273 15.503 12.186 15.6072 12.0818C15.7114 11.9776 15.8527 11.9191 16 11.9191C16.1474 11.9191 16.2887 11.9776 16.3929 12.0818C16.497 12.186 16.5556 12.3273 16.5556 12.4747C16.5556 12.622 16.497 12.7633 16.3929 12.8675C16.2887 12.9717 16.1474 13.0302 16 13.0302Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.6667 5.25243V3.70021C17.6666 3.35966 17.5882 3.02368 17.4376 2.71823C17.287 2.41278 17.0683 2.14602 16.7982 1.93856C16.5281 1.7311 16.214 1.58848 15.8801 1.52172C15.5461 1.45496 15.2013 1.46585 14.8722 1.55354L2.65 4.81243C2.17673 4.93855 1.75838 5.2175 1.45999 5.60591C1.1616 5.99431 0.999891 6.47042 1 6.96021V7.47466" stroke="white" strokeWidth="1.2"/>
                </svg>
                Connect Wallet
              </button>
              ) : (
                <button
                  className={`flex flex-row items-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[39px] border border-primary text-white bg-primary hover:border-blue-700 hover:bg-blue-700`}
                >
                <svg width="22" height="21" viewBox="0 0 22 21" className='mr-2' fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.7778 19.6969H3.22222C2.63285 19.6969 2.06762 19.4628 1.65087 19.046C1.23413 18.6293 1 18.064 1 17.4747V7.47466C1 6.88529 1.23413 6.32006 1.65087 5.90332C2.06762 5.48657 2.63285 5.25244 3.22222 5.25244H18.7778C19.3671 5.25244 19.9324 5.48657 20.3491 5.90332C20.7659 6.32006 21 6.88529 21 7.47466V17.4747C21 18.064 20.7659 18.6293 20.3491 19.046C19.9324 19.4628 19.3671 19.6969 18.7778 19.6969Z" stroke="white" strokeWidth="1.2"/>
                  <path d="M16 13.0302C15.8527 13.0302 15.7114 12.9717 15.6072 12.8675C15.503 12.7633 15.4445 12.622 15.4445 12.4747C15.4445 12.3273 15.503 12.186 15.6072 12.0818C15.7114 11.9776 15.8527 11.9191 16 11.9191C16.1474 11.9191 16.2887 11.9776 16.3929 12.0818C16.497 12.186 16.5556 12.3273 16.5556 12.4747C16.5556 12.622 16.497 12.7633 16.3929 12.8675C16.2887 12.9717 16.1474 13.0302 16 13.0302Z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.6667 5.25243V3.70021C17.6666 3.35966 17.5882 3.02368 17.4376 2.71823C17.287 2.41278 17.0683 2.14602 16.7982 1.93856C16.5281 1.7311 16.214 1.58848 15.8801 1.52172C15.5461 1.45496 15.2013 1.46585 14.8722 1.55354L2.65 4.81243C2.17673 4.93855 1.75838 5.2175 1.45999 5.60591C1.1616 5.99431 0.999891 6.47042 1 6.96021V7.47466" stroke="white" strokeWidth="1.2"/>
                </svg>
                {account.slice(0, 9)}...
              </button>
              )}
            </div>
          </div>
        </div>
      </section>
    );
}
