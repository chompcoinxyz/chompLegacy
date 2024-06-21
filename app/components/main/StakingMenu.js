import React from 'react';

export default function StakingMenu({ activeTab, setActiveTab }) {
  const items = [
    { label: 'Mint', styles: '' },
    { label: 'Stake', styles: 'mx-4 md:mx-0'},
    { label: 'Withdraw', styles: ''},
  ]
  return (
    <div className="flex flex-row items-center justify-between mx-[50px]">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`${index+1 === activeTab ? `text-primary underline font-bold underline-offset-8 decoration-2` : 'text-black hover:text-primary'} ${item.styles} uppercase text-[15px] cursor-pointer`}
          onClick={() => setActiveTab(index+1)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
