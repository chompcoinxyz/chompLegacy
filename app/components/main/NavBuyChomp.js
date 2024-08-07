'use client'
import React from 'react';
import ArrowDown from '../elems/ArrowDown';

export default function NavBuyChomp({ setIsDropdownOpen, isDropdownOpen, setSwapModal, isMobile=false }) {

  return (
    <div className="relative md:h-[150px] mt-[7px] mr-4"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
          <button className={`${!isMobile ? 'text-white' : 'text-slate-500 '} text-[18px] font-semibold px-4 py-2 focus:outline-none focus:shadow-outline flex flex-row items-center`}>
            Buy CHOMP <span className="ml-1"><ArrowDown/></span>
          </button>
        {isDropdownOpen || isMobile ? (
          <div className={`${!isMobile ? 'absolute shadow-lg' : 'relative ml-4 mb-4'} mt-1 w-full rounded-md  bg-white`}>
              <div className="py-1">
                  <a href="https://app.uniswap.org/swap?outputCurrency=0xebff2db643cf955247339c8c6bcd8406308ca437&chain=base" className="text-[18px] block px-4 py-2 font-medium text-black hover:bg-gray-100" target="_blank" rel="noopener noreferrer">Uniswap</a>
              </div>
              <div className="py-1">
                  <span 
                    onClick={() => setSwapModal(true)}
                    className='text-[18px] block px-4 py-2 font-medium cursor-pointer text-black hover:bg-gray-100'
                  >
                    Base Swap
                  </span>
              </div>
          </div>
        ) : null}
    </div>
  );
}