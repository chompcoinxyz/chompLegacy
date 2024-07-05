import React from 'react';

export default function Alert({ message, onClose, url }) {
  return (
    <div 
      style={{
        width: '400px',
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        padding: '20px 30px',
        zIndex: 2000,
        border: '1px solid transparent',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
      }}
      className='rounded-xl'
    >
      <p className='text-[17px] pb-4'>{message}</p>
      <div className="flex flex-row items-center">
        <button onClick={onClose} className='w-1/3 flex flex-row items-center justify-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[11px] border border-slate-300 text-black opacity-99 bg-slate-300 mr-2 hover:opacity-80'>Close</button>
        <a href={url} className='w-2/3 flex flex-row items-center justify-center py-[12px] px-[25px] text-[17px] leading-[27px] rounded-[11px] border border-primary text-black opacity-99 bg-primary hover:opacity-80' target="_blank" rel="noopener noreferrer">Check transaction</a>
      </div>
    </div>
  );
}
