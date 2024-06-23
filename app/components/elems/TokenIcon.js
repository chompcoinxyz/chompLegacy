import React from 'react';
import Image from 'next/image';

export default function TokenIcon({}) {
  const ChompIcon = '/img/chomp_icon.svg';
  return (
    <div className="flex flex-row items-center">
      <Image 
        src={ChompIcon}
        alt="Icon" 
        width="37" height="37"
      />
      <p className="w-[70px] text-[19px] font-medium text-white ml-[6px]">CHOMP</p>
    </div>
  );
}
