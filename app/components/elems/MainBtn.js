import React from 'react';

export default function MainBtn({ onClick, disabled, text, disabledStyles }) {
    return (
      <button 
        onClick={onClick} 
        disabled={disabled} 
        className={`w-full h-[45px] text-[17px] flex flex-row items-center justify-center font-bold px-6 text-white rounded-[10px] uppercase ${disabledStyles}`}
      >
        {text}
      </button> 
    );
}
