import React from 'react';

export default function LegacyTabs({ activeTab, setActiveTab }) {
  const items = [
    { label: 'All legacy', styles: '' },
    { label: 'My legacy', styles: 'pl-6'},
  ]
  return (
    <div className="w-[300px] flex flex-row items-center mx-auto underline underline-offset-8 decoration-2 decoration-slate-400">
      {items.map((item, index) => (
        <div 
          key={index} 
          className={`${index+1 === activeTab ? `text-primary underline underline-offset-8 decoration-2` : 'text-white hover:text-primary  '} ${item.styles} font-amiger uppercase text-[27px] cursor-pointer`}
          onClick={() => setActiveTab(index+1)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}