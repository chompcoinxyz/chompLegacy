import React from 'react';
import Image from 'next/image';

export default function TokenIcon({}) {
  const ChompIcon = '/img/chomp_icon.svg';
  return (
    <span className="flex flex-row items-center">
      <Image 
        src={ChompIcon}
        alt="Icon" 
        width="37" height="37"
      />
      <span className="w-[70px] text-[19px] font-medium text-white ml-[6px]">CHOMP</span>
    </span>
  );
}
