'use client'
import React, { useRef, useEffect } from 'react';
import Swap from './SwapComponent';

export default function SwapModal({ setSwapModal, address }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSwapModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSwapModal]);

  return (
    <div className="swap__modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100000]">
      <div ref={modalRef} className="swap__body bg-[#F9FAFB] w- p-6 rounded-lg relative z-[1000000]">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setSwapModal(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </button>
        <Swap address={address} />
      </div>
    </div>
  );
}