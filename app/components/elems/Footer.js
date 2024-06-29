import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="footer mt-[45px]">
      <div className="text-center">
        <a href="https://ChompCoin.xyz" className="text-[18px] text-white hover:text-primary" target="_blank" rel="noopener noreferrer">ChompCoin.xyz</a>
        <p className="text-[18px] text-white pt-2">© {currentYear}</p>
      </div>
    </div>
  );
}
